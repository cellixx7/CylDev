// Conteúdo que vai direto no HTML da home, sem depender do JavaScript: <noscript> e dados estruturados (JSON-LD).
// Usado pelo plugin `seo` do vite.config.ts no build e pelo hero (preço de partida). Tudo sai de src/content/.
import { servicosDa, type Servico } from "../../content/servicos";
import { site } from "../../content/site";
import { negocios as t } from "../../content/textos";
import { brl } from "./formato";

/** Menor preço de partida entre os pacotes de Negócios (fixo ou "a partir de"), direto de servicos.ts. */
export function precoDePartida(lista: Servico[] = servicosDa("negocios")): { nome: string; valor: number } {
  const pacotes = lista.flatMap((s) => (s.preco.tipo === "fixo" || s.preco.tipo === "aPartirDe" ? [{ nome: s.nome, valor: s.preco.valor }] : []));
  if (pacotes.length === 0) throw new Error("Nenhum pacote de Negócios com preço.");
  return pacotes.reduce((a, b) => (b.valor < a.valor ? b : a));
}

/** Escapa texto para HTML (conteúdo e atributos). */
export function escaparHtml(texto: string): string {
  return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * JSON-LD `ProfessionalService` da home. Só dados que já estão no site: nome, descrição, contatos e os pacotes
 * de Negócios com o preço de tabela (fixo vira `price`, "a partir de" vira `minPrice`, sob consulta vai sem preço).
 */
export function jsonLdNegocios(url: string): Record<string, unknown> {
  const partida = precoDePartida();
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.nome,
    description: `${t.apresentacao.titulo} ${t.apresentacao.subtitulo}`,
    url: `${url}/`,
    image: `${url}/og-negocios-v1.png`,
    telephone: `+${site.whatsapp}`,
    email: site.email,
    areaServed: { "@type": "Country", name: "Brasil" },
    availableLanguage: "pt-BR",
    priceRange: t.apresentacao.aPartirDe(brl(partida.valor)),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços",
      itemListElement: servicosDa("negocios")
        .filter((s) => s.disponivel)
        .map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.nome, description: s.resultado },
          ...(s.preco.tipo === "sobConsulta"
            ? {}
            : {
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "BRL",
                  ...(s.preco.tipo === "fixo" ? { price: s.preco.valor } : { minPrice: s.preco.valor }),
                },
              }),
        })),
    },
  };
}

/** `<script type="application/ld+json">` pronto para o <head>. `<` vira `\u003c` para o JSON não fechar a tag. */
export function scriptJsonLd(dados: Record<string, unknown>): string {
  return `<script type="application/ld+json">${JSON.stringify(dados).replace(/</g, "\\u003c")}</script>`;
}

/**
 * `<noscript>` da home: frase principal, preço de partida e contatos. Classes do Tailwind só as que o site já usa
 * (o Tailwind não lê este arquivo como HTML; classe nova aqui sairia sem estilo).
 */
export function noscriptNegocios(): string {
  const partida = precoDePartida();
  const e = escaparHtml;
  const link = `class="inline-flex min-h-alvo items-center"`;
  const linhaPartida = `${t.apresentacao.partida(partida.nome)} ${t.apresentacao.aPartirDe(brl(partida.valor))}.`;
  return [
    `<noscript>`,
    `<main id="conteudo" class="mx-auto max-w-hero px-margem pt-6 pb-14">`,
    `<p><strong>${e(site.nome)}</strong></p>`,
    `<h1>${e(t.apresentacao.titulo)}</h1>`,
    `<p>${e(t.apresentacao.subtitulo)}</p>`,
    `<p><strong>${e(linhaPartida)}</strong></p>`,
    `<p>${e(t.semJs.aviso)}</p>`,
    `<ul>`,
    `<li><a ${link} href="https://wa.me/${e(site.whatsapp.replace(/\D/g, ""))}">${e(t.semJs.whatsapp)}</a></li>`,
    `<li><a ${link} href="mailto:${e(site.email)}">${e(t.semJs.email)}</a> (${e(site.email)})</li>`,
    `<li><a ${link} href="/como-funciona/">${e(t.semJs.comoFunciona)}</a></li>`,
    `</ul>`,
    `</main>`,
    `</noscript>`,
  ].join("\n");
}
