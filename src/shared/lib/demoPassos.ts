import { demoPlanilha, type LinhaDemo } from "../../content/demoPlanilha";

// Máquina de passos da demonstração. Lógica pura: o componente só desenha e liga o relógio.
// Passo 0 = a tabela bagunçada. Passo N = depois de aplicar os N primeiros passos de `demoPlanilha.passos`.

export type EstadoDemo = { passo: number; tocando: boolean };
export type AcaoDemo = "reproduzir" | "pausar" | "avancar" | "verResultado" | "recomecar";

export const ultimoPasso = demoPlanilha.passos.length;
export const estadoInicialDemo: EstadoDemo = { passo: 0, tocando: false };

export function reduzirDemo(estado: EstadoDemo, acao: AcaoDemo): EstadoDemo {
  switch (acao) {
    case "reproduzir":
      // No final, "Reproduzir" começa de novo em vez de não fazer nada.
      return estado.passo >= ultimoPasso ? { passo: 0, tocando: true } : { ...estado, tocando: true };
    case "pausar":
      return { ...estado, tocando: false };
    case "avancar": {
      // Um relógio atrasado não anda depois de uma pausa.
      if (!estado.tocando || estado.passo >= ultimoPasso) return estado;
      const passo = estado.passo + 1;
      return { passo, tocando: passo < ultimoPasso };
    }
    case "verResultado":
      return { passo: ultimoPasso, tocando: false };
    case "recomecar":
      return estadoInicialDemo;
  }
}

export type CelulasLinha = {
  id: string;
  /** Antes do passo 4: data + anotação. Depois: data, cliente, item e valor. */
  data: string;
  nota: string | null;
  colunas: [string, string, string] | null;
};

/** As linhas que aparecem no passo, já com o texto daquele momento. */
export function linhasDoPasso(passo: number): CelulasLinha[] {
  return demoPlanilha.linhas
    .filter((l: LinhaDemo) => l.saiNoPasso === undefined || passo < l.saiNoPasso)
    .map((l) => ({
      id: l.id,
      data: l.data[passo >= 1 ? 1 : 0],
      nota: passo >= 4 ? null : l.nota[passo >= 2 ? 1 : 0],
      colunas: passo >= 4 ? l.colunas : null,
    }));
}

export function totalDoPasso(passo: number): string {
  const t = demoPlanilha.totais;
  if (passo < 3) return t.comRepetida;
  return passo < ultimoPasso ? t.semConferir : t.conferido;
}

export const cabecalhoDoPasso = (passo: number) =>
  passo >= 4 ? demoPlanilha.cabecalhoColunas : demoPlanilha.cabecalhoBagunca;
