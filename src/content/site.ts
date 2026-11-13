// Dados gerais do site. Tudo que é pessoal ou configurável fica aqui.

export const site = {
  nome: "Marcelo Vaz",
  marcaComunidade: "CylDev",
  // DDI + DDD + número, só dígitos.
  whatsapp: "5561996291118",
  email: "marcelovaz.contato@gmail.com",
  // Endereço público usado no Open Graph quando a Netlify não injeta `URL` no build.
  urlPadrao: "https://cyldev.netlify.app",

  // Texto liberado pelo supervisor em 13/11/2026. Sem siglas nem nomes internos: só o texto de textos.ts.
  mostrarMinisterio: true,
  // Texto liberado.
  mostrarUniser: true,
  // Esquemas (HTML e CSS) das telas da UniSER, mostrados na seção Sobre e no modal. Os desenhos ficam em GaleriaUniser.tsx;
  // aqui ficam só o nome e a descrição de cada tela. Nenhum dado real de pessoa entra.
  telasUniser: [
    { id: "editais", titulo: "Editais", alt: "Esquema da página pública da UniSER: faixa verde com logo e menu, e três cartões de editais abaixo." },
    { id: "login", titulo: "Login", alt: "Esquema da tela de login da área restrita: cartão central com campos de login e senha e um botão verde." },
    { id: "grade", titulo: "Grade curricular", alt: "Esquema da grade curricular: tabela com código, disciplina e situação de cada matéria do período." },
    { id: "dados", titulo: "Meus dados", alt: "Esquema da tela Meus dados: cartões de dados pessoais, contato e endereço, cada um com botão de editar." },
    { id: "frequencia", titulo: "Frequência", alt: "Esquema da tela de frequência: resumo da situação e tabela com data, disciplina e justificativa das faltas." },
    { id: "semestre", titulo: "Meu semestre", alt: "Esquema da tela Meu semestre: cartões de segunda a sexta, cada um com a disciplina e a carga horária." },
  ] as { id: "editais" | "login" | "grade" | "dados" | "frequencia" | "semestre"; titulo: string; alt: string }[],

  // Caminho em /public. Sem foto, o site usa o avatar de iniciais.
  foto: null as string | null,

  // Links do menu de Negócios cujas seções ainda estão vazias. Religue (true) quando a seção existir.
  menuSecoes: { sobre: true, entregas: false, contato: false },

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
