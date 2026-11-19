import { padroesDeInjecao } from "../../../content/assistente";
import { textoLimpo } from "./normalizar";

// Proteções do assistente. Entrada: pedidos para burlar as regras. Saída: número que não existe no site.
// A proteção que importa é por código (estas funções), e não por um pedido educado em um prompt.

/** A mensagem tenta mudar as regras, revelar instruções ou fazer o assistente "virar" outra coisa? */
export function tentaBurlarRegras(texto: string): boolean {
  const limpo = textoLimpo(texto);
  return padroesDeInjecao.some((p) => p.test(limpo));
}

/** Corta mensagens muito longas (a primeira linha de defesa contra texto colado com instruções escondidas). */
export function limitar(texto: string, maximo: number): { texto: string; cortado: boolean } {
  const t = texto.trim();
  return t.length > maximo ? { texto: t.slice(0, maximo), cortado: true } : { texto: t, cortado: false };
}

/** Números do texto, como aparecem: "R$ 1.200", "10%", "2" (dias, horas). Sem pontuação final. */
export function numerosDoTexto(texto: string): string[] {
  return (texto.match(/\d[\d.,]*\d|\d/g) ?? []).map((n) => n.replace(/[.,]$/, ""));
}

/**
 * Todo número da resposta existe nos fatos do site? Barra preço, prazo e desconto inventados.
 * `permitidos` são os textos de onde a resposta pode tirar números (ver conhecimento.fatos).
 */
export function validarSaida(resposta: string, permitidos: string[]): { ok: boolean; estranhos: string[] } {
  const aceitos = new Set(permitidos.flatMap(numerosDoTexto));
  const estranhos = numerosDoTexto(resposta).filter((n) => !aceitos.has(n));
  return { ok: estranhos.length === 0, estranhos };
}
