import { describe, expect, it } from "vitest";
import { serializarCarrinho } from "../shared/lib/carrinho-persistencia";
import { estadoInicial } from "../shared/lib/carrinho-estado";
import { privacidade } from "./textos";

describe("política de privacidade", () => {
  const tudo = JSON.stringify(privacidade);

  it("cita os terceiros e o prazo que o site de fato usa", () => {
    for (const termo of ["EmailJS", "WhatsApp", "Netlify", "12 meses", "sessionStorage", "{email}"]) expect(tudo).toContain(termo);
  });

  it("o carrinho salvo no navegador não leva nome, telefone nem observações (como a política afirma)", () => {
    const salvo = serializarCarrinho({ ...estadoInicial(), ids: ["planilha"] });
    expect(salvo).not.toMatch(/nome|telefone|whatsapp|observa/i);
  });
});
