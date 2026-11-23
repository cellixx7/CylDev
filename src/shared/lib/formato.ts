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

const mesesCurtos = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/** "2026-01" → "Jan". */
export function formatarMes(chave: string): string {
  return mesesCurtos[Number(chave.slice(5, 7)) - 1] ?? chave;
}

/** "2026-01-05" → "05/01". */
export function formatarDia(chave: string): string {
  return `${chave.slice(8, 10)}/${chave.slice(5, 7)}`;
}

/** Ex.: 0.4321 → "43%". */
export function percentual(parte: number, total: number): string {
  return total > 0 ? `${Math.round((parte / total) * 100)}%` : "0%";
}
