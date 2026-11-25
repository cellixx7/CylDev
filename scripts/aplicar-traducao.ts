// Ferramenta de trabalho: junta um bloco de tradução ao arquivo do idioma.
// Entrada: linhas "n texto", em que n é o número da linha em src/content/i18n/pt.txt (ou pt-juridico.txt, com --juridico) no momento
// em que o bloco foi escrito. "n =" marca um texto que não se traduz (nome, valor de exemplo): vai para ignorar.txt.
// Uso: node --experimental-strip-types scripts/aplicar-traducao.ts <idioma> <bloco.txt> <base.txt> [--juridico]
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { lerLista, textoParaLinha } from "./textos-arquivos.ts";

const [idioma, bloco, baseArq, flag] = process.argv.slice(2);
const raiz = resolve(import.meta.dirname, "..");
const base = readFileSync(baseArq, "utf8").split("\n");
const destino = resolve(raiz, "src/content/i18n", idioma, flag === "--juridico" ? "juridico.txt" : "textos.txt");
const ignorar = resolve(raiz, "src/content/i18n/ignorar.txt");
mkdirSync(dirname(destino), { recursive: true });
const jaTem = new Set(lerLista(destino).map((l) => l.id));
const jaIgnora = new Set(lerLista(ignorar).map((l) => l.id));

let novos = 0;
let erros = 0;
const saida: string[] = [];
const saidaIgnorar: string[] = [];
for (const linha of readFileSync(bloco, "utf8").split("\n")) {
  if (linha.trim() === "") continue;
  const i = linha.indexOf(" ");
  const n = Number(i < 0 ? linha : linha.slice(0, i));
  const texto = i < 0 ? "" : linha.slice(i + 1);
  const origem = base[n - 1];
  if (!Number.isInteger(n) || !origem || origem.startsWith("#")) {
    console.error(`linha inválida: ${linha.slice(0, 60)}`);
    erros++;
    continue;
  }
  const id = origem.slice(0, origem.indexOf(" "));
  const pt = origem.slice(origem.indexOf(" ") + 1);
  if (texto === "=") {
    if (!jaIgnora.has(id)) saidaIgnorar.push(`${id} ${pt}`);
    jaIgnora.add(id);
    continue;
  }
  // Os marcadores {1}, {2}... têm que ser os mesmos do original.
  const marcas = (t: string) => (t.match(/\{\d+\}/g) ?? []).sort().join(",");
  if (marcas(pt) !== marcas(texto)) {
    console.error(`marcadores diferentes em ${n}: ${pt} => ${texto}`);
    erros++;
    continue;
  }
  if (jaTem.has(id)) continue;
  jaTem.add(id);
  saida.push(`${id} ${textoParaLinha(texto)}`);
  novos++;
}
if (saida.length) appendFileSync(destino, saida.join("\n") + "\n");
if (saidaIgnorar.length) appendFileSync(ignorar, saidaIgnorar.join("\n") + "\n");
console.log(`${idioma}: ${novos} novos, ${saidaIgnorar.length} ignorados, ${erros} erros${existsSync(destino) ? "" : ""}`);
