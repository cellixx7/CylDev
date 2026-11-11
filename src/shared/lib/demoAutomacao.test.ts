import { describe, expect, it } from "vitest";
import { demoAutomacao } from "../../content/demoAutomacao";
import { juntar, semCanceladas, somar, visaoDoPasso } from "./demoAutomacao";

const ultimo = demoAutomacao.passos.length;

describe("demonstração da automação", () => {
  it("passo 0: arquivos separados, sem total", () => {
    const v = visaoDoPasso(0);
    expect(v.separados).toBe(true);
    expect(v.total).toBeNull();
    expect(v.botaoClicado).toBe(false);
  });

  it("passo 1 junta todas as linhas; passo 2 tira só as canceladas", () => {
    const todas = demoAutomacao.arquivos.reduce((s, a) => s + a.linhas.length, 0);
    expect(visaoDoPasso(1).linhas).toHaveLength(todas);
    expect(visaoDoPasso(1).separados).toBe(false);
    const v2 = visaoDoPasso(2);
    expect(v2.linhas.length).toBeLessThan(todas);
    expect(v2.linhas.every((l) => l.situacao === "ok")).toBe(true);
    expect(v2.total).toBeNull();
  });

  it("o total conferido é a soma das linhas que sobraram", () => {
    const v = visaoDoPasso(3);
    expect(v.total).toBe(somar(semCanceladas(juntar())));
    expect(v.total).toBe(175);
  });

  it("o clique chega ao mesmo resultado dos passos manuais", () => {
    const manual = visaoDoPasso(ultimo - 1);
    const clique = visaoDoPasso(ultimo);
    expect(clique.linhas).toEqual(manual.linhas);
    expect(clique.total).toBe(manual.total);
    expect(clique.botaoClicado).toBe(true);
    expect(manual.botaoClicado).toBe(false);
  });

  it("o texto não promete tempo nem economia", () => {
    const texto = JSON.stringify([demoAutomacao.passos, demoAutomacao.resultado, demoAutomacao.aviso]);
    expect(texto).not.toMatch(/\d+\s*(min|minutos|hora|horas|segundos)|%|economiz|qualquer tarefa/i);
  });
});
