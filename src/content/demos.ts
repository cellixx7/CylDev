// Peças comuns das demonstrações animadas de Como funciona (planilha, painel e automação).
// Os dados e os textos de cada uma ficam em demoPlanilha.ts, demoPainel.ts e demoAutomacao.ts.

export type PassoDemo = { titulo: string; descricao: string };

export type TextosDemo = {
  titulo: string;
  rotulo: string;
  intervaloMs: number;
  resultado: string;
  comecoRotulo: string;
  comecoDescricao: string;
  passos: PassoDemo[];
  dica: string;
  controles: { reproduzir: string; pausar: string; verResultado: string; recomecar: string };
  rotuloControles: string;
  passoAtual: (n: number, total: number) => string;
  listaPassosRotulo: string;
  antes: string;
  depois: string;
};

/** Textos iguais em todas as demonstrações. */
export const demoComum = {
  rotulo: "Exemplo com dados fictícios",
  intervaloMs: 2200,
  dica: "Aperte Reproduzir para ver cada passo, ou Ver resultado para ir direto ao final.",
  controles: {
    reproduzir: "Reproduzir",
    pausar: "Pausar",
    verResultado: "Ver resultado",
    recomecar: "Recomeçar",
  },
  rotuloControles: "Controles da demonstração",
  passoAtual: (n: number, total: number) => `Passo ${n} de ${total}`,
  listaPassosRotulo: "O que muda em cada passo",
  antes: "Antes",
  depois: "Depois",
};

/** Serviço (id em servicos.ts) -> bloco de Como funciona (id em exemplos.ts) que tem demonstração animada. */
export const servicosComDemo: Record<string, string> = {
  planilha: "planilhas",
  painel: "paineis",
  automacao: "automacao",
};
