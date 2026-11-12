// Perguntas do orçamento base do "Sistema sob medida", em árvore: cada opção pode abrir até 2 perguntas
// de aprofundamento (e elas, mais 2), no máximo 2 níveis abaixo da principal. Os limites são conferidos por teste.
//
// PENDENTE: todas as horas abaixo são PROPOSTAS provisórias, a confirmar pelo Marcelo (docs/DECISOES.md).
// Cada hora extra soma VALOR_HORA_EXTRA ao preço. O preço base (20 horas) fica em servicos.ts.
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
    { id: "uso", rotulo: "Pelo uso", horas: 3 },
    { id: "unica", rotulo: "Uma vez só", horas: 0 },
    { id: "nao-sei", rotulo: "Ainda não sei", horas: 0 },
  ],
  ajuda: "Assinatura cobra todo mês e exige controlar quem pagou e quem atrasou, e isso soma 2 horas. Pelo uso soma 3 horas.",
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
  ajuda: "Cada tipo de usuário vê e faz coisas diferentes: o dono vê tudo, o cliente vê só o dele. Dois tipos somam 2 horas; três ou mais, 4.",
};

const ondeRoda: Pergunta = {
  id: "onde-roda",
  texto: "Onde o aplicativo vai rodar?",
  curto: "Onde roda",
  tipo: "unica",
  opcoes: [
    { id: "navegador", rotulo: "No navegador", horas: 0 },
    { id: "celular", rotulo: "No celular", horas: 4 },
    { id: "os-dois", rotulo: "No celular e no navegador", horas: 8 },
    { id: "nao-sei", rotulo: "Não sei", horas: 0 },
  ],
  ajuda: "No navegador, abre por um endereço, sem instalar nada. No celular, é um aplicativo instalado e soma 4 horas. Os dois juntos somam 8.",
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
  ajuda: "Funcionar sem internet exige guardar os dados no aparelho e sincronizar depois. É mais trabalho e soma 6 horas.",
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
  ajuda: "Com login, cada pessoa entra com a sua conta e só vê o que é dela. Soma 3 horas.",
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
  ajuda: "A própria pessoa cria a conta e confirma o e-mail. Soma 2 horas.",
};

const meioDePagamento: Pergunta = {
  id: "meio-pagamento",
  texto: "Qual meio de pagamento você já usa?",
  curto: "Meio de pagamento",
  tipo: "unica",
  opcoes: [
    { id: "mercado-pago", rotulo: "Mercado Pago", horas: 0 },
    { id: "stripe", rotulo: "Stripe", horas: 0 },
    { id: "banco", rotulo: "Banco ou maquininha", horas: 0 },
    { id: "nenhum", rotulo: "Ainda nenhum", horas: 2 },
  ],
  ajuda: "É a empresa que recebe o dinheiro do cliente e avisa o sistema. Se você ainda não tem, eu ajudo a escolher e a abrir a conta, e isso soma 2 horas.",
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
  ajuda: "Emitir nota pelo sistema depende do seu contador e do município. Soma 4 horas, e eu confirmo o caminho na conversa.",
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
  ajuda: "Marque todos os que se aplicam. O primeiro está incluso. Cada um a mais soma 2 horas (R$ 100).",
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
  ajuda: "API é a porta que o outro sistema abre para conversar com o seu. Sem acesso, eu preciso procurar outro caminho, e isso soma 3 horas.",
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
  ajuda: "O primeiro relatório está incluso. Cada um a mais soma 2 horas (R$ 100).",
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
  ajuda: "É um botão que baixa o relatório pronto. Cada formato soma 1 hora.",
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
  ajuda: "Marque os que o sistema vai guardar. O primeiro está incluso. Cada um a mais soma 1 hora.",
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
  ajuda: "Eu monto um texto-base com você. Não é parecer jurídico: para valer como contrato, vale uma revisão de quem entende de lei. Soma 2 horas.",
};

// Perguntas principais -----------------------------------------------------------------------------

export const perguntasSistema: Pergunta[] = [
  {
    id: "tipo",
    texto: "Que tipo de sistema você imagina?",
    curto: "Tipo de sistema",
    tipo: "unica",
    opcoes: [
      { id: "saas", rotulo: "SaaS (clientes pagam uma assinatura)", horas: 8, abre: [cobranca, tiposDeUsuario] },
      { id: "site-logado", rotulo: "Site com área logada", horas: 4 },
      { id: "aplicativo", rotulo: "Aplicativo", horas: 6, abre: [ondeRoda, semInternet] },
      { id: "programa", rotulo: "Programa de computador", horas: 4 },
      { id: "nao-sei", rotulo: "Ainda não sei", horas: 0 },
    ],
    ajuda:
      "SaaS é um sistema que você vende por assinatura. Site com área logada tem uma parte só para quem entra com conta. Aplicativo roda no celular ou no navegador. Programa de computador se instala no PC. Cada tipo soma horas, e “ainda não sei” não soma nada: a gente decide na conversa.",
  },
  {
    id: "usuarios",
    texto: "Quem vai usar?",
    curto: "Quem usa",
    tipo: "unica",
    opcoes: [
      { id: "equipe", rotulo: "Só eu e a minha equipe", horas: 0 },
      { id: "clientes", rotulo: "Os meus clientes", horas: 2, abre: [login, cadastro] },
      { id: "publico", rotulo: "Qualquer pessoa (público aberto)", horas: 3, abre: [login, cadastro] },
    ],
    ajuda: "Sistema só para a equipe é mais simples. Para clientes ou para o público, entram regras de acesso e segurança, e isso soma horas.",
  },
  {
    id: "pagamento",
    texto: "Precisa receber pagamento pelo sistema?",
    curto: "Pagamento",
    tipo: "unica",
    opcoes: [
      { id: "nao", rotulo: "Não", horas: 0 },
      { id: "pix-cartao", rotulo: "Sim, Pix e cartão", horas: 6, abre: [meioDePagamento, notaFiscal] },
      { id: "recorrente", rotulo: "Sim, assinatura recorrente", horas: 10, abre: [meioDePagamento, notaFiscal] },
    ],
    ajuda: "Receber pelo sistema exige ligar com uma empresa de pagamento e tratar pagamentos que falham. Pix e cartão somam 6 horas; assinatura recorrente, 10.",
  },
  {
    id: "integracao",
    texto: "Precisa conversar com outros sistemas?",
    curto: "Outros sistemas",
    tipo: "unica",
    opcoes: [
      { id: "nao", rotulo: "Não", horas: 0 },
      { id: "whatsapp", rotulo: "Sim, com o WhatsApp", horas: 4, abre: [quaisSistemas, acessoApi] },
      { id: "outros", rotulo: "Sim, com ERP, planilha ou outro", horas: 6, abre: [quaisSistemas, acessoApi] },
    ],
    ajuda: "É quando o sistema troca informação com outro que você já usa, para ninguém digitar duas vezes. WhatsApp soma 4 horas; os outros, 6.",
  },
  {
    id: "volume",
    texto: "Quanto dado o sistema vai guardar?",
    curto: "Volume de dados",
    tipo: "unica",
    opcoes: [
      { id: "pequeno", rotulo: "Pouco (até alguns milhares de registros)", horas: 0 },
      { id: "medio", rotulo: "Médio", horas: 4 },
      { id: "grande", rotulo: "Muito (cresce todo dia)", horas: 10 },
      { id: "nao-sei", rotulo: "Não sei", horas: 0 },
    ],
    ajuda: "Muito dado pede um banco de dados mais cuidadoso para o sistema continuar rápido. Médio soma 4 horas; muito, 10.",
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
    ajuda: "Relatórios resumem os números do sistema em tabelas e gráficos. Soma 4 horas, mais o que você escolher a seguir.",
  },
  {
    id: "hospedagem",
    texto: "Onde o sistema vai ficar hospedado?",
    curto: "Hospedagem",
    tipo: "unica",
    opcoes: [
      { id: "eu-cuido", rotulo: "Eu mesmo cuido", horas: 0 },
      { id: "ja-tenho", rotulo: "Já tenho um lugar", horas: 0 },
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
    ajuda: "Dado sensível é o que causa dano se vazar: saúde, documentos, finanças. Pede mais cuidado e soma 4 horas, mais o que você escolher a seguir.",
  },
];
