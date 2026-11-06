export type Tema = "claro" | "escuro";

const chave = (area: string) => `tema-${area}`;

export function lerTema(area: string, padrao: Tema): Tema {
  try {
    const salvo = localStorage.getItem(chave(area));
    if (salvo === "claro" || salvo === "escuro") return salvo;
  } catch {
    // localStorage pode estar bloqueado; segue com o padrão.
  }
  return padrao;
}

export function salvarTema(area: string, tema: Tema): void {
  try {
    localStorage.setItem(chave(area), tema);
  } catch {
    // Sem armazenamento, a escolha vale só nesta visita.
  }
}

export function aplicarTema(tema: Tema): void {
  document.documentElement.dataset.theme = tema;
  const cor = getComputedStyle(document.documentElement).getPropertyValue("--color-fundo").trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", cor);
}
