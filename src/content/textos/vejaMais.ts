// Textos da seção "Veja mais" (home de Negócios): os três cards, a grade da planilha e o painel interativo.
// Faz parte de src/content/textos/ (ver index.ts). Nenhum número daqui é de cliente: a loja é fictícia e todo valor
// mostrado no painel é calculado a partir do CSV de exemplo (src/content/exemplo-planilha/).
import { formatarMes } from "../../shared/lib/formato";

export const vejaMais = {
  titulo: "Veja mais",
  intro: "Uma loja fictícia, do jeito que a planilha chega até o painel pronto. Todos os dados são de exemplo.",
  rotuloExemplar: "Exemplar",
  carregando: "Carregando o exemplo…",
  falhou: "Não foi possível abrir o exemplo agora. Recarregue a página para tentar de novo.",
  fechar: "Fechar",

  antes: {
    titulo: "A sua planilha quando chegar aqui",
    legenda: "Isto é o que costuma chegar: cada aba de um jeito, datas e nomes escritos de várias formas.",
    abrir: "Abrir planilha",
    modalTitulo: "A planilha como chega",
    modalIntro: "As cinco abas de uma loja fictícia, sem nada corrigido. As linhas em vermelho são as vendas fiadas.",
    abas: "Abas da planilha",
    linhaFiado: "Linha de venda fiada",
  },

  depois: {
    titulo: "A sua planilha após passar pela nossa mão",
    legenda: "A mesma loja numa tabela só: uma linha por venda, tudo no mesmo padrão.",
    abrir: "Abrir planilha",
    modalTitulo: "A planilha arrumada",
    modalIntro: "Uma aba, uma linha por venda. As linhas em vermelho são as vendas fiadas.",
    arrumadoTitulo: "O que foi arrumado",
    arrumado: [
      "Todas as datas no mesmo formato (ano-mês-dia).",
      "Cada cliente com um nome só, do jeito certo.",
      "Valores como número, sem texto no meio.",
      "Uma linha por venda; a aba copiada e as linhas repetidas saíram.",
      "Fiado numa coluna própria (situação), não só pela cor.",
      "Categoria de cada produto, para somar por tipo.",
      "O total de cada venda é a quantidade vezes o valor unitário.",
    ],
  },

  painelCard: {
    titulo: "A sua planilha em forma visual",
    legenda: "Os números da planilha arrumada, num painel em que você mexe: filtra, clica e vê tudo mudar.",
    abrir: "Abrir painel",
    modalTitulo: "Painel de vendas · loja fictícia",
    previa: "Faturamento por mês",
  },

  grade: {
    regiao: (nome: string) => `${nome}: planilha de exemplo, role para ver mais`,
    linhas: (mostradas: number, total: number) => `Mostrando ${mostradas} de ${total} linhas.`,
  },

  painel: {
    ordem: ["indicadores", "mes", "dia", "categoria", "pagamento", "clientes", "tabela"],
    indicadores: { faturamento: "Faturamento", vendas: "Nº de vendas", ticket: "Ticket médio", fiado: "Fiado a receber" },
    filtros: {
      titulo: "Filtros",
      mes: "Mês",
      categoria: "Categoria",
      pagamento: "Forma de pagamento",
      situacao: "Situação",
      cliente: "Cliente",
      todosClientes: "Todos os clientes",
      limpar: "Limpar filtros",
      ativos: "Filtros ativos",
      remover: (rotulo: string) => `Remover o filtro ${rotulo}`,
      contador: (mostradas: number, total: number) => `${mostradas} de ${total} vendas`,
      situacoes: { pago: "Pago", fiado: "Fiado" } as Record<string, string>,
    },
    graficos: {
      mes: "Faturamento por mês",
      dia: "Faturamento por dia",
      categoria: "Faturamento por categoria",
      pagamento: "Faturamento por forma de pagamento",
      clientes: "Top 5 clientes",
      dica: (nome: string, valor: string, pct: string, vendas: number) => `${nome}: ${valor} (${pct} do total), ${vendas} ${vendas === 1 ? "venda" : "vendas"}`,
      aoClicar: "Clique para filtrar os outros gráficos.",
      resumo: (titulo: string, itens: string) => `${titulo}. ${itens}`,
      semDados: "Sem vendas",
      tabelaAlternativa: (titulo: string) => `${titulo}, em tabela`,
      colunaNome: "Item",
      colunaValor: "Faturamento",
      colunaVendas: "Vendas",
    },
    tabela: {
      titulo: "Vendas",
      colunas: { data: "Data", cliente: "Cliente", produto: "Produto", qtd: "Qtd", valorTotal: "Total", pagamento: "Pagamento", situacao: "Situação" },
      ordenarPor: (coluna: string) => `Ordenar por ${coluna}`,
      pagina: (atual: number, total: number) => `Página ${atual} de ${total}`,
      anterior: "Página anterior",
      proxima: "Próxima página",
      fiado: "fiado",
    },
    vazio: { titulo: "Nenhuma venda com esses filtros", acao: "Limpar filtros" },
    anuncio: (mostradas: number, total: number, faturamento: string) => `Mostrando ${mostradas} de ${total} vendas, ${faturamento}.`,
    mes: (chave: string) => formatarMes(chave),
  },
};
