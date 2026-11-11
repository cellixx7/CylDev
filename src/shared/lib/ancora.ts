/** Id da âncora da URL ("#bots" -> "bots"). Hash vazio ou malformado devolve `null`. */
export function idDaAncora(hash: string): string | null {
  const texto = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!texto) return null;
  try {
    return decodeURIComponent(texto);
  } catch {
    return null;
  }
}

/**
 * Rola até a seção da âncora da URL depois que a página montou.
 * O conteúdo é montado pelo React; quando o navegador tenta rolar até `#secao` ao carregar, a seção ainda pode
 * não existir, e a página fica no topo (quem vem de outra página por "/#orcamento" ou "/comunidade/#bots").
 * Só age com a página ainda no topo: se o navegador já rolou ou restaurou a posição, nada muda.
 */
export function rolarParaAncora(): void {
  const id = idDaAncora(window.location.hash);
  if (!id || window.scrollY !== 0) return;
  document.getElementById(id)?.scrollIntoView();
}
