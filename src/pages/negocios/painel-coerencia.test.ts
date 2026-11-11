import { describe, expect, it } from "vitest";
import { negocios } from "../../content/textos";

const painel = negocios.apresentacao.painel;
const mil = (texto: string) => Number(texto.replace(/[^\d,]/g, "").replace(",", "."));

describe("painel de exemplo: coerência dos números", () => {
  it("soma dos meses = vendas no ano = soma das regiões (R$ mil)", () => {
    const meses = painel.meses.reduce((s, m) => s + m.valor, 0);
    const regioes = painel.regioes.reduce((s, r) => s + r.valor, 0);
    const kpi = mil(painel.indicadores.find((i) => i.nome === "Vendas no ano")!.valor);
    expect(meses).toBe(kpi);
    expect(regioes).toBe(kpi);
  });

  it("continua rotulado como exemplo", () => {
    expect(painel.selo).toBe("Exemplo");
    expect(painel.rotulo).toMatch(/Exemplo/);
  });
});
