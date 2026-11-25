import { describe, expect, it } from "vitest";
import {
  codigos,
  enderecoNoIdioma,
  idiomaDasPreferencias,
  prefixoDoIdioma,
  separarIdioma,
} from "./idiomas";

describe("idiomaDasPreferencias", () => {
  it("usa o primeiro idioma da lista que o site tem", () => {
    expect(idiomaDasPreferencias(["pt-BR", "en"])).toBe("pt");
    expect(idiomaDasPreferencias(["es-MX"])).toBe("es");
    expect(idiomaDasPreferencias(["fr-CA", "pt"])).toBe("fr");
  });
  it("pula o que o site não tem e cai no inglês quando nenhum serve", () => {
    expect(idiomaDasPreferencias(["de-DE", "it"])).toBe("en");
    expect(idiomaDasPreferencias([])).toBe("en");
    expect(idiomaDasPreferencias(undefined)).toBe("en");
  });
  it("pega um idioma seguinte se o primeiro não existe", () => {
    expect(idiomaDasPreferencias(["de", "es"])).toBe("es");
  });
  it("só devolve idiomas no ar", () => {
    expect(codigos).toContain(idiomaDasPreferencias(["zz", "pt"]));
  });
});

describe("endereços", () => {
  it("o português não leva prefixo", () => {
    expect(prefixoDoIdioma("pt")).toBe("");
    expect(enderecoNoIdioma("/termos/", "pt")).toBe("/termos/");
  });
  it("os outros levam o código", () => {
    expect(enderecoNoIdioma("/termos/#pagamento", "en")).toBe("/en/termos/#pagamento");
    expect(enderecoNoIdioma("/", "es")).toBe("/es/");
  });
  it("não mexe em links externos nem em âncoras soltas", () => {
    expect(enderecoNoIdioma("https://exemplo.com", "en")).toBe("https://exemplo.com");
    expect(enderecoNoIdioma("//exemplo.com", "en")).toBe("//exemplo.com");
    expect(enderecoNoIdioma("#topo", "en")).toBe("#topo");
  });
  it("separa o idioma do caminho", () => {
    expect(separarIdioma("/en/termos/")).toEqual({ idioma: "en", caminho: "/termos/" });
    expect(separarIdioma("/en")).toEqual({ idioma: "en", caminho: "/" });
    expect(separarIdioma("/termos/")).toEqual({ idioma: "pt", caminho: "/termos/" });
    expect(separarIdioma("/zz/termos/")).toEqual({ idioma: "pt", caminho: "/zz/termos/" });
  });
});
