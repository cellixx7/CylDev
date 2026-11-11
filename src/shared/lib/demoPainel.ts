import { demoPainel, type FiltroDemo, type MesDemo } from "../../content/demoPainel";

// Contas do painel da demonstração. Tudo sai da tabela em `demoPainel.produtos`.

export type ResumoPainel = {
  periodo: string;
  total: number;
  /** Vendas por produto no filtro, na ordem da tabela. */
  vendas: { nome: string; valor: number }[];
  maisVende: { nome: string; valor: number };
  menosSai: { nome: string; valor: number };
  maximo: number;
};

const meses = demoPainel.meses.map((m) => m.id);

export function vendaNoFiltro(vendas: Record<MesDemo, number>, filtro: FiltroDemo): number {
  return filtro === "todos" ? meses.reduce((s, m) => s + vendas[m], 0) : vendas[filtro];
}

export const totalDoMes = (mes: MesDemo) => demoPainel.produtos.reduce((s, p) => s + p.vendas[mes], 0);

export function resumoDoFiltro(filtro: FiltroDemo): ResumoPainel {
  const vendas = demoPainel.produtos.map((p) => ({ nome: p.nome, valor: vendaNoFiltro(p.vendas, filtro) }));
  const ordenadas = [...vendas].sort((a, b) => b.valor - a.valor);
  const periodo =
    filtro === "todos" ? demoPainel.painel.periodoTodos : (demoPainel.meses.find((m) => m.id === filtro)?.completo ?? "");
  return {
    periodo,
    total: vendas.reduce((s, v) => s + v.valor, 0),
    vendas,
    maisVende: ordenadas[0],
    menosSai: ordenadas[ordenadas.length - 1],
    maximo: ordenadas[0].valor,
  };
}

/** Filtro mostrado em cada passo (passo 0 não tem painel e usa "todos"). */
export const filtroDoPasso = (passo: number): FiltroDemo => demoPainel.filtroDoPasso[Math.max(passo - 1, 0)];
