import { describe, expect, it } from "vitest";
import { site } from "../../../content/site";
import { negocios } from "../../../content/textos";
import { linksDoMenu } from "./CabecalhoNegocios";

describe("menu de Negócios", () => {
  it("esconde Sobre, Entregas e Contato enquanto as flags estão desligadas", () => {
    expect(site.menuSecoes).toEqual({ sobre: false, entregas: false, contato: false });
    expect(linksDoMenu.map((l) => l.rotulo)).toEqual(["Orçamento", "Como funciona"]);
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
