// Texto das páginas de leitura (Termos, privacidade, perguntas): aceita links no formato [rótulo](endereço).
// Nada de HTML no conteúdo: o componente TextoRico monta os <a>.

export type ParteTexto = { texto: string; href?: string };

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Só endereços do próprio site (`/...`, `#...`), `https://`, `mailto:` e `tel:` viram link. */
export function hrefSeguro(href: string): boolean {
  return /^(\/(?!\/)|#|https:\/\/|mailto:|tel:)/.test(href);
}

/** Divide o texto em trechos simples e links. Link com endereço fora da lista segura sai como texto. */
export function partesDoTexto(texto: string): ParteTexto[] {
  const partes: ParteTexto[] = [];
  let fim = 0;
  for (const m of texto.matchAll(LINK)) {
    const [tudo, rotulo, href] = m;
    if (m.index > fim) partes.push({ texto: texto.slice(fim, m.index) });
    partes.push(hrefSeguro(href) ? { texto: rotulo, href } : { texto: rotulo });
    fim = m.index + tudo.length;
  }
  if (fim < texto.length) partes.push({ texto: texto.slice(fim) });
  return partes;
}

/** O texto sem a marcação de link (para comparar em teste ou usar em atributo). */
export function textoSemLinks(texto: string): string {
  return partesDoTexto(texto).map((p) => p.texto).join("");
}
