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

export const home = {
  titulo: "Marcelo Vaz",
  linha: "Desenvolvedor e analista de dados. Atendo online, para todo o Brasil.",
  portas: [
    {
      href: "/negocios/",
      rotulo: "Para o seu negócio",
      guia: "Painéis, páginas e automação para quem vende e controla tudo em planilha.",
      assinatura: "Marcelo Vaz",
    },
    {
      href: "/comunidade/",
      rotulo: "Para o seu Discord e jogos",
      guia: "Bots de Discord e ferramentas para quem joga.",
      assinatura: "CylDev",
    },
  ],
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

export const negocios = {
  nav: [
    { href: "#entregas", rotulo: "Entregas" },
    { href: "#como-funciona", rotulo: "Como funciona" },
    { href: "#sobre", rotulo: "Sobre" },
    { href: "#contato", rotulo: "Contato" },
  ],
  apresentacao: {
    titulo: "Eu organizo a sua planilha e construo painéis para você ver como o seu negócio está indo.",
    texto:
      "Meu nome é Marcelo e sou desenvolvedor de sistemas e sites. Pego a planilha que você já usa para vendas, estoque ou caixa, deixo ela em ordem e entrego um painel com os números que importam para você. Também faço páginas para apresentar o seu negócio.",
    acao: "Chamar no WhatsApp",
    acaoSecundaria: "Ver preços",
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
    { href: "#contato", rotulo: "Contato" },
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
