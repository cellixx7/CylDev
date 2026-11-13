import { cenasEstagio } from "../../content/cenasEstagio";

type Linha = (typeof cenasEstagio.planilha.linhas)[number];

/** Total, quantidade e soma por setor (na ordem em que o setor aparece), a partir das linhas da planilha. */
export function resumoPlanilha(linhas: readonly Pick<Linha, "setor" | "valor">[] = cenasEstagio.planilha.linhas) {
  const porSetor = new Map<string, number>();
  for (const l of linhas) porSetor.set(l.setor, (porSetor.get(l.setor) ?? 0) + l.valor);
  return {
    total: linhas.reduce((s, l) => s + l.valor, 0),
    quantidade: linhas.length,
    setores: [...porSetor].map(([setor, valor]) => ({ setor, valor })),
  };
}

/** Quanto tempo (ms) cada passo da planilha fica na tela. O último, o painel, fica mais. */
export const duracaoPassosPlanilha = [2600, 2200, 2400, 4600] as const;
/** Quanto tempo (ms) cada slide fica na tela. */
export const duracaoSlides = [4200, 4200] as const;

/** Próximo passo de um ciclo de `n` passos. */
export const proximo = (atual: number, n: number) => (atual + 1) % n;
