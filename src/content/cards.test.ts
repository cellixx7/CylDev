import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CardServico, inclusosDoCard, precoDoCard } from "../pages/negocios/CardServico";
import { servicosOrcamento } from "./perguntas";
import { servicoPorId } from "./servicos";
import { orcamento } from "./textos";

const ids = servicosOrcamento.map((s) => s.id);

const card = (id: string, noCarrinho: boolean) =>
  renderToStaticMarkup(
    createElement(CardServico, {
      servicoId: id,
      noCarrinho,
      aoVerDetalhes: () => {},
      aoFazerOrcamento: () => {},
      aoAlternarCarrinho: () => {},
    }),
  );

describe("cards de serviço", () => {
  it("são 8 e cada um tem uma linha própria em textos.ts", () => {
    expect(ids).toHaveLength(8);
    for (const id of ids) expect(orcamento.cards.linhas[id]?.length).toBeGreaterThan(10);
    expect(Object.keys(orcamento.cards.linhas).sort()).toEqual([...ids].sort());
  });

  it("mostram de 2 a 3 itens inclusos, vindos de servicos.ts", () => {
    for (const id of ids) {
      const s = servicoPorId(id)!;
      const itens = inclusosDoCard(s);
      expect(itens.length).toBeGreaterThanOrEqual(2);
      expect(itens.length).toBeLessThanOrEqual(3);
      expect(itens).toEqual(s.inclui.slice(0, itens.length));
    }
  });

  it("preço sai de servicos.ts: a partir de, por hora ou sob consulta", () => {
    expect(precoDoCard(servicoPorId("planilha")!)).toMatch(/^a partir de R\$\s?100/);
    expect(precoDoCard(servicoPorId("aulas")!)).toMatch(/R\$\s?50 por hora/);
    expect(precoDoCard(servicoPorId("sistema")!)).toBe("sob consulta");
  });

  it("não prometem prazo nem usam emoji nos textos dos cards", () => {
    const todos = [...Object.values(orcamento.cards.linhas), ...ids.map((id) => precoDoCard(servicoPorId(id)!))];
    for (const txt of todos) {
      expect(txt).not.toMatch(/\b\d+\s*(dias?|horas?|h)\b/i);
      expect(txt).not.toMatch(/\p{Extended_Pictographic}/u);
    }
  });
});

describe("card: botões e ícone de carrinho", () => {
  it("embaixo só há 'Fazer orçamento' e 'Ver detalhes'; o carrinho é o ícone", () => {
    const html = card("planilha", false);
    expect(html).toContain("Fazer orçamento");
    expect(html).toContain("Ver detalhes");
    expect(html).not.toContain(">Pôr no carrinho<");
    expect(html).not.toContain(">Tirar do carrinho<");
    expect(html).not.toContain(">No carrinho<");
    expect(html).not.toMatch(/type="checkbox"/);
    // dois botões de texto + o ícone
    expect(html.match(/<button/g)).toHaveLength(3);
  });

  it("vazio: aria-pressed false e rótulo completo 'Pôr ... no carrinho'", () => {
    const html = card("planilha", false);
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain('aria-label="Pôr Planilha organizada no carrinho"');
    expect(html).toContain("fill-transparent");
    expect(html).not.toContain("carrinho-pop");
  });

  it("no carrinho: aria-pressed true, rótulo 'Tirar ... do carrinho' e ícone preenchido", () => {
    const html = card("planilha", true);
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('aria-label="Tirar Planilha organizada do carrinho"');
    expect(html).toContain("fill-current");
    expect(html).toContain("carrinho-pop");
  });

  it("o título reserva espaço para o ícone", () => {
    expect(card("painel", false)).toMatch(/<h3[^>]*class="[^"]*pr-11/);
  });

  it("a dica não traz número de desconto e só menciona o combo para quem entra nele", () => {
    const { dica, dicaCombinavel, dicaDentro } = orcamento.cards.carrinho;
    for (const txt of [dica, dicaCombinavel, dicaDentro]) expect(txt).not.toMatch(/\d/);
    expect(dicaCombinavel).toMatch(/desconto/);
    expect(dica).not.toMatch(/desconto/);
  });
});
