import { describe, expect, it } from "vitest";
import { site } from "../../../content/site";
import { negocios } from "../../../content/textos";
import { linksDoMenu } from "./CabecalhoNegocios";

describe("menu de Negócios", () => {
  it("mostra as seções com a flag ligada, na ordem em que aparecem na página", () => {
    expect(site.menuSecoes).toEqual({ sobre: true, entregas: true, contato: true });
    expect(linksDoMenu.map((l) => l.rotulo)).toEqual(["Orçamento", "Como funciona", "Entregas", "Sobre", "Contato"]);
  });

  it("toda seção do menu tem flag em site.menuSecoes (desligar a flag tira o link)", () => {
    expect(negocios.nav.map((l) => l.secao).filter(Boolean)).toEqual(["entregas", "sobre", "contato"]);
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
