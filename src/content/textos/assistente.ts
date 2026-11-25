// Textos da interface e das respostas curtas do Assistente Cyl (só Negócios). Os números (preço, prazo, desconto) NUNCA
// são escritos aqui: chegam por parâmetro, vindos de servicos.ts e orcamento.ts. Os guias longos ficam em
// assistenteGuias.ts. Os dois ficam fora do index.ts de propósito, para o texto não ir no JavaScript da home: só o chat
// (carregado ao abrir) importa estes arquivos.
//
// Voz: amigável e acolhedora, com 1 ou 2 emojis por resposta no máximo. O assistente não se descreve no masculino nem no
// feminino ("Assistente Cyl por aqui", "conte comigo"). Tratamento: "o senhor" / "a senhora" quando a pessoa deixa o gênero
// claro; na dúvida, forma neutra (ver `tr`).

export type Tratamento = "o senhor" | "a senhora" | null;

const primeiraMaiuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

/**
 * Texto com tratamento. `com` usa `{S}` ("o senhor"/"a senhora") ou `{Sc}` (a mesma forma com a inicial maiúscula);
 * `neutro` é o que vale quando não se sabe o gênero. Escreva sempre os dois, para a frase não depender de pronome.
 */
export function tr(g: Tratamento, com: string, neutro: string): string {
  if (!g) return neutro;
  return com.replaceAll("{Sc}", primeiraMaiuscula(g)).replaceAll("{S}", g);
}

import { comum } from "./comum";

export const assistente = {
  nome: "Assistente Cyl",
  /** Rótulo do botão redondo (tooltip no mouse e no foco do teclado, rótulo acessível no celular). */
  botao: "Assistente Cyl",
  botaoAbrir: "Abrir o Assistente Cyl",
  convite: "Está com dúvidas? Fale com a nossa assistente Cyl",
  conviteFechar: "Dispensar o convite",
  fechar: "Fechar o Assistente Cyl",
  /** Botão de ícone (chat com "+") no cabeçalho: nome acessível e dica. */
  novaConversa: "Nova conversa",
  titulo: "Assistente Cyl",
  /**
   * Aviso fixo na faixa do topo: é um programa, não a pessoa, e nada sai do aparelho. A faixa mostra só o começo (`avisoCurto`);
   * o resto (`avisoResto`) abre em "Saiba mais" e fica sempre disponível ao leitor de tela. `aviso` é o texto inteiro.
   */
  avisoCurto: "Assistente automático, não o Marcelo.",
  avisoResto: "A conversa fica guardada só neste aparelho e não é enviada a ninguém.",
  aviso: "Assistente automático, não o Marcelo. A conversa fica guardada só neste aparelho e não é enviada a ninguém.",
  avisoMais: "Saiba mais",
  avisoMenos: "Mostrar menos",

  /** Alça para aumentar e diminuir o painel (só em tela larga). */
  redimensionar: "Redimensionar o chat. Use as setas para aumentar ou diminuir e Enter para voltar ao tamanho padrão.",
  /** Botão circular ao lado do painel (só em tela larga): leva à área CylDev/Comunidade. */
  conhecerCyldev: "Conhecer o CylDev",

  /** Conversas anteriores (guardadas no navegador até a pessoa limpar os dados do site). */
  anteriores: {
    botao: "Conversas anteriores",
    titulo: "Conversas anteriores",
    voltarConversa: "Voltar à conversa",
    voltarLista: "Voltar à lista",
    vazio: "Ainda não há conversas anteriores. Quando você começar uma conversa nova, a atual fica guardada aqui.",
    aviso: "Ficam guardadas só neste aparelho, até você limpar os dados do site no navegador.",
    mensagens: (n: number) => (n === 1 ? "1 mensagem" : `${n} mensagens`),
  },

  // TEMPORÁRIO (remover na entrega final; ver docs/decisoes/assistente.md): botão que copia a conversa para a área de transferência.
  copiarTemp: {
    botao: "Copiar (temporário)",
    ok: "Conversa copiada.",
    erro: "Não consegui copiar. Selecione o texto e copie à mão.",
  },
  campoRotulo: "Sua mensagem",
  campoDica: "Pergunte sobre preço, prazo ou monte um orçamento",
  enviar: "Enviar",
  voce: "Você",
  assistente: "Assistente Cyl",
  maximoCaracteres: 400,
  conversaLog: "Conversa com o Assistente Cyl",
  digitando: "Assistente Cyl respondendo",
  pular: "Mostrar a resposta toda",

  /** Indicadores de estado, mostrados com três pontinhos antes de cada resposta. */
  estados: {
    digitando: "Digitando…",
    pensando: "Pensando…",
    pesquisando: "Pesquisando…",
    montando: "Montando seu orçamento…",
  },

  /**
   * Quanto o Marcelo costuma demorar. Sem garantia de prazo (decisão do Marcelo em 19/11/2026). Entra nos fatos do
   * assistente, por isso o "2" é aceito pelo validador de números.
   */
  tempoResposta: comum.tempoResposta,

  boasVindas: "Oi! Assistente Cyl por aqui 😊 Posso tirar dúvidas sobre serviços, preços, prazos, pagamento e entrega, e montar uma estimativa pergunta por pergunta.",
  boasVindasPergunta: "Por onde quer começar?",

  chips: {
    servicos: "Ver os serviços",
    preco: "Quanto custa?",
    prazo: "Qual o prazo?",
    orcar: "Montar orçamento",
    indicar: "Não sei qual escolher",
    pagamento: "Como é o pagamento?",
    comoFunciona: "Como funciona?",
    preparar: "O que preciso ter pronto?",
    receber: "Como recebo o projeto?",
    confianca: "Posso confiar?",
    depois: "E depois da entrega?",
    exemplos: "Ver exemplos",
    desconto: "Tem desconto?",
    bots: "Ver os bots",
    whatsapp: "Falar no WhatsApp",
    comercio: "Tenho uma loja",
    liberal: "Sou profissional liberal",
    gestao: "Cuido de produtos e estoque",
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
    termosPagamento: "Ler sobre o pagamento nos Termos",
    termosGarantia: "Ler sobre a garantia nos Termos",
    privacidade: "Ler a Política de privacidade",
    perguntas: "Ver todas as perguntas",
    sobre: "Ler a seção Sobre",
    exemplo: "Ver o exemplo na página",
  },

  // Respostas -----------------------------------------------------------------------------------------------------------
  servicosIntro: "Estes são os serviços de Negócios, com o valor de partida de cada um:",
  servicoLinha: (nome: string, preco: string) => `${nome}: ${preco}`,
  servicosExplica: "Cada um resolve um problema do dia a dia, e dá para juntar mais de um. O valor final depende das respostas no orçamento e vai na proposta por escrito.",
  servicosDica: "Dica: se bater dúvida sobre qual escolher, o guia “Não sei qual escolher” indica por onde começar em duas perguntas.",
  servicosPergunta: "Qual deles chamou mais a atenção?",

  precoGeralIntro: "Os valores de partida são estes:",
  precoServico: (nome: string, preco: string) => `${nome}: ${preco}.`,
  precoHora: (hora: string) => `Cada hora de trabalho a mais, que as respostas do orçamento podem acrescentar, soma ${hora}.`,
  precoNota: "O site calcula uma estimativa; o valor final vai na proposta por escrito, depois da conversa, e é sempre um valor justo para o que será feito.",
  precoDica: (combo2: string) => `Dica: juntando serviços combináveis, o combo dá ${combo2} de desconto já com 2 serviços.`,
  precoPergunta: "Quer montar a estimativa do seu caso?",

  prazoGeralIntro: "Prazo do pacote básico de cada serviço:",
  prazoLinha: (nome: string, prazo: string) => `${nome}: ${prazo}`,
  prazoServico: (nome: string, prazo: string) => `${nome}: ${prazo} (pacote básico).`,
  prazoNota:
    "Respostas que pedem mais horas aumentam o prazo, e o orçamento mostra isso. A data de entrega vai na proposta e conta a partir da entrada e do recebimento do material combinado.",
  prazoAtraso:
    "Se o material demorar a chegar, o prazo fica suspenso pelo mesmo tempo. Se o atraso for do lado do Marcelo, ele avisa antes da data e combina a nova data.",
  prazoCombinar: "Esse serviço tem prazo a combinar: ele é definido na proposta, depois da conversa.",
  prazoPergunta: "Quer ver o prazo do seu caso no orçamento?",

  inclusoServico: (nome: string, resultado: string) => `${nome}. ${resultado}`,
  inclusoLista: "Inclui:",
  inclusoSem: "Qual serviço quer conhecer?",
  inclusoPergunta: "Quer ver o preço, o prazo ou montar a estimativa?",

  descontoCombo: (pct2: string, pct3: string, nomes: string) =>
    `Juntando serviços combináveis (${nomes}), o combo dá ${pct2} de desconto com 2 serviços e ${pct3} com 3 ou mais.`,
  descontoPiloto: (pct: string, restam: number) =>
    `Há também vagas do desconto de piloto: ${pct} sobre a criação (restam ${restam}). Combo e piloto não se somam: vale o que abate mais reais.`,
  descontoNota: "O carrinho do site aplica o desconto certo sozinho.",
  descontoDica: "Dica: se há mais de uma necessidade (por exemplo, planilha e painel), pedir juntas costuma valer a pena.",
  descontoPergunta: "Quer montar o orçamento e ver o total já com o desconto?",

  quemIntro: "Quem presta o serviço é o Marcelo Vaz.",
  quemPergunta: "Quer ler mais na seção Sobre, ou saber como é o trabalho?",
  bot: "Os bots de Discord ficam na área Comunidade do site, com preço e mensalidade explicados lá. Aqui em Negócios cuidamos de planilhas, painéis, automações, páginas e sistemas.",
  botPergunta: "Quer saber como funciona a mensalidade dos bots?",

  contato: "Dá para falar direto com o Marcelo por estes canais:",
  contatoNota: "Se preferir escrever aqui no site, o pedido pelo orçamento também chega até ele.",
  contatoPergunta: "Prefere deixar o caso por escrito no formulário?",

  ajuda: "Eu posso:",
  ajudaLista: [
    "explicar cada serviço em linguagem simples, com o que inclui, o preço de partida e o prazo",
    "contar como funciona o pedido, o pagamento e a entrega",
    "montar uma estimativa, pergunta por pergunta",
    "indicar por onde começar, de acordo com o seu tipo de negócio",
  ],
  ajudaFim: "Para pedidos maiores, ou o que eu não souber, o caminho é o formulário do orçamento ou o WhatsApp.",

  faqPrefixo: "Do jeito que está nas perguntas do site:",
  faqLinkRotulo: "Ver no site",
  faqPergunta: "Isso respondeu, ou quer ver outro assunto?",

  obrigado: "Por nada, foi um prazer 😊 Se quiser seguir, é só chamar.",
  obrigadoPergunta: "Posso ajudar com mais alguma coisa?",
  tchau: "Até mais! Se precisar, o Assistente Cyl estará por aqui.",

  saudacao: "Oi, tudo bem? Assistente Cyl por aqui 😊",
  /** Resposta a um cumprimento: ecoa o cumprimento e segue, sem repetir a apresentação. */
  saudacaoResposta: (cumprimento: string) => `${cumprimento}! Tudo bem? 😊`,
  saudacaoPergunta: "Como posso ajudar? Pode escolher uma opção ou escrever a sua dúvida.",
  saudacaoLeve: "Opa, salve! 😊",

  // Guia "não sei qual escolher" -------------------------------------------------------------------------------------------
  guiaIntro: "Vou fazer até duas perguntas para indicar por onde começar.",
  guiaPorque: (texto: string) => `Pelo guia do site: ${texto}`,
  guiaConversar: "Sem problema. Conte o caso pelo WhatsApp e o Marcelo ajuda a escolher.",
  guiaBot: "Bots de Discord ficam na área Comunidade do site.",

  // Orçamento na conversa ----------------------------------------------------------------------------------------------------
  orcarQual: "Para qual serviço quer a estimativa?",
  orcarComeco: (nome: string) => `Vamos montar a estimativa de ${nome}. Respondo uma pergunta por vez; dá para clicar nas opções ou digitar.`,
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
  orcarVarios: (nomes: string) => `Combinado: vamos montar a estimativa de ${nomes}, um serviço de cada vez. Respondo uma pergunta por vez; dá para clicar nas opções ou digitar.`,
  orcarProximoServico: (feito: string, proximo: string) => `Estimativa de ${feito} pronta. Agora vamos a ${proximo}.`,
  orcarResumoVarios: (total: string) => `Estimativa do pedido, com todos os serviços: ${total}.`,
  orcarDescontoLinha: (rotulo: string, valor: string) => `Desconto (${rotulo}): − ${valor}`,
  orcarSomaLinha: (valor: string) => `Soma dos serviços: ${valor}`,
  orcarProximoEnviar: "Quer que eu envie esse pedido direto ao Marcelo, por aqui mesmo, sem passar pelo carrinho? Só preciso do seu nome e do seu WhatsApp.",
  orcarCarrinhoOk: "Coloquei no carrinho do site, com as suas respostas. Lá dá para revisar, ajustar e enviar.",

  // Enviar o pedido pela conversa (mesmo envio do carrinho: EmailJS, com o registro de aceite) ------------------------------------
  envioNome: "Para enviar o pedido ao Marcelo, como você se chama?",
  envioNomeInvalido: "Preciso de um nome para o Marcelo saber com quem falar. Pode escrever o seu primeiro nome?",
  envioWhats: (nome: string) => `Prazer, ${nome}! Qual o seu WhatsApp, com DDD? É por ele que o Marcelo responde.`,
  envioConfirma: (nome: string, whatsapp: string) => `Confere? Vou enviar o pedido em nome de ${nome}, com resposta pelo WhatsApp ${whatsapp}.`,
  envioPrivacidade: "Só uso o nome e o WhatsApp para responder ao seu pedido. Eles não ficam guardados neste aparelho junto com a conversa.",
  envioAceite: "Ao enviar, você concorda com os Termos de contratação e com a Política de privacidade. O pedido ainda não é contrato: o valor final vai na proposta por escrito.",
  envioEnviando: "Enviando o seu pedido...",
  envioJaEnviando: "O pedido já está sendo enviado, só um instante.",
  envioOk: "Pedido enviado! Nada foi cobrado e nada está fechado: o Marcelo costuma responder em até 2 horas, sem garantia, e confirma os detalhes por WhatsApp antes da proposta por escrito.",
  envioOkPergunta: "Posso ajudar em mais alguma coisa?",
  envioFalhou: "Não consegui enviar por aqui agora, e o seu pedido não foi perdido. Os botões abaixo levam o mesmo pedido pelo WhatsApp ou pelo e-mail.",
  envioCancelado: "Tudo bem, não enviei nada. O que você escreveu não foi guardado.",
  envioDescricaoTitulo: "Sua descrição vai junto:",
  envioSobMedida:
    "Isso é um projeto sob medida: o valor e o prazo não saem por estimativa, o Marcelo avalia caso a caso e responde com uma proposta. Posso mandar o seu pedido, com o que você contou, direto para ele por aqui mesmo. Só preciso do seu nome e do seu WhatsApp.",
  envioSobMedidaPergunta: "Quer que eu envie?",
  envioSobMedidaObs: (texto: string) => `Descrição do cliente (pelo assistente): ${texto}`,
  envioChips: { enviar: "Enviar pedido ao Marcelo", confirmar: "Confirmar e enviar", corrigir: "Corrigir meus dados", cancelar: "Cancelar o envio" },
  jaDisse: "Verdade, desculpe a pergunta repetida. Já anotei o que você falou.",

  // Encaminhar, acolher e recusar ----------------------------------------------------------------------------------------------
  maior:
    "Esse pedido é maior ou mais específico do que consigo estimar por aqui, e prefiro não chutar preço nem prazo. O melhor é contar o caso ao Marcelo pelo formulário do orçamento ou pelo WhatsApp.",
  /** Pergunta específica que o site não cobre: nada de chute, e o caminho é falar com o Marcelo. */
  semBase:
    "Essa eu prefiro não responder no chute, porque não está no que o site explica. O melhor é perguntar direto ao Marcelo, pelo formulário do orçamento ou pelo WhatsApp.",
  /** Só quando a pergunta foge do assunto (nunca em cumprimento ou dúvida vaga). */
  fora:
    "Só posso responder coisas relacionadas ao CylDev: planilhas, painéis, automações, páginas e sistemas, com preço, prazo, entrega e contato. Sobre esse outro assunto não consigo ajudar.",
  foraOpcoes: "Posso ajudar com algo disso?",
  injecao:
    "Minhas regras não mudam por pedido na conversa. Continuo respondendo só sobre os serviços deste site. Posso ajudar com preço, prazo, entrega ou um orçamento?",
  juridico:
    "Sobre direitos, contrato e cancelamento eu não posso dar opinião jurídica. O que vale está escrito nas páginas de Termos e de Privacidade, em linguagem simples.",
  longa: "A mensagem ficou longa; li só o começo.",
  vazia: "Escreva a sua pergunta ou toque em uma das opções.",

  /** Mensagem vaga ou confusa: acolhe, adivinha e oferece caminhos. Nunca "não encontrei". */
  acolhe: "Sem problema, vamos por partes 😊",
  acolheExplica:
    "Aqui o Marcelo organiza planilhas, cria painéis com os seus números, páginas de apresentação e sistemas sob medida, tudo explicado em português claro.",
  acolhePalpite: "Pelo que escreveu, talvez seja isto:",
  acolheDica: "Dica: se preferir, conte o caso com as suas palavras pelo WhatsApp, e o Marcelo ajuda a achar o caminho.",

  mensagemWhatsapp: "Tenho uma dúvida que o Assistente Cyl do site não resolveu.",
  origemWhatsapp: "negocios-assistente",
} as const;
