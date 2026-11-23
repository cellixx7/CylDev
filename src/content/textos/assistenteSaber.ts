// Base de "saber geral" do Assistente Cyl: perguntas comuns de Excel, Planilhas Google, painéis, automação, sites e do jeito
// de trabalhar do Marcelo. É conteúdo curado e escrito à mão, em linguagem de leigo. Fica fora do index.ts de propósito
// (só o chat, carregado ao abrir, importa este arquivo).
//
// Regras de quem edita:
// - NENHUM preço, prazo, desconto ou percentual aqui. Esses valores só saem de servicos.ts e orcamento.ts (o motor acrescenta o
//   preço de partida do serviço relacionado por código). Um teste barra "R$", "dias", "horas" e "%" nos textos.
// - Cada tópico se conecta a um serviço do catálogo pelo `servico` (id de servicos.ts) quando faz sentido. É dali que vem a
//   ponte "se preferir que o Marcelo faça isso por você".
// - `frases` são gatilhos escritos do jeito que a pessoa digitaria (o motor normaliza acento, plural, gírias e erro de uma
//   letra em palavra de 5+ letras). Prefira frases específicas: uma palavra solta e comum ("excel", "site") dispararia o tópico
//   em qualquer conversa.
// - `faqTitulo`: em vez de texto próprio, mostra a pergunta frequente do site com esse começo de título (sem risco de divergir
//   do que está publicado).
// - Isto é conteúdo educativo geral, não parecer técnico, jurídico ou contábil. Onde houver risco (dados pessoais, contrato), o
//   tópico manda para os Termos, a Privacidade ou o Marcelo.

export type CategoriaId = "excel" | "dados" | "paineis" | "automacao" | "sites" | "sistemas" | "trabalho";

export const categorias: { id: CategoriaId; rotulo: string; intro: string }[] = [
  { id: "excel", rotulo: "Fórmulas e Excel", intro: "Dicas de fórmulas, atalhos e erros comuns no Excel e no Planilhas Google." },
  { id: "dados", rotulo: "Organizar dados", intro: "Como deixar planilhas e dados arrumados, seguros e fáceis de manter." },
  { id: "paineis", rotulo: "Painéis e gráficos", intro: "Painéis, indicadores e gráficos que ajudam a decidir." },
  { id: "automacao", rotulo: "Automação e Python", intro: "Como tarefas repetidas podem rodar sozinhas." },
  { id: "sites", rotulo: "Sites e internet", intro: "Página de apresentação, endereço, hospedagem e como aparecer na busca." },
  { id: "sistemas", rotulo: "Sistemas e bots", intro: "Quando a planilha não basta, banco de dados, integrações e bots." },
  { id: "trabalho", rotulo: "Como trabalhamos", intro: "Atendimento, proposta, sigilo e o que cabe (ou não) no serviço." },
];

export type Topico = {
  id: string;
  categoria: CategoriaId;
  /** Texto do botão que abre o tópico. */
  rotulo: string;
  frases: string[];
  /** Variantes da resposta direta (o motor alterna, para não repetir o mesmo texto). */
  direta: string[];
  explica: string[];
  passos?: string[];
  dica?: string;
  /** Exemplo do dia a dia (aparece em "me dá um exemplo"). */
  exemplo?: string;
  /** Mais detalhes (aparecem em "explica melhor", "mais detalhes"). */
  aprofundar?: string[];
  /** Id do serviço de servicos.ts que resolve isso para o cliente. */
  servico?: string;
  /** Ids de outros tópicos para sugerir em seguida. */
  relacionados?: string[];
  /** Mostra a pergunta frequente do site (começo do título) em vez de texto próprio. */
  faqTitulo?: string[];
  /** Vale mesmo quando a mensagem também parece pergunta de preço, prazo, pagamento ou orçamento ("tem mensalidade?"). */
  vence?: boolean;
  /** Acrescenta a frase "costuma responder em até 2 horas, sem garantia" (a única fonte desse texto é `comum.tempoResposta`). */
  tempoResposta?: boolean;
  /** Serviços cujos botões "Orçar" aparecem como saída da resposta (para quando a pessoa ainda não disse o que precisa). */
  servicosChips?: string[];
};

export const topicos: Topico[] = [
  // ===== Fórmulas e Excel =====================================================================================================
  {
    id: "procv",
    categoria: "excel",
    rotulo: "PROCV e PROCX",
    frases: ["puxar dado de outra aba", "puxar dados de outra aba", "puxar dado de outra planilha", "buscar dado em outra planilha", "trazer dados de outra aba", "procv", "procx", "vlookup", "xlookup", "proc v", "buscar valor em outra aba", "puxar dados de outra planilha", "puxar valor de outra aba", "buscar dado de outra tabela", "cruzar duas planilhas", "cruzar planilhas", "cruzar tabelas"],
    direta: [
      "O PROCV (e o PROCX, mais novo) procura um valor numa tabela e traz outra informação da mesma linha, tipo achar o preço de um produto pelo código.",
      "Para buscar uma informação em outra tabela pelo código, nome ou outro identificador, a função é o PROCV ou, nas versões novas, o PROCX.",
    ],
    explica: [
      "No PROCV você informa o que procurar, onde procurar, de qual coluna trazer a resposta e se a busca é exata. A chave de busca precisa estar na primeira coluna da tabela. O PROCX é mais flexível: procura em qualquer coluna, olha para a esquerda e já trata o caso de não achar.",
    ],
    passos: [
      "Confira se a chave (código, e-mail, nome) é igual nas duas tabelas, sem espaço sobrando.",
      "Use a busca exata, para não trazer o item parecido errado.",
      "Se aparecer #N/D, o valor não foi encontrado: quase sempre é espaço extra, texto no lugar de número ou código escrito diferente.",
    ],
    dica: "Dica: antes de puxar dados, aplique TIRAR (ou ARRUMAR) nos códigos e confira se números não estão guardados como texto.",
    exemplo: "Exemplo: você tem uma lista de vendas só com o código do produto e uma tabela de produtos com nome e preço. O PROCV traz o nome e o preço para cada venda.",
    aprofundar: [
      "O PROCX está no Excel mais novo e no Planilhas Google; versões antigas do Excel só têm o PROCV. Para buscar por mais de um critério (por exemplo, produto e mês), dá para juntar os dois numa coluna auxiliar ou usar funções de índice e correspondência.",
      "Se você faz esse cruzamento todo mês entre arquivos diferentes, vale automatizar: aí o trabalho deixa de ser fórmula e vira um processo que roda sozinho.",
    ],
    servico: "planilha",
    relacionados: ["erros-excel", "somase", "planilha-organizada"],
  },
  {
    id: "somase",
    categoria: "excel",
    rotulo: "Somar com condição (SOMASE)",
    frases: ["somase", "somases", "cont se", "cont ses", "contse", "contses", "somar com condição", "somar só", "somar apenas", "somar por categoria", "somar por cliente", "somar por mês", "contar quantos", "contar itens por"],
    direta: [
      "Para somar só o que atende a uma condição, use SOMASE (uma condição) ou SOMASES (várias). Para contar, use CONT.SE ou CONT.SES.",
      "SOMASE e CONT.SE resolvem a maioria dos relatórios simples: somar ou contar apenas o que bate com um critério.",
    ],
    explica: [
      "No SOMASE você indica onde está o critério, qual é o critério (por exemplo, \"Pago\" ou um nome de cliente) e de onde somar os valores. O SOMASES aceita vários critérios ao mesmo tempo, como cliente e mês.",
    ],
    passos: [
      "Mantenha cada informação em uma coluna (cliente, data, valor), sem linhas de total no meio.",
      "Para o critério variar, escreva-o numa célula e aponte a fórmula para ela, em vez de digitar o texto dentro da fórmula.",
    ],
    dica: "Dica: se você acaba criando muitas fórmulas parecidas, uma tabela dinâmica costuma resolver mais rápido e sem erro de digitação.",
    exemplo: "Exemplo: somar quanto cada vendedor vendeu no mês, lendo uma lista com uma venda por linha.",
    servico: "painel",
    relacionados: ["tabela-dinamica", "procv", "planilha-organizada"],
  },
  {
    id: "funcao-se",
    categoria: "excel",
    rotulo: "Função SE (e SE com E/OU)",
    frases: ["função se", "formula se", "fórmula se", "se aninhado", "se com e ou", "se e ou", "se dentro de se", "se ses", "condicional no excel", "if no excel", "fazer um se"],
    direta: [
      "A função SE faz a planilha decidir: se a condição for verdadeira, mostra um resultado; senão, mostra outro.",
      "O SE é o jeito de a planilha escolher entre dois caminhos, como \"Pago\" ou \"Pendente\", conforme o valor de uma célula.",
    ],
    explica: [
      "Ela tem três partes: o teste, o que mostrar se for verdadeiro e o que mostrar se for falso. Para testar duas coisas juntas, combine com E (as duas precisam valer) ou OU (basta uma). Quando há muitas faixas (por exemplo, notas A, B e C), prefira SES ou uma tabela de faixas com PROCV, que fica mais fácil de manter do que muitos SE dentro de SE.",
    ],
    dica: "Dica: se a regra muda com frequência, guarde os limites numa tabela e aponte a fórmula para ela, em vez de escrever os números dentro da fórmula.",
    exemplo: "Exemplo: marcar \"Atrasado\" quando a data de vencimento já passou e o pagamento ainda não foi feito (teste com E).",
    servico: "planilha",
    relacionados: ["somase", "formatacao-condicional", "erros-excel"],
  },
  {
    id: "ref-absoluta",
    categoria: "excel",
    rotulo: "Travar célula com $",
    frases: ["travar célula", "travar referência", "trava a célula", "fixar célula", "fixar referência", "referência absoluta", "cifrão na fórmula", "o f4", "tecla f4", "fórmula muda quando arrasto", "arrastar a fórmula", "quando arrasto a fórmula", "copiar fórmula errado"],
    direta: [
      "Para a fórmula não \"andar\" quando você a arrasta ou copia, trave a célula com o cifrão ($), por exemplo $B$2. A tecla F4 coloca e tira o cifrão para você.",
      "O cifrão ($) trava a linha, a coluna ou as duas na referência. É o que faz uma célula (como uma taxa ou um preço) continuar fixa quando você copia a fórmula para baixo.",
    ],
    explica: [
      "Sem cifrão, a referência é relativa e se desloca junto com a fórmula. Com $B$2 ela fica sempre em B2. Com B$2 só a linha fica travada, e com $B2 só a coluna. Apertar F4 com a referência selecionada alterna entre essas formas.",
    ],
    dica: "Dica: se a fórmula deu certo na primeira linha e erra nas de baixo, quase sempre faltou travar uma referência.",
    relacionados: ["erros-excel", "procv", "atalhos-excel"],
  },
  {
    id: "erros-excel",
    categoria: "excel",
    rotulo: "O que significam #N/D, #REF!, #VALOR!",
    frases: ["deu erro n/d", "aparece n/d", "apareceu n/d", "erro de ref", "erro de valor", "erro de nome", "erro div", "erro de divisão por zero", "erro #valor", "erro #ref", "erro #nome", "erro #div", "erro n/d", "erro ref", "erro valor", "erro de divisão", "erro nome", "erro no excel", "erro na fórmula", "fórmula deu erro", "fórmula não funciona", "fórmula com erro", "aparece cerquilha"],
    direta: [
      "Cada erro do Excel diz o que deu errado: #N/D é \"não achei\", #REF! é \"a célula referenciada não existe mais\", #VALOR! é \"tipo de dado errado\" e #DIV/0! é \"divisão por zero\".",
      "As mensagens com # são pistas. Veja o que cada uma costuma indicar:",
    ],
    explica: [],
    passos: [
      "#N/D: o valor procurado não foi encontrado (espaço sobrando, texto no lugar de número ou escrito diferente).",
      "#REF!: a fórmula aponta para uma célula, linha ou coluna que foi apagada.",
      "#VALOR!: a fórmula recebeu um tipo errado, como texto onde deveria ter número.",
      "#DIV/0!: divisão por zero ou por célula vazia; dá para tratar com SEERRO.",
      "#NOME?: o nome da função ou de um intervalo está errado, ou a função não existe na sua versão.",
      "Se a célula mostra só cerquilhas (#######), a coluna está estreita demais para o número: alargue a coluna.",
    ],
    dica: "Dica: para esconder um erro esperado (como divisão por zero), use SEERRO. Para achar a causa de verdade, selecione a célula e use \"Avaliar fórmula\" na aba Fórmulas.",
    servico: "planilha",
    relacionados: ["procv", "ref-absoluta", "planilha-organizada"],
  },
  {
    id: "atalhos-excel",
    categoria: "excel",
    rotulo: "Atalhos úteis do Excel",
    frases: ["atalho do excel", "atalhos do excel", "atalhos no excel", "atalho de teclado", "atalhos de teclado", "atalhos úteis", "trabalhar mais rápido no excel", "ganhar tempo no excel", "dicas de excel", "dicas para excel", "dica de excel"],
    direta: [
      "Alguns atalhos do Excel (no Windows) que economizam muito tempo:",
      "Se a ideia é ganhar velocidade na planilha, estes atalhos do Excel para Windows valem a pena:",
    ],
    explica: [],
    passos: [
      "Ctrl + T: transforma os dados em tabela (com filtros e fórmulas que se estendem sozinhas).",
      "Ctrl + Shift + L: liga e desliga os filtros.",
      "F4: trava a referência com cifrão ou repete a última ação.",
      "Alt + =: soma automática da coluna ou da linha.",
      "Ctrl + ; (ponto e vírgula): insere a data de hoje; Ctrl + Shift + ; insere a hora.",
      "Ctrl + E: Preenchimento Relâmpago, que completa o padrão que você começou a digitar.",
      "Ctrl + setas: pula para o fim ou o começo dos dados.",
    ],
    dica: "Dica: no Mac, muitos atalhos usam Command no lugar do Ctrl, mas nem todos são iguais.",
    relacionados: ["ref-absoluta", "separar-texto", "tabela-dinamica"],
  },
  {
    id: "formatacao-condicional",
    categoria: "excel",
    rotulo: "Formatação condicional",
    frases: ["formatação condicional", "formatacao condicional", "pintar célula automaticamente", "colorir célula automaticamente", "mudar a cor da célula", "célula mudar de cor", "destacar valores", "destacar vencidos", "destacar atrasados", "cor automática", "semáforo na planilha", "cores automáticas"],
    direta: [
      "A formatação condicional muda a cor (ou o ícone) de uma célula sozinha, conforme o valor ou uma regra que você define.",
      "Para destacar automaticamente o que importa, como contas vencidas ou estoque baixo, o recurso é a formatação condicional.",
    ],
    explica: [
      "Fica na aba Página Inicial. Dá para usar regras prontas (maior que, menor que, duplicados, barras de dados) ou escrever uma fórmula para pintar a linha inteira. A cor muda sozinha quando o dado muda.",
    ],
    dica: "Dica: pouca cor funciona melhor. Escolha um destaque por situação (por exemplo, vermelho para atrasado) e deixe o resto neutro, também para quem enxerga cores de outro jeito.",
    exemplo: "Exemplo: a linha do cliente fica vermelha quando a data de vencimento é anterior a hoje e o campo \"pago\" está vazio.",
    servico: "painel",
    relacionados: ["funcao-se", "o-que-e-painel", "qual-grafico"],
  },
  {
    id: "lista-suspensa",
    categoria: "excel",
    rotulo: "Lista suspensa e validação",
    frases: ["lista suspensa", "lista de opções", "menu suspenso", "dropdown", "validação de dados", "validacao de dados", "impedir erro de digitação", "evitar erro de digitação", "padronizar o que digitam", "limitar o que pode digitar", "só aceitar certas opções"],
    direta: [
      "A lista suspensa (validação de dados) deixa a pessoa escolher entre opções prontas em vez de digitar, o que evita nomes escritos de mil jeitos.",
      "Para padronizar o que entra na planilha, use validação de dados: ela limita a célula a uma lista, um intervalo de datas ou números.",
    ],
    explica: [
      "Fica em Dados > Validação de Dados. Escolha \"Lista\" e aponte para as opções (podem estar em outra aba). Dá para mostrar uma mensagem de ajuda e recusar valores fora da regra.",
    ],
    dica: "Dica: guarde a lista de opções numa aba própria; para acrescentar uma opção nova, é só escrever no fim da lista (se ela estiver em formato de tabela, a lista cresce sozinha).",
    exemplo: "Exemplo: o campo \"Status\" só aceita Novo, Em andamento ou Concluído, e o relatório deixa de ter \"concluido\", \"Concluido\" e \"concluído \" como coisas diferentes.",
    servico: "planilha",
    relacionados: ["planilha-organizada", "remover-duplicados", "somase"],
  },
  {
    id: "remover-duplicados",
    categoria: "excel",
    rotulo: "Remover duplicados",
    frases: ["remover duplicado", "remover duplicatas", "remover repetidos", "tirar duplicados", "tirar duplicatas", "tirar repetidos", "apagar repetidos", "linhas repetidas", "dados repetidos", "cadastro duplicado", "clientes duplicados", "achar duplicados"],
    direta: [
      "Em Dados > Remover Duplicatas o Excel apaga as linhas repetidas, e você escolhe quais colunas precisam ser iguais para contar como repetição.",
      "Para tirar repetidos, use Dados > Remover Duplicatas. Antes, faça uma cópia do arquivo: a remoção não tem volta depois de salvar.",
    ],
    explica: [
      "O difícil costuma ser o \"quase igual\": nomes com espaço sobrando, maiúsculas diferentes ou acento faltando. Limpe esses detalhes primeiro (TIRAR, MAIÚSCULA) e só então remova. Para apenas enxergar os repetidos antes de apagar, use a formatação condicional de valores duplicados.",
    ],
    dica: "Dica: escolha uma chave confiável (como CPF ou código) em vez de só o nome. Dois clientes diferentes podem ter o mesmo nome.",
    servico: "planilha",
    relacionados: ["planilha-organizada", "formatacao-condicional", "lgpd-planilha"],
  },
  {
    id: "separar-texto",
    categoria: "excel",
    rotulo: "Separar nome e sobrenome",
    frases: ["separar nome", "separar o nome", "separar sobrenome", "dividir nome", "dividir texto", "separar texto", "texto para colunas", "separar em colunas", "dividir em colunas", "separar endereço", "separar data e hora", "preenchimento relâmpago", "preenchimento relampago", "juntar nome e sobrenome", "unir texto", "unir colunas"],
    direta: [
      "Para separar um texto em colunas (nome e sobrenome, por exemplo), use Dados > Texto para Colunas, ou o Preenchimento Relâmpago (Ctrl + E).",
      "Dividir ou juntar textos é rotina em planilha, e o Excel tem recursos prontos para isso:",
    ],
    explica: [],
    passos: [
      "Texto para Colunas: separa por um símbolo (espaço, vírgula, ponto e vírgula) ou por largura fixa.",
      "Preenchimento Relâmpago: digite o resultado esperado em uma ou duas linhas e aperte Ctrl + E para ele completar o resto.",
      "Para juntar, use o símbolo & (por exemplo, A2 & \" \" & B2) ou a função UNIRTEXTO.",
    ],
    dica: "Dica: faça numa cópia. Se nomes compostos (Maria de Lourdes) estiverem na lista, confira o resultado antes de usar.",
    servico: "planilha",
    relacionados: ["csv-acentos", "remover-duplicados", "atalhos-excel"],
  },
  {
    id: "csv-acentos",
    categoria: "excel",
    rotulo: "CSV com acento quebrado",
    frases: ["csv", "acento quebrado", "acentos quebrados", "acentuação quebrada", "caracteres estranhos", "símbolos estranhos", "letras estranhas", "ã virou", "utf-8", "utf8", "importar csv", "abrir csv", "csv tudo numa coluna", "tudo em uma coluna"],
    direta: [
      "Acento quebrado ao abrir um CSV é quase sempre problema de codificação. Importe o arquivo pelo menu Dados > De Texto/CSV e escolha a codificação UTF-8.",
      "CSV é um arquivo de texto simples, e o Excel às vezes erra a leitura. A saída é importar o arquivo escolhendo a codificação e o separador.",
    ],
    explica: [
      "No Brasil, o separador costuma ser o ponto e vírgula, porque a vírgula é usada nos decimais. Se tudo aparece numa coluna só, o separador está errado: na importação, escolha o certo. Se os acentos viraram símbolos, troque a codificação para UTF-8 (ou para a que o sistema de origem usa).",
    ],
    dica: "Dica: no Planilhas Google, Arquivo > Importar costuma acertar a codificação sozinho.",
    servico: "python",
    relacionados: ["juntar-planilhas", "power-query", "separar-texto"],
  },

  // ===== Organizar dados =====================================================================================================
  {
    id: "planilha-organizada",
    categoria: "dados",
    rotulo: "Como deixar a planilha organizada",
    frases: ["planilha uma bagunça", "planilha está uma bagunça", "planilha virou uma bagunça", "bagunça na planilha", "bagunça nos dados", "tudo misturado na planilha", "planilha bagunçada", "planilha desorganizada", "planilha confusa", "organizar planilha", "organizar minha planilha", "boas práticas de planilha", "boas práticas planilha", "como organizar os dados", "como organizar dados", "planilha bem feita", "planilha pesada", "planilha lenta", "planilha travando", "estrutura da planilha"],
    direta: [
      "Uma planilha organizada segue poucas regras: uma linha por registro, uma coluna por informação, cabeçalho único na primeira linha e nada de total no meio dos dados.",
      "Quase toda planilha bagunçada se resolve com o mesmo princípio: dados em formato de lista, e relatórios e totais em outra aba.",
    ],
    explica: [
      "Quando os dados estão em lista, filtros, tabelas dinâmicas, gráficos e fórmulas funcionam sem esforço. Quando misturam dados, totais e enfeites na mesma área, cada relatório vira trabalho manual.",
    ],
    passos: [
      "Um tipo de informação por coluna (data só com data, valor só com número).",
      "Sem linhas e colunas em branco no meio e sem células mescladas na área de dados.",
      "Nomes padronizados (use lista suspensa para escolher, em vez de digitar).",
      "Dados numa aba, relatórios e gráficos em outra.",
      "Uma cópia de segurança antes de mexer em tudo.",
    ],
    dica: "Dica: se a planilha está pesada, procure fórmulas aplicadas em colunas inteiras, muitas formatações e imagens grandes. Costuma bastar limpar isso.",
    servico: "planilha",
    relacionados: ["celulas-mescladas", "lista-suspensa", "backup-planilha"],
  },
  {
    id: "celulas-mescladas",
    categoria: "dados",
    rotulo: "Por que evitar células mescladas",
    frases: ["célula mesclada", "células mescladas", "mesclar célula", "mesclar células", "mesclar e centralizar", "mescladas atrapalham", "não consigo filtrar", "filtro não funciona", "não consigo ordenar", "não consigo classificar", "classificar não funciona", "ordenar não funciona"],
    direta: [
      "Células mescladas atrapalham filtros, ordenação, tabelas dinâmicas e fórmulas: dentro da área de dados, evite.",
      "Se o filtro ou a ordenação não funcionam, procure células mescladas ou linhas em branco no meio dos dados: são as causas mais comuns.",
    ],
    explica: [
      "Mesclar serve para deixar um título bonito, mas dentro de uma lista de dados cria buracos que o Excel não sabe interpretar. Para centralizar sem mesclar, use a opção \"Centralizar na seleção\" no formato da célula.",
    ],
    dica: "Dica: para desfazer, selecione tudo e use \"Desfazer mesclagem\"; depois preencha os vazios que sobrarem.",
    servico: "planilha",
    relacionados: ["planilha-organizada", "remover-duplicados", "tabela-dinamica"],
  },
  {
    id: "excel-ou-sheets",
    categoria: "dados",
    rotulo: "Excel ou Planilhas Google?",
    frases: ["o que é excel", "o que é o excel", "para que serve o excel", "pra que serve o excel", "o que é o google planilhas", "excel ou google", "excel ou sheets", "excel x sheets", "excel ou planilhas google", "excel ou planilha google", "google sheets ou excel", "planilhas google ou excel", "sheets ou excel", "qual é melhor excel", "qual melhor excel", "diferença entre excel e", "diferença entre sheets", "excel online", "google planilhas", "planilhas google", "google sheets", "planilha google", "sheets"],
    direta: [
      "Os dois resolvem a maioria dos casos. O Planilhas Google é grátis e ótimo para trabalhar junto em tempo real; o Excel é mais completo para volume grande, macros e recursos avançados.",
      "Depende do uso: para compartilhar e editar com a equipe ao mesmo tempo, o Planilhas Google é prático; para análise pesada e automações, o Excel costuma ir mais longe.",
    ],
    explica: [],
    passos: [
      "Planilhas Google: roda no navegador, grátis com conta Google, vários editores ao mesmo tempo, histórico de versões. Automação com Apps Script.",
      "Excel: mais funções e recursos (tabela dinâmica avançada, Power Query, macros VBA), melhor com arquivos grandes, funciona offline no computador.",
      "Dá para converter de um para o outro, mas algumas fórmulas e macros precisam de ajuste.",
    ],
    dica: "Dica: o que mais pesa na escolha é o que você já usa e quem mexe na planilha. Trocar de ferramenta só vale se houver um motivo claro.",
    servico: "planilha",
    relacionados: ["compartilhar-planilha", "macro-vba", "backup-planilha"],
  },
  {
    id: "compartilhar-planilha",
    categoria: "dados",
    rotulo: "Compartilhar planilha com a equipe",
    frases: ["proteger minha planilha", "protejo minha planilha", "proteger a planilha com senha", "colocar senha na planilha", "senha para a planilha", "senha na minha planilha", "compartilhar planilha", "compartilhar a planilha", "várias pessoas na planilha", "mais de uma pessoa na planilha", "editar ao mesmo tempo", "editar junto", "equipe editar planilha", "permissão na planilha", "permissões na planilha", "proteger planilha", "proteger células", "travar planilha", "bloquear células", "senha na planilha"],
    direta: [
      "Para a equipe editar junto, o caminho mais simples é guardar a planilha na nuvem (Planilhas Google, OneDrive ou Drive) e compartilhar por e-mail, com a permissão certa para cada pessoa.",
      "Compartilhar bem é decidir quem pode ver, quem pode comentar e quem pode editar, e proteger o que não deve ser mexido.",
    ],
    explica: [
      "Dá para proteger só algumas células ou abas (por exemplo, as fórmulas) e deixar o restante livre para digitar. Evite mandar a planilha por e-mail em várias cópias: depois ninguém sabe qual é a certa.",
    ],
    dica: "Dica: uma cópia só, na nuvem, com histórico de versões ligado. Quem quiser ver sem mexer recebe permissão de leitura.",
    servico: "planilha",
    relacionados: ["backup-planilha", "lgpd-planilha", "excel-ou-sheets"],
  },
  {
    id: "backup-planilha",
    categoria: "dados",
    rotulo: "Backup e versões da planilha",
    frases: ["backup da planilha", "backup de planilha", "fazer backup", "perdi a planilha", "perdi meu arquivo", "apaguei sem querer", "apaguei por engano", "recuperar planilha", "recuperar arquivo", "histórico de versões", "histórico de versão", "versão anterior", "arquivo corrompido", "salvar versão"],
    direta: [
      "O melhor backup é o automático: guarde a planilha na nuvem com histórico de versões e mantenha também uma cópia fora do computador.",
      "Para não perder dados, mantenha o arquivo na nuvem (que guarda versões antigas) e uma cópia extra em outro lugar.",
    ],
    explica: [
      "No Planilhas Google e no OneDrive existe histórico de versões, e dá para voltar a um ponto anterior. No computador, o Excel pode guardar uma cópia de recuperação automática, mas ela não substitui backup. Antes de mudanças grandes (apagar duplicados, mexer em fórmulas), faça uma cópia com a data no nome.",
    ],
    dica: "Dica: teste de vez em quando se a cópia abre mesmo. Backup que ninguém abriu é só esperança.",
    servico: "planilha",
    relacionados: ["compartilhar-planilha", "planilha-organizada", "lgpd-planilha"],
  },
  {
    id: "lgpd-planilha",
    categoria: "dados",
    rotulo: "Dados de clientes na planilha (LGPD)",
    frases: ["planilha de clientes com cpf", "posso mandar a planilha", "posso enviar a planilha", "posso mandar minha planilha", "posso enviar minha planilha", "como envio os arquivos", "como enviar os arquivos", "como mando os arquivos", "dados de clientes posso mandar", "dados de clientes na planilha", "dados pessoais na planilha", "planilha com cpf", "planilha com dados de clientes", "planilha de clientes lgpd", "lgpd na planilha", "mandar planilha com segurança", "enviar planilha com segurança", "enviar planilha com dados", "mandar planilha com dados", "planilha com informações sensíveis", "dados sensíveis"],
    direta: [
      "Planilha com dados de clientes pede cuidado: mande só o necessário, troque nomes e CPF por códigos quando der, e compartilhe por link restrito.",
    ],
    explica: [],
    faqTitulo: ["como mando a minha planilha com segurança"],
    dica: "Dica: além do envio, vale cuidar de quem tem acesso ao arquivo no seu dia a dia, com senha e permissão por pessoa.",
    relacionados: ["compartilhar-planilha", "backup-planilha", "sigilo"],
  },
  {
    id: "estoque-planilha",
    categoria: "dados",
    rotulo: "Controle de estoque em planilha",
    frases: ["controle de estoque na planilha", "estoque na planilha", "estoque no excel", "planilha de estoque", "controlar estoque", "como controlar o estoque", "controlar produtos", "entrada e saída de produtos", "entradas e saídas", "saldo de estoque", "estoque mínimo", "estoque baixo", "alerta de estoque"],
    direta: [
      "Um estoque em planilha funciona bem com três ideias: um cadastro de produtos, uma lista de movimentações (entradas e saídas) e uma aba que calcula o saldo.",
      "Dá para controlar o estoque numa planilha sem complicar: cada entrada e cada saída vira uma linha, e o saldo é calculado por fórmula.",
    ],
    explica: [],
    passos: [
      "Aba de produtos: código, nome, categoria e estoque mínimo.",
      "Aba de movimentações: data, código do produto, tipo (entrada ou saída) e quantidade.",
      "Aba de saldo: somar entradas e subtrair saídas por produto (SOMASES) e destacar quando passar do mínimo.",
    ],
    dica: "Dica: quando mais de uma pessoa lança movimentações ao mesmo tempo, ou o volume cresce, a planilha começa a falhar. Aí vale olhar para um sistema simples.",
    exemplo: "Exemplo: uma loja pequena lança cada venda e cada compra do fornecedor, e o saldo e o alerta de \"repor\" aparecem sozinhos.",
    servico: "planilha",
    relacionados: ["somase", "quando-planilha-nao-basta", "formatacao-condicional"],
  },
  {
    id: "financeiro-planilha",
    categoria: "dados",
    rotulo: "Fluxo de caixa e contas na planilha",
    frases: ["fluxo de caixa", "controle financeiro", "controle de gastos", "controle de contas", "contas a pagar", "contas a receber", "planilha financeira", "planilha de gastos", "planilha de despesas", "organizar as finanças", "organizar financeiro", "orçamento pessoal", "controle de despesas"],
    direta: [
      "Um controle financeiro simples em planilha precisa de uma lista de lançamentos (data, descrição, categoria, valor, entrada ou saída) e de um resumo mensal por categoria.",
      "Para organizar contas, o segredo é lançar tudo numa única lista e deixar os totais por mês e por categoria em outra aba, calculados sozinhos.",
    ],
    explica: [
      "Com os lançamentos em lista, uma tabela dinâmica ou o SOMASES mostram quanto entrou, quanto saiu e para onde foi, sem refazer conta. Destacar vencimentos próximos ajuda a não esquecer pagamentos.",
    ],
    dica: "Dica: não misture dinheiro da empresa e pessoal no mesmo arquivo. Esta é uma orientação geral de organização, não de contabilidade.",
    servico: "planilha",
    relacionados: ["tabela-dinamica", "somase", "o-que-e-painel"],
  },

  // ===== Painéis e gráficos ==================================================================================================
  {
    id: "tabela-dinamica",
    categoria: "paineis",
    rotulo: "Tabela dinâmica",
    frases: ["gráfico dinâmico", "grafico dinamico", "gráfico dinâmico no excel", "tabela dinâmica", "tabela dinamica", "tabelas dinâmicas", "pivot", "pivot table", "resumir dados", "resumir os dados", "resumo de vendas", "relatório automático", "relatório sem fórmula", "agrupar dados", "agrupar por mês"],
    direta: [
      "A tabela dinâmica resume milhares de linhas em poucos cliques: você arrasta campos e ela soma, conta ou tira a média por cliente, produto, mês ou o que quiser.",
      "Para transformar uma lista longa em um resumo (vendas por mês, gastos por categoria), a ferramenta certa é a tabela dinâmica.",
    ],
    explica: [
      "Ela exige dados em lista: cabeçalho único, uma linha por registro e sem linhas de total no meio. Depois de criada, basta clicar em Atualizar quando os dados mudarem. Dá para ligar gráficos e segmentações (botões de filtro) a ela, que é a base de muito painel.",
    ],
    passos: [
      "Selecione qualquer célula da lista e use Inserir > Tabela Dinâmica.",
      "Arraste o campo de categoria para Linhas e o de valor para Valores.",
      "Use Atualizar quando os dados mudarem e Segmentação de Dados para filtros visuais.",
    ],
    dica: "Dica: se aparecer \"contagem\" quando você queria \"soma\", alguma célula da coluna está com texto ou vazia.",
    exemplo: "Exemplo: a lista tem uma venda por linha (data, vendedor, produto, valor) e a tabela dinâmica mostra o total por vendedor em cada mês.",
    aprofundar: [
      "Para um painel que a equipe abre e já encontra tudo pronto, o caminho costuma ser: dados organizados, uma ou mais tabelas dinâmicas, gráficos ligados a elas e segmentações para filtrar.",
    ],
    servico: "painel",
    relacionados: ["planilha-organizada", "qual-grafico", "o-que-e-painel"],
  },
  {
    id: "qual-grafico",
    categoria: "paineis",
    rotulo: "Qual gráfico usar",
    frases: ["como fazer gráfico", "como faço um gráfico", "criar gráfico", "criar um gráfico", "fazer um gráfico", "fazer gráfico", "qual gráfico", "qual grafico", "que gráfico", "tipo de gráfico", "tipos de gráfico", "gráfico de pizza", "gráfico de barras", "gráfico de linha", "gráfico de colunas", "gráfico certo", "melhor gráfico", "como fazer um gráfico", "gráfico bonito", "gráfico fica feio", "gráfico confuso"],
    direta: [
      "Regra prática: linhas para evolução no tempo, barras ou colunas para comparar categorias, e pizza só quando são poucas fatias que somam um todo.",
      "O gráfico certo depende da pergunta: evolução pede linha; comparação pede barra; participação no total (com poucas partes) pede pizza ou rosca.",
    ],
    explica: [],
    passos: [
      "Evolução ao longo do tempo (vendas por mês): gráfico de linhas ou colunas.",
      "Comparar itens (vendas por produto): barras, de preferência ordenadas do maior para o menor.",
      "Parte de um todo, com poucas categorias: pizza ou rosca. Com muitas, prefira barras.",
      "Relação entre duas medidas (preço e quantidade): dispersão.",
    ],
    dica: "Dica: um gráfico bom tem título que diz a conclusão, poucas cores e eixos legíveis. Se precisa de legenda enorme, provavelmente é o gráfico errado.",
    servico: "painel",
    relacionados: ["o-que-e-painel", "tabela-dinamica", "formatacao-condicional"],
  },
  {
    id: "o-que-e-painel",
    categoria: "paineis",
    rotulo: "O que é painel (dashboard) e indicador",
    frases: ["como faço um dashboard", "como fazer um dashboard", "como montar um dashboard", "como criar um dashboard", "como fazer um painel", "como montar um painel", "como criar um painel", "o que é dashboard", "o que é indicador", "o que são indicadores", "o que é kpi", "o que são kpis", "kpi", "kpis", "dashboard para que serve", "painel para que serve", "para que serve um painel", "painel de controle", "painel de vendas", "indicadores de desempenho", "quais indicadores"],
    direta: [
      "Painel (ou dashboard) é uma tela única com os números e gráficos mais importantes do seu negócio, para você bater o olho e decidir, sem abrir dez planilhas.",
      "Um painel reúne indicadores (os números que mostram como o negócio vai) em um só lugar, atualizados a partir dos seus dados.",
    ],
    explica: [
      "Indicadores, ou KPIs, são poucos números que respondem a perguntas reais: estou vendendo mais ou menos que o mês passado? Quem está atrasado? O que está acabando? O erro comum é colocar tudo: um bom painel tem poucos indicadores, cada um ligado a uma decisão.",
    ],
    dica: "Dica: antes de montar, escreva as três perguntas que você quer responder todo mês. O painel nasce delas.",
    exemplo: "Exemplo: uma loja abre o painel de segunda-feira e vê o faturamento da semana, os cinco produtos mais vendidos e os itens abaixo do estoque mínimo.",
    servico: "painel",
    relacionados: ["tabela-dinamica", "qual-grafico", "powerbi-ou-excel"],
  },
  {
    id: "powerbi-ou-excel",
    categoria: "paineis",
    rotulo: "Power BI ou Excel para o painel?",
    frases: ["power bi ou excel", "powerbi ou excel", "excel ou power bi", "excel ou powerbi", "power bi é melhor", "power bi vale a pena", "preciso de power bi", "precisa de power bi", "diferença entre power bi", "power bi grátis", "power bi gratuito", "power bi desktop", "licença do power bi", "power bi pago"],
    direta: [
      "Para a maioria dos pequenos negócios, o painel em Excel resolve e não exige licença extra. O Power BI vale mais quando há muitos dados, várias fontes ou muita gente consultando online.",
      "Os dois fazem painéis. O Excel é mais simples de manter e de compartilhar; o Power BI é mais potente para volume grande e fontes variadas.",
    ],
    explica: [
      "O Power BI Desktop pode ser usado para criar o painel, mas compartilhar o painel online com a equipe exige licença paga do Power BI do seu lado. No Excel isso não é preciso: o painel vai dentro do arquivo.",
    ],
    dica: "Dica: se hoje seus dados já vivem no Excel e quem consulta é uma ou poucas pessoas, comece pelo Excel. Dá para migrar depois se crescer.",
    servico: "painel",
    relacionados: ["o-que-e-painel", "programa-pago", "power-query"],
  },

  // ===== Automação e Python ==================================================================================================
  {
    id: "macro-vba",
    categoria: "automacao",
    rotulo: "O que é macro e VBA",
    frases: ["o que é macro", "o que é uma macro", "o que são macros", "o que é vba", "gravar macro", "gravar uma macro", "macro no excel", "macro do excel", "macros do excel", "macro não funciona", "macro bloqueada", "habilitar macro", "habilitar macros", "botão que faz tudo", "automatizar com um clique", "apps script", "app script", "script do google"],
    direta: [
      "Macro é uma sequência de ações do Excel gravada para rodar de novo com um clique. O VBA é a linguagem em que essas macros são escritas.",
      "Uma macro repete sozinha o que você faria à mão na planilha: formatar, copiar, filtrar, gerar relatório. O VBA é a linguagem por trás dela.",
    ],
    explica: [
      "O Excel tem um gravador que registra os seus passos, e um editor onde o código pode ser ajustado. O arquivo precisa ser salvo como habilitado para macro (.xlsm). Por segurança, habilite macros só em arquivos de origem confiável, porque uma macro maliciosa pode fazer estrago. No Planilhas Google o equivalente é o Apps Script.",
    ],
    dica: "Dica: antes de automatizar, deixe a tarefa em passos claros e repetíveis. Automatizar um processo confuso só repete a confusão mais rápido.",
    exemplo: "Exemplo: toda segunda você copia o relatório do sistema, tira três colunas, ordena e salva em PDF. Uma macro faz isso com um botão.",
    servico: "automacao",
    relacionados: ["automatizar-relatorio", "python-para-que", "power-query"],
  },
  {
    id: "power-query",
    categoria: "automacao",
    rotulo: "Power Query (importar e limpar dados)",
    frases: ["importar dados do sistema", "exportar do sistema para planilha", "puxar dados do sistema", "dados do sistema da empresa", "exportar relatório do sistema", "importar relatório do sistema", "power query", "powerquery", "obter e transformar", "obter dados", "importar dados automaticamente", "atualizar dados automaticamente", "limpar dados automaticamente", "transformar dados", "juntar tabelas automaticamente", "combinar tabelas"],
    direta: [
      "O Power Query, dentro do Excel, importa dados de vários lugares, limpa e organiza, e guarda os passos para repetir tudo com um clique em Atualizar.",
      "Para receber o mesmo tipo de arquivo todo mês e arrumar do mesmo jeito sempre, o Power Query grava os passos e refaz sozinho.",
    ],
    explica: [
      "Fica na aba Dados (Obter e Transformar Dados nas versões atuais). Ele lê planilhas, CSV, pastas inteiras e sites, remove colunas, separa textos, junta tabelas e carrega o resultado pronto. Quando chega um arquivo novo, você atualiza e o resultado se refaz.",
    ],
    dica: "Dica: ele serve muito bem até um volume médio de dados. Para tarefas que mexem em PDFs, e-mails ou sites, um script em Python costuma ser melhor.",
    servico: "automacao",
    relacionados: ["juntar-planilhas", "csv-acentos", "python-para-que"],
  },
  {
    id: "python-para-que",
    categoria: "automacao",
    rotulo: "Python: para que serve",
    frases: ["macro ou python", "vba ou python", "macro ou script", "diferença entre macro e script", "diferença entre vba e python", "vba x python", "script ou macro", "o que é uma automação", "o que é automação", "me explica o que é automação", "o que significa automação", "o que é uma automatização", "o que é python", "para que serve python", "pra que serve python", "python para que", "python serve para", "python ou excel", "excel ou python", "python no lugar do excel", "python é melhor que excel", "vale a pena python", "quando usar python", "quando usar um script", "o que é um script", "o que é script", "o que é automação", "o que é automatizar"],
    direta: [
      "Python é uma linguagem de programação muito usada para automatizar tarefas com arquivos, planilhas, PDFs e sites. Um script é um programa pequeno feito para uma tarefa específica.",
      "Automação é fazer o computador repetir sozinho uma tarefa chata. O Python é uma das ferramentas mais comuns para isso.",
    ],
    explica: [
      "Excel e Python não competem: o Excel é ótimo para ver e mexer nos dados; o Python entra quando a tarefa envolve muitos arquivos, formatos misturados (PDF, CSV, e-mail), volume grande ou rotina que precisa rodar sem ninguém abrir nada.",
    ],
    passos: [
      "Use fórmulas e tabela dinâmica quando os dados estão num arquivo e a tarefa é analisá-los.",
      "Use macro ou Power Query quando a tarefa se repete dentro do próprio Excel.",
      "Use Python quando junta muitos arquivos, lê PDF, busca dados de sites ou envia mensagens.",
    ],
    dica: "Dica: antes de pedir um script, anote o que entra (quais arquivos), o que deve sair (qual resultado) e quantas vezes isso se repete.",
    servico: "python",
    relacionados: ["juntar-planilhas", "ler-pdf", "macro-vba"],
  },
  {
    id: "juntar-planilhas",
    categoria: "automacao",
    rotulo: "Juntar várias planilhas em uma",
    frases: ["como junto planilhas", "junto várias planilhas", "várias planilhas numa só", "planilhas numa só", "unificar planilhas", "mesclar planilhas", "juntar planilhas", "juntar várias planilhas", "unir planilhas", "unir várias planilhas", "consolidar planilhas", "consolidar arquivos", "consolidar dados", "combinar planilhas", "combinar arquivos", "várias planilhas em uma", "uma planilha por mês", "uma planilha por filial", "planilhas de cada mês", "planilhas de cada filial", "juntar arquivos"],
    direta: [
      "Juntar várias planilhas em uma é um dos casos mais comuns de automação: o programa abre cada arquivo, empilha os dados e entrega uma lista só, pronta para análise.",
      "Para consolidar planilhas (uma por mês, por filial, por vendedor), dá para usar o Power Query no Excel ou um script em Python, que lê uma pasta inteira de uma vez.",
    ],
    explica: [
      "O que mais atrapalha é a falta de padrão: colunas com nomes ou ordem diferentes, linhas de título repetidas e totais no meio. Quanto mais parecidos os arquivos, mais fácil é automatizar. Se estiverem muito diferentes, o primeiro passo é definir um modelo único.",
    ],
    dica: "Dica: mande uma amostra de cada tipo de arquivo, com poucas linhas e sem dados sensíveis. É suficiente para planejar o processo.",
    exemplo: "Exemplo: doze arquivos, um por mês, com as mesmas colunas, viram uma única tabela do ano inteiro com uma coluna a mais dizendo o mês de origem.",
    servico: "python",
    relacionados: ["power-query", "csv-acentos", "automatizar-relatorio"],
  },
  {
    id: "ler-pdf",
    categoria: "automacao",
    rotulo: "Tirar dados de PDF",
    frases: ["ler pdf", "ler pdfs", "tirar dados de pdf", "extrair dados de pdf", "extrair pdf", "pdf para excel", "pdf para planilha", "converter pdf", "passar pdf para excel", "dados do pdf", "extrato em pdf", "nota em pdf", "boletos em pdf", "pdf escaneado"],
    direta: [
      "Dá para extrair tabelas e textos de PDF automaticamente, se o PDF tiver texto \"de verdade\" (daqueles em que você consegue selecionar as palavras).",
      "PDF para planilha é possível: com um script, o programa lê vários PDFs e coloca o que interessa em colunas.",
    ],
    explica: [
      "O resultado depende do PDF. Os gerados por sistemas costumam ter layout regular e extraem bem. PDFs escaneados são imagens: precisam de reconhecimento de texto (OCR), que é menos exato e pede conferência. Layouts que mudam de um arquivo para outro exigem mais ajustes.",
    ],
    dica: "Dica: mande uma amostra de alguns PDFs (sem dados sensíveis) e diga quais campos você quer na planilha.",
    servico: "python",
    relacionados: ["python-para-que", "juntar-planilhas", "lgpd-planilha"],
  },
  {
    id: "automatizar-relatorio",
    categoria: "automacao",
    rotulo: "Automatizar relatório semanal",
    frases: ["automatizar envio de email", "automatizar envio de e-mail", "enviar email automático", "enviar e-mails automaticamente", "enviar relatório por email", "mandar relatório por email", "automatizar relatório", "automatizar relatórios", "relatório toda semana", "relatório toda segunda", "relatório todo mês", "relatório mensal automático", "relatório semanal", "tarefa repetitiva", "tarefas repetitivas", "tarefa repetida", "faço a mesma coisa toda", "perco tempo toda semana", "perco horas", "trabalho manual", "trabalho repetitivo", "fazer sozinho", "rodar sozinho"],
    direta: [
      "Se você faz a mesma tarefa toda semana ou todo mês, é candidata a automação: o ganho vem de transformar passos manuais em um clique (ou em algo que roda sozinho).",
      "Tarefa repetitiva é o melhor caso para automatizar, porque o ganho de tempo se repete a cada vez.",
    ],
    explica: [],
    passos: [
      "Anote os passos exatos que você faz hoje, na ordem.",
      "Separe o que entra (arquivos, de onde vêm) e o que deve sair (relatório, planilha, mensagem).",
      "Veja o que muda de uma vez para outra (datas, nomes) e o que é sempre igual.",
      "Escolha a ferramenta: macro (tudo dentro do Excel), Power Query (importar e limpar) ou Python (arquivos, PDFs, sites, mensagens).",
    ],
    dica: "Dica: um bom sinal de que vale automatizar é quando você consegue explicar a tarefa como uma receita, sem \"depende\" no meio.",
    servico: "automacao",
    relacionados: ["macro-vba", "power-query", "python-para-que"],
  },

  // ===== Sites e internet =====================================================================================================
  {
    id: "landing-page",
    categoria: "sites",
    rotulo: "O que é um site de uma página",
    frases: ["o que é landing page", "o que é uma landing page", "o que é landing", "landing page para que", "o que é site de uma página", "site de uma página para que", "preciso de um site", "preciso de site", "meu negócio precisa de site", "vale a pena ter site", "vale ter um site", "site ou instagram", "instagram ou site", "só instagram", "site para pequeno negócio", "site simples ou completo"],
    direta: [
      "Um site de uma página (landing page) reúne num só lugar o que o cliente precisa saber: o que você faz, para quem, quanto custa e como chamar, com um botão direto para o WhatsApp.",
      "Para muitos pequenos negócios, uma página bem feita basta: apresenta o serviço, mostra preços e leva o cliente ao WhatsApp.",
    ],
    explica: [
      "O Instagram é ótimo para mostrar o dia a dia, mas é um terreno alugado: o formato muda e nem todo mundo está lá. Uma página própria dá um endereço seu, fácil de colocar na bio, nas conversas e no cartão. Quando o negócio precisa de várias páginas, loja virtual ou sistema de pedidos, já é um projeto maior, e esse o Marcelo avalia caso a caso.",
    ],
    dica: "Dica: uma boa página tem uma ação clara. Escolha qual é (chamar no WhatsApp, pedir orçamento) e deixe o resto em volta dela.",
    servico: "landing",
    relacionados: ["dominio-hospedagem", "seo-basico", "site-responsivo"],
  },
  {
    id: "dominio-hospedagem",
    categoria: "sites",
    rotulo: "Domínio e hospedagem",
    frases: ["o que é domínio", "o que é dominio", "o que é hospedagem", "domínio e hospedagem", "dominio e hospedagem", "hospedagem de site", "hospedar site", "hospedar o site", "onde fica o site", "registrar domínio", "registrar dominio", "comprar domínio", "comprar dominio", "endereço do site", "endereço próprio", "nome do site", "www ponto", "ponto com ponto br", "site no ar", "publicar o site", "colocar o site no ar", "publicar a página"],
    direta: [
      "Domínio é o endereço do site (como seunegocio.com.br); hospedagem é o lugar onde os arquivos do site ficam guardados para qualquer pessoa abrir.",
      "Pense assim: o domínio é o nome na porta, e a hospedagem é o terreno onde a casa fica. Você precisa de um para achar e do outro para existir.",
    ],
    explica: [
      "Existem hospedagens gratuitas, que atendem bem um site simples, e hospedagens pagas, com mais recursos. O domínio próprio costuma ser registrado e renovado por ano, em geral com custo à parte do site. O ideal é que domínio e hospedagem fiquem sempre na sua conta, e não na de quem fez o site.",
    ],
    dica: "Dica: conte antes da proposta se você já tem um domínio ou quer um endereço próprio. O que entra no serviço está na lista do Site de uma página.",
    servico: "landing",
    relacionados: ["landing-page", "seo-basico", "site-responsivo"],
  },
  {
    id: "seo-basico",
    categoria: "sites",
    rotulo: "Aparecer no Google (SEO)",
    frases: ["ranquear", "ranquear no google", "ranking no google", "ficar no topo do google", "topo do google", "melhorar meu site no google", "indexar o site", "site no google", "aparecer no google", "aparecer na busca", "aparecer nas buscas", "aparecer na pesquisa", "primeiro lugar no google", "primeira página do google", "posição no google", "o que é seo", "seo", "otimizar para google", "otimização para google", "google meu negócio", "perfil da empresa no google", "meu site não aparece", "site não aparece no google", "anúncio no google", "google ads", "tráfego pago"],
    direta: [
      "Ninguém consegue garantir a primeira posição no Google. O que dá para fazer é deixar o site bem preparado: título e texto claros, carregamento rápido, bom no celular e informações de contato corretas.",
      "SEO é o conjunto de cuidados que ajuda o site a ser encontrado nas buscas. Não existe garantia de posição, e o resultado costuma levar tempo.",
    ],
    explica: [
      "Para negócio local, um passo de grande efeito é criar e manter o Perfil da Empresa no Google (com endereço, horário, fotos e avaliações). Anúncios pagos e gestão contínua de SEO não fazem parte do catálogo de serviços deste site.",
    ],
    passos: [
      "Um título e uma descrição que digam o que você faz e onde.",
      "Texto próprio e claro, com as palavras que o cliente usaria para te procurar.",
      "Página rápida e boa no celular.",
      "Mesmo nome, telefone e endereço em todos os lugares (site, Google, redes).",
    ],
    dica: "Dica: desconfie de quem promete \"primeiro lugar garantido\". Nenhum prestador de serviço controla o Google.",
    servico: "landing",
    relacionados: ["landing-page", "site-responsivo", "dominio-hospedagem"],
  },
  {
    id: "site-responsivo",
    categoria: "sites",
    rotulo: "Site no celular e acessível",
    frases: ["site no celular", "site para celular", "site responsivo", "responsivo", "versão para celular", "versão mobile", "mobile first", "site acessível", "acessibilidade no site", "acessibilidade do site", "site para todos", "site para cego", "leitor de tela", "contraste das cores", "texto alternativo", "site lento", "site demora para abrir"],
    direta: [
      "Responsivo quer dizer que o site se ajusta sozinho ao tamanho da tela. Hoje a maior parte dos clientes abre pelo celular, então o site precisa nascer pensando nele.",
      "Um site bom funciona no celular primeiro e se acomoda no computador depois, e também pode ser usado por quem tem alguma limitação.",
    ],
    explica: [],
    passos: [
      "Textos legíveis sem precisar dar zoom e botões grandes o bastante para o dedo.",
      "Contraste suficiente entre texto e fundo, sem depender só da cor para passar informação.",
      "Imagens com descrição (texto alternativo) e que não deixem a página pesada.",
      "Dá para navegar só pelo teclado, e o leitor de tela entende a ordem da página.",
    ],
    dica: "Dica: para testar rápido, abra o site no seu celular, em rede móvel, e veja se você acha o botão de contato em poucos segundos.",
    servico: "landing",
    relacionados: ["landing-page", "seo-basico", "dominio-hospedagem"],
  },
  {
    id: "front-back",
    categoria: "sites",
    rotulo: "Front-end, back-end e outros termos",
    frases: ["o que é front end", "o que é front-end", "o que é frontend", "o que é back end", "o que é back-end", "o que é backend", "front e back", "front end e back end", "o que é html", "o que é css", "o que é javascript", "o que é um framework", "o que é framework", "o que é git", "o que é github", "o que é deploy", "o que é programação", "o que é desenvolvimento web", "o que faz um desenvolvedor", "o que é um desenvolvedor", "termos de programação"],
    direta: [
      "Front-end é a parte do site que você vê e toca (texto, cores, botões). Back-end é a parte que roda por trás: regras, contas de usuário, banco de dados.",
      "Em poucas palavras: front-end é a vitrine; back-end é a cozinha. Um site simples de apresentação só precisa de vitrine.",
    ],
    explica: [],
    passos: [
      "HTML: a estrutura e o conteúdo da página (títulos, textos, imagens, links).",
      "CSS: a aparência (cores, tamanhos, posição).",
      "JavaScript: o comportamento (menus que abrem, formulários que validam).",
      "Framework: um conjunto de ferramentas prontas que acelera a construção.",
      "Git: guarda o histórico de mudanças do código, e o GitHub é um lugar onde esse histórico fica hospedado.",
      "Deploy: colocar a versão pronta no ar.",
    ],
    dica: "Dica: você não precisa saber nada disso para contratar. O que importa é descrever o resultado que você quer.",
    relacionados: ["api", "banco-de-dados", "landing-page"],
  },
  {
    id: "api",
    categoria: "sistemas",
    rotulo: "O que é uma API e integração",
    frases: ["o que é api", "o que é uma api", "o que é integração", "o que é integrar", "api para que serve", "para que serve api", "integrar sistemas", "integrar planilha", "integrar com o sistema", "integrar com whatsapp", "integrar com site", "conectar sistemas", "conectar planilha com", "webhook", "o que é webhook"],
    direta: [
      "API é um jeito padronizado de um programa pedir informação ou ação a outro. Integração é usar isso para dois sistemas trocarem dados sozinhos.",
      "Quando um sistema \"conversa\" com outro (por exemplo, lançar na planilha cada pedido da loja), isso é uma integração, e ela costuma funcionar por meio de uma API.",
    ],
    explica: [
      "Cada serviço define o que oferece pela sua API e, muitas vezes, exige uma chave de acesso, que é pessoal e não deve ser compartilhada. Integrações dependem de quem fornece o outro lado: se o sistema não oferece API ou muda as regras, a integração precisa ser ajustada.",
    ],
    dica: "Dica: integrações são pedidos maiores. Para eles, o caminho é contar o caso no formulário ou no WhatsApp, para o Marcelo avaliar antes de qualquer estimativa.",
    relacionados: ["banco-de-dados", "quando-planilha-nao-basta", "python-para-que"],
  },

  // ===== Sistemas e bots ======================================================================================================
  {
    id: "quando-planilha-nao-basta",
    categoria: "sistemas",
    rotulo: "Quando a planilha não basta mais",
    frases: ["quando a planilha não basta", "planilha não dá conta", "planilha não aguenta", "planilha já não dá", "planilha não é suficiente", "planilha ou sistema", "sistema ou planilha", "preciso de um sistema", "preciso de sistema", "hora de ter um sistema", "trocar a planilha por", "substituir planilha", "sair da planilha", "planilha limitada", "planilha cheia de problemas"],
    direta: [
      "A planilha começa a falhar quando várias pessoas lançam ao mesmo tempo, quando os dados crescem demais, quando há regras de acesso (cada um vê só o seu) ou quando um erro de digitação custa caro.",
      "Se a planilha virou um emaranhado que só uma pessoa entende, e cada mudança dá medo, pode ser hora de pensar em um sistema.",
    ],
    explica: [
      "Um sistema sob medida guarda os dados de forma organizada, controla quem pode fazer o quê e faz as regras do seu negócio, em vez de depender de cuidado manual. O custo e o tempo são maiores que os de uma planilha, então só vale quando o problema realmente passou do que a planilha resolve.",
    ],
    passos: [
      "Mais de uma pessoa mexendo ao mesmo tempo e uma sobrescrevendo a outra.",
      "Perda de dados ou versões diferentes do mesmo arquivo.",
      "Necessidade de perfis de acesso (cada pessoa vê só o seu).",
      "Fórmulas tão complicadas que ninguém quer mexer.",
    ],
    dica: "Dica: antes de decidir, veja se uma planilha melhor organizada (com lista suspensa, proteção e painel) já resolve. Muitas vezes resolve.",
    servico: "sistema",
    relacionados: ["banco-de-dados", "planilha-organizada", "api"],
  },
  {
    id: "banco-de-dados",
    categoria: "sistemas",
    rotulo: "O que é banco de dados",
    frases: ["o que é banco de dados", "o que é um banco de dados", "banco de dados", "banco de dado", "o que é sql", "sql ou planilha", "planilha ou banco de dados", "mysql", "postgres", "postgresql", "sqlite", "firebase", "supabase", "access"],
    direta: [
      "Banco de dados é um lugar organizado para guardar informações de modo que muita gente (e muitos programas) possa ler e gravar ao mesmo tempo com segurança.",
      "Em termos simples, um banco de dados é uma planilha séria: várias tabelas ligadas entre si, com regras para os dados não se contradizerem.",
    ],
    explica: [
      "A planilha é ótima para poucos dados e poucas pessoas. O banco de dados entra quando há muito volume, vários usuários ao mesmo tempo ou necessidade de relacionar informações (clientes, pedidos, produtos) sem repetir tudo. A linguagem usada para consultá-lo, na maioria dos casos, é o SQL.",
    ],
    dica: "Dica: um sistema pode usar banco de dados por trás sem que você precise mexer nele. O que você vê é uma tela simples.",
    servico: "sistema",
    relacionados: ["quando-planilha-nao-basta", "api", "front-back"],
  },
  {
    id: "bot-discord",
    categoria: "sistemas",
    rotulo: "O que um bot de Discord faz",
    frases: ["o que é bot", "o que é um bot", "o que faz um bot", "o que um bot faz", "para que serve um bot", "pra que serve um bot", "bot de discord faz", "bot de tickets", "ticket no discord", "moderação no discord", "moderar servidor", "boas-vindas no discord", "mensagem de boas-vindas", "servidor de discord", "servidor do discord", "meu servidor de discord"],
    direta: [
      "Um bot de Discord é um programa que fica dentro do seu servidor e faz tarefas sozinho: dar boas-vindas, abrir tickets de suporte, moderar mensagens e mais.",
      "O bot cuida da parte repetitiva do servidor, como recepção, atendimento por tickets e moderação, para a equipe focar na comunidade.",
    ],
    explica: [
      "Os bots do catálogo ficam na área Comunidade do site. O essencial traz tickets, mensagem de boas-vindas e moderação básica. Existe também uma versão com IA e painel web. Os bots têm uma mensalidade, e a hospedagem (onde o bot fica ligado) é um custo à parte.",
    ],
    dica: "Dica: antes de pedir, liste o que o bot deve fazer quando alguém entra, quando alguém pede ajuda e quando alguém quebra uma regra.",
    relacionados: ["bot-com-ia", "whatsapp-bot", "mensalidade"],
  },
  {
    id: "bot-com-ia",
    vence: true,
    categoria: "sistemas",
    rotulo: "Bot com inteligência artificial",
    frases: ["bot com ia", "bot com inteligência artificial", "bot inteligente", "bot que responde com ia", "colocar ia no bot", "ia no discord", "ia no meu bot", "bot que conversa", "bot com chatgpt", "bot com gpt", "bot com gemini", "quanto custa a ia", "custo da ia", "custo de ia", "ia custa", "usar inteligência artificial no negócio", "usar ia no negócio", "ia para empresa", "ia para pequena empresa"],
    direta: [
      "Um bot com IA usa um modelo de linguagem para entender e responder mensagens livres, e não só comandos fixos. É mais flexível, mas tem custos e limites.",
      "A IA deixa o bot conversar de forma mais natural. Em compensação, ela pode errar, e o uso costuma ser cobrado pelo provedor da IA.",
    ],
    explica: [
      "Pelos Termos, quando há IA, o uso dela é cobrado pelo provedor na sua conta, além do que se paga pelo bot. Como modelos de IA podem inventar respostas, o ideal é limitar o que o bot responde e revisar o que ele diz em assuntos sensíveis. O Assistente Cyl, que está conversando com você agora, não usa IA: é um programa de regras que roda no seu navegador.",
    ],
    dica: "Dica: pense antes se o seu caso pede conversa livre ou se perguntas frequentes com respostas prontas já resolvem. Muitas vezes resolvem.",
    relacionados: ["bot-discord", "assistente-sobre", "mensalidade"],
  },
  {
    id: "whatsapp-bot",
    categoria: "sistemas",
    rotulo: "Robô de atendimento no WhatsApp",
    frases: ["ligar a planilha no whatsapp", "planilha no whatsapp", "integrar planilha com whatsapp", "mandar mensagem automática", "enviar mensagem automática", "automatizar envio de mensagens", "robô de atendimento", "robô de atendimento no whatsapp", "bot de atendimento", "atendimento automatizado", "atendente virtual", "atendente automático", "chatbot para whatsapp", "bot de whatsapp", "bot no whatsapp", "robô de whatsapp", "robô no whatsapp", "chatbot de whatsapp", "chatbot no whatsapp", "atendimento automático no whatsapp", "atendimento automatico no whatsapp", "resposta automática no whatsapp", "mensagem automática no whatsapp", "automatizar whatsapp", "automatizar o whatsapp", "api do whatsapp", "whatsapp business", "whatsapp empresarial", "disparo em massa", "mandar mensagem para todos os clientes"],
    direta: [
      "Robô de atendimento no WhatsApp não está entre os serviços do catálogo deste site, e prefiro ser franco em vez de prometer o que não está lá.",
      "Isso não está no catálogo deste site. Posso explicar o que há por perto, e o Marcelo pode avaliar o seu caso.",
    ],
    explica: [
      "O que existe aqui é o botão de WhatsApp no Site de uma página, que leva o cliente direto para a sua conversa, e as automações em Excel ou Python para organizar dados e mensagens. Automatização oficial do WhatsApp tem regras próprias da plataforma, e disparo em massa para quem não pediu pode levar ao bloqueio do número.",
    ],
    dica: "Dica: se o seu caso é atendimento por WhatsApp, descreva o que você faz hoje e quantas mensagens recebe. Assim o Marcelo diz com clareza o que dá ou não para fazer.",
    servico: "landing",
    relacionados: ["landing-page", "bot-discord", "api"],
  },

  // ===== Como trabalhamos ====================================================================================================
  {
    id: "atendimento-online",
    categoria: "trabalho",
    rotulo: "Atendimento à distância",
    frases: ["atende outra cidade", "atende em outra cidade", "atendem em outra cidade", "atende todo o brasil", "atende o brasil inteiro", "trabalha à distância", "trabalha a distância", "trabalha remoto", "trabalho remoto", "atendimento online", "atendimento presencial", "é presencial", "vem até aqui", "vai até a empresa", "visita na empresa", "reunião online", "reunião presencial", "google meet", "videochamada", "chamada de vídeo", "moro longe", "moro em outra cidade", "moro fora"],
    direta: [
      "Pelo que está publicado no site, o trabalho é feito nos arquivos que você envia, com conversa por WhatsApp, e-mail ou Google Meet, sem precisar acessar o seu computador.",
      "O jeito de trabalhar é à distância: você envia o material, a conversa acontece por mensagem ou videochamada, e o Marcelo trabalha nos arquivos.",
    ],
    explica: [
      "Na conversa pelo Google Meet você pode compartilhar a tela para mostrar a planilha, e quem controla o seu computador é sempre você. Atendimento presencial ou visita à empresa não está descrito no site: se for importante para você, pergunte direto ao Marcelo.",
    ],
    dica: "Dica: se você mora em outra cidade, em geral isso não muda o jeito de trabalhar. Conte o seu caso no formulário ou no WhatsApp para confirmar.",
    servico: undefined,
    relacionados: ["acesso-computador", "proposta-escrita", "horario-resposta"],
  },
  {
    id: "horario-resposta",
    tempoResposta: true,
    vence: true,
    categoria: "trabalho",
    rotulo: "Horário e tempo de resposta",
    frases: ["trabalha aos domingos", "trabalham aos domingos", "trabalha aos sábados", "trabalham aos sábados", "trabalha no fim de semana", "trabalham no fim de semana", "trabalha em feriado", "trabalham em feriado", "atende em feriado", "horário comercial", "horário de atendimento", "horario de atendimento", "qual o horário", "que horas atende", "que horas vocês atendem", "atende aos sábados", "atende aos domingos", "atende no fim de semana", "atende final de semana", "tempo de resposta", "demora para responder", "demora a responder", "quando vão responder", "quando respondem", "responde rápido", "vão me responder", "vai me responder", "mandei mensagem e", "ninguém respondeu"],
    direta: [
      "Não há um horário de atendimento publicado no site, e prefiro não inventar um. O que dá para dizer é isto:",
    ],
    explica: [],
    dica: "Dica: o jeito mais rápido de ser respondido é mandar a mensagem já com o caso explicado: o que você tem hoje, o que quer e para quando.",
    relacionados: ["proposta-escrita", "atendimento-online"],
  },
  {
    id: "proposta-escrita",
    vence: true,
    categoria: "trabalho",
    rotulo: "Como funciona a proposta",
    frases: ["o que é a proposta", "o que é proposta", "o que tem na proposta", "o que vem na proposta", "proposta por escrito", "proposta escrita", "como é a proposta", "preciso assinar", "assinar contrato", "tem contrato", "como fecho", "como fechar", "como aceitar", "aceitar a proposta", "aceite da proposta", "orçamento é final", "valor é final", "valor final", "o orçamento do site é o preço", "enviar o pedido compromete", "enviar o pedido me compromete", "pedido me compromete"],
    direta: [
      "O orçamento do site é uma estimativa. Depois da conversa, o Marcelo manda uma proposta por escrito, e só vale o que estiver nela.",
      "A ordem é: você monta a estimativa, envia o pedido, conversa com o Marcelo, recebe a proposta por escrito e só então decide.",
    ],
    explica: [
      "Enviar o pedido não compromete você: ele só abre a conversa. O contrato começa quando você aceita a proposta por escrito e paga a entrada.",
    ],
    dica: "Dica: leia a proposta com calma e pergunte o que não ficou claro antes de aceitar. Ela é o documento que vale.",
    relacionados: ["horario-resposta", "mensalidade", "sigilo"],
    faqTitulo: ["o valor que o site mostra é o valor final", "enviar o pedido já me compromete"],
  },
  {
    id: "sigilo",
    vence: true,
    categoria: "trabalho",
    rotulo: "Sigilo e confidencialidade",
    frases: ["sigilo", "confidencialidade", "confidencial", "nda", "termo de confidencialidade", "acordo de confidencialidade", "informações sigilosas", "segredo do negócio", "segredo de negócio", "meus dados ficam protegidos", "vão ver meus dados", "alguém mais vê", "você mostra para outros", "mostra o meu trabalho", "usa meu nome", "usar meu nome como cliente", "cliente no portfólio"],
    direta: [
      "O sigilo está nos Termos: tudo o que o Marcelo souber do seu negócio durante o serviço fica em sigilo, durante e depois.",
    ],
    explica: [
      "Sobre mostrar o seu trabalho a outras pessoas, a resposta publicada no site é esta:",
    ],
    faqTitulo: ["você mostra o meu trabalho"],
    dica: "Dica: se a sua empresa exige um termo de confidencialidade próprio, avise antes da proposta. Esse tipo de documento não sai do chat: ele é combinado direto com o Marcelo.",
    relacionados: ["lgpd-planilha", "proposta-escrita"],
  },
  {
    id: "programa-pago",
    vence: true,
    categoria: "trabalho",
    rotulo: "Preciso ter programa pago?",
    frases: ["preciso ter excel", "preciso do excel", "preciso comprar excel", "preciso de licença", "preciso pagar licença", "preciso ter algum programa", "preciso comprar algum programa", "preciso de algum programa", "precisa de programa pago", "tenho que ter excel", "não tenho excel", "não tenho o office", "não tenho office", "office pago", "microsoft 365", "usa libreoffice", "libreoffice", "funciona no celular", "funciona no mac"],
    direta: [
      "Depende do serviço. Segundo as perguntas do site:",
    ],
    explica: [],
    faqTitulo: ["preciso ter algum programa pago"],
    dica: "Dica: diga na conversa o que você usa hoje (Excel, Planilhas Google, outro). O Marcelo explica as opções antes da proposta.",
    servico: "painel",
    relacionados: ["powerbi-ou-excel", "excel-ou-sheets", "proposta-escrita"],
  },
  {
    id: "acesso-computador",
    categoria: "trabalho",
    rotulo: "Precisa acessar meu computador?",
    frases: ["precisa acessar meu computador", "acessar meu computador", "acesso ao meu computador", "acesso remoto", "anydesk", "teamviewer", "compartilhar tela", "mexer no meu computador", "mexer no meu pc", "instalar programa", "instalar algo no meu computador", "entrar no meu computador", "preciso da minha senha", "pede minha senha", "preciso passar senha", "passar senha"],
    direta: [
      "Não. O Marcelo trabalha nos arquivos que você envia, e quem controla o seu computador é sempre você.",
    ],
    explica: [],
    faqTitulo: ["você precisa acessar o meu computador"],
    dica: "Dica: não envie senhas de banco nem de sistemas por mensagem. Isso vale para qualquer prestador.",
    relacionados: ["lgpd-planilha", "atendimento-online", "sigilo"],
  },
  {
    id: "mensalidade",
    vence: true,
    categoria: "trabalho",
    rotulo: "Tem mensalidade?",
    frases: ["tem mensalidade", "tem assinatura", "cobra mensalidade", "cobram mensalidade", "é mensal", "pagar todo mês", "pago todo mês", "plano mensal", "assinatura mensal", "custo mensal", "custos mensais", "tem custo fixo", "tem custo depois", "custos depois", "custo de manutenção", "pagar manutenção", "preciso pagar depois", "custos escondidos", "taxas escondidas", "tem taxa extra", "tem taxa", "taxa extra", "cobrança extra", "cobranças extras"],
    direta: [
      "A mensalidade existe para os bots de Discord (com a hospedagem à parte, como custo seu). Nos serviços de Negócios, o valor vem da proposta por escrito do projeto.",
      "Mensalidade é coisa dos bots da Comunidade. Para os serviços de Negócios, o que vale é o que estiver na proposta, e custo extra só aparece se você pedir algo além dela.",
    ],
    explica: [
      "O que pode aparecer além do combinado: hora de ajuste fora da proposta (sempre com o valor avisado antes de começar) e custos de terceiros, como domínio, hospedagem ou uso de IA, que ficam na sua conta. O Marcelo explica isso antes da proposta, e nada deve ser cobrado sem estar escrito.",
    ],
    dica: "Dica: na hora da proposta, pergunte \"o que pode custar a mais depois?\". É uma boa pergunta, e merece resposta por escrito.",
    relacionados: ["proposta-escrita", "bot-discord", "dominio-hospedagem"],
  },
  {
    id: "orcamento-apertado",
    vence: true,
    categoria: "trabalho",
    rotulo: "Quero gastar o mínimo",
    frases: ["tenho pouco dinheiro", "pouco dinheiro", "sem dinheiro", "orçamento apertado", "orçamento baixo", "orçamento limitado", "verba pequena", "verba curta", "não tenho muito", "não posso gastar muito", "quero gastar pouco", "quero gastar o mínimo", "quero pagar menos", "dá para pagar menos", "dá para ser mais barato", "tem opção mais em conta", "tem algo mais em conta", "mais em conta", "caber no bolso", "cabe no bolso", "negociar", "negociar o preço", "posso negociar", "faz por menos", "abaixar o preço", "reduzir o preço"],
    direta: [
      "Entendo, e dá para começar pequeno. O caminho mais comum é pedir só o pacote básico do que mais dói hoje e deixar o resto para depois.",
      "Quando o orçamento é curto, o melhor é escolher a parte do problema que mais custa tempo ou dinheiro e resolver só ela primeiro.",
    ],
    explica: [
      "Os preços de partida de cada serviço estão no site, e o valor justo é o que a proposta traz depois da conversa. Pedir mais de um serviço junto pode render desconto, e há vagas de piloto quando estiverem abertas. Sobre negociar o valor, isso é conversa direta com o Marcelo, e não algo que eu possa prometer por aqui.",
    ],
    dica: "Dica: no orçamento do site, tire as opções que não são essenciais e veja como o valor muda. Dá para montar versões diferentes até achar a que cabe.",
    relacionados: ["proposta-escrita", "mensalidade"],
  },
  {
    id: "servico-pequeno",
    servicosChips: ["planilha", "painel", "automacao", "python"],
    categoria: "trabalho",
    rotulo: "Ajuda pontual ou dúvida rápida",
    frases: ["só uma dúvida", "uma dúvida rápida", "dúvida pontual", "ajuda pontual", "ajuda rápida", "preciso de ajuda com uma fórmula", "me ajuda com uma fórmula", "me ajuda com minha planilha", "ajuda com minha planilha", "ajuda com a minha planilha", "ajuda com uma planilha", "ajuda no excel", "ajuda com excel", "ajuda com o excel", "preciso de ajuda no excel", "serviço pequeno", "coisa pequena", "consertar planilha", "arrumar fórmula", "arrumar a fórmula", "corrigir fórmula", "corrigir planilha", "ajustar planilha", "ajustar minha planilha"],
    direta: [
      "Posso orientar em dúvidas gerais por aqui. Se for algo no seu arquivo, o jeito de resolver é o Marcelo olhar a planilha, e isso entra como serviço.",
      "Por aqui eu explico conceitos. Para mexer no seu arquivo (corrigir uma fórmula, organizar uma aba), a ajuda é o serviço de planilha.",
    ],
    explica: [
      "O que você precisa é de uma ajuda do tipo \"organizar\", \"calcular\", \"automatizar\" ou \"montar um painel\"? Escolhendo uma das opções, eu mostro o serviço mais próximo, o preço de partida e como pedir.",
    ],
    dica: "Dica: se for pequeno, diga isso no pedido. O orçamento mostra quanto cada resposta pesa no valor.",
    servico: "planilha",
    relacionados: ["planilha-organizada", "funcao-se", "procv"],
  },
  {
    id: "fora-do-catalogo",
    categoria: "trabalho",
    rotulo: "O que não está no catálogo",
    frases: ["preciso de um sistema de agendamento", "quero um sistema de agendamento", "site com carrinho", "site com carrinho de compras", "carrinho de compras", "vender online pelo site", "pagamento no site", "site com pagamento online", "vocês fazem aplicativo", "faz aplicativo", "faz app", "fazem app", "faz loja virtual", "fazem loja virtual", "faz e-commerce", "faz site com várias páginas", "site completo", "site com várias páginas", "site institucional", "faz blog", "faz sistema de agendamento", "sistema de agendamento", "app de delivery", "faz jogo", "faz design", "faz logo", "faz logotipo", "faz identidade visual", "faz tráfego pago", "gerencia redes sociais", "gestão de redes sociais", "faz edição de vídeo", "faz notion", "trabalha com notion", "trabalha com airtable", "trabalha com access", "trabalha com sap", "trabalha com erp", "o que vocês não fazem", "o que você não faz"],
    direta: [
      "Cada coisa tem seu jeito. O que está no catálogo é: planilhas organizadas, painéis, automações em Excel e Python, site de uma página, sistema sob medida e bots de Discord.",
      "Para ser transparente: o que o site oferece é o catálogo de serviços (planilhas, painéis, automações, site de uma página, sistemas sob medida e bots). O que sai disso precisa ser avaliado pelo Marcelo.",
    ],
    explica: [
      "Aplicativo de celular, loja virtual, redes sociais, design, anúncios e vídeo não estão no catálogo. Sistemas maiores ou integrações são avaliados caso a caso. Prefiro dizer isso a deixar você esperando um preço que não existe.",
    ],
    dica: "Dica: se o seu pedido está num meio-termo (por exemplo, um site com poucas páginas), conte o caso. Às vezes o que parece fora do catálogo se resolve com um serviço próximo.",
    servico: "sistema",
    relacionados: ["quando-planilha-nao-basta", "landing-page", "api"],
  },
  {
    id: "congelar-paineis",
    categoria: "excel",
    rotulo: "Travar a primeira linha (congelar painéis)",
    frases: ["travar a primeira linha", "travar primeira linha", "travar o cabeçalho", "fixar o cabeçalho", "fixar cabeçalho", "fixar a primeira linha", "congelar painéis", "congelar paineis", "congelar linha", "congelar a primeira linha", "congelar coluna", "cabeçalho some quando rolo", "cabeçalho sumindo", "cabeçalho some ao rolar", "manter o cabeçalho visível", "deixar o título fixo"],
    direta: [
      "Para manter o cabeçalho sempre visível ao rolar a planilha, use Exibir > Congelar Painéis (e escolha congelar a linha superior ou a primeira coluna).",
      "O recurso se chama congelar painéis: ele prende a primeira linha (ou coluna) no lugar enquanto o resto da planilha rola.",
    ],
    explica: [
      "Dá para congelar só a linha de cima, só a primeira coluna ou as duas ao mesmo tempo, escolhendo a célula logo abaixo e à direita do que quer prender. No Planilhas Google, o caminho é Ver > Congelar.",
    ],
    dica: "Dica: se o cabeçalho tem mais de uma linha, selecione a primeira célula abaixo delas antes de congelar. Para desfazer, use a mesma opção (Descongelar).",
    servico: "planilha",
    relacionados: ["planilha-organizada", "atalhos-excel", "celulas-mescladas"],
  },
  {
    id: "cadastro-clientes",
    categoria: "dados",
    rotulo: "Organizar clientes e vendas",
    frases: ["organizar clientes", "organizar meus clientes", "cadastro de clientes", "lista de clientes", "controle de clientes", "planilha de clientes", "acompanhar clientes", "acompanhar vendas", "controle de vendas", "planilha de vendas", "funil de vendas", "crm simples", "crm na planilha", "agenda de clientes", "histórico de clientes", "controlar clientes", "controlar vendas"],
    direta: [
      "Um cadastro de clientes que funciona tem uma linha por cliente e poucas colunas essenciais: nome, contato, origem, situação (novo, em conversa, fechado) e data do último contato.",
      "Para organizar clientes e vendas numa planilha, o segredo é separar duas listas: uma de clientes e outra de vendas (ou contatos), ligadas por um código ou nome padronizado.",
    ],
    explica: [
      "Com a situação escolhida numa lista suspensa e a data do último contato registrada, dá para filtrar quem precisa de retorno e destacar com cor quem está sem contato há tempo. Um painel simples mostra quantos clientes há em cada etapa e quanto foi vendido no mês.",
    ],
    passos: [
      "Uma aba de clientes (uma linha por pessoa ou empresa) e outra de vendas ou atendimentos.",
      "Situação e origem escolhidas em lista suspensa, para não virar texto livre.",
      "Data do último contato e do próximo passo, com cor quando estiver atrasado.",
      "Resumo por situação e por mês em outra aba.",
    ],
    dica: "Dica: guarde só os dados de que precisa. Quanto menos dado pessoal na planilha, menor o risco.",
    servico: "planilha",
    relacionados: ["lista-suspensa", "formatacao-condicional", "lgpd-planilha"],
  },
  {
    id: "desconto-especial",
    categoria: "trabalho",
    rotulo: "Desconto para estudante, à vista ou cupom",
    vence: true,
    frases: ["desconto para estudante", "desconto pra estudante", "desconto de estudante", "desconto para aluno", "desconto para ong", "desconto para mei", "desconto à vista", "desconto a vista", "desconto no pix", "desconto por indicação", "indicação ganha desconto", "cupom", "cupom de desconto", "código de desconto", "desconto para amigo", "desconto para cliente antigo", "desconto para quem já é cliente", "tem promoção", "está em promoção", "black friday"],
    direta: [
      "No site, os descontos publicados são o combo (juntando serviços combináveis) e, quando há vagas abertas, o desconto de piloto. Fora esses, eu não tenho como prometer nenhum outro.",
      "Descontos além dos que o site mostra (estudante, à vista, cupom, indicação) não estão publicados, e eu não posso prometê-los por aqui.",
    ],
    explica: [
      "Se o seu caso é especial, conte na conversa com o Marcelo: pedir é livre, mas o que vale é o que ficar escrito na proposta.",
    ],
    dica: "Dica: o carrinho do site aplica sozinho o desconto de combo ou de piloto, o que for maior em reais.",
    relacionados: ["orcamento-apertado", "proposta-escrita"],
  },
  {
    id: "algo-parou",
    categoria: "trabalho",
    rotulo: "Algo que foi entregue parou ou deu erro",
    vence: true,
    frases: ["meu site não carrega", "meu site caiu", "site fora do ar", "meu site está fora do ar", "a planilha parou de funcionar", "parou de funcionar", "parou de funcionar depois", "a automação parou", "o script parou", "o painel parou", "deu erro depois da entrega", "deu problema depois", "apareceu um bug", "achei um bug", "encontrei um erro", "achei um erro no que", "não está funcionando", "não esta funcionando", "quebrou", "o bot caiu", "o bot parou", "bot não responde"],
    direta: [
      "Sinto pelo transtorno. Se o problema está em algo que o Marcelo entregou, a regra é esta, do jeito que está no site:",
      "Vamos por partes. Se é algo entregue pelo Marcelo e que deixou de funcionar como a proposta descrevia, vale o que está escrito sobre defeitos:",
    ],
    explica: [],
    faqTitulo: ["e se aparecer um defeito", "e se eu quiser uma mudança"],
    dica: "Dica: para agilizar, mande pelo WhatsApp uma descrição do que acontece, desde quando e um print da tela. Eu não consigo diagnosticar por aqui, mas o Marcelo avalia com essas informações.",
    relacionados: ["horario-resposta", "proposta-escrita", "backup-planilha"],
  },
  {
    id: "calculos-basicos",
    categoria: "excel",
    rotulo: "Porcentagem, média e outros cálculos",
    frases: ["calcular porcentagem", "como calcular porcentagem", "porcentagem no excel", "calcular percentual", "calcular média", "como calcular média", "média no excel", "calcular a média", "calcular desconto", "calcular variação", "variação percentual", "aumento percentual", "calcular crescimento", "calcular juros", "juros compostos", "calcular total", "somar coluna", "somar uma coluna", "como somar no excel", "como subtrair no excel", "como multiplicar no excel", "como dividir no excel", "arredondar no excel", "arredondar números"],
    direta: [
      "Os cálculos básicos do Excel começam sempre com o sinal de igual. Para porcentagem, divida a parte pelo total; para média, use MÉDIA; para somar uma coluna, use SOMA.",
      "A maioria das contas do dia a dia usa quatro ou cinco fórmulas simples. Estas são as mais usadas:",
    ],
    explica: [],
    passos: [
      "Soma e média: =SOMA(B2:B20) e =MÉDIA(B2:B20).",
      "Porcentagem de um total: =parte/total, e depois formate a célula como porcentagem.",
      "Variação percentual: =(novo - antigo)/antigo.",
      "Aplicar um desconto: =preço * (1 - desconto), com o desconto numa célula própria.",
      "Arredondar: ARRED(valor; casas decimais).",
      "Juros compostos: valor final = valor inicial * (1 + taxa) elevado ao número de períodos.",
    ],
    dica: "Dica: guarde taxas e percentuais em células separadas, com um nome claro, e aponte as fórmulas para elas. Assim, mudar a taxa não obriga a refazer nada. Para cálculos financeiros importantes, confira com um contador.",
    servico: "planilha",
    relacionados: ["somase", "ref-absoluta", "erros-excel"],
  },
  {
    id: "datas-horas",
    categoria: "excel",
    rotulo: "Datas e horas no Excel",
    frases: ["somar horas", "como somar horas", "soma de horas", "horas passam de vinte e quatro", "somar horas no excel", "diferença entre datas", "diferença entre duas datas", "calcular dias entre datas", "dias entre duas datas", "calcular prazo", "dias úteis no excel", "dias úteis entre datas", "calcular idade", "calcular tempo de empresa", "data virou número", "data virou texto", "data errada", "formato de data", "formatar data", "formatar hora", "datadif"],
    direta: [
      "Para o Excel, data e hora são números: a data é a contagem de dias e a hora é uma fração do dia. Por isso dá para subtrair uma data da outra e somar horas, desde que a célula esteja no formato certo.",
      "Contas com data e hora funcionam bem quando a célula tem mesmo uma data ou hora, e não um texto parecido com uma.",
    ],
    explica: [],
    passos: [
      "Dias entre duas datas: subtraia (data final - data inicial) e formate o resultado como número.",
      "Dias úteis: a função DIATRABALHOTOTAL conta só os dias de trabalho e aceita uma lista de feriados.",
      "Idade ou tempo de casa: DATADIF com \"Y\", \"M\" ou \"D\" mostra anos, meses ou dias completos.",
      "Somar horas que passam de um dia: formate a célula como [h]:mm, com os colchetes, para o total não \"zerar\" depois de vinte e quatro horas.",
      "Data que não calcula: provavelmente é texto. Use Texto para Colunas ou a função DATA para converter.",
    ],
    dica: "Dica: ao importar planilhas de sistemas, as datas costumam chegar como texto. Teste com uma subtração simples antes de montar relatórios em cima delas.",
    servico: "planilha",
    relacionados: ["separar-texto", "csv-acentos", "erros-excel"],
  },
  {
    id: "filtros-ordenar",
    categoria: "excel",
    rotulo: "Filtrar e ordenar dados",
    frases: ["filtro avançado", "como filtrar", "filtrar dados", "filtrar por cor", "filtro por cor", "ordenar dados", "classificar dados", "ordenar por data", "ordem alfabética", "ordenar por mais de uma coluna", "filtro não pega tudo", "filtro pega só até", "filtro cortando linhas", "segmentação de dados", "filtrar duas colunas"],
    direta: [
      "Filtrar esconde as linhas que você não quer ver; ordenar muda a ordem delas. Os dois ficam na aba Dados (e o atalho Ctrl + Shift + L liga os filtros).",
      "Para ver só parte dos dados, use o filtro; para reorganizar, use classificar. Os dois funcionam melhor com os dados em formato de lista.",
    ],
    explica: [
      "Se o filtro \"não pega tudo\", quase sempre há uma linha ou coluna em branco no meio dos dados, que o Excel entende como o fim da lista. Para ordenar por mais de uma coluna, use Classificar e adicione os níveis (por exemplo, categoria e depois data). O Filtro Avançado permite regras mais elaboradas, como combinar critérios de várias colunas, e copiar o resultado para outro lugar.",
    ],
    dica: "Dica: transforme os dados em tabela (Ctrl + T) antes de filtrar. A tabela cresce sozinha e os filtros acompanham os dados novos.",
    servico: "planilha",
    relacionados: ["planilha-organizada", "celulas-mescladas", "tabela-dinamica"],
  },
  {
    id: "usam-ia",
    categoria: "trabalho",
    rotulo: "O Marcelo usa IA no trabalho?",
    vence: true,
    frases: ["vocês usam ia", "vocês usam inteligência artificial", "vocês usam o chatgpt", "usa ia para fazer", "usa ia no trabalho", "usa inteligência artificial no trabalho", "o trabalho é feito por ia", "o trabalho é feito com ia", "é feito com ia", "é feito por ia", "feito por inteligência artificial", "usam chatgpt para fazer", "o marcelo usa ia", "o marcelo usa chatgpt", "ia mexe nos meus dados", "colocam meus dados no chatgpt", "meus dados vão para a ia", "meus dados no chatgpt"],
    direta: [
      "Como o Marcelo faz o trabalho por dentro, com quais ferramentas, não está descrito no site, e prefiro não afirmar nada que eu não saiba.",
    ],
    explica: [
      "O que está escrito nos Termos, e vale para qualquer ferramenta, é sobre os seus dados: ele usa os dados só para fazer o serviço contratado, guarda em sigilo e, se o serviço precisar de alguma ferramenta de terceiros que receba os dados, avisa antes e só usa com o seu ok.",
    ],
    dica: "Dica: se você tem uma preocupação específica (por exemplo, não quer que os seus dados passem por nenhuma ferramenta externa), diga isso antes da proposta, para ficar combinado por escrito.",
    relacionados: ["lgpd-planilha", "sigilo", "assistente-sobre"],
  },
  {
    id: "assistente-sobre",
    vence: true,
    categoria: "trabalho",
    rotulo: "Você é uma IA de verdade?",
    frases: ["qual o seu nome", "qual seu nome", "como você se chama", "como se chama", "você tem nome", "você é o marcelo", "você é o marcelo mesmo", "é o marcelo que responde", "o marcelo responde aqui", "quem responde aqui", "quem está respondendo", "quem está falando comigo", "você é uma ia", "voce é uma ia", "você é ia", "você é um robô", "você é um bot", "você é um programa", "você é humano", "você é uma pessoa", "você é uma pessoa de verdade", "é uma pessoa de verdade que responde", "tem alguém aí", "tem alguém ai", "tem humano aí", "estou falando com uma máquina", "estou falando com um robô", "falando com robô", "falando com uma máquina", "você pensa", "você aprende", "você é inteligente", "usa inteligência artificial", "usa ia", "usa chatgpt", "é o chatgpt", "é chatgpt", "é gpt", "é o gemini", "é o claude", "que modelo você é", "qual modelo você usa", "como você funciona", "como você foi feito", "quem te criou", "quem te fez", "quem fez você", "quem programou você", "você lembra de mim", "você guarda minha conversa", "guarda minha conversa", "guardam minha conversa", "essa conversa fica salva", "conversa é gravada", "alguém lê isso", "o marcelo lê isso", "marcelo vê a conversa"],
    direta: [
      "Sou o Assistente Cyl, um assistente de regras, e não uma inteligência artificial de verdade. Fui escrito para este site e funciono com respostas e regras preparadas, que rodam no seu navegador.",
      "Não sou uma pessoa nem uma IA generativa: sou um programa de regras, feito para responder sobre os serviços do site e sobre alguns temas de planilhas e automação.",
    ],
    explica: [
      "Isso tem um lado bom e um limite. O bom: respondo sempre com o que está escrito, os valores vêm do próprio site e não invento preço nem prazo. O limite: se a pergunta fugir do que foi preparado, eu não \"raciocino\" por conta própria; aí encaminho para o Marcelo, que é uma pessoa de verdade.",
      "Sobre a sua conversa: ela fica só na memória desta aba, neste aparelho. Não é enviada nem guardada, e some quando você recarrega a página ou usa o botão de nova conversa. Por isso o Marcelo não vê o que você escreve aqui; para ele receber algo, é preciso enviar o pedido ou chamar no WhatsApp.",
    ],
    dica: "Dica: quanto mais direta a pergunta (\"quanto custa um painel?\", \"como funciona o pagamento?\"), melhor eu respondo.",
    relacionados: ["horario-resposta", "bot-com-ia", "proposta-escrita"],
  },
];

export const topicoPorId = (id: string): Topico | undefined => topicos.find((t) => t.id === id);

/** Textos fixos do mecanismo de tópicos. Nada de número aqui. */
export const saber = {
  /** Ponte para o serviço: o preço de partida chega por parâmetro, vindo de servicos.ts. */
  ponte: (nome: string, preco: string) => `Se preferir que o Marcelo faça isso no seu arquivo, o serviço que mais se encaixa é ${nome} (${preco}).`,
  ponteSemPreco: (nome: string) => `Se preferir que o Marcelo cuide disso, o serviço mais próximo é ${nome}.`,
  perguntas: [
    "Quer que eu detalhe mais, ou prefere ver outro assunto?",
    "Isso ajudou? Posso aprofundar ou mostrar um exemplo.",
    "Ficou alguma dúvida nesse ponto?",
    "Quer ver um exemplo do dia a dia, ou seguimos para outro assunto?",
  ],
  perguntaComServico: [
    "Quer ver o que o serviço inclui, ou seguimos com mais dicas?",
    "Posso mostrar o que está incluso no serviço ou continuar nas dicas. O que prefere?",
  ],
  relacionados: "Assuntos parecidos:",
  outrosAssuntos: "Também falo sobre:",
  obrigados: ["Imagina! Qualquer coisa, é só chamar.", "Fico feliz em ajudar 😊 Se surgir outra dúvida, estou por aqui.", "Por nada! Se quiser seguir para outro assunto, é só falar."],
  tchaus: ["Até logo! Qualquer dúvida, o Assistente Cyl fica por aqui.", "Até logo! Boa sorte com a sua planilha, o seu site ou o que for.", "Tchau! Quando quiser, é só abrir o chat de novo."],
  /** "ok", "beleza", "show" quando não havia nada pendente. */
  confirmaNeutra: ["Combinado! Se quiser seguir, é só dizer o que mais precisa.", "Perfeito. Fico por aqui para o que precisar.", "Tudo certo! Quer ver mais algum assunto?"],
  maisEmPassos: "Dito em passos curtos:",
  semMais: "Esse assunto eu já expliquei por inteiro. Posso mostrar um exemplo, ou falar de algo parecido.",
  semExemplo: "Não tenho um exemplo guardado para esse assunto, mas posso explicar de outro jeito ou mostrar assuntos parecidos.",
  rotuloExemplo: "Me dá um exemplo",
  rotuloMais: "Explica melhor",
  rotuloVerServico: (nome: string) => `Ver: ${nome}`,
  /** Menu geral de assuntos. */
  menuIntro: "Posso conversar sobre estes grupos de assuntos. Escolha um para ver os tópicos:",
  menuPergunta: "Qual deles ajuda mais agora?",
  categoriaIntro: (rotulo: string) => `${rotulo}: escolha o tópico que quer ver.`,
  categoriaPergunta: "Qual deles?",
  rotuloMenu: "Ver todos os assuntos",
  rotuloOutroAssunto: "Outro assunto",
  /** Resposta de dúvida de Excel/desenvolvimento que o chat não tem pronta. Honesta e com saída. */
  semTopico:
    "Essa dúvida específica eu não tenho preparada, e prefiro não responder no chute. Posso falar de fórmulas e atalhos do Excel, organização de dados, painéis, automação, sites e como o Marcelo trabalha.",
  semTopicoPergunta: "Por qual desses grupos quer começar?",
  /** Pedido de código pronto, exercício ou aula: o chat não faz. */
  pedeCodigo:
    "Não escrevo código nem resolvo exercícios por aqui: sou um assistente de regras, e não uma IA que gera programas. O que consigo é explicar o conceito, dizer quando uma ferramenta serve, e, se for para o seu negócio, o Marcelo pode fazer isso como serviço.",
  pedeCodigoPergunta: "Quer que eu explique o conceito, ou prefere ver o serviço que resolve isso?",
  /** Ajuda com Excel sem dizer o quê. */
  excelGeral:
    "Claro, posso ajudar! Para eu apontar o caminho certo, me diga o que você quer resolver com a planilha.",
  excelGeralPergunta: "Qual destas é mais parecida com o seu caso?",
  confirmaSim: [
    "Combinado!",
    "Perfeito, vamos lá.",
    "Certo, já mostro.",
  ],
  recusaSimpatica: [
    "Tudo bem, sem pressa. Se quiser, posso mostrar outro assunto.",
    "Sem problema! Se mudar de ideia, é só chamar.",
    "Entendi. Posso ajudar com outro assunto, se quiser.",
  ],
  simSemProposta: "Pode me dizer o que quer ver? Posso falar de serviços, preços, prazos, pagamento ou de dicas de planilhas e automação.",
  /** Esclarecimentos. */
  esclarecer: {
    preco: "Para eu dizer o preço certo, de qual serviço você quer saber?",
    servico: "Qual serviço você tem em mente?",
  },
} as const;
