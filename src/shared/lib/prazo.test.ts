import { describe, expect, it } from "vitest";
import { formatarPrazo, prazoEmDias } from "./prazo";

describe("prazoEmDias", () => {
  it("arredonda para cima e soma a revisão", () => {
    expect(prazoEmDias(7, 2, 1)).toBe(5);
    expect(prazoEmDias(11.1, 2, 1)).toBe(7);
    expect(prazoEmDias(3.5, 2, 1)).toBe(3);
  });

  it("recusa horas inválidas", () => {
    expect(() => prazoEmDias(0)).toThrow(RangeError);
    expect(() => prazoEmDias(Number.NaN)).toThrow(RangeError);
    expect(() => prazoEmDias(5, 0)).toThrow(RangeError);
  });
});

describe("formatarPrazo", () => {
  it("usa singular e plural", () => {
    expect(formatarPrazo(1)).toBe("1 dia útil");
    expect(formatarPrazo(5)).toBe("5 dias úteis");
  });
});
