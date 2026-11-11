import { VALOR_HORA_EXTRA } from "../../content/orcamento";
import { servicoOrcamentoPorId, type ServicoOrcamento } from "../../content/perguntas";
import { site } from "../../content/site";
import type { DadosContato } from "./emailjs";
import { brl, horasTexto } from "./formato";
import {
  calcularCarrinho,
  horasExtrasDa,
  opcoesMarcadas,
  textoEstimativa,
  textoPrecoItem,
  type Carrinho,
  type CalculoServico,
  type OpcoesCarrinho,
  type Respostas,
} from "./orcamento";
import { mensagemComOrigem, whatsappLink } from "./whatsapp";

// Pedido estruturado ---------------------------------------------------------------------
// Uma só estrutura alimenta a tela de revisão, o WhatsApp e o e-mail, para os três nunca divergirem.
// Os valores vêm de calcularCarrinho() e calcularServico(); nada aqui recalcula preço.

export type RespostaPedido = {
  perguntaId: string;
  pergunta: string;
  /** Rótulos das opções marcadas. Vazio quando a pergunta ficou sem resposta. */
  escolhas: string[];
  /** R$ que esta resposta soma ao valor (0 quando não muda). */
  acrescimo: number;
};

export type ItemPedido = {
  id: string;
  nome: string;
  respostas: RespostaPedido[];
  /** Preço-base do pacote (primeira linha do cálculo). `null` no sob consulta. */
  precoBase: number | null;
  /** Valor estimado do serviço, com as horas extras e sem desconto. `null` no sob consulta. */
  preco: number | null;
  /** Texto do preço: "a partir de R$ 450", "R$ 50 por hora", "sob consulta". */
  textoPreco: string;
  horas: number | null;
  prazo: string;
  mensalidade: number | null;
  sobConsulta: boolean;
  /** Preço "a partir de" ou só estimativa: não é um valor fechado. */
  aproximado: boolean;
  perguntasRespondidas: number;
  perguntasTotal: number;
  /** Perguntas ainda sem resposta (`perguntasTotal - perguntasRespondidas`). */
  perguntasSemResposta: number;
  /** Tem valor e ainda há pergunta sem resposta: o valor é estimativa e pode mudar. */
  estimativa: boolean;
};

export type Pedido = {
  itens: ItemPedido[];
  carrinho: Carrinho;
  observacoes: string;
};

function respostasDoItem(modelo: ServicoOrcamento, respostas: Respostas): RespostaPedido[] {
  return modelo.perguntas.map((p) => {
    const ids = opcoesMarcadas(p, respostas);
    return {
      perguntaId: p.id,
      pergunta: p.texto,
      escolhas: ids.map((id) => p.opcoes.find((o) => o.id === id)?.rotulo ?? id),
      acrescimo: horasExtrasDa(p, respostas) * VALOR_HORA_EXTRA,
    };
  });
}

function itemDoPedido(c: CalculoServico, respostas: Respostas): ItemPedido {
  const modelo = servicoOrcamentoPorId(c.id)!;
  const lista = respostasDoItem(modelo, respostas);
  const respondidas = lista.filter((r) => r.escolhas.length > 0).length;
  return {
    id: c.id,
    nome: c.nome,
    respostas: lista,
    precoBase: c.linhas.length > 0 && c.preco !== null ? c.linhas[0].valor : null,
    preco: c.preco,
    textoPreco: textoPrecoItem(c),
    horas: c.horas,
    prazo: c.prazo,
    mensalidade: c.mensalidade,
    sobConsulta: c.tipoPreco === "sobConsulta",
    aproximado: c.aPartirDe || c.estimativa,
    perguntasRespondidas: respondidas,
    perguntasTotal: lista.length,
    perguntasSemResposta: lista.length - respondidas,
    estimativa: c.preco !== null && lista.length - respondidas > 0,
  };
}

/** Monta o pedido a partir dos ids no carrinho e das respostas atuais de cada serviço. */
export function montarPedido(
  ids: string[],
  respostas: Record<string, Respostas>,
  observacoes = "",
  opcoes?: OpcoesCarrinho,
): Pedido {
  const carrinho = calcularCarrinho(ids, respostas, opcoes);
  return {
    itens: carrinho.itens.map((c) => itemDoPedido(c, respostas[c.id] ?? {})),
    carrinho,
    observacoes: observacoes.trim(),
  };
}

// Progresso e estado da estimativa --------------------------------------------------------

export type Progresso = { respondidas: number; total: number; faltam: number };

/**
 * Quantas perguntas do serviço já têm resposta. Informa o cliente, não bloqueia nada:
 * o spec não define pergunta obrigatória, então todas são tratadas como opcionais.
 */
export function progressoDoServico(modelo: ServicoOrcamento, respostas: Respostas): Progresso {
  const total = modelo.perguntas.length;
  const respondidas = modelo.perguntas.filter((p) => opcoesMarcadas(p, respostas).length > 0).length;
  return { respondidas, total, faltam: total - respondidas };
}

/** consulta: sem preço; inicial: nada respondido; configurando: faltam respostas; configurada: tudo respondido. */
export type EstadoEstimativa = "consulta" | "inicial" | "configurando" | "configurada";

export function estadoDaEstimativa(c: CalculoServico, p: Progresso): EstadoEstimativa {
  if (c.preco === null) return "consulta";
  if (p.total === 0 || p.faltam === 0) return "configurada";
  return p.respondidas === 0 ? "inicial" : "configurando";
}

// Texto -----------------------------------------------------------------------------------

function blocoDoItem(i: ItemPedido): string {
  const linhas = [`${i.nome}`];
  for (const r of i.respostas) {
    const escolha = r.escolhas.length > 0 ? r.escolhas.join(", ") : "sem resposta";
    const extra = r.acrescimo > 0 ? ` (+ ${brl(r.acrescimo)})` : "";
    linhas.push(`  ${r.pergunta} ${escolha}${extra}`);
  }
  if (i.precoBase !== null) linhas.push(`  Preço-base: ${brl(i.precoBase)}`);
  linhas.push(`  Valor${i.estimativa ? " (estimativa)" : ""}: ${i.textoPreco}`);
  if (i.estimativa) {
    const n = i.perguntasSemResposta;
    linhas.push(`  Estimativa: ${n} ${n === 1 ? "pergunta" : "perguntas"} sem resposta (de ${i.perguntasTotal}); o valor pode mudar.`);
  }
  if (i.horas !== null) linhas.push(`  Trabalho: ${horasTexto(i.horas)}`);
  linhas.push(`  Prazo: ${i.prazo}`);
  if (i.mensalidade !== null) linhas.push(`  Mensalidade: ${brl(i.mensalidade)} por mês (hospedagem à parte)`);
  return linhas.join("\n");
}

/** Serviços com respostas, acréscimos, valores e prazos, mais o resumo geral e as observações. */
export function textoPedidoCompleto(p: Pedido): string {
  const c = p.carrinho;
  const partes = p.itens.map(blocoDoItem);
  const resumo: string[] = [];
  if (c.itens.length > 1 || c.desconto) resumo.push(`Soma de tabela: ${brl(c.somaTabela)}`);
  if (c.desconto) resumo.push(`Desconto (${c.desconto.rotulo}): - ${brl(c.desconto.valor)}`);
  if (c.prazoCombinaveis && c.itens.filter((i) => i.combinavel).length > 1) {
    resumo.push(`Prazo dos combináveis, juntos: ${c.prazoCombinaveis.texto}`);
  }
  if (c.temSobConsulta) {
    resumo.push(`Sob consulta (fora do total): ${p.itens.filter((i) => i.sobConsulta).map((i) => i.nome).join(", ")}`);
  }
  const emEstimativa = p.itens.filter((i) => i.estimativa).map((i) => i.nome);
  if (emEstimativa.length > 0) resumo.push(`Valores em estimativa (há pergunta sem resposta): ${emEstimativa.join(", ")}`);
  resumo.push(`Total estimado: ${textoEstimativa(c)}`);
  const fim = p.observacoes ? [`Observações do cliente: ${p.observacoes}`] : [];
  return [...partes, resumo.join("\n"), ...fim].join("\n\n");
}

/** Mensagem do WhatsApp. Pedido vazio devolve texto vazio: quem chama não deve abrir o link. */
export function mensagemWhatsappPedido(p: Pedido): string {
  if (p.itens.length === 0) return "";
  return `Quero fazer um orçamento com:\n\n${textoPedidoCompleto(p)}\n\n(Estimativa, confirmada na conversa.)`;
}

/** Link do WhatsApp com o pedido completo. `null` quando o pedido está vazio. */
export function linkWhatsappPedido(p: Pedido, origem = "negocios-carrinho"): string | null {
  const msg = mensagemWhatsappPedido(p);
  return msg ? whatsappLink(site.whatsapp, mensagemComOrigem(origem, msg)) : null;
}

/** Link mailto com o pedido completo. `null` quando o pedido está vazio ou não há e-mail em site.ts. */
export function linkEmailPedido(p: Pedido, origem = "negocios-carrinho"): string | null {
  if (p.itens.length === 0 || !site.email) return null;
  const corpo = `${textoPedidoCompleto(p)}

(Estimativa, confirmada na conversa. Origem: ${origem})`;
  return `mailto:${site.email}?subject=${encodeURIComponent("Pedido pelo site")}&body=${encodeURIComponent(corpo)}`;
}

/** Dados do EmailJS: mesmos nomes de campo de sempre, com o escopo completo em `mensagem`. */
export function dadosEmailPedido(
  p: Pedido,
  contato: { nome: string; whatsapp: string },
  origem = "negocios-carrinho",
): DadosContato {
  return {
    nome: contato.nome,
    preferencia: "whatsapp",
    contato: contato.whatsapp,
    assunto: "Pedido pelo site",
    mensagem: textoPedidoCompleto(p),
    origem,
    pacote: p.itens.map((i) => i.nome).join(", "),
    estimativa: textoEstimativa(p.carrinho),
  };
}

/** Texto curto de um item para as listas: valor e, quando houver, a mensalidade. */
export function resumoPrecoItem(i: ItemPedido): string {
  return i.mensalidade !== null ? `${i.textoPreco} + ${brl(i.mensalidade)}/mês` : i.textoPreco;
}
