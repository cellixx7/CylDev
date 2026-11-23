import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";
import { vejaMais as t } from "../src/content/textos";
import { brl } from "../src/shared/lib/formato";
import { filtrar, indicadores, semFiltros, vendasDoCsv } from "../src/shared/lib/painelPlanilha";
import { expect, semRolagemHorizontal, test } from "./apoio";

const vendas = vendasDoCsv(readFileSync("src/content/exemplo-planilha/planilha-arrumada.csv", "utf-8"));
const total = indicadores(vendas).faturamento;
const janeiro = indicadores(filtrar(vendas, { ...semFiltros, meses: ["2026-01"] })).faturamento;
const casacos = indicadores(filtrar(vendas, { ...semFiltros, categorias: ["Casacos"] })).faturamento;

const faturamento = (page: Page) => page.getByTestId("ind-faturamento");

async function abrirPainel(page: Page) {
  await page.goto("/#veja-mais");
  const botao = page.getByTestId("card-painel").getByRole("button", { name: t.painelCard.abrir, exact: true });
  await botao.scrollIntoViewIfNeeded();
  await botao.click();
  const dialogo = page.getByRole("dialog", { name: t.painelCard.modalTitulo });
  await expect(dialogo).toBeVisible();
  await expect(faturamento(page)).toBeVisible();
  return { dialogo, botao };
}

test.describe("Veja mais: planilha de exemplo", () => {
  test("os três cards mostram a planilha como chega, arrumada e a prévia do painel", async ({ page }) => {
    await page.goto("/#veja-mais");
    for (const id of ["card-antes", "card-depois", "card-painel"]) await expect(page.getByTestId(id)).toBeAttached();
    await expect(page.getByTestId("card-antes").getByRole("heading", { name: t.antes.titulo })).toBeAttached();
    await expect(page.getByTestId("card-antes").getByText(t.rotuloExemplar)).toBeAttached();
    await expect(page.getByTestId("card-painel").getByTestId("previa-painel")).toBeAttached();
    await expect(page.getByTestId("card-painel").getByText(brl(total), { exact: true })).toBeAttached();
  });

  test("a planilha bagunçada abre em diálogo, com as cinco abas, e o foco volta ao botão", async ({ page }) => {
    await page.goto("/#veja-mais");
    const botao = page.getByTestId("card-antes").getByRole("button", { name: t.antes.abrir, exact: true });
    await botao.scrollIntoViewIfNeeded();
    await botao.click();
    const dialogo = page.getByRole("dialog", { name: t.antes.modalTitulo });
    await expect(dialogo).toBeVisible();
    await expect(dialogo.getByRole("tab")).toHaveCount(5);
    await dialogo.getByRole("tab", { name: "MARÇO NOVO" }).click();
    await expect(dialogo.getByRole("tabpanel").getByRole("table")).toContainText("cobrar a Igreja");
    await expect(dialogo.locator("tr[data-fiado]").first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialogo).toBeHidden();
    await expect(botao).toBeFocused();
  });

  test("a planilha arrumada lista o que foi arrumado e mostra as 94 vendas", async ({ page }) => {
    await page.goto("/#veja-mais");
    const botao = page.getByTestId("card-depois").getByRole("button", { name: t.depois.abrir, exact: true });
    await botao.scrollIntoViewIfNeeded();
    await botao.click();
    const dialogo = page.getByRole("dialog", { name: t.depois.modalTitulo });
    await expect(dialogo.getByRole("listitem")).toHaveCount(t.depois.arrumado.length);
    await expect(dialogo.getByRole("table").locator("tbody tr")).toHaveCount(vendas.length + 1);
  });

  test("filtro de mês muda o faturamento; categoria faz filtro cruzado; limpar volta ao total", async ({ page }) => {
    const { dialogo } = await abrirPainel(page);
    await expect(faturamento(page)).toHaveText(brl(total));
    await expect(page.getByTestId("painel-contador")).toHaveText(t.painel.filtros.contador(vendas.length, vendas.length));

    await dialogo.getByRole("button", { name: "Jan", exact: true }).click();
    await expect(faturamento(page)).toHaveText(brl(janeiro));
    await expect(page.getByTestId("painel-anuncio")).toContainText(brl(janeiro));

    // Limpa o mês e clica na barra de Casacos: os outros gráficos e os indicadores passam a mostrar só casacos.
    await dialogo.getByRole("button", { name: t.painel.filtros.limpar, exact: true }).click();
    await expect(faturamento(page)).toHaveText(brl(total));
    await dialogo.locator('button[data-barra][data-chave="Casacos"]').click();
    await expect(faturamento(page)).toHaveText(brl(casacos));
    await expect(dialogo.locator('button[data-barra][data-chave="Casacos"]')).toHaveAttribute("aria-pressed", "true");
    await expect(dialogo.locator('button[data-barra][data-chave="Canecas"]')).toHaveAttribute("aria-pressed", "false");

    // Clicar de novo desliga.
    await dialogo.locator('button[data-barra][data-chave="Casacos"]').click();
    await expect(faturamento(page)).toHaveText(brl(total));

    // Filtro ativo removível pela faixa.
    await dialogo.getByRole("button", { name: "Fiado", exact: true }).first().click();
    await dialogo.getByRole("button", { name: /Remover o filtro/ }).first().click();
    await expect(faturamento(page)).toHaveText(brl(total));
  });

  test("filtros que zeram tudo mostram o estado vazio com o botão de limpar", async ({ page }) => {
    const { dialogo } = await abrirPainel(page);
    await dialogo.getByRole("button", { name: t.painel.filtros.situacoes.fiado, exact: true }).first().click();
    await dialogo.locator('button[data-filtro="pagamentos:Pix"]').click();
    await expect(page.getByTestId("painel-vazio")).toContainText(t.painel.vazio.titulo);
    await page.getByTestId("painel-vazio").getByRole("button", { name: t.painel.vazio.acao }).click();
    await expect(faturamento(page)).toHaveText(brl(total));
  });

  test("teclado: Tab chega às barras, setas movem entre elas e Enter filtra", async ({ page }) => {
    const { dialogo } = await abrirPainel(page);
    const primeira = dialogo.locator('button[data-barra][data-chave="Casacos"]');
    await primeira.focus();
    await expect(primeira).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(dialogo.locator('button[data-barra][data-chave="Camisetas"]')).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(dialogo.locator('button[data-barra][data-chave="Camisetas"]')).toHaveAttribute("aria-pressed", "true");
    await expect(faturamento(page)).not.toHaveText(brl(total));
  });

  test("a tabela ordena por coluna e pagina de 10 em 10", async ({ page }) => {
    const { dialogo } = await abrirPainel(page);
    const linhas = dialogo.getByRole("region", { name: t.painel.tabela.titulo }).locator("tbody tr");
    await expect(linhas).toHaveCount(10);
    await dialogo.getByRole("button", { name: t.painel.tabela.ordenarPor(t.painel.tabela.colunas.valorTotal) }).click();
    await dialogo.getByRole("button", { name: t.painel.tabela.ordenarPor(t.painel.tabela.colunas.valorTotal) }).click();
    const maior = Math.max(...vendas.map((v) => v.valorTotal));
    await expect(linhas.first()).toContainText(brl(maior));
    await dialogo.getByRole("button", { name: t.painel.tabela.proxima }).click();
    await expect(dialogo.getByText(t.painel.tabela.pagina(2, 10))).toBeVisible();
  });

  test("nenhum texto do painel aberto fica abaixo de 14 px, nem dentro do SVG", async ({ page }) => {
    const { dialogo } = await abrirPainel(page);
    const pequenos = await dialogo.evaluate((raiz) => {
      const ruins: string[] = [];
      const visivel = (el: Element) => (el as HTMLElement).getClientRects().length > 0 && !el.closest(".sr-only");
      for (const el of raiz.querySelectorAll("*")) {
        const proprio = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent?.trim());
        if (!proprio || !visivel(el)) continue;
        // No SVG, o tamanho que vale é o desenhado na tela (viewBox escalado).
        const caixa = (el as SVGGraphicsElement).getBoundingClientRect();
        const svg = el.closest("svg");
        const escala = svg ? svg.getBoundingClientRect().width / (svg.viewBox.baseVal.width || 1) : 1;
        const px = parseFloat(getComputedStyle(el).fontSize) * (svg ? escala : 1);
        if (px < 13.95 && caixa.width > 0) ruins.push(`${el.tagName} "${el.textContent?.trim().slice(0, 20)}" ${px.toFixed(1)}px`);
      }
      return ruins;
    });
    expect(pequenos).toEqual([]);
  });

  test("os títulos do painel descem sem pular nível (h2 do diálogo, h3 dos gráficos)", async ({ page }) => {
    const { dialogo } = await abrirPainel(page);
    const niveis = await dialogo.locator("h1, h2, h3, h4").evaluateAll((hs) => hs.map((h) => Number(h.tagName[1])));
    expect(niveis[0]).toBe(2);
    expect(niveis.slice(1).every((n) => n === 3)).toBe(true);
  });

  for (const largura of [360, 390]) {
    test(`${largura} px: sem rolagem lateral na página, com a seção e com o painel aberto`, async ({ page }) => {
      await page.setViewportSize({ width: largura, height: 780 });
      await page.goto("/#veja-mais");
      await semRolagemHorizontal(page);
      await abrirPainel(page);
      await semRolagemHorizontal(page);
    });
  }
});
