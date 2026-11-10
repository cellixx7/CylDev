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
    "Escolha o serviço, responda às perguntas e revise o pedido. A estimativa muda na hora. O valor final vai na proposta por escrito.",
  /** Cards da seção #orcamento. A linha de cada serviço é texto próprio, curto, sem número e sem prazo. */
  cards: {
    rotuloLista: "Serviços",
    inclui: "Incluso",
    verDetalhes: "Ver detalhes",
    fazerOrcamento: "Fazer orçamento",
    /** Ícone de carrinho do card: rótulo completo, dica (sem número de desconto) e estados. */
    carrinho: {
      por: (nome: string) => `Pôr ${nome} no carrinho`,
      tirar: (nome: string) => `Tirar ${nome} do carrinho`,
      dicaCombinavel: "Adicionar ao carrinho. Planilha, painel, automação e landing juntos têm desconto.",
      dica: "Adicionar ao carrinho.",
      dicaDentro: "No carrinho. Clique para tirar.",
    },
    mensalidadeDe: "mensalidade",
    /** Frase curta, visível no card combinável (sem número de desconto). */
    comboNoCard: "Entra no combo: desconto a partir de 2 serviços.",
    aPartirDe: (valor: string) => `a partir de ${valor}`,
    porHora: (valor: string) => `${valor} por hora`,
    sobConsulta: "sob consulta",
    adicionado: (nome: string) => `${nome} no carrinho.`,
    removido: (nome: string) => `${nome} fora do carrinho.`,
    comboTexto: "Dois ou mais entre planilha, painel, automação e landing têm desconto e um prazo só.",
    comboBotao: "Pôr planilha, painel e automação no carrinho",
    comboAdicionado: "Planilha, painel e automação no carrinho.",
    linhas: {
      planilha: "Controles soltos viram uma planilha única, com totais que conferem.",
      painel: "Um arquivo que mostra o que vendeu, o que mais sai e como está o mês.",
      automacao: "A tarefa que você repete toda semana na planilha roda com um clique.",
      landing: "Uma página com o seu serviço, os seus preços e um botão para o seu WhatsApp.",
      aulas: "Aula individual online, no seu ritmo, com os arquivos do seu trabalho.",
      sistema: "Para quando a planilha já não dá conta. Começa com uma conversa.",
      "bot-essencial": "Tickets, boas-vindas e moderação básica para o seu servidor de Discord.",
      "bot-ia": "Um bot que responde com IA e um painel web para ajustar o que ele faz.",
    } as Record<string, string>,
  },
  /** Modal do serviço (abas Detalhes e Orçamento). */
  modal: {
    fechar: "Fechar",
    rotuloAbas: "Seções do serviço",
    abas: { detalhes: "Detalhes", orcamento: "Orçamento" },
    oQueE: "O que é",
    voceRecebe: "O que você recebe",
    notas: "Notas",
    prazo: "Prazo",
    mensalidade: "Mensalidade",
    perguntas: "Perguntas",
    adicionar: "Adicionar ao carrinho",
    noCarrinho: "No carrinho",
    tirar: "Tirar do carrinho",
    verCarrinho: "Ver carrinho",
  },
  painel: {
    inclui: "O que está incluso",
    perguntas: "Perguntas",
    legendaValor: "Respostas com + R$ mudam o valor. As outras ajudam a entender o seu caso e não mudam o preço.",
    progresso: (feitas: number, total: number) =>
      `${feitas} de ${total} ${total === 1 ? "pergunta respondida" : "perguntas respondidas"}`,
    semPerguntas: "Este serviço não tem perguntas. Vale o valor da tabela.",
    mudaValorCurto: "pode mudar o valor",
    somaAgora: (valor: string) => `+ ${valor} no valor`,
    marqueQuantas: "Marque quantas quiser.",
    oQueEIsso: "O que é isso?",
    fecharAjuda: "Fechar ajuda",
    incluso: (n: number) => `Já ${n === 1 ? "incluso" : "inclusos"}: ${n}.`,
    cadaExtra: (valor: string) => `Cada a mais: + ${valor}.`,
    custo: (valor: string) => `+ ${valor}`,
  },
  estimativa: {
    titulo: "Estimativa",
    comoChegamos: "Como chegamos a esse valor",
    /** Rótulo do preço no modal: com pergunta sem resposta, é "a partir de"; com tudo respondido, é só estimativa. */
    aPartirDe: "a partir de",
    estimativaAPartirDe: "estimativa a partir de",
    estimativaFinal: "estimativa",
    sobConsulta: "Sob consulta",
    porHora: "por hora",
    tabela: "Preço de tabela: ",
    pilotoCurto: (percentual: number) => `${percentual}% de desconto (piloto)`,
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
    adicionar: "Adicionar ao pedido",
    tirar: "Remover do pedido",
    outroServico: "Escolher outro serviço",
    verPedido: "Revisar pedido",
    incluido: "Incluído no pedido. O que você mudar aqui já vale.",
    estados: {
      inicial: "Preço inicial",
      configurando: "Em configuração",
      configurada: "Configurada",
      consulta: "Sob consulta",
    },
    estadosNota: {
      inicial: "Ainda sem respostas. O valor muda conforme você responde.",
      configurando: (faltam: number) =>
        `Faltam ${faltam} ${faltam === 1 ? "pergunta" : "perguntas"}. O valor ainda pode mudar.`,
      configurada: "Todas as perguntas respondidas.",
    },
  },
  /** Barra fixa do carrinho. */
  barra: {
    rotulo: "Carrinho",
    titulo: (n: number) => `Carrinho (${n})`,
    rotuloBotao: (n: number, total: string) => `Abrir o carrinho: ${n} ${n === 1 ? "serviço" : "serviços"}, ${total}`,
  },
  carrinho: {
    titulo: "Revise o pedido",
    tituloComQtd: (n: number) => `Carrinho (${n})`,
    fechar: "Fechar o carrinho",
    ajustar: "Ajustar respostas",
    estimativaItem: (faltam: number) => `Estimativa: ${faltam} ${faltam === 1 ? "pergunta sem resposta" : "perguntas sem resposta"}. O valor pode mudar.`,
    avisoEstimativa: "Há perguntas sem resposta, então o total é uma estimativa e pode mudar.",
    vazio: "Seu pedido está vazio. Escolha um serviço e adicione para poder enviar.",
    escolher: "Escolher um serviço",
    editar: "Editar",
    tirar: "Remover",
    voltar: "Continuar escolhendo",
    respondidas: (feitas: number, total: number) => `${feitas} de ${total} perguntas respondidas`,
    semResposta: "sem resposta",
    mostrarRespostas: "Ver respostas",
    base: "Base do pacote",
    valor: "Valor",
    prazo: "Prazo",
    soma: "Soma de tabela",
    desconto: (rotulo: string) => `Desconto (${rotulo})`,
    descontoNota: "Combo e piloto não se somam: vale o maior.",
    prazoCombinaveis: "Prazo dos combináveis, juntos",
    mensalidade: "Mensalidade dos bots",
    total: "Total estimado",
    totalRodape: "Total",
    totalSobConsulta: "Sob consulta, fora do total: ",
    notaEstimativa: "Estimativa, confirmada na conversa.",
    observacoes: "Observações (opcional)",
    observacoesDica: "Datas, prazos, o que mais importa para você. Vai junto com o pedido.",
    dadosTitulo: "Seus dados para enviar pelo site",
    dadosNota: "Informe nome e WhatsApp e eu respondo por lá. Para falar direto, use o botão do WhatsApp, sem preencher nada.",
    nome: "Nome",
    whatsapp: "WhatsApp (com DDD)",
    enviar: "Enviar pelo site",
    enviando: "Enviando…",
    falhou: "Não consegui enviar agora. Chame no WhatsApp ou mande um e-mail com o mesmo pedido.",
    whatsappBotao: "Chamar no WhatsApp",
    privacidade: "Seu nome e WhatsApp são usados só para responder este pedido. Eu confirmo por WhatsApp e combinamos o Pix.",
  },
};

export const negocios = {
  exemploTitulo: "Um exemplo do que eu entrego",
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
    /** Linha de partida do celular: o menor preço de pacote, direto de servicos.ts. */
    partida: (nome: string) => `${nome},`,
    aPartirDe: (valor: string) => `a partir de ${valor}`,
    comoPedir: "Monte o orçamento aqui e envie pelo site ou pelo WhatsApp.",
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
