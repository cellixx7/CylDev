// "Não sei qual escolher": perguntas e resultados do guia. Só texto e ligações entre eles.
// Regras: nenhum preço, prazo ou número aqui (o valor de cada serviço sai de servicos.ts e do orçamento).
// Cada resultado aponta para ids de serviços de Negócios, ou para uma saída externa (bots, na Comunidade).

/**
 * Saída de um resultado sem serviços. `link` tem endereço próprio; `whatsapp` usa o número de site.ts
 * (o mesmo do carrinho), então nenhum endereço de contato fica escrito neste arquivo.
 */
export type Saida = { tipo: "link"; href: string; rotulo: string } | { tipo: "whatsapp"; rotulo: string };

export type OpcaoGuia = {
  id: string;
  rotulo: string;
  /** Vai para outra pergunta... */
  pergunta?: string;
  /** ...ou termina em um resultado. */
  resultado?: string;
};

export type PerguntaGuia = {
  id: string;
  texto: string;
  opcoes: OpcaoGuia[];
};

export type ResultadoGuia = {
  id: string;
  /** Ids de serviços do catálogo de Negócios que o guia recomenda (cada um vira um bloco com os botões de sempre). */
  servicos: string[];
  /** Por que esse serviço combina com a resposta dada. */
  porque: string;
  /** Saída para fora de Negócios (sem serviços do catálogo). */
  saida?: Saida;
};

export const guia = {
  botao: "Não sei qual escolher",
  titulo: "Qual serviço combina com você?",
  intro: "Responda até duas perguntas e eu mostro por onde começar. Você continua livre para escolher qualquer serviço.",
  rotuloPergunta: (n: number) => `Pergunta ${n}`,
  voltar: "Voltar",
  recomecar: "Recomeçar",
  fechar: "Fechar o guia",
  resultadoTitulo: "Por onde começar",
  verDetalhes: "Ver detalhes",
  fazerOrcamento: "Fazer orçamento",
  /** Mensagem pré-preenchida do WhatsApp do resultado "conversar". */
  mensagemWhatsapp: "Não sei qual serviço escolher e queria conversar.",
  origemWhatsapp: "negocios-guia",
  semCompromisso: "É só uma sugestão. O valor e o prazo você vê nos detalhes e na estimativa de cada serviço.",
  raiz: "objetivo",
} as const;

export const perguntasGuia: PerguntaGuia[] = [
  {
    id: "objetivo",
    texto: "O que você quer resolver?",
    opcoes: [
      { id: "numeros", rotulo: "Cuidar dos números do meu negócio", pergunta: "numeros" },
      { id: "pagina", rotulo: "Ter uma página para apresentar o meu negócio", resultado: "landing" },
      { id: "scripts", rotulo: "Automatizar tarefas com um script, além do Excel", resultado: "python" },
      { id: "sistema", rotulo: "A planilha já não dá conta e preciso de um sistema", resultado: "sistema" },
      { id: "bot", rotulo: "Quero um bot para o meu servidor de Discord", resultado: "bot" },
      { id: "conversar", rotulo: "Não sei, prefiro conversar", resultado: "conversar" },
    ],
  },
  {
    id: "numeros",
    texto: "O que mais atrapalha hoje?",
    opcoes: [
      { id: "bagunca", rotulo: "A planilha está bagunçada, ou eu ainda uso caderno e mensagens", resultado: "planilha" },
      { id: "enxergar", rotulo: "Tenho os dados, mas quero ver como o negócio está indo sem montar conta", resultado: "painel" },
      { id: "repeticao", rotulo: "Repito a mesma tarefa na planilha toda semana", resultado: "automacao" },
    ],
  },
];

export const resultadosGuia: ResultadoGuia[] = [
  {
    id: "planilha",
    servicos: ["planilha"],
    porque: "Primeiro os dados ficam em ordem, com totais que conferem. É a base para qualquer painel ou automação depois. Juntando serviços, há desconto.",
  },
  {
    id: "painel",
    servicos: ["painel"],
    porque: "Um painel mostra o que importa do seu negócio em uma tela. Se os dados ainda estão soltos, a planilha organizada pode vir antes.",
  },
  {
    id: "automacao",
    servicos: ["automacao"],
    porque: "A tarefa repetida passa a rodar com um clique. Eu confirmo o que dá para automatizar depois de ver o seu caso.",
  },
  {
    id: "landing",
    servicos: ["landing"],
    porque: "Uma página com o seu serviço e um botão que leva o cliente direto para o seu WhatsApp.",
  },
  {
    id: "python",
    servicos: ["python"],
    porque: "Um script em Python faz a tarefa repetida por você, mesmo com PDFs, vários arquivos ou sites. Se a tarefa couber dentro do Excel, a automação em Excel pode servir melhor.",
  },
  {
    id: "sistema",
    servicos: ["sistema"],
    porque: "Você monta um orçamento base respondendo às perguntas. O valor é um ponto de partida: depois da conversa, a proposta por escrito fecha o escopo.",
  },
  {
    id: "bot",
    servicos: [],
    porque: "Bots de Discord ficam na área Comunidade, com o preço e a mensalidade explicados lá.",
    saida: { tipo: "link", href: "/comunidade/#bots", rotulo: "Ver os bots na Comunidade" },
  },
  {
    id: "conversar",
    servicos: [],
    porque: "Sem problema, me conta o seu caso e eu te ajudo a escolher.",
    saida: { tipo: "whatsapp", rotulo: "Falar comigo no WhatsApp" },
  },
];
