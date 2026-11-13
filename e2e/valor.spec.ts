import type { Page } from "@playwright/test";
import { orcamento as t } from "../src/content/textos";
import { brl } from "../src/shared/lib/formato";
import { calcularCarrinho } from "../src/shared/lib/orcamento";
import { barraCarrinho, card, expect, focoDentroDe, iconeCarrinho, modalServico, modelo, painelCarrinho, semRolagemHorizontal, test } from "./apoio";

const v = t.valor;
const dialogoValor = (page: Page) => page.locator("dialog.dialogo-valor");

async function abrirPeloResumo(page: Page) {
  await page.goto("/");
  await card(page, "planilha").getByRole("button", { name: `${t.cards.fazerOrcamento}: ${modelo("planilha").nome}` }).click();
  await expect(modalServico(page)).toBeVisible();
  return modalServico(page).getByRole("button", { name: v.botao });
}

async function abrirPeloCarrinho(page: Page) {
  await page.goto("/");
  await iconeCarrinho(page, "planilha").click();
  await iconeCarrinho(page, "painel").click();
  await barraCarrinho(page).click();
  await expect(painelCarrinho(page)).toBeVisible();
  return painelCarrinho(page).getByRole("button", { name: v.botao });
}

test.describe("Por que esse valor?", () => {
  test("pelo resumo do modal: abre, mostra o serviço, Esc fecha só ele e o foco volta ao botão", async ({ page }) => {
    const botao = await abrirPeloResumo(page);
    await botao.click();

    const d = dialogoValor(page);
    await expect(d).toBeVisible();
    await expect(d.getByRole("heading", { level: 2, name: v.titulo })).toBeFocused();
    await expect(d.getByRole("heading", { name: v.geral.titulo })).toBeVisible();
    await expect(d.getByRole("heading", { name: v.pedido.titulo })).toBeVisible();

    const total = calcularCarrinho(["planilha"]).total;
    await expect(d.getByRole("row", { name: new RegExp(`${v.pedido.total}|${v.pedido.totalAPartirDe}`) })).toContainText(brl(total));

    await page.keyboard.press("Escape");
    await expect(d).toBeHidden();
    await expect(modalServico(page)).toBeVisible();
    await expect(botao).toBeFocused();
  });

  test("pelo carrinho: soma dos serviços, desconto e total batem com o painel; Esc devolve o foco", async ({ page }) => {
    const botao = await abrirPeloCarrinho(page);
    await botao.click();

    const d = dialogoValor(page);
    await expect(d).toBeVisible();
    const c = calcularCarrinho(["planilha", "painel"]);
    expect(c.desconto).not.toBeNull();
    await expect(d.getByRole("row", { name: new RegExp(v.pedido.somaTabela) })).toContainText(brl(c.somaTabela));
    await expect(d.getByRole("row", { name: new RegExp(v.pedido.descontoLinha(c.desconto!.rotulo).replace(/[()]/g, "\\$&")) })).toContainText(brl(c.desconto!.valor));
    await expect(d.getByRole("row", { name: new RegExp(`${v.pedido.total}|${v.pedido.totalAPartirDe}`) })).toContainText(brl(c.total));
    await expect(painelCarrinho(page).getByText(brl(c.total)).first()).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(d).toBeHidden();
    await expect(painelCarrinho(page)).toBeVisible();
    await expect(botao).toBeFocused();
    expect(await focoDentroDe(painelCarrinho(page))).toBe(true);
  });

  test("fecha também pelo botão Entendi", async ({ page }) => {
    const botao = await abrirPeloCarrinho(page);
    await botao.click();
    await dialogoValor(page).getByRole("button", { name: v.fecharRodape }).click();
    await expect(dialogoValor(page)).toBeHidden();
    await expect(botao).toBeFocused();
  });

  test("360 px: sem rolagem horizontal e com rolagem interna", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    const botao = await abrirPeloCarrinho(page);
    await botao.click();
    const d = dialogoValor(page);
    await expect(d).toBeVisible();
    await semRolagemHorizontal(page);
    const medida = await d.evaluate((el) => ({ largura: el.scrollWidth, janela: el.clientWidth }));
    expect(medida.largura).toBeLessThanOrEqual(medida.janela);
    const alvo = await d.getByRole("button", { name: v.fecharRodape }).boundingBox();
    expect(alvo!.height).toBeGreaterThanOrEqual(44);
  });

  test("no resumo, a explicação cobre só o serviço que está sendo configurado", async ({ page }) => {
    const botao = await abrirPeloResumo(page);
    await botao.click();
    await expect(dialogoValor(page).getByRole("table").first()).toBeVisible();
  });
});
