// Perguntas do orçamento base do "Sistema sob medida", em árvore: cada opção pode abrir até 2 perguntas
// de aprofundamento (e elas, mais 2), no máximo 2 níveis abaixo da principal. Os limites são conferidos por teste.
//
// PENDENTE: todas as horas abaixo são PROPOSTAS provisórias, a confirmar pelo Marcelo (docs/DECISOES.md).
// Cada hora extra soma VALOR_HORA_EXTRA ao preço. O preço base (HORAS_BASE_SISTEMA)
// fica em servicos.ts. Sem teto: o valor é "a partir de" e cresce com as respostas.
// Só este arquivo guarda os números: nenhum componente os repete.
import type { Pergunta } from "./perguntas";

// Perguntas filhas (cada uma é aberta por uma ou mais opções da pai) ---------------------------------

const cobranca: Pergunta = {
  id: "cobranca",
  texto: "Como o sistema será cobrado dos clientes?",
  curto: "Cobrança",
  tipo: "unica",
  opcoes: [
    { id: "mensal", rotulo: "Mensalidade (assinatura)", horas: 2 },
    { id: "uso", rotulo: "Pelo uso", ajuda: "O cliente paga conforme quanto usa, por exemplo por pedido ou por consulta.", horas: 3 },
    { id: "unica", rotulo: "Uma vez só", horas: 0 },
    { id: "nao-sei", rotulo: "Ainda não sei", ajuda: "Tudo bem: o tipo a gente decide na conversa.", horas: 0 },
  ],
  ajuda: "É como você vai receber dos seus clientes pelo sistema. Assinatura exige controlar quem pagou e quem atrasou, e isso muda o valor.",
};

const tiposDeUsuario: Pergunta = {
  id: "tipos-usuario",
  texto: "Quantos tipos de usuário o sistema terá?",
  curto: "Tipos de usuário",
  tipo: "unica",
  opcoes: [
    { id: "um", rotulo: "Um só tipo", horas: 0 },
    { id: "dois", rotulo: "Dois tipos (por exemplo, cliente e administrador)", horas: 2 },
    { id: "tres", rotulo: "Três ou mais", horas: 4 },
    { id: "nao-sei", rotulo: "Não sei", horas: 0 },
  ],
  ajuda: "Cada tipo de usuário vê e faz coisas diferentes: o dono vê tudo, o cliente vê só o dele. Quanto mais tipos, mais regras de acesso, e isso muda o valor.",
};

const ondeRoda: Pergunta = {
  id: "onde-roda",
  texto: "Onde o aplicativo vai rodar?",
  curto: "Onde roda",
  tipo: "unica",
  opcoes: [
    { id: "navegador", rotulo: "No navegador", ajuda: "Abre por um endereço na internet, sem instalar nada.", horas: 0 },
    { id: "celular", rotulo: "No celular", ajuda: "Aplicativo instalado no aparelho.", horas: 4 },
    { id: "os-dois", rotulo: "No celular e no navegador", horas: 8 },
    { id: "nao-sei", rotulo: "Não sei", horas: 0 },
  ],
  ajuda: "No navegador, abre por um endereço, sem instalar nada. No celular, é um aplicativo instalado, e fazer os dois dá mais trabalho.",
};

const semInternet: Pergunta = {
  id: "sem-internet",
  texto: "Precisa funcionar sem internet?",
  curto: "Sem internet",
  tipo: "unica",
  opcoes: [
    { id: "nao", rotulo: "Não, sempre com internet", horas: 0 },
    { id: "sim", rotulo: "Sim, precisa funcionar sem internet", horas: 6 },
    { id: "nao-sei", rotulo: "Não sei", horas: 0 },
  ],
  ajuda: "Funcionar sem internet exige guardar os dados no aparelho e sincronizar depois. É mais trabalho, e isso muda o valor.",
};

const login: Pergunta = {
  id: "login",
  texto: "Precisa de login (usuário e senha)?",
  curto: "Login",
  tipo: "unica",
  opcoes: [
    { id: "nao", rotulo: "Não", horas: 0 },
    { id: "sim", rotulo: "Sim", horas: 3 },
  ],
  ajuda: "Com login, cada pessoa entra com a sua conta e só vê o que é dela.",
};

const cadastro: Pergunta = {
  id: "cadastro",
  texto: "Precisa de cadastro com e-mail?",
  curto: "Cadastro com e-mail",
  tipo: "unica",
  opcoes: [
    { id: "nao", rotulo: "Não", horas: 0 },
    { id: "sim", rotulo: "Sim", horas: 2 },
  ],
  ajuda: "A própria pessoa cria a conta e confirma o e-mail.",
};

const meioDePagamento: Pergunta = {
  id: "meio-pagamento",
  texto: "Qual meio de pagamento você já usa?",
  curto: "Meio de pagamento",
  tipo: "unica",
  opcoes: [
    { id: "mercado-pago", rotulo: "Mercado Pago", ajuda: "Empresa que recebe o pagamento do cliente e avisa o sistema.", horas: 0 },
    { id: "stripe", rotulo: "Stripe", ajuda: "Empresa internacional que recebe o pagamento do cliente, muito usada para cartão e assinatura.", horas: 0 },
    { id: "banco", rotulo: "Banco ou maquininha", horas: 0 },
    { id: "nenhum", rotulo: "Ainda nenhum", horas: 2 },
  ],
  ajuda: "É a empresa que recebe o dinheiro do cliente e avisa o sistema. Se você ainda não tem, eu ajudo a escolher e a abrir a conta, e isso muda o valor.",
};

const notaFiscal: Pergunta = {
  id: "nota-fiscal",
  texto: "Precisa emitir nota fiscal?",
  curto: "Nota fiscal",
  tipo: "unica",
  opcoes: [
    { id: "nao", rotulo: "Não", horas: 0 },
    { id: "sim", rotulo: "Sim", horas: 4 },
    { id: "nao-sei", rotulo: "Não sei", horas: 0 },
  ],
  ajuda: "Emitir nota pelo sistema depende do seu contador e do município. Eu confirmo o caminho na conversa.",
};

const quaisSistemas: Pergunta = {
  id: "quais-sistemas",
  texto: "Com quais sistemas ele precisa conversar?",
  curto: "Quais sistemas",
  tipo: "multipla",
  gratis: 1,
  horasPorExtra: 2,
  opcoes: [
    { id: "planilha", rotulo: "Planilha (Excel ou Google)" },
    { id: "erp", rotulo: "Sistema de gestão (ERP)" },
    { id: "loja", rotulo: "Loja virtual" },
    { id: "banco", rotulo: "Banco de dados que já existe" },
    { id: "outro", rotulo: "Outro" },
  ],
  ajuda: "Marque todos os que se aplicam. O primeiro está incluso; cada um a mais é trabalho extra, e a tela mostra quanto.",
};

const acessoApi: Pergunta = {
  id: "acesso-api",
  texto: "Você tem acesso à API deles?",
  curto: "Acesso à API",
  tipo: "unica",
  opcoes: [
    { id: "sim", rotulo: "Sim", horas: 0 },
    { id: "nao", rotulo: "Não", horas: 3 },
    { id: "nao-sei", rotulo: "Não sei o que é", horas: 2 },
  ],
  ajuda: "API é a porta que o outro sistema abre para conversar com o seu. Sem acesso, eu preciso procurar outro caminho, e isso muda o valor.",
};

const quaisRelatorios: Pergunta = {
  id: "quais-relatorios",
  texto: "Quais relatórios?",
  curto: "Relatórios",
  tipo: "multipla",
  gratis: 1,
  horasPorExtra: 2,
  opcoes: [
    { id: "vendas", rotulo: "Vendas" },
    { id: "financeiro", rotulo: "Financeiro" },
    { id: "uso", rotulo: "Uso do sistema" },
    { id: "outro", rotulo: "Outro" },
  ],
  ajuda: "O primeiro relatório está incluso; cada um a mais é trabalho extra, e a tela mostra quanto.",
};

const exportar: Pergunta = {
  id: "exportar",
  texto: "Precisa exportar para Excel ou PDF?",
  curto: "Exportar",
  tipo: "unica",
  opcoes: [
    { id: "nao", rotulo: "Não", horas: 0 },
    { id: "excel", rotulo: "Para Excel", horas: 1 },
    { id: "pdf", rotulo: "Para PDF", horas: 1 },
    { id: "os-dois", rotulo: "Para os dois", horas: 2 },
  ],
  ajuda: "É um botão que baixa o relatório pronto, em Excel ou PDF. Cada formato é um pouco de trabalho a mais.",
};

const tipoDeDado: Pergunta = {
  id: "tipo-dado",
  texto: "Que tipo de dado sensível?",
  curto: "Tipo de dado",
  tipo: "multipla",
  gratis: 1,
  horasPorExtra: 1,
  opcoes: [
    { id: "saude", rotulo: "Saúde" },
    { id: "documentos", rotulo: "Documentos pessoais (CPF, RG)" },
    { id: "financeiro", rotulo: "Dados financeiros" },
    { id: "outro", rotulo: "Outro" },
  ],
  ajuda: "Marque os que o sistema vai guardar. O primeiro está incluso; cada um a mais pede mais cuidado, e a tela mostra quanto.",
};

const politicaPrivacidade: Pergunta = {
  id: "politica",
  texto: "Precisa de política de privacidade e termos de uso?",
  curto: "Política e termos",
  tipo: "unica",
  opcoes: [
    { id: "nao", rotulo: "Não", horas: 0 },
    { id: "sim", rotulo: "Sim, um texto-base", horas: 2 },
    { id: "nao-sei", rotulo: "Não sei", horas: 0 },
  ],
  ajuda: "Eu monto um texto-base com você. Não é parecer jurídico: para valer como contrato, vale uma revisão de quem entende de lei.",
};

// Perguntas principais -----------------------------------------------------------------------------

export const perguntasSistema: Pergunta[] = [
  {
    id: "tipo",
    texto: "Que tipo de sistema você imagina?",
    curto: "Tipo de sistema",
    tipo: "unica",
    opcoes: [
      { id: "saas", rotulo: "SaaS (clientes pagam uma assinatura)", ajuda: "SaaS é um sistema na internet que várias empresas ou pessoas usam, cada uma com a sua conta, pagando uma assinatura. Exige controle de contas e de cobrança. Um site com banco de dados que só você administra não é SaaS.", horas: 8, abre: [cobranca, tiposDeUsuario] },
      { id: "site-logado", rotulo: "Site com área logada", ajuda: "Um site comum que tem uma parte restrita: a pessoa entra com usuário e senha e vê só o que é dela.", horas: 4 },
      { id: "aplicativo", rotulo: "Aplicativo", ajuda: "Programa feito para usar no celular, no navegador ou nos dois, com telas próprias e dados guardados.", horas: 6, abre: [ondeRoda, semInternet] },
      { id: "programa", rotulo: "Programa de computador", ajuda: "Um programa que se instala no Windows, sem depender de endereço na internet para abrir.", horas: 4 },
      { id: "nao-sei", rotulo: "Ainda não sei", ajuda: "Tudo bem: o tipo a gente decide na conversa.", horas: 0 },
    ],
    ajuda:
      "SaaS é um sistema que você vende por assinatura. Site com área logada tem uma parte só para quem entra com conta. Aplicativo roda no celular ou no navegador. Programa de computador se instala no PC. “Ainda não sei” não muda o valor: a gente decide na conversa.",
  },
  {
    id: "usuarios",
    texto: "Quem vai usar?",
    curto: "Quem usa",
    tipo: "unica",
    opcoes: [
      { id: "equipe", rotulo: "Só eu e a minha equipe", ajuda: "Poucas pessoas conhecidas, sem cadastro aberto ao público.", horas: 0 },
      { id: "clientes", rotulo: "Os meus clientes", ajuda: "Pessoas que você escolhe e libera; cada uma entra com a sua conta.", horas: 2, abre: [login, cadastro] },
      { id: "publico", rotulo: "Qualquer pessoa (público aberto)", ajuda: "Qualquer um pode acessar ou criar conta. Exige mais cuidado com segurança.", horas: 3, abre: [login, cadastro] },
    ],
    ajuda: "Sistema só para a equipe é mais simples. Para clientes ou para o público, entram regras de acesso e segurança, e isso muda o valor.",
  },
  {
    id: "pagamento",
    texto: "Precisa receber pagamento pelo sistema?",
    curto: "Pagamento",
    tipo: "unica",
    opcoes: [
      { id: "nao", rotulo: "Não", horas: 0 },
      { id: "pix-cartao", rotulo: "Sim, Pix e cartão", ajuda: "Pagamento avulso: o cliente paga e o sistema confirma o recebimento.", horas: 6, abre: [meioDePagamento, notaFiscal] },
      { id: "recorrente", rotulo: "Sim, assinatura recorrente", ajuda: "O cliente é cobrado todo mês automaticamente. É preciso tratar cartão recusado e cancelamento.", horas: 10, abre: [meioDePagamento, notaFiscal] },
    ],
    ajuda: "Receber pelo sistema exige ligar com uma empresa de pagamento e tratar pagamentos que falham. Assinatura recorrente dá mais trabalho que Pix e cartão.",
  },
  {
    id: "integracao",
    texto: "Precisa conversar com outros sistemas?",
    curto: "Outros sistemas",
    tipo: "unica",
    opcoes: [
      { id: "nao", rotulo: "Não", horas: 0 },
      { id: "whatsapp", rotulo: "Sim, com o WhatsApp", ajuda: "O sistema envia ou recebe mensagens pelo WhatsApp.", horas: 4, abre: [quaisSistemas, acessoApi] },
      { id: "outros", rotulo: "Sim, com ERP, planilha ou outro", ajuda: "ERP é o sistema de gestão da empresa (estoque, financeiro, notas). O sistema novo troca dados com ele ou com a sua planilha.", horas: 6, abre: [quaisSistemas, acessoApi] },
    ],
    ajuda: "É quando o sistema troca informação com outro que você já usa, para ninguém digitar duas vezes. Cada tipo de ligação muda o valor.",
  },
  {
    id: "volume",
    texto: "Quanto dado o sistema vai guardar?",
    curto: "Volume de dados",
    tipo: "unica",
    opcoes: [
      { id: "pequeno", rotulo: "Pouco (até alguns milhares de registros)", horas: 0 },
      { id: "medio", rotulo: "Médio", ajuda: "Cresce aos poucos, mas ainda cabe em um banco de dados simples.", horas: 4 },
      { id: "grande", rotulo: "Muito (cresce todo dia)", ajuda: "Novos registros todos os dias, como pedidos ou leituras. Pede um banco de dados mais cuidadoso.", horas: 10 },
      { id: "nao-sei", rotulo: "Não sei", horas: 0 },
    ],
    ajuda: "Muito dado pede um banco de dados mais cuidadoso para o sistema continuar rápido. Quanto mais dado, mais trabalho.",
  },
  {
    id: "relatorios",
    texto: "Precisa de relatórios e gráficos?",
    curto: "Relatórios e gráficos",
    tipo: "unica",
    opcoes: [
      { id: "nao", rotulo: "Não", horas: 0 },
      { id: "sim", rotulo: "Sim", horas: 4, abre: [quaisRelatorios, exportar] },
    ],
    ajuda: "Relatórios resumem os números do sistema em tabelas e gráficos. Você escolhe quais a seguir.",
  },
  {
    id: "hospedagem",
    texto: "Onde o sistema vai ficar hospedado?",
    curto: "Hospedagem",
    tipo: "unica",
    opcoes: [
      { id: "eu-cuido", rotulo: "Eu mesmo cuido", ajuda: "Você contrata e mantém o servidor por conta própria.", horas: 0 },
      { id: "ja-tenho", rotulo: "Já tenho um lugar", ajuda: "Você já tem um servidor ou plano de hospedagem para usar.", horas: 0 },
      { id: "nao-sei", rotulo: "Não sei", horas: 0 },
    ],
    ajuda: "Hospedagem é o servidor que mantém o sistema no ar. É cobrada à parte, direto pelo provedor, e não muda o valor de criação.",
  },
  {
    id: "sensiveis",
    texto: "O sistema vai guardar dados sensíveis?",
    curto: "Dados sensíveis",
    tipo: "unica",
    opcoes: [
      { id: "nao", rotulo: "Não", horas: 0 },
      { id: "sim", rotulo: "Sim", horas: 4, abre: [tipoDeDado, politicaPrivacidade] },
    ],
    ajuda: "Dado sensível é o que causa dano se vazar: saúde, documentos, finanças. Pede mais cuidado, e você escolhe os detalhes a seguir.",
  },
];
