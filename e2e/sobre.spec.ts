import { site } from "../src/content/site";
import { negocios } from "../src/content/textos";
import { expect, semRolagemHorizontal, test } from "./apoio";

const t = negocios.sobre;

for (const [largura, altura] of [[360, 740], [390, 844], [768, 1024], [1440, 900]] as const) {
  test.describe(`seção Sobre: ${largura} px`, () => {
    test.use({ viewport: { width: largura, height: altura } });

    test("/#sobre rola até o título (livre do cabeçalho), sem rolagem lateral e com imagens rotuladas", async ({ page }) => {
      await page.goto("/#sobre");
      const titulo = page.getByRole("heading", { name: t.titulo });
      await expect(titulo).toBeInViewport();
      const cabecalho = await page.locator("header").first().boundingBox();
      const caixa = await titulo.boundingBox();
      expect(caixa!.y).toBeGreaterThanOrEqual(cabecalho!.y + cabecalho!.height - 1);
      await semRolagemHorizontal(page);
      const secao = page.locator("#sobre");
      await expect(secao.getByText(t.rotuloImagem)).toHaveCount(site.imagensUniser.length);
      await expect(secao.getByText(t.atendimento)).toBeVisible();
      await expect(secao.getByText(t.ministerio)).toBeVisible();
    });

    test("Tab chega ao botão Falar comigo com foco visível", async ({ page }) => {
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
