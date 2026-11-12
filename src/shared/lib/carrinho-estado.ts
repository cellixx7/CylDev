import { estaNoCatalogo, servicoOrcamentoPorId } from "../../content/perguntas";
import type { Respostas } from "./orcamento";

// Estado do carrinho como funções puras. Os ids dos serviços no carrinho e as respostas de cada serviço
// vivem lado a lado: tirar um serviço do carrinho NÃO apaga as respostas dele, então readicionar volta como estava.

export type EstadoCarrinho = {
  ids: string[];
  respostas: Record<string, Respostas>;
};

/** Serviços que entram no combo (planilha, painel e automação). */
export const COMBO_IDS = ["planilha", "painel", "automacao"];

/** Respostas de partida por serviço. Hoje nenhum serviço precisa de uma. */
export const respostasIniciais: Record<string, Respostas> = {};

export function estadoInicial(): EstadoCarrinho {
  return { ids: [], respostas: { ...respostasIniciais } };
}

export const estaNoCarrinho = (e: EstadoCarrinho, id: string) => e.ids.includes(id);

/** Coloca o serviço no carrinho, com as respostas que ele já tiver (ou só o preço de tabela). Não duplica. */
export function adicionar(e: EstadoCarrinho, id: string): EstadoCarrinho {
  if (!estaNoCatalogo(id) || e.ids.includes(id)) return e;
  return { ...e, ids: [...e.ids, id] };
}

/** Tira só o serviço indicado. As respostas ficam guardadas. */
export function remover(e: EstadoCarrinho, id: string): EstadoCarrinho {
  if (!e.ids.includes(id)) return e;
  return { ...e, ids: e.ids.filter((i) => i !== id) };
}

/** Pergunta de escolha única troca a resposta; de múltipla liga e desliga a opção. */
export function responder(e: EstadoCarrinho, servicoId: string, perguntaId: string, opcaoId: string): EstadoCarrinho {
  const pergunta = servicoOrcamentoPorId(servicoId)?.perguntas.find((p) => p.id === perguntaId);
  if (!pergunta) return e;
  const dele = e.respostas[servicoId] ?? {};
  if (pergunta.tipo === "unica") {
    return { ...e, respostas: { ...e.respostas, [servicoId]: { ...dele, [perguntaId]: opcaoId } } };
  }
  const marcadas = Array.isArray(dele[perguntaId]) ? (dele[perguntaId] as string[]) : [];
  const novas = marcadas.includes(opcaoId) ? marcadas.filter((i) => i !== opcaoId) : [...marcadas, opcaoId];
  return { ...e, respostas: { ...e.respostas, [servicoId]: { ...dele, [perguntaId]: novas } } };
}

/** Acrescenta só os serviços do combo que ainda faltam. */
export function montarCombo(e: EstadoCarrinho): EstadoCarrinho {
  const faltam = COMBO_IDS.filter((id) => !e.ids.includes(id));
  return faltam.length === 0 ? e : { ...e, ids: [...e.ids, ...faltam] };
}
