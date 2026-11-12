// Parâmetros do orçamento e da calculadora. Valores definidos pelo Marcelo em 02/11/2026.
// `null` = ainda sem decisão: o site não mostra nada que dependa desse valor.

export const parametros = {
  horasPorDiaUtil: 2,
  diasDeRevisao: 1,
  limiteHorasCalculadora: 40,
  /** Ajustes depois da entrega e funcionalidade nova nos bots. */
  valorHoraAvulsa: 50,
};

/** R$ por hora de trabalho extra que uma resposta do orçamento acrescenta ao preço base. */
export const VALOR_HORA_EXTRA = parametros.valorHoraAvulsa;

// Combo (regra oficial, confirmada pelo Marcelo em 12/11/2026), para os serviços combináveis
// (planilha, painel, automação, site de uma página): 1 serviço, preço normal; 2, desconto de 10%; 3 ou mais, 15%.
/** 10% com 2 combináveis no carrinho. */
export const COMBO_2 = 10;
/** 15% com 3 ou mais combináveis no carrinho. */
export const COMBO_3 = 15;

// Contadores reais das vagas de piloto. Diminua 1 a cada venda fechada com desconto:
// primeiro o de 10%; quando ele zerar, o de 5%. Com os dois em 0, o aviso some.
// O desconto vale só sobre a criação, nunca sobre a mensalidade.
export const vagasPiloto10 = 5;
export const vagasPiloto5 = 5;

/** Mensalidade dos bots: fração do preço de criação por mês, mais o custo da hospedagem. */
export const mensalidadeBots = {
  fracaoDaCriacao: 0.1,
  mesesPlanoAdiantado: 6,
  /** Desconto do plano de 6 meses pago adiantado. Sem valor definido, o site só diz "há desconto". */
  descontoPlanoAdiantado: null as number | null,
};
