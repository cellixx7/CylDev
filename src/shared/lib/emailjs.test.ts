import { describe, expect, it } from "vitest";
import { afterEach, vi } from "vitest";
import { emailjsConfigurado, enviarContato, pareceSpam, SEM_DADO, TEMPO_MINIMO_MS } from "./emailjs";

describe("pareceSpam", () => {
  it("marca isca preenchida", () => {
    expect(pareceSpam("http://spam", 0, 60_000)).toBe(true);
  });

  it("marca envio rápido demais", () => {
    expect(pareceSpam("", 1000, 1000 + TEMPO_MINIMO_MS - 1)).toBe(true);
  });

  it("aceita envio normal", () => {
    expect(pareceSpam("", 0, 60_000)).toBe(false);
  });
});

describe("emailjsConfigurado", () => {
  it("exige os três valores", () => {
    expect(emailjsConfigurado({ serviceId: "s", templateId: "t", publicKey: "" })).toBe(false);
    expect(emailjsConfigurado({ serviceId: "s", templateId: "t", publicKey: "k" })).toBe(true);
  });
});

describe("enviarContato", () => {
  const cfg = { serviceId: "s", templateId: "t", publicKey: "k" };
  const base = {
    nome: "Ana",
    preferencia: "whatsapp" as const,
    contato: "11999999999",
    assunto: "",
    mensagem: "Oi",
    origem: "negocios-contato",
  };

  afterEach(() => vi.unstubAllGlobals());

  function espiar() {
    const fetchFalso = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchFalso);
    return () => JSON.parse(fetchFalso.mock.calls[0][1].body).template_params;
  }

  it("envia pacote, tamanho e estimativa da calculadora", async () => {
    const params = espiar();
    await enviarContato({ ...base, pacote: "Painel básico", tamanho: "Médio", estimativa: "a partir de R$ 300" }, cfg);
    expect(params()).toMatchObject({
      nome: "Ana",
      preferencia: "WhatsApp",
      contato: "11999999999",
      assunto: "Contato pelo site",
      mensagem: "Oi",
      origem: "negocios-contato",
      pacote: "Painel básico",
      tamanho: "Médio",
      estimativa: "a partir de R$ 300",
    });
  });

  it("usa '—' quando o pedido não vem da calculadora", async () => {
    const params = espiar();
    await enviarContato(base, cfg);
    expect(params()).toMatchObject({ pacote: SEM_DADO, tamanho: SEM_DADO, estimativa: SEM_DADO });
    expect(SEM_DADO).toBe("—");
  });
});
