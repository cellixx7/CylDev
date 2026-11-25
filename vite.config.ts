import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { runnerImport, type Plugin } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { site } from "./src/content/site.ts";
import { idiomasPlugin, paginasPublicas } from "./scripts/vite-idiomas.ts";
import { eIdioma, idiomaReserva, idiomas, prefixoDoIdioma, type CodigoIdioma } from "./src/shared/i18n/idiomas.ts";

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

// Idioma deste build: IDIOMA=en vite build (ver scripts/build-idiomas.mjs). Sem a variável, é o português, na raiz.
const idiomaDoBuild: CodigoIdioma = eIdioma(process.env.IDIOMA) ? process.env.IDIOMA : "pt";

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

/**
 * SEO no build: na home, JSON-LD no <head> e <noscript> com a frase, o preço de partida e os contatos
 * (o hero é React; sem JS a página ficaria vazia). Nas páginas de leitura, o texto inteiro no <noscript>. Gera também robots.txt e sitemap.xml (com lastmod),
 * com a mesma URL que troca o __URL__ dos HTML.
 */
function seo(): Plugin {
  // Carregado uma vez, já com o plugin de idiomas (textos traduzidos e links com o prefixo do idioma).
  let textos: Promise<typeof import("./scripts/html-seo.ts")> | undefined;
  const carregar = () =>
    (textos ??= runnerImport<typeof import("./scripts/html-seo.ts")>(resolve(import.meta.dirname, "scripts/html-seo.ts"), {
      configFile: false,
      logLevel: "silent",
      plugins: [idiomasPlugin(idiomaDoBuild, import.meta.dirname)],
    }).then((r) => r.module));
  return {
    name: "seo",
    async transformIndexHtml(html, ctx) {
      const { paginasDeLeitura, jsonLdNegocios, jsonLdSite, noscriptNegocios, noscriptPaginaTexto, scriptJsonLd } = await carregar();
      const leitura = paginasDeLeitura[ctx.path];
      if (leitura) return html.replace('<div id="raiz"></div>', `${noscriptPaginaTexto(leitura)}\n    <div id="raiz"></div>`);
      if (ctx.path !== "/index.html") return html;
      return html
        .replace("</head>", `    ${scriptJsonLd(jsonLdSite(urlDoSite, idiomaDoBuild))}\n    ${scriptJsonLd(jsonLdNegocios(urlDoSite, idiomaDoBuild))}\n  </head>`)
        .replace('<div id="raiz"></div>', `${noscriptNegocios()}\n    <div id="raiz"></div>`);
    },
    generateBundle() {
      const lastmod = dataDoConteudo();
      if (idiomaDoBuild !== "pt") return; // sitemap e robots saem só do build em português, com todos os idiomas
      // Uma entrada por página e idioma, cada uma apontando para as versões nos outros idiomas (xhtml:link).
      const urls = paginasPublicas
        .flatMap((p) =>
          idiomas.map((i) => {
            const alternativas = [...idiomas.map((a) => [a.bcp47, a.codigo] as const), ["x-default", idiomaReserva] as const]
              .map(([hreflang, c]) => `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${urlDoSite}${prefixoDoIdioma(c)}${p}"/>`)
              .join("");
            return `  <url><loc>${urlDoSite}${prefixoDoIdioma(i.codigo)}${p}</loc><lastmod>${lastmod}</lastmod>${alternativas}</url>`;
          }),
        )
        .join("\n");
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
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
  plugins: [idiomasPlugin(idiomaDoBuild, raiz), react(), tailwindcss(), urlAbsoluta(), transicaoDePagina(), seo()],
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
