// Textos da seção #orcamento de Negócios (cards, modal, painel, estimativa, carrinho e checkout).
// Faz parte de src/content/textos/ (ver index.ts). Preços nunca são escritos à mão aqui: saem de servicos.ts e orcamento.ts.
import { COMBO_2, COMBO_3 } from "../orcamento";

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
