// Variação das respostas sem sorteio: o assistente alterna entre as versões de um texto conforme o turno da conversa. Assim a
// mesma pergunta feita em momentos diferentes não recebe sempre as mesmas palavras, e os testes continuam previsíveis (sem
// Math.random). Na primeira resposta (turno 0) vale sempre a primeira versão.

/** Escolhe uma versão do texto pelo turno (e por um deslocamento, para dois textos da mesma resposta não andarem juntos). */
export function variar<T>(opcoes: readonly T[], turno: number, deslocamento = 0): T {
  if (opcoes.length === 0) throw new Error("variar: lista vazia");
  return opcoes[(turno + deslocamento) % opcoes.length];
}
