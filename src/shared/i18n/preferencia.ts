// Idioma escolhido pelo visitante no botão. Fica em localStorage ("idioma") e é lido pelo script de detecção
// que o build põe no <head> das páginas em português (scripts/vite-idiomas.ts). Sempre em try/catch.
import { eIdioma, type CodigoIdioma } from "./idiomas";

export const chaveIdioma = "idioma";

export function lerIdioma(): CodigoIdioma | null {
  try {
    const salvo = localStorage.getItem(chaveIdioma);
    return eIdioma(salvo) ? salvo : null;
  } catch {
    return null;
  }
}

export function salvarIdioma(codigo: CodigoIdioma): void {
  try {
    localStorage.setItem(chaveIdioma, codigo);
  } catch {
    // Sem armazenamento, a escolha vale só nesta visita.
  }
}
