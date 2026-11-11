import { describe, expect, it } from "vitest";
import { validarTelefone } from "./telefone";

describe("validarTelefone", () => {
  it("aceita número formatado, com ou sem 55", () => {
    expect(validarTelefone("(61) 99629-1118")).toEqual({ valido: true, digitos: "5561996291118" });
    expect(validarTelefone("+55 61 99629-1118")).toEqual({ valido: true, digitos: "5561996291118" });
    expect(validarTelefone("61 3333-4444")).toEqual({ valido: true, digitos: "556133334444" });
    expect(validarTelefone("5561996291118")).toEqual({ valido: true, digitos: "5561996291118" });
  });

  it("DDD 55 de 10 dígitos não perde o prefixo", () => {
    expect(validarTelefone("5533334444")).toEqual({ valido: true, digitos: "555533334444" });
  });

  it("rejeita vazio, só sinais, poucos e muitos dígitos", () => {
    for (const t of ["", "   ", "()-+ ", "(61) 9999", "123456789", "61996291118999", "5561996291118999"]) {
      expect(validarTelefone(t).valido, t).toBe(false);
    }
  });

  it("rejeita DDD fora de 11 a 99", () => {
    expect(validarTelefone("(01) 99629-1118").valido).toBe(false);
    expect(validarTelefone("(10) 3333-4444").valido).toBe(false);
  });

  it("a mensagem de erro é legível", () => {
    const r = validarTelefone("12");
    expect(r.valido).toBe(false);
    if (!r.valido) expect(r.erro).toMatch(/DDD/);
  });
});
