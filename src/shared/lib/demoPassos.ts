import { demoPlanilha, type LinhaDemo } from "../../content/demoPlanilha";
import { reduzirPassos, type AcaoDemo, type EstadoDemo } from "./demoMaquina";

// Passos da demonstração da planilha, sobre a máquina comum (demoMaquina.ts).
// Passo 0 = a tabela bagunçada. Passo N = depois de aplicar os N primeiros passos de `demoPlanilha.passos`.

export type { AcaoDemo, EstadoDemo } from "./demoMaquina";
export { estadoInicialDemo } from "./demoMaquina";

export const ultimoPasso = demoPlanilha.passos.length;

export const reduzirDemo = (estado: EstadoDemo, acao: AcaoDemo): EstadoDemo => reduzirPassos(estado, acao, ultimoPasso);

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
