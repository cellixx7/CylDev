import { VALOR_HORA_EXTRA } from "../../content/orcamento";
import { servicoOrcamentoPorId } from "../../content/perguntas";
import {
  comDesconto,
  descontoPilotoAtual,
  horasExtrasDa,
  mudaOValor,
  opcoesMarcadas,
  percentualCombo,
  type Carrinho,
  type OpcoesCarrinho,
  type Respostas,
} from "./orcamento";

// Explicação do valor ("Por que esse valor?"). Função pura que lê o resultado de calcularCarrinho():
// o preço e o desconto escolhido vêm de lá; aqui só se separa o que já foi somado e se calcula, para
// comparar, quanto a outra regra de desconto abateria. Não há regra de preço nova.

export type ExtraExplicado = {
  /** Nome curto da pergunta. */
  pergunta: string;
  /** Resposta que somou: o rótulo da opção, ou os marcados e quantos passam do que já está incluso. */
  resposta: string;
  /** Horas extras da resposta. `null` nos bots (horas provisórias): o tempo é combinado na conversa. */
  horas: number | null;
  /** R$ que a resposta soma. */
  valor: number;
};

export type ItemExplicado = {
  id: string;
  nome: string;
  sobConsulta: boolean;
  /** Bot com horas provisórias: sem hora e sem prazo calculados ("a combinar"). */
  horasACombinar: boolean;
  /** Preço-base do pacote. `null` no sob consulta. */
  precoBase: number | null;
  extras: ExtraExplicado[];
  /** Perguntas (nome curto) ainda sem resposta. */
  semResposta: string[];
  /** Preço de tabela do serviço: base mais extras. `null` no sob consulta. */
  preco: number | null;
  mensalidade: number | null;
  /** Perguntas que mudam o valor e hoje não somam nada: responder de outro jeito pode aumentar as horas. */
  mudariam: string[];
};

export type DescontoExplicado = {
  tipo: "combo" | "piloto";
  percentual: number;
  /** R$ abatidos. */
  valor: number;
  /** Soma de tabela sobre a qual o desconto incide (combináveis no combo; criação no piloto). */
  base: number;
  /** Combináveis no carrinho (explica o percentual do combo). */
  qtdCombinaveis: number;
  /** O outro desconto, que também se aplicaria, mas abateria menos (ou o mesmo, no empate). */
  alternativa: { tipo: "combo" | "piloto"; percentual: number; valor: number } | null;
  /** Combo e piloto abateriam o mesmo valor: vale o combo. */
  empate: boolean;
};

export type ExplicacaoValor = {
  itens: ItemExplicado[];
  somaTabela: number;
  desconto: DescontoExplicado | null;
  total: number;
  /** Total é um mínimo ("a partir de") ou estimativa. */
  totalAPartirDe: boolean;
  temSobConsulta: boolean;
  /** Mensalidade dos bots, à parte do total. */
  mensalidade: number;
  /** Há pergunta sem resposta em algum serviço. */
  temSemResposta: boolean;
};

function detalheDaResposta(id: string, perguntaId: string, respostas: Respostas): string {
  const p = servicoOrcamentoPorId(id)?.perguntas.find((q) => q.id === perguntaId);
  if (!p) return "";
  const marcadas = opcoesMarcadas(p, respostas);
  const rotulos = marcadas.map((m) => p.opcoes.find((o) => o.id === m)?.rotulo ?? m);
  if (p.tipo === "multipla") {
    const extra = marcadas.length - (p.gratis ?? 0);
    return `${rotulos.join(", ")} (${extra} a mais)`;
  }
  return rotulos[0] ?? "";
}

/**
 * Detalha, serviço por serviço, como chegamos ao valor do carrinho. A soma do que é mostrado
 * (preço-base + extras - desconto) é sempre igual a `carrinho.total`.
 */
export function explicarValor(
  carrinho: Carrinho,
  respostas: Record<string, Respostas> = {},
  { piloto = descontoPilotoAtual(), combo2, combo3 }: OpcoesCarrinho = {},
): ExplicacaoValor {
  const itens: ItemExplicado[] = carrinho.itens.map((c) => {
    const modelo = servicoOrcamentoPorId(c.id)!;
    const dele = respostas[c.id] ?? {};
    const semHora = c.estimativa && c.horas === null;
    const extras: ExtraExplicado[] = [];
    const semResposta: string[] = [];
    const mudariam: string[] = [];

    if (c.preco !== null) {
      for (const p of modelo.perguntas) {
        const h = horasExtrasDa(p, dele);
        if (opcoesMarcadas(p, dele).length === 0) semResposta.push(p.curto);
        if (h > 0) {
          extras.push({
            pergunta: p.curto,
            resposta: detalheDaResposta(c.id, p.id, dele),
            horas: semHora ? null : h,
            valor: h * VALOR_HORA_EXTRA,
          });
        } else if (mudaOValor(p)) {
          mudariam.push(p.curto);
        }
      }
    }

    return {
      id: c.id,
      nome: c.nome,
      sobConsulta: c.tipoPreco === "sobConsulta",
      horasACombinar: semHora,
      precoBase: c.preco === null ? null : c.linhas[0].valor,
      extras,
      semResposta,
      preco: c.preco,
      mensalidade: c.mensalidade,
      mudariam,
    };
  });

  let desconto: DescontoExplicado | null = null;
  if (carrinho.desconto) {
    const soma = (lista: typeof carrinho.itens) => lista.reduce((acc, i) => acc + (i.preco ?? 0), 0);
    const combinaveis = carrinho.itens.filter((i) => i.combinavel);
    const criacao = carrinho.itens.filter((i) => i.tipoPreco !== "sobConsulta");
    const pctCombo = percentualCombo(combinaveis.length, combo2, combo3);
    const somaCombo = soma(combinaveis);
    const somaCriacao = soma(criacao);
    const valorCombo = pctCombo > 0 ? somaCombo - comDesconto(somaCombo, pctCombo) : 0;
    const valorPiloto = piloto ? somaCriacao - comDesconto(somaCriacao, piloto.percentual) : 0;

    const d = carrinho.desconto;
    const outro =
      d.tipo === "combo"
        ? valorPiloto > 0 && piloto
          ? { tipo: "piloto" as const, percentual: piloto.percentual, valor: valorPiloto }
          : null
        : valorCombo > 0
          ? { tipo: "combo" as const, percentual: pctCombo, valor: valorCombo }
          : null;
    desconto = {
      tipo: d.tipo,
      percentual: d.percentual,
      valor: d.valor,
      base: d.tipo === "combo" ? somaCombo : somaCriacao,
      qtdCombinaveis: combinaveis.length,
      alternativa: outro,
      empate: !!outro && outro.valor === d.valor,
    };
  }

  return {
    itens,
    somaTabela: carrinho.somaTabela,
    desconto,
    total: carrinho.total,
    totalAPartirDe: carrinho.totalAPartirDe,
    temSobConsulta: carrinho.temSobConsulta,
    mensalidade: carrinho.mensalidade,
    temSemResposta: itens.some((i) => i.semResposta.length > 0),
  };
}

/** Soma do que o detalhamento mostra: preços-base mais extras, menos o desconto. Deve ser igual ao total do carrinho. */
export function somaDoDetalhamento(e: ExplicacaoValor): number {
  const itens = e.itens.reduce((acc, i) => acc + (i.precoBase ?? 0) + i.extras.reduce((a, x) => a + x.valor, 0), 0);
  return itens - (e.desconto?.valor ?? 0);
}
