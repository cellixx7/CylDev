import { describe, expect, it } from "vitest";
import { servicosDa } from "../../content/servicos";
import { site } from "../../content/site";
import { negocios as t } from "../../content/textos";
import { brl } from "./formato";
import { escaparHtml, jsonLdNegocios, noscriptNegocios, precoDePartida, scriptJsonLd } from "./seo";

describe("precoDePartida", () => {
  it("é o menor preço fixo ou 'a partir de' de Negócios", () => {
    const valores = servicosDa("negocios").flatMap((s) => (s.preco.tipo === "sobConsulta" ? [] : [s.preco.valor]));
    expect(precoDePartida().valor).toBe(Math.min(...valores));
  });

  it("ignora sob consulta e falha sem nenhum preço", () => {
    const base = servicosDa("negocios")[0];
    expect(() => precoDePartida([{ ...base, preco: { tipo: "sobConsulta" } }])).toThrow();
  });
});

describe("JSON-LD da home", () => {
  const dados = jsonLdNegocios("https://exemplo.netlify.app");
  const ofertas = (dados.hasOfferCatalog as { itemListElement: { itemOffered: { name: string }; priceSpecification?: Record<string, unknown> }[] })
    .itemListElement;

  it("é um ProfessionalService com os contatos de site.ts", () => {
    expect(dados["@type"]).toBe("ProfessionalService");
    expect(dados.url).toBe("https://exemplo.netlify.app/");
    expect(dados.telephone).toBe(`+${site.whatsapp}`);
    expect(dados.email).toBe(site.email);
  });

  it("lista os serviços disponíveis de Negócios com o preço de tabela, sem inventar preço", () => {
    const disponiveis = servicosDa("negocios").filter((s) => s.disponivel);
    expect(ofertas.map((o) => o.itemOffered.name)).toEqual(disponiveis.map((s) => s.nome));
    disponiveis.forEach((s, i) => {
      const preco = ofertas[i].priceSpecification;
      if (s.preco.tipo === "fixo") expect(preco).toMatchObject({ price: s.preco.valor, priceCurrency: "BRL" });
      else if (s.preco.tipo === "aPartirDe") expect(preco).toMatchObject({ minPrice: s.preco.valor, priceCurrency: "BRL" });
      else expect(preco).toBeUndefined();
    });
  });

  it("o script não fecha a tag antes da hora", () => {
    const script = scriptJsonLd({ texto: "</script><b>" });
    expect(script.match(/<\/script>/g)).toHaveLength(1);
    expect(JSON.parse(script.replace(/^<script[^>]*>|<\/script>$/g, ""))).toEqual({ texto: "</script><b>" });
  });
});

describe("noscript da home", () => {
  const html = noscriptNegocios();

  it("tem a frase principal, o preço de partida e os contatos", () => {
    const partida = precoDePartida();
    expect(html).toMatch(/^<noscript>[\s\S]*<\/noscript>$/);
    expect(html).toContain(escaparHtml(t.apresentacao.subtitulo));
    expect(html).toContain(brl(partida.valor));
    expect(html).toContain(`https://wa.me/${site.whatsapp}`);
    expect(html).toContain(`mailto:${site.email}`);
  });

  it("escapa o texto", () => {
    expect(escaparHtml(`<a href="x">&</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;");
  });
});
