import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { negocios } from "../../content/textos";
import { PainelExemplo } from "./PainelExemplo";

const painel = negocios.apresentacao.painel;

describe("painel de exemplo", () => {
  it("cada mês expõe mês, valor e unidade no nome acessível, na ordem, sem duplicar o valor visível", () => {
    const html = renderToStaticMarkup(createElement(PainelExemplo));
    const falados = [...html.matchAll(/<span class="sr-only">([^<]*R\$ \d+ mil)<\/span>/g)].map((m) => m[1]);
    expect(falados).toEqual(painel.meses.map((m) => `${m.completo}, R$ ${m.valor} mil`));
    expect(falados[0]).toBe("Janeiro, R$ 12 mil");
    expect(html).toMatch(/<span class="animate-painel-aparecer[^"]*"[^>]*aria-hidden="true">12<\/span>/);
  });
});
