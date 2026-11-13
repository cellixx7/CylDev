// Todos os textos das páginas. Fonte: docs/COPY.md (versão 2, respostas do Marcelo em 02/11/2026).
// Preços nunca são escritos à mão aqui: saem de servicos.ts e orcamento.ts.
import { COMBO_2, COMBO_3 } from "./orcamento";

export const comum = {
  privacidade:
    "Este site não usa ferramentas de rastreamento. O que você mandar pelo formulário ou pelo WhatsApp serve só para eu responder o seu contato. O formulário é enviado pelo serviço EmailJS.",
  privacidadeLink: "Política de privacidade",
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
      /** Rótulo fixo: o estado (no carrinho ou não) vai em aria-pressed, não no texto. */
      rotulo: (nome: string) => `Carrinho: ${nome}`,
      dicaCombinavel: "Adicionar ao carrinho. Planilha, painel, automação e site de uma página juntos têm desconto.",
      dica: "Adicionar ao carrinho.",
      dicaDentro: "No carrinho. Clique para tirar.",
    },
    mensalidadeDe: "mensalidade",
    /** Frase curta, visível no card combinável. Os percentuais saem de orcamento.ts. */
    comboNoCard: `Desconto a partir de 2 serviços: ${COMBO_2}% com 2, ${COMBO_3}% com 3 ou mais.`,
    aPartirDe: (valor: string) => `a partir de ${valor}`,
    sobConsulta: "sob consulta",
    adicionado: (nome: string) => `${nome} no carrinho.`,
    removido: (nome: string) => `${nome} fora do carrinho.`,
    comboTexto: "Dois ou mais entre planilha, painel, automação e site de uma página têm desconto e um prazo só.",
    comboBotao: "Pôr planilha, painel e automação no carrinho",
    comboAdicionado: "Planilha, painel e automação no carrinho.",
    /** Os bots de Discord não são vendidos aqui; a chamada leva para a seção de bots da Comunidade. */
    chamadaComunidade: {
      titulo: "Quer um bot para o seu servidor de Discord?",
      texto: "Os bots ficam na área Comunidade, com o preço e a mensalidade explicados lá.",
      link: "Ver os bots na Comunidade",
      href: "/comunidade/#bots",
    },
    linhas: {
      planilha: "Controles soltos viram uma planilha única, com totais que conferem.",
      painel: "Um arquivo que mostra o que vendeu, o que mais sai e como está o mês.",
      automacao: "A tarefa que você repete toda semana na planilha roda com um clique.",
      landing: "Uma página com o seu serviço, os seus preços e um botão para o seu WhatsApp.",
      python: "Um script em Python que faz por você a tarefa repetida: juntar arquivos, ler PDFs, enviar mensagens.",
      sistema: "SaaS, site, aplicativo ou programa feito do zero. O valor é um ponto de partida; a proposta fecha o escopo.",
      "bot-essencial": "Tickets, boas-vindas e moderação básica para o seu servidor de Discord.",
      "bot-ia": "Um bot que responde com IA e um painel web para ajustar o que ele faz.",
    } as Record<string, string>,
    /** Mini exemplo de cada card: sempre rotulado como exemplo, sem número, prazo ou dado real. */
    miniExemplo: {
      rotulo: "Exemplo",
      antes: "Antes",
      planilha: {
        legenda: "Controles soltos viram uma tabela só, com total no fim.",
        antes: ["controle_final.xlsx", "controle_final2.xlsx", "novo (copia).xlsx"],
        colunas: ["Item", "Qtd", "Total"],
        linhas: ["Produto A", "Produto B"],
        total: "Total",
      },
      painel: {
        legenda: "Vendas, mais vendidos e o mês numa tela só.",
        indicadores: ["Vendas", "Pedidos", "Estoque"],
        grafico: "Vendas por mês",
      },
      automacao: {
        legenda: "O que você faz à mão toda semana vira um clique.",
        passos: ["Importa os dados", "Confere e soma", "Gera o relatório"],
        botao: "Atualizar",
      },
      landing: {
        legenda: "Uma página com o serviço, o preço e o botão do WhatsApp.",
        endereco: "seunegocio.com.br",
        titulo: "Seu serviço",
        preco: "Preços",
        botao: "Chamar no WhatsApp",
      },
      python: {
        legenda: "Uma pasta de arquivos entra, o script trabalha e a planilha sai pronta.",
        entrada: ["PDFs", "Planilhas", "E-mails"],
        script: "script.py",
        saida: "Planilha pronta",
      },
      sistema: {
        legenda: "Do desenho das telas ao sistema no ar: tudo feito por uma pessoa só.",
        tipos: ["SaaS", "Site", "Aplicativo", "Programa"],
        camadas: [
          { nome: "Front", detalhe: "telas e navegação" },
          { nome: "Back", detalhe: "regras e API" },
          { nome: "Banco de dados", detalhe: "onde tudo fica salvo" },
          { nome: "Deploy", detalhe: "no ar, para usar" },
        ],
      },
    },
  },
  /** Modal do serviço (abas Detalhes e Orçamento). */
  modal: {
    fechar: "Fechar",
    rotuloAbas: "Seções do serviço",
    abas: { detalhes: "Detalhes", orcamento: "Orçamento" },
    oQueE: "O que é",
    voceRecebe: "O que você recebe",
    verComoFunciona: "Ver como funciona",
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
    /** Anúncio (role="status") quando uma resposta abre perguntas de aprofundamento. */
    novasPerguntas: (n: number, tema: string) =>
      `${n} ${n === 1 ? "pergunta nova" : "perguntas novas"}${tema ? ` sobre ${tema}` : ""}, logo abaixo.`,
    mudaValorCurto: "pode mudar o valor",
    somaAgora: (valor: string) => `+ ${valor} no valor`,
    marqueQuantas: "Marque quantas quiser.",
    /** Rótulo do botão "i" ao lado de cada pergunta. */
    ajudaRotulo: (pergunta: string) => `O que significa: ${pergunta}`,
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
    notaAPartirDe: "O valor depende do que vai ser feito. Este é o mínimo para as suas respostas.",
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
  /** Tela "Por que esse valor?". Os números (R$ por hora, combo, piloto) chegam por parâmetro ou saem de orcamento.ts. */
  valor: {
    botao: "Por que esse valor?",
    titulo: "Por que esse valor?",
    fechar: "Fechar",
    fecharRodape: "Entendi",
    geral: {
      titulo: "Como o preço é montado",
      precoBase: "Cada serviço tem um preço-base. É o “a partir de” que aparece no card.",
      horaExtra: (valor: string) =>
        `Suas respostas podem somar horas extras de trabalho. Cada hora extra custa ${valor}.`,
      combo: `Combo: com 2 serviços combináveis (planilha, painel, automação e site de uma página), ${COMBO_2}% de desconto. Com 3 ou mais, ${COMBO_3}%.`,
      piloto: (percentual: number | null) =>
        percentual === null
          ? "Piloto: neste momento não há vaga de desconto de piloto."
          : `Piloto: enquanto houver vaga, há ${percentual}% de desconto sobre o preço de criação.`,
      regras:
        "Os descontos nunca se somam: vale o que abate mais reais. O combo só vale para os serviços combináveis. O piloto vale para a criação, mas não para a mensalidade. Os bots de Discord são vendidos só na Comunidade.",
      estimativa:
        "Pergunta sem resposta deixa o valor aproximado. O valor final é confirmado na proposta. Hospedagem e o uso de IA dos bots são cobrados à parte.",
    },
    pedido: {
      titulo: "No seu pedido",
      base: "Preço-base",
      colunaItem: "Item",
      colunaValor: "Valor",
      /** Ex.: "2 h x R$ 50 por hora". */
      horas: (horas: string, porHora: string) => `${horas} x ${porHora} por hora`,
      horasACombinar: "Horas e prazo: a combinar na conversa.",
      semResposta: (nomes: string) => `Sem resposta (ainda não somam): ${nomes}.`,
      soma: "Soma do serviço",
      sobConsulta: "Sob consulta: não entra no total. Eu mando uma proposta por escrito.",
      mensalidade: (valor: string) => `Mensalidade: ${valor} por mês, à parte do total, mais a hospedagem.`,
      fechamento: "Fechamento",
      somaTabela: "Soma de tabela",
      semDesconto: "Nenhum desconto vale para este pedido agora.",
      descontoLinha: (rotulo: string) => `Desconto (${rotulo})`,
      total: "Total estimado",
      totalAPartirDe: "Total estimado (a partir de)",
      comboPorque: (qtd: number, base: string) =>
        `O combo vale porque há ${qtd} serviços combináveis. Ele incide só sobre eles (${base}).`,
      pilotoPorque: (base: string) => `O piloto incide sobre o preço de criação (${base}).`,
      pilotoMaior: (outro: string, mesmo: string) => `O piloto abateu mais que o combo: ${mesmo}, contra ${outro} do combo.`,
      comboMaior: (outro: string, mesmo: string) => `O combo abateu ${mesmo}; o piloto abateria ${outro}, e eles não se somam.`,
      empate: (valor: string) => `Combo e piloto abateriam o mesmo valor (${valor}); vale o combo.`,
      mudaria: "O que mais mudaria este valor",
      mudariaLinha: (nome: string, perguntas: string) => `${nome}: ${perguntas}`,
      mudariaNota: "Respostas que somam horas extras aumentam o valor.",
      estimativa: "Há perguntas sem resposta: o valor é aproximado e pode mudar.",
    },
    vazio: "Seu pedido está vazio. Quando você adicionar um serviço, o detalhamento do valor aparece aqui.",
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
    aguarde: "Um instante…",
    falhou: "Não consegui enviar agora. Chame no WhatsApp ou mande um e-mail com o mesmo pedido.",
    whatsappBotao: "Chamar no WhatsApp",
    emailBotao: "Enviar por e-mail",
    privacidade:
      "Envio o seu nome, o WhatsApp, as respostas do orçamento e as observações, só para responder este pedido. Eles passam pelo EmailJS (envio pelo site) e pelo WhatsApp. Eu confirmo por WhatsApp e combinamos o Pix.",
    privacidadeLink: "Política de privacidade",
  },
};

/** Id de cada destaque da seção Sobre (também é a chave em `negocios.sobre.modais`). */
export type DestaqueSobre = "faculdade" | "estagio" | "uniser";
/** Pedaço de um parágrafo: texto simples ou, com `destaque`, o trecho que abre um modal. */
export type ParteSobre = { texto: string; destaque?: DestaqueSobre };
export type ModalSobre = {
  titulo: string;
  dica: string;
  texto: string;
  secoes: { subtitulo: string; texto?: string; /** Parágrafos que vêm depois do `texto`. */ mais?: string[]; itens?: string[] }[];
  fecho?: string;
};

export const negocios = {
  exemploTitulo: "Um exemplo do que eu entrego",
  nav: [
    { href: "/#orcamento", rotulo: "Orçamento" },
    { href: "/como-funciona/", rotulo: "Como funciona" },
    { href: "/#sobre", rotulo: "Sobre", secao: "sobre" },
    { href: "/#entregas", rotulo: "Entregas", secao: "entregas" },
    { href: "/#contato", rotulo: "Contato", secao: "contato" },
  ] as { href: string; rotulo: string; secao?: "sobre" | "entregas" | "contato" }[],
  /** Contato discreto no rodapé de Negócios, enquanto a seção Contato não existe. */
  rodapeWhatsapp: "Prefere falar direto?",
  rodapeWhatsappLink: "Chame no WhatsApp",
  /** Controle no centro do header: leva para a área de comunidade. */
  atalhoComunidade: {
    href: "/comunidade/",
    rotulo: "Ir para a área de comunidade (Discord e jogos)",
    /** Texto visível ao lado do ícone (a partir de 640 px). O aria-label continua o rótulo longo. */
    rotuloCurto: "Comunidade",
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
      /** Texto lido pelo leitor de tela em cada mês: mês, valor e unidade. */
      mesFalado: (mes: string, valor: string) => `${mes}, R$ ${valor} mil`,
      meses: [
        { nome: "Jan", completo: "Janeiro", valor: 12 },
        { nome: "Fev", completo: "Fevereiro", valor: 13 },
        { nome: "Mar", completo: "Março", valor: 15 },
        { nome: "Abr", completo: "Abril", valor: 16 },
        { nome: "Mai", completo: "Maio", valor: 18 },
        { nome: "Jun", completo: "Junho", valor: 17 },
        { nome: "Jul", completo: "Julho", valor: 19 },
        { nome: "Ago", completo: "Agosto", valor: 16 },
        { nome: "Set", completo: "Setembro", valor: 18 },
        { nome: "Out", completo: "Outubro", valor: 20 },
        { nome: "Nov", completo: "Novembro", valor: 20 },
        { nome: "Dez", completo: "Dezembro", valor: 30 },
      ],
      categoriasTitulo: "Vendas por categoria",
      categorias: [
        { nome: "Camisetas", valor: 38 },
        { nome: "Bonés", valor: 24 },
        { nome: "Canecas", valor: 18 },
        { nome: "Casacos", valor: 12 },
        { nome: "Outros", valor: 8 },
      ],
      /**
       * Vendas por mês (linhas, Jan a Dez) e categoria (colunas, na ordem de `categorias`), em R$ mil.
       * Dado de exemplo. Cada linha soma o mês de `meses`; cada coluna dá a fatia de `categorias`.
       * Out a Dez são os mesmos produtos da demonstração de Como funciona (que não tem "Outros").
       */
      vendasMesCategoria: [
        [5, 3, 3, 0, 1],
        [5, 3, 2, 1, 2],
        [6, 4, 3, 1, 1],
        [6, 4, 3, 2, 1],
        [7, 4, 3, 2, 2],
        [5, 3, 3, 4, 2],
        [6, 3, 3, 5, 2],
        [5, 3, 2, 3, 3],
        [10, 4, 1, 0, 3],
        [8, 6, 4, 2, 0],
        [6, 7, 5, 2, 0],
        [12, 8, 6, 4, 0],
      ],
      /**
       * Peso de cada categoria (linhas) em cada região (colunas, na ordem de `regioes`). Só dá o formato:
       * `painelVendas.ts` ajusta os valores para fechar com os totais por categoria e por região.
       */
      afinidadeRegiao: [
        [5, 3, 2, 1, 1],
        [4, 3, 2, 1, 1],
        [4, 2, 2, 1, 1],
        [3, 4, 2, 1, 1],
        [3, 2, 2, 1, 1],
      ],
      /** Textos do roteiro: quando um item está em foco, os outros gráficos mostram só os números dele. */
      foco: {
        vendas: (nome: string) => `Vendas · ${nome}`,
        doAno: (pct: number) => `${pct}% do ano`,
        so: (nome: string) => `só ${nome}`,
      },
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
      "Os valores abaixo são pela criação. Cada pacote tem um preço-base a partir de um valor; no orçamento você vê a estimativa na hora, e eu confirmo o valor final depois de ver o seu caso. Bots têm mensalidade de manutenção, mais a hospedagem à parte; sites e planilhas não precisam.",
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
    // Cada parágrafo é uma lista de partes. A parte com `destaque` vira o trecho que abre o modal de mesmo id (em `modais`).
    paragrafos: [
      [
        { texto: "Estudo " },
        { texto: "Sistemas de Informação na Unieuro", destaque: "faculdade" },
        { texto: " e trabalho como desenvolvedor fullstack." },
      ],
    ] as ParteSobre[][],
    ministerio: [
      { texto: "Estagio em TI no Ministério da Defesa", destaque: "estagio" },
      {
        texto:
          ", onde faço análise de dados, planilhas, painéis e apresentações usadas em reuniões com oficiais superiores e generais. É a mesma rotina que levo para o seu negócio: pegar dado solto e entregar algo que dá para ler em um minuto. Os trabalhos que pego por aqui ficam fora do horário do estágio.",
      },
    ] as ParteSobre[],
    uniser: [
      { texto: "Participo do Uniser", destaque: "uniser" },
      {
        texto:
          ", a plataforma da UniSER, Universidade do Envelhecer da UnB. Ela é desenvolvida por uma equipe de estudantes da Unieuro, com orientação de professores da faculdade, e eu faço parte do time que escreve o código.",
      },
    ] as ParteSobre[],
    // Modais dos destaques. `dica` é o balão ao passar o mouse; `secoes` aceitam texto, lista ou os dois.
    modais: {
      faculdade: {
        titulo: "Sistemas de Informação na Unieuro",
        dica: "Saiba mais sobre o curso",
        texto:
          "Estou no 5º semestre do bacharelado em Sistemas de Informação na Unieuro, em Brasília, com formatura prevista para o 2º semestre de 2028.",
        secoes: [
          {
            subtitulo: "O que mais uso do curso no seu projeto",
            itens: [
              "Banco de Dados e Banco de Dados Avançados",
              "Estruturas de Dados",
              "Programação Orientada a Objetos",
              "Programação para Web",
              "Engenharia de Software e Engenharia de Requisitos",
              "Gestão de Processos",
              "Inteligência Artificial",
            ],
          },
          {
            subtitulo: "Iniciação científica",
            texto:
              "Faço iniciação científica orientado pelo professor doutor Aldo Henrique, no grupo de pesquisa OpenVIRTEX-BR (Open Source Virtualization and Cloud Computing for Intelligent Systems in Brazil). O grupo estuda computação em nuvem, máquinas virtuais, inteligência artificial e análise de dados, com soluções de código aberto para gerenciar melhor máquinas virtuais e recursos em nuvem.",
            mais: [
              "No grupo, participo do Simbionte, uma simulação em que vários agentes de inteligência artificial interagem entre si. Minha equipe constrói a base do sistema: login, banco de dados, filas de processamento e o motor que roda os ciclos da simulação, com testes automáticos e proteção contra instruções maliciosas enviadas à IA. É o que me ajuda em projetos com IA: saber integrar, limitar e testar o que ela responde.",
            ],
          },
        ],
      },
      estagio: {
        titulo: "Estágio em TI no Ministério da Defesa",
        dica: "Saiba mais sobre o estágio",
        texto: "Estagio na área de TI do Ministério da Defesa desde fevereiro de 2026.",
        secoes: [
          {
            subtitulo: "O que eu faço",
            itens: [
              "Consolidação de dados de várias fontes",
              "Transformação de planilhas em banco de dados",
              "Painéis e apresentações, inclusive modelos de apresentação reutilizáveis",
              "Apoio à gestão de processos",
              "Apoio na escrita de um artigo sobre sistemas não tripulados",
            ],
          },
          {
            subtitulo: "Ferramentas do dia a dia",
            texto: "Excel, Power BI, Python, PowerPoint, VS Code e ferramentas de IA para programação (Claude Code e Codex).",
          },
        ],
        fecho:
          "É a mesma rotina que levo para o seu negócio: pegar dado solto e entregar algo que dá para ler em um minuto. Os trabalhos que pego por aqui ficam fora do horário do estágio.",
      },
      uniser: {
        titulo: "UniSER, Universidade do Envelhecer",
        dica: "Saiba mais sobre o Uniser",
        texto:
          "Desde novembro de 2025 faço parte da equipe da Unieuro que desenvolve a plataforma da UniSER, a Universidade do Envelhecer da UnB, como desenvolvedor fullstack, com orientação de professores da Unieuro.",
        secoes: [
          {
            subtitulo: "O que o sistema faz",
            itens: [
              "Página pública com editais e notícias",
              "Área restrita com login",
              "Presença e notas",
              "Acesso separado para alunos, professores e administração",
            ],
          },
          {
            subtitulo: "O que isso tem a ver com o seu projeto",
            texto:
              "É o mesmo cuidado que levo para um sistema sob medida: login seguro, cada pessoa vê só o que é dela, registro do que acontece no sistema e testes automáticos antes de cada mudança.",
          },
          {
            subtitulo: "Tecnologias",
            texto: "React 19, TypeScript, Vite, styled-components, Node.js com Express, PostgreSQL e Prisma.",
          },
        ],
      },
    } as Record<DestaqueSobre, ModalSobre>,
    fechar: "Fechar",
    lado: "Exemplos do meu trabalho",
    imagensUniser: "Telas da plataforma da UniSER",
    legendaTelas: "Esquemas ilustrativos das telas, sem dados reais.",
    atendimento: "Atendo online, para todo o Brasil.",
    falarComigo: "Falar comigo",
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

export const privacidade = {
  titulo: "Política de privacidade",
  atualizado: "Atualizado em 12/11/2026.",
  intro: "Este texto explica, em linguagem simples, o que acontece com os seus dados quando você usa este site. Quem cuida deles é Marcelo Vaz.",
  voltar: "Voltar para o site",
  /** Em `secoes`, `{email}` é trocado por site.email na página. */
  secoes: [
    {
      titulo: "O que eu recebo",
      itens: [
        "Se você enviar um pedido pelo site: o seu nome, o seu WhatsApp, as respostas do orçamento e as observações que escrever.",
        "Se você me chamar pelo WhatsApp: o que você escrever na conversa, junto com o número e o nome do seu perfil.",
        "O site não pede mais nada do que isso, e nada é enviado até você apertar o botão.",
      ],
    },
    {
      titulo: "Para que eu uso",
      itens: ["Só para responder o seu pedido, conversar sobre o orçamento e, se fecharmos, fazer a entrega. Não uso para anúncio nem repasso a ninguém para isso."],
    },
    {
      titulo: "Por onde os dados passam",
      itens: [
        "EmailJS: serviço que entrega o formulário do site no meu e-mail. O envio passa pelos servidores dele, que ficam fora do Brasil.",
        "WhatsApp: se você usar o botão do WhatsApp, a mensagem sai do seu aparelho pelo próprio WhatsApp, que tem a política dele.",
        "Netlify: hospeda o site e pode registrar dados técnicos de acesso, como o endereço IP, conforme a política dela.",
        "As fontes do site ficam no próprio site: nenhuma fonte, estatística ou rastreador de terceiros é carregado.",
      ],
    },
    {
      titulo: "O que fica no seu navegador",
      itens: [
        "O carrinho fica no sessionStorage, só enquanto a aba está aberta, para não se perder ao trocar de página. Ele guarda apenas os serviços escolhidos e as respostas do orçamento; nunca o nome, o telefone nem as observações. É apagado depois de um envio com sucesso.",
        "O tema claro ou escuro que você escolher fica no localStorage.",
        "O site não usa cookies de rastreamento nem ferramentas de análise.",
      ],
    },
    {
      titulo: "Por quanto tempo eu guardo",
      itens: [
        "Os pedidos que chegam no meu e-mail ficam guardados por até 12 meses; depois eu apago.",
        "A conversa no WhatsApp fica no meu aparelho e na minha conta enquanto eu precisar dela para o atendimento e a entrega.",
      ],
    },
    {
      titulo: "Como pedir para apagar ou saber o que tenho",
      itens: [
        "Escreva para {email} pedindo para apagar os seus dados ou para ver o que eu tenho sobre você. Eu respondo e apago o que estiver comigo, inclusive o registro do envio no painel do EmailJS, se houver.",
      ],
    },
  ],
};

export const obrigado = {
  titulo: "Mensagem recebida.",
  texto: "Obrigado pelo contato. Respondo pelo WhatsApp que você deixou.",
  voltar: "Voltar para o site",
};

export const naoEncontrado = {
  titulo: "Essa página não existe.",
  texto: "O link pode estar errado ou a página mudou de lugar. Se precisar de ajuda, escreva para marcelovaz.contato@gmail.com.",
  voltar: "Ir para o início",
};
