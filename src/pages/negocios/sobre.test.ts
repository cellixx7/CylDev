import { describe, expect, it } from "vitest";
import { site } from "../../content/site";
import { negocios } from "../../content/textos";
import { destinoFalarComigo, imagensDoUniser, paragrafosSobre, type BlocoSobre } from "./sobreLogica";

const textoDoBloco = (b: BlocoSobre) => b.partes.map((p) => p.texto).join("");
const destaquesDaSecao = (blocos: BlocoSobre[]) => blocos.flatMap((b) => b.partes.flatMap((p) => (p.destaque ? [p.destaque] : [])));
const SIGLA = /\b[A-Z]{4,}\b/;

const t = negocios.sobre;

type Flags = { mostrarMinisterio: boolean; mostrarUniser: boolean };
const textos = (flags: Flags) => paragrafosSobre(flags).map(textoDoBloco);
const ligadas: Flags = { mostrarMinisterio: true, mostrarUniser: true };
const juntar = (partes: { texto: string }[]) => partes.map((p) => p.texto).join("");

describe("paragrafosSobre", () => {
  it("com as duas flags: fixos, Ministério, Uniser e atendimento, nessa ordem", () => {
    expect(textos(ligadas)).toEqual([...t.paragrafos.map(juntar), juntar(t.ministerio), juntar(t.uniser), t.atendimento]);
  });
  it("sem Ministério", () => {
    expect(textos({ mostrarMinisterio: false, mostrarUniser: true })).toEqual([...t.paragrafos.map(juntar), juntar(t.uniser), t.atendimento]);
  });
  it("sem Uniser", () => {
    expect(textos({ mostrarMinisterio: true, mostrarUniser: false })).toEqual([...t.paragrafos.map(juntar), juntar(t.ministerio), t.atendimento]);
  });
  it("sem nenhuma: só os fixos e o atendimento", () => {
    expect(textos({ mostrarMinisterio: false, mostrarUniser: false })).toEqual([...t.paragrafos.map(juntar), t.atendimento]);
  });
  it("o bloco do Uniser tem id próprio (a galeria entra depois dele)", () => {
    expect(paragrafosSobre(ligadas).filter((b) => b.id === "uniser").map(textoDoBloco)).toEqual([juntar(t.uniser)]);
  });
  it("o texto dos parágrafos não mudou (o 'Estagio' sem acento é o verbo)", () => {
    expect(textos(ligadas)[0]).toBe("Estudo Sistemas de Informação na Unieuro e trabalho como desenvolvedor fullstack.");
    expect(textos(ligadas)[1]).toMatch(/^Estagio em TI no Ministério da Defesa, onde faço análise de dados/);
    expect(textos(ligadas)[2]).toMatch(/^Participo do Uniser, um portal do aluno/);
  });
});

describe("destaques da seção", () => {
  it("com as flags ligadas: faculdade, estágio e Uniser, nessa ordem, com o trecho certo", () => {
    const partes = paragrafosSobre(ligadas).flatMap((b) => b.partes).filter((p) => p.destaque);
    expect(partes.map((p) => [p.destaque, p.texto])).toEqual([
      ["faculdade", "Sistemas de Informação na Unieuro"],
      ["estagio", "Estagio em TI no Ministério da Defesa"],
      ["uniser", "Participo do Uniser"],
    ]);
  });
  it("sem Ministério some o destaque do estágio; sem Uniser, o do Uniser; a faculdade fica", () => {
    expect(destaquesDaSecao(paragrafosSobre({ mostrarMinisterio: false, mostrarUniser: true }))).toEqual(["faculdade", "uniser"]);
    expect(destaquesDaSecao(paragrafosSobre({ mostrarMinisterio: true, mostrarUniser: false }))).toEqual(["faculdade", "estagio"]);
    expect(destaquesDaSecao(paragrafosSobre({ mostrarMinisterio: false, mostrarUniser: false }))).toEqual(["faculdade"]);
  });
  it("todo destaque tem título, dica e conteúdo", () => {
    for (const id of ["faculdade", "estagio", "uniser"] as const) {
      const m = t.modais[id];
      expect(m.titulo.length, id).toBeGreaterThan(0);
      expect(m.dica, id).toMatch(/^Saiba mais sobre /);
      expect(m.texto.length, id).toBeGreaterThan(0);
      expect(m.secoes.length, id).toBeGreaterThan(0);
      for (const s of m.secoes) {
        expect(s.subtitulo.length).toBeGreaterThan(0);
        expect((s.texto?.length ?? 0) + (s.itens?.length ?? 0)).toBeGreaterThan(0);
      }
    }
  });
  it("todo destaque usado nos parágrafos tem modal", () => {
    for (const id of destaquesDaSecao(paragrafosSobre(ligadas))) expect(t.modais[id]).toBeDefined();
  });
  it("o modal do Estágio não traz siglas (palavras só em maiúsculas)", () => {
    const m = t.modais.estagio;
    const tudo = [m.titulo, m.dica, m.texto, m.fecho ?? "", ...m.secoes.flatMap((s) => [s.subtitulo, s.texto ?? "", ...(s.itens ?? [])])].join(" ");
    expect(tudo).not.toMatch(SIGLA);
    // A regra pega de fato uma sigla.
    expect(`${tudo} ABCD`).toMatch(SIGLA);
  });
  it("o texto do Ministério na seção não traz siglas", () => {
    expect(juntar(t.ministerio)).not.toMatch(SIGLA);
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
