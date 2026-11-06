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

const raiz = import.meta.dirname;

export default defineConfig({
  plugins: [react(), tailwindcss(), urlAbsoluta()],
  build: {
    rollupOptions: {
      input: {
        inicio: resolve(raiz, "index.html"),
        home: resolve(raiz, "home/index.html"),
        negocios: resolve(raiz, "negocios/index.html"),
        comoFunciona: resolve(raiz, "negocios/como-funciona/index.html"),
        comunidade: resolve(raiz, "comunidade/index.html"),
        obrigado: resolve(raiz, "obrigado/index.html"),
        naoEncontrado: resolve(raiz, "404.html"),
      },
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
