import { describe, expect, it } from "vitest";
import { demoPlanilha, servicosComDemo } from "../../content/demoPlanilha";
import { exemplos } from "../../content/exemplos";
import { cabecalhoDoPasso, estadoInicialDemo, linhasDoPasso, reduzirDemo, totalDoPasso, ultimoPasso } from "./demoPassos";

describe("máquina de passos da demonstração", () => {
  it("começa parada no passo 0", () => {
    expect(estadoInicialDemo).toEqual({ passo: 0, tocando: false });
  });

  it("reproduzir liga o relógio e avançar anda um passo", () => {
    let e = reduzirDemo(estadoInicialDemo, "reproduzir");
    expect(e).toEqual({ passo: 0, tocando: true });
    e = reduzirDemo(e, "avancar");
    expect(e).toEqual({ passo: 1, tocando: true });
  });

  it("pausar mantém o passo, e um avanço atrasado não anda", () => {
    let e = reduzirDemo(reduzirDemo(estadoInicialDemo, "reproduzir"), "avancar");
    e = reduzirDemo(e, "pausar");
    expect(e).toEqual({ passo: 1, tocando: false });
    expect(reduzirDemo(e, "avancar")).toEqual(e);
    expect(reduzirDemo(e, "reproduzir")).toEqual({ passo: 1, tocando: true });
  });

  it("ao chegar no último passo, para sozinho (sem loop)", () => {
    let e = reduzirDemo(estadoInicialDemo, "reproduzir");
    for (let i = 0; i < ultimoPasso; i++) e = reduzirDemo(e, "avancar");
    expect(e).toEqual({ passo: ultimoPasso, tocando: false });
    expect(reduzirDemo(e, "avancar")).toEqual(e);
  });

  it("ver resultado vai ao final, parado, de qualquer ponto", () => {
    expect(reduzirDemo(estadoInicialDemo, "verResultado")).toEqual({ passo: ultimoPasso, tocando: false });
    const tocando = reduzirDemo(reduzirDemo(estadoInicialDemo, "reproduzir"), "avancar");
    expect(reduzirDemo(tocando, "verResultado")).toEqual({ passo: ultimoPasso, tocando: false });
  });

  it("recomeçar volta ao passo 0, parado", () => {
    expect(reduzirDemo({ passo: 3, tocando: true }, "recomecar")).toEqual(estadoInicialDemo);
  });

  it("reproduzir no final começa de novo", () => {
    expect(reduzirDemo({ passo: ultimoPasso, tocando: false }, "reproduzir")).toEqual({ passo: 0, tocando: true });
  });
});

describe("tabela de cada passo", () => {
  it("repetida e vazia saem no passo 3", () => {
    expect(linhasDoPasso(2)).toHaveLength(5);
    expect(linhasDoPasso(3).map((l) => l.id)).toEqual(["a", "b", "e"]);
  });

  it("as colunas só aparecem do passo 4 em diante", () => {
    expect(linhasDoPasso(3).every((l) => l.colunas === null && l.nota !== null)).toBe(true);
    expect(linhasDoPasso(4).every((l) => l.colunas !== null && l.nota === null)).toBe(true);
    expect(cabecalhoDoPasso(3)).toHaveLength(2);
    expect(cabecalhoDoPasso(4)).toHaveLength(4);
  });

  it("o total do final bate com a soma dos pedidos que sobraram", () => {
    const soma = linhasDoPasso(ultimoPasso).reduce((s, l) => s + Number(l.colunas![2].replace(/\D/g, "")), 0);
    expect(totalDoPasso(ultimoPasso)).toContain(`R$ ${soma}`);
    const comRepetida = demoPlanilha.linhas.reduce((s, l) => s + Number(l.colunas[2].replace(/\D/g, "") || 0), 0);
    expect(totalDoPasso(0)).toContain(`R$ ${comRepetida}`);
  });

  it("o serviço com demonstração aponta para um bloco que existe em Como funciona", () => {
    for (const [servicoId, exemploId] of Object.entries(servicosComDemo)) {
      expect(exemplos.find((e) => e.id === exemploId)?.servicoId).toBe(servicoId);
    }
  });
});
