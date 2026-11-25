// Encontra os textos escritos no código (strings, templates e texto de JSX) para o sistema de tradução.
// Usado por scripts/extrair-textos.ts (gera a lista em português) e pelo plugin de idiomas (aplica a tradução no build).
//
// Cada texto vira uma "chave": o próprio texto em português; em template literal, as expressões viram {1}, {2}...
// (`${n} de ${t}` vira "{1} de {2}"). O identificador do texto é um hash curto da chave: mudou o texto em português,
// o identificador muda e a tradução antiga deixa de valer (o teste de cobertura avisa).
import { createHash } from "node:crypto";
import { parseAstAsync } from "vite";

export type ItemDeTexto = {
  start: number;
  end: number;
  tipo: "literal" | "template" | "jsx";
  chave: string;
  /** Código-fonte das expressões de um template, na ordem ({1}, {2}...). */
  expressoes: string[];
  /** Literal de atributo JSX (`title="x"`): na troca vira `title={"y"}`. */
  atributo: boolean;
};

type No = { type: string; start: number; end: number; [chave: string]: unknown };

const tiposDeTipo = new Set(["TSAsExpression", "TSSatisfiesExpression", "TSNonNullExpression", "TSTypeAssertion"]);
const chavesDeTipo = new Set(["typeAnnotation", "returnType", "typeParameters", "typeArguments", "superTypeArguments", "superTypeParameters"]);

export function idDoTexto(chave: string): string {
  return createHash("sha1").update(chave).digest("base64url").slice(0, 6);
}

/** Palavras soltas que são código (teclas, nomes do schema.org, siglas) e nunca se traduzem. */
const palavrasDeCodigo = new Set(["Escape", "Enter", "Home", "End", "BRL", "pt-BR", "Country", "Offer", "Service", "R$", "L", "M"]);

/** Só o que parece texto para gente: tem letra, não é endereço, nem identificador, nem classe do Tailwind, nem HTML, nem desenho SVG. */
export function pareceTexto(chave: string): boolean {
  const c = chave.trim();
  const sem = c.replace(/\{\d+\}/g, "").trim();
  if (!/\p{L}/u.test(sem) || palavrasDeCodigo.has(c)) return false;
  if (/^(\/|#|\.|https?:|mailto:|tel:|data:|\w+:\/\/)/.test(c)) return false;
  if (/<\/?[a-z][^>]*>/i.test(c) || /^&\w+;$/.test(c) || /^\\u/.test(c)) return false; // HTML, entidade
  if (/^[MmLlHhVvCcSsQqTtAaZz][\d\s.,\-MmLlHhVvCcSsQqTtAaZz{}]*$/.test(c) && /\d/.test(c)) return false; // caminho de SVG
  const pedacos = c.split(/\s+/);
  const acentuado = /[\u00C0-\u024F]/.test(c);
  if (pedacos.length === 1 && /^[a-z]+[A-Z]|^[A-Z][a-z]+[A-Z]/.test(sem) && !acentuado) return false; // camelCase, PascalCase
  if (pedacos.length === 1 && /^[\p{Ll}0-9_.:\-[\]/%{}]+$/u.test(c) && !acentuado) return false; // id, classe ou palavra de código
  const reais = pedacos.filter((p) => !/^\{\d+\}$/.test(p));
  const classe = (p: string) => /^[!a-z0-9:\-[\]/%.()#_&*>+~=,'"@{}]+$/.test(p);
  if (reais.length > 0 && reais.every(classe) && reais.some((p) => /[-[\]/]|\w:\w|^\d|[()]/.test(p))) return false; // classes do Tailwind
  return true;
}

export async function coletar(codigo: string, lang: "ts" | "tsx"): Promise<ItemDeTexto[]> {
  const ast = (await parseAstAsync(codigo, { lang })) as unknown as No;
  const itens: ItemDeTexto[] = [];

  const visitar = (no: unknown, pai: No | null, chaveNoPai: string): void => {
    if (!no || typeof no !== "object") return;
    if (Array.isArray(no)) {
      for (const n of no) visitar(n, pai, chaveNoPai);
      return;
    }
    const n = no as No;
    if (typeof n.type !== "string") return;
    if (n.type.startsWith("TS") && !tiposDeTipo.has(n.type)) return;
    if (pai && chavesDeTipo.has(chaveNoPai)) return;
    if (/^(Import|Export)/.test(n.type) && n.type !== "ExportNamedDeclaration" && n.type !== "ExportDefaultDeclaration") return;

    if (n.type === "Literal" && typeof n.value === "string") {
      const ehChave = pai?.type === "Property" && pai.key === n && !pai.computed;
      const ehFonte = pai?.type === "ExportNamedDeclaration" || pai?.type === "ExportAllDeclaration" || pai?.type === "ImportExpression";
      const ehCase = pai?.type === "SwitchCase";
      if (!ehChave && !ehFonte && !ehCase) itens.push({ start: n.start, end: n.end, tipo: "literal", chave: n.value, expressoes: [], atributo: pai?.type === "JSXAttribute" });
      return;
    }
    if (n.type === "TemplateLiteral" && pai?.type !== "TaggedTemplateExpression") {
      const quasis = n.quasis as { value: { cooked: string | null } }[];
      const exprs = (n.expressions as No[]).map((e) => codigo.slice(e.start, e.end));
      const chave = quasis.map((q, i) => (q.value.cooked ?? "") + (i < exprs.length ? `{${i + 1}}` : "")).join("");
      itens.push({ start: n.start, end: n.end, tipo: "template", chave, expressoes: exprs, atributo: false });
      for (const e of n.expressions as No[]) visitar(e, n, "expressions"); // textos dentro das expressões também valem
      return;
    }
    if (n.type === "JSXText") {
      const chave = String(n.value).replace(/\s+/g, " ").trim();
      if (chave) itens.push({ start: n.start, end: n.end, tipo: "jsx", chave, expressoes: [], atributo: false });
      return;
    }
    for (const k of Object.keys(n)) {
      if (k === "parent" || k === "loc" || k === "range") continue;
      if (tiposDeTipo.has(n.type) && k !== "expression") continue;
      visitar(n[k], n, k);
    }
  };
  visitar(ast, null, "");
  return itens;
}

const escapar = (s: string) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

/** Troca no código os textos que têm tradução. `traducoes` vai de identificador para texto traduzido. */
export function aplicar(codigo: string, itens: ItemDeTexto[], traducoes: ReadonlyMap<string, string>): string {
  const trocas = itens.flatMap((it) => {
    const t = traducoes.get(idDoTexto(it.chave));
    if (t === undefined) return [];
    let novo: string;
    if (it.tipo === "template") {
      novo = "`" + escapar(t).replace(/\{(\d+)\}/g, (_m, i: string) => "${" + (it.expressoes[Number(i) - 1] ?? '""') + "}") + "`";
    } else if (it.tipo === "jsx") {
      const original = codigo.slice(it.start, it.end);
      novo = (/^\s*/.exec(original)?.[0] ?? "") + "{" + JSON.stringify(t) + "}" + (/\s*$/.exec(original)?.[0] ?? "");
    } else {
      novo = it.atributo ? "{" + JSON.stringify(t) + "}" : JSON.stringify(t);
    }
    return [{ start: it.start, end: it.end, novo }];
  });
  // Itens aninhados (template dentro de template) ficam com o de fora; troca de trás para frente para as posições valerem.
  const livres = trocas.filter((t) => !trocas.some((o) => o !== t && o.start <= t.start && t.end <= o.end && (o.start < t.start || t.end < o.end)));
  livres.sort((a, b) => b.start - a.start);
  let saida = codigo;
  for (const t of livres) saida = saida.slice(0, t.start) + t.novo + saida.slice(t.end);
  return saida;
}
