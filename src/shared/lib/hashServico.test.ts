import { describe, expect, it } from "vitest";
import { servicosOrcamento } from "../../content/perguntas";
import { lerHash, montarHash } from "./hashServico";

describe("hashServico", () => {
  it("todo id de serviço abre na aba Detalhes e, com /orcamento, na aba Orçamento", () => {
    for (const { id } of servicosOrcamento) {
      expect(lerHash(`#${id}`)).toEqual({ id, aba: "detalhes" });
      expect(lerHash(`#${id}/orcamento`)).toEqual({ id, aba: "orcamento" });
    }
  });

  it("sufixo desconhecido cai em Detalhes", () => {
    expect(lerHash("#planilha/qualquer")).toEqual({ id: "planilha", aba: "detalhes" });
    expect(lerHash("#planilha/")).toEqual({ id: "planilha", aba: "detalhes" });
  });

  it("hash vazio, inválido ou malformado devolve null", () => {
    for (const h of ["", "#", "#nao-existe", "#nao-existe/orcamento", "#%E0%A4%A", "#/orcamento"]) {
      expect(lerHash(h)).toBeNull();
    }
  });

  it("ids de seção da página não são lidos como serviço", () => {
    for (const h of ["#apresentacao", "#orcamento", "#entregas", "#como-funciona", "#sobre", "#contato", "#conteudo"]) {
      expect(lerHash(h)).toBeNull();
    }
  });

  it("ida e volta: serviço + aba -> hash -> serviço + aba", () => {
    for (const { id } of servicosOrcamento) {
      for (const aba of ["detalhes", "orcamento"] as const) {
        expect(lerHash(montarHash(id, aba))).toEqual({ id, aba });
      }
    }
  });

  it("nenhum id de serviço colide com id de seção da página", () => {
    const secoes = ["apresentacao", "orcamento", "entregas", "como-funciona", "sobre", "contato", "conteudo"];
    for (const { id } of servicosOrcamento) expect(secoes).not.toContain(id);
  });
});
