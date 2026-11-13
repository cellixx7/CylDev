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
  // PROVISÓRIO: imagens de exemplo (telas genéricas, sem marca). Serão trocadas pelas reais do Marcelo:
  // basta pôr os arquivos novos em /public e editar esta lista; o componente não muda.
  imagensUniser: [
    { src: "/uniser-exemplo-1-v1.svg", alt: "Exemplo de tela inicial de um portal do aluno, com menu lateral, aviso e dois quadros." },
    { src: "/uniser-exemplo-2-v1.svg", alt: "Exemplo de tela de listagem de um portal do aluno, com tabela de quatro linhas." },
    { src: "/uniser-exemplo-3-v1.svg", alt: "Exemplo de tela de formulário de um portal do aluno, com campos e um gráfico de rosca." },
  ] as { src: string; alt: string }[],

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
