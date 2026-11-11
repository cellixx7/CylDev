import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { guia, resultadosGuia } from "../../content/guia";
import { site } from "../../content/site";
import { GuiaEscolha, Resultado } from "./GuiaEscolha";

const props = { aoVerDetalhes: () => {}, aoFazerOrcamento: () => {} };

describe("GuiaEscolha", () => {
  it("fechado: só o botão 'Não sei qual escolher', recolhido e ligado ao painel", () => {
    const html = renderToStaticMarkup(createElement(GuiaEscolha, props));
    expect(html).toContain(guia.botao);
    expect(html).toContain('aria-expanded="false"');
    expect(html).toMatch(/aria-controls="[^"]+"/);
    expect(html).toContain("hidden");
    expect(html).not.toContain(guia.rotuloPergunta(1));
  });

  it("resultado de serviço: nome, 'Fazer orçamento' e 'Ver detalhes', sem número inventado", () => {
    const html = renderToStaticMarkup(createElement(Resultado, { r: resultadosGuia.find((r) => r.id === "planilha")!, ...props }));
    expect(html).toContain("Planilha organizada");
    expect(html).toContain(guia.fazerOrcamento);
    expect(html).toContain(guia.verDetalhes);
    const texto = html.replace(/<[^>]*>/g, " ");
    expect(texto).not.toMatch(/R\$|\d/);
  });

  it("resultado de bot: link para /comunidade/#bots e nenhum botão de orçamento", () => {
    const html = renderToStaticMarkup(createElement(Resultado, { r: resultadosGuia.find((r) => r.id === "bot")!, ...props }));
    expect(html).toContain('href="/comunidade/#bots"');
    expect(html).not.toContain(guia.fazerOrcamento);
  });

  it("resultado 'conversar': botão do WhatsApp com o número de site.ts e sem botão de orçamento", () => {
    const html = renderToStaticMarkup(createElement(Resultado, { r: resultadosGuia.find((r) => r.id === "conversar")!, ...props }));
    expect(html).toContain("Falar comigo no WhatsApp");
    expect(html).toContain(`https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=`);
    expect(html).not.toContain(guia.fazerOrcamento);
  });
});
