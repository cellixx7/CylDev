import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { servicoOrcamentoPorId } from "../../content/perguntas";
import { calcularServico, type Respostas } from "../../shared/lib/orcamento";
import { progressoDoServico } from "../../shared/lib/pedido";
import { PrecoRodape, rotuloDoPreco } from "./ResumoEstimativa";

const tudoRespondido = (id: string): Respostas =>
  Object.fromEntries(servicoOrcamentoPorId(id)!.perguntas.map((p) => [p.id, p.tipo === "unica" ? p.opcoes[0].id : [p.opcoes[0].id]]));

const rotulo = (id: string, respostas: Respostas) => {
  const c = calcularServico(id, respostas)!;
  return rotuloDoPreco(c, progressoDoServico(servicoOrcamentoPorId(id)!, respostas));
};

describe("rótulo do preço no modal", () => {
  it("com pergunta sem resposta: 'estimativa a partir de'", () => {
    for (const id of ["planilha", "painel", "automacao", "landing", "bot-essencial", "bot-ia"]) {
      expect(rotulo(id, {}), id).toBe("estimativa a partir de");
    }
    expect(rotulo("planilha", { [servicoOrcamentoPorId("planilha")!.perguntas[0].id]: servicoOrcamentoPorId("planilha")!.perguntas[0].opcoes[0].id })).toBe(
      "estimativa a partir de",
    );
  });

  it("com tudo respondido: só 'estimativa'", () => {
    for (const id of ["planilha", "painel", "automacao", "landing", "bot-essencial", "bot-ia"]) {
      expect(rotulo(id, tudoRespondido(id)), id).toBe("estimativa");
    }
  });

  it("aulas e sob consulta não ganham rótulo", () => {
    expect(rotulo("aulas", {})).toBeNull();
    expect(rotulo("sistema", {})).toBeNull();
  });

  it("o rodapé mostra o rótulo, o preço de tabela riscado e o desconto de piloto", () => {
    const c = calcularServico("planilha", {})!;
    const html = renderToStaticMarkup(createElement(PrecoRodape, { c, progresso: progressoDoServico(servicoOrcamentoPorId("planilha")!, {}) }));
    expect(html).toContain("estimativa a partir de");
    expect(html).toContain("<s ");
    expect(html).toMatch(/\d+% de desconto \(piloto\)/);
  });

  it("o valor continua sendo o de calcularServico (o rótulo não muda número)", () => {
    const antes = calcularServico("painel", {})!.preco;
    rotulo("painel", {});
    expect(calcularServico("painel", {})!.preco).toBe(antes);
  });
});
