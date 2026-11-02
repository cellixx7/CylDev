// Catálogo de pacotes. Preços e horas são hipóteses: o Marcelo confirma antes de publicar.

export type Preco =
  | { tipo: "fixo"; valor: number }
  | { tipo: "aPartirDe"; valor: number }
  | { tipo: "aula"; porHora: number; pacote: { aulas: number; valor: number } }
  | { tipo: "sobConsulta" };

export type Servico = {
  id: string;
  area: "negocios" | "comunidade";
  nome: string;
  resultado: string;
  inclui: string[];
  preco: Preco;
  /** Horas base. Sem horas, o prazo não é calculado. */
  horasBase?: number;
  prazoTexto?: string;
  disponivel: boolean;
};

export const servicos: Servico[] = [
  {
    id: "planilha",
    area: "negocios",
    nome: "Planilha organizada",
    resultado: "Sua planilha de vendas ou estoque passa a ter uma aba por assunto, colunas padronizadas e totais que conferem.",
    inclui: ["Limpeza dos dados que você já tem", "Fórmulas de total e resumo", "Um vídeo curto explicando como usar"],
    preco: { tipo: "fixo", valor: 250 },
    horasBase: 2.5,
    disponivel: true,
  },
  {
    id: "painel",
    area: "negocios",
    nome: "Painel básico",
    resultado: "Você abre um arquivo e vê quanto vendeu, o que mais sai e como está o mês, sem montar conta.",
    inclui: ["Excel ou Power BI", "Uma fonte de dados", "Até 5 indicadores", "Filtro por período"],
    preco: { tipo: "fixo", valor: 700 },
    horasBase: 7,
    disponivel: true,
  },
  {
    id: "automacao",
    area: "negocios",
    nome: "Automação em Excel",
    resultado: "A tarefa que você repete toda semana na planilha passa a rodar com um clique.",
    inclui: ["VBA ou Power Query", "Teste com os seus arquivos", "Instruções de uso"],
    preco: { tipo: "aPartirDe", valor: 800 },
    horasBase: 8,
    disponivel: true,
  },
  {
    id: "landing",
    area: "negocios",
    nome: "Landing page básica",
    resultado: "Uma página com o seu serviço, seus preços e um botão que leva o cliente direto para o seu WhatsApp.",
    inclui: ["Uma página", "Versão para celular", "Publicação no ar", "Botão de WhatsApp"],
    preco: { tipo: "fixo", valor: 800 },
    horasBase: 8,
    disponivel: true,
  },
  {
    id: "aulas",
    area: "negocios",
    nome: "Aulas de Excel ou programação",
    resultado: "Aula individual pelo computador, no seu ritmo, com os arquivos que você usa no trabalho.",
    inclui: ["Aula online", "Exercícios com o seu material"],
    preco: { tipo: "aula", porHora: 50, pacote: { aulas: 4, valor: 180 } },
    prazoTexto: "Começa quando você quiser",
    disponivel: true,
  },
  {
    id: "sistema",
    area: "negocios",
    nome: "Sistema sob medida",
    resultado: "Quando a planilha já não dá conta e você precisa de um sistema próprio. Começa com uma conversa.",
    inclui: ["Conversa para entender o caso", "Proposta por escrito"],
    preco: { tipo: "sobConsulta" },
    prazoTexto: "Combinado na proposta",
    disponivel: true,
  },
  {
    id: "bot-essencial",
    area: "comunidade",
    nome: "Bot de Discord essencial",
    resultado: "Seu servidor ganha tickets, mensagem de boas-vindas e moderação básica.",
    inclui: ["Tickets", "Boas-vindas", "Moderação", "Ajuda para colocar no ar"],
    preco: { tipo: "fixo", valor: 350 },
    horasBase: 3.5,
    disponivel: true,
  },
  {
    id: "bot-ia",
    area: "comunidade",
    nome: "Bot com IA e painel web",
    resultado: "Um bot que responde com IA e um painel no navegador para você ajustar o que ele faz.",
    inclui: ["Comandos sob medida", "Integração com IA", "Painel web simples"],
    preco: { tipo: "aPartirDe", valor: 600 },
    horasBase: 6,
    disponivel: true,
  },
];

export const servicosDa = (area: Servico["area"]) =>
  servicos.filter((s) => s.area === area && s.disponivel);
