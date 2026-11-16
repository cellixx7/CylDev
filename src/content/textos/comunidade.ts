// Textos da área Comunidade (CylBot, CylSense e bots sob medida).
// Faz parte de src/content/textos/ (ver index.ts). Preços nunca são escritos à mão aqui: saem de servicos.ts e orcamento.ts.

export const comunidade = {
  nav: [
    { href: "#cylbot", rotulo: "CylBot" },
    { href: "#cylsense", rotulo: "CylSense" },
    { href: "#bots", rotulo: "Bots sob medida" },
    // Seção de contato da própria Comunidade (WhatsApp e e-mail), não a da home de Negócios.
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
      `O bot precisa ficar ligado o tempo todo. A mensalidade cobre o monitoramento e a correção de erros: ${percentualDaCriacao}% do preço de criação por mês. A hospedagem, onde o bot fica ligado, é um custo à parte, e o uso da IA, quando há, é cobrado pelo provedor na sua conta. ` +
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
