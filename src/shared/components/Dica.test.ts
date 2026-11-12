import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { servicosOrcamento } from "../../content/perguntas";
import { todasAsPerguntas } from "../lib/orcamento";
import { Dica, posicionarBalao } from "./Dica";

// O comportamento (hover, foco, toque, Esc, clique fora, um por vez) é conferido no navegador em e2e/dica.spec.ts.
// Aqui: a marcação acessível, a conta de posição e a regra de que toda pergunta tem `ajuda`.

describe("Dica: marcação", () => {
  const html = renderToStaticMarkup(createElement(Dica, { texto: "Explicação curta.", rotulo: "O que significa: Quantos usuários?" }));

  it("botão com aria-label, aria-expanded e aria-describedby apontando para o balão", () => {
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="O que significa: Quantos usuários?"');
    expect(html).toContain('aria-expanded="false"');
    const id = /aria-describedby="([^"]+)"/.exec(html)?.[1];
    expect(id).toBeTruthy();
    expect(html).toContain(`id="${id}"`);
    expect(html).toContain('role="tooltip"');
  });

  it("começa fechada (balão escondido) e o ícone visual é decorativo", () => {
    expect(html).toMatch(/<span[^>]*role="tooltip"[^>]*hidden|<span[^>]*hidden[^>]*role="tooltip"/);
    expect(html).toContain('aria-hidden="true"');
  });

  it("alvo de toque de 44 px (size-alvo) e foco visível", () => {
    expect(html).toContain("size-alvo");
    expect(html).toContain("focus-visible:outline-3");
  });
});

describe("posicionarBalao: sempre dentro da área visível", () => {
  const janela = { largura: 360, altura: 740 };

  it("embaixo quando cabe", () => {
    expect(posicionarBalao({ top: 100, bottom: 144, left: 300, width: 44 }, 80, janela).top).toBe(150);
  });

  it("vira para cima quando não cabe embaixo", () => {
    expect(posicionarBalao({ top: 650, bottom: 694, left: 100, width: 44 }, 120, janela).top).toBe(650 - 6 - 120);
  });

  it("não vaza pelas laterais em 360 px", () => {
    for (const left of [0, 8, 150, 316]) {
      const p = posicionarBalao({ top: 100, bottom: 144, left, width: 44 }, 80, janela);
      expect(p.left).toBeGreaterThanOrEqual(8);
      expect(p.left + p.width).toBeLessThanOrEqual(janela.largura - 8);
    }
  });

  it("em tela estreita o balão encolhe para caber", () => {
    expect(posicionarBalao({ top: 0, bottom: 44, left: 0, width: 44 }, 50, { largura: 300, altura: 600 }).width).toBe(284);
  });
});

describe("toda pergunta tem `ajuda`", () => {
  const todas = servicosOrcamento.flatMap((s) => todasAsPerguntas(s.perguntas).map((p) => ({ servico: s.id, p })));

  it("em todos os serviços, inclusive nas filhas condicionais", () => {
    expect(todas.length).toBeGreaterThan(20);
    for (const { servico, p } of todas) {
      expect(typeof p.ajuda, `${servico}/${p.id} sem ajuda`).toBe("string");
      expect(p.ajuda.trim().length, `${servico}/${p.id} com ajuda vazia`).toBeGreaterThan(15);
    }
  });

  it("textos curtos, sem preço nem prazo prometidos", () => {
    for (const { servico, p } of todas) {
      expect(p.ajuda, `${servico}/${p.id}: preço`).not.toMatch(/R\$|\b\d+ horas?\b|\bsoma \d/i);
      expect(p.ajuda, `${servico}/${p.id}: prazo`).not.toMatch(/\bprazo\b|\bdias?\b/i);
      expect(p.ajuda.length, `${servico}/${p.id}: longa demais`).toBeLessThanOrEqual(480);
    }
  });
});
