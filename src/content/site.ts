// Dados gerais do site. Tudo que é pessoal ou configurável fica aqui.

export const site = {
  nome: "Marcelo Vaz",
  marcaComunidade: "CylDev",
  // DDI + DDD + número, só dígitos.
  whatsapp: "5561996291118",
  email: "marcelovaz.contato@gmail.com",
  // Endereço público usado no Open Graph quando a Netlify não injeta `URL` no build.
  urlPadrao: "https://cyldev.netlify.app",

  // Texto liberado; sem merge na main até o supervisor confirmar.
  mostrarMinisterio: true,
  // Texto liberado. Imagens do Uniser só com aprovação do supervisor.
  mostrarUniser: true,

  // Caminho em /public. Sem foto, o site usa o avatar de iniciais.
  foto: null as string | null,

  // Links do menu de Negócios cujas seções ainda estão vazias. Religue (true) quando a seção existir.
  menuSecoes: { sobre: false, entregas: false, contato: false },

  repositorioCylBot: "https://github.com/cellixx7/CylBot" as string | null,

  // EmailJS (envio do formulário). Esses três valores são públicos por natureza:
  // ficam no código do navegador. Nenhuma chave privada entra no repositório.
  // Enquanto algum estiver vazio, o formulário mostra WhatsApp e e-mail no lugar do envio.
  emailjs: {
    serviceId: "service_2qsfdk9",
    templateId: "",
    publicKey: "",
  },
};

export type Area = "negocios" | "comunidade";
