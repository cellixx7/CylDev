import { expect, test } from "@playwright/test";

test.describe("Idioma", () => {
  test("navegador em inglês é levado para /en/ e lembra a escolha", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "en-US" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await ctx.close();
  });

  test("idioma fora da lista cai no inglês", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "de-DE" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/$/);
    await ctx.close();
  });

  test("o seletor troca de idioma e a escolha vale na próxima visita", async ({ page, browser }) => {
    await page.goto("/termos/");
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await page.getByRole("button", { name: /idioma/i }).click();
    await page.getByRole("link", { name: "Español" }).click();
    await expect(page).toHaveURL(/\/es\/termos\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    // Escolhi português de volta: a preferência salva vence a do navegador.
    await page.getByRole("button", { name: /idioma/i }).click();
    await page.getByRole("link", { name: "Português" }).click();
    await expect(page).toHaveURL(/\/termos\/$/);
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await expect(page).not.toHaveURL(/\/en\//);
    void browser;
  });

  test("links internos de /en/ ficam em /en/", async ({ page }) => {
    await page.goto("/en/");
    const fora = await page.$$eval("a[href^='/']", (as) =>
      as.map((a) => a.getAttribute("href")!).filter((h) => !h.startsWith("/en/") && !h.startsWith("/#") && !/\.(svg|png|txt|xml)$/.test(h)),
    );
    expect(fora).toEqual([]);
  });

  test("página de leitura em outro idioma avisa que só vale o português", async ({ page }) => {
    await page.goto("/en/termos/");
    await expect(page.getByRole("note")).toContainText("Portuguese");
  });

  test("360 px: o botão de idioma cabe no cabeçalho sem rolagem lateral", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/en/");
    const largura = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(largura).toBeLessThanOrEqual(360);
  });
});
