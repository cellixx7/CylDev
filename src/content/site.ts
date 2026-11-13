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
  // Texto liberado. As imagens abaixo são de exemplo.
  mostrarUniser: true,
  // Telas reais da plataforma da UniSER (recortadas e otimizadas; os originais ficam fora do git, em src/pages/uniser/).
  // Para trocar: ponha os arquivos novos em /public e edite esta lista; o componente lê as dimensões de cada item.
  imagensUniser: [
    {
      src: "/uniser-inicio-v1.webp",
      alt: "Tela inicial da plataforma da UniSER, com o logo, o menu de páginas e o acesso ao login sobre uma foto de jardim.",
      width: 1280,
      height: 202,
    },
    {
      src: "/uniser-login-v1.webp",
      alt: "Tela de login da área restrita da plataforma da UniSER, com os campos de login e senha sobre uma foto de formandos.",
      width: 1280,
      height: 575,
    },
  ] as { src: string; alt: string; width: number; height: number }[],

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
