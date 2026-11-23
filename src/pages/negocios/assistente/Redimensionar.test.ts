import { describe, expect, it } from "vitest";
import { LIMITES, limitar, limitesDaJanela } from "./Redimensionar";

describe("tamanho do painel do chat", () => {
  it("respeita o mínimo de 320 × 420", () => {
    expect(limitar({ largura: 100, altura: 100 }, 1280, 800)).toEqual({ largura: 320, altura: 420 });
  });

  it("nunca passa da janela, com folga para a margem e o botão do Cyl", () => {
    const t = limitar({ largura: 5000, altura: 5000 }, 1280, 800);
    expect(t.largura).toBe(1280 - LIMITES.margemFixa - LIMITES.margem - LIMITES.reservaBotao);
    expect(t.altura).toBe(800 - LIMITES.margemFixa - LIMITES.margem);
  });

  it("mantém o que já está dentro dos limites", () => {
    expect(limitar({ largura: 500, altura: 600 }, 1280, 800)).toEqual({ largura: 500, altura: 600 });
  });

  it("janela pequena: o mínimo cede e o painel continua dentro da tela", () => {
    const l = limitesDaJanela(800, 440);
    expect(l.minAltura).toBeLessThanOrEqual(l.maxAltura);
    expect(limitar({ largura: 700, altura: 700 }, 800, 440).altura).toBeLessThanOrEqual(440 - LIMITES.margemFixa);
  });
});
