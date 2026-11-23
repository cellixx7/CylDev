import { conceitos, intencoes, type Intencao } from "../../../content/assistente";
import { topicos } from "../../../content/textos/assistenteSaber";
import type { Tratamento } from "../../../content/textos/assistente";
import { chave, contemFrase, distanciaAte1, palavras, radical, textoLimpo } from "./normalizar";

// Detecção de conceitos e de intenção. "quanto custa", "valor" e "preço" viram o mesmo conceito (`preco`), e o conceito
// vira a intenção `preco`. Toda a vocabulário mora em content/assistente.ts.

type FraseCompilada = { conceito: string; chave: string; umaPalavra: boolean; palavras: number };

let compiladas: FraseCompilada[] | null = null;

/** Prefixo dos conceitos que são tópicos do "saber geral" (`t:procv`, `t:sigilo`...). */
export const PREFIXO_TOPICO = "t:";

function frases(): FraseCompilada[] {
  if (compiladas) return compiladas;
  // Os tópicos entram na mesma rede dos conceitos: assim ganham, de graça, acento, plural, gírias e erro de digitação.
  const todos: Record<string, string[]> = { ...conceitos, ...Object.fromEntries(topicos.map((t) => [PREFIXO_TOPICO + t.id, t.frases])) };
  compiladas = Object.entries(todos).flatMap(([conceito, lista]) =>
    lista.map((frase) => {
      const c = chave(frase);
      return { conceito, chave: c, umaPalavra: !c.includes(" "), palavras: c.split(" ").length };
    }),
  );
  return compiladas;
}

/** Um conceito achado na mensagem: a força e o trecho (já normalizado) que o fez casar. */
export type Casamento = { forca: number; trecho: string };

/** Mesma palavra, ou até uma letra de diferença em palavra de 5+ letras com a mesma inicial ("dinamca", "planilah"). */
const palavraParecida = (digitada: string, esperada: string) =>
  digitada === esperada || (esperada.length >= 5 && digitada.length >= 5 && digitada[0] === esperada[0] && distanciaAte1(digitada, esperada));

/** A frase (várias palavras) aparece na mensagem com no máximo UMA palavra digitada errado? Devolve o trecho digitado, ou null. */
function frasePertoDe(radicais: string[], frase: string[]): string | null {
  for (let i = 0; i + frase.length <= radicais.length; i++) {
    let erros = 0;
    for (let j = 0; j < frase.length && erros <= 1; j++) {
      if (radicais[i + j] === frase[j]) continue;
      if (palavraParecida(radicais[i + j], frase[j])) erros++;
      else erros = 2;
    }
    if (erros <= 1) return radicais.slice(i, i + frase.length).join(" ");
  }
  return null;
}

/**
 * Conceitos presentes na mensagem, com a força de cada um: o número de palavras da frase mais longa que casou (frase longa é
 * mais específica que palavra solta). Ids como `preco`, `svc:planilha` ou `t:procv`. Tolera uma palavra digitada errado.
 */
export function casamentosDe(texto: string): Map<string, Casamento> {
  const achados = new Map<string, Casamento>();
  const c = chave(texto);
  if (!c) return achados;
  const radicais = palavras(texto).map(radical);
  for (const f of frases()) {
    let trecho: string | null = null;
    if (contemFrase(c, f.chave)) trecho = f.chave;
    else if (f.umaPalavra) {
      // Erro de digitação em palavra de 5 letras ou mais ("orcamneto", "planilah"): uma letra de diferença, mesma inicial.
      if (f.chave.length >= 5) trecho = radicais.find((r) => r.length >= 5 && r[0] === f.chave[0] && distanciaAte1(r, f.chave)) ?? null;
    } else if (f.palavras >= 2 && f.chave.length >= 9) {
      trecho = frasePertoDe(radicais, f.chave.split(" "));
    }
    if (trecho !== null && f.palavras > (achados.get(f.conceito)?.forca ?? 0)) achados.set(f.conceito, { forca: f.palavras, trecho });
  }
  return achados;
}

export function conceitosPontuados(texto: string): Map<string, number> {
  return new Map([...casamentosDe(texto)].map(([k, v]) => [k, v.forca]));
}

/** A mensagem sem o trecho que casou um tópico: o que sobra mostra se ela também faz uma pergunta de preço, prazo etc. */
export function semTrecho(texto: string, trecho: string): string {
  return ` ${chave(texto)} `.replace(` ${trecho} `, " ").trim();
}

/** Conceitos presentes na mensagem (ids como `preco` ou `svc:planilha`). */
export function conceitosDe(texto: string): Set<string> {
  return new Set(conceitosPontuados(texto).keys());
}

/** Melhor intenção pela soma de conceitos; empate vale a ordem de `intencoes`. `null` se nenhuma bate. */
export function intencaoDe(achados: Set<string>): Intencao | null {
  let melhor: Intencao | null = null;
  let pontos = 0;
  for (const i of intencoes) {
    const p = i.conceitos.filter((c) => achados.has(c)).length;
    if (p > pontos) {
      melhor = i.id;
      pontos = p;
    }
  }
  return melhor;
}

/** Ids dos serviços citados. `automacao?` (só "automação") vira os dois candidatos, para o chat perguntar qual. */
export function servicosCitados(achados: Set<string>): string[] {
  const ids: string[] = [];
  for (const c of achados) {
    if (c === "svc:automacao?") continue;
    if (c.startsWith("svc:")) ids.push(c.slice(4));
  }
  if (achados.has("svc:automacao?") && !ids.includes("automacao") && !ids.includes("python")) ids.push("automacao", "python");
  return ids;
}

/**
 * Tratamento que a pessoa deixou claro sobre si ("obrigada", "sou dono", "sou empresária"). `null` = não dá para saber:
 * o assistente fica nas formas neutras. Nunca se deduz o gênero pelo nome.
 */
export function tratamentoDe(texto: string): Tratamento {
  const l = textoLimpo(texto);
  if (/\b(a senhora|obrigada|brigada|sou (a )?(dona|empresaria|autonoma|professora)|estou sozinha)\b/.test(l)) return "a senhora";
  if (/\b(o senhor|obrigado|sou (o )?(dono|empresario|autonomo|professor)|estou sozinho)\b/.test(l)) return "o senhor";
  return null;
}
