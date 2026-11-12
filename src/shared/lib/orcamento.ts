import {
  COMBO_2,
  COMBO_3,
  mensalidadeBots,
  VALOR_HORA_EXTRA,
  vagasPiloto10,
  vagasPiloto5,
} from "../../content/orcamento";
import { servicoOrcamentoPorId, type Pergunta } from "../../content/perguntas";
import { prazoACombinar, servicoPorId } from "../../content/servicos";
import { site } from "../../content/site";
import { brl, horasTexto } from "./formato";
import { formatarPrazo, prazoEmDias } from "./prazo";
import { mensagemComOrigem, whatsappLink } from "./whatsapp";

export type DescontoPiloto = { percentual: 10 | 5; restam: number };

/** Faixa de desconto em vigor: primeiro as vagas de 10%, depois as de 5%. Sem vaga, `null`. */
export function descontoPilotoAtual(v10 = vagasPiloto10, v5 = vagasPiloto5): DescontoPiloto | null {
  if (v10 > 0) return { percentual: 10, restam: v10 };
  if (v5 > 0) return { percentual: 5, restam: v5 };
  return null;
}

/** Mensalidade de um bot: fração do preço de criação (já com as extras) por mês. Hospedagem à parte. */
export function mensalidadeDe(precoCriacao: number, fracao = mensalidadeBots.fracaoDaCriacao): number {
  return Math.round(precoCriacao * fracao);
}

/** Preço com o desconto percentual aplicado, arredondado para reais inteiros. */
export function comDesconto(preco: number, percentual: number): number {
  return Math.round(preco * (1 - percentual / 100));
}

// Perguntas e respostas ------------------------------------------------------------------

/** Respostas de um serviço: id da pergunta → id da opção (única) ou ids das opções (múltipla). */
export type Respostas = Record<string, string | string[] | undefined>;

/** A pergunta muda o valor? Serve só para mostrar "Muda o valor." ou "Não muda o valor." na tela. */
export function mudaOValor(p: Pergunta): boolean {
  if (p.tipo === "multipla") return (p.horasPorExtra ?? 0) > 0;
  return p.opcoes.some((o) => (o.horas ?? 0) > 0);
}

/** Opções marcadas (só ids que existem na pergunta, sem repetição). */
export function opcoesMarcadas(p: Pergunta, respostas: Respostas): string[] {
  const r = respostas[p.id];
  const ids = r === undefined ? [] : Array.isArray(r) ? r : [r];
  const validos = new Set(p.opcoes.map((o) => o.id));
  return [...new Set(ids)].filter((id) => validos.has(id));
}

/** Horas extras de uma pergunta: única soma `horas` da opção; múltipla soma `max(0, n - gratis) * horasPorExtra`. */
export function horasExtrasDa(p: Pergunta, respostas: Respostas): number {
  const ids = opcoesMarcadas(p, respostas);
  if (p.tipo === "multipla") {
    return Math.max(0, ids.length - (p.gratis ?? 0)) * (p.horasPorExtra ?? 0);
  }
  return p.opcoes.find((o) => o.id === ids[0])?.horas ?? 0;
}

// Cálculo de um serviço ------------------------------------------------------------------

export type LinhaCalculo = {
  rotulo: string;
  /** R$ que a linha soma ao preço. */
  valor: number;
  /** Horas que a linha soma ao trabalho. */
  horas: number;
};

export type CalculoServico = {
  id: string;
  nome: string;
  combinavel: boolean;
  tipoPreco: "fixo" | "aPartirDe" | "sobConsulta";
  /** Preço de tabela com as horas extras. `null` no sob consulta. */
  preco: number | null;
  aPartirDe: boolean;
  /** Bots: o preço varia pelas respostas, mas é só uma estimativa. */
  estimativa: boolean;
  /** Horas extras vindas das respostas. */
  horasExtras: number;
  /** Horas totais de trabalho. `null` quando o prazo não é calculado (bots, sistema). */
  horas: number | null;
  /** Dias úteis calculados. `null` quando o prazo não é calculado. */
  dias: number | null;
  /** Texto do prazo, sempre preenchido. */
  prazo: string;
  /** Mensalidade (bots), sobre o preço de criação já com as extras. */
  mensalidade: number | null;
  /** "Base do pacote" e uma linha por resposta que somou. */
  linhas: LinhaCalculo[];
};

export const prazoCalculado = (dias: number) => `estimado: ${formatarPrazo(dias)}`;

/** Serviço a partir das respostas: preço, horas, prazo e linhas de "como chegamos a esse valor". */
export function calcularServico(id: string, respostas: Respostas = {}): CalculoServico | null {
  const modelo = servicoOrcamentoPorId(id);
  const servico = servicoPorId(id);
  if (!modelo || !servico) return null;

  const comum = {
    id,
    nome: modelo.nome,
    combinavel: modelo.combinavel,
    aPartirDe: servico.preco.tipo === "aPartirDe",
    estimativa: false,
    mensalidade: null as number | null,
  };

  if (servico.preco.tipo === "sobConsulta") {
    return {
      ...comum,
      tipoPreco: "sobConsulta",
      preco: null,
      horasExtras: 0,
      horas: null,
      dias: null,
      prazo: servico.prazoTexto ?? "Combinado na proposta",
      linhas: [],
    };
  }

  // Fixo ou "a partir de": base mais as horas extras das respostas.
  const provisorio = !!servico.horasProvisorias;
  const horasBase = servico.horasBase ?? 0;
  const linhas: LinhaCalculo[] = [
    { rotulo: "Base do pacote", valor: servico.preco.valor, horas: provisorio ? 0 : horasBase },
  ];
  let horasExtras = 0;
  for (const p of modelo.perguntas) {
    const h = horasExtrasDa(p, respostas);
    if (h <= 0) continue;
    horasExtras += h;
    const ids = opcoesMarcadas(p, respostas);
    const detalhe =
      p.tipo === "multipla"
        ? `${ids.length - (p.gratis ?? 0)} a mais`
        : (p.opcoes.find((o) => o.id === ids[0])?.rotulo ?? "");
    linhas.push({ rotulo: `${p.curto}: ${detalhe}`, valor: h * VALOR_HORA_EXTRA, horas: h });
  }
  const preco = servico.preco.valor + horasExtras * VALOR_HORA_EXTRA;
  const mensalidade = servico.mensalidade ? mensalidadeDe(preco) : null;

  // Bots (horas provisórias): o preço varia pelas respostas, mas o prazo nunca é calculado.
  if (provisorio) {
    return {
      ...comum,
      tipoPreco: servico.preco.tipo,
      estimativa: true,
      preco,
      horasExtras,
      horas: null,
      dias: null,
      prazo: prazoACombinar,
      mensalidade,
      linhas,
    };
  }

  const horas = horasBase + horasExtras;
  const dias = prazoEmDias(horas);
  return {
    ...comum,
    tipoPreco: servico.preco.tipo,
    preco,
    horasExtras,
    horas,
    dias,
    prazo: prazoCalculado(dias),
    mensalidade,
    linhas,
  };
}

// Carrinho -------------------------------------------------------------------------------

export type DescontoAplicado = {
  tipo: "combo" | "piloto";
  percentual: number;
  /** R$ abatidos da soma de tabela. */
  valor: number;
  /** Ex.: "combo 15%" ou "piloto 10%". */
  rotulo: string;
};

export type Carrinho = {
  itens: CalculoServico[];
  /** Soma de tabela dos itens com preço (sem desconto). */
  somaTabela: number;
  desconto: DescontoAplicado | null;
  /** Soma de tabela menos o desconto. Itens sob consulta ficam de fora. */
  total: number;
  /** Algum item é "a partir de" ou só estimativa: o total é um mínimo. */
  totalAPartirDe: boolean;
  temSobConsulta: boolean;
  /** Prazo único dos combináveis: horas somadas, ceil(soma / horas por dia) + 1 dia de revisão. */
  prazoCombinaveis: { horas: number; dias: number; texto: string } | null;
  /** Prazos dos demais itens (bots, sistema). */
  prazosOutros: { nome: string; texto: string }[];
  /** Soma das mensalidades dos bots (hospedagem à parte). */
  mensalidade: number;
};

export type OpcoesCarrinho = {
  piloto?: DescontoPiloto | null;
  combo2?: number;
  combo3?: number;
};

/** Percentual do combo conforme a quantidade de combináveis (0 abaixo de 2). */
export function percentualCombo(qtdCombinaveis: number, combo2 = COMBO_2, combo3 = COMBO_3): number {
  if (qtdCombinaveis >= 3) return combo3;
  if (qtdCombinaveis === 2) return combo2;
  return 0;
}

/**
 * Carrinho a partir dos ids e das respostas atuais de cada serviço.
 * Combo e piloto não se somam: vale o que abate mais reais. O combo incide só nos combináveis;
 * o piloto, em toda a criação (combináveis e bots), nunca em sistema ou mensalidade.
 * Em empate, vale o combo.
 */
export function calcularCarrinho(
  ids: string[],
  respostas: Record<string, Respostas> = {},
  { piloto = descontoPilotoAtual(), combo2 = COMBO_2, combo3 = COMBO_3 }: OpcoesCarrinho = {},
): Carrinho {
  const itens = [...new Set(ids)]
    .map((id) => calcularServico(id, respostas[id] ?? {}))
    .filter((i): i is CalculoServico => i !== null);

  const soma = (lista: CalculoServico[]) => lista.reduce((acc, i) => acc + (i.preco ?? 0), 0);
  const combinaveis = itens.filter((i) => i.combinavel);
  const criacao = itens.filter((i) => i.tipoPreco !== "sobConsulta");
  const somaTabela = soma(itens);

  const pctCombo = percentualCombo(combinaveis.length, combo2, combo3);
  const somaCombo = soma(combinaveis);
  const valorCombo = pctCombo > 0 ? somaCombo - comDesconto(somaCombo, pctCombo) : 0;
  const somaCriacao = soma(criacao);
  const valorPiloto = piloto ? somaCriacao - comDesconto(somaCriacao, piloto.percentual) : 0;

  let desconto: DescontoAplicado | null = null;
  if (valorCombo > 0 && valorCombo >= valorPiloto) {
    desconto = { tipo: "combo", percentual: pctCombo, valor: valorCombo, rotulo: `combo ${pctCombo}%` };
  } else if (piloto && valorPiloto > 0) {
    desconto = { tipo: "piloto", percentual: piloto.percentual, valor: valorPiloto, rotulo: `piloto ${piloto.percentual}%` };
  }

  const horas = combinaveis.reduce((acc, i) => acc + (i.horas ?? 0), 0);
  let prazoCombinaveis: Carrinho["prazoCombinaveis"] = null;
  if (horas > 0) {
    const dias = prazoEmDias(horas);
    prazoCombinaveis = { horas, dias, texto: prazoCalculado(dias) };
  }

  return {
    itens,
    somaTabela,
    desconto,
    total: somaTabela - (desconto?.valor ?? 0),
    totalAPartirDe: itens.some((i) => i.aPartirDe || i.estimativa),
    temSobConsulta: itens.some((i) => i.tipoPreco === "sobConsulta"),
    prazoCombinaveis,
    prazosOutros: itens.filter((i) => !i.combinavel).map((i) => ({ nome: i.nome, texto: i.prazo })),
    mensalidade: itens.reduce((acc, i) => acc + (i.mensalidade ?? 0), 0),
  };
}

// Textos ---------------------------------------------------------------------------------

/** Preço de um item em texto: "a partir de R$ 450", "sob consulta". */
export function textoPrecoItem(i: CalculoServico): string {
  if (i.preco === null) return "sob consulta";
  const prefixo = i.aPartirDe ? "a partir de " : i.estimativa ? "estimativa " : "";
  return `${prefixo}${brl(i.preco)}`;
}

function linhaDoItem(i: CalculoServico): string {
  const horas = i.horas !== null ? `; ${horasTexto(i.horas)}` : "";
  return `- ${i.nome}: ${textoPrecoItem(i)}${horas}; ${i.prazo}`;
}

/** Serviços, valores e prazos, um por linha: vai na mensagem do WhatsApp e no campo `pedido` do e-mail. */
export function textoPedido(c: Carrinho): string {
  return c.itens.map(linhaDoItem).join("\n");
}

/** Total estimado em texto: campo `estimativa` do e-mail e fim da mensagem. */
export function textoEstimativa(c: Carrinho): string {
  if (c.itens.length === 0) return "";
  const partes = [`${c.totalAPartirDe ? "a partir de " : ""}${brl(c.total)}`];
  if (c.desconto) partes.push(`com ${c.desconto.rotulo}`);
  if (c.mensalidade > 0) partes.push(`mais mensalidade de ${brl(c.mensalidade)} (hospedagem à parte)`);
  if (c.temSobConsulta) partes.push("sistema sob consulta, fora do total");
  return partes.join(", ");
}

/** Mensagem do WhatsApp: serviços, valores e total estimado. Carrinho vazio: mensagem genérica. */
export function mensagemCarrinho(c: Carrinho): string {
  if (c.itens.length === 0) return "Quero fazer um orçamento.";
  const linhas = ["Quero fazer um orçamento com:", textoPedido(c)];
  if (c.prazoCombinaveis && c.itens.filter((i) => i.combinavel).length > 1) {
    linhas.push(`Prazo dos combináveis, juntos: ${c.prazoCombinaveis.texto}`);
  }
  linhas.push(`Total estimado: ${textoEstimativa(c)} (estimativa, confirmada na conversa).`);
  return linhas.join("\n");
}

/** Link do WhatsApp com a origem escrita e o carrinho na mensagem. */
export function linkWhatsappCarrinho(c: Carrinho, origem = "negocios-carrinho"): string {
  return whatsappLink(site.whatsapp, mensagemComOrigem(origem, mensagemCarrinho(c)));
}
