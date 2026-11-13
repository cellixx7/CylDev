import { servicosDoCatalogo, type ServicoOrcamento } from "../../content/perguntas";
import { estadoInicial, respostasIniciais, type EstadoCarrinho } from "./carrinho-estado";
import { podarRespostas, todasAsPerguntas, type Respostas } from "./orcamento";

// Carrinho guardado em sessionStorage, para sobreviver à troca de página e ao recarregar.
// Guarda SÓ: versão do formato, ids dos serviços e respostas (ids de pergunta e de opção).
// Nunca guarda nome, telefone, e-mail, observações nem preço: o preço é sempre recalculado das respostas.

export const CHAVE_CARRINHO = "carrinho-negocios";
export const VERSAO_CARRINHO = 1;

type Salvo = { v: number; ids: string[]; respostas: Record<string, Respostas> };

/** Texto que vai para o sessionStorage. O objeto é montado campo a campo: nada além de ids e respostas passa. */
export function serializarCarrinho(e: EstadoCarrinho): string {
  const salvo: Salvo = { v: VERSAO_CARRINHO, ids: [...e.ids], respostas: e.respostas };
  return JSON.stringify(salvo);
}

const ehObjeto = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);

/** Mantém só as respostas de perguntas e opções que ainda existem no serviço. */
function respostasValidas(servico: ServicoOrcamento, bruto: unknown): Respostas {
  const limpas: Respostas = {};
  if (!ehObjeto(bruto)) return limpas;
  for (const p of todasAsPerguntas(servico.perguntas)) {
    const valor = bruto[p.id];
    const existe = (id: unknown): id is string => typeof id === "string" && p.opcoes.some((o) => o.id === id);
    if (p.tipo === "unica") {
      if (existe(valor)) limpas[p.id] = valor;
    } else if (Array.isArray(valor)) {
      const marcadas = [...new Set(valor.filter(existe))];
      if (marcadas.length > 0) limpas[p.id] = marcadas;
    }
  }
  // Respostas órfãs (de filhas que a resposta pai de hoje não abre) são ignoradas.
  return podarRespostas(servico.perguntas, limpas);
}

/**
 * Reconstrói o estado a partir do texto salvo, validando contra os serviços e perguntas de hoje.
 * Texto ausente, corrompido ou de versão desconhecida devolve o estado inicial.
 * Ids e respostas que não existem mais (ou que saíram do catálogo de Negócios, como os bots) são descartados em silêncio. Não há preço salvo: quem usa o estado recalcula.
 */
export function restaurarCarrinho(texto: string | null | undefined, servicos: ServicoOrcamento[] = servicosDoCatalogo): EstadoCarrinho {
  if (!texto) return estadoInicial();
  let bruto: unknown;
  try {
    bruto = JSON.parse(texto);
  } catch {
    return estadoInicial();
  }
  if (!ehObjeto(bruto) || bruto.v !== VERSAO_CARRINHO) return estadoInicial();

  const porId = new Map(servicos.map((s) => [s.id, s]));
  const ids = Array.isArray(bruto.ids)
    ? [...new Set(bruto.ids.filter((id): id is string => typeof id === "string" && porId.has(id)))]
    : [];

  const respostas: Record<string, Respostas> = {};
  if (ehObjeto(bruto.respostas)) {
    for (const [servicoId, dele] of Object.entries(bruto.respostas)) {
      const servico = porId.get(servicoId);
      if (!servico) continue;
      const limpas = respostasValidas(servico, dele);
      if (Object.keys(limpas).length > 0) respostas[servicoId] = limpas;
    }
  }
  // Respostas de partida (se houver) valem quando o salvo não trouxe a pergunta.
  for (const [servicoId, iniciais] of Object.entries(respostasIniciais)) {
    respostas[servicoId] = { ...iniciais, ...respostas[servicoId] };
  }
  return { ids, respostas };
}

/** Lê do sessionStorage. Armazenamento bloqueado ou ausente: estado inicial. */
export function lerCarrinho(): EstadoCarrinho {
  try {
    return restaurarCarrinho(sessionStorage.getItem(CHAVE_CARRINHO));
  } catch {
    return estadoInicial();
  }
}

export function salvarCarrinho(e: EstadoCarrinho): void {
  try {
    sessionStorage.setItem(CHAVE_CARRINHO, serializarCarrinho(e));
  } catch {
    // Sem armazenamento, o carrinho vale só nesta página.
  }
}

/** Depois de um envio com sucesso. */
export function limparCarrinho(): void {
  try {
    sessionStorage.removeItem(CHAVE_CARRINHO);
  } catch {
    // Nada a limpar.
  }
}
