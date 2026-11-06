import { parametros } from "../../content/orcamento";

/** Dias úteis de entrega: horas divididas pelas horas por dia, mais os dias de revisão. */
export function prazoEmDias(
  horas: number,
  horasPorDiaUtil = parametros.horasPorDiaUtil,
  diasDeRevisao = parametros.diasDeRevisao,
): number {
  if (!Number.isFinite(horas) || horas <= 0 || horasPorDiaUtil <= 0) {
    throw new RangeError("Horas e horas por dia precisam ser positivas.");
  }
  return Math.ceil(horas / horasPorDiaUtil) + diasDeRevisao;
}

export function formatarPrazo(dias: number): string {
  return dias === 1 ? "1 dia útil" : `${dias} dias úteis`;
}
