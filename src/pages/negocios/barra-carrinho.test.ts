import { describe, expect, it } from "vitest";
import { servicoOrcamentoPorId } from "../../content/perguntas";
import { adicionar, estadoInicial, responder } from "../../shared/lib/carrinho-estado";
import { montarPedido } from "../../shared/lib/pedido";
import { totalCurto } from "./BarraCarrinho";

const pedidoDe = (ids: string[], respostas?: ReturnType<typeof estadoInicial>["respostas"]) => {
  const e = ids.reduce(adicionar, estadoInicial());
  return montarPedido(e.ids, respostas ?? e.respostas, "", { piloto: null });
};

describe("total da barra do carrinho", () => {
  it("vazio: sem texto", () => {
    expect(totalCurto(pedidoDe([]))).toBe("");
  });

  it("com pergunta sem resposta: estimativa a partir de", () => {
    expect(totalCurto(pedidoDe(["planilha"]))).toMatch(/^estimativa a partir de R\$\s?100/);
  });

  it("sob consulta puro mostra 'Sob consulta'", () => {
    expect(totalCurto(pedidoDe(["sistema"]))).toBe("Sob consulta");
  });

  it("o total é o do carrinho (desconto do combo incluso)", () => {
    const p = pedidoDe(["planilha", "painel"]);
    expect(totalCurto(p).replace(/\s/g, " ")).toContain(p.carrinho.total.toLocaleString("pt-BR"));
    expect(p.carrinho.desconto).not.toBeNull();
  });

  it("responder tudo tira o prefixo de estimativa", () => {
    let e = adicionar(estadoInicial(), "planilha");
    for (const p of servicoOrcamentoPorId("planilha")!.perguntas) e = responder(e, "planilha", p.id, p.opcoes[0].id);
    expect(totalCurto(montarPedido(e.ids, e.respostas, "", { piloto: null }))).not.toMatch(/estimativa/);
  });
});
