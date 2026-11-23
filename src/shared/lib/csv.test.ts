import { describe, expect, it } from "vitest";
import { lerCsv } from "./csv";

const bruto = import.meta.glob("../../content/exemplo-planilha/*.csv", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const arquivo = (nome: string) => bruto[`../../content/exemplo-planilha/${nome}`];

describe("lerCsv", () => {
  it("lê linhas simples, com CRLF ou LF", () => {
    expect(lerCsv("a,b\r\nc,d\n")).toEqual([["a", "b"], ["c", "d"]]);
  });

  it("mantém vírgula, aspas duplicadas e quebra de linha dentro de aspas", () => {
    expect(lerCsv('x,"126,00","diz ""oi""","l1\nl2"')).toEqual([["x", "126,00", 'diz "oi"', "l1\nl2"]]);
  });

  it("tira o BOM e preserva células vazias, inclusive no fim da linha", () => {
    expect(lerCsv("﻿a,,c,\n")).toEqual([["a", "", "c", ""]]);
  });

  it("linha sem nada some; linha só de vírgulas vira células vazias e só some com descartarVazias", () => {
    expect(lerCsv("a\n\nb")).toEqual([["a"], ["b"]]);
    expect(lerCsv("a\n,,\nb")).toEqual([["a"], ["", "", ""], ["b"]]);
    expect(lerCsv("a\n,,\n\nb", { descartarVazias: true })).toEqual([["a"], ["b"]]);
  });

  it("não cria linha a mais depois da última quebra", () => {
    expect(lerCsv("a,b\n")).toHaveLength(1);
  });

  it("lê a planilha bagunçada de janeiro: valor com vírgula entre aspas e células vazias", () => {
    const l = lerCsv(arquivo("bagunca-1-janeiro-Planilha1.csv"));
    expect(l[0][0]).toBe("VENDAS JANEIRO!!!");
    expect(l[3]).toEqual(["2 jan", "Loja da Vera", "caneca mag.", "três", "126,00", "troca de tam.", "", ""]);
  });

  it("lê a planilha arrumada: 94 vendas e 9 colunas", () => {
    const l = lerCsv(arquivo("planilha-arrumada.csv"), { descartarVazias: true });
    expect(l).toHaveLength(95);
    expect(l.every((x) => x.length === 9)).toBe(true);
  });

  it("todas as abas da bagunça são lidas sem erro", () => {
    for (const [nome, texto] of Object.entries(bruto)) expect(lerCsv(texto).length, nome).toBeGreaterThan(3);
  });
});
