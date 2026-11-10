import { describe, expect, it } from "vitest";
import { inclusosDoCard, precoDoCard } from "../pages/negocios/CardServico";
import { servicosOrcamento } from "./perguntas";
import { servicoPorId } from "./servicos";
import { orcamento } from "./textos";

const ids = servicosOrcamento.map((s) => s.id);

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
