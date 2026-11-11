import { demoComum, type PassoDemo } from "./demos";

// Demonstração do painel (Como funciona). Loja fictícia, a mesma do painel de exemplo da home.
// Os totais de Out, Nov e Dez (20, 20 e 30) são os mesmos de `negocios.apresentacao.painel.meses`; um teste confere.
// Nenhum número aqui é resultado real de cliente.

export type MesDemo = "out" | "nov" | "dez";
export type FiltroDemo = MesDemo | "todos";

export const demoPainel = {
  ...demoComum,
  titulo: "Veja um painel sendo usado",
  resultado: "Consigo descobrir o que vende mais e acompanhar o negócio.",
  comecoRotulo: "A tabela de vendas",
  comecoDescricao: "Vendas por produto nos últimos três meses, em R$ mil. É daqui que o painel tira tudo.",
  unidade: "R$ mil",
  tabela: {
    legenda: "Tabela de vendas (R$ mil)",
    produto: "Produto",
    total: "Total",
  },
  meses: [
    { id: "out", nome: "Out", completo: "outubro" },
    { id: "nov", nome: "Nov", completo: "novembro" },
    { id: "dez", nome: "Dez", completo: "dezembro" },
  ] as { id: MesDemo; nome: string; completo: string }[],
  /** Vendas por produto em cada mês, em R$ mil. */
  produtos: [
    { nome: "Camisetas", vendas: { out: 8, nov: 6, dez: 12 } },
    { nome: "Bonés", vendas: { out: 6, nov: 7, dez: 8 } },
    { nome: "Canecas", vendas: { out: 4, nov: 5, dez: 6 } },
    { nome: "Casacos", vendas: { out: 2, nov: 2, dez: 4 } },
  ] as { nome: string; vendas: Record<MesDemo, number> }[],
  painel: {
    titulo: "Painel de vendas",
    filtroRotulo: "Mês",
    todos: "Todos",
    periodoTodos: "Out a Dez",
    indicadores: {
      vendido: "Vendido no período",
      maisVende: "O que mais vende",
      menosSai: "O que menos sai",
    },
    graficoTitulo: "Vendas por produto (R$ mil)",
    /** Texto lido pelo leitor de tela no resumo do painel. */
    resumo: (periodo: string, total: number, maior: string, menor: string) =>
      `${periodo}: R$ ${total} mil vendidos. Mais vende: ${maior}. Menos sai: ${menor}.`,
  },
  passos: [
    { titulo: "Os números saem da tabela", descricao: "O total, o produto que mais vende e o que menos sai são calculados sozinhos." },
    { titulo: "O gráfico compara os produtos", descricao: "Dá para ver de relance o que vende mais e o que vende menos." },
    { titulo: "Você escolhe um mês", descricao: "Em novembro, quem mais vende é outro produto: os Bonés. O painel refaz tudo." },
    { titulo: "Você nota o produto parado", descricao: "Em dezembro o total sobe, mas os Casacos continuam sendo o que menos sai." },
  ] satisfies PassoDemo[],
  /** Filtro mostrado em cada passo (do 1 ao último). O painel só aparece do passo 1 em diante. */
  filtroDoPasso: ["todos", "todos", "nov", "dez"] as FiltroDemo[],
  usar: "Agora é com você: escolha um mês.",
  tabelaAntes: "Tabela de vendas",
  painelDepois: "Painel de vendas",
};
