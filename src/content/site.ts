// Dados gerais do site. Tudo que é pessoal ou configurável fica aqui.

export const site = {
  nome: "Marcelo Vaz",
  // Nome completo, usado onde há identificação de quem presta o serviço (rodapé, Termos, privacidade). `nome` é a marca curta.
  nomeCompleto: "Marcelo Vaz Oliveira",
  marcaComunidade: "CylDev",
  // DDI + DDD + número, só dígitos.
  whatsapp: "5561996291118",
  email: "marcelovaz.contato@gmail.com",

  // Identificação de quem presta o serviço (Decreto 7.962/2013). Aparece no rodapé de todas as páginas e nos Termos.
  // `null` = o site não mostra o campo (nada é inventado). Decisão do Marcelo em 19/11/2026: o CPF é publicado
  // mascarado (095*****199) e o número completo vai só na proposta por escrito (docs/decisoes/juridico.md).
  // Cidade/UF, recibo e o e-mail de contato para privacidade também foram confirmados por ele em 16/11/2026.
  prestador: {
    /** CPF ou CNPJ, já formatado. Ex.: { tipo: "CNPJ", numero: "00.000.000/0001-00" }. */
    documento: { tipo: "CPF", numero: "095*****199" } as { tipo: "CPF" | "CNPJ"; numero: string } | null,
    /** Cidade e UF de onde o serviço é prestado. Ex.: "Cidade/UF". */
    cidadeUf: "Brasília/DF" as string | null,
    /** O que é emitido depois de cada pagamento. Troque para "nota" quando houver CNPJ e nota fiscal de serviço. */
    comprovante: "recibo" as "recibo" | "nota",
  },
  // Endereço público usado no Open Graph quando a Netlify não injeta `URL` no build.
  urlPadrao: "https://cyldev.netlify.app",

  // Texto liberado pelo supervisor em 13/11/2026. Sem siglas nem nomes internos: só o texto de textos/sobre.ts.
  mostrarMinisterio: true,
  // Texto liberado.
  mostrarUniser: true,
  // Esquemas (HTML e CSS) das telas da UniSER, mostrados na seção Sobre e no modal. Os desenhos ficam em GaleriaUniser.tsx;
  // aqui ficam só o nome e a descrição de cada tela. `naSecao` marca as duas que também aparecem ao lado do texto; todas aparecem no modal. Nenhum dado real de pessoa entra.
  telasUniser: [
    { id: "editais", naSecao: true, titulo: "Editais", alt: "Esquema da página pública da UniSER: faixa verde com logo e menu, e três cartões de editais abaixo." },
    { id: "login", naSecao: true, titulo: "Login", alt: "Esquema da tela de login da área restrita: cartão central com campos de login e senha e um botão verde." },
    { id: "grade", titulo: "Grade curricular", alt: "Esquema da grade curricular: tabela com código, disciplina e situação de cada matéria do período." },
    { id: "dados", titulo: "Meus dados", alt: "Esquema da tela Meus dados: cartões de dados pessoais, contato e endereço, cada um com botão de editar." },
    { id: "frequencia", titulo: "Frequência", alt: "Esquema da tela de frequência: resumo da situação e tabela com data, disciplina e justificativa das faltas." },
    { id: "semestre", titulo: "Meu semestre", alt: "Esquema da tela Meu semestre: cartões de segunda a sexta, cada um com a disciplina e a carga horária." },
  ] as { id: "editais" | "login" | "grade" | "dados" | "frequencia" | "semestre"; naSecao?: true; titulo: string; alt: string }[],

  // Caminho em /public. Sem foto, o site usa o avatar de iniciais.
  foto: null as string | null,

  // Links de seção do menu de Negócios. Desligue (false) para tirar o link do menu enquanto a seção não estiver pronta.
  menuSecoes: { sobre: true, entregas: true, contato: true },

  repositorioCylBot: "https://github.com/cellixx7/CylBot" as string | null,

  // EmailJS (envio do formulário). Esses três valores são públicos por natureza:
  // ficam no código do navegador. Nenhuma chave privada entra no repositório.
  // Enquanto algum estiver vazio, o formulário mostra WhatsApp e e-mail no lugar do envio.
  emailjs: {
    serviceId: "service_lwnft8l",
    templateId: "template_5lbj1qa",
    publicKey: "k7v0xn9QPlTQv7xnn",
  },
};

export type Area = "negocios" | "comunidade";
