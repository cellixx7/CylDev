import type { Respostas } from "../orcamento";

// Ponte entre o chat (carregado sob demanda) e o carrinho do orçamento. O chat não importa o carrinho: ele avisa a página
// por um evento do navegador, e a seção Orçamento (que é dona do estado do carrinho) decide o que fazer.

export const EVENTO_CARRINHO = "assistente:carrinho";

export type DetalheCarrinho = { servicoId: string; respostas: Respostas };

/** Pede à página que coloque o serviço no carrinho, com as respostas do chat, e abra o carrinho. */
export function pedirCarrinho(detalhe: DetalheCarrinho): void {
  window.dispatchEvent(new CustomEvent<DetalheCarrinho>(EVENTO_CARRINHO, { detail: detalhe }));
}

export function lerDetalhe(e: Event): DetalheCarrinho | null {
  const d = (e as CustomEvent<DetalheCarrinho>).detail;
  if (!d || typeof d.servicoId !== "string" || typeof d.respostas !== "object" || d.respostas === null) return null;
  return d;
}

/** sessionStorage: a pessoa fechou o convite do ícone do chat; ele não volta nesta aba (nem ao mudar de página do site). */
export const CHAVE_CONVITE_FECHADO = "assistente-convite-fechado";
