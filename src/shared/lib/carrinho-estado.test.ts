import { describe, expect, it } from "vitest";
import { servicoOrcamentoPorId } from "../../content/perguntas";
import { adicionar, COMBO_IDS, estadoInicial, montarCombo, remover, responder } from "./carrinho-estado";
import { montarPedido } from "./pedido";

describe("carrinho-estado", () => {
  it("adicionar não duplica e ignora id desconhecido", () => {
    const a = adicionar(adicionar(estadoInicial(), "planilha"), "planilha");
    expect(a.ids).toEqual(["planilha"]);
    expect(adicionar(a, "nao-existe")).toBe(a);
  });

  it("remover tira só o item indicado", () => {
    const e = adicionar(adicionar(estadoInicial(), "planilha"), "painel");
    expect(remover(e, "planilha").ids).toEqual(["painel"]);
    expect(remover(e, "landing")).toBe(e);
  });

  it("pergunta de escolha única substitui a resposta anterior", () => {
    const p = servicoOrcamentoPorId("planilha")!.perguntas.find((q) => q.tipo === "unica")!;
    const [a, b] = p.opcoes;
    const e1 = responder(estadoInicial(), "planilha", p.id, a.id);
    const e2 = responder(e1, "planilha", p.id, b.id);
    expect(e2.respostas.planilha[p.id]).toBe(b.id);
  });

  it("pergunta de múltipla liga e desliga a opção", () => {
    const p = servicoOrcamentoPorId("painel")!.perguntas.find((q) => q.tipo === "multipla")!;
    const [a, b] = p.opcoes;
    let e = responder(estadoInicial(), "painel", p.id, a.id);
    e = responder(e, "painel", p.id, b.id);
    expect(e.respostas.painel[p.id]).toEqual([a.id, b.id]);
    e = responder(e, "painel", p.id, a.id);
    expect(e.respostas.painel[p.id]).toEqual([b.id]);
  });

  it("resposta com pergunta inexistente não muda o estado", () => {
    const e = estadoInicial();
    expect(responder(e, "planilha", "nao-existe", "x")).toBe(e);
  });

  it("remover e readicionar preserva as respostas", () => {
    const p = servicoOrcamentoPorId("planilha")!.perguntas.find((q) => q.tipo === "unica")!;
    let e = adicionar(estadoInicial(), "planilha");
    e = responder(e, "planilha", p.id, p.opcoes[0].id);
    e = adicionar(remover(e, "planilha"), "planilha");
    expect(e.respostas.planilha[p.id]).toBe(p.opcoes[0].id);
  });

  it("aulas começam no formato avulso", () => {
    expect(estadoInicial().respostas.aulas).toEqual({ pagamento: "avulsa" });
  });

  it("combo acrescenta só o que falta, sem duplicar", () => {
    const e = montarCombo(adicionar(estadoInicial(), "painel"));
    expect([...e.ids].sort()).toEqual([...COMBO_IDS].sort());
    expect(e.ids.filter((i) => i === "painel")).toHaveLength(1);
    expect(montarCombo(e)).toBe(e);
  });

  it("pôr no carrinho sem respostas entra com o preço de tabela e perguntas em aberto", () => {
    const e = adicionar(estadoInicial(), "planilha");
    const item = montarPedido(e.ids, e.respostas).itens[0];
    expect(item.preco).toBe(item.precoBase);
    expect(item.perguntasRespondidas).toBe(0);
    expect(item.perguntasTotal).toBeGreaterThan(0);
  });

  it("serviço sob consulta entra no carrinho sem valor", () => {
    const e = adicionar(estadoInicial(), "sistema");
    const item = montarPedido(e.ids, e.respostas).itens[0];
    expect(item.sobConsulta).toBe(true);
    expect(item.preco).toBeNull();
  });
});
