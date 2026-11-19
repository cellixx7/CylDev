// Vocabulário do assistente do chat: rede de sinônimos, intenções e padrões de proteção.
// Tudo aqui é só texto de busca. Nenhum preço, prazo ou número entra neste arquivo: os valores saem de servicos.ts,
// orcamento.ts e dos textos do site (ver shared/lib/assistente/conhecimento.ts).
//
// Como editar: cada conceito é uma lista de frases que significam a mesma coisa para o visitante. Escreva do jeito que
// a pessoa digitaria (com ou sem acento, no singular ou plural: o motor normaliza). Frases de uma palavra só também
// toleram um erro de digitação (a partir de 5 letras).

/** Conceitos: "quanto custa", "valor" e "preço" caem todos em `preco`. */
export const conceitos: Record<string, string[]> = {
  // --- Perguntas sobre o negócio ---
  preco: [
    "preço", "valor", "valores", "quanto custa", "quanto custam", "quanto é", "quanto sai", "quanto fica", "quanto vai ficar",
    "quanto cobra", "quanto cobram", "quanto você cobra", "cobra", "cobram", "cobrar", "custa", "custo", "custos", "investimento", "cobrança", "tabela de preços",
    "a partir de", "preço inicial", "valor inicial", "barato", "caro", "orçamento de preço",
  ],
  prazo: [
    "prazo", "prazos", "quanto tempo", "demora", "demorar", "demora quanto", "quantos dias", "em quantos dias", "dias úteis",
    "quando fica pronto", "fica pronto", "quando entrega", "quando vai ficar pronto", "tempo de entrega", "data de entrega",
  ],
  incluso: [
    "o que recebo", "o que eu recebo", "o que vem", "o que inclui", "inclui", "incluso", "incluído", "o que está incluso",
    "o que eu ganho", "vem com", "o que entrega", "o que você entrega", "entregável", "entregáveis", "o que fica pronto",
  ],
  orcar: [
    "orçamento", "orçamentos", "orçar", "cotação", "cotar", "simular", "simulação", "calcular", "montar", "fazer um orçamento",
    "quero contratar", "contratar", "quero fazer", "quero pedir", "fazer pedido", "pedir",
  ],
  indicar: [
    "qual escolher", "qual serviço", "qual eu escolho", "não sei qual", "não sei o que", "me ajuda a escolher", "me indica", "indica",
    "recomenda", "recomendação", "qual o melhor", "qual combina", "por onde começar", "o que você sugere", "não sei por onde",
  ],
  contato: [
    "whatsapp", "zap", "zapzap", "contato", "telefone", "email", "e-mail", "falar com", "conversar", "chamar", "ligar",
    "marcelo", "atendente", "humano", "pessoa de verdade", "falar com alguém", "falar com o marcelo",
  ],
  pagamento: [
    "pagamento", "pagar", "pix", "entrada", "parcela", "parcelar", "parcelado", "cartão", "boleto", "forma de pagamento",
    "como pago", "formas de pagamento", "50%",
  ],
  nota: ["nota fiscal", "nota", "nf", "nfe", "recibo", "comprovante"],
  desconto: ["desconto", "descontos", "combo", "promoção", "piloto", "pacote promocional", "mais de um serviço", "vários serviços", "dois serviços", "três serviços"],
  revisao: ["revisão", "ajuste", "ajustes", "mudança", "alterar", "alteração", "suporte", "garantia", "defeito", "erro depois", "manutenção", "depois da entrega"],
  desistencia: ["desistir", "desistência", "cancelar o pedido", "cancelamento", "arrepender", "arrependimento", "devolução", "reembolso", "não gostar", "mudar de ideia"],
  privacidade: ["lgpd", "privacidade", "meus dados", "dados pessoais", "cookies", "segurança dos dados", "vazar", "vazamento", "armazena", "guarda meus dados"],
  quem: ["quem é", "quem são", "quem faz", "quem é você", "quem é o marcelo", "sobre você", "sobre o marcelo", "experiência", "quem desenvolve", "quem criou"],
  servicos: ["serviços", "serviço", "o que você faz", "o que vocês fazem", "o que você vende", "o que você oferece", "catálogo", "quais serviços", "o que oferece", "o que faz"],
  ajuda: ["ajuda", "ajudar", "o que você pode", "o que consegue", "como funciona", "como usar", "menu", "opções", "o que posso perguntar", "comece"],
  saudacao: ["oi", "olá", "oie", "bom dia", "boa tarde", "boa noite", "e aí", "opa", "hello", "hey", "salve"],
  agradecimento: ["obrigado", "obrigada", "valeu", "brigado", "agradeço", "muito obrigado", "thanks"],
  despedida: ["tchau", "até logo", "até mais", "falou", "adeus", "flw"],
  bot: ["bot", "bots", "discord", "bot de discord"],

  // --- Serviços do catálogo (o id é o de servicos.ts) ---
  "svc:planilha": ["planilha", "planilhas", "organizar planilha", "planilha organizada", "organizar dados", "organizar minha planilha"],
  "svc:painel": ["painel", "dashboard", "power bi", "powerbi", "bi", "gráfico", "gráficos", "indicadores", "painel básico"],
  "svc:automacao": ["automação em excel", "automatizar excel", "automatizar planilha", "macro", "macros", "vba", "power query", "botão no excel"],
  "svc:landing": [
    "site de uma página", "landing", "landing page", "página de vendas", "criar site", "fazer site", "fazer um site", "quero um site",
    "site para meu negócio", "site pro meu", "página web", "site simples", "site de uma pagina",
  ],
  "svc:python": ["python", "script", "scripts", "automação com python", "automatizar com python", "robô", "juntar planilhas", "ler pdf", "ler pdfs"],
  "svc:sistema": ["sistema", "sistemas", "sistema sob medida", "software", "sob medida", "sistema de gestão", "sistema próprio"],

  // Automação sem dizer qual: vira uma pergunta ("Excel ou Python?").
  "svc:automacao?": ["automação", "automatizar", "automatizado", "automático", "automática"],

  // --- Pedidos que passam do que o chat consegue estimar: vão para o formulário ou o WhatsApp ---
  grande: [
    "aplicativo", "app", "aplicativo de celular", "loja virtual", "ecommerce", "e-commerce", "marketplace", "erp", "crm",
    "integração", "integrar", "integração com", "migrar", "migração", "muitos usuários", "vários usuários", "banco de dados",
    "urgente", "urgência", "pra ontem", "para amanhã", "licitação", "contrato grande", "projeto grande", "empresa grande",
    "sistema complexo", "inteligência artificial", "chatbot", "app mobile",
  ],

  // --- Fora do escopo: o chat recusa ---
  fora: [
    "receita de", "futebol", "política", "eleição", "eleições", "presidente", "bitcoin", "criptomoeda", "cripto", "investir", "bolsa de valores",
    "ações da bolsa", "previsão do tempo", "clima", "piada", "conta uma piada", "poema", "poesia", "música", "letra de música", "filme", "série",
    "horóscopo", "signo", "namorada", "namorado", "religião", "médico", "remédio", "diagnóstico", "sintoma", "advogado", "processo judicial",
    "dever de casa", "redação", "trabalho escolar", "quem ganhou", "capital da", "capital do", "quem inventou", "me ensina", "ensina a programar",
    "escreva um código", "escreve um código", "faz um código", "resolva este exercício", "resolva esse exercício", "traduza", "tradução", "resumo do livro",
    "notícias", "notícia", "jogo", "game", "chatgpt", "gpt", "openai", "gemini",
  ],
};

/**
 * Intenções: cada uma soma os conceitos que ela reconhece. A de maior pontuação responde; em empate vale a ordem desta lista
 * (a mais específica primeiro). `saudacao` e `agradecimento` ficam por último: "oi, quanto custa?" é uma pergunta de preço.
 */
export const intencoes: { id: Intencao; conceitos: string[] }[] = [
  { id: "orcar", conceitos: ["orcar"] },
  { id: "preco", conceitos: ["preco"] },
  { id: "prazo", conceitos: ["prazo"] },
  { id: "incluso", conceitos: ["incluso"] },
  { id: "desconto", conceitos: ["desconto"] },
  { id: "pagamento", conceitos: ["pagamento"] },
  { id: "nota", conceitos: ["nota"] },
  { id: "desistencia", conceitos: ["desistencia"] },
  { id: "revisao", conceitos: ["revisao"] },
  { id: "privacidade", conceitos: ["privacidade"] },
  { id: "indicar", conceitos: ["indicar"] },
  { id: "contato", conceitos: ["contato"] },
  { id: "quem", conceitos: ["quem"] },
  { id: "bot", conceitos: ["bot"] },
  { id: "servicos", conceitos: ["servicos"] },
  { id: "ajuda", conceitos: ["ajuda"] },
  { id: "saudacao", conceitos: ["saudacao"] },
  { id: "agradecimento", conceitos: ["agradecimento"] },
  { id: "despedida", conceitos: ["despedida"] },
];

export type Intencao =
  | "orcar"
  | "preco"
  | "prazo"
  | "incluso"
  | "desconto"
  | "pagamento"
  | "nota"
  | "desistencia"
  | "revisao"
  | "privacidade"
  | "indicar"
  | "contato"
  | "quem"
  | "bot"
  | "servicos"
  | "ajuda"
  | "saudacao"
  | "agradecimento"
  | "despedida";

/**
 * Tentativas de mudar as regras do assistente. Cada item é uma expressão regular aplicada ao texto já normalizado
 * (minúsculo, sem acento, sem pontuação). Quem bate é recusado sem passar por nenhuma outra regra.
 */
export const padroesDeInjecao: RegExp[] = [
  /\bignor\w*\b.*\b(instruc|regra|ordem|orientac|prompt|restric|limite|diretriz|anterior)/,
  /\b(esquec|desconsider|descart|abandon)\w*\b.*\b(instruc|regra|ordem|prompt|restric|tudo|anterior)/,
  /\b(finj|aja como|atue como|haja como|faca de conta|assuma o papel|assumir o papel|responda como se|role ?play|jailbreak)/,
  /\b(voce agora e|a partir de agora voce|de agora em diante voce|agora voce vai ser|agora voce e)\b/,
  /\bsimul\w*\b.*\b(que voce|ser um|ser uma)\b/,
  /\bmodo (desenvolvedor|deus|dan|livre|sem restric\w*|admin\w*|debug)\b/,
  /\b(developer mode|do anything now|dan mode)\b/,
  /\b(mostr|revel|repet|exib|imprim|diga|passe|copie|vaze)\w*\b.*\b(prompt|instruc|regras (internas|do sistema)|system|configurac|suas regras)/,
  /\b(system prompt|prompt do sistema|prompt inicial|ignore (previous|all|the above|tudo))\b/,
  /\bsem (regras|restric\w*|filtro\w*|limite\w*)\b/,
  /\b(traduza|resuma|repita)\b.*\b(suas|seu|sua) (instruc|regra|prompt)/,
];
