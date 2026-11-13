import { describe, expect, it } from "vitest";
import { site } from "../../content/site";
import { negocios } from "../../content/textos";
import { destinoFalarComigo, imagensDoUniser, paragrafosSobre } from "./sobreLogica";

const t = negocios.sobre;

describe("paragrafosSobre", () => {
  it("com as duas flags: fixos, Ministério, Uniser e atendimento, nessa ordem", () => {
    expect(paragrafosSobre({ mostrarMinisterio: true, mostrarUniser: true })).toEqual([...t.paragrafos, t.ministerio, t.uniser, t.atendimento]);
  });
  it("sem Ministério", () => {
    const r = paragrafosSobre({ mostrarMinisterio: false, mostrarUniser: true });
    expect(r).not.toContain(t.ministerio);
    expect(r).toContain(t.uniser);
  });
  it("sem Uniser", () => {
    const r = paragrafosSobre({ mostrarMinisterio: true, mostrarUniser: false });
    expect(r).not.toContain(t.uniser);
    expect(r).toContain(t.ministerio);
  });
  it("sem nenhuma: só os fixos e o atendimento", () => {
    expect(paragrafosSobre({ mostrarMinisterio: false, mostrarUniser: false })).toEqual([...t.paragrafos, t.atendimento]);
  });
  it("o texto do Ministério não traz siglas (palavras só em maiúsculas)", () => {
    expect(t.ministerio).not.toMatch(/b[A-Z]{4,}b/);
  });
});

describe("imagensDoUniser", () => {
  it("só aparecem com mostrarUniser", () => {
    expect(imagensDoUniser({ mostrarUniser: false })).toEqual([]);
    expect(imagensDoUniser({ mostrarUniser: true })).toBe(site.imagensUniser);
  });
  it("cada imagem tem src e alt descritivo", () => {
    for (const img of site.imagensUniser) {
      expect(img.src).toMatch(/^\//);
      expect(img.alt.length).toBeGreaterThan(10);
    }
  });
});

describe("destinoFalarComigo", () => {
  const menu = (contato: boolean) => ({ menuSecoes: { ...site.menuSecoes, contato } });
  it("com a seção Contato: âncora interna", () => {
    expect(destinoFalarComigo(menu(true))).toEqual({ href: "#contato", externo: false });
  });
  it("sem a seção Contato: WhatsApp com a origem da seção", () => {
    const d = destinoFalarComigo(menu(false));
    expect(d.externo).toBe(true);
    expect(d.href).toContain(`wa.me/${site.whatsapp}`);
    expect(decodeURIComponent(d.href)).toContain("negocios-sobre");
  });
});
