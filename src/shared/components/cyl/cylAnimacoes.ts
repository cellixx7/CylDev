// Definições do movimento do Cyl (dados, sem React). Só `transform` e `opacity`, em rotação de corpo rígido em torno do pivô de
// cada articulação (unidades do viewBox do mestre). O estado final de cada animação é igual ao inicial.

export type NomeAnimacao = "idle" | "wave" | "piscar";

type Pivo = readonly [number, number];

export const PIVOS = {
  "arm-left-upper": [343, 555],
  "arm-left-forearm": [396, 617],
  "hand-left-wave": [432, 596],
  "hand-left-rest": [432, 596],
  head: [298, 536],
} as const satisfies Record<string, Pivo>;

type Passo = { offset: number; valor: number };
type Faixa = { parte: string; tipo: "rotacao" | "subir" | "opacidade"; pivo?: Pivo; passos: Passo[] };

export type DefinicaoAnimacao = { duracaoMs: number; faixas: Faixa[] };

/** Rotação no pivô, escrita sem depender de `transform-box`: translate(pivô) rotate(a) translate(-pivô), com origem 0 0. */
export const rotacaoEm = (graus: number, [x, y]: Pivo) => `translate(${x}px, ${y}px) rotate(${graus}deg) translate(${-x}px, ${-y}px)`;

// Fases (de 2,5 s): 0–0,4 parado · 0,4–0,9 sobe · 0,9–1,8 acena duas vezes · 1,8–2,3 desce · 2,3–2,5 assenta.
const T = { sobe: 0.16, topo: 0.36, desce: 0.72, baixo: 0.92 };
const ACENO_BRACO = -34;
const ACENO_ANTEBRACO = 44;
const ACENO_MAO = 17;
/** Balanço do pulso em torno de ACENO_MAO. Com mais de ~12° a mão vira ventilador, e abaixo de ~6° o dedo encosta na barbicha. */
const AMPLITUDE_MAO = 11;
/** Quanto a pálpebra desce (unidades do viewBox) para cobrir o olho na piscada. */
const PISCAR_DESCE = 24;


/**
 * Pose parada do joinha: braço esquerdo dobrado, antebraço para cima, mão na frente do peito.
 * PROVISÓRIO: não existe o asset da mão de joinha (parts/hand-left-thumbsup.svg). Enquanto isso, `MAO_JOINHA` é a mão fechada
 * de repouso. Quando o asset existir, é só entrar no cylSvg.ts com data-parte="hand-left-thumbsup" e trocar esta constante.
 */
export const MAO_JOINHA = "hand-left-rest";
export const POSES = {
  joinha: [
    { parte: "arm-left-upper", graus: 15 },
    { parte: "arm-left-forearm", graus: -70 },
    { parte: MAO_JOINHA, graus: 0 },
  ],
} as const satisfies Record<string, readonly { parte: keyof typeof PIVOS; graus: number }[]>;
export type NomePose = keyof typeof POSES;

export const ANIMACOES: Record<NomeAnimacao, DefinicaoAnimacao> = {
  idle: { duracaoMs: 0, faixas: [] },
  // Piscada: olhos somem e a pálpebra desce sobre eles por ~150 ms (só opacity e transform). Termina como começa.
  piscar: {
    duracaoMs: 150,
    faixas: [
      { parte: "eyes", tipo: "opacidade", passos: [{ offset: 0, valor: 1 }, { offset: 0.2, valor: 0 }, { offset: 0.8, valor: 0 }, { offset: 1, valor: 1 }] },
      { parte: "eyelids", tipo: "subir", passos: [{ offset: 0, valor: 0 }, { offset: 0.2, valor: PISCAR_DESCE }, { offset: 0.8, valor: PISCAR_DESCE }, { offset: 1, valor: 0 }] },
    ],
  },
  wave: {
    duracaoMs: 2500,
    faixas: [
      {
        parte: "arm-left-upper",
        tipo: "rotacao",
        pivo: PIVOS["arm-left-upper"],
        passos: [
          { offset: 0, valor: 0 },
          { offset: T.sobe, valor: 0 },
          { offset: T.topo, valor: ACENO_BRACO },
          { offset: T.desce, valor: ACENO_BRACO },
          { offset: T.baixo, valor: 0 },
          { offset: 1, valor: 0 },
        ],
      },
      {
        parte: "arm-left-forearm",
        tipo: "rotacao",
        pivo: PIVOS["arm-left-forearm"],
        passos: [
          { offset: 0, valor: 0 },
          { offset: T.sobe, valor: 0 },
          { offset: T.topo, valor: ACENO_ANTEBRACO },
          // O antebraço gira um pouco no sentido contrário ao da mão (±3°), para o balanço parecer de pulso e não de ventilador.
          { offset: 0.44, valor: ACENO_ANTEBRACO - 3 },
          { offset: 0.52, valor: ACENO_ANTEBRACO + 3 },
          { offset: 0.6, valor: ACENO_ANTEBRACO - 3 },
          { offset: 0.68, valor: ACENO_ANTEBRACO + 3 },
          { offset: T.desce, valor: ACENO_ANTEBRACO },
          { offset: T.baixo, valor: 0 },
          { offset: 1, valor: 0 },
        ],
      },
      {
        parte: "hand-left-wave",
        tipo: "rotacao",
        pivo: PIVOS["hand-left-wave"],
        passos: [
          { offset: 0, valor: 0 },
          { offset: T.sobe, valor: 0 },
          { offset: T.topo, valor: ACENO_MAO },
          { offset: 0.44, valor: ACENO_MAO + AMPLITUDE_MAO },
          { offset: 0.52, valor: ACENO_MAO - AMPLITUDE_MAO },
          { offset: 0.6, valor: ACENO_MAO + AMPLITUDE_MAO },
          { offset: 0.68, valor: ACENO_MAO - AMPLITUDE_MAO },
          { offset: T.desce, valor: ACENO_MAO },
          { offset: T.baixo, valor: 0 },
          { offset: 1, valor: 0 },
        ],
      },
      // Troca das mãos (crossfade de 65 ms) no meio da subida e da descida, quando o antebraço está mais rápido e a mão mais longe do rosto.
      { parte: "hand-left-rest", tipo: "opacidade", passos: [{ offset: 0, valor: 1 }, { offset: 0.245, valor: 1 }, { offset: 0.271, valor: 0 }, { offset: 0.807, valor: 0 }, { offset: 0.833, valor: 1 }, { offset: 1, valor: 1 }] },
      { parte: "hand-left-wave", tipo: "opacidade", passos: [{ offset: 0, valor: 0 }, { offset: 0.245, valor: 0 }, { offset: 0.271, valor: 1 }, { offset: 0.807, valor: 1 }, { offset: 0.833, valor: 0 }, { offset: 1, valor: 0 }] },
      // Cabeça inclina uns graus durante o aceno; sobrancelhas sobem um pouco (expressão mais simpática).
      {
        parte: "head",
        tipo: "rotacao",
        pivo: PIVOS.head,
        passos: [{ offset: 0, valor: 0 }, { offset: T.sobe, valor: 0 }, { offset: T.topo, valor: 3 }, { offset: T.desce, valor: 3 }, { offset: T.baixo, valor: 0 }, { offset: 1, valor: 0 }],
      },
      { parte: "brows", tipo: "subir", passos: [{ offset: 0, valor: 0 }, { offset: T.sobe, valor: 0 }, { offset: T.topo, valor: -4 }, { offset: T.desce, valor: -4 }, { offset: T.baixo, valor: 0 }, { offset: 1, valor: 0 }] },
    ],
  },
};


export function quadros(faixa: Faixa): Keyframe[] {
  return faixa.passos.map(({ offset, valor }) => {
    if (faixa.tipo === "opacidade") return { offset, opacity: valor, easing: "linear" };
    const transform = faixa.tipo === "rotacao" ? rotacaoEm(valor, faixa.pivo!) : `translate(0px, ${valor}px)`;
    return { offset, transform, easing: "ease-in-out" };
  });
}
