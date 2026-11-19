// Guias do Assistente Cyl: cada resposta longa tem a mesma forma (resposta direta, explicação em linguagem de leigo, dica ou
// próximo passo, pergunta de continuação). Fica fora do index.ts, como textos/assistente.ts.
//
// REGRA DE OURO: nenhum preço, prazo ou desconto é escrito aqui. O que tem número chega por parâmetro (preço e prazo de
// servicos.ts/orcamento.ts, garantia e revisão das perguntas frequentes). Cada fato abaixo repete o que já está publicado:
//   - passos e pagamento: seção Entregas, perguntas frequentes e Termos (Pagamento, Prazos, Revisões, Garantia, Propriedade);
//   - quem presta o serviço: seção Sobre e site.prestador (nada é inventado; campos nulos não aparecem);
//   - o que preparar: perguntas frequentes (arquivos e dados) e a decisão do Marcelo de 19/11/2026 (identidade visual,
//     planilhas, sistemas, organização, explicação do negócio);
//   - diferenciais e "portfólio para recrutadores em desenvolvimento": informados pelo Marcelo em 19/11/2026.
// Ao mudar a política do site, mude aqui junto (e rode os testes: eles conferem os números contra os fatos).

import { tr, type Tratamento } from "./assistente";

export const guias = {
  comoFunciona: {
    direta: (g: Tratamento) =>
      tr(g, "Funciona em poucos passos, e {S} acompanha cada um 😊", "Funciona em poucos passos, e dá para acompanhar cada um 😊"),
    intro: (g: Tratamento) =>
      tr(
        g,
        "Tudo começa pelo orçamento do site: {S} conta o que precisa, e o Marcelo avalia o projeto e conversa sobre ele. Depois:",
        "Tudo começa pelo orçamento do site: a pessoa conta o que precisa, e o Marcelo avalia o projeto e conversa sobre ele. Depois:",
      ),
    passos: [
      "Conversa rápida, pelo Google Meet ou pelo WhatsApp: mostra-se a planilha ou conta-se o que se precisa, e o Marcelo diz o que precisa receber.",
      "Proposta por escrito, com o que entra, o valor e a data de entrega.",
      "Entrada por Pix, de metade do valor. O trabalho começa depois dela.",
      "Entrega por etapas: dá para ver o andamento antes do fim e corrigir o rumo.",
      "A outra metade, antes de liberar os arquivos finais ou publicar no seu endereço. Uma rodada de revisão já está incluída.",
    ],
    explica: "Enviar o pedido pelo site não compromete ninguém: ele só abre a conversa. O contrato começa quando a proposta por escrito é aceita e a entrada é paga.",
    dica: "Dica: se já tiver uma planilha ou um exemplo do que quer, leve para a conversa. Poupa tempo e deixa a proposta mais exata.",
    pergunta: (g: Tratamento) => tr(g, "Quer saber o que {S} precisa ter pronto antes de pedir?", "Quer saber o que ter pronto antes de pedir?"),
  },

  preparar: {
    direta: (g: Tratamento) =>
      tr(
        g,
        "Nada complicado: basta contar como {S} trabalha hoje e o que gostaria de ter.",
        "Nada complicado: basta contar como o trabalho é feito hoje e o que se gostaria de ter.",
      ),
    intro: "O que costuma ajudar, se existir (nada disso é obrigatório):",
    itens: [
      "identidade visual, se houver: logo, cores e fontes",
      "planilhas que já usa, mesmo bagunçadas",
      "sistemas ou ferramentas usados hoje",
      "como o trabalho acontece no dia a dia: quem faz o quê, e onde as informações ficam",
      "uma explicação do negócio, mesmo informal, com as suas palavras",
    ],
    explica:
      "Quanto mais claro o pedido, mais exata fica a estimativa. O prazo conta a partir da entrada e do recebimento do material combinado, então vale reunir isso cedo.",
    dica: "Dica de cuidado: se a planilha tiver nomes, CPF ou telefones de clientes que o serviço não precisa, troque por códigos ou apague essas colunas antes de enviar. Uma amostra com poucas linhas costuma bastar.",
    pergunta: (g: Tratamento) => tr(g, "Assim eu indico por onde começar. Qual é o tipo de negócio d{S}?", "Assim eu indico por onde começar. Qual é o tipo de negócio?"),
  },

  pagamento: {
    direta: "O pagamento é por Pix, em duas partes: metade na entrada e metade antes da entrega final.",
    explica: (g: Tratamento) =>
      tr(
        g,
        "A entrada dá início ao trabalho. A outra metade vem antes de os arquivos finais serem liberados, ou de a página ser publicada no seu endereço. Assim os dois lados ficam protegidos, e {S} vê o andamento antes de pagar o saldo.",
        "A entrada dá início ao trabalho. A outra metade vem antes de os arquivos finais serem liberados, ou de a página ser publicada no endereço. Assim os dois lados ficam protegidos, e o andamento pode ser visto antes de pagar o saldo.",
      ),
    /** O comprovante depende de `site.prestador.comprovante` (recibo ou nota), como nas perguntas frequentes e nos Termos. */
    comprovante: {
      recibo: "Depois de cada pagamento por Pix, o Marcelo emite um recibo. Se precisar de nota fiscal, basta avisar na conversa, antes da proposta.",
      nota: "Depois de cada pagamento, o Marcelo emite a nota fiscal de serviço.",
    },
    extra:
      "Hospedagem, licenças de programas e uso de inteligência artificial, quando o serviço precisar, são pagos direto ao fornecedor, na conta de quem contrata. A proposta diz quando isso se aplica.",
    dica: "Dica: confira o valor na proposta por escrito antes de pagar a entrada. Só vale o que estiver nela.",
    pergunta: "Quer saber como é a entrega do projeto?",
  },

  receber: {
    direta: (g: Tratamento) =>
      tr(
        g,
        "Quando o trabalho fica pronto, {S} recebe os arquivos finais, ou a página já publicada no seu endereço.",
        "Quando o trabalho fica pronto, chegam os arquivos finais, ou a página já publicada no endereço combinado.",
      ),
    explica: [
      "A entrega é por etapas: dá para ver o andamento antes do fim. Os arquivos finais são liberados depois do saldo.",
      "Planilhas e painéis chegam em arquivo (o Excel é o padrão, e o painel também pode ser em Power BI Desktop). Páginas são publicadas, e os serviços vêm com instruções de uso.",
      "Depois do pagamento integral, tudo o que foi feito é seu para usar, alterar e copiar.",
    ],
    dica: "Dica: se quiser ver tudo funcionando com calma, dá para combinar uma conversa pelo Google Meet na entrega.",
    pergunta: "Quer saber o que acontece depois da entrega?",
  },

  confianca: {
    direta: "É uma dúvida muito justa, e vale conferir mesmo 😊 Estes são os fatos:",
    /** `linhas` monta a lista com o que está em site.ts e na seção Sobre (ver motor.ts). */
    prestador: (nome: string, cidadeUf: string | null, documento: string | null) =>
      `Quem presta o serviço é ${nome}${cidadeUf ? `, de ${cidadeUf}` : ""}${documento ? ` (${documento}, parcial; o número completo vai na proposta por escrito, antes de qualquer pagamento)` : ""}.`,
    formacao: "Estuda Sistemas de Informação na Unieuro e trabalha como desenvolvedor fullstack.",
    estagio: "É estagiário de TI no Ministério da Defesa, com análise de dados, planilhas e painéis, a mesma rotina que leva para o seu negócio.",
    uniser: "Faz parte da equipe que desenvolve a plataforma da UniSER, a Universidade do Envelhecer da UnB.",
    combinado:
      "Tudo é combinado por escrito: proposta, Termos e pagamento em duas partes. O valor que o site mostra é só uma estimativa até a proposta.",
    diferenciais:
      "Os diferenciais são qualidade técnica, entrega no prazo, valores justos com descontos generosos e apoio em outros projetos que a pessoa queira tocar.",
    portfolio: "Um portfólio para recrutadores está em desenvolvimento.",
    dica: "Dica: leia os Termos e as perguntas frequentes antes de decidir. Estão escritos em linguagem simples, de propósito.",
    pergunta: "Quer ler a seção Sobre ou os Termos?",
  },

  depois: {
    direta: "Depois da entrega, conte comigo e com o Marcelo: há revisão incluída, garantia e dá para pedir ajustes 😊",
    intro: "Em linguagem simples:",
    revisao: "Revisão: uma rodada de revisão já está incluída no preço. Vale mandar os ajustes de uma vez.",
    /** `dias` vem do texto das perguntas frequentes (a garantia), nunca escrito aqui. */
    defeito: (dias: string) => `Defeito: são ${dias} dias, a contar da entrega final, para apontar o que não funciona como a proposta descreveu, e o Marcelo corrige sem custo.`,
    ajuste: (hora: string) => `Mudança nova ou algo fora da proposta: ${hora} por hora, sempre com o valor avisado antes de começar.`,
    arquivo: "O arquivo é seu: depois do pagamento integral, dá para usar e alterar à vontade.",
    botsTitulo: "Bots de Discord têm mensalidade (valores-base):",
    bots: (percentual: string, nome: string, criacao: string, mensal: string) =>
      `${percentual} do preço de criação por mês, para monitorar e corrigir erros. Exemplo com o ${nome} (criação ${criacao}): ${mensal} por mês. A hospedagem é cobrada à parte, e dá para cancelar a mensalidade a qualquer momento, sem multa.`,
    dica: "Dica: anote tudo o que quiser mudar e peça de uma vez, porque a revisão incluída é uma rodada só.",
    pergunta: "Está pensando em algum ajuste, ou em um bot de Discord?",
  },

  publico: {
    direta: "O trabalho do Marcelo atende pequenos negócios, profissionais liberais, comércio e quem cuida de produtos e estoque.",
    explica: (g: Tratamento) =>
      tr(
        g,
        "Se {S} tem planilhas bagunçadas, perde tempo repetindo tarefas ou quer uma página ou um sistema só seu, o trabalho foi pensado para isso.",
        "Quem tem planilhas bagunçadas, perde tempo repetindo tarefas ou quer uma página ou um sistema próprio é quem mais aproveita.",
      ),
    grandes:
      "Para empresas grandes que já têm um sistema grande (SaaS), o caminho costuma ser outro, e o orçamento tende a ser maior.",
    pergunta: (g: Tratamento) => tr(g, "Qual é o tipo de negócio d{S}?", "Qual é o tipo de negócio?"),
  },

  empresaGrande: {
    direta: "Vou ser transparente: o trabalho do Marcelo serve melhor para pequenos negócios, profissionais liberais, comércio e gestão de produtos e estoque.",
    explica:
      "Se a empresa já tem um sistema grande funcionando (um SaaS, um ERP), trocar ou integrar costuma ser um projeto maior, e o orçamento tende a ser maior também. Para algo pontual ao lado do sistema, como um painel ou uma automação, pode valer a conversa.",
    dica: "Dica: conte o caso pelo WhatsApp ou pelo formulário, sem compromisso, para o Marcelo dizer com franqueza se faz sentido.",
    pergunta: "Quer falar direto com o Marcelo?",
  },

  /** Por tipo de negócio: frase de abertura e os serviços sugeridos (ids de servicos.ts). */
  negocio: {
    comercio: {
      direta: "Para comércio, o que mais ajuda é saber o que vende, o que encalha e o que está acabando.",
      servicos: ["painel", "planilha", "landing"],
      porque: "Estas são as saídas mais comuns:",
    },
    liberal: {
      direta: "Para profissional liberal, o que costuma ajudar é ter uma página que apresente o serviço e leve o cliente direto ao WhatsApp, e controles em ordem.",
      servicos: ["landing", "planilha", "automacao"],
      porque: "Estas são as saídas mais comuns:",
    },
    gestao: {
      direta: "Para quem cuida de produtos e estoque, o painel mostra o estoque e as vendas com número, e não no chute.",
      servicos: ["painel", "planilha", "sistema"],
      porque: "Estas são as saídas mais comuns:",
    },
    dica: "Dica: se não tiver certeza de qual escolher, o guia “Não sei qual escolher” indica em duas perguntas.",
    pergunta: "Quer ver o preço de algum deles, ou montar uma estimativa?",
  },

  exemplos: {
    direta: "Aqui vão exemplos do dia a dia de cada serviço. São situações ilustrativas, e não clientes reais.",
    dica: "Dica: na página há um exemplo do que o Marcelo entrega, com dados de exemplo.",
    pergunta: "Algum deles parece com o seu caso?",
  },

  /** Explicação de cada serviço em linguagem de leigo, com um exemplo do dia a dia (situação ilustrativa). */
  servicos: {
    planilha: {
      simples: "Uma planilha organizada é aquela em que cada assunto tem a sua aba, as colunas seguem um padrão e os totais se calculam sozinhos.",
      exemplo: "Uma loja que anota vendas em vários arquivos passa a ter uma planilha só, que soma o mês sem fazer conta de cabeça.",
    },
    painel: {
      simples: "Um painel é uma tela que mostra os seus números em gráficos, para ler em um minuto, sem montar conta.",
      exemplo: "Quem vende produtos abre o arquivo e vê o que mais saiu no mês e o que está acabando no estoque.",
    },
    automacao: {
      simples: "Automação é ensinar o computador a fazer sozinho a tarefa que se repete toda semana na planilha, com um clique.",
      exemplo: "Em vez de copiar e colar relatórios todo fim de semana, um botão junta tudo e já deixa o total pronto.",
    },
    landing: {
      simples: "Um site de uma página é uma página na internet com o seu serviço, os seus preços e um botão que leva o cliente direto ao WhatsApp.",
      exemplo: "Um salão de beleza coloca serviços e valores em um endereço só, e o cliente chama no WhatsApp com um toque.",
    },
    python: {
      simples: "A automação com Python é um programa feito para a sua tarefa: junta planilhas e arquivos, lê PDFs, busca dados de sites e entrega o resultado pronto.",
      exemplo: "Em vez de abrir PDF por PDF para digitar os valores, o programa lê todos e entrega uma planilha pronta.",
    },
    sistema: {
      simples:
        "Um sistema sob medida é um programa feito para o jeito que o seu negócio funciona: em vez de várias planilhas e anotações soltas, tudo fica em um lugar só, na internet.",
      exemplo:
        "Uma loja que anota vendas no caderno, estoque na planilha e clientes no WhatsApp passa a ver tudo em uma tela só: o que vendeu, o que está acabando e quem comprou.",
    },
  } as Record<string, { simples: string; exemplo: string }>,

  explicarGeral: {
    simples:
      "O Marcelo pega a bagunça de dados de um negócio (planilhas soltas, anotações, tarefas repetidas) e transforma em algo fácil de usar: planilha organizada, painel com números, página na internet ou sistema sob medida.",
    exemplo: "Uma loja que controla tudo em cadernos e várias planilhas passa a ter um painel que mostra o que vende e o que está acabando.",
    pergunta: (g: Tratamento) => tr(g, "Assim eu explico o que serve para o caso d{S}. Qual é o tipo de negócio?", "Assim eu explico o que serve para o caso. Qual é o tipo de negócio?"),
  },

  explicarServico: {
    pergunta: (g: Tratamento) => tr(g, "Assim eu digo se faz sentido para o caso d{S}. Qual é o tipo de negócio?", "Assim eu digo se faz sentido para o caso. Qual é o tipo de negócio?"),
    abertura: "Sem problema, vou explicar de um jeito bem simples 😊",
    exemploRotulo: "Exemplo do dia a dia (situação ilustrativa):",
  },
} as const;
