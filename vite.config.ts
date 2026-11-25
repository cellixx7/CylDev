import { execSync } from "node:child_process";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { site } from "./src/content/site.ts";
import { acessibilidade } from "./src/content/textos/acessibilidade.ts";
import { perguntasFrequentes } from "./src/content/textos/perguntasFrequentes.ts";
import { privacidade } from "./src/content/textos/privacidade.ts";
import { termos } from "./src/content/textos/termos.ts";
import type { PaginaDeTexto } from "./src/content/textos/tipos.ts";
import { jsonLdNegocios, jsonLdSite, noscriptNegocios, noscriptPaginaTexto, scriptJsonLd } from "./src/shared/lib/seo.ts";

// A Netlify injeta `URL` no build. Sem ela, vale o endereço padrão de site.ts.
const urlDoSite = (process.env.URL ?? site.urlPadrao).replace(/\/$/, "");

function urlAbsoluta(): Plugin {
  return {
    name: "url-absoluta",
    transformIndexHtml: (html) => html.replaceAll("__URL__", urlDoSite),
  };
}

/**
 * Liga a troca de página animada (View Transitions entre documentos) já no <head> de todo HTML.
 * No `npm run dev` o CSS do Vite chega por JavaScript, depois do primeiro render, e a página nova ainda não teria
 * o `@view-transition` quando o navegador decide animar. As animações em si ficam em tailwind.css.
 */
function transicaoDePagina(): Plugin {
  return {
    name: "transicao-de-pagina",
    transformIndexHtml: () => [
      {
        tag: "style",
        children: "@media (prefers-reduced-motion:no-preference){@view-transition{navigation:auto}}",
        injectTo: "head",
      },
    ],
  };
}

// Páginas públicas para o sitemap (obrigado e 404 ficam de fora e levam noindex).
const paginasPublicas = ["/", "/como-funciona/", "/comunidade/", "/perguntas/", "/termos/", "/privacidade/", "/acessibilidade/"];

/** Data (AAAA-MM-DD) do último commit, para o `lastmod` do sitemap. Sem git (ou sem histórico), vale a data do build. */
function dataDoConteudo(): string {
  try {
    const data = execSync("git log -1 --format=%cs", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) return data;
  } catch {
    // Sem git: segue para a data do build.
  }
  return new Date().toISOString().slice(0, 10);
}

/** Páginas de leitura: o texto inteiro também vai num <noscript>, para ser lido sem JavaScript. */
const paginasDeLeitura: Record<string, PaginaDeTexto> = {
  "/termos/index.html": termos,
  "/privacidade/index.html": privacidade,
  "/perguntas/index.html": perguntasFrequentes,
  "/acessibilidade/index.html": acessibilidade,
};

/**
 * SEO no build: na home, JSON-LD no <head> e <noscript> com a frase, o preço de partida e os contatos
 * (o hero é React; sem JS a página ficaria vazia). Nas páginas de leitura, o texto inteiro no <noscript>. Gera também robots.txt e sitemap.xml (com lastmod),
 * com a mesma URL que troca o __URL__ dos HTML.
 */
function seo(): Plugin {
  return {
    name: "seo",
    transformIndexHtml(html, ctx) {
      const leitura = paginasDeLeitura[ctx.path];
      if (leitura) return html.replace('<div id="raiz"></div>', `${noscriptPaginaTexto(leitura)}\n    <div id="raiz"></div>`);
      if (ctx.path !== "/index.html") return html;
      return html
        .replace("</head>", `    ${scriptJsonLd(jsonLdSite(urlDoSite))}\n    ${scriptJsonLd(jsonLdNegocios(urlDoSite))}\n  </head>`)
        .replace('<div id="raiz"></div>', `${noscriptNegocios()}\n    <div id="raiz"></div>`);
    },
    generateBundle() {
      const lastmod = dataDoConteudo();
      const urls = paginasPublicas.map((p) => `  <url><loc>${urlDoSite}${p}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n");
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${urlDoSite}/sitemap.xml\n`,
      });
    },
  };
}

const raiz = import.meta.dirname;

export default defineConfig({
  plugins: [react(), tailwindcss(), urlAbsoluta(), transicaoDePagina(), seo()],
  build: {
    rollupOptions: {
      input: {
        inicio: resolve(raiz, "index.html"),
        comoFunciona: resolve(raiz, "como-funciona/index.html"),
        comunidade: resolve(raiz, "comunidade/index.html"),
        privacidade: resolve(raiz, "privacidade/index.html"),
        termos: resolve(raiz, "termos/index.html"),
        perguntas: resolve(raiz, "perguntas/index.html"),
        acessibilidade: resolve(raiz, "acessibilidade/index.html"),
        obrigado: resolve(raiz, "obrigado/index.html"),
        naoEncontrado: resolve(raiz, "404.html"),
      },
      output: {
        // React e react-dom num arquivo próprio (vendor-react-*.js), com nome que diz o que é.
        manualChunks(id) {
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "vendor-react";
        },
      },
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
