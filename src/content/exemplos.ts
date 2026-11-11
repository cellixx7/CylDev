// Conteúdo da página /negocios/como-funciona/. Cada item vira uma seção com endereço próprio (#id).
// Os exemplos são fictícios e servem só para mostrar o formato da entrega.

export type Exemplo = {
  /** Vira o trecho depois do # no endereço. */
  id: string;
  /** Id do pacote em servicos.ts (para o botão de orçamento). */
  servicoId: string;
  rotulo: string;
  titulo: string;
  problema: string;
  colabora: string[];
  exemplo: string;
};

export const comoFunciona = {
  titulo: "Entenda como funciona cada entrega",
  intro:
    "Cada parte abaixo mostra, com um exemplo, o que eu entrego e como isso ajuda no dia a dia do negócio. Todo bloco tem um link próprio: copie e mande para quem quiser ver exatamente aquele assunto.",
  indice: "Escolha o assunto",
  copiar: "Copiar link",
  copiado: "Link copiado!",
  copiarFalhou: "Copie o endereço na barra do navegador.",
  exemploRotulo: "Exemplo",
  colaboraRotulo: "Como isso ajuda",
  problemaRotulo: "Quando faz sentido",
  pedir: "Quero algo assim",
  voltar: "Voltar para a página inicial",
  seta: "Entenda como Funciona",
};

export const exemplos: Exemplo[] = [
  {
    id: "planilhas",
    servicoId: "planilha",
    rotulo: "Planilha organizada",
    titulo: "A planilha que você já tem, em ordem",
    problema:
      "Os dados estão espalhados, cada pessoa preenche de um jeito e o total nunca bate com o que você esperava.",
    colabora: [
      "Uma aba por assunto: vendas, estoque, caixa.",
      "Colunas padronizadas, então qualquer pessoa preenche do mesmo jeito.",
      "Totais que conferem, para você confiar no número.",
      "Uma página de instruções para a equipe não se perder.",
    ],
    exemplo: "Antes e depois de uma planilha de vendas",
  },
  {
    id: "paineis",
    servicoId: "painel",
    rotulo: "Painel básico",
    titulo: "Os números do mês numa tela só",
    problema:
      "Você quer saber quanto vendeu e o que mais sai, mas precisa montar conta toda vez que pergunta.",
    colabora: [
      "Você abre o arquivo e já vê vendas, produtos e o andamento do mês.",
      "Filtro por período para comparar uma semana com a outra.",
      "Estoque e vendas acompanhados com número, e não no chute.",
      "Em Excel ou Power BI Desktop, o que for mais prático para você.",
    ],
    exemplo: "Painel de uma loja fictícia",
  },
  {
    id: "automacao",
    servicoId: "automacao",
    rotulo: "Automação em Excel",
    titulo: "A tarefa repetida passa a rodar com um clique",
    problema:
      "Toda semana alguém copia, cola, filtra e formata a mesma coisa. Dá trabalho e é fácil errar.",
    colabora: [
      "O passo a passo manual vira um botão ou uma atualização automática.",
      "Menos erro de digitação e menos tempo gasto em tarefa repetida.",
      "Feito com VBA ou Power Query, dentro do Excel que você já usa.",
    ],
    exemplo: "Rotina semanal, antes e depois",
  },
  {
    id: "landing-page",
    servicoId: "landing",
    rotulo: "Página para o seu negócio",
    titulo: "Uma página que leva o cliente ao seu WhatsApp",
    problema:
      "Os clientes perguntam sempre as mesmas coisas e você não tem um lugar para mostrar o serviço e os preços.",
    colabora: [
      "Uma página com o seu serviço, seus preços e um botão de WhatsApp.",
      "Funciona bem no celular, que é de onde a maioria chega.",
      "Fica no ar em hospedagem gratuita, na sua conta.",
    ],
    exemplo: "Esboço de uma página fictícia",
  },
  {
    id: "aulas",
    servicoId: "aulas",
    rotulo: "Aulas de Excel ou programação",
    titulo: "Aprender com o seu próprio material de trabalho",
    problema: "Você quer aprender, mas os cursos prontos usam exemplos que não têm a ver com o seu dia a dia.",
    colabora: [
      "Aula individual pelo computador, no seu ritmo.",
      "Exercícios feitos com os arquivos que você usa no trabalho.",
      "Você sai sabendo fazer sozinho o que precisa.",
    ],
    exemplo: "Como pode ser um plano de aulas",
  },
  {
    id: "sistema",
    servicoId: "sistema",
    rotulo: "Sistema sob medida",
    titulo: "Quando a planilha já não dá conta",
    problema:
      "O negócio cresceu, a planilha ficou pesada e várias pessoas precisam usar ao mesmo tempo.",
    colabora: [
      "Começa com uma conversa para entender o seu caso.",
      "Você recebe uma proposta por escrito antes de qualquer cobrança.",
      "O sistema é desenhado em volta da sua rotina, e não o contrário.",
    ],
    exemplo: "Do primeiro contato à proposta",
  },
];
