import { site } from "../src/content/site";
import { comum, negocios } from "../src/content/textos";
import { destinoFalarComigo, paragrafosSobre } from "../src/pages/negocios/sobreLogica";
import type { Locator, Page } from "@playwright/test";
import { expect, semRolagemHorizontal, test } from "./apoio";

const t = negocios.sobre;

/** Cada tela em esquema tem descrição acessível e caixa visível, sem estourar a largura do pai. */
async function telasVisiveis(telas: Locator) {
  await expect(telas).toHaveCount(site.telasUniser.length);
  for (let i = 0; i < site.telasUniser.length; i++) {
    const tela = telas.nth(i);
    await tela.scrollIntoViewIfNeeded();
    await expect(tela).toHaveAttribute("aria-label", site.telasUniser[i].alt);
    const caixa = await tela.boundingBox();
    expect(caixa!.width).toBeGreaterThan(100);
    expect(caixa!.height).toBeGreaterThan(60);
  }
}

for (const [largura, altura] of [[360, 740], [390, 844], [768, 1024], [1440, 900]] as const) {
  test.describe(`seção Sobre: ${largura} px`, () => {
    test.use({ viewport: { width: largura, height: altura } });

    test("/#sobre rola até o título (livre do cabeçalho), sem rolagem lateral e com os seis esquemas de tela", async ({ page }) => {
      await page.goto("/#sobre");
      const titulo = page.getByRole("heading", { name: t.titulo });
      await expect(titulo).toBeInViewport();
      const cabecalho = await page.locator("header").first().boundingBox();
      const caixa = await titulo.boundingBox();
      expect(caixa!.y).toBeGreaterThanOrEqual(cabecalho!.y + cabecalho!.height - 1);
      await semRolagemHorizontal(page);
      const secao = page.locator("#sobre");
      await telasVisiveis(secao.getByRole("list", { name: t.imagensUniser }).locator("[role=img]"));
      await semRolagemHorizontal(page);
      await expect(secao.getByText(t.atendimento)).toBeVisible();
      await expect(secao.getByText(/^Estagio em TI no Ministério da Defesa/)).toBeVisible();
    });

    test("o botão Falar comigo recebe foco visível", async ({ page }) => {
      await page.goto("/#sobre");
      const botao = page.locator("#sobre").getByRole("link", { name: t.falarComigo });
      await botao.focus();
      await expect(botao).toBeFocused();
      const contorno = await botao.evaluate((el) => getComputedStyle(el).outlineStyle);
      expect(contorno).not.toBe("none");
      // Sem a seção Contato, o botão abre o WhatsApp em outra aba.
      await expect(botao).toHaveAttribute("href", /wa\.me/);
      await expect(botao).toHaveAttribute("rel", "noopener");
    });
  });
}

test("o link Sobre do menu leva à seção (desktop)", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Sobre" }).click();
  await expect(page).toHaveURL(/#sobre$/);
  await expect(page.getByRole("heading", { name: t.titulo })).toBeInViewport();
});

test.describe("menu no celular: 390 px", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("abre o menu, clica em Sobre e chega ao título", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: comum.menuAbrir }).click();
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Sobre" }).click();
    await expect(page).toHaveURL(/#sobre$/);
    await expect(page.getByRole("heading", { name: t.titulo })).toBeInViewport();
    await semRolagemHorizontal(page);
  });
});

// O texto de cada destaque vem dos dados do parágrafo, não do título do modal.
const trechoDe = (id: "faculdade" | "estagio" | "uniser") =>
  paragrafosSobre(site).flatMap((b) => b.partes).find((p) => p.destaque === id)!.texto;
const destaque = (page: Page, id: "faculdade" | "estagio" | "uniser") =>
  page.locator("#sobre").getByRole("button", { name: trechoDe(id), exact: true });
const modalDe = (page: Page, id: "faculdade" | "estagio" | "uniser") => page.getByRole("dialog", { name: t.modais[id].titulo });

test.describe("destaques com modal: mouse e teclado, 1440 px", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("mouse sobre o destaque mostra a dica; o clique abre o modal", async ({ page }) => {
    await page.goto("/#sobre");
    for (const id of ["faculdade", "estagio", "uniser"] as const) {
      const d = destaque(page, id);
      await d.hover();
      await expect(page.getByRole("tooltip", { name: t.modais[id].dica })).toBeVisible();
      await expect(d).toHaveAttribute("aria-describedby", /.+/);
      await d.click();
      await expect(modalDe(page, id)).toBeVisible();
      await expect(page.getByRole("heading", { name: t.modais[id].titulo, level: 2 })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(modalDe(page, id)).toBeHidden();
    }
  });

  test("tirar o mouse esconde a dica", async ({ page }) => {
    await page.goto("/#sobre");
    await destaque(page, "faculdade").hover();
    await expect(page.getByRole("tooltip", { name: t.modais.faculdade.dica })).toBeVisible();
    await page.mouse.move(5, 5);
    await expect(page.getByRole("tooltip", { name: t.modais.faculdade.dica })).toBeHidden();
  });

  test("teclado: Tab mostra a dica, Enter abre, Esc fecha e o foco volta ao destaque", async ({ page }) => {
    await page.goto("/#sobre");
    const d = destaque(page, "estagio");
    for (let i = 0; i < 80 && !(await d.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press("Tab");
    await expect(d).toBeFocused();
    const dica = page.getByRole("tooltip", { name: t.modais.estagio.dica });
    await expect(dica).toBeVisible();
    // Esc com a dica aberta fecha só a dica.
    await page.keyboard.press("Escape");
    await expect(dica).toBeHidden();
    await d.blur();
    await d.focus();
    await page.keyboard.press("Enter");
    await expect(modalDe(page, "estagio")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(modalDe(page, "estagio")).toBeHidden();
    await expect(d).toBeFocused();
    // Espaço também abre.
    await page.keyboard.press("Space");
    await expect(modalDe(page, "estagio")).toBeVisible();
  });

  test("clique no fundo fecha; o X também; um modal por vez", async ({ page }) => {
    await page.goto("/#sobre");
    await destaque(page, "faculdade").click();
    await expect(modalDe(page, "faculdade")).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(modalDe(page, "faculdade")).toBeHidden();
    await expect(destaque(page, "faculdade")).toBeFocused();

    await destaque(page, "uniser").click();
    await expect(page.getByRole("dialog")).toHaveCount(1);
    await page.getByRole("button", { name: t.fechar }).click();
    await expect(modalDe(page, "uniser")).toBeHidden();
    await expect(destaque(page, "uniser")).toBeFocused();
  });

  test("conteúdo de cada modal: textos certos, esquemas de tela só no Uniser, sem siglas no estágio", async ({ page }) => {
    await page.goto("/#sobre");
    await destaque(page, "estagio").click();
    const estagio = modalDe(page, "estagio");
    await expect(estagio.getByText(t.modais.estagio.texto)).toBeVisible();
    await expect(estagio.getByRole("heading", { name: "Ferramentas do dia a dia" })).toBeVisible();
    await expect(estagio.locator("[role=img]")).toHaveCount(0);
    await page.keyboard.press("Escape");

    await destaque(page, "uniser").click();
    const uniser = modalDe(page, "uniser");
    await expect(uniser.locator("img")).toHaveCount(0);
    await telasVisiveis(uniser.locator("[role=img]"));
    await expect(uniser.getByText(t.legendaTelas)).toBeVisible();
    await semRolagemHorizontal(page);
  });

  test("Falar comigo no modal vai ao mesmo destino do botão da seção", async ({ page }) => {
    await page.goto("/#sobre");
    await destaque(page, "faculdade").click();
    const falar = modalDe(page, "faculdade").getByRole("link", { name: t.falarComigo });
    const destino = destinoFalarComigo(site);
    await expect(falar).toHaveAttribute("href", destino.href);
    if (destino.externo) {
      await expect(falar).toHaveAttribute("target", "_blank");
      await expect(falar).toHaveAttribute("rel", "noopener");
    } else {
      await falar.click();
      await expect(modalDe(page, "faculdade")).toBeHidden();
      await expect(page).toHaveURL(/#contato$/);
    }
  });
});

test.describe("destaques com modal: toque, 390 px", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("o toque abre o modal direto, sem dica, sem rolagem lateral; o conteúdo rola dentro do modal", async ({ page }) => {
    await page.goto("/#sobre");
    await destaque(page, "uniser").tap();
    const modal = modalDe(page, "uniser");
    await expect(modal).toBeVisible();
    await expect(page.locator("[role=tooltip]:not([hidden])")).toHaveCount(0);
    await semRolagemHorizontal(page);
    const caixa = await modal.boundingBox();
    expect(caixa!.width).toBeGreaterThan(370);
    expect(caixa!.height).toBeGreaterThan(800);
    const rolagem = modal.locator("div.overflow-y-auto");
    expect(await rolagem.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
    await rolagem.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    expect(await rolagem.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    // A página atrás não rolou.
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe("hidden");
    await modal.getByRole("button", { name: t.fechar }).tap();
    await expect(modal).toBeHidden();
  });

  test("os destaques quebram de linha como texto e têm alvo de toque de 44 px (320 px)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/#sobre");
    const d = destaque(page, "estagio");
    const caixas = await d.evaluate((el) => [...el.getClientRects()].map((r) => ({ h: r.height, w: r.width })));
    expect(caixas.length).toBeGreaterThan(1);
    for (const c of caixas) expect(c.h).toBeGreaterThanOrEqual(44);
  });
});
