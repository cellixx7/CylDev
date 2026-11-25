// Gera src/content/i18n/pt.txt: a lista de todos os textos do site em português, cada um com o seu identificador.
// É a base das traduções (src/content/i18n/<idioma>/textos.txt tem uma linha "identificador tradução" por texto daqui).
// Uso: node --experimental-strip-types scripts/extrair-textos.ts
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { coletar, idDoTexto, pareceTexto } from "./textos-ast.ts";
import { arquivosTraduzidos, ehJuridico, lerLista, textoParaLinha } from "./textos-arquivos.ts";

const raiz = resolve(import.meta.dirname, "..");

function listar(pasta: string): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    return statSync(caminho).isDirectory() ? listar(caminho) : [caminho];
  });
}

const arquivos = listar(join(raiz, "src")).filter((a) => arquivosTraduzidos(relative(raiz, a)));
const ignorados = new Set(lerLista(join(raiz, "src/content/i18n/ignorar.txt")).map((l) => l.id));

const vistos = new Set<string>();
const linhas: string[] = [];
const linhasJuridico: string[] = [];
let total = 0;
for (const arquivo of arquivos.sort()) {
  const rel = relative(raiz, arquivo);
  const codigo = readFileSync(arquivo, "utf8");
  const itens = await coletar(codigo, arquivo.endsWith(".tsx") ? "tsx" : "ts");
  const novos: string[] = [];
  const destino = ehJuridico(rel) ? linhasJuridico : linhas;
  for (const it of itens) {
    if (!pareceTexto(it.chave)) continue;
    const id = idDoTexto(it.chave);
    if (ignorados.has(id) || vistos.has(id)) continue;
    vistos.add(id);
    novos.push(`${id} ${textoParaLinha(it.chave)}`);
    total++;
  }
  if (novos.length > 0) destino.push(`# ${rel}`, ...novos);
}
writeFileSync(join(raiz, "src/content/i18n/pt.txt"), linhas.join("\n") + "\n");
writeFileSync(join(raiz, "src/content/i18n/pt-juridico.txt"), linhasJuridico.join("\n") + "\n");
console.log(`${total} textos em ${arquivos.length} arquivos (visual: pt.txt; jurídico: pt-juridico.txt)`);
