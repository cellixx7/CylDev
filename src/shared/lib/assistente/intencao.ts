import { conceitos, intencoes, type Intencao } from "../../../content/assistente";
import { chave, contemFrase, distanciaAte1, palavras, radical } from "./normalizar";

// Detecção de conceitos e de intenção. "quanto custa", "valor" e "preço" viram o mesmo conceito (`preco`), e o conceito
// vira a intenção `preco`. Toda a vocabulário mora em content/assistente.ts.

type FraseCompilada = { conceito: string; chave: string; umaPalavra: boolean };

let compiladas: FraseCompilada[] | null = null;

function frases(): FraseCompilada[] {
  if (compiladas) return compiladas;
  compiladas = Object.entries(conceitos).flatMap(([conceito, lista]) =>
    lista.map((frase) => {
      const c = chave(frase);
      return { conceito, chave: c, umaPalavra: !c.includes(" ") };
    }),
  );
  return compiladas;
}

/** Conceitos presentes na mensagem (ids como `preco` ou `svc:planilha`). */
export function conceitosDe(texto: string): Set<string> {
  const achados = new Set<string>();
  const c = chave(texto);
  if (!c) return achados;
  const radicais = palavras(texto).map(radical);
  for (const f of frases()) {
    if (achados.has(f.conceito)) continue;
    if (contemFrase(c, f.chave)) {
      achados.add(f.conceito);
      continue;
    }
    // Erro de digitação em palavra de 5 letras ou mais ("orcamneto", "planilah"): uma letra de diferença, mesma inicial.
    if (f.umaPalavra && f.chave.length >= 5 && radicais.some((r) => r.length >= 5 && r[0] === f.chave[0] && distanciaAte1(r, f.chave))) {
      achados.add(f.conceito);
    }
  }
  return achados;
}

/** Melhor intenção pela soma de conceitos; empate vale a ordem de `intencoes`. `null` se nenhuma bate. */
export function intencaoDe(achados: Set<string>): Intencao | null {
  let melhor: Intencao | null = null;
  let pontos = 0;
  for (const i of intencoes) {
    const p = i.conceitos.filter((c) => achados.has(c)).length;
    if (p > pontos) {
      melhor = i.id;
      pontos = p;
    }
  }
  return melhor;
}

/** Ids dos serviços citados. `automacao?` (só "automação") vira os dois candidatos, para o chat perguntar qual. */
export function servicosCitados(achados: Set<string>): string[] {
  const ids: string[] = [];
  for (const c of achados) {
    if (c === "svc:automacao?") continue;
    if (c.startsWith("svc:")) ids.push(c.slice(4));
  }
  if (achados.has("svc:automacao?") && !ids.includes("automacao") && !ids.includes("python")) ids.push("automacao", "python");
  return ids;
}
