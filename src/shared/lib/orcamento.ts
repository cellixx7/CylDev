import {
  complexidades,
  mensalidadeBots,
  vagasPiloto10,
  vagasPiloto5,
  type Complexidade,
} from "../../content/orcamento";
import type { Servico } from "../../content/servicos";
import { prazoEmDias } from "./prazo";

export type DescontoPiloto = { percentual: 10 | 5; restam: number };

/** Faixa de desconto em vigor: primeiro as vagas de 10%, depois as de 5%. Sem vaga, `null`. */
export function descontoPilotoAtual(v10 = vagasPiloto10, v5 = vagasPiloto5): DescontoPiloto | null {
  if (v10 > 0) return { percentual: 10, restam: v10 };
  if (v5 > 0) return { percentual: 5, restam: v5 };
  return null;
}

/** Mensalidade de um bot: fração do preço de criação. A hospedagem é somada à parte. */
export function mensalidadeDe(precoCriacao: number, fracao = mensalidadeBots.fracaoDaCriacao): number {
  return Math.round(precoCriacao * fracao);
}

export type Estimativa = { horas: number; preco: number; dias: number; aPartirDe: boolean };

/**
 * Estimativa da calculadora: horas e preço do pacote básico multiplicados pela complexidade.
 * Só funciona para pacotes com preço (fixo ou "a partir de") e horas base.
 */
export function estimar(s: Servico, complexidade: Complexidade): Estimativa | null {
  if (!s.horasBase || (s.preco.tipo !== "fixo" && s.preco.tipo !== "aPartirDe")) return null;
  const fator = complexidades[complexidade].fator;
  const horas = s.horasBase * fator;
  return {
    horas,
    preco: Math.round(s.preco.valor * fator),
    dias: prazoEmDias(horas),
    aPartirDe: s.preco.tipo === "aPartirDe",
  };
}
