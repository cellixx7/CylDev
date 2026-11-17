import { describe, expect, it } from "vitest";
import { site } from "../../content/site";
import { faltaNaIdentificacao, identificacaoPrestador } from "./prestador";

const base = { nome: "Fulano de Tal", email: "fulano@exemplo.com" };

describe("identificação do prestador", () => {
  it("sem documento nem cidade, mostra só o nome e o e-mail (nada inventado)", () => {
    const s = { ...base, prestador: { documento: null, cidadeUf: null, comprovante: "recibo" as const } };
    expect(identificacaoPrestador(s)).toEqual(["Fulano de Tal", "fulano@exemplo.com"]);
    expect(faltaNaIdentificacao(s)).toEqual(["CPF ou CNPJ", "cidade/UF"]);
  });

  it("com tudo preenchido, a ordem é nome, documento, cidade/UF e e-mail", () => {
    const s = { ...base, prestador: { documento: { tipo: "CNPJ" as const, numero: "00.000.000/0001-00" }, cidadeUf: "Cidade/UF", comprovante: "nota" as const } };
    expect(identificacaoPrestador(s)).toEqual(["Fulano de Tal", "CNPJ 00.000.000/0001-00", "Cidade/UF", "fulano@exemplo.com"]);
    expect(faltaNaIdentificacao(s)).toEqual([]);
  });

  it("o site sempre identifica pelo menos o nome e o e-mail de site.ts", () => {
    expect(identificacaoPrestador()).toContain(site.nome);
    expect(identificacaoPrestador()).toContain(site.email);
  });
});
