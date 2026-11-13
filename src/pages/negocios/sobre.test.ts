import { describe, expect, it } from "vitest";
import { site } from "../../content/site";
import { negocios } from "../../content/textos";
import { destinoFalarComigo, telasDoUniser, paragrafosSobre, type BlocoSobre } from "./sobreLogica";

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
    expect(textos(ligadas)[2]).toMatch(/^Participo do Uniser, a plataforma da UniSER, Universidade do Envelhecer da UnB\./);
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

describe("telasDoUniser", () => {
  it("só aparecem com mostrarUniser", () => {
    expect(telasDoUniser({ mostrarUniser: false })).toEqual([]);
    expect(telasDoUniser({ mostrarUniser: true })).toBe(site.telasUniser);
  });
  it("são as seis telas, cada uma com título e alt descritivo", () => {
    expect(site.telasUniser.map((x) => x.id)).toEqual(["editais", "login", "grade", "dados", "frequencia", "semestre"]);
    for (const tela of site.telasUniser) {
      expect(tela.titulo.length).toBeGreaterThan(0);
      expect(tela.alt.length).toBeGreaterThan(30);
    }
  });
  it("os esquemas não trazem dado de teste nem de pessoa", () => {
    const tudo = JSON.stringify(site.telasUniser);
    expect(tudo).not.toMatch(/teste|CPF|@|Maria|Carlos/i);
  });
});

describe("descrição da UniSER", () => {
  const tudo = JSON.stringify(t);
  it("não fala em portal do aluno nem em parceria com a UnB", () => {
    expect(tudo).not.toMatch(/portal do aluno/i);
    expect(tudo).not.toContain("em parceria com a Universidade de Brasília");
  });
  it("o modal cita UniSER, UnB e Unieuro", () => {
    const m = t.modais.uniser;
    const texto = [m.titulo, m.texto, ...m.secoes.flatMap((s) => [s.texto ?? "", ...(s.itens ?? [])])].join(" ");
    expect(texto).toContain("UniSER");
    expect(texto).toContain("UnB");
    expect(texto).toContain("Unieuro");
  });
  it("a galeria é rotulada como esquema ilustrativo, sem 'imagem de exemplo'", () => {
    expect(t.imagensUniser).toBe("Telas da plataforma da UniSER");
    expect(t.legendaTelas).toMatch(/ilustrativos/);
    expect(tudo).not.toMatch(/imagem de exemplo/i);
  });
  it("o modal da faculdade traz o Simbionte, sem link", () => {
    const m = t.modais.faculdade;
    const ic = m.secoes.find((s) => s.subtitulo === "Iniciação científica")!;
    expect((ic.mais ?? []).join(" ")).toContain("Simbionte");
    expect(JSON.stringify(m)).not.toMatch(/https?:/);
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
