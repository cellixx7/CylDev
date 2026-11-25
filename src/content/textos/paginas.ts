// Textos das páginas avulsas: obrigado e 404, e os rótulos comuns das páginas de leitura.
// A política de privacidade fica em privacidade.ts.
// Faz parte de src/content/textos/ (ver index.ts). Preços nunca são escritos à mão aqui: saem de servicos.ts e orcamento.ts.
import { site } from "../site";

/** Rótulos comuns das páginas de leitura (Termos, privacidade, acessibilidade e perguntas). */
export const paginaDeTexto = {
  voltar: "Voltar para o site",
  indice: "Nesta página",
  avisoIdioma:
    "Este texto está disponível só em português, e é a versão em português que vale. Se tiver dúvida, escreva para mim.",
  topo: "Voltar ao topo",
};

export const obrigado = {
  titulo: "Mensagem recebida.",
  texto: "Obrigado pelo contato. Respondo pelo canal que você escolheu.",
  voltar: "Voltar para o site",
};

export const naoEncontrado = {
  titulo: "Essa página não existe.",
  texto: `O link pode estar errado ou a página mudou de lugar. Se precisar de ajuda, escreva para ${site.email}.`,
  voltar: "Ir para o início",
};
