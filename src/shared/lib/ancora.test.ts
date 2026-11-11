import { describe, expect, it } from "vitest";
import { idDaAncora } from "./ancora";

describe("idDaAncora", () => {
  it("tira o # e decodifica", () => {
    expect(idDaAncora("#bots")).toBe("bots");
    expect(idDaAncora("#or%C3%A7amento")).toBe("orçamento");
    expect(idDaAncora("contato")).toBe("contato");
  });

  it("hash vazio ou malformado: sem âncora", () => {
    expect(idDaAncora("")).toBeNull();
    expect(idDaAncora("#")).toBeNull();
    expect(idDaAncora("#%E0%A4%A")).toBeNull();
  });
});
