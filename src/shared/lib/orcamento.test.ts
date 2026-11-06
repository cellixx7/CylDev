import { describe, expect, it } from "vitest";
import { servicoPorId } from "../../content/servicos";
import { descontoPilotoAtual, estimar, mensalidadeDe } from "./orcamento";

describe("descontoPilotoAtual", () => {
  it("usa 10% enquanto houver vaga, depois 5%", () => {
    expect(descontoPilotoAtual(5, 5)).toEqual({ percentual: 10, restam: 5 });
    expect(descontoPilotoAtual(0, 3)).toEqual({ percentual: 5, restam: 3 });
  });

  it("some quando as vagas acabam", () => {
    expect(descontoPilotoAtual(0, 0)).toBeNull();
  });
});

describe("mensalidadeDe", () => {
  it("é 10% do preço de criação", () => {
    expect(mensalidadeDe(300)).toBe(30);
    expect(mensalidadeDe(500)).toBe(50);
  });
});

describe("estimar", () => {
  it("dobra horas e preço no caso complexo", () => {
    expect(estimar(servicoPorId("painel")!, "basico")).toEqual({ horas: 4, preco: 200, dias: 3, aPartirDe: false });
    expect(estimar(servicoPorId("painel")!, "complexo")).toEqual({ horas: 8, preco: 400, dias: 5, aPartirDe: false });
  });

  it("planilha básica sai em 2 dias úteis", () => {
    expect(estimar(servicoPorId("planilha")!, "basico")?.dias).toBe(2);
  });

  it("ignora pacotes sem preço calculável", () => {
    expect(estimar(servicoPorId("aulas")!, "basico")).toBeNull();
    expect(estimar(servicoPorId("sistema")!, "basico")).toBeNull();
  });
});
