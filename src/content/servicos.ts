// Catálogo de pacotes. Preços definidos pelo Marcelo em 02/11/2026.
// O preço que aparece no site e na mensagem do WhatsApp sai daqui, nunca escrito à mão em textos.

import { VALOR_HORA_EXTRA } from "./orcamento";

/** PENDENTE (Marcelo, 12/11/2026): horas base provisórias do orçamento base do sistema (6 h x VALOR_HORA_EXTRA). */
export const HORAS_BASE_SISTEMA = 6;

export type Preco =
  | { tipo: "fixo"; valor: number }
  | { tipo: "aPartirDe"; valor: number }
  | { tipo: "sobConsulta" };

export type Servico = {
  id: string;
  area: "negocios" | "comunidade";
  nome: string;
  resultado: string;
  inclui: string[];
  /** Observação curta abaixo do item. */
  nota?: string;
  preco: Preco;
  /** Horas base do pacote básico. Sem horas, o prazo não é calculado. */
  horasBase?: number;
  /**
   * As horas base ainda não foram confirmadas. Enquanto for `true`, o site mostra
   * "prazo a combinar" no lugar dos dias. Remover a marca quando o Marcelo confirmar as horas.
   */
  horasProvisorias?: boolean;
  prazoTexto?: string;
  /** Tem mensalidade de hospedagem e manutenção (ver `mensalidadeBots` em orcamento.ts). */
  mensalidade?: boolean;
  disponivel: boolean;
};

/** Texto do prazo dos pacotes com horas provisórias. */
export const prazoACombinar = "prazo a combinar";

export const servicos: Servico[] = [
  {
    id: "planilha",
    area: "negocios",
    nome: "Planilha organizada",
    resultado:
      "Sua planilha passa a ter uma aba por assunto, colunas padronizadas e totais que conferem. Fica mais fácil de preencher e de confiar nos números.",
    inclui: ["Limpeza dos dados que você já tem", "Fórmulas de total e resumo", "Instruções de uso em uma página"],
    preco: { tipo: "fixo", valor: 100 },
    horasBase: 2,
    disponivel: true,
  },
  {
    id: "painel",
    area: "negocios",
    nome: "Painel básico",
    resultado:
      "Você abre um arquivo e vê quanto vendeu, o que mais sai e como está o mês, sem montar conta. Dá para controlar estoque e vendas com número, e não no chute.",
    inclui: [
      "Excel (padrão) ou Power BI Desktop (arquivo .pbix e PDF)",
      "Uma fonte de dados",
      "Até 5 indicadores",
      "Filtro por período",
    ],
    nota: "Compartilhar um painel do Power BI online com a sua equipe exige licença paga do Power BI do lado de vocês. No Excel isso não é preciso. Eu explico as opções na conversa.",
    preco: { tipo: "fixo", valor: 200 },
    horasBase: 4,
    disponivel: true,
  },
  {
    id: "automacao",
    area: "negocios",
    nome: "Automação em Excel",
    resultado: "A tarefa que você repete toda semana na planilha passa a rodar com um clique.",
    inclui: ["VBA ou Power Query", "Instruções de uso"],
    preco: { tipo: "aPartirDe", valor: 300 },
    // Horas base confirmadas pelo Marcelo em 06/11/2026.
    horasBase: 6,
    disponivel: true,
  },
  {
    id: "landing",
    area: "negocios",
    nome: "Site de uma página",
    resultado: "Uma página com o seu serviço, seus preços e um botão que leva o cliente direto para o seu WhatsApp.",
    inclui: [
      "Uma página",
      "Versão para celular",
      "Publicação no ar, em hospedagem gratuita na sua conta",
      "Botão de WhatsApp",
    ],
    preco: { tipo: "fixo", valor: 300 },
    horasBase: 5,
    disponivel: true,
  },
  {
    id: "python",
    area: "negocios",
    nome: "Automação com Python",
    resultado:
      "Um script feito para a sua tarefa: junta planilhas e arquivos, lê PDFs, envia mensagens ou busca dados de sites, e entrega o resultado pronto.",
    inclui: [
      "Script em Python feito para a sua tarefa",
      "Teste com dados de exemplo antes de entregar",
      "Instruções para rodar e ajustar",
    ],
    nota: "Se a tarefa couber dentro do Excel, a Automação em Excel resolve com o mesmo valor de partida; o Python é para o que o Excel não alcança. Eu aviso na conversa qual das duas serve melhor.",
    // Regra (Marcelo, 12/11/2026): 6 horas base x R$ 50 por hora (VALOR_HORA_EXTRA), sem desconto embutido.
    preco: { tipo: "aPartirDe", valor: 300 },
    horasBase: 6,
    disponivel: true,
  },
  {
    id: "sistema",
    area: "negocios",
    nome: "Sistema sob medida",
    resultado: "Quando a planilha já não dá conta e você precisa de um sistema próprio. Você monta o orçamento base e a proposta fecha o escopo.",
    inclui: ["Conversa para entender o caso", "Proposta por escrito", "Entrega em etapas"],
    nota: "O valor é um ponto de partida: a proposta por escrito fecha o escopo.",
    // PENDENTE (Marcelo, 12/11/2026): 6 horas base x R$ 50 (VALOR_HORA_EXTRA) e as horas das respostas são provisórias.
    preco: { tipo: "aPartirDe", valor: HORAS_BASE_SISTEMA * VALOR_HORA_EXTRA },
    horasBase: HORAS_BASE_SISTEMA,
    // Sem prazo calculado: o prazo.ts não cobre sistemas, então o site mostra "prazo a combinar".
    horasProvisorias: true,
    disponivel: true,
  },
  {
    id: "bot-essencial",
    area: "comunidade",
    nome: "Bot de Discord essencial",
    resultado: "Seu servidor ganha tickets, mensagem de boas-vindas e moderação básica.",
    inclui: ["Tickets", "Boas-vindas", "Moderação básica", "Ajuda para colocar no ar"],
    preco: { tipo: "fixo", valor: 300 },
    // PENDENTE: horas base ainda não definidas pelo Marcelo (valor provisório).
    horasBase: 4,
    horasProvisorias: true,
    mensalidade: true,
    disponivel: true,
  },
  {
    id: "bot-ia",
    area: "comunidade",
    nome: "Bot com IA e painel web",
    resultado: "Um bot que responde com IA e um painel no navegador para você ajustar o que ele faz.",
    inclui: ["Comandos sob medida", "Integração com IA", "Painel web simples"],
    nota: "O uso da IA é cobrado pelo provedor, na sua própria conta.",
    preco: { tipo: "aPartirDe", valor: 500 },
    // PENDENTE: horas base ainda não definidas pelo Marcelo (valor provisório).
    horasBase: 8,
    horasProvisorias: true,
    mensalidade: true,
    disponivel: true,
  },
];

export const servicosDa = (area: Servico["area"]) =>
  servicos.filter((s) => s.area === area && s.disponivel);

export const servicoPorId = (id: string) => servicos.find((s) => s.id === id);
