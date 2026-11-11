import type { Page } from "@playwright/test";
import { demoAutomacao } from "../src/content/demoAutomacao";
import { demoPainel } from "../src/content/demoPainel";
import { demoPlanilha } from "../src/content/demoPlanilha";
import { servicosComDemo, type TextosDemo } from "../src/content/demos";
import { servicoPorId } from "../src/content/servicos";
import { orcamento as t } from "../src/content/textos";
import { card, expect, modalServico, semRolagemHorizontal, test } from "./apoio";

type Caso = { chave: string; servicoId: string; d: TextosDemo };
const casos: Caso[] = [
  { chave: "planilha", servicoId: "planilha", d: demoPlanilha },
  { chave: "painel", servicoId: "painel", d: demoPainel },
  { chave: "automacao", servicoId: "automacao", d: demoAutomacao },
];

const demo = (page: Page, chave: string) => page.getByTestId(`demo-${chave}`);
const passoAtual = (page: Page, chave: string) => demo(page, chave).getByTestId("demo-passo-atual");
const botao = (page: Page, chave: string, nome: string) => demo(page, chave).getByRole("button", { name: nome, exact: true });

for (const { chave, servicoId, d } of casos) {
  const idBloco = servicosComDemo[servicoId];

  test.describe(`demonstração animada: ${chave}`, () => {
    test("reproduzir avança sozinho, pausar segura o passo, ver resultado e recomeçar", async ({ page }) => {
      await page.goto(`/como-funciona/#${idBloco}`);
      await expect(demo(page, chave).getByText(d.rotulo)).toBeVisible();
      await expect(passoAtual(page, chave)).toContainText(d.comecoRotulo);

      await botao(page, chave, d.controles.reproduzir).click();
      await expect(botao(page, chave, d.controles.pausar)).toBeVisible();
      // Um passo novo aparece em texto visível, sem precisar de movimento.
      await expect(passoAtual(page, chave)).toContainText(d.passoAtual(1, d.passos.length), { timeout: d.intervaloMs * 3 });

      await botao(page, chave, d.controles.pausar).click();
      const parado = await passoAtual(page, chave).innerText();
      await page.waitForTimeout(d.intervaloMs * 1.5);
      expect(await passoAtual(page, chave).innerText(), "pausado não avança").toBe(parado);

      await botao(page, chave, d.controles.verResultado).click();
      await expect(demo(page, chave).getByRole("status").filter({ hasText: d.resultado })).toBeVisible();
      await expect(passoAtual(page, chave)).toContainText(d.passoAtual(d.passos.length, d.passos.length));

      await botao(page, chave, d.controles.recomecar).click();
      await expect(passoAtual(page, chave)).toContainText(d.comecoRotulo);
      await expect(demo(page, chave).getByRole("status")).toHaveText("");
    });

    test("para quando a seção sai da tela", async ({ page }) => {
      await page.goto(`/como-funciona/#${idBloco}`);
      await botao(page, chave, d.controles.reproduzir).click();
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(demo(page, chave)).not.toBeInViewport();
      const antes = await passoAtual(page, chave).innerText();
      await page.waitForTimeout(d.intervaloMs * 2.5);
      expect(await passoAtual(page, chave).innerText()).toBe(antes);
    });

    test("o link do modal leva à seção", async ({ page }) => {
      await page.goto("/");
      const servico = servicoPorId(servicoId)!;
      await card(page, servicoId).getByRole("button", { name: `${t.cards.verDetalhes}: ${servico.nome}` }).click();
      await expect(modalServico(page)).toBeVisible();
      await modalServico(page).getByRole("link", { name: t.modal.verComoFunciona }).click();
      await expect(page).toHaveURL(new RegExp(`/como-funciona/#${idBloco}$`));
      await expect(demo(page, chave)).toBeVisible();
    });

    test("o card não ganha o link nem botão novo", async ({ page }) => {
      await page.goto("/");
      await expect(card(page, servicoId).getByRole("link", { name: t.modal.verComoFunciona })).toHaveCount(0);
      await expect(card(page, servicoId).getByRole("button")).toHaveCount(3);
    });

    for (const largura of [360, 390]) {
      test(`celular de ${largura} px: sem rolagem horizontal e texto legível`, async ({ page }) => {
        await page.setViewportSize({ width: largura, height: 800 });
        await page.goto(`/como-funciona/#${idBloco}`);
        for (const nome of [d.controles.reproduzir, d.controles.verResultado, d.controles.recomecar]) {
          const caixa = (await botao(page, chave, nome).boundingBox())!;
          expect(caixa.height, nome).toBeGreaterThanOrEqual(44);
        }
        await semRolagemHorizontal(page);
        await botao(page, chave, d.controles.verResultado).click();
        await semRolagemHorizontal(page);
        const menorFonte = await demo(page, chave).locator("td, th").first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
        expect(menorFonte).toBeGreaterThanOrEqual(14);
      });
    }

    test.describe("movimento reduzido", () => {
      test.use({ reducedMotion: "reduce" });

      test("mostra antes e depois e a lista de passos, sem controles", async ({ page }) => {
        await page.goto(`/como-funciona/#${idBloco}`);
        await expect(demo(page, chave).getByText(d.antes, { exact: true })).toBeVisible();
        await expect(demo(page, chave).getByText(d.depois, { exact: true })).toBeVisible();
        await expect(demo(page, chave).getByRole("list", { name: d.listaPassosRotulo }).getByRole("listitem")).toHaveCount(d.passos.length);
        await expect(demo(page, chave).getByText(d.resultado)).toBeVisible();
        await expect(botao(page, chave, d.controles.reproduzir)).toHaveCount(0);
      });

      test("no celular, antes e depois ficam empilhados e sem rolagem horizontal", async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 800 });
        await page.goto(`/como-funciona/#${idBloco}`);
        const a = (await demo(page, chave).getByText(d.antes, { exact: true }).boundingBox())!;
        const b = (await demo(page, chave).getByText(d.depois, { exact: true }).boundingBox())!;
        expect(b.y).toBeGreaterThan(a.y);
        expect(Math.abs(b.x - a.x)).toBeLessThan(2);
        await semRolagemHorizontal(page);
      });
    });
  });
}

test.describe("planilha: o resultado", () => {
  test("termina com o total conferido e recomeça com o total que não bate", async ({ page }) => {
    await page.goto("/como-funciona/#planilhas");
    const tabela = demo(page, "planilha").getByRole("table").first();
    await expect(tabela).toContainText(demoPlanilha.totais.comRepetida);
    await botao(page, "planilha", demoPlanilha.controles.verResultado).click();
    await expect(tabela).toContainText(demoPlanilha.totais.conferido);
  });
});

test.describe("painel: o filtro muda o resultado", () => {
  test("no final, escolher outro mês refaz os indicadores", async ({ page }) => {
    await page.goto("/como-funciona/#paineis");
    const d = demoPainel;
    await botao(page, "painel", d.controles.verResultado).click();
    const painel = demo(page, "painel").getByRole("group", { name: new RegExp(`^${d.painel.titulo}`) });
    // Passo final = dezembro: Camisetas lideram.
    await expect(painel).toContainText("Camisetas");
    await painel.getByRole("button", { name: "Nov", exact: true }).click();
    await expect(painel.getByRole("button", { name: "Nov", exact: true })).toHaveAttribute("aria-pressed", "true");
    // Em novembro os Bonés lideram (confere com os dados do conteúdo).
    await expect(painel.locator("dd").nth(1)).toHaveText("Bonés");
    await painel.getByRole("button", { name: d.painel.todos, exact: true }).click();
    await expect(painel.locator("dd").nth(0)).toHaveText("R$ 70 mil");
  });

  test("movimento reduzido: o painel continua usável", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", locale: "pt-BR" });
    const page = await ctx.newPage();
    await page.goto("/como-funciona/#paineis");
    const painel = demo(page, "painel").getByRole("group", { name: new RegExp(`^${demoPainel.painel.titulo}`) });
    await painel.getByRole("button", { name: "Out", exact: true }).click();
    await expect(painel.locator("dd").nth(0)).toHaveText("R$ 20 mil");
    await ctx.close();
  });
});

test.describe("automação: do passo a passo ao clique", () => {
  test("o último passo mostra o botão clicado e o mesmo total", async ({ page }) => {
    await page.goto("/como-funciona/#automacao");
    const d = demoAutomacao;
    await expect(demo(page, "automacao").getByRole("table")).toHaveCount(d.arquivos.length);
    await botao(page, "automacao", d.controles.verResultado).click();
    await expect(demo(page, "automacao").getByRole("table", { name: d.tabelaJunta })).toContainText("R$ 175");
    await expect(demo(page, "automacao").getByText(`${d.botao.rotulo} (${d.botao.clicado})`)).toBeVisible();
    await expect(page.getByText(d.aviso)).toBeVisible();
  });
});
