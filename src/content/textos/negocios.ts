// Textos da home de Negócios: menu, hero, painel de exemplo, como funciona e contato. O Sobre fica em sobre.ts.
// Faz parte de src/content/textos/ (ver index.ts). Preços nunca são escritos à mão aqui: saem de servicos.ts e orcamento.ts.
import { sobre } from "./sobre";

export const negocios = {
  exemploTitulo: "Um exemplo do que eu entrego",
  nav: [
    { href: "/#orcamento", rotulo: "Orçamento" },
    { href: "/como-funciona/", rotulo: "Como funciona" },
    { href: "/#entregas", rotulo: "Entregas", secao: "entregas" },
    { href: "/#sobre", rotulo: "Sobre", secao: "sobre" },
    { href: "/#contato", rotulo: "Contato", secao: "contato" },
  ] as { href: string; rotulo: string; secao?: "sobre" | "entregas" | "contato" }[],
  /** Atalho discreto de WhatsApp no rodapé de Negócios (a seção #contato tem os outros canais). */
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
    /** O `h1` é a promessa; o nome (`site.nome`) vai acima dele, como sobretítulo. Título + subtítulo formam a frase do JSON-LD. */
    titulo: "Transformo a sua planilha bagunçada em um painel.",
    subtitulo:
      "Ele mostra o que vende, o que encalha e o que está acabando. Também crio a página do seu negócio e sistemas completos na internet.",
    texto:
      "Planilhas organizadas, painéis com os seus números, páginas de apresentação e sistemas sob medida. Tudo explicado em português claro, sem complicação.",
    /** Linha de partida do celular: o menor preço de pacote, direto de servicos.ts. */
    partida: (nome: string) => `${nome},`,
    aPartirDe: (valor: string) => `a partir de ${valor}`,
    comoPedir: "Monte o orçamento aqui e envie pelo site ou pelo WhatsApp.",
    botaoOrcamento: "Realize seu orçamento",
    botaoComoFunciona: "Como funciona?",
    /** Só no celular: atalho direto para a conversa, sem passar pelo orçamento. */
    botaoWhatsapp: "Chamar no WhatsApp",
    seta: "Entenda como Funciona",
    // Painel de exemplo (loja fictícia) mostrado ao lado do título.
    painel: {
      rotulo: "Exemplo de painel · loja fictícia",
      selo: "Exemplo",
      titulo: "Painel de vendas",
      descricao: "Todos os números da loja em uma única tela: quanto vendeu, o que mais sai e o que está parado. Os dados abaixo são fictícios.",
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
  /** Seção #entregas da home: os 5 passos do pedido à entrega. */
  comoFunciona: {
    titulo: "Do pedido à entrega",
    intro: "Da primeira conversa ao arquivo final, em cinco passos.",
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
  sobre,
  /** Conteúdo do <noscript> da home (sem JavaScript, robôs que não executam JS). Gerado no build por seo.ts. */
  semJs: {
    aviso: "O orçamento na hora precisa de JavaScript. Sem ele, fale comigo direto:",
    whatsapp: "Chamar no WhatsApp",
    email: "Mandar um e-mail",
    comoFunciona: "Ver como funciona",
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
