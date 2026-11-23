import { negocios } from "../src/content/textos";
import { expect, test } from "./apoio";

// Cyl acenando no header (no lugar do controle de videogame), sem tooltip, e o rosto dele no chat.

const atalho = negocios.atalhoComunidade;

test.describe("Cyl no header", () => {
  test("acena ao carregar, sem nuvem nem dica, e o link continua levando à comunidade", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: atalho.rotulo });
    await expect(link).toHaveAttribute("href", atalho.href);
    await expect(link).toHaveAttribute("title", atalho.rotulo);
    // O braço esquerdo do Cyl entra em movimento durante o aceno.
    await expect.poll(() => page.evaluate(() => document.getAnimations().some((a) => (a.effect as KeyframeEffect | null)?.target?.getAttribute?.("data-parte") === "arm-left-upper"))).toBe(true);
    // Nada de tooltip: nem a nuvem "Conheça o CylDev" nem a dica completa.
    await expect(page.getByText("Conheça o CylDev")).toHaveCount(0);
    await link.hover();
    await expect(page.getByText("Conheça o CylDev")).toHaveCount(0);
    await expect(page.locator("#dica-comunidade")).toHaveCount(0);
  });

  test("com movimento reduzido nada anima", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => document.getAnimations().filter((a) => (a.effect as KeyframeEffect | null)?.target?.getAttribute?.("data-parte")).length)).toBe(0);
  });

  test("o Cyl no chat é só o rosto parado", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir o Assistente Cyl" }).click();
    const dialogo = page.getByRole("dialog");
    await expect(dialogo.locator("svg").first()).toBeVisible();
    expect(await dialogo.locator("svg").first().evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
  });
});
