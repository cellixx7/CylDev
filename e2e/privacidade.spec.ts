import { site } from "../src/content/site";
import { comum, orcamento as t, privacidade } from "../src/content/textos";
import { emailjsRealConfigurado, expect, iconeCarrinho, barraCarrinho, painelCarrinho, test } from "./apoio";

const ID = "planilha";

test.describe("privacidade", () => {
  test("o rodapé de cada página leva à política", async ({ page }) => {
    for (const caminho of ["/", "/como-funciona/", "/comunidade/"]) {
      await page.goto(caminho);
      await page.getByRole("link", { name: comum.privacidadeLink }).click();
      await expect(page).toHaveURL(/\/privacidade\/$/);
      await expect(page.getByRole("heading", { level: 1, name: privacidade.titulo })).toBeVisible();
    }
  });

  test("a página traz o e-mail de site.ts, o prazo e o que o navegador guarda", async ({ page }) => {
    await page.goto("/privacidade/");
    const corpo = page.locator("main");
    await expect(corpo).toContainText(site.email);
    await expect(corpo).toContainText("12 meses");
    await expect(corpo).toContainText("sessionStorage");
    await expect(corpo).not.toContainText("{email}");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/privacidade\/$/);
  });

  test("o carrinho diz o que é enviado e liga à política", async ({ page }) => {
    test.skip(!emailjsRealConfigurado, "sem EmailJS o formulário (e a linha) não aparece");
    await page.goto("/");
    await iconeCarrinho(page, ID).click();
    await barraCarrinho(page).click();
    const painel = painelCarrinho(page);
    await expect(painel.getByText(t.carrinho.privacidade)).toBeVisible();
    await painel.getByRole("link", { name: t.carrinho.privacidadeLink }).click();
    await expect(page).toHaveURL(/\/privacidade\/$/);
  });

  test("sitemap e página sem noindex", async ({ request }) => {
    const mapa = await request.get("/sitemap.xml");
    expect(await mapa.text()).toContain("/privacidade/");
  });
});
