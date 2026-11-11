import { demoPlanilha as d } from "../src/content/demoPlanilha";
import { orcamento as t } from "../src/content/textos";
import { servicoPorId } from "../src/content/servicos";
import { card, expect, modalServico, semRolagemHorizontal, test } from "./apoio";

const ID_SERVICO = "planilha";
const ID_BLOCO = "planilhas";
const demo = (page: import("@playwright/test").Page) => page.getByTestId("demo-planilha");
const passoAtual = (page: import("@playwright/test").Page) => page.getByTestId("demo-passo-atual");
const botao = (page: import("@playwright/test").Page, nome: string) => demo(page).getByRole("button", { name: nome, exact: true });

test.describe("demonstração animada da planilha", () => {
  test("reproduzir avança sozinho, pausar segura o passo, ver resultado e recomeçar", async ({ page }) => {
    await page.goto(`/como-funciona/#${ID_BLOCO}`);
    await expect(demo(page).getByText(d.rotulo)).toBeVisible();
    await expect(passoAtual(page)).toContainText(d.comecoRotulo);

    await botao(page, d.controles.reproduzir).click();
    await expect(botao(page, d.controles.pausar)).toBeVisible();
    // Um passo novo aparece em texto visível, sem precisar de movimento.
    await expect(passoAtual(page)).toContainText(d.passoAtual(1, d.passos.length), { timeout: d.intervaloMs * 3 });

    await botao(page, d.controles.pausar).click();
    const parado = await passoAtual(page).innerText();
    await page.waitForTimeout(d.intervaloMs * 1.5);
    expect(await passoAtual(page).innerText(), "pausado não avança").toBe(parado);

    await botao(page, d.controles.verResultado).click();
    await expect(page.getByRole("status").filter({ hasText: d.resultado })).toBeVisible();
    await expect(demo(page).getByRole("table").first()).toContainText(d.totais.conferido);

    await botao(page, d.controles.recomecar).click();
    await expect(passoAtual(page)).toContainText(d.comecoRotulo);
    await expect(demo(page).getByRole("table").first()).toContainText(d.totais.comRepetida);
  });

  test("a demonstração para quando a seção sai da tela", async ({ page }) => {
    await page.goto(`/como-funciona/#${ID_BLOCO}`);
    await botao(page, d.controles.reproduzir).click();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(demo(page)).not.toBeInViewport();
    const antes = await passoAtual(page).innerText();
    await page.waitForTimeout(d.intervaloMs * 2.5);
    expect(await passoAtual(page).innerText()).toBe(antes);
  });

  test("o link do modal leva à seção da planilha", async ({ page }) => {
    await page.goto("/");
    const servico = servicoPorId(ID_SERVICO)!;
    await card(page, ID_SERVICO).getByRole("button", { name: `${t.cards.verDetalhes}: ${servico.nome}` }).click();
    await expect(modalServico(page)).toBeVisible();
    await modalServico(page).getByRole("link", { name: t.modal.verComoFunciona }).click();
    await expect(page).toHaveURL(new RegExp(`/como-funciona/#${ID_BLOCO}$`));
    await expect(demo(page)).toBeVisible();
  });

  test("o card e os outros serviços não ganham o link", async ({ page }) => {
    await page.goto("/");
    await expect(card(page, ID_SERVICO).getByRole("link", { name: t.modal.verComoFunciona })).toHaveCount(0);
    const outro = servicoPorId("painel")!;
    await card(page, "painel").getByRole("button", { name: `${t.cards.verDetalhes}: ${outro.nome}` }).click();
    await expect(modalServico(page).getByRole("link", { name: t.modal.verComoFunciona })).toHaveCount(0);
  });

  for (const largura of [360, 390]) {
    test(`celular de ${largura} px: sem rolagem horizontal e texto legível`, async ({ page }) => {
      await page.setViewportSize({ width: largura, height: 800 });
      await page.goto(`/como-funciona/#${ID_BLOCO}`);
      for (const nome of [d.controles.reproduzir, d.controles.verResultado, d.controles.recomecar]) {
        const caixa = (await botao(page, nome).boundingBox())!;
        expect(caixa.height, nome).toBeGreaterThanOrEqual(44);
      }
      await semRolagemHorizontal(page);
      await botao(page, d.controles.verResultado).click();
      await semRolagemHorizontal(page);
      const menorFonte = await demo(page).locator("td, th").first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(menorFonte).toBeGreaterThanOrEqual(14);
    });
  }
});

test.describe("movimento reduzido", () => {
  test.use({ reducedMotion: "reduce" });

  test("mostra antes e depois e a lista de passos, sem controles", async ({ page }) => {
    await page.goto(`/como-funciona/#${ID_BLOCO}`);
    await expect(demo(page).getByRole("table", { name: d.tabelaAntes })).toBeVisible();
    await expect(demo(page).getByRole("table", { name: d.tabelaDepois })).toBeVisible();
    await expect(demo(page).getByRole("table", { name: d.tabelaDepois })).toContainText(d.totais.conferido);
    await expect(demo(page).getByRole("list", { name: d.listaPassosRotulo }).getByRole("listitem")).toHaveCount(d.passos.length);
    await expect(demo(page).getByText(d.resultado)).toBeVisible();
    await expect(botao(page, d.controles.reproduzir)).toHaveCount(0);
  });

  test("no celular, antes e depois ficam empilhados", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(`/como-funciona/#${ID_BLOCO}`);
    const a = (await demo(page).getByRole("table", { name: d.tabelaAntes }).boundingBox())!;
    const b = (await demo(page).getByRole("table", { name: d.tabelaDepois }).boundingBox())!;
    expect(b.y).toBeGreaterThan(a.y + a.height - 1);
    await semRolagemHorizontal(page);
  });
});
