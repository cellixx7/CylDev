import { describe, expect, it } from "vitest";
import { ANIMACOES, MAO_JOINHA, POSES, quadros, rotacaoEm } from "./cylAnimacoes";
import { cylSvg } from "./cylSvg";

describe("animação wave do Cyl", () => {
  const { duracaoMs, faixas } = ANIMACOES.wave;

  it("dura cerca de 2,5 s", () => {
    expect(duracaoMs).toBe(2500);
  });

  it("termina exatamente como começa (sem salto no fim)", () => {
    for (const f of faixas) expect(f.passos.at(-1)!.valor).toBe(f.passos[0].valor);
  });

  it("tem offsets crescentes de 0 a 1", () => {
    for (const f of faixas) {
      const o = f.passos.map((p) => p.offset);
      expect(o[0]).toBe(0);
      expect(o.at(-1)).toBe(1);
      expect(o).toEqual([...o].sort((a, b) => a - b));
    }
  });

  it("troca de mão em até 80 ms", () => {
    const rest = faixas.find((f) => f.parte === "hand-left-rest" && f.tipo === "opacidade")!;
    const transicoes = rest.passos.slice(1).filter((p, i) => p.valor !== rest.passos[i].valor);
    expect(transicoes.length).toBeGreaterThan(0);
    for (const t of transicoes) {
      const antes = rest.passos[rest.passos.indexOf(t) - 1];
      expect((t.offset - antes.offset) * duracaoMs).toBeLessThanOrEqual(80);
    }
  });

  it("a mão oscila duas vezes (dois picos acima da pose de aceno)", () => {
    const mao = faixas.find((f) => f.parte === "hand-left-wave" && f.tipo === "rotacao")!;
    const v = mao.passos.map((p) => p.valor);
    const picos = v.filter((x, i) => i > 0 && i < v.length - 1 && x > v[i - 1] && x > v[i + 1] && x > 22);
    expect(picos.length).toBe(2);
    expect(Math.max(...v) - 17).toBeLessThanOrEqual(14);
  });

  it("só usa transform e opacity", () => {
    for (const f of faixas) {
      for (const q of quadros(f)) expect(Object.keys(q).every((k) => ["offset", "transform", "opacity", "easing"].includes(k))).toBe(true);
    }
  });

  it("escreve a rotação em torno do pivô", () => {
    expect(rotacaoEm(44, [396, 617])).toBe("translate(396px, 617px) rotate(44deg) translate(-396px, -617px)");
  });
});

describe("desenho do Cyl", () => {
  it("prefixa os ids do <defs>, para duas instâncias não colidirem", () => {
    const a = cylSvg("a-");
    const b = cylSvg("b-");
    for (const id of ["face-color", "skin", "ringlet", "iris", "hair-silhouette"]) {
      expect(a).toContain(`id="a-${id}"`);
      expect(a).not.toContain(`id="b-${id}"`);
      expect(b).toContain(`id="b-${id}"`);
    }
    expect(a).not.toMatch(/url\(#(?!a-)/);
  });

  it("mantém um só <defs> e as partes animadas", () => {
    const s = cylSvg("x-");
    expect(s.match(/<defs>/g)).toHaveLength(1);
    for (const p of ["arm-left-upper", "arm-left-forearm", "hand-left-rest", "hand-left-wave", "head", "brows"]) expect(s).toContain(`data-parte="${p}"`);
  });
});

describe("piscada e pose do joinha", () => {
  it("a piscada dura entre 120 e 180 ms e termina como começa", () => {
    const { duracaoMs, faixas } = ANIMACOES.piscar;
    expect(duracaoMs).toBeGreaterThanOrEqual(120);
    expect(duracaoMs).toBeLessThanOrEqual(180);
    for (const f of faixas) expect(f.passos.at(-1)!.valor).toBe(f.passos[0].valor);
  });

  it("só mexe em opacity e transform (olhos somem, pálpebra desce)", () => {
    const partes = ANIMACOES.piscar.faixas.map((f) => f.parte).sort();
    expect(partes).toEqual(["eyelids", "eyes"]);
    for (const f of ANIMACOES.piscar.faixas) for (const q of quadros(f)) expect(Object.keys(q).sort()).toEqual(expect.arrayContaining(["offset"]));
  });

  it("a pose do joinha gira braço, antebraço e a mão que existe no desenho", () => {
    const svg = cylSvg("t-");
    for (const p of POSES.joinha) expect(svg).toContain(`data-parte="${p.parte}"`);
    expect(POSES.joinha.map((p) => p.parte)).toContain(MAO_JOINHA);
  });
});
