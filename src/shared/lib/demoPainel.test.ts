import { describe, expect, it } from "vitest";
import { demoPainel, type FiltroDemo } from "../../content/demoPainel";
import { negocios } from "../../content/textos";
import { reduzirPassos, estadoInicialDemo } from "./demoMaquina";
import { filtroDoPasso, resumoDoFiltro, totalDoMes } from "./demoPainel";

const homeMeses = negocios.apresentacao.painel.meses;

describe("dados da demonstração do painel", () => {
  it("o total de cada mês é o mesmo do painel de exemplo da home", () => {
    for (const m of demoPainel.meses) {
      const mesHome = homeMeses.find((h) => h.nome === m.nome);
      expect(mesHome, m.nome).toBeDefined();
      expect(totalDoMes(m.id), m.nome).toBe(mesHome!.valor);
    }
  });

  it("o total do período é a soma dos meses", () => {
    const soma = demoPainel.meses.reduce((s, m) => s + totalDoMes(m.id), 0);
    expect(resumoDoFiltro("todos").total).toBe(soma);
  });

  it("em todo filtro há um único mais vendido e um único que menos sai (sem empate)", () => {
    for (const f of ["todos", "out", "nov", "dez"] as FiltroDemo[]) {
      const r = resumoDoFiltro(f);
      const iguaisAoMaior = r.vendas.filter((v) => v.valor === r.maisVende.valor);
      const iguaisAoMenor = r.vendas.filter((v) => v.valor === r.menosSai.valor);
      expect(iguaisAoMaior, f).toHaveLength(1);
      expect(iguaisAoMenor, f).toHaveLength(1);
    }
  });

  it("escolher outro mês muda o resultado (novembro: Bonés lideram)", () => {
    expect(resumoDoFiltro("todos").maisVende.nome).toBe("Camisetas");
    expect(resumoDoFiltro("nov").maisVende.nome).toBe("Bonés");
    expect(resumoDoFiltro("dez").total).not.toBe(resumoDoFiltro("nov").total);
  });
});

describe("textos de cada passo batem com os dados", () => {
  it("há um filtro para cada passo e o texto do mês escolhido confere", () => {
    expect(demoPainel.filtroDoPasso).toHaveLength(demoPainel.passos.length);
    expect(filtroDoPasso(0)).toBe("todos");
    // Passo 3: novembro, líder Bonés. Passo 4: dezembro, o que menos sai é Casacos.
    expect(filtroDoPasso(3)).toBe("nov");
    expect(demoPainel.passos[2].descricao).toContain(resumoDoFiltro("nov").maisVende.nome);
    expect(filtroDoPasso(4)).toBe("dez");
    expect(resumoDoFiltro("dez").menosSai.nome).toBe("Casacos");
  });

  it("a máquina comum chega ao último passo do painel", () => {
    let e = reduzirPassos(estadoInicialDemo, "reproduzir", demoPainel.passos.length);
    for (let i = 0; i < demoPainel.passos.length; i++) e = reduzirPassos(e, "avancar", demoPainel.passos.length);
    expect(e).toEqual({ passo: demoPainel.passos.length, tocando: false });
  });
});
