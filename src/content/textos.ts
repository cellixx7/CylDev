// Todos os textos das páginas. Rascunhos: o Marcelo reescreve na própria voz (ver docs/COPY.md).

export const comum = {
  privacidade:
    "Este site não usa cookies de rastreamento nem guarda dados de quem visita. O que você mandar pelo formulário ou pelo WhatsApp serve só para eu responder o seu contato.",
  dadosFicticios: "dados fictícios",
  temaClaro: "Tema claro",
  temaEscuro: "Tema escuro",
  menuAbrir: "Abrir menu",
  menuFechar: "Fechar menu",
};

export const home = {
  titulo: "Marcelo Vaz",
  linha: "Desenvolvedor em Brasília. Escolha por onde entrar.",
  portas: [
    {
      href: "/negocios/",
      rotulo: "Para o seu negócio",
      guia: "Painéis, páginas e automação para quem vende e controla tudo em planilha.",
      assinatura: "Marcelo Vaz",
    },
    {
      href: "/comunidade/",
      rotulo: "Para a sua comunidade ou jogo",
      guia: "Bots de Discord e ferramentas para quem joga.",
      assinatura: "CylDev",
    },
  ],
};

export const negocios = {
  nav: [
    { href: "#entregas", rotulo: "Entregas" },
    { href: "#como-funciona", rotulo: "Como funciona" },
    { href: "#sobre", rotulo: "Sobre" },
    { href: "#contato", rotulo: "Contato" },
  ],
  apresentacao: {
    titulo: "Eu organizo a planilha do seu negócio e monto o painel que você vai abrir todo dia.",
    texto:
      "Sou o Marcelo, desenvolvedor em Brasília. Pego a planilha que você já usa para vendas, estoque ou caixa, deixo ela em ordem e entrego um painel com os números que importam para você. Também faço páginas simples para divulgar o seu serviço.",
    acao: "Chamar no WhatsApp",
    acaoSecundaria: "Ver preços",
  },
  entregas: {
    titulo: "O que eu entrego e quanto custa",
    intro: "Preço fechado para os pacotes básicos. Quando o trabalho varia, mostro o valor mínimo e confirmo depois de ver o seu caso.",
    pedir: "Pedir orçamento",
    inclui: "Inclui",
    prazo: "Prazo",
  },
  piloto: (restam: number, total: number) =>
    `Primeiros clientes: ${restam} de ${total} vagas com 10% de desconto. Quando acabarem, este aviso some.`,
  comoFunciona: {
    titulo: "Como funciona",
    passos: [
      { titulo: "Conversa de 10 minutos", texto: "Pelo WhatsApp ou chamada. Você me mostra a planilha ou conta o que precisa." },
      { titulo: "Proposta", texto: "Mando por escrito o que entra, o valor e a data de entrega." },
      { titulo: "Entrada de 50% por Pix", texto: "Começo depois da entrada." },
      { titulo: "Entrega por etapas", texto: "Você vê o andamento antes do fim e pode corrigir o rumo." },
      { titulo: "Saldo na entrega", texto: "Os outros 50% quando você recebe. Uma rodada de revisão já está incluída." },
    ],
    pagamento: "Pagamento por Pix. Emito recibo.",
  },
  sobre: {
    titulo: "Sobre mim",
    paragrafos: [
      "Estudo Sistemas de Informação na Unieuro e trabalho como desenvolvedor fullstack.",
    ],
    ministerio: "Faço estágio no Ministério da Defesa. Os trabalhos que pego por aqui ficam fora do horário do estágio.",
    uniser: "Participo do projeto Uniser.",
  },
  contato: {
    titulo: "Contato",
    intro: "Escolha o jeito que for mais fácil para você. Respondo pelo mesmo canal.",
    whatsapp: "WhatsApp",
    email: "E-mail",
    formulario: "Formulário",
    campos: {
      nome: "Seu nome",
      contato: "WhatsApp ou e-mail",
      mensagem: "O que você precisa",
      enviar: "Enviar",
    },
  },
  ponte: { texto: "Tem um servidor de Discord ou uma comunidade de jogo?", link: "Veja a área CylDev" },
};

export const comunidade = {
  nav: [
    { href: "#cylbot", rotulo: "CylBot" },
    { href: "#cylsense", rotulo: "CylSense" },
    { href: "#bots", rotulo: "Bots sob medida" },
    { href: "#contato", rotulo: "Contato" },
  ],
  apresentacao: {
    titulo: "CylDev faz bots e ferramentas para quem joga.",
    texto: "Aqui ficam os projetos que eu faço para Discord e para jogos. Se você cuida de um servidor e quer um bot do seu jeito, dá para conversar.",
    acao: "Falar sobre um bot",
  },
  cylbot: {
    titulo: "CylBot",
    texto: "Meu bot de Discord. O vídeo mostrando o que ele faz chega em breve.",
    videoPendente: "Vídeo em gravação",
  },
  cylsense: {
    titulo: "CylSense",
    status: "Em desenvolvimento",
    texto: "Uma ferramenta de análise de desempenho para quem joga VALORANT. Ainda não está aberta ao público. Quando sair, toda métrica vai mostrar o tamanho da amostra, e o que for hipótese vai aparecer como hipótese.",
  },
  bots: {
    titulo: "Bot sob medida para o seu servidor",
    pedir: "Conversar sobre esse bot",
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
  texto: "O link pode estar errado ou a página mudou de lugar.",
  voltar: "Ir para o início",
};
