// Build de todos os idiomas. O português sai em dist/ (raiz); cada outro idioma é um build à parte, com IDIOMA=<codigo>,
// cujos HTML vão para dist/<codigo>/ e cujos arquivos de assets (nomes com hash) entram na mesma pasta dist/assets/.
// Uso: node scripts/build-idiomas.mjs            (todos)
//      node scripts/build-idiomas.mjs pt en      (só estes; útil para testar)
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const raiz = resolve(import.meta.dirname, "..");
const todos = JSON.parse(readFileSync(join(raiz, "src/shared/i18n/ativos.json"), "utf8"));
const pedidos = process.argv.slice(2);
const lista = pedidos.length > 0 ? pedidos : todos;
const dist = join(raiz, "dist");
const temporaria = join(raiz, "node_modules", ".cache", "idiomas");

function vite(idioma, saida) {
  const r = spawnSync("npx", ["vite", "build", "--outDir", saida, "--emptyOutDir"], {
    cwd: raiz,
    stdio: "inherit",
    env: { ...process.env, IDIOMA: idioma },
  });
  if (r.status !== 0) {
    console.error(`Build do idioma "${idioma}" falhou.`);
    process.exit(r.status ?? 1);
  }
}

function arquivos(pasta) {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    return statSync(caminho).isDirectory() ? arquivos(caminho) : [caminho];
  });
}

rmSync(dist, { recursive: true, force: true });
rmSync(temporaria, { recursive: true, force: true });

for (const idioma of lista) {
  if (idioma === "pt") {
    vite("pt", dist);
    continue;
  }
  if (!existsSync(join(raiz, "src/content/i18n", idioma, "meta.json"))) {
    console.error(`Falta src/content/i18n/${idioma}/meta.json: o idioma "${idioma}" não está traduzido.`);
    process.exit(1);
  }
  const saida = join(temporaria, idioma);
  vite(idioma, saida);
  mkdirSync(dist, { recursive: true });
  for (const arquivo of arquivos(saida)) {
    const rel = relative(saida, arquivo);
    const destino = rel.startsWith(`assets${"/"}`) ? join(dist, rel) : join(dist, idioma, rel);
    mkdirSync(join(destino, ".."), { recursive: true });
    cpSync(arquivo, destino);
  }
}
rmSync(temporaria, { recursive: true, force: true });
