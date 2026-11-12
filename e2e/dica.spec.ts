import type { Locator, Page } from "@playwright/test";
import { orcamento as t } from "../src/content/textos";
import { expect, modalServico, modelo, opcao, semRolagemHorizontal, test } from "./apoio";

const ID = "sistema";
const servico = modelo(ID);
const pergunta = (id: string) => servico.perguntas.find((p) => p.id === id)!;

const botaoDica = (page: Page, texto: string) => modalServico(page).getByRole("button", { name: t.painel.ajudaRotulo(texto) });
const balaoVisivel = (page: Page) => modalServico(page).locator('[role="tooltip"]:not([hidden])');

/** O balão fica inteiro dentro da janela e dentro da área do diálogo. */
async function balaoDentroDaTela(page: Page, alvo: Locator) {
  const caixa = await alvo.boundingBox();
  const janela = page.viewportSize()!;
  expect(caixa).not.toBeNull();
  expect(caixa!.x).toBeGreaterThanOrEqual(0);
  expect(caixa!.y).toBeGreaterThanOrEqual(0);
  expect(caixa!.x + caixa!.width).toBeLessThanOrEqual(janela.width);
  expect(caixa!.y + caixa!.height).toBeLessThanOrEqual(janela.height);
}

test.describe("dica (i) das perguntas: celular de 360 px", () => {
  test.use({ viewport: { width: 360, height: 740 }, hasTouch: true });

  test("tocar abre, ler, tocar de novo fecha; não corta nem rola de lado", async ({ page }) => {
    await page.goto("/#sistema/orcamento");
    const p = pergunta("tipo");
    const botao = botaoDica(page, p.texto);
    await expect(botao).toHaveAttribute("aria-expanded", "false");
    const alvo = await botao.boundingBox();
    expect(alvo!.width).toBeGreaterThanOrEqual(44);
    expect(alvo!.height).toBeGreaterThanOrEqual(44);

    await botao.tap();
    await expect(botao).toHaveAttribute("aria-expanded", "true");
    const aberto = balaoVisivel(page);
    await expect(aberto).toHaveCount(1);
    await expect(aberto).toContainText(p.ajuda.slice(0, 40));
    await expect(botao).toHaveAttribute("aria-describedby", (await aberto.getAttribute("id"))!);
    await balaoDentroDaTela(page, aberto);
    await semRolagemHorizontal(page);

    await botao.tap();
    await expect(botao).toHaveAttribute("aria-expanded", "false");
    await expect(balaoVisivel(page)).toHaveCount(0);
  });

  test("tocar fora fecha; tocar em outra dica fecha a primeira (uma por vez)", async ({ page }) => {
    await page.goto("/#sistema/orcamento");
    const a = botaoDica(page, pergunta("tipo").texto);
    const b = botaoDica(page, pergunta("usuarios").texto);
    await a.tap();
    await expect(balaoVisivel(page)).toHaveCount(1);
    await b.tap();
    await expect(a).toHaveAttribute("aria-expanded", "false");
    await expect(b).toHaveAttribute("aria-expanded", "true");
    await expect(balaoVisivel(page)).toHaveCount(1);
    await balaoDentroDaTela(page, balaoVisivel(page));

    await modalServico(page).getByText(t.painel.legendaValor).tap();
    await expect(balaoVisivel(page)).toHaveCount(0);
  });

  test("rolar o diálogo fecha; as dicas das filhas existem e cabem", async ({ page }) => {
    await page.goto("/#sistema/orcamento");
    await opcao(page, ID, "tipo", "saas").etiqueta.click();
    const filha = botaoDica(page, "Como o sistema será cobrado dos clientes?");
    await filha.scrollIntoViewIfNeeded();
    await filha.tap();
    await expect(balaoVisivel(page)).toHaveCount(1);
    await balaoDentroDaTela(page, balaoVisivel(page));
    await modalServico(page).locator("footer").scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 200);
    await expect(balaoVisivel(page)).toHaveCount(0);
  });
});

test.describe("dica (i) das perguntas: teclado e mouse em 1280 px", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("foco pelo teclado abre; Esc fecha só a dica e o diálogo continua aberto", async ({ page }) => {
    await page.goto("/#sistema/orcamento");
    const modal = modalServico(page);
    const botao = botaoDica(page, pergunta("tipo").texto);
    await botao.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(botao).toBeFocused();
    await expect(balaoVisivel(page)).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(balaoVisivel(page)).toHaveCount(0);
    await expect(modal).toBeVisible();

    // Um segundo Esc, sem dica aberta, fecha o diálogo.
    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
  });

  test("mouse: passar por cima abre e sair fecha; perder o foco fecha", async ({ page }) => {
    await page.goto("/#sistema/orcamento");
    const botao = botaoDica(page, pergunta("tipo").texto);
    await botao.hover();
    await expect(balaoVisivel(page)).toHaveCount(1);
    await balaoDentroDaTela(page, balaoVisivel(page));
    await page.mouse.move(5, 5);
    await expect(balaoVisivel(page)).toHaveCount(0);

    await botao.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(balaoVisivel(page)).toHaveCount(1);
    await page.keyboard.press("Tab");
    await expect(balaoVisivel(page)).toHaveCount(0);
  });
});
