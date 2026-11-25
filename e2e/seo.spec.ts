import { site } from "../src/content/site";
import { negocios as t } from "../src/content/textos";
import { expect, test } from "./apoio";

test.describe("home sem JavaScript e dados estruturados", () => {
  test.describe("sem JavaScript", () => {
    test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

    test("mostra o nome, a frase, o preço de partida e os contatos", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1, name: t.apresentacao.titulo })).toBeVisible();
      await expect(page.locator("main#conteudo")).toContainText(site.nome);
      const corpo = page.locator("main#conteudo");
      await expect(corpo).toContainText(t.apresentacao.subtitulo);
      await expect(corpo).toContainText(/a partir de R\$/);
      const whatsapp = page.getByRole("link", { name: t.semJs.whatsapp });
      await expect(whatsapp).toBeVisible();
      expect((await whatsapp.getAttribute("href"))?.startsWith("https://wa.me/"), "link do WhatsApp").toBe(true);
      await expect(page.getByRole("link", { name: t.semJs.email })).toHaveAttribute("href", `mailto:${site.email}`);
      await expect(page.getByRole("link", { name: t.semJs.comoFunciona })).toHaveAttribute("href", "/como-funciona/");
    });
  });

  test("com JavaScript, o conteúdo do noscript não aparece e há um só h1", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("link", { name: t.semJs.whatsapp })).toHaveCount(0);
  });

  test("os JSON-LD da home são válidos (WebSite e ProfessionalService)", async ({ page }) => {
    await page.goto("/");
    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(2);
    const todos = (await scripts.allTextContents()).map((t) => JSON.parse(t));
    expect(todos.map((d) => d["@type"])).toContain("WebSite");
    const dados = todos.find((d) => d["@type"] === "ProfessionalService");
    expect(dados["@type"]).toBe("ProfessionalService");
    expect(dados.name).toBe(site.nome);
    expect(dados.hasOfferCatalog.itemListElement.length).toBeGreaterThan(0);
  });
});
