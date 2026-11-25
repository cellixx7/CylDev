// Plugin do Vite que faz o site existir em vários idiomas, sem tocar nos arquivos de texto originais.
//
// Como funciona: o português é o build normal (na raiz). Para cada outro idioma o build roda de novo com
// IDIOMA=<codigo> (ver scripts/build-idiomas.mjs) e este plugin:
//   1. troca cada arquivo de src/content/ por src/content/i18n/<codigo>/<mesmo caminho>, quando ele existe
//      (sem a tradução, o arquivo original em português continua valendo);
//   2. define __IDIOMA__ (lido por src/shared/i18n/rota.ts);
//   3. acerta o HTML: lang, dir, og:locale, título e descrição traduzidos, canonical e hreflang;
//   4. no português, injeta o script que leva o visitante ao idioma do navegador (robôs ficam de fora).
import { existsSync, readFileSync } from "node:fs";
import { resolve, relative, sep } from "node:path";
import type { Plugin } from "vite";
import { arquivosTraduzidos, lerLista } from "./textos-arquivos.ts";
import { aplicar, coletar } from "./textos-ast.ts";
import { codigos, dadosDoIdioma, idiomaOriginal, idiomaReserva, idiomas, prefixoDoIdioma, type CodigoIdioma } from "../src/shared/i18n/idiomas.ts";

/** Páginas que entram no sitemap e levam hreflang. obrigado e 404 ficam de fora (noindex). */
export const paginasPublicas = ["/", "/como-funciona/", "/comunidade/", "/perguntas/", "/termos/", "/privacidade/", "/acessibilidade/"];

type MetaPagina = { titulo: string; descricao: string; ogAlt?: string };
export type MetaIdioma = Record<string, MetaPagina> & { _: { pular: string; ogAlt: string; ogAltComunidade: string } };

export function lerMeta(raiz: string, codigo: CodigoIdioma): MetaIdioma | null {
  const arquivo = resolve(raiz, "src/content/i18n", codigo, "meta.json");
  return existsSync(arquivo) ? (JSON.parse(readFileSync(arquivo, "utf8")) as MetaIdioma) : null;
}

/** Script do <head> das páginas em português: leva o visitante ao idioma que ele prefere. Sem robôs, sem loop. */
export function scriptDeteccao(): string {
  const lista = JSON.stringify(codigos.filter((c) => c !== idiomaOriginal));
  return `<script>(function(){try{var L=${lista};if(/bot|crawl|spider|slurp|bing|yandex|baidu|duckduck|facebookexternalhit|lighthouse|pagespeed|headless/i.test(navigator.userAgent))return;var d=null;try{d=localStorage.getItem("idioma")}catch(e){}if(d!=="${idiomaOriginal}"&&L.indexOf(d)<0){d="${idiomaReserva}";var p=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||""];for(var i=0;i<p.length;i++){var c=String(p[i]).toLowerCase().split(/[-_]/)[0];if(c==="${idiomaOriginal}"||L.indexOf(c)>-1){d=c;break}}}if(d==="${idiomaOriginal}"||L.indexOf(d)<0)return;location.replace("/"+d+location.pathname+location.search+location.hash)}catch(e){}})();</script>`;
}

function trocarMeta(html: string, atributo: string, valor: string, novo: string): string {
  const e = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return html.replace(new RegExp(`(<meta ${atributo}="${valor}" content=")[^"]*(")`), (_m, a: string, b: string) => `${a}${e(novo)}${b}`);
}

export function idiomasPlugin(codigo: CodigoIdioma, raiz: string): Plugin {
  const dados = dadosDoIdioma(codigo);
  const meta = codigo === idiomaOriginal ? null : lerMeta(raiz, codigo);
  const pastaContent = resolve(raiz, "src/content") + sep;
  const pastaTraducao = resolve(raiz, "src/content/i18n") + sep;

  // Traduções do idioma: identificador do texto -> texto traduzido (ver scripts/textos-ast.ts).
  const traducoes = new Map<string, string>();
  if (codigo !== idiomaOriginal) {
    for (const arquivo of ["textos.txt", "juridico.txt"]) for (const l of lerLista(resolve(raiz, "src/content/i18n", codigo, arquivo))) traducoes.set(l.id, l.texto);
  }

  return {
    name: "idiomas",
    enforce: "pre",
    config: () => ({
      define: { __IDIOMA__: JSON.stringify(codigo) },
      // Nos outros idiomas, fontes e imagens continuam sendo servidas da raiz (/fonts/...): não copia /public de novo.
      ...(codigo === idiomaOriginal ? {} : { publicDir: false as const }),
    }),
    async resolveId(source, importer, opcoes) {
      if (codigo === idiomaOriginal || !importer || source.startsWith("\0")) return null;
      const r = await this.resolve(source, importer, { ...opcoes, skipSelf: true });
      if (!r || r.external || !r.id.startsWith(pastaContent) || r.id.startsWith(pastaTraducao)) return null;
      const outro = resolve(pastaTraducao, codigo, relative(pastaContent, r.id));
      return existsSync(outro) ? outro : null;
    },
    async transform(codigoFonte, id) {
      if (codigo === idiomaOriginal || traducoes.size === 0) return null;
      const arquivo = id.split("?")[0];
      const rel = relative(raiz, arquivo).replaceAll("\\", "/");
      if (!arquivo.startsWith(raiz) || !arquivosTraduzidos(rel)) return null;
      const itens = await coletar(codigoFonte, rel.endsWith(".tsx") ? "tsx" : "ts");
      const novo = aplicar(codigoFonte, itens, traducoes);
      return novo === codigoFonte ? null : { code: novo, map: null };
    },
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        const caminho = ctx.path.replace(/index\.html$/, "");
        const publica = paginasPublicas.includes(caminho);
        let h = html.replace(/<html lang="[^"]*"/, `<html lang="${dados.bcp47}"${dados.rtl ? ' dir="rtl"' : ""}`);
        h = h.replace('property="og:locale" content="pt_BR"', `property="og:locale" content="${dados.og}"`);

        if (codigo !== idiomaOriginal) {
          const m = meta?.[caminho];
          if (m) {
            h = h.replace(/<title>[^<]*<\/title>/, `<title>${m.titulo.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</title>`);
            h = trocarMeta(h, "name", "description", m.descricao);
            h = trocarMeta(h, "property", "og:title", m.titulo);
            h = trocarMeta(h, "property", "og:description", m.descricao);
          }
          if (meta) {
            const alt = caminho === "/comunidade/" ? meta._.ogAltComunidade : meta._.ogAlt;
            h = trocarMeta(h, "property", "og:image:alt", m?.ogAlt ?? alt);
            h = h.replace(">Pular para o conteúdo<", `>${meta._.pular}<`);
          }
          // Endereço da própria página neste idioma (a imagem OG continua na raiz).
          h = h.replace(/(<link rel="canonical" href="__URL__)(\/[^"]*")/, `$1${prefixoDoIdioma(codigo)}$2`);
          h = h.replace(/(<meta property="og:url" content="__URL__)(\/[^"]*")/, `$1${prefixoDoIdioma(codigo)}$2`);
        }

        if (publica) {
          const alternativas = idiomas.map((i) => `    <link rel="alternate" hreflang="${i.bcp47}" href="__URL__${prefixoDoIdioma(i.codigo)}${caminho}" />`);
          alternativas.push(`    <link rel="alternate" hreflang="x-default" href="__URL__${prefixoDoIdioma(idiomaReserva)}${caminho}" />`);
          h = h.replace("</head>", `${alternativas.join("\n")}\n  </head>`);
        }
        if (codigo === idiomaOriginal && caminho !== "/404.html") h = h.replace("</head>", `    ${scriptDeteccao()}\n  </head>`);
        return h;
      },
    },
  };
}
