import { describe, expect, it } from "vitest";
import { hrefSeguro, partesDoTexto, textoSemLinks } from "./texto-rico";

describe("texto com links", () => {
  it("separa texto e links", () => {
    expect(partesDoTexto("Veja os [Termos](/termos/#pagamento) e escreva.")).toEqual([
      { texto: "Veja os " },
      { texto: "Termos", href: "/termos/#pagamento" },
      { texto: " e escreva." },
    ]);
  });

  it("texto sem link volta inteiro", () => {
    expect(partesDoTexto("Sem link (com parênteses) aqui.")).toEqual([{ texto: "Sem link (com parênteses) aqui." }]);
  });

  it("só aceita endereços do site, https, mailto e tel", () => {
    for (const ok of ["/termos/", "#dados", "https://www.gov.br/anpd", "mailto:a@b.com", "tel:+5500"]) expect(hrefSeguro(ok), ok).toBe(true);
    for (const ruim of ["javascript:alert(1)", "http://exemplo.com", "//exemplo.com", "data:text/html,x"]) expect(hrefSeguro(ruim), ruim).toBe(false);
    expect(partesDoTexto("[clique](javascript:alert(1))")[0]).toEqual({ texto: "clique" });
  });

  it("textoSemLinks tira só a marcação", () => {
    expect(textoSemLinks("Fale em [a@b.com](mailto:a@b.com).")).toBe("Fale em a@b.com.");
  });
});
