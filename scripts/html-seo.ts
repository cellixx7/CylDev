// Textos que o plugin `seo` do vite.config.ts injeta no HTML (noscript e JSON-LD). Fica num arquivo à parte porque é
// carregado com runnerImport já com o plugin de idiomas: assim os textos saem no idioma do build, não só em português.
import { acessibilidade } from "../src/content/textos/acessibilidade.ts";
import { perguntasFrequentes } from "../src/content/textos/perguntasFrequentes.ts";
import { privacidade } from "../src/content/textos/privacidade.ts";
import { termos } from "../src/content/textos/termos.ts";
import type { PaginaDeTexto } from "../src/content/textos/tipos.ts";
import { jsonLdNegocios, jsonLdSite, noscriptNegocios, noscriptPaginaTexto, scriptJsonLd } from "../src/shared/lib/seo.ts";

/** Páginas de leitura: o texto inteiro também vai num <noscript>, para ser lido sem JavaScript. */
export const paginasDeLeitura: Record<string, PaginaDeTexto> = {
  "/termos/index.html": termos,
  "/privacidade/index.html": privacidade,
  "/perguntas/index.html": perguntasFrequentes,
  "/acessibilidade/index.html": acessibilidade,
};

export { jsonLdNegocios, jsonLdSite, noscriptNegocios, noscriptPaginaTexto, scriptJsonLd };
