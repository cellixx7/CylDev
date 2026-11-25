import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { lerLista } from "../../../scripts/textos-arquivos";
import ativos from "./ativos.json" with { type: "json" };

const i18n = (...p: string[]) => resolve(__dirname, "../../content/i18n", ...p);
const ignorados = new Set(lerLista(i18n("ignorar.txt")).map((l) => l.id));
const base = lerLista(i18n("pt.txt")).filter((l) => !ignorados.has(l.id));
const marcadores = (t: string) => (t.match(/\{\d+\}/g) ?? []).sort().join(",");

describe.each(ativos.filter((c) => c !== "pt"))("tradução %s (idioma no ar)", (codigo) => {
  const traduzido = new Map(lerLista(i18n(codigo, "textos.txt")).map((l) => [l.id, l.texto]));

  it("cobre todos os textos do site", () => {
    const faltam = base.filter((l) => !traduzido.has(l.id)).map((l) => l.texto);
    expect(faltam).toEqual([]);
  });
  it("mantém os marcadores {1}, {2}... de cada texto", () => {
    const erradas = base
      .filter((l) => traduzido.has(l.id) && marcadores(traduzido.get(l.id)!) !== marcadores(l.texto))
      .map((l) => l.texto);
    expect(erradas).toEqual([]);
  });
  it("tem os títulos e descrições das páginas (meta.json)", () => {
    expect(existsSync(i18n(codigo, "meta.json"))).toBe(true);
  });
});
