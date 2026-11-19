// Textos do assistente do chat (só Negócios). Os números (preço, prazo, desconto) NUNCA são escritos aqui:
// chegam por parâmetro, vindos de servicos.ts e orcamento.ts. Fica de fora do index.ts de propósito, para o texto
// não ir no JavaScript da home: só o chat (carregado ao abrir) importa este arquivo.

export const assistente = {
  nome: "Assistente do site",
  botao: "Tirar dúvidas",
  botaoAbrir: "Abrir o assistente do site",
  fechar: "Fechar o assistente",
  limpar: "Limpar a conversa",
  titulo: "Assistente do site",
  /** Aviso fixo no topo: é um programa, não a pessoa, e nada sai do aparelho. */
  aviso: "Assistente automático, não o Marcelo. A conversa fica só neste aparelho: não é enviada nem guardada.",
  campoRotulo: "Sua mensagem",
  campoDica: "Pergunte sobre preço, prazo ou monte um orçamento",
  enviar: "Enviar",
  voce: "Você",
  assistente: "Assistente",
  maximoCaracteres: 400,
  conversaLog: "Conversa com o assistente",
  digitando: "Assistente respondendo",

  boasVindas:
    "Oi! Sou o assistente automático do site e respondo só com o que está nele. Posso tirar dúvidas sobre serviços, preços, prazos e pagamento, e montar uma estimativa com você.",
  boasVindasPergunta: "O que você precisa?",

  chips: {
    servicos: "Ver os serviços",
    preco: "Quanto custa?",
    prazo: "Qual o prazo?",
    orcar: "Montar orçamento",
    indicar: "Não sei qual escolher",
    pagamento: "Como é o pagamento?",
    whatsapp: "Falar no WhatsApp",
    detalhes: (nome: string) => `Detalhes: ${nome}`,
    orcarServico: (nome: string) => `Orçar: ${nome}`,
    escolherServico: (nome: string) => nome,
    pronto: "Pronto",
    voltar: "Voltar uma pergunta",
    cancelar: "Cancelar o orçamento",
    oQueE: "O que é isso?",
    recomecar: "Montar outro orçamento",
  },

  acoes: {
    whatsapp: "Falar no WhatsApp",
    email: "Enviar e-mail",
    formulario: "Ir ao orçamento do site",
    carrinho: "Adicionar ao carrinho e revisar",
    carrinhoEnviar: "Revisar e enviar o pedido",
    detalhes: "Ver detalhes na página",
    comunidade: "Ver os bots na Comunidade",
    termos: "Ler os Termos",
    perguntas: "Ver todas as perguntas",
    sobre: "Ler a seção Sobre",
  },

  // Respostas -----------------------------------------------------------------------------------------------------------
  servicosIntro: "Estes são os serviços de Negócios, com o valor de partida de cada um:",
  servicoLinha: (nome: string, preco: string) => `${nome}: ${preco}`,
  servicosFim: "O valor final depende das suas respostas no orçamento e vai na proposta por escrito.",

  precoGeralIntro: "Os valores de partida são estes:",
  precoServico: (nome: string, preco: string) => `${nome}: ${preco}.`,
  precoHora: (hora: string) => `Cada hora de trabalho a mais, que as suas respostas podem acrescentar, soma ${hora}.`,
  precoNota: "O site calcula uma estimativa; o valor final vai na proposta por escrito, depois da conversa.",
  precoPergunta: "Quer montar a estimativa do seu caso?",

  prazoGeralIntro: "Prazo do pacote básico de cada serviço:",
  prazoLinha: (nome: string, prazo: string) => `${nome}: ${prazo}`,
  prazoServico: (nome: string, prazo: string) => `${nome}: ${prazo} (pacote básico).`,
  prazoNota:
    "Respostas que pedem mais horas aumentam o prazo, e o orçamento mostra isso. A data de entrega vai na proposta e conta a partir da entrada e do recebimento do seu material.",
  prazoCombinar: "Esse serviço tem prazo a combinar: ele é definido na proposta, depois da conversa.",

  inclusoServico: (nome: string, resultado: string) => `${nome}. ${resultado}`,
  inclusoLista: "Inclui:",
  inclusoSem: "Qual serviço você quer conhecer?",

  descontoCombo: (pct2: string, pct3: string, nomes: string) =>
    `Juntando serviços combináveis (${nomes}), o combo dá ${pct2} de desconto com 2 serviços e ${pct3} com 3 ou mais.`,
  descontoPiloto: (pct: string, restam: number) =>
    `Há também vagas do desconto de piloto: ${pct} sobre a criação (restam ${restam}). Combo e piloto não se somam: vale o que abate mais reais.`,
  descontoNota: "O carrinho do site aplica o desconto certo sozinho.",

  quemIntro: "Quem presta o serviço é o Marcelo Vaz.",
  bot: "Os bots de Discord ficam na área Comunidade do site, com preço e mensalidade explicados lá. Aqui em Negócios cuidamos de planilhas, painéis, automações, páginas e sistemas.",

  contato: "Você fala direto com o Marcelo por estes canais:",
  contatoNota: "Se preferir escrever aqui no site, o pedido pelo orçamento também chega até ele.",

  ajuda: "Eu posso:",
  ajudaLista: [
    "explicar cada serviço, o que inclui, o preço de partida e o prazo",
    "montar uma estimativa com você, pergunta por pergunta",
    "responder sobre pagamento, nota, desistência e entrega",
    "indicar por onde começar",
  ],
  ajudaFim: "Para pedidos maiores, ou o que eu não souber, o caminho é o formulário do orçamento ou o WhatsApp.",

  faqPrefixo: "Do jeito que está nas perguntas do site:",
  faqLinkRotulo: "Ver no site",

  obrigado: "Por nada! Se quiser seguir, é só chamar.",
  tchau: "Até mais! Se precisar, estou por aqui.",

  // Guia "não sei qual escolher" -------------------------------------------------------------------------------------------
  guiaIntro: "Vou te fazer até duas perguntas para indicar por onde começar.",
  guiaPorque: (texto: string) => `Pelo guia do site: ${texto}`,
  guiaConversar: "Sem problema. Conte o seu caso pelo WhatsApp e o Marcelo te ajuda a escolher.",
  guiaBot: "Bots de Discord ficam na área Comunidade do site.",

  // Orçamento na conversa ----------------------------------------------------------------------------------------------------
  orcarQual: "Para qual serviço você quer a estimativa?",
  orcarComeco: (nome: string) => `Vamos montar a estimativa de ${nome}. Respondo uma pergunta por vez; você pode clicar nas opções ou digitar.`,
  orcarPergunta: (n: number, texto: string) => `Pergunta ${n}: ${texto}`,
  orcarMultipla: "Pode marcar mais de uma. Quando terminar, toque em Pronto.",
  orcarMarcadas: (lista: string) => `Marcadas até agora: ${lista}.`,
  orcarNaoEntendi: "Não consegui ligar isso a uma das opções. Toque em uma delas, ou digite como aparece no botão.",
  orcarCancelado: "Orçamento cancelado. Nada foi guardado.",
  orcarRetomar: "Voltando ao orçamento:",
  orcarResumoTitulo: (nome: string, preco: string) => `Estimativa de ${nome}: ${preco}.`,
  orcarPrazo: (prazo: string) => `Prazo: ${prazo}.`,
  orcarComoChegamos: "Como chegamos a esse valor:",
  orcarLinha: (rotulo: string, valor: string) => `${rotulo}: ${valor}`,
  orcarBaseHoras: (nome: string) => `${nome}`,
  orcarEstimativaNota:
    "É uma estimativa feita só com as suas respostas. O valor final vai na proposta por escrito, depois da conversa, e só vale o que estiver nela.",
  orcarProvisorio: "Para este serviço o preço varia pelas respostas e o prazo é definido na proposta.",
  orcarProximo: "Quer levar essa estimativa para o carrinho e enviar o pedido?",
  orcarCarrinhoOk: "Coloquei no carrinho do site, com as suas respostas. Lá você revisa, ajusta e envia.",

  // Encaminhar e recusar ------------------------------------------------------------------------------------------------------
  maior:
    "Esse pedido é maior ou mais específico do que eu consigo estimar por aqui, e eu não vou chutar preço nem prazo. O melhor é contar o caso ao Marcelo pelo formulário do orçamento ou pelo WhatsApp.",
  naoSei:
    "Não encontrei isso no site, e prefiro não chutar. Para esse assunto, use o formulário do orçamento ou chame o Marcelo no WhatsApp.",
  fora:
    "Eu só falo sobre os serviços deste site: planilhas, painéis, automações, páginas e sistemas, com preço, prazo, entrega e contato. Sobre esse outro assunto não posso ajudar.",
  foraOpcoes: "Posso ajudar com algo disso?",
  injecao:
    "Minhas regras não mudam por pedido na conversa. Continuo respondendo só sobre os serviços deste site. Posso ajudar com preço, prazo, entrega ou um orçamento?",
  longa: "Sua mensagem ficou longa; li só o começo.",
  vazia: "Escreva a sua pergunta ou toque em uma das opções.",

  mensagemWhatsapp: "Tenho uma dúvida que o assistente do site não resolveu.",
  origemWhatsapp: "negocios-assistente",
} as const;
