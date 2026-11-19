import type { Intencao } from "../../../content/assistente";
import { assistente as t, tr, type Tratamento } from "../../../content/textos/assistente";
import { guias } from "../../../content/textos/assistenteGuias";
import { negocios } from "../../../content/textos/negocios";
import { site } from "../../../content/site";
import { brl } from "../formato";
import { passoDoGuia } from "../guia";
import { calcularCarrinho, linkWhatsappCarrinho, type Respostas } from "../orcamento";
import { buscarFaq, catalogo, contatos, faqPorTitulo, mensalidadeBase, regrasGerais, servicoDoCatalogo, type Faq, type InfoServico } from "./conhecimento";
import { limitar, tentaBurlarRegras } from "./guardrails";
import { conceitosDe, intencaoDe, servicosCitados, tratamentoDe } from "./intencao";
import { chave, palavras, radicaisUteis } from "./normalizar";
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
  | { t: "guia"; o: string };

export type Entrada = { texto: string } | { cmd: Cmd };

export type Chip = { rotulo: string; entrada: Entrada; marcado?: boolean };

export type Acao =
  | { tipo: "link"; rotulo: string; href: string; externo?: boolean }
  | { tipo: "carrinho"; rotulo: string; servicoId: string; respostas: Respostas }
  | { tipo: "servico"; rotulo: string; servicoId: string; aba: "detalhes" | "orcamento" };

export type Resposta = { blocos: Bloco[]; chips: Chip[]; acoes: Acao[]; multipla?: boolean; estado?: Estado };

export type Conversa = {
  orc: EstadoOrcamento | null;
  /** Escolhas do guia "não sei qual escolher" (null fora dele). */
  guia: string[] | null;
  ultimoServico: string | null;
  /** "o senhor" ou "a senhora", só quando a pessoa deixou claro; senão null (formas neutras). */
  tratamento: Tratamento;
};

export const conversaNova = (): Conversa => ({ orc: null, guia: null, ultimoServico: null, tratamento: null });

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
  return resp([p(t.boasVindas), pergunta(t.boasVindasPergunta)], chipsInicio(), [], "digitando");
}

/** Responde ao cumprimento com o mesmo cumprimento ("Bom dia!"), sem repetir a apresentação nem avisos de limite. */
function saudar(texto: string): Resposta {
  const c = chave(texto);
  const cumprimento = c.includes("bom dia") ? "Bom dia" : c.includes("boa tarde") ? "Boa tarde" : c.includes("boa noite") ? "Boa noite" : "Oi";
  return resp([p(t.saudacaoResposta(cumprimento)), pergunta(t.saudacaoPergunta)], chipsInicio(), [], "digitando");
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
const ajuda = (): Resposta => resp([p(t.ajuda), lista([...t.ajudaLista]), p(t.ajudaFim)], chipsInicio(), [], "digitando");

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

// Guia -------------------------------------------------------------------------------------------------------------------------

function respostaDoGuia(escolhas: string[]): { resposta: Resposta; fim: boolean } {
  const passo = passoDoGuia(escolhas);
  if (passo.pergunta) {
    const pergunta = passo.pergunta;
    const blocos = escolhas.length === 0 ? [p(t.guiaIntro), p(pergunta.texto)] : [p(pergunta.texto)];
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

function respostaDoPasso(passo: Passo | null, e: EstadoOrcamento): Resposta {
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
  blocos.push(p(t.orcarEstimativaNota), p(t.orcarProximo));
  const carrinho = calcularCarrinho([e.servicoId], { [e.servicoId]: e.respostas });
  const acoes: Acao[] = [
    { tipo: "carrinho", rotulo: t.acoes.carrinho, servicoId: e.servicoId, respostas: e.respostas },
    { tipo: "link", rotulo: t.acoes.whatsapp, href: linkWhatsappCarrinho(carrinho, t.origemWhatsapp), externo: true },
  ];
  const chips: Chip[] = [];
  if (e.pilha.length > 0) chips.push({ rotulo: t.chips.voltar, entrada: { cmd: { t: "voltar" } } });
  chips.push(dito(t.chips.recomecar));
  return resp(blocos, chips, acoes, "montando");
}

function comecarOrcamento(id: string, conversa: Conversa): Resultado {
  const estado = iniciarOrcamento(id);
  const s = servicoDoCatalogo(id);
  if (!estado || !s) return { conversa, resposta: semBase() };
  const r = respostaDoPasso(proximoPasso(estado), estado);
  return {
    conversa: { ...conversa, orc: estado, guia: null, ultimoServico: id },
    resposta: { ...r, blocos: [p(t.orcarComeco(s.nome)), ...r.blocos] },
  };
}

const perguntarQualServico = (): Resposta => resp([pergunta(t.orcarQual)], [...chipsServicos("orcar"), dito(t.chips.indicar)], [], "montando");

const passoAtual = (orc: EstadoOrcamento): Resposta => respostaDoPasso(proximoPasso(orc), orc);

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
    return achou ? { conversa: { ...conversa, orc: novo }, resposta: passoAtual(novo) } : null;
  }

  const op = opcaoPorTexto(pergunta, texto);
  if (!op) return null;
  const novo = aplicarOpcao(orc, pergunta.id, op.id);
  return { conversa: { ...conversa, orc: novo }, resposta: passoAtual(novo) };
}

// Comandos (toque em botão) -------------------------------------------------------------------------------------------------------------

function executar(cmd: Cmd, conversa: Conversa): Resultado {
  switch (cmd.t) {
    case "sobre": {
      const s = servicoDoCatalogo(cmd.id);
      if (!s) return { conversa, resposta: semBase() };
      const c = { ...conversa, ultimoServico: s.id };
      if (cmd.para === "orcar") return comecarOrcamento(s.id, c);
      if (cmd.para === "preco") return { conversa: c, resposta: precoDe([s.id]) };
      if (cmd.para === "prazo") return { conversa: c, resposta: prazoDe([s.id]) };
      return { conversa: c, resposta: detalhesServico(s) };
    }
    case "opcao": {
      if (!conversa.orc) return { conversa, resposta: perguntarQualServico() };
      const novo = aplicarOpcao(conversa.orc, cmd.p, cmd.o);
      return { conversa: { ...conversa, orc: novo }, resposta: passoAtual(novo) };
    }
    case "pronto": {
      if (!conversa.orc) return { conversa, resposta: perguntarQualServico() };
      const novo = concluirMultipla(conversa.orc, cmd.p);
      return { conversa: { ...conversa, orc: novo }, resposta: passoAtual(novo) };
    }
    case "voltar": {
      if (!conversa.orc) return { conversa, resposta: boasVindas() };
      const novo = voltarUma(conversa.orc);
      return { conversa: { ...conversa, orc: novo }, resposta: passoAtual(novo) };
    }
    case "cancelar":
      return { conversa: { ...conversa, orc: null }, resposta: resp([p(t.orcarCancelado), pergunta(t.boasVindasPergunta)], chipsInicio(), [], "digitando") };
    case "oque": {
      const passo = conversa.orc ? proximoPasso(conversa.orc) : null;
      if (!conversa.orc || !passo || passo.tipo !== "pergunta") return { conversa, resposta: ajuda() };
      const r = respostaDoPasso(passo, conversa.orc);
      return { conversa, resposta: { ...r, blocos: [p(passo.pergunta.ajuda ?? ""), ...r.blocos] } };
    }
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

function responderTexto(texto: string, conversa: Conversa): Resultado {
  const achados = conceitosDe(texto);
  const intencao: Intencao | null = intencaoDe(achados);
  const citados = servicosCitados(achados);
  const unico = citados.length === 1 ? citados[0] : null;
  const alvo = unico ?? (citados.length === 0 ? conversa.ultimoServico : null);
  const proximo: Conversa = { ...conversa, ultimoServico: unico ?? conversa.ultimoServico };
  const g = conversa.tratamento;

  // Fora do escopo: recusa (se a mensagem não toca em nenhum assunto do site).
  if (achados.has("fora") && !intencao && citados.length === 0) {
    return { conversa, resposta: resp([p(t.fora), pergunta(t.foraOpcoes)], chipsInicio(), [], "digitando") };
  }
  // Empresa que já tem sistema grande: o chat diz com franqueza que o serviço serve melhor a outro público e encaminha.
  if (achados.has("empresaGrande")) return { conversa, resposta: guiaEmpresaGrande() };
  // Pedido maior que a estimativa do chat: formulário ou WhatsApp, sem número.
  const pedeNumero = intencao === null || intencao === "preco" || intencao === "prazo" || intencao === "orcar" || intencao === "incluso" || intencao === "negocio" || intencao === "explicar";
  if (achados.has("grande") && pedeNumero) return { conversa, resposta: maior() };

  switch (intencao) {
    case "orcar": {
      if (alvo) return comecarOrcamento(alvo, proximo);
      if (citados.length > 1) return { conversa: proximo, resposta: resp([pergunta(t.orcarQual)], chipsServicos("orcar", citados), [], "montando") };
      return { conversa, resposta: perguntarQualServico() };
    }
    case "preco":
      return { conversa: proximo, resposta: precoDe(citados.length > 0 ? citados : alvo ? [alvo] : []) };
    case "prazo":
      return { conversa: proximo, resposta: prazoDe(citados.length > 0 ? citados : alvo ? [alvo] : []) };
    case "incluso": {
      if (alvo && citados.length <= 1) return { conversa: proximo, resposta: detalhesServico(servicoDoCatalogo(alvo)!) };
      return { conversa: proximo, resposta: resp([pergunta(t.inclusoSem)], chipsServicos("detalhes", citados.length > 0 ? citados : undefined), [], "pesquisando") };
    }
    case "desconto":
      return { conversa, resposta: descontos() };
    case "comoFunciona":
      return { conversa, resposta: guiaComoFunciona(g) };
    case "preparar":
      return { conversa, resposta: guiaPreparar(g) };
    case "pagamento":
      return { conversa, resposta: guiaPagamento(g) };
    case "receber":
      return { conversa, resposta: guiaReceber(g) };
    case "confianca":
      return { conversa, resposta: guiaConfianca() };
    case "revisao":
      return { conversa, resposta: guiaDepois() };
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
      return { conversa, resposta: quem() };
    case "publico":
      return { conversa, resposta: guiaPublico(g) };
    case "bot":
      return {
        conversa,
        resposta: resp([p(t.bot), pergunta(t.botPergunta)], [dito(t.chips.depois), dito(t.chips.servicos)], [{ tipo: "link", rotulo: t.acoes.comunidade, href: "/comunidade/#bots" }], "pesquisando"),
      };
    case "servicos":
      return { conversa, resposta: listaServicos() };
    case "exemplos": {
      if (unico) return { conversa: proximo, resposta: explicarServico(unico, g, false) };
      return { conversa, resposta: guiaExemplos() };
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
      return { conversa, resposta: saudar(texto) };
    case "agradecimento":
      return { conversa, resposta: resp([p(t.obrigado), pergunta(t.obrigadoPergunta)], chipsInicio(), [], "digitando") };
    case "despedida":
      return { conversa, resposta: resp([p(t.tchau)], [], [], "digitando") };
    case null:
      break;
  }

  // Sem intenção clara: um serviço citado mostra os detalhes; senão, procura nas perguntas frequentes; senão, acolhe (mensagem
  // vaga) ou encaminha (pergunta específica que o site não cobre).
  if (unico) return { conversa: proximo, resposta: detalhesServico(servicoDoCatalogo(unico)!) };
  if (citados.length > 1) return { conversa: proximo, resposta: resp([pergunta(t.inclusoSem)], chipsServicos("detalhes", citados), [], "pesquisando") };
  const vaga = ehVaga(texto, achados);
  const faq = buscarFaq(texto, vaga ? 2 : 4);
  if (faq && !vaga) return { conversa, resposta: deFaq([faq]) };
  if (palavras(texto).length === 0) return { conversa, resposta: resp([p(t.vazia)], chipsInicio(), [], "digitando") };
  return { conversa, resposta: vaga ? acolher(texto, g) : semBase() };
}

/** Uma rodada: recebe o que o visitante escreveu (ou tocou) e devolve a nova conversa e a resposta. */
export function processar(entrada: Entrada, conversa: Conversa): Resultado {
  const r = processarSemEstado(entrada, conversa);
  return { ...r, resposta: { ...r.resposta, estado: r.resposta.estado ?? "digitando" } };
}

function processarSemEstado(entrada: Entrada, conversaAntes: Conversa): Resultado {
  if ("cmd" in entrada) return executar(entrada.cmd, conversaAntes);

  const { texto, cortado } = limitar(entrada.texto, t.maximoCaracteres);
  // O tratamento fica guardado quando a pessoa o deixa claro ("obrigada", "sou dono") e vale pelo resto da conversa.
  const conversa: Conversa = { ...conversaAntes, tratamento: tratamentoDe(texto) ?? conversaAntes.tratamento };
  if (!texto) return { conversa, resposta: resp([p(t.vazia)], conversa.orc ? [] : chipsInicio(), [], "digitando") };

  // 1. Proteção: pedido para mudar as regras. Nada mais é executado.
  if (tentaBurlarRegras(texto)) return { conversa, resposta: comRetomada(resp([p(t.injecao)], chipsInicio(), [], "digitando"), conversa) };

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
