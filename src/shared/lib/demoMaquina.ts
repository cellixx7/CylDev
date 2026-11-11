// Máquina de passos comum a todas as demonstrações de Como funciona. Lógica pura.
// Passo 0 = o começo. Passo N = depois de aplicar os N primeiros passos da demonstração.

export type EstadoDemo = { passo: number; tocando: boolean };
export type AcaoDemo = "reproduzir" | "pausar" | "avancar" | "verResultado" | "recomecar";

export const estadoInicialDemo: EstadoDemo = { passo: 0, tocando: false };

/** `ultimo` = número do último passo (a quantidade de passos da demonstração). */
export function reduzirPassos(estado: EstadoDemo, acao: AcaoDemo, ultimo: number): EstadoDemo {
  switch (acao) {
    case "reproduzir":
      // No final, "Reproduzir" começa de novo em vez de não fazer nada.
      return estado.passo >= ultimo ? { passo: 0, tocando: true } : { ...estado, tocando: true };
    case "pausar":
      return { ...estado, tocando: false };
    case "avancar": {
      // Um relógio atrasado não anda depois de uma pausa.
      if (!estado.tocando || estado.passo >= ultimo) return estado;
      const passo = estado.passo + 1;
      return { passo, tocando: passo < ultimo };
    }
    case "verResultado":
      return { passo: ultimo, tocando: false };
    case "recomecar":
      return estadoInicialDemo;
  }
}
