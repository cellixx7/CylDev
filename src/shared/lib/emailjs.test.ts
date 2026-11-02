import { describe, expect, it } from "vitest";
import { emailjsConfigurado, pareceSpam, TEMPO_MINIMO_MS } from "./emailjs";

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
