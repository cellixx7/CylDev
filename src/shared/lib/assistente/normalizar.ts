import { girias } from "../../../content/assistente";

// Normalização de texto para o assistente: minúsculo, sem acento, sem pontuação e com um radical leve em português.
// Frases do vocabulário e mensagens do visitante passam pela MESMA função, então "preços" e "preço" se encontram.

export function semAcento(texto: string): string {
  return texto.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/** Palavras do texto, sem acento e sem pontuação. Mantém letras, números e o "%". */
export function palavras(texto: string): string[] {
  return semAcento(texto)
    // Letra esticada ("oiii", "preeeço", "valeuuu"): três ou mais iguais viram uma. Dígitos ficam (1000).
    .replace(/([a-z])\1{2,}/g, "$1")
    .replace(/[^a-z0-9%]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .flatMap((p) => {
      // Gíria, abreviação e erro de digitação conhecidos (ver `girias`): "nn" vira "nao", "sisteminha" vira "sistema".
      const troca = Object.hasOwn(girias, p) ? girias[p] : p;
      return troca === "" ? [] : troca.split(" ");
    });
}

/** Radical leve: tira o plural ("preços" → "preco", "valores" → "valor"). Palavras curtas ficam como estão. */
export function radical(palavra: string): string {
  if (palavra.length > 4 && /[rzn]es$/.test(palavra)) return palavra.slice(0, -2);
  if (palavra.length > 3 && palavra.endsWith("s")) return palavra.slice(0, -1);
  return palavra;
}

/** Texto normalizado e com radicais, palavra a palavra, separado por espaço. É a forma que o motor compara. */
export function chave(texto: string): string {
  return palavras(texto).map(radical).join(" ");
}

/** Texto só com letras, números e espaço, sem acento (sem radical): é onde rodam as expressões de proteção. */
export function textoLimpo(texto: string): string {
  return palavras(texto).join(" ");
}

/** A frase aparece no texto como palavras inteiras? Os dois já vêm de `chave`. */
export function contemFrase(chaveTexto: string, chaveFrase: string): boolean {
  if (!chaveFrase) return false;
  return ` ${chaveTexto} `.includes(` ${chaveFrase} `);
}

/** Distância de edição até 1 (troca, falta, sobra ou inversão de duas letras vizinhas). Barata e suficiente para erro de digitação. */
export function distanciaAte1(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.length === b.length) {
    if (a.slice(i + 1) === b.slice(i + 1)) return true; // uma letra trocada
    return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2); // duas letras vizinhas invertidas
  }
  const [curta, longa] = a.length < b.length ? [a, b] : [b, a];
  return curta.slice(i) === longa.slice(i + 1);
}

/** Palavras comuns que não ajudam a achar o assunto. */
const palavrasVazias = new Set(
  "a o as os um uma uns umas de do da dos das em no na nos nas por para pra com sem e ou que se eu voce vc meu minha seu sua isso esse essa este esta ao aos mais muito ja tem ter e ser sao foi vai vou quero queria como qual quais quando onde qual quem posso pode preciso gostaria me te".split(" "),
);

/** Radicais que carregam assunto, sem as palavras vazias. */
export function radicaisUteis(texto: string): string[] {
  return palavras(texto)
    .filter((p) => !palavrasVazias.has(p) && p.length > 2)
    .map(radical);
}
