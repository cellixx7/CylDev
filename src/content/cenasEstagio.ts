// Cenas animadas do modal do Estágio (planilha que vira painel e apresentação no auditório).
// Tudo aqui é ilustrativo: dados fictícios, sem nome de pessoa real, órgão ou sistema.
import { site } from "./site";

export const cenasEstagio = {
  titulo: "O que eu entrego, em duas cenas",
  aviso: "Cenas ilustrativas, com dados fictícios.",
  pausar: "Pausar animação",
  continuar: "Continuar animação",

  planilha: {
    titulo: "Da planilha bagunçada ao painel",
    alt: "Animação: uma planilha com colunas e linhas fora do lugar e textos sem padrão. Primeiro as colunas e as linhas são alinhadas, depois as palavras, os valores e as datas são padronizados, e por fim um painel com total, número de lançamentos e valor por setor é gerado a partir dela.",
    passos: ["Dados soltos, sem padrão", "Colunas e linhas no lugar", "Palavras e valores padronizados", "Painel gerado a partir da planilha"],
    colunas: ["Setor", "Responsável", "Valor", "Data"],
    // `sujo` é o que chega; `limpo` é o que sai depois do ajuste. `valor` alimenta o painel.
    linhas: [
      { sujo: ["financ.", "joao s.", "1200", "12/3"], limpo: ["Financeiro", "João Silva", "R$ 1.200,00", "12/03/2026"], setor: "Financeiro", valor: 1200 },
      { sujo: ["rh", "MARIA lima", "R$850,5", "2026-03-14"], limpo: ["RH", "Maria Lima", "R$ 850,50", "14/03/2026"], setor: "RH", valor: 850.5 },
      { sujo: ["Financeiro ", "J. Silva", "430,00", "15.03"], limpo: ["Financeiro", "João Silva", "R$ 430,00", "15/03/2026"], setor: "Financeiro", valor: 430 },
      { sujo: ["ti", "carlos p", "2.100", "16 mar"], limpo: ["TI", "Carlos Pereira", "R$ 2.100,00", "16/03/2026"], setor: "TI", valor: 2100 },
      { sujo: ["Rh", "m. lima", "R$ 700", ""], limpo: ["RH", "Maria Lima", "R$ 700,00", "17/03/2026"], setor: "RH", valor: 700 },
      { sujo: ["T.I.", "Carlos", "950,0", "18/03/26"], limpo: ["TI", "Carlos Pereira", "R$ 950,00", "18/03/2026"], setor: "TI", valor: 950 },
    ],
    painel: { titulo: "Painel de lançamentos", total: "Total", lancamentos: "Lançamentos", porSetor: "Valor por setor" },
  },

  apresentacao: {
    titulo: "Apresentação para quem decide",
    alt: `Cena: um auditório visto de trás, com pessoas sentadas de farda da Marinha, do Exército e da Aeronáutica, olhando para um telão. O slide alterna entre um painel de gráfico e um fluxo de processo, e ao lado dele aparece o nome ${site.nome}.`,
    slides: ["Painel do mês", "Fluxo do processo"],
    fluxo: ["Pedido", "Análise", "Entrega"],
    nome: site.nome,
    funcao: "Estágio em TI",
  },
};
