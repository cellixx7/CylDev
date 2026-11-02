// Dados gerais do site. Tudo que é pessoal ou configurável fica aqui.

export const site = {
  nome: "Marcelo Vaz",
  marcaComunidade: "CylDev",
  // DDI + DDD + número, só dígitos.
  whatsapp: "5561996291118",
  email: "marcelovaz.contato@gmail.com",
  // Endereço público usado no Open Graph quando a Netlify não injeta `URL` no build.
  urlPadrao: "https://cyldev.netlify.app",

  // Conferir o termo de estágio com o supervisor antes de publicar.
  mostrarMinisterio: true,
  // Oculto até o supervisor responder.
  mostrarUniser: false,

  // Caminho em /public. Sem foto, o site usa o avatar de iniciais.
  foto: null as string | null,

  repositorioCylBot: null as string | null,
};

export type Area = "negocios" | "comunidade" | "home";
