// Textos da seção Sobre de Negócios (parágrafos, destaques e modais).
// Faz parte de src/content/textos/ (ver index.ts). Preços nunca são escritos à mão aqui: saem de servicos.ts e orcamento.ts.

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

export const sobre = {
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
  botaoOrcamento: "Fazer orçamento",
};
