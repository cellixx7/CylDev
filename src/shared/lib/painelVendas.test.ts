import { describe, expect, it } from "vitest";
import { negocios } from "../../content/textos";
import { maior, visaoDoFoco } from "./painelVendas";

const p = negocios.apresentacao.painel;
const soma = (v: { valor: number }[]) => v.reduce((s, x) => s + x.valor, 0);
const perto = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThan(1e-6);

describe("painel de exemplo: números com um item em foco", () => {
  it("a matriz mês x categoria fecha com os meses e com as fatias da pizza", () => {
    p.vendasMesCategoria.forEach((linha, i) => expect(soma(linha.map((valor) => ({ valor }))), p.meses[i].nome).toBe(p.meses[i].valor));
    const totalAno = p.meses.reduce((s, m) => s + m.valor, 0);
    p.categorias.forEach((c, i) => {
      const coluna = p.vendasMesCategoria.reduce((s, linha) => s + linha[i], 0);
      expect(Math.round((coluna / totalAno) * 100), c.nome).toBe(c.valor);
    });
  });

  it("sem foco, os três gráficos são os números do ano", () => {
    const v = visaoDoFoco(null);
    v.meses.forEach((m, i) => perto(m.valor, p.meses[i].valor));
    v.regioes.forEach((r, i) => perto(r.valor, p.regioes[i].valor));
    perto(v.total, 214);
  });

  it("em cada foco, as três séries fecham com o mesmo total", () => {
    for (const foco of [
      ...p.meses.map((m) => ({ tipo: "mes" as const, nome: m.nome })),
      ...p.categorias.map((c) => ({ tipo: "categoria" as const, nome: c.nome })),
      ...p.regioes.map((r) => ({ tipo: "regiao" as const, nome: r.nome })),
    ]) {
      const v = visaoDoFoco(foco);
      const alvo = foco.tipo === "mes" ? v.categorias : foco.tipo === "categoria" ? v.meses : v.meses;
      perto(soma(alvo), v.total);
      if (foco.tipo === "mes") perto(soma(v.regioes), v.total);
      if (foco.tipo === "categoria") perto(soma(v.regioes), v.total);
      if (foco.tipo === "regiao") perto(soma(v.categorias), v.total);
    }
  });

  it("dezembro: o gráfico dos meses fica inteiro e o total é o do mês", () => {
    const v = visaoDoFoco({ tipo: "mes", nome: "Dez" });
    expect(Math.round(v.total)).toBe(30);
    expect(v.meses).toHaveLength(12);
    expect(maior(v.categorias).nome).toBe("Camisetas");
  });

  it("camisetas: vendas por mês e por região só delas", () => {
    const v = visaoDoFoco({ tipo: "categoria", nome: "Camisetas" });
    expect(Math.round(v.total)).toBe(81);
    expect(v.meses[11].valor).toBeCloseTo(12, 6);
  });

  it("sudeste: total da região", () => {
    expect(Math.round(visaoDoFoco({ tipo: "regiao", nome: "Sudeste" }).total)).toBe(96);
  });

  it("os itens de maior valor do ano são Dezembro, Camisetas e Sudeste", () => {
    const v = visaoDoFoco(null);
    expect(maior(v.meses).nome).toBe("Dez");
    expect(maior(v.categorias).nome).toBe("Camisetas");
    expect(maior(v.regioes).nome).toBe("Sudeste");
  });
});
