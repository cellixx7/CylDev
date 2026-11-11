import { servicosDoCatalogo } from "../../content/perguntas";

export type AbaModal = "detalhes" | "orcamento";
export type ServicoNaUrl = { id: string; aba: AbaModal };

const ids = new Set(servicosDoCatalogo.map((s) => s.id));

/**
 * Lê o hash da URL. `#planilha` abre a aba Detalhes; `#planilha/orcamento`, a aba Orçamento.
 * Qualquer outra coisa (inclusive os ids de seção da página, como `#orcamento`) devolve `null`.
 */
export function lerHash(hash: string): ServicoNaUrl | null {
  let texto = hash.startsWith("#") ? hash.slice(1) : hash;
  try {
    texto = decodeURIComponent(texto);
  } catch {
    return null;
  }
  const [id, aba] = texto.split("/");
  if (!ids.has(id)) return null;
  return { id, aba: aba === "orcamento" ? "orcamento" : "detalhes" };
}

/** Inverso de `lerHash`. */
export function montarHash(id: string, aba: AbaModal): string {
  return aba === "orcamento" ? `#${id}/orcamento` : `#${id}`;
}
