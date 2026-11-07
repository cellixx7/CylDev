export function brl(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

/** Ex.: 8 → "8 h"; 7.5 → "7,5 h". */
export function horasTexto(horas: number): string {
  return `${horas.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} h`;
}
