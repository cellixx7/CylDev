import { describe, expect, it } from "vitest";
import { servicoPorId } from "../../content/servicos";
import { comDesconto, descontoPilotoAtual, estimar, mensalidadeDe, resumoOrcamento } from "./orcamento";

describe("descontoPilotoAtual", () => {
  it("usa 10% enquanto houver vaga, depois 5%", () => {
    expect(descontoPilotoAtual(5, 5)).toEqual({ percentual: 10, restam: 5 });
    expect(descontoPilotoAtual(0, 3)).toEqual({ percentual: 5, restam: 3 });
  });

  it("some quando as vagas acabam", () => {
    expect(descontoPilotoAtual(0, 0)).toBeNull();
  });
});

describe("mensalidadeDe", () => {
  it("é 10% do preço de criação", () => {
    expect(mensalidadeDe(300)).toBe(30);
    expect(mensalidadeDe(500)).toBe(50);
  });
});

describe("estimar", () => {
  it("dobra horas e preço no caso complexo", () => {
    expect(estimar(servicoPorId("painel")!, "basico")).toEqual({ horas: 4, preco: 200, dias: 3, aPartirDe: false });
    expect(estimar(servicoPorId("painel")!, "complexo")).toEqual({ horas: 8, preco: 400, dias: 5, aPartirDe: false });
  });

  it("planilha básica sai em 2 dias úteis", () => {
    expect(estimar(servicoPorId("planilha")!, "basico")?.dias).toBe(2);
  });

  it("ignora pacotes sem preço calculável", () => {
    expect(estimar(servicoPorId("aulas")!, "basico")).toBeNull();
    expect(estimar(servicoPorId("sistema")!, "basico")).toBeNull();
  });
});

describe("comDesconto", () => {
  it("aplica o percentual e arredonda", () => {
    expect(comDesconto(400, 10)).toBe(360);
    expect(comDesconto(450, 5)).toBe(428);
  });
});

describe("resumoOrcamento", () => {
  // brl() usa espaço não separável entre "R$" e o número.
  const limpo = (t: string) => t.replace(/ /g, " ");

  it("leva tamanho, preço com piloto, horas e prazo", () => {
    const r = resumoOrcamento(servicoPorId("painel")!, "complexo", "avulsa", { percentual: 10, restam: 5 });
    expect(limpo(r)).toBe(
      "Quero um orçamento de: Painel básico, tamanho complexo (estimativa R$ 400, R$ 360 com 10% de piloto; 8 h; 5 dias úteis).",
    );
  });

  it("mantém o 'a partir de' e omite o piloto sem vagas", () => {
    const r = resumoOrcamento(servicoPorId("automacao")!, "medio", "avulsa", null);
    expect(limpo(r)).toBe("Quero um orçamento de: Automação em Excel, tamanho médio (estimativa a partir de R$ 450; 9 h; 6 dias úteis).");
  });

  it("aulas não recebem desconto de piloto", () => {
    const r = resumoOrcamento(servicoPorId("aulas")!, "basico", "pacote", { percentual: 10, restam: 5 });
    expect(limpo(r)).toBe("Quero um orçamento de: Aulas de Excel ou programação, pacote de 4 aulas (R$ 180).");
  });

  it("sistema fica sob consulta", () => {
    expect(resumoOrcamento(servicoPorId("sistema")!, "basico", "avulsa", null)).toBe(
      "Quero um orçamento de: Sistema sob medida (sob consulta).",
    );
  });
});
