import { demoAutomacao, type LinhaArquivo } from "../../content/demoAutomacao";

// Contas da demonstração da automação. Passo 0 = três arquivos; 1 = juntos; 2 = sem as canceladas;
// 3 = com o total conferido; 4 = o mesmo resultado, vindo de um clique.

export type LinhaJunta = LinhaArquivo & { arquivo: string };

export const juntar = (): LinhaJunta[] =>
  demoAutomacao.arquivos.flatMap((a) => a.linhas.map((l) => ({ ...l, arquivo: a.nome })));

export const semCanceladas = (linhas: LinhaJunta[]) => linhas.filter((l) => l.situacao !== "cancelado");

export const somar = (linhas: LinhaArquivo[]) => linhas.reduce((s, l) => s + l.valor, 0);

export type VisaoAutomacao = {
  separados: boolean;
  linhas: LinhaJunta[];
  total: number | null;
  botaoClicado: boolean;
};

export function visaoDoPasso(passo: number): VisaoAutomacao {
  const todas = juntar();
  const linhas = passo >= 2 ? semCanceladas(todas) : todas;
  return {
    separados: passo === 0,
    linhas,
    total: passo >= 3 ? somar(linhas) : null,
    botaoClicado: passo >= 4,
  };
}
