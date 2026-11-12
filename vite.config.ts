import { resolve } from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { site } from "./src/content/site.ts";

// A Netlify injeta `URL` no build. Sem ela, vale o endereço padrão de site.ts.
const urlDoSite = (process.env.URL ?? site.urlPadrao).replace(/\/$/, "");

function urlAbsoluta(): Plugin {
  return {
    name: "url-absoluta",
    transformIndexHtml: (html) => html.replaceAll("__URL__", urlDoSite),
  };
}

// Páginas públicas para o sitemap (obrigado e 404 ficam de fora e levam noindex).
const paginasPublicas = ["/", "/como-funciona/", "/comunidade/", "/privacidade/"];

/** Gera robots.txt e sitemap.xml no build, com a mesma URL que troca o __URL__ dos HTML. */
function seo(): Plugin {
  return {
    name: "seo",
    generateBundle() {
      const urls = paginasPublicas.map((p) => `  <url><loc>${urlDoSite}${p}</loc></url>`).join("\n");
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
  plugins: [react(), tailwindcss(), urlAbsoluta(), seo()],
  build: {
    rollupOptions: {
      input: {
        inicio: resolve(raiz, "index.html"),
        comoFunciona: resolve(raiz, "como-funciona/index.html"),
        comunidade: resolve(raiz, "comunidade/index.html"),
        privacidade: resolve(raiz, "privacidade/index.html"),
        obrigado: resolve(raiz, "obrigado/index.html"),
        naoEncontrado: resolve(raiz, "404.html"),
      },
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
