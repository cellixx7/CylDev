import { guia, perguntasGuia, resultadosGuia, type PerguntaGuia, type ResultadoGuia } from "../../content/guia";

// Estado do guia "Não sei qual escolher" como funções puras: a lista de opções já escolhidas decide tudo.

export type PassoGuia = { pergunta: PerguntaGuia; resultado: null } | { pergunta: null; resultado: ResultadoGuia };

const perguntaPorId = (id: string) => perguntasGuia.find((p) => p.id === id);
const resultadoPorId = (id: string) => resultadosGuia.find((r) => r.id === id);

/**
 * Onde o guia está depois das escolhas (ids de opção, na ordem). Escolha que não existe na pergunta atual
 * é ignorada, então um estado inválido nunca quebra: no pior caso fica na pergunta em que estava.
 */
export function passoDoGuia(escolhas: string[]): PassoGuia {
  let atual = perguntaPorId(guia.raiz)!;
  for (const id of escolhas) {
    const opcao = atual.opcoes.find((o) => o.id === id);
    if (!opcao) continue;
    const resultado = opcao.resultado ? resultadoPorId(opcao.resultado) : undefined;
    if (resultado) return { pergunta: null, resultado };
    const proxima = opcao.pergunta ? perguntaPorId(opcao.pergunta) : undefined;
    if (proxima) atual = proxima;
  }
  return { pergunta: atual, resultado: null };
}

/** Acrescenta uma escolha, só se ela existir na pergunta atual (depois do resultado não avança). */
export function escolher(escolhas: string[], opcaoId: string): string[] {
  const passo = passoDoGuia(escolhas);
  if (!passo.pergunta || !passo.pergunta.opcoes.some((o) => o.id === opcaoId)) return escolhas;
  return [...escolhas, opcaoId];
}

export const voltar = (escolhas: string[]): string[] => escolhas.slice(0, -1);
