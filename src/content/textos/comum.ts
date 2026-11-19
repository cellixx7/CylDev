// Textos comuns a todas as páginas: rótulos gerais, catálogo, desconto de piloto e formulário de contato.
// Faz parte de src/content/textos/ (ver index.ts). Preços nunca são escritos à mão aqui: saem de servicos.ts e orcamento.ts.

export const comum = {
  /**
   * Rodapé de todas as páginas: identificação de quem presta o serviço (dados em site.prestador) e links curtos.
   * Os textos completos ficam nas páginas de leitura (/termos/, /privacidade/, /perguntas/, /acessibilidade/).
   */
  rodape: {
    rotulo: "Rodapé",
    semRastreio: "Site sem rastreadores.",
    /** Vem antes do nome, do CPF ou CNPJ, da cidade e do e-mail. */
    prestador: "Serviço prestado por",
    termos: "Termos",
    perguntas: "Perguntas",
    acessibilidade: "Acessibilidade",
    contato: "Contato",
  },
  privacidadeLink: "Privacidade",
  dadosFicticios: "dados fictícios",
  temaClaro: "Tema claro",
  temaEscuro: "Tema escuro",
  menuAbrir: "Abrir menu",
  menuFechar: "Fechar menu",
  /** Carrossel do celular (ver shared/components/Carrossel.tsx). */
  carrossel: {
    anterior: "Anterior",
    proximo: "Próximo",
    posicao: (atual: number, total: number) => `${atual} de ${total}`,
  },
};

export const catalogo = {
  inclui: "Inclui",
  prazo: "Prazo",
  mensalidade: "Mensalidade",
  /** Ex.: "R$ 30 por mês, mais a hospedagem" */
  valorMensalidade: (valor: string, aPartirDe: boolean) =>
    `${aPartirDe ? "a partir de " : ""}${valor} por mês, mais a hospedagem`,
};

export const piloto = (restam: number, percentual: number, primeiraFaixa: boolean) =>
  primeiraFaixa
    ? `As 5 primeiras vagas têm 10% de desconto. As 5 seguintes, 5%. Restam ${restam} com ${percentual}%. Chame no WhatsApp e garanta a sua.`
    : `Restam ${restam} vagas com ${percentual}% de desconto. Chame no WhatsApp e garanta a sua.`;

export const pilotoNota = "O desconto vale sobre o preço de criação.";

export const formulario = {
  nome: "Seu nome",
  preferencia: "Como prefere que eu responda?",
  porWhatsapp: "WhatsApp",
  porEmail: "E-mail",
  whatsapp: "Seu WhatsApp (com DDD)",
  email: "Seu e-mail",
  assunto: "Assunto",
  mensagem: "O que você precisa",
  /** Rótulo da mensagem quando a calculadora já mandou o resumo do pedido. */
  mensagemOpcional: "Quer contar mais alguma coisa? (opcional)",
  resumo: "Vai junto com a sua mensagem:",
  enviar: "Enviar",
  enviando: "Enviando…",
  falhou: "Não consegui enviar agora. Me chame por um destes canais:",
  isca: "Não preencha este campo:",
  /** Aviso abaixo do botão de enviar, com o link para a política. */
  privacidade: "Uso o seu nome e o seu contato só para responder. A mensagem passa pelo EmailJS.",
  privacidadeLink: "Política de privacidade",
};
