import type { Intencao } from "../../../content/assistente";
import { palavrasDeNao, palavrasDeSim, type Intencao as IntencaoId } from "../../../content/assistente";
import { assistente as t, tr, type Tratamento } from "../../../content/textos/assistente";
import { categorias, saber, topicoPorId, topicos, variacoes, type Topico } from "../../../content/textos/assistenteSaber";
import { guias } from "../../../content/textos/assistenteGuias";
import { negocios } from "../../../content/textos/negocios";
import { site } from "../../../content/site";
import { brl } from "../formato";
import { passoDoGuia } from "../guia";
import { emailjsConfigurado } from "../emailjs";
import { calcularCarrinho, linkWhatsappCarrinho, type Respostas } from "../orcamento";
import { linkEmailPedido, linkWhatsappPedido, montarPedido, resumoPrecoItem, totalCurto } from "../pedido";
import { validarTelefone } from "../telefone";
import { buscarFaq, catalogo, contatos, faqPorTitulo, mensalidadeBase, regrasGerais, servicoDoCatalogo, type Faq, type InfoServico } from "./conhecimento";
import { limitar, tentaBurlarRegras } from "./guardrails";
import { casamentosDe, conceitosPontuados, intencaoDe, PREFIXO_TOPICO, semTrecho, servicosCitados, tratamentoDe } from "./intencao";
import { chave, palavras, radical, radicaisUteis } from "./normalizar";
import {
  aplicarOpcao,
  concluirMultipla,
  iniciarOrcamento,
  opcaoPorTexto,
  proximoPasso,
  voltarUma,
  type EstadoOrcamento,
  type Passo,
} from "./orcamentoConversa";
import { combinar, variar, volta } from "./variar";

// Motor do Assistente Cyl: decide o que responder SEM modelo de linguagem. Tudo que tem número (preço, prazo, desconto) sai
// de conhecimento.ts, que lê servicos.ts e orcamento.ts. Um modelo, se houver, só reescreve o texto daqui (ver validarSaida).
//
// Toda resposta de assunto segue a mesma forma: resposta direta, explicação curta em linguagem de leigo, dica ou próximo
// passo e uma pergunta de continuação (os blocos "dica" e "pergunta").

// Tipos --------------------------------------------------------------------------------------------------------------------

export type Bloco =
  | { tipo: "p"; texto: string }
  | { tipo: "titulo"; texto: string }
  | { tipo: "lista"; itens: string[] }
  | { tipo: "dica"; texto: string }
  | { tipo: "pergunta"; texto: string };

/** O que o chat mostra antes de cada resposta, com os três pontinhos. */
export type Estado = "digitando" | "pensando" | "pesquisando" | "montando";

export type ParaServico = "detalhes" | "orcar" | "preco" | "prazo";

export type Cmd =
  | { t: "sobre"; id: string; para: ParaServico }
  | { t: "opcao"; p: string; o: string }
  | { t: "pronto"; p: string }
  | { t: "voltar" }
  | { t: "cancelar" }
  | { t: "oque"; p: string }
  | { t: "guia"; o: string }
  | { t: "topico"; id: string; modo?: "mais" | "exemplo" }
  | { t: "categoria"; id: string }
  | { t: "menu" }
  // Enviar o pedido pela conversa: pedir os dados, conferir, confirmar e, depois que o painel tentou o envio, o resultado.
  | { t: "enviar"; sob?: boolean }
  | { t: "confirmar" }
  | { t: "corrigir" }
  | { t: "envio"; ok: boolean };

export type Entrada = { texto: string } | { cmd: Cmd };

export type Chip = { rotulo: string; entrada: Entrada; marcado?: boolean };

export type Acao =
  | { tipo: "link"; rotulo: string; href: string; externo?: boolean }
  | { tipo: "carrinho"; rotulo: string; servicoId: string; respostas: Respostas }
  | { tipo: "servico"; rotulo: string; servicoId: string; aba: "detalhes" | "orcamento" };

export type Resposta = {
  blocos: Bloco[];
  chips: Chip[];
  acoes: Acao[];
  multipla?: boolean;
  estado?: Estado;
  /** Não receber a abertura e a ponte de variação (respostas que já têm o próprio tom, como recusas e confirmações). */
  fixa?: boolean;
  /** O que o assistente acabou de oferecer: um "sim" do visitante faz exatamente isto (ver `respostaCurta`). */
  proposta?: Entrada;
  /** Pedido confirmado: quem exibe a conversa faz o envio (EmailJS) e devolve o resultado com `{ t: "envio", ok }`. */
  paraEnviar?: DadosParaEnviar;
};

export type DadosParaEnviar = { ids: string[]; respostas: Record<string, Respostas>; observacoes: string; nome: string; whatsapp: string };

/** Pedido sendo enviado pela conversa: nome, WhatsApp, conferência e envio. */
export type EnvioPedido = {
  etapa: "nome" | "whatsapp" | "confirmar" | "enviando";
  ids: string[];
  respostas: Record<string, Respostas>;
  observacoes: string;
  nome: string;
  whatsapp: string;
};

export type Conversa = {
  orc: EstadoOrcamento | null;
  /** Escolhas do guia "não sei qual escolher" (null fora dele). */
  guia: string[] | null;
  ultimoServico: string | null;
  /** "o senhor" ou "a senhora", só quando a pessoa deixou claro; senão null (formas neutras). */
  tratamento: Tratamento;
  // Memória curta: o que dá para retomar em "sim", "explica melhor", "me dá um exemplo" e "e o painel?". Some com a conversa.
  /** Quantas respostas já foram dadas (alterna a versão dos textos, ver `variar`). */
  turno: number;
  /** Tópico do saber geral que acabou de ser explicado. */
  ultimoTopico: string | null;
  /** Ao que a última pergunta do assistente se referia: um "sim" executa isto. */
  proposta: Entrada | null;
  /** Última intenção de serviço (preço, prazo...), para "e o painel?" repetir a pergunta com outro serviço. */
  ultimaIntencao: IntencaoId | null;
  /** O que a última pergunta do assistente esperava ("para qual serviço?"): a mensagem seguinte é a resposta. */
  aguarda: "servico" | null;
  /** Serviços citados há pouco ("planilha e depois um painel"): valem para "pros dois" e para "quero orçar". */
  falados: string[];
  /** Orçamento de vários serviços: os que faltam e as respostas dos que já terminaram. */
  fila: string[];
  feitos: Record<string, Respostas>;
  /** Envio do pedido pela conversa (null fora dele). */
  envio: EnvioPedido | null;
  /** O que a pessoa contou de um projeto sob medida, para ir junto no pedido. */
  descricao: string;
};

export const conversaNova = (): Conversa => ({
  orc: null,
  guia: null,
  ultimoServico: null,
  tratamento: null,
  turno: 0,
  ultimoTopico: null,
  proposta: null,
  ultimaIntencao: null,
  aguarda: null,
  falados: [],
  fila: [],
  feitos: {},
  envio: null,
  descricao: "",
});

export type Resultado = { conversa: Conversa; resposta: Resposta };

/** O texto corrido da resposta, sem formatação (para teste e para o leitor de tela do histórico). */
export function textoPlano(r: Resposta): string {
  return r.blocos.map((b) => (b.tipo === "lista" ? b.itens.join("\n") : b.texto)).join("\n");
}

// Construtores --------------------------------------------------------------------------------------------------------------

const p = (texto: string): Bloco => ({ tipo: "p", texto });
const titulo = (texto: string): Bloco => ({ tipo: "titulo", texto });
const lista = (itens: string[]): Bloco => ({ tipo: "lista", itens });
const dica = (texto: string): Bloco => ({ tipo: "dica", texto });
const pergunta = (texto: string): Bloco => ({ tipo: "pergunta", texto });
const resp = (blocos: Bloco[], chips: Chip[] = [], acoes: Acao[] = [], estado?: Estado): Resposta => ({ blocos, chips, acoes, estado });
const dito = (texto: string): Chip => ({ rotulo: texto, entrada: { texto } });
const sobre = (rotulo: string, id: string, para: ParaServico): Chip => ({ rotulo, entrada: { cmd: { t: "sobre", id, para } } });

/** Marca o que um "sim" faz depois desta resposta. */
const fixa = (r: Resposta): Resposta => ({ ...r, fixa: true });
const ofertar = (r: Resposta, proposta: Entrada | undefined): Resposta => ({ ...r, proposta });

const link = (rotulo: string, href: string): Acao => ({ tipo: "link", rotulo, href });
const linkWhats = (): Acao => ({ tipo: "link", rotulo: t.acoes.whatsapp, href: contatos().whatsappLink, externo: true });
const linkFormulario = (): Acao => ({ tipo: "link", rotulo: t.acoes.formulario, href: "#orcamento" });
const saidaSemCerteza = (): Acao[] => [linkFormulario(), linkWhats()];
/** Quando o assunto é jurídico, o caminho são as páginas escritas, e não uma opinião do assistente. */
const linksJuridicos = (): Acao[] => [link(t.acoes.termos, "/termos/"), link(t.acoes.privacidade, "/privacidade/")];

const chipsInicio = (): Chip[] => [
  dito(t.chips.comoFunciona),
  dito(t.chips.preco),
  dito(t.chips.pagamento),
  dito(t.chips.confianca),
  dito(t.chips.orcar),
  dito(t.chips.servicos),
];
const chipsNegocio = (): Chip[] => [dito(t.chips.comercio), dito(t.chips.liberal), dito(t.chips.gestao)];

const infos = (ids: string[]): InfoServico[] => ids.map((id) => servicoDoCatalogo(id)).filter((s): s is InfoServico => !!s);

const chipsServicos = (para: ParaServico, ids: string[] = catalogo().map((s) => s.id)): Chip[] =>
  infos(ids).map((s) => sobre(t.chips.escolherServico(s.nome), s.id, para));

// Respostas por assunto ------------------------------------------------------------------------------------------------------

export function boasVindas(): Resposta {
  return fixa(resp([p(t.boasVindas), pergunta(t.boasVindasPergunta)], chipsInicio(), [], "digitando"));
}

/** Responde ao cumprimento com o mesmo cumprimento ("Bom dia!"), sem repetir a apresentação nem avisos de limite. */
function saudar(texto: string, turno: number): Resposta {
  const c = chave(texto);
  const cumprimento = c.includes("bom dia") ? "Bom dia" : c.includes("boa tarde") ? "Boa tarde" : c.includes("boa noite") ? "Boa noite" : "Oi";
  return fixa(resp([p(`${cumprimento}! ${variar(saber.saudacoes, turno)}`), pergunta(t.saudacaoPergunta)], chipsInicio(), [], "digitando"));
}

function listaServicos(): Resposta {
  const itens = catalogo().map((s) => t.servicoLinha(s.nome, s.precoTexto));
  return resp(
    [p(t.servicosIntro), lista(itens), p(t.servicosExplica), dica(t.servicosDica), pergunta(t.servicosPergunta)],
    chipsServicos("detalhes"),
    [],
    "pesquisando",
  );
}

function detalhesServico(s: InfoServico): Resposta {
  const blocos: Bloco[] = [p(t.inclusoServico(s.nome, s.resultado)), p(t.inclusoLista), lista(s.inclui)];
  if (s.nota) blocos.push(p(s.nota));
  const ex = guias.servicos[s.id];
  if (ex) blocos.push(p(`${guias.explicarServico.exemploRotulo} ${ex.exemplo}`));
  blocos.push(pergunta(t.inclusoPergunta));
  return resp(
    blocos,
    [sobre(t.chips.orcarServico(s.nome), s.id, "orcar"), sobre(t.chips.preco, s.id, "preco"), sobre(t.chips.prazo, s.id, "prazo")],
    [{ tipo: "servico", rotulo: t.acoes.detalhes, servicoId: s.id, aba: "detalhes" }],
    "pesquisando",
  );
}

function precoDe(ids: string[]): Resposta {
  const g = regrasGerais();
  const servicos = ids.length > 0 ? infos(ids) : catalogo();
  const blocos: Bloco[] =
    servicos.length === 1
      ? [p(t.precoServico(servicos[0].nome, servicos[0].precoTexto))]
      : [p(t.precoGeralIntro), lista(servicos.map((s) => t.servicoLinha(s.nome, s.precoTexto)))];
  blocos.push(p(t.precoHora(g.horaExtra)), p(t.precoNota), dica(t.precoDica(g.combo2)), pergunta(t.precoPergunta));
  const chips = servicos.length === 1 ? [sobre(t.chips.orcarServico(servicos[0].nome), servicos[0].id, "orcar"), dito(t.chips.desconto)] : [dito(t.chips.orcar), dito(t.chips.desconto)];
  return resp(blocos, chips, [], "pesquisando");
}

function prazoDe(ids: string[]): Resposta {
  const servicos = ids.length > 0 ? infos(ids) : catalogo();
  if (servicos.length === 1) {
    const s = servicos[0];
    const blocos = s.prazoACombinar
      ? [p(`${s.nome}. ${t.prazoCombinar}`)]
      : [p(t.prazoServico(s.nome, s.prazoTexto)), p(t.prazoNota), p(t.prazoAtraso)];
    blocos.push(pergunta(t.prazoPergunta));
    return resp(blocos, [sobre(t.chips.orcarServico(s.nome), s.id, "orcar"), dito(t.chips.pagamento)], [], "pesquisando");
  }
  return resp(
    [p(t.prazoGeralIntro), lista(servicos.map((s) => t.prazoLinha(s.nome, s.prazoTexto))), p(t.prazoNota), p(t.prazoAtraso), pergunta(t.prazoPergunta)],
    [dito(t.chips.orcar), dito(t.chips.pagamento)],
    [],
    "pesquisando",
  );
}

function descontos(): Resposta {
  const g = regrasGerais();
  const blocos: Bloco[] = [p(t.descontoCombo(g.combo2, g.combo3, g.combinaveis.join(", ")))];
  if (g.piloto) blocos.push(p(t.descontoPiloto(g.piloto.percentual, g.piloto.restam)));
  blocos.push(p(t.descontoNota), dica(t.descontoDica), pergunta(t.descontoPergunta));
  return resp(blocos, [dito(t.chips.orcar), dito(t.chips.preco)], [], "pesquisando");
}

function deFaq(itens: Faq[], opcoes: { prefixo?: string; juridico?: boolean } = {}): Resposta {
  const blocos: Bloco[] = [p(opcoes.prefixo ?? t.faqPrefixo)];
  const acoes: Acao[] = [];
  for (const f of itens) {
    blocos.push(titulo(f.pergunta), ...f.paragrafos.map(p));
    for (const l of f.links) {
      if (!acoes.some((a) => a.tipo === "link" && a.href === l.href)) acoes.push({ tipo: "link", rotulo: l.rotulo, href: l.href });
    }
  }
  if (opcoes.juridico) {
    blocos.push(dica(t.juridico));
    for (const a of linksJuridicos()) if (a.tipo === "link" && !acoes.some((x) => x.tipo === "link" && x.href === a.href)) acoes.push(a);
  }
  blocos.push(pergunta(t.faqPergunta));
  return resp(blocos, [dito(t.chips.orcar), dito(t.chips.pagamento)], acoes.slice(0, opcoes.juridico ? 4 : 3), "pesquisando");
}

const faqsPorTitulo = (...inicios: string[]) => inicios.map(faqPorTitulo).filter((f): f is Faq => !!f);

function contato(): Resposta {
  return resp([p(t.contato), p(t.contatoNota), p(t.tempoResposta), pergunta(t.contatoPergunta)], [], [
    linkWhats(),
    { tipo: "link", rotulo: t.acoes.email, href: contatos().emailLink, externo: true },
    linkFormulario(),
  ]);
}

function quem(): Resposta {
  return resp(
    [p(t.quemIntro), p(negocios.apresentacao.texto), pergunta(t.quemPergunta)],
    [dito(t.chips.confianca), dito(t.chips.comoFunciona)],
    [{ tipo: "link", rotulo: t.acoes.sobre, href: "#sobre" }],
    "pesquisando",
  );
}

const maior = (): Resposta => resp([p(t.maior), p(t.tempoResposta)], [], saidaSemCerteza(), "pensando");
const semBase = (): Resposta => resp([p(t.semBase), p(t.tempoResposta)], [dito(t.chips.servicos)], saidaSemCerteza(), "pensando");
const ajuda = (): Resposta => resp([p(t.ajuda), lista([...t.ajudaLista]), p(t.ajudaFim), pergunta(t.boasVindasPergunta)], chipsInicio(), [], "digitando");

// Guias (a mesma forma: direta, explicação, dica, pergunta) ---------------------------------------------------------------------

function guiaComoFunciona(g: Tratamento): Resposta {
  const x = guias.comoFunciona;
  return resp(
    [p(x.direta(g)), p(x.intro(g)), lista([...x.passos]), p(x.explica), dica(x.dica), pergunta(x.pergunta(g))],
    [dito(t.chips.preparar), dito(t.chips.pagamento), dito(t.chips.orcar)],
    [{ tipo: "link", rotulo: t.acoes.termos, href: "/termos/" }],
    "pesquisando",
  );
}

function guiaPreparar(g: Tratamento): Resposta {
  const x = guias.preparar;
  return resp(
    [p(x.direta(g)), p(x.intro), lista([...x.itens]), p(x.explica), dica(x.dica), pergunta(x.pergunta(g))],
    chipsNegocio(),
    [],
    "pesquisando",
  );
}

function guiaPagamento(g: Tratamento): Resposta {
  const x = guias.pagamento;
  const blocos: Bloco[] = [p(x.direta), p(x.explica(g)), p(x.comprovante[site.prestador.comprovante]), p(x.extra), dica(x.dica), pergunta(x.pergunta)];
  return resp(
    blocos,
    [dito(t.chips.receber), dito(t.chips.desconto), dito(t.chips.orcar)],
    [link(t.acoes.termosPagamento, "/termos/#pagamento")],
    "pesquisando",
  );
}

function guiaReceber(g: Tratamento): Resposta {
  const x = guias.receber;
  return resp(
    [p(x.direta(g)), ...x.explica.map(p), dica(x.dica), pergunta(x.pergunta)],
    [dito(t.chips.depois), dito(t.chips.confianca), dito(t.chips.orcar)],
    [link(t.acoes.termos, "/termos/")],
    "pesquisando",
  );
}

function guiaConfianca(): Resposta {
  const x = guias.confianca;
  const { documento, cidadeUf } = site.prestador;
  const itens: string[] = [
    x.prestador(site.nomeCompleto, cidadeUf, documento ? `${documento.tipo} ${documento.numero}` : null),
    x.formacao,
  ];
  if (site.mostrarMinisterio) itens.push(x.estagio);
  if (site.mostrarUniser) itens.push(x.uniser);
  return resp(
    [p(x.direta), lista(itens), p(x.combinado), p(x.diferenciais), p(x.portfolio), dica(x.dica), pergunta(x.pergunta)],
    [dito(t.chips.comoFunciona), dito(t.chips.exemplos), dito(t.chips.orcar)],
    [{ tipo: "link", rotulo: t.acoes.sobre, href: "#sobre" }, link(t.acoes.termos, "/termos/")],
    "pesquisando",
  );
}

/** Depois da entrega: revisão, garantia, ajustes, arquivo e (para bots) a mensalidade com valor-base. */
function guiaDepois(): Resposta {
  const x = guias.depois;
  // Os dias da garantia saem do texto publicado nas perguntas frequentes (e nos Termos), e não de um número escrito aqui.
  const dias = faqPorTitulo("e se aparecer um defeito")?.paragrafos[0].match(/(\d+) dias/)?.[1];
  const itens: string[] = [x.revisao];
  if (dias) itens.push(x.defeito(dias));
  itens.push(x.ajuste(regrasGerais().horaExtra), x.arquivo);
  const blocos: Bloco[] = [p(x.direta), p(x.intro), lista(itens)];
  const m = mensalidadeBase();
  if (m) blocos.push(titulo(x.botsTitulo), p(x.bots(m.percentual, m.nome, m.criacao, m.mensal)));
  blocos.push(dica(x.dica), pergunta(x.pergunta));
  return resp(
    blocos,
    [dito(t.chips.bots), dito(t.chips.whatsapp), dito(t.chips.orcar)],
    [link(t.acoes.termosGarantia, "/termos/#garantia")],
    "pesquisando",
  );
}

function guiaPublico(g: Tratamento): Resposta {
  const x = guias.publico;
  return resp([p(x.direta), p(x.explica(g)), p(x.grandes), pergunta(x.pergunta(g))], chipsNegocio(), [], "pensando");
}

function guiaEmpresaGrande(): Resposta {
  const x = guias.empresaGrande;
  return resp([p(x.direta), p(x.explica), dica(x.dica), p(t.tempoResposta), pergunta(x.pergunta)], [dito(t.chips.servicos), dito(t.chips.indicar)], saidaSemCerteza(), "pensando");
}

type TipoNegocio = "comercio" | "liberal" | "gestao";

function guiaNegocio(tipo: TipoNegocio): Resposta {
  const x = guias.negocio[tipo];
  const servicos = infos([...x.servicos]);
  return resp(
    [
      p(x.direta),
      p(x.porque),
      lista(servicos.map((s) => t.servicoLinha(s.nome, s.precoTexto))),
      dica(guias.negocio.dica),
      pergunta(guias.negocio.pergunta),
    ],
    [...servicos.map((s) => sobre(t.chips.detalhes(s.nome), s.id, "detalhes")), dito(t.chips.indicar)],
    [],
    "pensando",
  );
}

function guiaExemplos(): Resposta {
  const x = guias.exemplos;
  const itens = catalogo()
    .filter((s) => guias.servicos[s.id])
    .map((s) => `${s.nome}: ${guias.servicos[s.id].exemplo}`);
  return resp(
    [p(x.direta), lista(itens), dica(x.dica), pergunta(x.pergunta)],
    [dito(t.chips.preco), dito(t.chips.orcar), dito(t.chips.indicar)],
    [link(t.acoes.exemplo, "#exemplo")],
    "pesquisando",
  );
}

/** "Não entendi nada, o que é isso?": explica o serviço em linguagem simples, dá um exemplo do dia a dia e pergunta o negócio. */
function explicarServico(id: string, g: Tratamento, cumprimentou: boolean): Resposta {
  const s = servicoDoCatalogo(id);
  const ex = guias.servicos[id];
  if (!s || !ex) return explicarGeral(g, cumprimentou);
  const x = guias.explicarServico;
  const abertura = cumprimentou ? `${t.saudacaoLeve} ${x.abertura.replace(" 😊", "")}.` : x.abertura;
  return resp(
    [p(abertura), p(ex.simples), p(`${x.exemploRotulo} ${ex.exemplo}`), pergunta(x.pergunta(g))],
    [dito(t.chips.exemplos), dito(t.chips.preco), dito(t.chips.orcar), ...chipsNegocio()],
    [],
    "pensando",
  );
}

function explicarGeral(g: Tratamento, cumprimentou: boolean): Resposta {
  const x = guias.explicarGeral;
  const abertura = cumprimentou ? `${t.saudacaoLeve} ${guias.explicarServico.abertura.replace(" 😊", "")}.` : guias.explicarServico.abertura;
  return resp(
    [p(abertura), p(x.simples), p(`${guias.explicarServico.exemploRotulo} ${x.exemplo}`), pergunta(x.pergunta(g))],
    [dito(t.chips.exemplos), dito(t.chips.preco), dito(t.chips.orcar), ...chipsNegocio()],
    [],
    "pensando",
  );
}

/**
 * Mensagem vaga ou confusa: nunca "não encontrei". Acolhe no mesmo clima, adivinha o assunto (pergunta frequente parecida,
 * se houver), explica em poucas linhas e oferece opções clicáveis.
 */
function acolher(texto: string, g: Tratamento): Resposta {
  const faq = buscarFaq(texto, 2);
  const blocos: Bloco[] = [p(t.acolhe)];
  const chips: Chip[] = [dito(t.chips.exemplos), dito(t.chips.preco), dito(t.chips.orcar), dito(t.chips.comoFunciona), dito(t.chips.indicar)];
  if (faq) {
    blocos.push(p(t.acolhePalpite), titulo(faq.pergunta), ...faq.paragrafos.map(p));
  } else {
    blocos.push(p(t.acolheExplica));
  }
  blocos.push(dica(t.acolheDica), pergunta(tr(g, "Qual destes caminhos combina mais com o que {S} procura?", "Qual destes caminhos combina mais com o que se procura?")));
  const acoes: Acao[] = [linkWhats()];
  return resp(blocos, chips, acoes, "pensando");
}


// Saber geral (Excel, planilhas, automação, sites, jeito de trabalhar) -------------------------------------------------------------
// Conteúdo curado em textos/assistenteSaber.ts. Todo tópico segue a mesma forma dos guias: resposta direta, explicação, dica,
// ponte para o serviço (com o preço de partida vindo de servicos.ts) e uma pergunta para seguir.

const chipTopico = (id: string, modo?: "mais" | "exemplo"): Chip | null => {
  const tp = topicoPorId(id);
  if (!tp) return null;
  return { rotulo: modo === "exemplo" ? saber.rotuloExemplo : modo === "mais" ? saber.rotuloMais : tp.rotulo, entrada: { cmd: { t: "topico", id, modo } } };
};
const semNulos = <T,>(lista: (T | null)[]): T[] => lista.filter((x): x is T => x !== null);
const chipMenu = (): Chip => ({ rotulo: saber.rotuloMenu, entrada: { cmd: { t: "menu" } } });

/** Chips de seguimento de um tópico: serviço, exemplo, aprofundar, assuntos parecidos e o menu. No máximo 6. */
function chipsDoTopico(top: Topico, outros: string[] = []): Chip[] {
  const chips: Chip[] = [];
  const s = top.servico ? servicoDoCatalogo(top.servico) : undefined;
  if (s) chips.push(sobre(saber.rotuloVerServico(s.nome), s.id, "detalhes"), sobre(t.chips.orcarServico(s.nome), s.id, "orcar"));
  for (const id of top.servicosChips ?? []) {
    const x = servicoDoCatalogo(id);
    if (x) chips.push(sobre(t.chips.orcarServico(x.nome), x.id, "orcar"));
  }
  if (top.exemplo) chips.push(...semNulos([chipTopico(top.id, "exemplo")]));
  if (top.aprofundar) chips.push(...semNulos([chipTopico(top.id, "mais")]));
  chips.push(...semNulos([...outros, ...(top.relacionados ?? [])].filter((id) => id !== top.id).slice(0, 2).map((id) => chipTopico(id))));
  chips.push(chipMenu());
  return chips.slice(0, 6);
}

/** O que um "sim" faz depois de um tópico: ver o serviço relacionado, ou seguir para o primeiro assunto parecido. */
function propostaDoTopico(top: Topico): Entrada | undefined {
  if (top.servico) return { cmd: { t: "sobre", id: top.servico, para: "detalhes" } };
  const rel = top.relacionados?.[0];
  return rel ? { cmd: { t: "topico", id: rel } } : undefined;
}

function respostaDeTopico(top: Topico, turno: number, outros: string[] = []): Resposta {
  const blocos: Bloco[] = [p(variar(top.direta, volta(turno, 32)))];
  const acoes: Acao[] = [];
  if (top.tempoResposta) blocos.push(p(t.tempoResposta));
  for (const x of top.explica) blocos.push(p(x));
  if (top.passos) blocos.push(lista([...top.passos]));
  for (const titulo_ of top.faqTitulo ?? []) {
    const f = faqPorTitulo(titulo_);
    if (!f) continue;
    blocos.push(titulo(f.pergunta), ...f.paragrafos.map(p));
    for (const l of f.links) if (!acoes.some((a) => a.tipo === "link" && a.href === l.href)) acoes.push({ tipo: "link", rotulo: l.rotulo, href: l.href });
  }
  if (top.dica) blocos.push(dica(top.dica));
  const s = top.servico ? servicoDoCatalogo(top.servico) : undefined;
  if (s) blocos.push(p(saber.ponte(s.nome, s.precoTexto)));
  blocos.push(pergunta(variar(s ? saber.perguntaComServico : saber.perguntas, volta(turno, 32), top.id.length)));
  return { ...resp(blocos, chipsDoTopico(top, outros), acoes.slice(0, 3), "pesquisando"), proposta: propostaDoTopico(top) };
}

/** "Explica melhor", "mais detalhes": aprofunda o último tópico; sem aprofundamento, usa o exemplo ou os passos. */
function respostaTopicoMais(top: Topico, turno: number): Resposta {
  const blocos: Bloco[] = [];
  if (top.aprofundar) blocos.push(...top.aprofundar.map(p));
  else if (top.exemplo) blocos.push(p(top.exemplo));
  else if (top.passos) blocos.push(p(saber.maisEmPassos), lista([...top.passos]));
  else blocos.push(p(saber.semMais));
  blocos.push(pergunta(variar(saber.perguntas, turno, 1)));
  return { ...resp(blocos, chipsDoTopico(top), [], "pensando"), proposta: propostaDoTopico(top) };
}

function respostaTopicoExemplo(top: Topico, turno: number): Resposta {
  const exServico = top.servico ? guias.servicos[top.servico]?.exemplo : undefined;
  const blocos: Bloco[] = [];
  if (top.exemplo) blocos.push(p(top.exemplo));
  else if (exServico) blocos.push(p(`${guias.explicarServico.exemploRotulo} ${exServico}`));
  else blocos.push(p(saber.semExemplo));
  blocos.push(pergunta(variar(saber.perguntas, turno, 2)));
  return { ...resp(blocos, chipsDoTopico(top), [], "pensando"), proposta: propostaDoTopico(top) };
}

function respostaMenu(): Resposta {
  return resp(
    [p(saber.menuIntro), lista(categorias.map((c) => `${c.rotulo}: ${c.intro}`)), pergunta(saber.menuPergunta)],
    categorias.map((c) => ({ rotulo: c.rotulo, entrada: { cmd: { t: "categoria", id: c.id } } as Entrada })),
    [],
    "pensando",
  );
}

function respostaCategoria(id: string): Resposta {
  const cat = categorias.find((c) => c.id === id);
  if (!cat) return respostaMenu();
  const chips = semNulos(topicos.filter((x) => x.categoria === id).map((x) => chipTopico(x.id)));
  return resp([p(saber.categoriaIntro(cat.rotulo)), pergunta(saber.categoriaPergunta)], [...chips, chipMenu()], [], "pesquisando");
}

/** Dúvida técnica (Excel, programação) que nenhum tópico cobre: franca sobre o limite e com caminhos para seguir. */
const semTopico = (): Resposta =>
  fixa(resp(
    [p(saber.semTopico), p(t.tempoResposta), pergunta(saber.semTopicoPergunta)],
    [...categorias.slice(0, 4).map((c) => ({ rotulo: c.rotulo, entrada: { cmd: { t: "categoria", id: c.id } } as Entrada })), chipMenu()],
    saidaSemCerteza(),
    "pensando",
  ));

const respostaPedeCodigo = (): Resposta =>
  fixa(resp(
    [p(saber.pedeCodigo), pergunta(saber.pedeCodigoPergunta)],
    [chipMenu(), dito(t.chips.servicos), dito(t.chips.indicar)],
    [],
    "pensando",
  ));

// Guia -------------------------------------------------------------------------------------------------------------------------

function respostaDoGuia(escolhas: string[]): { resposta: Resposta; fim: boolean } {
  const passo = passoDoGuia(escolhas);
  if (passo.pergunta) {
    const pergunta = passo.pergunta;
    const blocos: Bloco[] = escolhas.length === 0 ? [p(t.guiaIntro), { tipo: "pergunta", texto: pergunta.texto }] : [{ tipo: "pergunta", texto: pergunta.texto }];
    const chips: Chip[] = pergunta.opcoes.map((o) => ({ rotulo: o.rotulo, entrada: { cmd: { t: "guia", o: o.id } } }));
    return { fim: false, resposta: resp(blocos, chips, [], "pensando") };
  }
  const r = passo.resultado;
  const servicos = infos(r.servicos);
  const blocos: Bloco[] = [];
  const acoes: Acao[] = [];
  if (r.saida?.tipo === "whatsapp") {
    blocos.push(p(t.guiaConversar));
    acoes.push(linkWhats());
  } else if (r.saida?.tipo === "link") {
    blocos.push(p(t.guiaBot));
    acoes.push({ tipo: "link", rotulo: t.acoes.comunidade, href: r.saida.href });
  } else {
    blocos.push(p(t.guiaPorque(r.porque)));
  }
  if (servicos.length > 0) blocos.push(pergunta(t.inclusoPergunta));
  const chips = servicos.flatMap((s) => [sobre(t.chips.detalhes(s.nome), s.id, "detalhes"), sobre(t.chips.orcarServico(s.nome), s.id, "orcar")]);
  return { fim: true, resposta: resp(blocos, chips, acoes, "pensando") };
}

// Orçamento na conversa -----------------------------------------------------------------------------------------------------------

function respostaDoPasso(passo: Passo | null, e: EstadoOrcamento, feitos: Record<string, Respostas> = {}): Resposta {
  if (!passo) return semBase();
  const nome = servicoDoCatalogo(e.servicoId)?.nome ?? "";
  if (passo.tipo === "pergunta") {
    const { pergunta, numero, marcadas } = passo;
    const multipla = pergunta.tipo === "multipla";
    const blocos: Bloco[] = [p(t.orcarPergunta(numero, pergunta.texto))];
    if (multipla) {
      blocos.push(p(t.orcarMultipla));
      const rotulos = pergunta.opcoes.filter((o) => marcadas.includes(o.id)).map((o) => o.rotulo);
      if (rotulos.length > 0) blocos.push(p(t.orcarMarcadas(rotulos.join(", "))));
    }
    const chips: Chip[] = pergunta.opcoes.map((o) => ({
      rotulo: o.rotulo,
      entrada: { cmd: { t: "opcao", p: pergunta.id, o: o.id } },
      marcado: marcadas.includes(o.id),
    }));
    if (multipla) chips.push({ rotulo: t.chips.pronto, entrada: { cmd: { t: "pronto", p: pergunta.id } } });
    if (pergunta.ajuda) chips.push({ rotulo: t.chips.oQueE, entrada: { cmd: { t: "oque", p: pergunta.id } } });
    if (e.pilha.length > 0) chips.push({ rotulo: t.chips.voltar, entrada: { cmd: { t: "voltar" } } });
    chips.push({ rotulo: t.chips.cancelar, entrada: { cmd: { t: "cancelar" } } });
    return { ...resp(blocos, chips, [], "montando"), multipla };
  }

  // Vários serviços no mesmo pedido: uma linha por serviço, o desconto do combo (ou do piloto) e o total, tudo do carrinho do site.
  if (Object.keys(feitos).length > 0) return resumoDeVarios(e, feitos);

  // Resumo: o valor, o prazo e as linhas do cálculo, tudo de calcularServico (o mesmo do orçamento do site).
  const c = passo.calculo;
  const precoTexto = c.preco === null ? "sob consulta" : `${c.aPartirDe ? "a partir de " : c.estimativa ? "estimativa de " : ""}${brl(c.preco)}`;
  const blocos: Bloco[] = [p(t.orcarResumoTitulo(nome, precoTexto)), p(t.orcarPrazo(c.prazo))];
  if (c.linhas.length > 0) {
    blocos.push(
      p(t.orcarComoChegamos),
      lista(c.linhas.map((l, i) => t.orcarLinha(l.rotulo, i === 0 ? brl(l.valor) : `+ ${brl(l.valor)}`))),
    );
  }
  if (c.estimativa) blocos.push(p(t.orcarProvisorio));
  blocos.push(p(t.orcarEstimativaNota), p(envioAtivo() ? t.orcarProximoEnviar : t.orcarProximo));
  const carrinho = calcularCarrinho([e.servicoId], { [e.servicoId]: e.respostas });
  const acoes: Acao[] = [
    { tipo: "carrinho", rotulo: t.acoes.carrinho, servicoId: e.servicoId, respostas: e.respostas },
    { tipo: "link", rotulo: t.acoes.whatsapp, href: linkWhatsappCarrinho(carrinho, t.origemWhatsapp), externo: true },
  ];
  const chips: Chip[] = chipsDoResumo(e);
  return { ...resp(blocos, chips, acoes, "montando"), proposta: envioAtivo() ? { cmd: { t: "enviar" } } : undefined };
}

const envioAtivo = () => emailjsConfigurado();

function chipsDoResumo(e: EstadoOrcamento): Chip[] {
  const chips: Chip[] = [];
  if (envioAtivo()) chips.push({ rotulo: t.envioChips.enviar, entrada: { cmd: { t: "enviar" } } });
  if (e.pilha.length > 0) chips.push({ rotulo: t.chips.voltar, entrada: { cmd: { t: "voltar" } } });
  chips.push(dito(t.chips.recomecar));
  return chips;
}

function resumoDeVarios(e: EstadoOrcamento, feitos: Record<string, Respostas>): Resposta {
  const respostas = { ...feitos, [e.servicoId]: e.respostas };
  const pedido = montarPedido([...Object.keys(feitos), e.servicoId], respostas);
  const c = pedido.carrinho;
  const blocos: Bloco[] = [p(t.orcarResumoVarios(totalCurto(pedido))), lista(pedido.itens.map((i) => t.orcarLinha(i.nome, resumoPrecoItem(i))))];
  if (c.desconto) blocos.push(p(t.orcarSomaLinha(brl(c.somaTabela))), p(t.orcarDescontoLinha(c.desconto.rotulo, brl(c.desconto.valor))));
  if (c.prazoCombinaveis) blocos.push(p(t.orcarPrazo(c.prazoCombinaveis.texto)));
  for (const o of c.prazosOutros) blocos.push(p(t.orcarPrazo(`${o.nome}, ${o.texto}`)));
  blocos.push(p(t.orcarEstimativaNota), p(envioAtivo() ? t.orcarProximoEnviar : t.orcarProximo));
  const acoes: Acao[] = [{ tipo: "link", rotulo: t.acoes.whatsapp, href: linkWhatsappPedido(pedido, t.origemWhatsapp) ?? contatos().whatsappLink, externo: true }];
  return { ...resp(blocos, chipsDoResumo(e), acoes, "montando"), proposta: envioAtivo() ? { cmd: { t: "enviar" } } : undefined };
}

function comecarOrcamento(id: string, conversa: Conversa, intro?: string): Resultado {
  const estado = iniciarOrcamento(id);
  const s = servicoDoCatalogo(id);
  if (!estado || !s) return { conversa, resposta: semBase() };
  const r = respostaDoPasso(proximoPasso(estado), estado);
  return {
    conversa: { ...conversa, orc: estado, guia: null, ultimoServico: id, aguarda: null },
    resposta: { ...r, blocos: [p(intro ?? t.orcarComeco(s.nome)), ...r.blocos] },
  };
}

const nomeDoServico = (id: string) => servicoDoCatalogo(id)?.nome ?? id;

/** Começa o orçamento de um ou mais serviços; com vários, um de cada vez e um resumo só no fim, com o desconto do combo. */
function comecarFila(ids: string[], conversa: Conversa): Resultado {
  const orcaveis = [...new Set(ids)].filter((id) => iniciarOrcamento(id) && servicoDoCatalogo(id));
  if (orcaveis.length === 0) return { conversa, resposta: semBase() };
  const [primeiro, ...resto] = orcaveis;
  const intro = resto.length > 0 ? t.orcarVarios(orcaveis.map(nomeDoServico).join(" e ")) : undefined;
  return comecarOrcamento(primeiro, { ...conversa, fila: resto, feitos: {}, falados: orcaveis }, intro);
}

/** Depois de cada resposta: se o serviço acabou e ainda há outro na fila, segue para ele; senão mostra a pergunta ou o resumo. */
function seguir(conversa: Conversa, orc: EstadoOrcamento): Resultado {
  const passo = proximoPasso(orc);
  if (passo?.tipo === "resumo" && conversa.fila.length > 0) {
    const [proximo, ...resto] = conversa.fila;
    const novo = iniciarOrcamento(proximo);
    if (novo) {
      const r = respostaDoPasso(proximoPasso(novo), novo);
      return {
        conversa: { ...conversa, orc: novo, fila: resto, feitos: { ...conversa.feitos, [orc.servicoId]: orc.respostas }, ultimoServico: proximo },
        resposta: { ...r, blocos: [p(t.orcarProximoServico(nomeDoServico(orc.servicoId), nomeDoServico(proximo))), ...r.blocos] },
      };
    }
  }
  return { conversa: { ...conversa, orc }, resposta: respostaDoPasso(passo, orc, conversa.feitos) };
}

const perguntarQualServico = (turno = 0): Resposta => resp([pergunta(variar([t.orcarQual, ...saber.orcarQuais], turno))], [...chipsServicos("orcar"), dito(t.chips.indicar)], [], "montando");

/** Pergunta qual serviço e guarda que a próxima mensagem é a resposta ("um site", "pros dois"). */
const pedirServico = (conversa: Conversa, turno = 0): Resultado => ({
  conversa: { ...conversa, aguarda: "servico" },
  resposta: perguntarQualServico(turno),
});

// Enviar o pedido pela conversa ---------------------------------------------------------------------------------------------------------

const formatarWhatsapp = (digitos: string) => {
  const d = digitos.replace(/^55/, "");
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
};
const chipCancelarEnvio = (): Chip => ({ rotulo: t.envioChips.cancelar, entrada: { cmd: { t: "cancelar" } } });
const pedidoDoEnvio = (e: EnvioPedido) => montarPedido(e.ids, e.respostas, e.observacoes);

/** Projeto grande ou sob medida: não há estimativa, mas o pedido pode ir ao Marcelo daqui mesmo, com o que a pessoa contou. */
function sobMedida(conversa: Conversa, texto: string): Resultado {
  if (!envioAtivo()) return { conversa, resposta: maior() };
  const descricao = [conversa.descricao, texto.trim()].filter(Boolean).join(" ").slice(0, 600);
  const resposta = fixa(
    resp([p(t.envioSobMedida), pergunta(t.envioSobMedidaPergunta)], [{ rotulo: t.envioChips.enviar, entrada: { cmd: { t: "enviar", sob: true } } }, dito(t.chips.whatsapp)], saidaSemCerteza(), "pensando"),
  );
  return { conversa: { ...conversa, descricao }, resposta: ofertar(resposta, { cmd: { t: "enviar", sob: true } }) };
}

function iniciarEnvio(conversa: Conversa, sob: boolean): Resultado {
  if (!envioAtivo()) return { conversa, resposta: semBase() };
  let envio: EnvioPedido;
  if (sob && conversa.descricao) {
    envio = { etapa: "nome", ids: [], respostas: {}, observacoes: t.envioSobMedidaObs(conversa.descricao), nome: "", whatsapp: "" };
  } else if (conversa.orc) {
    const ids = [...Object.keys(conversa.feitos), conversa.orc.servicoId];
    envio = { etapa: "nome", ids, respostas: { ...conversa.feitos, [conversa.orc.servicoId]: conversa.orc.respostas }, observacoes: "", nome: "", whatsapp: "" };
  } else {
    return pedirServico(conversa, conversa.turno);
  }
  return { conversa: { ...conversa, envio, aguarda: null }, resposta: fixa(resp([pergunta(t.envioNome)], [chipCancelarEnvio()], [], "digitando")) };
}

function respostaDeConfirmar(e: EnvioPedido): Resposta {
  const pedido = pedidoDoEnvio(e);
  const blocos: Bloco[] = [p(t.envioConfirma(e.nome, formatarWhatsapp(e.whatsapp)))];
  if (pedido.itens.length > 0) blocos.push(lista(pedido.itens.map((i) => t.orcarLinha(i.nome, resumoPrecoItem(i)))));
  if (e.observacoes) blocos.push(p(e.observacoes));
  blocos.push(p(t.envioPrivacidade), p(t.envioAceite));
  const chips: Chip[] = [
    { rotulo: t.envioChips.confirmar, entrada: { cmd: { t: "confirmar" } } },
    { rotulo: t.envioChips.corrigir, entrada: { cmd: { t: "corrigir" } } },
    chipCancelarEnvio(),
  ];
  const acoes: Acao[] = [link(t.acoes.termos, "/termos/"), link(t.acoes.privacidade, "/privacidade/")];
  return { ...fixa(resp(blocos, chips, acoes, "digitando")), proposta: { cmd: { t: "confirmar" } } };
}

const PALAVRAS_CONFIRMAR = new Set(["confirmar", "confirmo", "confirma", "pode enviar", "enviar", "envia", "manda", "pode mandar", "esta certo", "ta certo", "certo", "isso"]);
const PALAVRAS_CORRIGIR = new Set(["corrigir", "corrige", "errado", "esta errado", "ta errado", "trocar", "mudar"]);

function textoNoEnvio(texto: string, conversa: Conversa): Resultado | null {
  const e = conversa.envio;
  if (!e) return null;
  const c = chave(texto);
  if (PALAVRAS_CANCELAR.has(c) || c === "nao" || c === "nao quero") return executar({ t: "cancelar" }, conversa);
  if (e.etapa === "enviando") return { conversa, resposta: fixa(resp([p(t.envioJaEnviando)], [], [], "digitando")) };
  if (e.etapa === "nome") {
    const nome = texto.trim().replace(/\s+/g, " ");
    if (nome.length < 2 || nome.length > 80 || /\d{4,}/.test(nome) || nome.includes("@")) {
      return { conversa, resposta: fixa(resp([p(t.envioNomeInvalido)], [chipCancelarEnvio()], [], "digitando")) };
    }
    return { conversa: { ...conversa, envio: { ...e, etapa: "whatsapp", nome } }, resposta: fixa(resp([pergunta(t.envioWhats(nome.split(" ")[0]))], [chipCancelarEnvio()], [], "digitando")) };
  }
  if (e.etapa === "whatsapp") {
    const v = validarTelefone(texto);
    if (!v.valido) return { conversa, resposta: fixa(resp([p(v.erro)], [chipCancelarEnvio()], [], "digitando")) };
    const novo: EnvioPedido = { ...e, etapa: "confirmar", whatsapp: v.digitos };
    return { conversa: { ...conversa, envio: novo }, resposta: respostaDeConfirmar(novo) };
  }
  // confirmar
  if (PALAVRAS_CONFIRMAR.has(c) || palavrasDeSim.includes(c)) return executar({ t: "confirmar" }, conversa);
  if (PALAVRAS_CORRIGIR.has(c) || palavrasDeNao.includes(c)) return executar({ t: "corrigir" }, conversa);
  return { conversa, resposta: respostaDeConfirmar(e) };
}

function respostaDoEnvio(ok: boolean, conversa: Conversa): Resultado {
  const e = conversa.envio;
  if (!e || e.etapa !== "enviando") return { conversa, resposta: fixa(resp([p(t.envioJaEnviando)], [], [], "digitando")) };
  if (ok) {
    const limpa: Conversa = { ...conversa, envio: null, orc: null, fila: [], feitos: {}, falados: [], descricao: "", aguarda: null };
    return { conversa: limpa, resposta: fixa(resp([p(t.envioOk), pergunta(t.envioOkPergunta)], chipsInicio(), [], "digitando")) };
  }
  const pedido = pedidoDoEnvio(e);
  const acoes: Acao[] = [];
  const whats = linkWhatsappPedido(pedido, t.origemWhatsapp);
  if (whats) acoes.push({ tipo: "link", rotulo: t.acoes.whatsapp, href: whats, externo: true });
  const email = linkEmailPedido(pedido, t.origemWhatsapp);
  if (email) acoes.push({ tipo: "link", rotulo: t.acoes.email, href: email });
  const volta: EnvioPedido = { ...e, etapa: "confirmar" };
  return {
    conversa: { ...conversa, envio: volta },
    resposta: fixa(resp([p(t.envioFalhou)], [{ rotulo: t.envioChips.confirmar, entrada: { cmd: { t: "confirmar" } } }, chipCancelarEnvio()], acoes, "digitando")),
  };
}

// Texto digitado durante um orçamento ---------------------------------------------------------------------------------------------------

const PALAVRAS_CANCELAR = new Set(["cancelar", "cancela", "parar", "sair", "esquece"]);
const PALAVRAS_VOLTAR = new Set(["voltar", "volta", "anterior", "desfazer"]);
const PALAVRAS_PRONTO = new Set(["pronto", "ok", "concluir", "terminei", "so isso", "nenhum", "nenhuma", "proximo", "proxima", "avancar", "continuar"]);

function textoNoOrcamento(texto: string, conversa: Conversa): Resultado | null {
  const orc = conversa.orc;
  if (!orc) return null;
  const c = chave(texto);
  if (PALAVRAS_CANCELAR.has(c)) return executar({ t: "cancelar" }, conversa);
  if (PALAVRAS_VOLTAR.has(c)) return executar({ t: "voltar" }, conversa);
  const passo = proximoPasso(orc);
  if (!passo || passo.tipo !== "pergunta") return null;
  const { pergunta } = passo;

  if (pergunta.tipo === "multipla") {
    if (PALAVRAS_PRONTO.has(c)) return executar({ t: "pronto", p: pergunta.id }, conversa);
    // "estoque e vendas": cada trecho pode marcar uma opção.
    let novo = orc;
    let achou = false;
    for (const trecho of texto.split(/[,;]|\be\b/i).map((x) => x.trim()).filter(Boolean)) {
      const op = opcaoPorTexto(pergunta, trecho);
      const marcadas = (novo.respostas[pergunta.id] as string[] | undefined) ?? [];
      if (op && !marcadas.includes(op.id)) {
        novo = aplicarOpcao(novo, pergunta.id, op.id);
        achou = true;
      }
    }
    return achou ? seguir(conversa, novo) : null;
  }

  const op = opcaoPorTexto(pergunta, texto);
  if (!op) return null;
  return seguir(conversa, aplicarOpcao(orc, pergunta.id, op.id));
}

// Comandos (toque em botão) -------------------------------------------------------------------------------------------------------------

function executar(cmd: Cmd, conversa: Conversa): Resultado {
  switch (cmd.t) {
    case "sobre": {
      const s = servicoDoCatalogo(cmd.id);
      if (!s) return { conversa, resposta: semBase() };
      const c: Conversa = {
        ...conversa,
        ultimoServico: s.id,
        ultimoTopico: null,
        ultimaIntencao: cmd.para === "detalhes" ? "incluso" : cmd.para === "orcar" ? "orcar" : cmd.para,
      };
      if (cmd.para === "orcar") return comecarOrcamento(s.id, c);
      if (cmd.para === "preco") return { conversa: c, resposta: precoDe([s.id]) };
      if (cmd.para === "prazo") return { conversa: c, resposta: prazoDe([s.id]) };
      return { conversa: c, resposta: ofertar(detalhesServico(s), { cmd: { t: "sobre", id: s.id, para: "orcar" } }) };
    }
    case "opcao": {
      if (!conversa.orc) return pedirServico(conversa);
      return seguir(conversa, aplicarOpcao(conversa.orc, cmd.p, cmd.o));
    }
    case "pronto": {
      if (!conversa.orc) return pedirServico(conversa);
      return seguir(conversa, concluirMultipla(conversa.orc, cmd.p));
    }
    case "voltar": {
      if (!conversa.orc) return { conversa, resposta: boasVindas() };
      return seguir(conversa, voltarUma(conversa.orc));
    }
    case "enviar":
      return iniciarEnvio(conversa, !!cmd.sob);
    case "corrigir": {
      if (!conversa.envio || conversa.envio.etapa === "enviando") return { conversa, resposta: fixa(resp([p(t.envioJaEnviando)], [], [], "digitando")) };
      return { conversa: { ...conversa, envio: { ...conversa.envio, etapa: "nome", nome: "", whatsapp: "" } }, resposta: fixa(resp([pergunta(t.envioNome)], [chipCancelarEnvio()], [], "digitando")) };
    }
    case "confirmar": {
      const e = conversa.envio;
      if (!e || e.etapa === "enviando") return { conversa, resposta: fixa(resp([p(t.envioJaEnviando)], [], [], "digitando")) };
      if (e.etapa !== "confirmar") return textoNoEnvio("", conversa) ?? { conversa, resposta: boasVindas() };
      const dados: DadosParaEnviar = { ids: e.ids, respostas: e.respostas, observacoes: e.observacoes, nome: e.nome, whatsapp: e.whatsapp };
      return { conversa: { ...conversa, envio: { ...e, etapa: "enviando" } }, resposta: { ...fixa(resp([p(t.envioEnviando)], [], [], "montando")), paraEnviar: dados } };
    }
    case "envio":
      return respostaDoEnvio(cmd.ok, conversa);
    case "cancelar":
      if (conversa.envio && !conversa.orc) {
        return { conversa: { ...conversa, envio: null, descricao: "" }, resposta: fixa(resp([p(t.envioCancelado), pergunta(t.boasVindasPergunta)], chipsInicio(), [], "digitando")) };
      }
      if (conversa.envio) {
        return { conversa: { ...conversa, envio: null }, resposta: fixa(resp([p(t.envioCancelado)], conversa.orc ? chipsDoResumo(conversa.orc) : [], [], "digitando")) };
      }
      return { conversa: { ...conversa, orc: null, fila: [], feitos: {}, envio: null, aguarda: null }, resposta: fixa(resp([p(t.orcarCancelado), pergunta(t.boasVindasPergunta)], chipsInicio(), [], "digitando")) };
    case "oque": {
      const passo = conversa.orc ? proximoPasso(conversa.orc) : null;
      if (!conversa.orc || !passo || passo.tipo !== "pergunta") return { conversa, resposta: ajuda() };
      const r = respostaDoPasso(passo, conversa.orc);
      return { conversa, resposta: { ...r, blocos: [p(passo.pergunta.ajuda ?? ""), ...r.blocos] } };
    }
    case "topico": {
      const top = topicoPorId(cmd.id);
      if (!top) return { conversa, resposta: respostaMenu() };
      const c: Conversa = { ...conversa, ultimoTopico: top.id, ultimoServico: top.servico ?? conversa.ultimoServico };
      const resposta = cmd.modo === "mais" ? respostaTopicoMais(top, conversa.turno) : cmd.modo === "exemplo" ? respostaTopicoExemplo(top, conversa.turno) : respostaDeTopico(top, conversa.turno);
      return { conversa: c, resposta };
    }
    case "categoria":
      return { conversa: { ...conversa, ultimoTopico: null }, resposta: respostaCategoria(cmd.id) };
    case "menu":
      return { conversa: { ...conversa, ultimoTopico: null }, resposta: respostaMenu() };
    case "guia": {
      const escolhas = [...(conversa.guia ?? []), cmd.o];
      const { resposta, fim } = respostaDoGuia(escolhas);
      return { conversa: { ...conversa, guia: fim ? null : escolhas }, resposta };
    }
  }
}

// Entrada principal --------------------------------------------------------------------------------------------------------------------------

/** Lembra a pergunta do orçamento em andamento, depois de uma resposta sobre outro assunto. */
function comRetomada(r: Resposta, conversa: Conversa): Resposta {
  const orc = conversa.orc;
  const passo = orc ? proximoPasso(orc) : null;
  if (!orc || !passo || passo.tipo !== "pergunta") return r;
  const pergunta = respostaDoPasso(passo, orc);
  return { blocos: [...r.blocos, titulo(t.orcarRetomar), ...pergunta.blocos], chips: pergunta.chips, acoes: r.acoes, multipla: pergunta.multipla };
}

/** Mensagem vaga: curta, só cumprimento ou sem nenhum assunto do site. Vale acolher e adivinhar, em vez de recusar. */
const ehVaga = (texto: string, achados: Set<string>) => radicaisUteis(texto).length <= 3 || achados.has("saudacao");

/** Intenções de pergunta direta: um tópico do saber geral só as vence se declarar `vence` ("tem mensalidade?" tem "custo", mas é um tópico). */
const INTENCOES_FORTES: ReadonlySet<Intencao> = new Set<Intencao>(["preco", "prazo", "orcar", "desconto", "pagamento", "nota"]);
/** Intenções de serviço que "e o painel?" pode repetir com outro serviço. */
const INTENCOES_DE_SERVICO: ReadonlySet<Intencao> = new Set<Intencao>(["preco", "prazo", "incluso", "orcar", "exemplos"]);

const orcarDe = (id: string | null): Entrada => (id ? { cmd: { t: "sobre", id, para: "orcar" } } : { texto: t.chips.orcar });

/**
 * Resposta de poucas palavras ao que o assistente acabou de perguntar: "sim", "pode ser", "bora" executam a proposta pendente;
 * "agora não", "depois" a dispensam com simpatia. Só vale quando a mensagem inteira é feita dessas palavras.
 */
function respostaCurta(texto: string, conversa: Conversa): Resultado | null {
  // Durante as perguntas do orçamento um "sim" é resposta; no resumo (que oferece enviar o pedido) ele aceita a oferta.
  if (conversa.orc && !conversa.proposta) return null;
  const pal = palavras(texto).map(radical);
  if (pal.length === 0 || pal.length > 4) return null;
  const conjunto = (lista: readonly string[]) => new Set(lista.map(radical));
  const sim = conjunto(palavrasDeSim);
  const nao = conjunto(palavrasDeNao);
  const marcaNao = conjunto(["nao", "depois", "dispenso", "deixa", "pular"]);
  const temNao = pal.some((x) => marcaNao.has(x));
  if (temNao && pal.every((x) => nao.has(x) || sim.has(x))) {
    return { conversa: { ...conversa, proposta: null }, resposta: resp([p(variar(saber.recusaSimpatica, conversa.turno))], chipsInicio(), [], "digitando") };
  }
  if (temNao || !pal.every((x) => sim.has(x))) return null;
  if (conversa.proposta) {
    const r = processarSemEstado(conversa.proposta, { ...conversa, proposta: null });
    return { conversa: r.conversa, resposta: { ...r.resposta, fixa: true, blocos: [p(variar(saber.confirmaSim, conversa.turno)), ...r.resposta.blocos] } };
  }
  // Sem nada pendente: "sim" puro pede o rumo; "ok", "beleza" e "show" só fecham o assunto.
  const explicito = pal.some((x) => ["sim", "quero", "pode"].includes(x));
  const resposta = explicito
    ? fixa(resp([p(saber.simSemProposta)], chipsInicio(), [], "digitando"))
    : fixa(resp([p(variar(saber.confirmaNeutra, conversa.turno))], chipsInicio(), [], "digitando"));
  return { conversa, resposta };
}

function responderTexto(texto: string, conversaEntrada: Conversa): Resultado {
  // O tópico explicado e a proposta pendente valem só para a mensagem seguinte: quem responde os renova se for o caso.
  const conversa: Conversa = { ...conversaEntrada, ultimoTopico: null, proposta: null };
  const turno = conversaEntrada.turno;

  const curta = respostaCurta(texto, conversaEntrada);
  if (curta) return curta;

  const casamentos = casamentosDe(texto);
  const pontos = new Map([...casamentos].map(([k, v]) => [k, v.forca] as const));
  const achados = new Set(pontos.keys());
  let intencao: Intencao | null = intencaoDe(achados);
  const citados = servicosCitados(achados);
  const unico = citados.length === 1 ? citados[0] : null;
  // Memória dos serviços citados há pouco: "planilha e depois um painel" vale para "pros dois" e para "quero orçar".
  if (citados.length > 1) conversa.falados = citados.slice(0, 3);
  else if (unico) conversa.falados = [...conversa.falados.filter((x) => x !== unico), unico].slice(-3);
  // "E o painel?": repete a última pergunta de serviço (preço, prazo...) com o serviço novo.
  if (!intencao && unico && conversaEntrada.ultimaIntencao && palavras(texto).length <= 5 && /^e( |$)/.test(chave(texto))) intencao = conversaEntrada.ultimaIntencao;
  const alvo = unico ?? (citados.length === 0 ? conversa.ultimoServico : null);
  const proximo: Conversa = { ...conversa, ultimoServico: unico ?? conversa.ultimoServico };
  const g = conversa.tratamento;

  // Tópicos do saber geral que a mensagem toca, do mais específico (frase mais longa) para o menos.
  const encontrados = [...pontos]
    .filter(([k]) => k.startsWith(PREFIXO_TOPICO))
    .map(([k, forca]) => ({ top: topicoPorId(k.slice(PREFIXO_TOPICO.length)), forca, trecho: casamentos.get(k)!.trecho }))
    .filter((x): x is { top: Topico; forca: number; trecho: string } => !!x.top)
    .sort((a, b) => b.forca - a.forca || topicos.indexOf(a.top) - topicos.indexOf(b.top));

  // Seguimento do tópico que acabou de ser explicado: "explica melhor", "me dá um exemplo".
  const anterior = conversaEntrada.ultimoTopico ? topicoPorId(conversaEntrada.ultimoTopico) : undefined;
  if (anterior && encontrados.length === 0 && citados.length === 0 && palavras(texto).length <= 7 && (!intencao || intencao === "explicar" || intencao === "exemplos")) {
    const c: Conversa = { ...conversa, ultimoTopico: anterior.id };
    if (achados.has("pedeExemplo")) return { conversa: c, resposta: respostaTopicoExemplo(anterior, turno) };
    if (achados.has("maisDetalhe")) return { conversa: c, resposta: respostaTopicoMais(anterior, turno) };
  }

  // Pedido de código pronto, exercício ou aula: o chat não é uma IA que gera isso, e diz.
  if (achados.has("pedeCodigo")) return { conversa, resposta: respostaPedeCodigo() };

  // "A gente acabou de falar": a pessoa já disse o serviço, e perguntar de novo é o que irrita. Segue com o que ela citou antes.
  if (achados.has("jaDisse") && !conversa.orc && citados.length === 0 && conversa.falados.length > 0) {
    const r = comecarFila(conversa.falados, conversa);
    return { ...r, resposta: { ...r.resposta, blocos: [p(t.jaDisse), ...r.resposta.blocos] } };
  }
  // A última pergunta foi "para qual serviço?": a mensagem seguinte é a resposta ("um site", "pros dois", "planilha e painel").
  if (conversaEntrada.aguarda === "servico" && !achados.has("grande") && (!intencao || intencao === "orcar" || intencao === "preco" || intencao === "prazo")) {
    if (citados.length > 0 && intencao !== "preco" && intencao !== "prazo") return comecarFila(citados, conversa);
  }

  // Saber geral: responde o tópico mais específico e oferece os outros que a mensagem tocou. Palavras como "valor", "pagar" ou
  // "demora" também disparam preço, pagamento e prazo; por isso só conta como pergunta de preço o que SOBRA depois de tirar o
  // trecho do tópico ("contas a pagar" é o tópico; "quanto custa tabela dinâmica" ainda é pergunta de preço).
  const escolhido = encontrados[0];
  const sobra = escolhido ? intencaoDe(new Set(conceitosPontuados(semTrecho(texto, escolhido.trecho)).keys())) : null;
  if (escolhido && (!sobra || !INTENCOES_FORTES.has(sobra) || escolhido.top.vence)) {
    const top = escolhido.top;
    const c: Conversa = { ...conversa, ultimoTopico: top.id, ultimoServico: top.servico ?? conversa.ultimoServico };
    return { conversa: c, resposta: respostaDeTopico(top, turno, encontrados.slice(1, 3).map((x) => x.top.id)) };
  }
  if (achados.has("menuAssuntos") && (!intencao || intencao === "ajuda" || intencao === "explicar")) return { conversa, resposta: respostaMenu() };

  // Fora do escopo: recusa (se a mensagem não toca em nenhum assunto do site).
  if (achados.has("fora") && !intencao && citados.length === 0) {
    return { conversa, resposta: fixa(resp([p(t.fora), pergunta(t.foraOpcoes)], chipsInicio(), [], "digitando")) };
  }
  // Empresa que já tem sistema grande: o chat diz com franqueza que o serviço serve melhor a outro público e encaminha.
  if (achados.has("empresaGrande")) return { conversa, resposta: guiaEmpresaGrande() };
  // Pedido maior que a estimativa do chat: formulário ou WhatsApp, sem número.
  const pedeNumero = intencao === null || intencao === "preco" || intencao === "prazo" || intencao === "orcar" || intencao === "incluso" || intencao === "negocio" || intencao === "explicar";
  if (achados.has("grande") && pedeNumero) return sobMedida({ ...conversa, aguarda: null }, texto);

  // Dúvida técnica geral (Docker, aprendizado de máquina, "o que é React?") sem tópico pronto e sem serviço citado: o chat diz com
  // franqueza que não tem essa resposta, em vez de explicar o serviço do Marcelo como se fosse a resposta.
  if (achados.has("devGeral") && citados.length === 0 && (!intencao || intencao === "explicar" || intencao === "exemplos" || intencao === "ajuda")) {
    return { conversa, resposta: semTopico() };
  }

  switch (intencao) {
    case "orcar": {
      if (citados.length > 1) return comecarFila(citados, proximo);
      // Já falou de dois ou mais serviços há pouco (ex.: "planilha e depois um painel"): não pergunta de novo.
      if (citados.length === 0 && !conversa.orc && conversa.falados.length > 1) return comecarFila(conversa.falados, conversa);
      if (alvo) return comecarOrcamento(alvo, proximo);
      return pedirServico(conversa, turno);
    }
    case "preco":
    case "prazo": {
      const ids = citados.length > 0 ? citados : alvo ? [alvo] : [];
      const resposta = intencao === "preco" ? precoDe(ids) : prazoDe(ids);
      return { conversa: { ...proximo, ultimaIntencao: intencao }, resposta: ofertar(resposta, orcarDe(ids.length === 1 ? ids[0] : null)) };
    }
    case "incluso": {
      if (alvo && citados.length <= 1) return { conversa: proximo, resposta: ofertar(detalhesServico(servicoDoCatalogo(alvo)!), orcarDe(alvo)) };
      return { conversa: proximo, resposta: resp([pergunta(t.inclusoSem)], chipsServicos("detalhes", citados.length > 0 ? citados : undefined), [], "pesquisando") };
    }
    case "desconto":
      return { conversa, resposta: ofertar(descontos(), orcarDe(null)) };
    case "comoFunciona":
      return { conversa, resposta: ofertar(guiaComoFunciona(g), { texto: t.chips.preparar }) };
    case "preparar":
      return { conversa, resposta: ofertar(guiaPreparar(g), { texto: t.chips.pagamento }) };
    case "pagamento":
      return { conversa, resposta: ofertar(guiaPagamento(g), { texto: t.chips.receber }) };
    case "receber":
      return { conversa, resposta: ofertar(guiaReceber(g), { texto: t.chips.depois }) };
    case "confianca":
      return { conversa, resposta: ofertar(guiaConfianca(), { texto: t.chips.exemplos }) };
    case "revisao":
      return { conversa, resposta: ofertar(guiaDepois(), orcarDe(null)) };
    case "nota":
      return { conversa, resposta: deFaq(faqsPorTitulo("você emite nota")) };
    case "desistencia":
      return { conversa, resposta: deFaq(faqsPorTitulo("e se eu não gostar"), { juridico: true }) };
    case "privacidade":
      return { conversa, resposta: deFaq(faqsPorTitulo("o que você faz com os dados", "o site guarda os meus dados"), { juridico: true }) };
    case "juridico":
      return { conversa, resposta: resp([p(t.juridico), pergunta(t.foraOpcoes)], chipsInicio(), linksJuridicos(), "pensando") };
    case "indicar": {
      const { resposta, fim } = respostaDoGuia([]);
      return { conversa: { ...conversa, guia: fim ? null : [] }, resposta };
    }
    case "contato":
      return { conversa, resposta: contato() };
    case "quem":
      return { conversa, resposta: ofertar(quem(), { texto: t.chips.confianca }) };
    case "publico":
      return { conversa, resposta: guiaPublico(g) };
    case "bot":
      return {
        conversa,
        resposta: resp([p(t.bot), pergunta(t.botPergunta)], [dito(t.chips.depois), dito(t.chips.servicos)], [{ tipo: "link", rotulo: t.acoes.comunidade, href: "/comunidade/#bots" }], "pesquisando"),
      };
    case "servicos":
      return { conversa, resposta: ofertar(listaServicos(), { texto: t.chips.indicar }) };
    case "exemplos": {
      if (unico) return { conversa: proximo, resposta: explicarServico(unico, g, false) };
      return { conversa, resposta: ofertar(guiaExemplos(), orcarDe(null)) };
    }
    case "explicar": {
      const cumprimentou = achados.has("saudacao");
      if (citados.length > 1) return { conversa: proximo, resposta: resp([pergunta(t.inclusoSem)], chipsServicos("detalhes", citados), [], "pensando") };
      if (alvo) return { conversa: { ...conversa, ultimoServico: alvo }, resposta: explicarServico(alvo, g, cumprimentou) };
      return { conversa, resposta: explicarGeral(g, cumprimentou) };
    }
    case "ajuda":
      return { conversa, resposta: ajuda() };
    case "negocio": {
      if (unico) return { conversa: proximo, resposta: detalhesServico(servicoDoCatalogo(unico)!) };
      const tipo: TipoNegocio = achados.has("negocio:comercio") ? "comercio" : achados.has("negocio:gestao") ? "gestao" : "liberal";
      return { conversa, resposta: guiaNegocio(tipo) };
    }
    case "saudacao":
      return { conversa, resposta: saudar(texto, turno) };
    case "agradecimento":
      return { conversa, resposta: fixa(resp([p(variar([t.obrigado, ...saber.obrigados], turno)), pergunta(t.obrigadoPergunta)], chipsInicio(), [], "digitando")) };
    case "despedida":
      return { conversa, resposta: resp([p(variar([t.tchau, ...saber.tchaus], turno))], [], [], "digitando") };
    case null:
      break;
  }

  // Sem intenção clara: um serviço citado mostra os detalhes; senão, procura nas perguntas frequentes; senão, acolhe (mensagem
  // vaga) ou encaminha (pergunta específica que o site não cobre).
  if (unico) return { conversa: proximo, resposta: ofertar(detalhesServico(servicoDoCatalogo(unico)!), orcarDe(unico)) };
  if (citados.length > 1) return { conversa: proximo, resposta: resp([pergunta(t.inclusoSem)], chipsServicos("detalhes", citados), [], "pesquisando") };
  const vaga = ehVaga(texto, achados);
  const faq = buscarFaq(texto, vaga ? 2 : 4);
  if (faq && !vaga) return { conversa, resposta: deFaq([faq]) };
  if (palavras(texto).length === 0) return { conversa, resposta: resp([p(t.vazia)], chipsInicio(), [], "digitando") };
  // Dúvida técnica (Excel, programação) sem tópico pronto: franqueza sobre o limite e os assuntos que o chat cobre.
  if (achados.has("devGeral")) return { conversa, resposta: semTopico() };
  return { conversa, resposta: vaga ? acolher(texto, g) : semBase() };
}

/** Uma rodada: recebe o que o visitante escreveu (ou tocou) e devolve a nova conversa e a resposta. */
export function processar(entrada: Entrada, conversa: Conversa): Resultado {
  const r = processarSemEstado(entrada, conversa);
  // Memória curta: o turno avança, e o que o assistente acabou de oferecer fica guardado para um "sim".
  const proxima: Conversa = { ...r.conversa, turno: conversa.turno + 1, proposta: r.resposta.proposta ?? null };
  if ("texto" in entrada) {
    const nova = intencaoDe(new Set(conceitosPontuados(entrada.texto).keys()));
    if (nova) proxima.ultimaIntencao = INTENCOES_DE_SERVICO.has(nova) ? nova : null;
  }
  return { conversa: proxima, resposta: { ...variarResposta(r.resposta, conversa.turno), estado: r.resposta.estado ?? "digitando" } };
}

/**
 * Dá ritmo de conversa às respostas de assunto: uma abertura curta e uma ponte antes da pergunta final, combinadas pelo turno
 * (a primeira vez é sempre o texto original). Só vale para respostas que explicam algo e terminam em pergunta; orçamento,
 * cumprimentos, recusas e confirmações têm o próprio tom e ficam como estão.
 */
function variarResposta(r: Resposta, turno: number): Resposta {
  if (r.fixa || r.estado === "montando") return r;
  const ultimo = r.blocos.at(-1);
  if (!ultimo || ultimo.tipo !== "pergunta" || r.blocos[0]?.tipo !== "p") return r;
  const [i, j] = combinar(turno, variacoes.aberturas.length, variacoes.pontes.length);
  const abertura = variacoes.aberturas[i];
  const ponte = variacoes.pontes[j];
  const blocos = [...r.blocos];
  if (ponte) blocos.splice(blocos.length - 1, 0, p(ponte));
  if (abertura) {
    const primeiro = blocos[0];
    if (primeiro.tipo === "p") blocos[0] = p(`${abertura} ${primeiro.texto}`);
  }
  return { ...r, blocos };
}

function processarSemEstado(entrada: Entrada, conversaAntes: Conversa): Resultado {
  if ("cmd" in entrada) return executar(entrada.cmd, conversaAntes);

  const { texto, cortado } = limitar(entrada.texto, t.maximoCaracteres);
  // O tratamento fica guardado quando a pessoa o deixa claro ("obrigada", "sou dono") e vale pelo resto da conversa.
  const conversa: Conversa = { ...conversaAntes, tratamento: tratamentoDe(texto) ?? conversaAntes.tratamento };
  if (!texto) return { conversa, resposta: resp([p(t.vazia)], conversa.orc ? [] : chipsInicio(), [], "digitando") };

  // 1. Proteção: pedido para mudar as regras. Nada mais é executado.
  if (tentaBurlarRegras(texto)) return { conversa, resposta: fixa(comRetomada(resp([p(t.injecao)], chipsInicio(), [], "digitando"), conversa)) };

  // 1b. Envio do pedido em andamento: o texto é o nome, o WhatsApp ou a confirmação.
  const noEnvio = textoNoEnvio(texto, conversa);
  if (noEnvio) return noEnvio;

  // 2. Orçamento em andamento: o texto pode ser uma resposta, "voltar" ou "cancelar".
  const noOrcamento = textoNoOrcamento(texto, conversa);
  if (noOrcamento) return noOrcamento;

  // 3. Resto da conversa.
  // A pergunta do orçamento só é repetida quando a resposta é sobre outro assunto (e não quando o próprio orçamento começou).
  const r = responderTexto(texto, conversa);
  const resposta = conversa.orc && r.conversa.orc === conversa.orc ? comRetomada(r.resposta, r.conversa) : r.resposta;
  if (cortado) resposta.blocos = [p(t.longa), ...resposta.blocos];
  return { conversa: r.conversa, resposta };
}
