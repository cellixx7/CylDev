// Todos os textos das páginas. Fonte: docs/COPY.md (versão 2, respostas do Marcelo em 02/11/2026).
// Preços nunca são escritos à mão aqui: saem de servicos.ts e orcamento.ts.

export const comum = {
  privacidade:
    "Este site não usa ferramentas de rastreamento. O que você mandar pelo formulário ou pelo WhatsApp serve só para eu responder o seu contato. O formulário é enviado pelo serviço EmailJS.",
  dadosFicticios: "dados fictícios",
  temaClaro: "Tema claro",
  temaEscuro: "Tema escuro",
  menuAbrir: "Abrir menu",
  menuFechar: "Fechar menu",
};

export const catalogo = {
  inclui: "Inclui",
  prazo: "Prazo",
  mensalidade: "Mensalidade",
  /** Ex.: "R$ 30 por mês, mais a hospedagem" */
  valorMensalidade: (valor: string, aPartirDe: boolean) =>
    `${aPartirDe ? "a partir de " : ""}${valor} por mês, mais a hospedagem`,
};

export const piloto = (restam: number, percentual: number, primeiraFaixa: boolean) =>
  primeiraFaixa
    ? `As 5 primeiras vagas têm 10% de desconto. As 5 seguintes, 5%. Restam ${restam} com ${percentual}%. Chame no WhatsApp e garanta a sua.`
    : `Restam ${restam} vagas com ${percentual}% de desconto. Chame no WhatsApp e garanta a sua.`;

export const pilotoNota = "O desconto vale sobre o preço de criação.";

/** Seção #orcamento (Negócios): lista, painel com perguntas e carrinho. Valores saem de servicos.ts, perguntas.ts e orcamento.ts. */
export const orcamento = {
  titulo: "Monte o seu orçamento",
  intro:
    "Escolha um serviço e responda às perguntas. A estimativa muda na hora e mostra como chegamos ao valor. Você fecha o pedido pelo site ou fala direto comigo no WhatsApp. O valor final vai na proposta por escrito, depois que eu vir o seu caso.",
  lista: {
    titulo: "Serviços",
    rotuloLista: "Lista de serviços",
    noCarrinho: "no carrinho",
    porHora: "/h",
    sobConsulta: "sob consulta",
    comboTitulo: "Precisa de mais de uma coisa?",
    comboTexto: "Planilha, painel e automação no mesmo pedido têm desconto de combo e um prazo só.",
    comboBotao: "Montar combo",
  },
  navegacao: {
    voltar: "← Serviços",
    carrinho: (n: number) => `Carrinho (${n})`,
  },
  painel: {
    inclui: "O que está incluso",
    perguntas: "Perguntas",
    mudaValor: "Muda o valor.",
    naoMudaValor: "Não muda o valor.",
    marqueQuantas: "Marque quantas quiser.",
    oQueEIsso: "O que é isso?",
    incluso: (n: number) => `Já ${n === 1 ? "incluso" : "inclusos"}: ${n}.`,
    cadaExtra: (valor: string) => `Cada a mais: + ${valor}.`,
    custo: (valor: string) => `+ ${valor}`,
  },
  estimativa: {
    titulo: "Estimativa",
    comoChegamos: "Como chegamos a esse valor",
    aPartirDe: "a partir de",
    estimativaBot: "estimativa",
    sobConsulta: "Sob consulta",
    porHora: "por hora",
    tabela: "Preço de tabela: ",
    comPiloto: (percentual: number, restam: number) =>
      `Com ${percentual}% de desconto de piloto. Restam ${restam} ${restam === 1 ? "vaga" : "vagas"} nessa faixa.`,
    horas: "Trabalho",
    prazo: "Prazo",
    mensalidade: "Mensalidade",
    valorMensalidade: (valor: string) => `${valor} por mês, mais a hospedagem à parte`,
    notaAPartirDe: "O valor depende do que a automação vai fazer. Este é o mínimo para as suas respostas.",
    notaBot: "É uma estimativa pelas suas respostas. O prazo é combinado na conversa.",
    notaEstimativa: "É uma estimativa. O valor e a data de entrega ficam fechados na proposta.",
    consulta: "Começa com uma conversa. Me conte o caso e eu mando uma proposta por escrito com valor e prazo.",
    adicionar: "Adicionar ao carrinho",
    tirar: "No carrinho (tirar)",
  },
  carrinho: {
    titulo: "Seu carrinho",
    vazio: "Nada por aqui ainda. Escolha um serviço na lista e adicione.",
    editar: "Editar",
    tirar: "Tirar",
    soma: "Soma de tabela",
    desconto: (rotulo: string) => `Desconto (${rotulo})`,
    descontoNota: "Combo e piloto não se somam: vale o maior.",
    prazo: "Prazo",
    prazoCombinaveis: "Planilha, painel, automação e landing, juntos",
    mensalidade: "Mensalidade dos bots",
    total: "Total estimado",
    totalSobConsulta: "Sistema sob medida fica fora do total: o valor sai na proposta.",
    notaEstimativa: "Estimativa, confirmada na conversa.",
    comoFechar: "Como você prefere fechar?",
    pelosite: "Fechar o pedido pelo site",
    pelositeTexto: "Deixe o seu nome e o WhatsApp. Eu respondo por lá.",
    nome: "Nome",
    whatsapp: "WhatsApp (com DDD)",
    enviar: "Fechar pedido pelo site",
    enviando: "Enviando…",
    falhou: "Não consegui enviar agora. Chame no WhatsApp ou mande um e-mail com o mesmo pedido.",
    vazioAviso: "Adicione ao menos um serviço para fechar o pedido pelo site.",
    whatsappBotao: "Chamar o Marcelo no WhatsApp",
    whatsappTexto: "O seu carrinho vai na mensagem.",
    privacidade: "Seu nome e WhatsApp são usados só para responder este pedido. Eu confirmo por WhatsApp e combinamos o Pix.",
  },
};

export const negocios = {
  nav: [
    { href: "/#orcamento", rotulo: "Orçamento" },
    { href: "/como-funciona/", rotulo: "Como funciona" },
    { href: "/#sobre", rotulo: "Sobre" },
    { href: "/#entregas", rotulo: "Entregas" },
    { href: "/#contato", rotulo: "Contato" },
  ],
  /** Controle no centro do header: leva para a área de comunidade. */
  atalhoComunidade: {
    href: "/comunidade/",
    rotulo: "Ir para a área de comunidade (Discord e jogos)",
    dicaTitulo: "Conheça o CylDev",
    dicaTexto: "Tenha o seu próprio BOT do Discord com interface única sua e muito mais",
    /** Só aparece no toque (celular/tablet): no mouse o próprio controle já é o link. */
    dicaAcao: "Ir para o CylDev",
  },
  apresentacao: {
    titulo: "Marcelo Vaz",
    subtitulo:
      "Transformo a sua planilha bagunçada em um painel que mostra o que vende, o que encalha e o que está acabando. Também crio a página do seu negócio e sistemas completos na internet.",
    texto:
      "Planilhas organizadas, painéis com os seus números, páginas de apresentação e sistemas sob medida. Tudo explicado em português claro, sem complicação.",
    acao: "Chamar no WhatsApp",
    acaoSecundaria: "Ver preços",
    botaoOrcamento: "Realize seu orçamento",
    botaoComoFunciona: "Como funciona?",
    seta: "Entenda como Funciona",
    // Painel de exemplo (loja fictícia) mostrado ao lado do título.
    painel: {
      rotulo: "Exemplo de painel · loja fictícia",
      selo: "Exemplo",
      titulo: "Painel de vendas",
      descricao: "Todos os números da loja em uma única tela: quanto vendeu, o que mais sai e o que está parado. Os dados abaixo são de mentira.",
      periodo: "Ano de 2026",
      indicadores: [
        { nome: "Vendas no ano", valor: "R$ 214 mil", variacao: "+14% vs. 2025" },
        { nome: "Pedidos", valor: "2.860", variacao: "+9%" },
        { nome: "Ticket médio", valor: "R$ 75", variacao: "+4%" },
        { nome: "Estoque parado", valor: "R$ 8,4 mil", variacao: "-11%" },
      ],
      mensalTitulo: "Vendas por mês (R$ mil)",
      meses: [
        { nome: "Jan", valor: 12 },
        { nome: "Fev", valor: 13 },
        { nome: "Mar", valor: 15 },
        { nome: "Abr", valor: 16 },
        { nome: "Mai", valor: 18 },
        { nome: "Jun", valor: 17 },
        { nome: "Jul", valor: 19 },
        { nome: "Ago", valor: 18 },
        { nome: "Set", valor: 20 },
        { nome: "Out", valor: 22 },
        { nome: "Nov", valor: 24 },
        { nome: "Dez", valor: 30 },
      ],
      categoriasTitulo: "Vendas por categoria",
      categorias: [
        { nome: "Camisetas", valor: 38 },
        { nome: "Bonés", valor: 24 },
        { nome: "Canecas", valor: 18 },
        { nome: "Casacos", valor: 12 },
        { nome: "Outros", valor: 8 },
      ],
      regioesTitulo: "Vendas por região (R$ mil)",
      regioes: [
        { nome: "Sudeste", valor: 96 },
        { nome: "Sul", valor: 52 },
        { nome: "Nordeste", valor: 34 },
        { nome: "Centro-Oeste", valor: 20 },
        { nome: "Norte", valor: 12 },
      ],
    },
  },
  entregas: {
    titulo: "O que eu entrego e quanto custa",
    intro:
      "Os valores abaixo são pela criação. Nos pacotes básicos o preço é fechado; quando o trabalho varia, mostro o valor mínimo e confirmo depois de ver o seu caso. Bots têm mensalidade de hospedagem e manutenção; sites e planilhas não precisam.",
    pedir: "Pedir orçamento",
    ajustes: (valorHora: string) =>
      `Ajustes depois da entrega (planilha, painel e página): ${valorHora} por hora, sem mensalidade.`,
  },
  comoFunciona: {
    titulo: "Como funciona",
    passos: [
      {
        titulo: "Conversa de 10 minutos",
        texto:
          "Pelo Google Meet, quando precisar ver tela, ajustar e apresentar com mais calma, ou pelo WhatsApp para uma dúvida rápida. Você me mostra a planilha ou conta o que precisa, e eu te digo o que preciso receber de você.",
      },
      { titulo: "Proposta", texto: "Mando por escrito o que entra, o valor e a data de entrega." },
      { titulo: "Entrada de 50% por Pix", texto: "Começo depois da entrada." },
      { titulo: "Entrega por etapas", texto: "Você vê o andamento antes do fim e pode corrigir o rumo." },
      {
        titulo: "Saldo antes da entrega final",
        texto:
          "Os outros 50% antes de eu liberar os arquivos finais ou publicar no seu endereço. Uma rodada de revisão já está incluída.",
      },
    ],
    pagamento: "Pagamento por Pix. Emito recibo.",
  },
  sobre: {
    titulo: "Sobre mim",
    paragrafos: ["Estudo Sistemas de Informação na Unieuro e trabalho como desenvolvedor fullstack."],
    ministerio:
      "Estagio em TI no Ministério da Defesa, onde faço análise de dados, planilhas, painéis e apresentações usadas em reuniões com oficiais superiores e generais. É a mesma rotina que levo para o seu negócio: pegar dado solto e entregar algo que dá para ler em um minuto. Os trabalhos que pego por aqui ficam fora do horário do estágio.",
    uniser:
      "Participo do Uniser, um portal do aluno desenvolvido pela Unieuro em parceria com a Universidade de Brasília. Faço parte da equipe que desenvolve o código do projeto.",
  },
  contato: {
    titulo: "Contato",
    intro: "Escolha o jeito que for mais fácil para você. Respondo pelo mesmo canal.",
    whatsapp: "WhatsApp",
    email: "E-mail",
    formulario: "Formulário",
  },
  ponte: { texto: "Tem um servidor de Discord ou uma comunidade de jogo?", link: "Veja a área CylDev" },
};

export const formulario = {
  nome: "Seu nome",
  preferencia: "Como prefere que eu responda?",
  porWhatsapp: "WhatsApp",
  porEmail: "E-mail",
  whatsapp: "Seu WhatsApp (com DDD)",
  email: "Seu e-mail",
  assunto: "Assunto",
  mensagem: "O que você precisa",
  /** Rótulo da mensagem quando a calculadora já mandou o resumo do pedido. */
  mensagemOpcional: "Quer contar mais alguma coisa? (opcional)",
  resumo: "Vai junto com a sua mensagem:",
  enviar: "Enviar",
  enviando: "Enviando…",
  falhou: "Não consegui enviar agora. Me chame por um destes canais:",
  isca: "Não preencha este campo:",
};

export const comunidade = {
  nav: [
    { href: "#cylbot", rotulo: "CylBot" },
    { href: "#cylsense", rotulo: "CylSense" },
    { href: "#bots", rotulo: "Bots sob medida" },
    { href: "/#contato", rotulo: "Contato" },
  ],
  apresentacao: {
    titulo: "Eu faço bots e ferramentas para quem joga.",
    texto:
      "Aqui ficam os projetos que eu faço para Discord e para jogos. Se você cuida de um servidor e quer um bot do seu jeito, dá para conversar.",
    acao: "Falar sobre um bot",
  },
  cylbot: {
    titulo: "CylBot",
    texto: "Bot de Discord com central de tickets, anúncios por servidor, IA opcional e painel web.",
    repositorio: "Ver o código no GitHub",
  },
  cylsense: {
    titulo: "CylSense",
    status: "Em desenvolvimento",
    texto:
      "Uma ferramenta de análise de desempenho para quem joga VALORANT. Ainda não está aberta ao público. Quando sair, toda métrica vai mostrar o tamanho da amostra, e o que for hipótese vai aparecer como hipótese.",
  },
  bots: {
    titulo: "Bot sob medida para o seu servidor",
    pedir: "Conversar sobre esse bot",
    mensalidade: (percentualDaCriacao: number, meses: number, descontoPlano: number | null) =>
      `O bot precisa ficar ligado o tempo todo. A mensalidade cobre hospedagem, monitoramento e correção de erros: ${percentualDaCriacao}% do preço de criação por mês, mais o custo da hospedagem. ` +
      (descontoPlano
        ? `No plano de ${meses} meses pago adiantado, o desconto é de ${descontoPlano}%.`
        : `No plano de ${meses} meses pago adiantado, há desconto.`),
    funcionalidadeNova: (valorHora: string) => `Funcionalidade nova depois da entrega: ${valorHora} por hora.`,
  },
  contato: {
    titulo: "Contato",
    intro: "WhatsApp ou e-mail, o que for melhor para você.",
  },
  avisoRiot: "CYL Sense não é afiliado à Riot Games.",
  ponte: { texto: "Quer algo assim para o seu negócio?", link: "Veja a área Negócios" },
};

export const obrigado = {
  titulo: "Mensagem recebida.",
  texto: "Obrigado pelo contato. Respondo pelo WhatsApp ou e-mail que você deixou.",
  voltar: "Voltar para o site",
};

export const naoEncontrado = {
  titulo: "Essa página não existe.",
  texto: "O link pode estar errado ou a página mudou de lugar. Se precisar de ajuda, escreva para marcelovaz.contato@gmail.com.",
  voltar: "Ir para o início",
};
