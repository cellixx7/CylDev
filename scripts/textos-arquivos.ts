// Quais arquivos entram no sistema de tradução e como é o formato das listas de texto (uma linha por texto).
import { existsSync, readFileSync } from "node:fs";

/**
 * Arquivos cujos textos são traduzidos (caminho relativo à raiz, com "/").
 * Ficam de fora: testes, as próprias traduções, o motor do assistente (regras em português; ver docs/decisoes/idiomas.md)
 * e a lógica que monta as mensagens enviadas ao Marcelo (WhatsApp, e-mail, registro do pedido), que seguem em português.
 */
export function arquivosTraduzidos(rel: string): boolean {
  const r = rel.replaceAll("\\", "/");
  if (!/^src\/.*\.(ts|tsx)$/.test(r)) return false;
  if (/\.test\.ts$/.test(r) || r.startsWith("src/content/i18n/")) return false;
  if (r.startsWith("src/shared/lib/assistente/") || r.startsWith("src/pages/negocios/assistente/")) return false;
  if (/^src\/content\/(assistente\.ts|textos\/assistente[A-Za-z]*\.ts)$/.test(r)) return false;
  if (r === "src/shared/components/cyl/cylSvg.ts" || r === "src/shared/i18n/idiomas.ts") return false;
  if (/^src\/shared\/lib\/(whatsapp|pedido|emailjs|telefone|csv|prestador)\.ts$/.test(r)) return false;
  return true;
}

export type Linha = { id: string; texto: string };

/** "identificador texto" por linha; "\n" dentro do texto é quebra de linha; linhas com # e vazias são comentário. */
export function lerLista(arquivo: string): Linha[] {
  if (!existsSync(arquivo)) return [];
  return readFileSync(arquivo, "utf8")
    .split("\n")
    .filter((l) => l.trim() !== "" && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf(" ");
      const texto = i < 0 ? "" : l.slice(i + 1);
      return { id: i < 0 ? l : l.slice(0, i), texto: textoDaLinha(texto) };
    });
}

export const textoParaLinha = (t: string) => t.replace(/\\/g, "\\\\").replace(/\n/g, "\\n");
export const textoDaLinha = (l: string) => l.replace(/\\(\\|n)/g, (_m, c: string) => (c === "n" ? "\n" : "\\"));

/** Textos jurídicos e longos: ficam numa lista à parte (juridico.txt), para a tradução deles ser revisada com mais cuidado. */
export function ehJuridico(rel: string): boolean {
  return /^src\/content\/textos\/(termos|privacidade|perguntasFrequentes|acessibilidade)\.ts$/.test(rel.replaceAll("\\", "/"));
}
