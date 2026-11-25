// Mostra o que falta traduzir em cada idioma. Uso: node --experimental-strip-types scripts/cobertura.ts [idioma...]
import { resolve } from "node:path";
import { lerLista } from "./textos-arquivos.ts";

const raiz = resolve(import.meta.dirname, "..");
const i18n = (...p: string[]) => resolve(raiz, "src/content/i18n", ...p);
const ignorados = new Set(lerLista(i18n("ignorar.txt")).map((l) => l.id));
const idiomas = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ["en", "es", "fr", "zh", "hi", "ar", "bn", "ru", "ur"];

for (const [lista, arquivo, nome] of [["pt.txt", "textos.txt", "site"], ["pt-juridico.txt", "juridico.txt", "jurídico"]] as const) {
  const base = lerLista(i18n(lista)).filter((l) => !ignorados.has(l.id));
  for (const idioma of idiomas) {
    const feitos = new Set(lerLista(i18n(idioma, arquivo)).map((l) => l.id));
    const falta = base.filter((l) => !feitos.has(l.id));
    console.log(`${idioma} ${nome}: ${base.length - falta.length}/${base.length}${falta.length ? `  (faltam ${falta.length})` : ""}`);
  }
}
