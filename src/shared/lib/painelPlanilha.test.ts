import { describe, expect, it } from "vitest";
import csv from "../../content/exemplo-planilha/planilha-arrumada.csv?raw";
import {
  alternar, filtrar, indicadores, opcoes, ordenar, pagina, porCategoria, porPagamento, semFiltros, serieDiaria, serieMensal, temFiltro, topClientes, vendasDoCsv,
  type Filtros,
} from "./painelPlanilha";

const vendas = vendasDoCsv(csv);
const op = opcoes(vendas);
const com = (parte: Partial<Filtros>): Filtros => ({ ...semFiltros, ...parte });
const soma = (l: { valor: number }[]) => l.reduce((s, p) => s + p.valor, 0);
const mapa = (l: { chave: string; valor: number }[]) => Object.fromEntries(l.map((p) => [p.chave, p.valor]));

describe("dados do exemplo (âncoras)", () => {
  it("94 vendas, 12 clientes, 3 meses e faturamento de R$ 7.586", () => {
    const i = indicadores(vendas);
    expect(vendas).toHaveLength(94);
    expect(op.clientes).toHaveLength(12);
    expect(op.meses).toEqual(["2026-01", "2026-02", "2026-03"]);
    expect(i.faturamento).toBe(7586);
    expect(Math.round(i.ticketMedio)).toBe(81);
  });

  it("fiado: 17 vendas, R$ 1.368", () => {
    const f = filtrar(vendas, com({ situacoes: ["fiado"] }));
    expect(f).toHaveLength(17);
    expect(indicadores(vendas).fiadoAReceber).toBe(1368);
  });

  it("por mês, categoria e forma de pagamento", () => {
    expect(mapa(serieMensal(vendas, op.meses))).toEqual({ "2026-01": 2704, "2026-02": 2647, "2026-03": 2235 });
    expect(mapa(porCategoria(vendas))).toEqual({ Casacos: 3060, Camisetas: 2650, Canecas: 868, Bonés: 736, Outros: 272 });
    expect(mapa(porPagamento(vendas))).toEqual({ Pix: 3355, Dinheiro: 1564, Fiado: 1368, Cartão: 1299 });
  });

  it("a quantidade vezes o valor unitário fecha com o valor total de cada venda", () => {
    for (const v of vendas) expect(v.qtd * v.valorUnitario, `${v.data} ${v.cliente}`).toBe(v.valorTotal);
  });
});

describe("filtros", () => {
  it("vazio devolve tudo, inclusive a mesma lista", () => {
    expect(filtrar(vendas, semFiltros)).toBe(vendas);
    expect(temFiltro(semFiltros)).toBe(false);
  });

  it("cada filtro isolado", () => {
    expect(indicadores(filtrar(vendas, com({ meses: ["2026-01"] }))).faturamento).toBe(2704);
    expect(indicadores(filtrar(vendas, com({ categorias: ["Casacos"] }))).faturamento).toBe(3060);
    expect(indicadores(filtrar(vendas, com({ pagamentos: ["Pix"] }))).faturamento).toBe(3355);
    expect(indicadores(filtrar(vendas, com({ situacoes: ["pago"] }))).faturamento).toBe(7586 - 1368);
    const cliente = op.clientes[0];
    const f = filtrar(vendas, com({ clientes: [cliente] }));
    expect(f.length).toBeGreaterThan(0);
    expect(f.every((v) => v.cliente === cliente)).toBe(true);
  });

  it("filtro por dia (clique no gráfico diário)", () => {
    const dia = op.dias[0];
    const f = filtrar(vendas, com({ dias: [dia] }));
    expect(f.length).toBeGreaterThan(0);
    expect(f.every((v) => v.data === dia)).toBe(true);
    expect(indicadores(f).faturamento).toBe(serieDiaria(vendas).find((p) => p.chave === dia)!.valor);
  });

  it("seleção múltipla na mesma dimensão soma os valores (OU)", () => {
    const f = filtrar(vendas, com({ meses: ["2026-01", "2026-02"] }));
    expect(indicadores(f).faturamento).toBe(2704 + 2647);
  });

  it("dimensões diferentes se combinam (E)", () => {
    const f = filtrar(vendas, com({ meses: ["2026-02"], categorias: ["Canecas"], situacoes: ["pago"] }));
    expect(f.every((v) => v.mes === "2026-02" && v.categoria === "Canecas" && v.situacao === "pago")).toBe(true);
    expect(f.length).toBeLessThan(filtrar(vendas, com({ meses: ["2026-02"] })).length);
  });

  it("`ignorar` deixa a dimensão de fora, para o gráfico dela mostrar todas as barras", () => {
    const f = com({ categorias: ["Casacos"], meses: ["2026-01"] });
    expect(indicadores(filtrar(vendas, f, "categorias")).faturamento).toBe(2704);
  });

  it("alternar liga, desliga e não altera o original; limpar volta ao total", () => {
    const a = alternar(semFiltros, "categorias", "Canecas");
    expect(a.categorias).toEqual(["Canecas"]);
    expect(semFiltros.categorias).toEqual([]);
    expect(alternar(a, "categorias", "Canecas").categorias).toEqual([]);
    expect(indicadores(filtrar(vendas, semFiltros)).faturamento).toBe(7586);
  });

  it("filtros que zeram tudo dão lista vazia e indicadores zerados (sem divisão por zero)", () => {
    const f = filtrar(vendas, com({ situacoes: ["fiado"], pagamentos: ["Pix"] }));
    expect(f).toHaveLength(0);
    expect(indicadores(f)).toEqual({ faturamento: 0, vendas: 0, ticketMedio: 0, fiadoAReceber: 0 });
  });
});

describe("a soma de qualquer quebra fecha com o faturamento filtrado", () => {
  const casos: [string, Filtros][] = [
    ["sem filtro", semFiltros],
    ["um mês", com({ meses: ["2026-03"] })],
    ["uma categoria", com({ categorias: ["Camisetas", "Bonés"] })],
    ["pagamento e situação", com({ pagamentos: ["Dinheiro", "Cartão"], situacoes: ["pago"] })],
    ["combinado", com({ meses: ["2026-01", "2026-02"], categorias: ["Casacos"], situacoes: ["pago"] })],
  ];
  for (const [nome, filtros] of casos) {
    it(nome, () => {
      const f = filtrar(vendas, filtros);
      const total = indicadores(f).faturamento;
      expect(soma(porCategoria(f))).toBe(total);
      expect(soma(porPagamento(f))).toBe(total);
      expect(soma(serieMensal(f, op.meses))).toBe(total);
      expect(soma(serieDiaria(f))).toBe(total);
      expect(soma(topClientes(f, 99))).toBe(total);
      expect(ordenar(f, { coluna: "valorTotal", decrescente: true }).reduce((s, v) => s + v.valorTotal, 0)).toBe(total);
    });
  }
});

describe("séries, ranking e tabela", () => {
  it("série diária em ordem de calendário e série mensal completa", () => {
    const dias = serieDiaria(vendas).map((p) => p.chave);
    expect([...dias].sort()).toEqual(dias);
    expect(serieMensal([], op.meses)).toHaveLength(3);
  });

  it("categorias zeradas aparecem quando pedidas", () => {
    const f = filtrar(vendas, com({ categorias: ["Casacos"] }));
    expect(porCategoria(f, op.categorias)).toHaveLength(5);
  });

  it("top 5 vem em ordem decrescente", () => {
    const t = topClientes(vendas);
    expect(t).toHaveLength(5);
    for (let i = 1; i < t.length; i++) expect(t[i - 1].valor).toBeGreaterThanOrEqual(t[i].valor);
  });

  it("ordena por coluna nos dois sentidos e pagina de 10 em 10", () => {
    const asc = ordenar(vendas, { coluna: "valorTotal", decrescente: false });
    const desc = ordenar(vendas, { coluna: "valorTotal", decrescente: true });
    expect(asc[0].valorTotal).toBeLessThanOrEqual(asc[1].valorTotal);
    expect(desc[0].valorTotal).toBeGreaterThanOrEqual(desc[1].valorTotal);
    const p = pagina(desc, 1);
    expect(p.itens).toHaveLength(10);
    expect(p.total).toBe(10);
    expect(pagina(desc, 99).atual).toBe(10);
    expect(pagina(desc, 10).itens).toHaveLength(4);
    expect(pagina([], 1)).toEqual({ itens: [], total: 1, atual: 1 });
  });
});

describe("leitura do CSV", () => {
  it("recusa arquivo fora do formato", () => {
    expect(() => vendasDoCsv("a,b\n1,2")).toThrow();
  });
});
