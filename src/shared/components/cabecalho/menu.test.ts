import { describe, expect, it } from "vitest";
import { site } from "../../../content/site";
import { negocios } from "../../../content/textos";
import { linksDoMenu } from "./CabecalhoNegocios";

describe("menu de Negócios", () => {
  it("mostra Sobre e esconde Entregas e Contato enquanto as flags estão desligadas", () => {
    expect(site.menuSecoes).toEqual({ sobre: true, entregas: false, contato: false });
    expect(linksDoMenu.map((l) => l.rotulo)).toEqual(["Orçamento", "Como funciona", "Sobre"]);
  });

  it("as seções continuam definidas em textos, prontas para religar", () => {
    expect(negocios.nav.map((l) => l.secao).filter(Boolean)).toEqual(["sobre", "entregas", "contato"]);
  });
});

describe("atalho da Comunidade", () => {
  it("tem rótulo curto visível e mantém o aria-label longo contendo o texto visível", () => {
    const a = negocios.atalhoComunidade;
    expect(a.rotuloCurto).toBe("Comunidade");
    expect(a.rotulo.toLowerCase()).toContain(a.rotuloCurto.toLowerCase());
  });
});

describe("menu da Comunidade", () => {
  it("Contato aponta para a seção da própria página, não para a home de Negócios", async () => {
    const { comunidade } = await import("../../../content/textos");
    const contato = comunidade.nav.find((l) => l.rotulo === "Contato")!;
    expect(contato.href).toBe("#contato");
    expect(comunidade.nav.every((l) => l.href.startsWith("#"))).toBe(true);
  });
});
