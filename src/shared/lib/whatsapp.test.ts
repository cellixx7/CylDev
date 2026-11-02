import { describe, expect, it } from "vitest";
import { mensagemComOrigem, whatsappLink } from "./whatsapp";

describe("whatsappLink", () => {
  it("monta o link com a mensagem codificada", () => {
    expect(whatsappLink("5561996291118", "Oi")).toBe("https://wa.me/5561996291118?text=Oi");
  });

  it("codifica acentos", () => {
    const link = whatsappLink("5561996291118", "Orçamento de região");
    expect(link).toBe("https://wa.me/5561996291118?text=Or%C3%A7amento%20de%20regi%C3%A3o");
    expect(decodeURIComponent(link.split("text=")[1])).toBe("Orçamento de região");
  });

  it("codifica aspas, & e quebra de linha", () => {
    const msg = 'Pacote "Painel" & extras\nsegunda linha';
    const link = whatsappLink("5561996291118", msg);
    expect(link).toContain("%22Painel%22");
    expect(link).toContain("%26");
    expect(link).toContain("%0A");
    expect(decodeURIComponent(link.split("text=")[1])).toBe(msg);
  });

  it("limpa o número e omite texto vazio", () => {
    expect(whatsappLink("+55 (61) 99629-1118", "  ")).toBe("https://wa.me/5561996291118");
  });

  it("recusa número vazio", () => {
    expect(() => whatsappLink("abc", "Oi")).toThrow();
  });
});

describe("mensagemComOrigem", () => {
  it("escreve a origem na mensagem", () => {
    expect(mensagemComOrigem("negocios")).toBe("Oi, Marcelo! Vim pelo site (origem: negocios).");
  });

  it("acrescenta o complemento em nova linha", () => {
    expect(mensagemComOrigem("negocios-painel", "Quero um painel.")).toBe(
      "Oi, Marcelo! Vim pelo site (origem: negocios-painel).\nQuero um painel.",
    );
  });
});
