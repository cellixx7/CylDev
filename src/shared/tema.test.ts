import { afterEach, describe, expect, it, vi } from "vitest";
import { lerTema } from "./tema";

function armazenamento(valor: string | null) {
  vi.stubGlobal("localStorage", { getItem: () => valor, setItem: () => undefined });
}

afterEach(() => vi.unstubAllGlobals());

describe("lerTema", () => {
  it("sem escolha salva, usa o padrão da área", () => {
    armazenamento(null);
    expect(lerTema("negocios", "claro")).toBe("claro");
    expect(lerTema("comunidade", "escuro")).toBe("escuro");
  });

  it("a escolha salva vale mais que o padrão", () => {
    armazenamento("escuro");
    expect(lerTema("negocios", "claro")).toBe("escuro");
    armazenamento("claro");
    expect(lerTema("comunidade", "escuro")).toBe("claro");
  });

  it("valor inválido ou localStorage bloqueado cai no padrão", () => {
    armazenamento("roxo");
    expect(lerTema("negocios", "claro")).toBe("claro");
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("bloqueado");
      },
    });
    expect(lerTema("negocios", "claro")).toBe("claro");
  });
});
