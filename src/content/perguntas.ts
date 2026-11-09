// Perguntas do orçamento por serviço. Fonte: docs/ORCAMENTO-SPEC.md (seção 4).
// O preço base e as horas base de cada serviço continuam em servicos.ts.
//
// PENDENTE: todas as horas extras abaixo (`horas`, `gratis` e `horasPorExtra`) são PROPOSTAS
// do spec, a confirmar pelo Marcelo (docs/DECISOES.md). Cada hora extra soma VALOR_HORA_EXTRA
// ao preço e 1 hora ao tempo de trabalho. Enquanto for `true`, nada no site as trata como fechadas.
export const horasExtrasPendentes = true;

export type Opcao = {
  id: string;
  rotulo: string;
  /** Horas extras que esta opção soma (escolha única). Sem o campo, não muda o valor. */
  horas?: number;
};

export type Pergunta = {
  id: string;
  /** Texto da pergunta, como aparece na tela. */
  texto: string;
  /** Nome curto, usado nas linhas de "como chegamos a esse valor". */
  curto: string;
  tipo: "unica" | "multipla";
  opcoes: Opcao[];
  /** Múltipla: quantos itens já estão inclusos no pacote. */
  gratis?: number;
  /** Múltipla: horas extras por item acima de `gratis`. */
  horasPorExtra?: number;
  /** Aulas: esta pergunta define o formato (avulsa ou pacote), que decide o preço. */
  formato?: boolean;
  /** Texto do botão "O que é isso?". */
  ajuda: string;
};

export type ServicoOrcamento = {
  /** Mesmo id de servicos.ts. */
  id: string;
  numero: string;
  nome: string;
  resumo: string;
  inclui: string[];
  notas: string[];
  /** Entra no combo e no prazo único do carrinho. */
  combinavel: boolean;
  perguntas: Pergunta[];
};

/** Legendas fixas de cada pergunta. */
export const legendasPergunta = {
  mudaValor: "Muda o valor.",
  naoMudaValor: "Não muda o valor.",
  marqueQuantas: "Marque quantas quiser.",
  oQueEIsso: "O que é isso?",
};

// Perguntas reutilizadas -----------------------------------------------------------------

const tipoNegocio: Pergunta = {
  id: "negocio",
  texto: "Que tipo de negócio é?",
  curto: "Tipo de negócio",
  tipo: "unica",
  opcoes: [
    { id: "loja", rotulo: "Loja ou varejo" },
    { id: "servicos", rotulo: "Serviços e atendimento" },
    { id: "alimentacao", rotulo: "Alimentação" },
    { id: "oficina", rotulo: "Oficina ou técnico" },
    { id: "outro", rotulo: "Outro" },
  ],
  ajuda:
    "Isso me ajuda a escolher o que colocar de começo: estoque e vendas para uma loja, agenda e retornos para quem presta serviço, receitas e custos para alimentação. Não muda o valor.",
};

const dadosSensiveis: Pergunta = {
  id: "sensiveis",
  texto: "Tem dados sensíveis?",
  curto: "Dados sensíveis",
  tipo: "unica",
  opcoes: [
    { id: "sim", rotulo: "Sim" },
    { id: "nao", rotulo: "Não" },
    { id: "nao-sei", rotulo: "Não sei" },
  ],
  ajuda:
    "Dados sensíveis são informações que podem expor pessoas ou o seu negócio: CPF, endereço e telefone de clientes, dados de saúde, salários, margem de lucro. Você não precisa me mandar nada disso para pedir o orçamento. Se tiver, eu trabalho com uma cópia em que esses campos foram trocados por exemplos, e você cola os dados reais depois, por conta própria. Isso não muda o valor, só o jeito de trabalhar.",
};

const servidor: Pergunta = {
  id: "servidor",
  texto: "Para que tipo de servidor?",
  curto: "Tipo de servidor",
  tipo: "unica",
  opcoes: [
    { id: "jogo", rotulo: "Comunidade de jogo" },
    { id: "loja", rotulo: "Loja ou marca" },
    { id: "estudos", rotulo: "Estudos ou grupo" },
    { id: "outro", rotulo: "Outro" },
  ],
  ajuda:
    "Comunidade de jogo, loja, grupo de estudos: cada um pede um jeito de organizar canais e regras. Não muda o valor.",
};

// Serviços -------------------------------------------------------------------------------

export const servicosOrcamento: ServicoOrcamento[] = [
  {
    id: "planilha",
    numero: "01",
    nome: "Planilha organizada",
    resumo:
      "Reúno controles soltos (caderno, mensagens, várias abas) em uma planilha única, com fórmulas que somam e conferem por você. Você abre, preenche e vê o total, sem precisar entender de Excel.",
    inclui: [
      "Planilha pronta no Excel, com as colunas do seu negócio",
      "Fórmulas e totais automáticos, explicados em uma aba de leitura rápida",
      "Listas de escolha para evitar erro de digitação",
      "Um dia de revisão incluído no prazo",
    ],
    notas: [
      "Pacote a partir de R$ 100. Cada hora de trabalho a mais soma R$ 50, e as suas respostas mostram onde isso acontece.",
      "Ajustes depois da entrega: R$ 50 por hora.",
    ],
    combinavel: true,
    perguntas: [
      tipoNegocio,
      {
        id: "existente",
        texto: "Você já tem uma planilha?",
        curto: "Material de partida",
        tipo: "unica",
        opcoes: [
          { id: "bagunca", rotulo: "Sim, mas está bagunçada", horas: 1 },
          { id: "papel", rotulo: "Só tenho anotações ou papel", horas: 1 },
          { id: "zero", rotulo: "Não, começo do zero", horas: 0 },
        ],
        ajuda:
          "Se já existe uma planilha, eu aproveito o que funciona e arrumo o resto. Se for caderno ou papel, a gente monta o modelo juntos. Arrumar ou montar dá mais trabalho do que começar do zero, por isso soma 1 hora.",
      },
      {
        id: "controles",
        texto: "Quais controles a planilha precisa ter?",
        curto: "Controles a mais",
        tipo: "multipla",
        gratis: 1,
        horasPorExtra: 1,
        opcoes: [
          { id: "clientes", rotulo: "Clientes" },
          { id: "estoque", rotulo: "Estoque" },
          { id: "vendas", rotulo: "Vendas" },
          { id: "contas", rotulo: "Contas a pagar e receber" },
          { id: "agenda", rotulo: "Agenda e retornos" },
          { id: "outro", rotulo: "Outro" },
        ],
        ajuda:
          "Controle é uma aba para acompanhar uma coisa, como clientes ou estoque. O primeiro está incluso no pacote. Cada controle a mais soma 1 hora de trabalho (R$ 50).",
      },
      {
        id: "dinheiro",
        texto: "A planilha vai ter valores em dinheiro?",
        curto: "Valores em dinheiro",
        tipo: "unica",
        opcoes: [
          { id: "sim", rotulo: "Sim: preços, vendas ou custos", horas: 1 },
          { id: "nao", rotulo: "Não: só cadastros e listas", horas: 0 },
        ],
        ajuda:
          "Com preços, vendas ou custos, cada total e cada fórmula fica visível e explicada, para você conseguir conferir sozinho. Isso soma 1 hora.",
      },
      dadosSensiveis,
    ],
  },
  {
    id: "painel",
    numero: "02",
    nome: "Painel de dados",
    resumo:
      "Transformo os seus números em um painel com poucos gráficos e indicadores, feito para responder as perguntas do seu dia a dia: quanto vendi, quem compra mais, o que está parado.",
    inclui: [
      "Painel pronto, no formato que você escolher",
      "Indicadores e gráficos ligados à sua planilha",
      "Filtros simples, como período e categoria",
      "Um dia de revisão incluído no prazo",
    ],
    notas: [
      "Excel é o padrão e abre em qualquer computador.",
      "Power BI: entrego o arquivo. Para compartilhar online com a equipe é preciso licença paga (Pro) da Microsoft.",
    ],
    combinavel: true,
    perguntas: [
      tipoNegocio,
      {
        id: "origem",
        texto: "De onde vêm os seus números?",
        curto: "Origem dos números",
        tipo: "unica",
        opcoes: [
          { id: "planilha", rotulo: "Uma planilha minha", horas: 0 },
          { id: "exportacao", rotulo: "Exportação de um sistema", horas: 1 },
          { id: "varios", rotulo: "Vários arquivos soltos", horas: 2 },
          { id: "nenhum", rotulo: "Ainda não tenho", horas: 2 },
        ],
        ajuda:
          "Uma planilha sua é o caminho mais curto. Exportações de sistemas e vários arquivos soltos pedem tempo para juntar e limpar, e isso soma horas. Se ainda não tiver nada organizado, a planilha organizada pode vir antes.",
      },
      {
        id: "responder",
        texto: "O que o painel precisa responder?",
        curto: "Perguntas a mais",
        tipo: "multipla",
        gratis: 2,
        horasPorExtra: 1,
        opcoes: [
          { id: "vendi", rotulo: "Quanto eu vendi" },
          { id: "compra-mais", rotulo: "Quem compra mais" },
          { id: "parado", rotulo: "O que está parado" },
          { id: "lucro", rotulo: "Quanto sobra de lucro" },
          { id: "outra", rotulo: "Outra" },
        ],
        ajuda:
          "Cada pergunta vira um indicador ou gráfico. As duas primeiras estão incluídas. Cada uma a mais soma 1 hora (R$ 50).",
      },
      {
        id: "formato",
        texto: "Onde você quer ver o painel?",
        curto: "Formato do painel",
        tipo: "unica",
        opcoes: [
          { id: "excel", rotulo: "Excel", horas: 0 },
          { id: "powerbi", rotulo: "Power BI (arquivo)", horas: 1 },
          { id: "nao-sei", rotulo: "Não sei", horas: 0 },
        ],
        ajuda:
          "Excel é o mais simples e abre em qualquer computador. Power BI é mais visual e soma 1 hora, mas para dividir com outras pessoas pela internet exige licença paga da Microsoft.",
      },
      dadosSensiveis,
    ],
  },
  {
    id: "automacao",
    numero: "03",
    nome: "Automação",
    resumo:
      "Pego uma tarefa que você repete todo dia ou toda semana (copiar dados, juntar arquivos, mandar avisos) e faço o computador fazer por você.",
    inclui: [
      "Rotina automática funcionando no seu computador ou na nuvem",
      "Instruções simples para usar e para parar",
      "Teste com dados de exemplo antes de entregar",
      "Um dia de revisão incluído no prazo",
    ],
    notas: ["O valor parte de R$ 300 e muda conforme as suas respostas."],
    combinavel: true,
    perguntas: [
      {
        id: "tarefas",
        texto: "O que você quer automatizar?",
        curto: "Tarefas a mais",
        tipo: "multipla",
        gratis: 1,
        horasPorExtra: 2,
        opcoes: [
          { id: "planilha", rotulo: "Planilha que se preenche sozinha" },
          { id: "avisos", rotulo: "Avisos e mensagens" },
          { id: "juntar", rotulo: "Juntar dados de vários lugares" },
          { id: "nao-sei", rotulo: "Ainda não sei" },
        ],
        ajuda:
          "Pense no que você refaz sempre do mesmo jeito. A primeira tarefa está inclusa. Cada tarefa a mais soma 2 horas (R$ 100). Se não souber descrever, conte pelo WhatsApp e eu ajudo.",
      },
      {
        id: "onde",
        texto: "Onde isso acontece hoje?",
        curto: "Onde acontece",
        tipo: "unica",
        opcoes: [
          { id: "excel", rotulo: "No Excel", horas: 0 },
          { id: "sistema", rotulo: "Em um sistema", horas: 2 },
          { id: "mensagens", rotulo: "No WhatsApp ou e-mail", horas: 2 },
          { id: "varios", rotulo: "Em vários lugares", horas: 3 },
        ],
        ajuda:
          "Dentro do Excel é o mais simples. Quando a tarefa envolve um sistema, o WhatsApp ou vários lugares, é preciso ligar as peças, e isso soma horas.",
      },
      dadosSensiveis,
    ],
  },
  {
    id: "landing",
    numero: "04",
    nome: "Landing page",
    resumo:
      "Uma página simples e rápida que apresenta o seu negócio e leva a pessoa a chamar você, de preferência pelo WhatsApp.",
    inclui: [
      "Página responsiva, pensada primeiro para o celular",
      "Botão direto para o seu WhatsApp",
      "Textos organizados com você na conversa",
      "Um dia de revisão incluído no prazo",
    ],
    notas: [
      "Domínio (o endereço da página) e hospedagem podem ter custo próprio. Eu explico as opções antes de você decidir.",
    ],
    combinavel: true,
    perguntas: [
      tipoNegocio,
      {
        id: "objetivos",
        texto: "O que a página precisa fazer?",
        curto: "Objetivos a mais",
        tipo: "multipla",
        gratis: 2,
        horasPorExtra: 1,
        opcoes: [
          { id: "whatsapp", rotulo: "Receber contatos no WhatsApp" },
          { id: "servicos", rotulo: "Mostrar serviços e preços" },
          { id: "fotos", rotulo: "Mostrar fotos e trabalhos" },
          { id: "agendamentos", rotulo: "Receber agendamentos" },
        ],
        ajuda:
          "A página funciona melhor com poucos objetivos. Os dois primeiros estão incluídos. Cada um a mais soma 1 hora (R$ 50).",
      },
      {
        id: "material",
        texto: "Você já tem logo e fotos?",
        curto: "Logo e fotos",
        tipo: "unica",
        opcoes: [
          { id: "ambos", rotulo: "Logo e fotos", horas: 0 },
          { id: "logo", rotulo: "Só o logo", horas: 0 },
          { id: "nenhum", rotulo: "Ainda não tenho", horas: 1 },
        ],
        ajuda:
          "Fotos reais do seu trabalho convencem mais do que imagem de banco. Sem material nenhum, eu preciso montar um visual simples com você, e isso soma 1 hora.",
      },
      {
        id: "paginas",
        texto: "Quantas páginas?",
        curto: "Número de páginas",
        tipo: "unica",
        opcoes: [
          { id: "uma", rotulo: "Uma página só", horas: 0 },
          { id: "tres", rotulo: "Até 3 páginas", horas: 3 },
        ],
        ajuda:
          "Uma página só rola de cima para baixo, com tudo. Até 3 páginas separa, por exemplo, serviços e contato, e soma 3 horas.",
      },
    ],
  },
  {
    id: "aulas",
    numero: "05",
    nome: "Aulas de Excel e Power BI",
    resumo:
      "Aulas individuais por videochamada, com os seus próprios exemplos. Você aprende o que precisa para o seu trabalho, sem curso longo.",
    inclui: [
      "Aula ao vivo por videochamada",
      "Exercícios com os seus dados, quando você quiser",
      "Resumo do que foi visto, por escrito",
      "Horário combinado conforme a sua agenda",
    ],
    notas: ["Aula avulsa: R$ 50 por hora. Pacote de 4 aulas: R$ 180."],
    combinavel: false,
    perguntas: [
      {
        id: "pagamento",
        texto: "Como prefere pagar?",
        curto: "Formato",
        tipo: "unica",
        formato: true,
        opcoes: [
          { id: "avulsa", rotulo: "Aula avulsa" },
          { id: "pacote", rotulo: "Pacote de 4 aulas" },
        ],
        ajuda:
          "A aula avulsa custa R$ 50 por hora. O pacote de 4 aulas sai por R$ 180 e serve bem para quem quer acompanhamento.",
      },
      {
        id: "nivel",
        texto: "Qual é o seu nível?",
        curto: "Nível",
        tipo: "unica",
        opcoes: [
          { id: "nunca", rotulo: "Nunca usei" },
          { id: "basico", rotulo: "Uso o básico" },
          { id: "avancar", rotulo: "Quero avançar" },
        ],
        ajuda: "Sem pressão: o nível só me diz onde começar. Não muda o valor.",
      },
      {
        id: "foco",
        texto: "Qual o foco?",
        curto: "Foco",
        tipo: "multipla",
        opcoes: [
          { id: "excel", rotulo: "Excel" },
          { id: "powerbi", rotulo: "Power BI" },
          { id: "formulas", rotulo: "Fórmulas e tabelas" },
          { id: "graficos", rotulo: "Gráficos" },
        ],
        ajuda:
          "Pode marcar mais de um. Se estiver em dúvida, comece pelo Excel, que é a base para o Power BI. Não muda o valor.",
      },
    ],
  },
  {
    id: "bot-essencial",
    numero: "06",
    nome: "Bot de Discord essencial",
    resumo:
      "Um bot de Discord com o essencial para o seu servidor: boas-vindas, regras, anúncios e atendimento por tickets.",
    inclui: [
      "Bot configurado no seu servidor",
      "Boas-vindas, anúncios e atendimento por tickets",
      "Instruções para a sua equipe usar",
      "Suporte para ajustes pequenos no primeiro mês",
    ],
    notas: [
      "Mensalidade de 10% do valor de criação mais a hospedagem, cobrada à parte.",
      "O desconto de piloto vale só sobre a criação.",
    ],
    combinavel: false,
    perguntas: [
      servidor,
      {
        id: "funcoes",
        texto: "O que o bot precisa fazer?",
        curto: "Funções a mais",
        tipo: "multipla",
        gratis: 2,
        horasPorExtra: 1,
        opcoes: [
          { id: "boas-vindas", rotulo: "Boas-vindas e regras" },
          { id: "tickets", rotulo: "Tickets de suporte" },
          { id: "anuncios", rotulo: "Anúncios" },
          { id: "cargos", rotulo: "Cargos por reação" },
        ],
        ajuda:
          "Ticket é um canal privado que o bot abre para atender uma pessoa. Cargo por reação é quando a pessoa ganha um cargo ao clicar em um emoji. As duas primeiras funções estão incluídas. Cada uma a mais soma 1 hora (R$ 50).",
      },
      {
        id: "hospedagem",
        texto: "Quem hospeda o bot?",
        curto: "Hospedagem",
        tipo: "unica",
        opcoes: [
          { id: "marcelo", rotulo: "O Marcelo hospeda" },
          { id: "eu", rotulo: "Eu mesmo hospedo" },
          { id: "nao-sei", rotulo: "Não sei" },
        ],
        ajuda:
          "Hospedar é manter o bot ligado o tempo todo em um servidor. Eu posso cuidar disso (por isso a mensalidade) ou você hospeda por conta própria. Não muda o valor de criação.",
      },
    ],
  },
  {
    id: "bot-ia",
    numero: "07",
    nome: "Bot de Discord com IA",
    resumo:
      "Tudo do bot essencial, mais respostas automáticas feitas por inteligência artificial, com regras que você define.",
    inclui: [
      "Tudo do bot essencial",
      "Respostas com IA, nos canais que você escolher",
      "Limites e regras para o que a IA pode ou não responder",
      "Instruções para acompanhar o uso",
    ],
    notas: [
      "O uso da IA é cobrado direto na sua conta do provedor, não por mim.",
      "Mensalidade de 10% do valor de criação mais a hospedagem.",
    ],
    combinavel: false,
    perguntas: [
      servidor,
      {
        id: "papeis",
        texto: "O que a IA deve responder?",
        curto: "Papéis a mais",
        tipo: "multipla",
        gratis: 1,
        horasPorExtra: 2,
        opcoes: [
          { id: "duvidas", rotulo: "Dúvidas frequentes" },
          { id: "conversa", rotulo: "Conversa livre" },
          { id: "regras", rotulo: "Ajuda com regras" },
          { id: "nao-sei", rotulo: "Ainda não sei" },
        ],
        ajuda:
          "A IA responde melhor quando o assunto é delimitado. O primeiro papel está incluso. Cada um a mais soma 2 horas (R$ 100).",
      },
      {
        id: "provedor",
        texto: "Você já tem conta em algum provedor de IA?",
        curto: "Conta no provedor de IA",
        tipo: "unica",
        opcoes: [
          { id: "sim", rotulo: "Sim", horas: 0 },
          { id: "ajuda", rotulo: "Não, preciso de ajuda", horas: 1 },
          { id: "nao-sei", rotulo: "Não sei o que é", horas: 1 },
        ],
        ajuda:
          "Provedor de IA é a empresa que fornece o modelo (por exemplo, OpenAI ou Anthropic). Você abre uma conta, e o uso aparece na sua fatura. Se nunca fez isso, eu explico o caminho, e isso soma 1 hora.",
      },
    ],
  },
  {
    id: "sistema",
    numero: "08",
    nome: "Sistema sob medida",
    resumo:
      "Quando a necessidade é maior: um sistema pensado para o seu processo. Começamos por uma conversa, e eu devolvo uma proposta com escopo, prazo e valor.",
    inclui: [
      "Conversa inicial para entender o processo",
      "Proposta por escrito antes de começar",
      "Entrega em etapas, para você acompanhar",
      "Valor combinado de acordo com o tamanho",
    ],
    notas: ["Projetos grandes entram em fila e dependem da minha agenda."],
    combinavel: false,
    perguntas: [
      {
        id: "resolver",
        texto: "O que você precisa resolver?",
        curto: "O que resolver",
        tipo: "multipla",
        opcoes: [
          { id: "pedidos", rotulo: "Clientes e pedidos" },
          { id: "agenda", rotulo: "Agenda e reservas" },
          { id: "area-cliente", rotulo: "Área do cliente" },
          { id: "outra", rotulo: "Outra" },
        ],
        ajuda:
          "Descreva o problema, não a solução. Pode marcar mais de um. O melhor jeito costuma aparecer na conversa, e o valor sai na proposta.",
      },
      {
        id: "quando",
        texto: "Para quando você precisa?",
        curto: "Quando",
        tipo: "unica",
        opcoes: [
          { id: "sem-pressa", rotulo: "Sem pressa" },
          { id: "um-mes", rotulo: "Em um mês" },
          { id: "urgencia", rotulo: "Com urgência" },
        ],
        ajuda: "Isso não é promessa. Serve para eu saber se consigo encaixar o trabalho.",
      },
    ],
  },
];

export const servicoOrcamentoPorId = (id: string) => servicosOrcamento.find((s) => s.id === id);
