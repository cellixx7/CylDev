import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { VALOR_HORA_EXTRA } from "../../content/orcamento";
import { orcamento } from "../../content/textos";
import { brl } from "../../shared/lib/formato";
import { calcularCarrinho } from "../../shared/lib/orcamento";
import { DialogoValor, PorQueEsseValor } from "./PorQueEsseValor";

const t = orcamento.valor;
const noop = () => {};
const render = (aberto: boolean, ids: string[], respostas = {}) =>
  renderToStaticMarkup(createElement(DialogoValor, { aberto, carrinho: calcularCarrinho(ids, respostas), respostas, aoFechar: noop }));

describe("Por que esse valor?", () => {
  it("o botão tem o texto certo e avisa que abre um diálogo", () => {
    const html = renderToStaticMarkup(createElement(PorQueEsseValor, { ids: [], respostas: {} }));
    expect(html).toContain(t.botao);
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain("min-h-alvo");
  });

  it("fechado: o dialog não tem conteúdo", () => {
    const html = render(false, ["planilha"]);
    expect(html).toContain("<dialog");
    expect(html).not.toContain(t.geral.titulo);
  });

  it("vazio: só a parte geral, com a hora extra e os combos vindos das constantes", () => {
    const html = render(true, []);
    expect(html).toContain(t.geral.titulo);
    expect(html).toContain(brl(VALOR_HORA_EXTRA));
    expect(html).toContain("10%");
    expect(html).toContain("15%");
    expect(html).toContain(t.vazio);
    expect(html).not.toContain(t.pedido.titulo);
  });

  it("com carrinho: dialog rotulado, tabela semântica e totais", () => {
    const carrinho = calcularCarrinho(["planilha", "painel"]);
    const html = render(true, ["planilha", "painel"]);
    expect(html).toMatch(/<dialog[^>]*aria-labelledby="[^"]+"/);
    expect(html).toContain(t.pedido.titulo);
    expect(html).toContain("<table");
    expect(html).toContain('scope="row"');
    expect(html).toContain("<caption");
    expect(html).toContain(brl(carrinho.total));
    expect(html).toContain(t.pedido.descontoLinha("combo 10%"));
    expect(html).toContain("size-alvo");
    expect(html).toContain("dvh");
    expect(html).toContain("safe-area-inset-bottom");
  });

  it("sistema sob consulta aparece como fora do total", () => {
    expect(render(true, ["planilha", "sistema"])).toContain(t.pedido.sobConsulta);
  });
});
