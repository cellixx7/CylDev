import type { Intencao } from "../../../content/assistente";
import { assistente as t } from "../../../content/textos/assistente";
import { negocios } from "../../../content/textos/negocios";
import { brl } from "../formato";
import { passoDoGuia } from "../guia";
import { calcularCarrinho, linkWhatsappCarrinho, type Respostas } from "../orcamento";
import { buscarFaq, catalogo, contatos, faqPorTitulo, regrasGerais, servicoDoCatalogo, type Faq, type InfoServico } from "./conhecimento";
import { limitar, tentaBurlarRegras } from "./guardrails";
import { conceitosDe, intencaoDe, servicosCitados } from "./intencao";
import { chave, palavras } from "./normalizar";
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

// Motor do assistente: decide o que responder SEM modelo de linguagem. Tudo que tem número (preço, prazo, desconto) sai
// de conhecimento.ts, que lê servicos.ts e orcamento.ts. Um modelo, se houver, só reescreve o texto daqui (ver validarSaida).

// Tipos --------------------------------------------------------------------------------------------------------------------

export type Bloco = { tipo: "p"; texto: string } | { tipo: "titulo"; texto: string } | { tipo: "lista"; itens: string[] };

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

export type Resposta = { blocos: Bloco[]; chips: Chip[]; acoes: Acao[]; multipla?: boolean };

export type Conversa = {
  orc: EstadoOrcamento | null;
  /** Escolhas do guia "não sei qual escolher" (null fora dele). */
  guia: string[] | null;
  ultimoServico: string | null;
};

export const conversaNova = (): Conversa => ({ orc: null, guia: null, ultimoServico: null });

export type Resultado = { conversa: Conversa; resposta: Resposta };

/** O texto corrido da resposta, sem formatação (para teste e para o leitor de tela do histórico). */
export function textoPlano(r: Resposta): string {
  return r.blocos.map((b) => (b.tipo === "lista" ? b.itens.join("\n") : b.texto)).join("\n");
}

// Construtores --------------------------------------------------------------------------------------------------------------

const p = (texto: string): Bloco => ({ tipo: "p", texto });
const titulo = (texto: string): Bloco => ({ tipo: "titulo", texto });
const lista = (itens: string[]): Bloco => ({ tipo: "lista", itens });
const resp = (blocos: Bloco[], chips: Chip[] = [], acoes: Acao[] = []): Resposta => ({ blocos, chips, acoes });
const dito = (texto: string): Chip => ({ rotulo: texto, entrada: { texto } });
const sobre = (rotulo: string, id: string, para: ParaServico): Chip => ({ rotulo, entrada: { cmd: { t: "sobre", id, para } } });

const linkWhats = (): Acao => ({ tipo: "link", rotulo: t.acoes.whatsapp, href: contatos().whatsappLink, externo: true });
const linkFormulario = (): Acao => ({ tipo: "link", rotulo: t.acoes.formulario, href: "#orcamento" });
const saidaSemCerteza = (): Acao[] => [linkFormulario(), linkWhats()];

const chipsInicio = (): Chip[] => [dito(t.chips.servicos), dito(t.chips.preco), dito(t.chips.orcar), dito(t.chips.indicar)];

const infos = (ids: string[]): InfoServico[] => ids.map((id) => servicoDoCatalogo(id)).filter((s): s is InfoServico => !!s);

const chipsServicos = (para: ParaServico, ids: string[] = catalogo().map((s) => s.id)): Chip[] =>
  infos(ids).map((s) => sobre(t.chips.escolherServico(s.nome), s.id, para));

// Respostas por assunto ------------------------------------------------------------------------------------------------------

export function boasVindas(): Resposta {
  return resp([p(t.boasVindas), p(t.boasVindasPergunta)], chipsInicio());
}

function listaServicos(): Resposta {
  const itens = catalogo().map((s) => t.servicoLinha(s.nome, s.precoTexto));
  return resp([p(t.servicosIntro), lista(itens), p(t.servicosFim)], chipsServicos("detalhes"));
}

function detalhesServico(s: InfoServico): Resposta {
  const blocos: Bloco[] = [p(t.inclusoServico(s.nome, s.resultado)), p(t.inclusoLista), lista(s.inclui)];
  if (s.nota) blocos.push(p(s.nota));
  return resp(
    blocos,
    [sobre(t.chips.orcarServico(s.nome), s.id, "orcar"), sobre(t.chips.preco, s.id, "preco"), sobre(t.chips.prazo, s.id, "prazo")],
    [{ tipo: "servico", rotulo: t.acoes.detalhes, servicoId: s.id, aba: "detalhes" }],
  );
}

function precoDe(ids: string[]): Resposta {
  const g = regrasGerais();
  const servicos = ids.length > 0 ? infos(ids) : catalogo();
  const blocos: Bloco[] =
    servicos.length === 1
      ? [p(t.precoServico(servicos[0].nome, servicos[0].precoTexto))]
      : [p(t.precoGeralIntro), lista(servicos.map((s) => t.servicoLinha(s.nome, s.precoTexto)))];
  blocos.push(p(t.precoHora(g.horaExtra)), p(t.precoNota), p(t.precoPergunta));
  const chips = servicos.length === 1 ? [sobre(t.chips.orcarServico(servicos[0].nome), servicos[0].id, "orcar")] : [dito(t.chips.orcar)];
  return resp(blocos, chips);
}

function prazoDe(ids: string[]): Resposta {
  const servicos = ids.length > 0 ? infos(ids) : catalogo();
  if (servicos.length === 1) {
    const s = servicos[0];
    const blocos = s.prazoACombinar ? [p(`${s.nome}. ${t.prazoCombinar}`)] : [p(t.prazoServico(s.nome, s.prazoTexto)), p(t.prazoNota)];
    return resp(blocos, [sobre(t.chips.orcarServico(s.nome), s.id, "orcar")]);
  }
  return resp([p(t.prazoGeralIntro), lista(servicos.map((s) => t.prazoLinha(s.nome, s.prazoTexto))), p(t.prazoNota)], [dito(t.chips.orcar)]);
}

function descontos(): Resposta {
  const g = regrasGerais();
  const blocos: Bloco[] = [p(t.descontoCombo(g.combo2, g.combo3, g.combinaveis.join(", ")))];
  if (g.piloto) blocos.push(p(t.descontoPiloto(g.piloto.percentual, g.piloto.restam)));
  blocos.push(p(t.descontoNota));
  return resp(blocos, [dito(t.chips.orcar)]);
}

function deFaq(itens: Faq[]): Resposta {
  const blocos: Bloco[] = [p(t.faqPrefixo)];
  const acoes: Acao[] = [];
  for (const f of itens) {
    blocos.push(titulo(f.pergunta), ...f.paragrafos.map(p));
    for (const l of f.links) {
      if (!acoes.some((a) => a.tipo === "link" && a.href === l.href)) acoes.push({ tipo: "link", rotulo: l.rotulo, href: l.href });
    }
  }
  return resp(blocos, [dito(t.chips.orcar), dito(t.chips.pagamento)], acoes.slice(0, 3));
}

const faqsPorTitulo = (...inicios: string[]) => inicios.map(faqPorTitulo).filter((f): f is Faq => !!f);

function contato(): Resposta {
  return resp([p(t.contato), p(t.contatoNota)], [], [
    linkWhats(),
    { tipo: "link", rotulo: t.acoes.email, href: contatos().emailLink, externo: true },
    linkFormulario(),
  ]);
}

function quem(): Resposta {
  return resp([p(t.quemIntro), p(negocios.apresentacao.texto)], [dito(t.chips.servicos)], [{ tipo: "link", rotulo: t.acoes.sobre, href: "#sobre" }]);
}

const maior = (): Resposta => resp([p(t.maior)], [], saidaSemCerteza());
const naoSei = (): Resposta => resp([p(t.naoSei)], [dito(t.chips.servicos)], saidaSemCerteza());
const ajuda = (): Resposta => resp([p(t.ajuda), lista([...t.ajudaLista]), p(t.ajudaFim)], chipsInicio());

// Guia -------------------------------------------------------------------------------------------------------------------------

function respostaDoGuia(escolhas: string[]): { resposta: Resposta; fim: boolean } {
  const passo = passoDoGuia(escolhas);
  if (passo.pergunta) {
    const pergunta = passo.pergunta;
    const blocos = escolhas.length === 0 ? [p(t.guiaIntro), p(pergunta.texto)] : [p(pergunta.texto)];
    const chips: Chip[] = pergunta.opcoes.map((o) => ({ rotulo: o.rotulo, entrada: { cmd: { t: "guia", o: o.id } } }));
    return { fim: false, resposta: resp(blocos, chips) };
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
  const chips = servicos.flatMap((s) => [sobre(t.chips.detalhes(s.nome), s.id, "detalhes"), sobre(t.chips.orcarServico(s.nome), s.id, "orcar")]);
  return { fim: true, resposta: resp(blocos, chips, acoes) };
}

// Orçamento na conversa -----------------------------------------------------------------------------------------------------------

function respostaDoPasso(passo: Passo | null, e: EstadoOrcamento): Resposta {
  if (!passo) return naoSei();
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
    return { ...resp(blocos, chips), multipla };
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
  return resp(blocos, chips, acoes);
}

function comecarOrcamento(id: string, conversa: Conversa): Resultado {
  const estado = iniciarOrcamento(id);
  const s = servicoDoCatalogo(id);
  if (!estado || !s) return { conversa, resposta: naoSei() };
  const r = respostaDoPasso(proximoPasso(estado), estado);
  return {
    conversa: { ...conversa, orc: estado, guia: null, ultimoServico: id },
    resposta: { ...r, blocos: [p(t.orcarComeco(s.nome)), ...r.blocos] },
  };
}

const perguntarQualServico = (): Resposta => resp([p(t.orcarQual)], [...chipsServicos("orcar"), dito(t.chips.indicar)]);

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
      if (!s) return { conversa, resposta: naoSei() };
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
      return { conversa: { ...conversa, orc: null }, resposta: resp([p(t.orcarCancelado)], chipsInicio()) };
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

function responderTexto(texto: string, conversa: Conversa): Resultado {
  const achados = conceitosDe(texto);
  const intencao: Intencao | null = intencaoDe(achados);
  const citados = servicosCitados(achados);
  const unico = citados.length === 1 ? citados[0] : null;
  const alvo = unico ?? (citados.length === 0 ? conversa.ultimoServico : null);
  const proximo: Conversa = { ...conversa, ultimoServico: unico ?? conversa.ultimoServico };

  // Fora do escopo: recusa (se a mensagem não toca em nenhum assunto do site).
  if (achados.has("fora") && !intencao && citados.length === 0) {
    return { conversa, resposta: resp([p(t.fora), p(t.foraOpcoes)], chipsInicio()) };
  }
  // Pedido maior que a estimativa do chat: formulário ou WhatsApp, sem número.
  const pedeNumero = intencao === null || intencao === "preco" || intencao === "prazo" || intencao === "orcar" || intencao === "incluso";
  if (achados.has("grande") && pedeNumero) return { conversa, resposta: maior() };

  switch (intencao) {
    case "orcar": {
      if (alvo) return comecarOrcamento(alvo, proximo);
      if (citados.length > 1) return { conversa: proximo, resposta: resp([p(t.orcarQual)], chipsServicos("orcar", citados)) };
      return { conversa, resposta: perguntarQualServico() };
    }
    case "preco":
      return { conversa: proximo, resposta: precoDe(citados.length > 0 ? citados : alvo ? [alvo] : []) };
    case "prazo":
      return { conversa: proximo, resposta: prazoDe(citados.length > 0 ? citados : alvo ? [alvo] : []) };
    case "incluso": {
      if (alvo && citados.length <= 1) return { conversa: proximo, resposta: detalhesServico(servicoDoCatalogo(alvo)!) };
      return { conversa: proximo, resposta: resp([p(t.inclusoSem)], chipsServicos("detalhes", citados.length > 0 ? citados : undefined)) };
    }
    case "desconto":
      return { conversa, resposta: descontos() };
    case "pagamento":
      return { conversa, resposta: deFaq(faqsPorTitulo("como é o pagamento")) };
    case "nota":
      return { conversa, resposta: deFaq(faqsPorTitulo("você emite nota")) };
    case "desistencia":
      return { conversa, resposta: deFaq(faqsPorTitulo("e se eu não gostar")) };
    case "revisao":
      return { conversa, resposta: deFaq(faqsPorTitulo("e se aparecer um defeito", "e se eu quiser uma mudança")) };
    case "privacidade":
      return { conversa, resposta: deFaq(faqsPorTitulo("o que você faz com os dados", "o site guarda os meus dados")) };
    case "indicar": {
      const { resposta, fim } = respostaDoGuia([]);
      return { conversa: { ...conversa, guia: fim ? null : [] }, resposta };
    }
    case "contato":
      return { conversa, resposta: contato() };
    case "quem":
      return { conversa, resposta: quem() };
    case "bot":
      return { conversa, resposta: resp([p(t.bot)], [dito(t.chips.servicos)], [{ tipo: "link", rotulo: t.acoes.comunidade, href: "/comunidade/#bots" }]) };
    case "servicos":
      return { conversa, resposta: listaServicos() };
    case "ajuda":
      return { conversa, resposta: ajuda() };
    case "saudacao":
      return { conversa, resposta: boasVindas() };
    case "agradecimento":
      return { conversa, resposta: resp([p(t.obrigado)], chipsInicio()) };
    case "despedida":
      return { conversa, resposta: resp([p(t.tchau)]) };
    case null:
      break;
  }

  // Sem intenção clara: um serviço citado mostra os detalhes; senão, procura nas perguntas frequentes; senão, encaminha.
  if (unico) return { conversa: proximo, resposta: detalhesServico(servicoDoCatalogo(unico)!) };
  if (citados.length > 1) return { conversa: proximo, resposta: resp([p(t.inclusoSem)], chipsServicos("detalhes", citados)) };
  const faq = buscarFaq(texto);
  if (faq) return { conversa, resposta: deFaq([faq]) };
  if (palavras(texto).length === 0) return { conversa, resposta: resp([p(t.vazia)], chipsInicio()) };
  return { conversa, resposta: naoSei() };
}

/** Uma rodada: recebe o que o visitante escreveu (ou tocou) e devolve a nova conversa e a resposta. */
export function processar(entrada: Entrada, conversa: Conversa): Resultado {
  if ("cmd" in entrada) return executar(entrada.cmd, conversa);

  const { texto, cortado } = limitar(entrada.texto, t.maximoCaracteres);
  if (!texto) return { conversa, resposta: resp([p(t.vazia)], conversa.orc ? [] : chipsInicio()) };

  // 1. Proteção: pedido para mudar as regras. Nada mais é executado.
  if (tentaBurlarRegras(texto)) return { conversa, resposta: comRetomada(resp([p(t.injecao)], chipsInicio()), conversa) };

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
