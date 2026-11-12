import { expect, test } from "./apoio";

const tema = (page: import("@playwright/test").Page) => page.locator("html").getAttribute("data-theme");

test.describe("tema padrão", () => {
  test.use({ colorScheme: "dark" });

  test("Negócios abre em claro mesmo com o sistema em modo escuro", async ({ page }) => {
    for (const caminho of ["/", "/como-funciona/", "/obrigado/", "/privacidade/"]) {
      await page.goto(caminho);
      expect(await tema(page), caminho).toBe("claro");
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#f2f4f8");
    }
  });

  test("a Comunidade continua escura por padrão", async ({ page }) => {
    await page.goto("/comunidade/");
    expect(await tema(page)).toBe("escuro");
  });

  test("a escolha salva de Negócios é mantida", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("tema-negocios", "escuro"));
    await page.goto("/");
    expect(await tema(page)).toBe("escuro");
  });
});
