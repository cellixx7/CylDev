// Vocabulário do assistente do chat: rede de sinônimos, intenções e padrões de proteção.
// Tudo aqui é só texto de busca. Nenhum preço, prazo ou número entra neste arquivo: os valores saem de servicos.ts,
// orcamento.ts e dos textos do site (ver shared/lib/assistente/conhecimento.ts).
//
// Como editar: cada conceito é uma lista de frases que significam a mesma coisa para o visitante. Escreva do jeito que
// a pessoa digitaria (com ou sem acento, no singular ou plural: o motor normaliza). Frases de uma palavra só também
// toleram um erro de digitação (a partir de 5 letras).

/**
 * Gírias, abreviações e erros comuns de digitação, trocados ANTES de comparar (o texto do visitante e as frases deste
 * arquivo passam pela mesma troca). A chave vem sem acento e em minúsculas; o valor pode ter mais de uma palavra, e
 * vazio ("") apaga a palavra (os vocativos "botzão", "botinho": a pessoa está chamando o chat, não pedindo um bot).
 */
export const girias: Record<string, string> = {
  nn: "nao", n: "nao", naum: "nao",
  tu: "voce", vc: "voce", vcs: "voce", ce: "voce",
  pq: "porque", pk: "porque", prq: "porque", tb: "tambem", tbm: "tambem", tmb: "tambem",
  qto: "quanto", qnt: "quanto", qnto: "quanto", qts: "quantos", qd: "quando", qdo: "quando",
  q: "que", oq: "o que", msm: "mesmo", mt: "muito", mto: "muito", td: "tudo", dnv: "de novo", kd: "cade",
  blz: "beleza", vlw: "valeu", flw: "falou", obg: "obrigado", brigadao: "obrigado", obrigadao: "obrigado",
  pfv: "por favor", pf: "por favor", prra: "pra", prr: "pra",
  ae: "ai", aew: "ai", aee: "ai", eai: "e ai",
  entedr: "entender", entendr: "entender", entnder: "entender", intender: "entender", idsos: "isso", iso: "isso", isos: "isso",
  sisteminha: "sistema", sistemao: "sistema", sistemona: "sistema", sistemaco: "sistema", sistemazinho: "sistema",
  planilhinha: "planilha", planilhona: "planilha", planilhao: "planilha", planilhazinha: "planilha",
  sitezinho: "site", sitinho: "site", sitao: "site", paginazinha: "pagina", pagininha: "pagina",
  orcamentinho: "orcamento", precinho: "preco", valorzinho: "valor", paineizinho: "painel", painelzinho: "painel",
  botzao: "", botzinho: "", botzona: "", botinho: "", botona: "", botzin: "",
  zapzap: "whatsapp", whats: "whatsapp", wpp: "whatsapp", zapp: "whatsapp",
  // Abreviações e erros comuns de quem escreve rápido no celular.
  quria: "queria", queira: "queria", tentr: "tentar", cmo: "como", cm: "com", ql: "qual", qlq: "qualquer", fzr: "fazer", fazr: "fazer", fz: "faz", ta: "esta", nd: "nada", dps: "depois", agr: "agora", hj: "hoje",
  mts: "muitos", bj: "", pls: "por favor",
  exel: "excel", excell: "excel", ecxel: "excel", eccel: "excel", exell: "excel", planilia: "planilha", planilla: "planilha", planiha: "planilha",
  googlesheets: "google sheets", gsheets: "google sheets", pyton: "python", phyton: "python", pithon: "python", paiton: "python",
  disord: "discord", discrod: "discord", dicord: "discord", powerbi: "power bi", pbi: "power bi",
  orcamneto: "orcamento", orsamento: "orcamento", orcameto: "orcamento",
  tbn: "tambem", vlr: "valor", vlrs: "valores", qtd: "quantidade",
  fncao: "funcao", formla: "formula", fomula: "formula", automatisar: "automatizar", sla: "nao sei",
  // Vocativos que não dizem nada para o assunto (a pessoa está chamando o chat).
  mano: "", mana: "", brother: "", mn: "", bro: "", parceiro: "",
};

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
    "orçamento", "orçamentos", "orçar", "cotação", "cotar", "simular", "simulação", "calcular o orçamento", "calcular o valor", "calcular o preço", "montar", "fazer um orçamento",
    "quero contratar", "contratar", "quero fazer", "quero pedir", "fazer pedido", "fazer um pedido",
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
  revisao: ["revisão", "ajuste", "ajustes", "mudança", "alterar", "alteração", "suporte", "garantia", "defeito", "erro depois", "manutenção", "depois da entrega", "depois que entregar", "depois de entregar", "depois que entrega", "depois de pronto", "pós-venda", "pós venda", "e depois", "se quebrar", "se der problema"],
  desistencia: ["desistir", "desistência", "cancelar o pedido", "cancelamento", "arrepender", "arrependimento", "devolução", "reembolso", "não gostar", "mudar de ideia"],
  privacidade: ["lgpd", "privacidade", "meus dados", "dados pessoais", "cookies", "segurança dos dados", "vazar", "vazamento", "armazena", "guarda meus dados"],
  quem: ["quem é", "quem são", "quem faz", "quem é você", "quem é o marcelo", "sobre você", "sobre o marcelo", "experiência", "quem desenvolve", "quem criou"],
  servicos: ["serviços", "serviço", "o que você faz", "o que vocês fazem", "o que você vende", "o que você oferece", "catálogo", "quais serviços", "o que oferece", "o que faz"],
  ajuda: ["ajuda", "ajudar", "o que você pode", "o que consegue", "como usar", "menu", "opções", "o que posso perguntar", "comece"],
  saudacao: ["oi", "olá", "oie", "bom dia", "boa tarde", "boa noite", "e aí", "opa", "hello", "hey", "salve"],
  agradecimento: ["obrigado", "obrigada", "valeu", "brigado", "agradeço", "muito obrigado", "thanks"],
  despedida: ["tchau", "até logo", "até mais", "falou", "adeus", "flw"],
  bot: ["bot", "bots", "discord", "bot de discord"],

  comoFunciona: [
    "como funciona", "como é o processo", "como é que funciona", "passo a passo", "etapas", "como começo", "como começar",
    "como faço para contratar", "como contratar", "como é o fluxo", "como você trabalha", "como trabalha", "como é o trabalho",
    "como faço pra contratar", "como vai ser", "como é feito", "como são os passos", "como é o atendimento",
  ],
  preparar: [
    "o que preciso", "o que eu preciso", "o que devo", "o que tenho que", "o que levar", "o que mandar", "o que enviar",
    "o que separar", "o que preparar", "antes de pedir", "antes de contratar", "o que ter pronto", "o que você precisa de mim",
    "o que precisa de mim", "que material", "quais documentos", "o que fornecer", "o que entregar a você",
  ],
  receber: [
    "como recebo", "como eu recebo", "como é a entrega", "como entrega", "como entregam", "como vou receber", "onde recebo",
    "receber o projeto", "receber o produto", "receber o trabalho", "como chega", "como me entrega", "como é entregue",
  ],
  confianca: [
    "confiável", "confiança", "confiar", "posso confiar", "golpe", "fraude", "é seguro", "existe mesmo", "é de verdade",
    "referência", "referências", "portfólio", "portifólio", "portfolio", "é sério", "tem cnpj", "vale a pena", "é real",
    "como sei que", "como saber se",
    "é bom", "é bom nisso", "é bom pra isso", "é bom para isso", "ele é bom", "o marcelo é bom", "é bom mesmo", "é bom no que faz", "é competente", "é qualificado",
    "sabe fazer", "ele sabe", "o marcelo sabe", "é capaz", "dá conta", "tem experiência", "tem experiencia", "qual a experiência", "o que ele já fez", "o que o marcelo já fez",
    "o que você já fez", "o que já fez", "já fez algo parecido", "já fez isso", "trabalhos anteriores", "trabalhos que já fez", "projetos que já fez", "projetos anteriores", "quais projetos", "projetos o marcelo já fez", "projetos ele já fez", "projetos que ele fez", "o que ele fez",
    "já trabalhou com", "tem clientes", "já atendeu", "currículo", "formação dele", "tem formação",
  ],
  publico: [
    "para quem é", "pra quem é", "para quem você trabalha", "quem pode contratar", "serve para mim", "serve pra mim", "você atende",
    "vocês atendem", "atende pequeno", "atende empresa", "atende autônomo", "atende mei", "meu perfil", "sou mei", "sou microempreendedor",
    "microempreendedor individual", "posso contratar", "pessoa física", "sem cnpj", "preciso de cnpj", "preciso ter cnpj", "sou autônomo posso", "sou autônoma posso",
  ],
  empresaGrande: [
    "empresa grande", "grande empresa", "multinacional", "saas", "já tenho sistema", "já temos sistema", "erp", "crm",
    "corporação", "grande porte", "empresa de grande porte", "somos grandes",
  ],
  juridico: [
    "é legal", "é ilegal", "jurídico", "juridico", "direitos", "meus direitos", "lei", "processar", "processo", "contrato", "cdc",
    "código de defesa", "responsabilidade", "multa", "rescisão", "cláusula", "advogado", "tribunal", "justiça",
  ],
  exemplos: ["ver exemplos", "exemplos", "exemplo", "mostra um exemplo", "tem exemplo", "demonstração", "demo", "amostra", "me mostra", "mostrar"],
  explicar: [
    "não entendi", "não entendo", "não entendeu", "não dá pra entender", "não dá para entender", "não consigo entender",
    "não faço ideia", "não sei o que é", "o que é", "o que são", "o que significa", "que que é", "pra que serve", "para que serve",
    "pra que isso", "para que isso", "que faz", "faz o que", "me explica", "explica", "explique", "como assim", "sem entender", "confuso",
    "confusa", "não sei nada", "que isso", "não saquei", "não peguei", "tô perdido", "tô perdida", "to perdido", "to perdida",
  ],
  "negocio:comercio": ["loja", "lojas", "comércio", "mercado", "mercadinho", "padaria", "restaurante", "lanchonete", "varejo", "revenda", "bazar", "boutique", "vendo produtos"],
  "negocio:liberal": [
    "profissional liberal", "autônomo", "autônoma", "consultório", "clínica", "escritório", "freelancer", "prestador de serviço",
    "consultoria", "salão", "studio", "estúdio", "personal",
  ],
  "negocio:gestao": ["estoque", "produtos", "gestão de produtos", "gestor", "gestora", "controle de estoque", "inventário", "mercadorias"],

  // --- Conversa: seguimento, menu e pedidos que o chat não faz ---
  menuAssuntos: [
    "quais assuntos", "que assuntos", "sobre o que você fala", "sobre o que você sabe", "o que mais você sabe", "o que mais posso perguntar",
    "o que mais você faz", "me dá uma dica", "me dê uma dica", "uma dica", "dicas de planilha", "dicas de excel", "dicas", "me ensina algo",
    "tirar dúvida de excel", "tirar dúvidas de excel", "dúvidas de excel", "dúvida de excel", "perguntas sobre excel", "dúvidas sobre planilha",
    "ajuda com programação", "dúvidas de programação", "dúvida de programação", "desenvolvimento", "todos os assuntos", "ver os assuntos",
  ],
  // Dúvida de Excel ou programação que nenhum tópico cobre: o chat diz com franqueza o que sabe e o que não sabe.
  devGeral: [
    "excel", "fórmula", "fórmulas", "função", "funções", "vba", "macro", "macros", "programação", "programar", "código", "javascript", "html", "css", "sql",
    "bug", "script", "algoritmo", "docker", "kubernetes", "machine learning", "aprendizado de máquina", "react", "angular", "node", "typescript", "java", "php", "linux", "aws", "git", "framework", "backend", "frontend", "nuvem", "linguagem de programação", "planilhas google", "google sheets", "libreoffice", "desenvolvedor",
  ],
  pedeCodigo: [
    "escreva um código", "escreve um código", "escrever um código", "faz um código", "faça um código", "fazer um código", "gera um código",
    "gere um código", "gerar um código", "me dá o código", "me passa o código", "me manda o código", "código pronto", "código em python para",
    "código em vba para", "código para eu usar", "me faz uma macro", "me faça uma macro", "faz uma macro pra mim", "faz um código pra mim", "faça um código pra mim", "me faz um código", "me faça um código", "faz uma macro para mim", "faça uma macro para mim", "escreva uma macro", "escreve uma macro",
    "me ensina a programar", "ensina a programar", "me ensina programação", "aprender a programar", "curso de programação", "resolva este exercício",
    "resolva esse exercício", "resolver este exercício", "faça meu trabalho", "faz meu trabalho", "faz o meu trabalho", "faça o meu trabalho",
  ],
  // Mais detalhe ou exemplo sobre o assunto que acabou de ser explicado.
  maisDetalhe: [
    "mais detalhes", "mais detalhe", "detalha", "detalhe", "detalhar", "explica melhor", "explique melhor", "explicar melhor", "pode explicar melhor",
    "me explica melhor", "aprofunda", "aprofundar", "fala mais", "conta mais", "quero saber mais", "saber mais", "continua", "continue", "mais informações",
    "mais informação", "não entendi", "não entendi direito", "não ficou claro", "ficou confuso", "mais uma vez", "de novo", "de outro jeito", "com outras palavras",
    "mais simples", "explica mais simples", "explica de forma simples", "em linguagem simples", "pode simplificar", "simplifica",
  ],
  pedeExemplo: [
    "exemplo", "um exemplo", "me dá um exemplo", "me dê um exemplo", "dá um exemplo", "dê um exemplo", "tem exemplo", "mostra um exemplo", "mostre um exemplo",
    "pode dar um exemplo", "exemplo prático", "na prática", "como seria na prática", "como ficaria", "como fica na prática", "um caso", "um caso real",
  ],

  // --- Serviços do catálogo (o id é o de servicos.ts) ---
  "svc:planilha": ["planilha", "planilhas", "organizar planilha", "planilha organizada", "organizar dados", "organizar minha planilha"],
  "svc:painel": ["painel", "dashboard", "power bi", "powerbi", "bi", "gráfico", "gráficos", "indicadores", "painel básico"],
  "svc:automacao": ["automação em excel", "automatizar excel", "automatizar planilha", "macro", "macros", "vba", "power query", "botão no excel"],
  "svc:landing": [
    "site", "sites", "um site", "meu site", "site de uma página", "landing", "landing page", "página de vendas", "criar site", "fazer site", "fazer um site", "quero um site",
    "site para meu negócio", "site pro meu", "página web", "site simples", "site de uma pagina", "e o site", "e do site", "e para o site", "e pro site", "e a página", "e da página",
  ],
  "svc:python": ["python", "script", "scripts", "automação com python", "automatizar com python", "robô", "juntar planilhas", "ler pdf", "ler pdfs"],
  "svc:sistema": ["sistema", "sistemas", "sistema sob medida", "software", "sob medida", "sistema de gestão", "sistema próprio"],

  // Automação sem dizer qual: vira uma pergunta ("Excel ou Python?").
  "svc:automacao?": ["automação", "automatizar", "automatizado", "automático", "automática"],

  // A pessoa lembra que já disse o que quer ("a gente acabou de falar", "eu já falei").
  jaDisse: [
    "acabou de falar", "acabamos de falar", "acabei de falar", "acabei de dizer", "acabou de dizer", "eu ja falei", "eu ja disse", "ja falei", "ja disse", "ja te falei",
    "ja te disse", "falei agora", "disse agora", "acabei de te falar", "como eu falei", "como eu disse", "eu falei", "voce nao entendeu", "nao entendeu",
  ],

  // --- Pedidos que passam do que o chat consegue estimar: vão para o formulário ou o WhatsApp ---
  grande: [
    "site grande", "site completo", "varias paginas", "site com varias paginas", "multiplas paginas", "site institucional", "blog", "site com curso", "site de curso", "site com varias coisas", "site com um monte", "curso online", "fazer curso", "vender curso", "dar curso",
    "plataforma de curso", "plataforma de ensino", "area de membros", "area de alunos", "ead", "portal", "plataforma", "bocado de coisa", "bocado de coisas",
    "monte de coisa", "monte de coisas", "muita coisa", "muitas coisas", "varias funcoes", "site com login", "sistema de cursos",
    "aplicativo", "app", "aplicativo de celular", "loja virtual", "ecommerce", "e-commerce", "marketplace",
    "integração", "integrar", "integração com", "migrar", "migração", "muitos usuários", "vários usuários", "banco de dados",
    "urgente", "urgência", "pra ontem", "para amanhã", "licitação", "contrato grande", "projeto grande",
    "sistema complexo", "inteligência artificial", "chatbot", "app mobile",
  ],

  // --- Fora do escopo: o chat recusa ---
  fora: [
    "receita de", "futebol", "política", "eleição", "eleições", "presidente", "bitcoin", "criptomoeda", "cripto", "investir", "bolsa de valores",
    "ações da bolsa", "previsão do tempo", "clima", "piada", "conta uma piada", "poema", "poesia", "música", "letra de música", "filme", "série",
    "horóscopo", "signo", "namorada", "namorado", "religião", "médico", "remédio", "diagnóstico", "sintoma", "processo judicial",
    "dever de casa", "redação", "trabalho escolar", "quem ganhou", "capital da", "capital do", "quem inventou", "me ensina", "traduza", "tradução", "resumo do livro",
    "notícias", "notícia", "jogo", "game", "chatgpt", "gpt", "openai", "gemini",
  ],
};

/**
 * Intenções: cada uma soma os conceitos que ela reconhece. A de maior pontuação responde; em empate vale a ordem desta lista
 * (a mais específica primeiro). `saudacao` e `agradecimento` ficam por último: "oi, quanto custa?" é uma pergunta de preço.
 */
export const intencoes: { id: Intencao; conceitos: string[] }[] = [
  // "Como funciona o desconto?" é pergunta de desconto: ele vem antes do "como funciona" genérico.
  { id: "desconto", conceitos: ["desconto"] },
  { id: "comoFunciona", conceitos: ["comoFunciona"] },
  // "Sou MEI, posso contratar?" é pergunta de público, e não pedido de orçamento (ambas têm "contratar").
  { id: "publico", conceitos: ["publico"] },
  { id: "orcar", conceitos: ["orcar"] },
  { id: "preco", conceitos: ["preco"] },
  { id: "prazo", conceitos: ["prazo"] },
  { id: "incluso", conceitos: ["incluso"] },
  { id: "pagamento", conceitos: ["pagamento"] },
  { id: "receber", conceitos: ["receber"] },
  { id: "nota", conceitos: ["nota"] },
  { id: "desistencia", conceitos: ["desistencia"] },
  { id: "revisao", conceitos: ["revisao"] },
  { id: "privacidade", conceitos: ["privacidade"] },
  { id: "juridico", conceitos: ["juridico"] },
  { id: "preparar", conceitos: ["preparar"] },
  { id: "confianca", conceitos: ["confianca"] },
  { id: "indicar", conceitos: ["indicar"] },
  { id: "quem", conceitos: ["quem"] },
  // "Quem é o Marcelo?" tem "marcelo" (contato) e "quem é" (quem): vence quem, que vem antes.
  { id: "contato", conceitos: ["contato"] },
  { id: "bot", conceitos: ["bot"] },
  { id: "servicos", conceitos: ["servicos"] },
  { id: "exemplos", conceitos: ["exemplos"] },
  { id: "explicar", conceitos: ["explicar"] },
  { id: "ajuda", conceitos: ["ajuda"] },
  { id: "negocio", conceitos: ["negocio:comercio", "negocio:liberal", "negocio:gestao"] },
  { id: "saudacao", conceitos: ["saudacao"] },
  { id: "agradecimento", conceitos: ["agradecimento"] },
  { id: "despedida", conceitos: ["despedida"] },
];

export type Intencao =
  | "juridico"
  | "comoFunciona"
  | "preparar"
  | "receber"
  | "confianca"
  | "publico"
  | "exemplos"
  | "explicar"
  | "negocio"
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

/**
 * Respostas curtas a uma pergunta do assistente ("Quer montar a estimativa?" → "sim", "pode ser", "agora não"). Valem só quando a
 * mensagem inteira é feita dessas palavras (até 4), para "pode" ou "quero" no meio de uma pergunta não virarem um "sim".
 * Cada palavra vem sem acento (o motor normaliza); gírias como "ta" e "vlw" já são trocadas antes.
 */
export const palavrasDeSim: string[] = [
  "sim", "pode", "ser", "quero", "claro", "certeza", "com", "bora", "vamos", "la", "manda", "mande", "isso", "mesmo", "aham", "uhum", "ok", "okay",
  "beleza", "fechado", "combinado", "favor", "por", "topo", "esta", "bom", "certo", "show", "mostra", "mostre", "mostrar", "ver", "continua", "continue",
  "positivo", "gostaria", "vai", "yes", "gostei", "otimo", "perfeito", "legal", "demorou", "tranquilo", "faz", "faca",
];
export const palavrasDeNao: string[] = [
  "nao", "agora", "obrigado", "obrigada", "depois", "outra", "vez", "ainda", "nada", "so", "isso", "por", "enquanto", "talvez", "quero", "preciso",
  "mais", "valeu", "ja", "esta", "bom", "ta", "tudo", "dispenso", "deixa", "deixe", "pular", "eu", "vejo", "vou", "pensar", "penso", "que",
];
