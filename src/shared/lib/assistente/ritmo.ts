import type { Bloco, Estado } from "./motor";

// Ritmo da conversa: quanto esperar antes de uma resposta, como "digitá-la" aos poucos e que hora mostrar no balão.
// Lógica pura (sem timer): a interface só pergunta "quanto" e "o que mostrar agora".

/** Espera antes da resposta (indicador "Digitando…"): de 2 s a 5 s, crescendo com o tamanho. Com movimento reduzido, só um respiro. */
export const ESPERA_MIN_MS = 2000;
export const ESPERA_MAX_MS = 5000;

export function atrasoMs(_estado: Estado, caracteres: number, movimentoReduzido = false): number {
  if (movimentoReduzido) return 250;
  return Math.min(ESPERA_MAX_MS, Math.max(ESPERA_MIN_MS, ESPERA_MIN_MS + Math.round(caracteres * 3)));
}

/** Total de caracteres visíveis dos blocos. */
export function tamanhoDosBlocos(blocos: Bloco[]): number {
  return blocos.reduce((soma, b) => soma + (b.tipo === "lista" ? b.itens.reduce((n, i) => n + i.length, 0) : b.texto.length), 0);
}

/** Quantos caracteres entram a cada passo do efeito de digitação (a resposta inteira leva cerca de 2 s no máximo). */
export function passoDigitacao(total: number): number {
  return Math.max(2, Math.ceil(total / 80));
}

/** Os primeiros `n` caracteres da resposta, mantendo a forma dos blocos (o que ainda não "foi digitado" não aparece). */
export function recortarBlocos(blocos: Bloco[], n: number): Bloco[] {
  const saida: Bloco[] = [];
  let resta = n;
  for (const b of blocos) {
    if (resta <= 0) break;
    if (b.tipo === "lista") {
      const itens: string[] = [];
      for (const item of b.itens) {
        if (resta <= 0) break;
        itens.push(item.slice(0, resta));
        resta -= item.length;
      }
      saida.push({ tipo: "lista", itens });
    } else {
      saida.push({ ...b, texto: b.texto.slice(0, resta) });
      resta -= b.texto.length;
    }
  }
  return saida;
}

/** "14:05", no horário do aparelho. */
export function horaCurta(data: Date): string {
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
