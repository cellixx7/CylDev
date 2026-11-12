import { orcamento as t } from "../src/content/textos";
import { card, carrinhoSalvo, expect, modalServico, modelo, opcao, semRolagemHorizontal, test } from "./apoio";

const ID = "sistema";
const servico = modelo(ID);
const p = t.painel;

test.describe("sistema sob medida: perguntas condicionais no celular", () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test("abrir filhas, responder, mudar a pai e ver as filhas sumirem sem somar horas", async ({ page }) => {
    await page.goto("/");
    await card(page, ID).getByRole("button", { name: `${t.cards.fazerOrcamento}: ${servico.nome}` }).click();
    const modal = modalServico(page);
    await expect(modal).toBeVisible();
    const rodape = modal.locator("footer");

    // Ponto de partida: só as 8 principais.
    await expect(modal.getByText(p.progresso(0, 8))).toBeVisible();
    await expect(rodape).toContainText("1.000");
    await semRolagemHorizontal(page);

    // SaaS abre duas perguntas, anunciadas em role="status", sem roubar o foco.
    const saas = opcao(page, ID, "tipo", "saas");
    await saas.etiqueta.click();
    await expect(modal.getByRole("status").filter({ hasText: p.novasPerguntas(2, "tipo de sistema") })).toHaveCount(1);
    await expect(modal.getByText(p.progresso(1, 10))).toBeVisible();
    await expect(modal.getByRole("group", { name: /Como o sistema será cobrado/ })).toBeVisible();
    await expect(modal.getByRole("group", { name: /Quantos tipos de usuário/ })).toBeVisible();
    await expect(saas.entrada).toBeFocused();
    await expect(rodape).toContainText("1.400"); // 8 h x R$ 50 a mais

    // Filha respondida (mensalidade, 2 h): soma.
    await opcao(page, ID, "cobranca", "mensal").etiqueta.click();
    await expect(modal.getByText(p.progresso(2, 10))).toBeVisible();
    await expect(rodape).toContainText("1.500");
    await semRolagemHorizontal(page);

    // Muda a pai para "Programa de computador" (4 h): as filhas somem e a resposta delas é descartada.
    await opcao(page, ID, "tipo", "programa").etiqueta.click();
    await expect(modal.getByRole("group", { name: /Como o sistema será cobrado/ })).toHaveCount(0);
    await expect(modal.getByRole("group", { name: /Quantos tipos de usuário/ })).toHaveCount(0);
    await expect(modal.getByText(p.progresso(1, 8))).toBeVisible();
    await expect(rodape).toContainText("1.200");
    await expect(rodape).not.toContainText("1.500");

    // Voltar para SaaS reabre as filhas vazias: a resposta antiga não volta.
    await saas.etiqueta.click();
    await expect(opcao(page, ID, "cobranca", "mensal").entrada).not.toBeChecked();
    await expect(rodape).toContainText("1.400");
  });

  test("teclado: espaço marca a opção e o anúncio aparece", async ({ page }) => {
    await page.goto("/#sistema/orcamento");
    const modal = modalServico(page);
    await expect(modal).toBeVisible();
    const aplicativo = opcao(page, ID, "tipo", "aplicativo").entrada;
    await aplicativo.focus();
    await page.keyboard.press("Space");
    await expect(aplicativo).toBeChecked();
    await expect(modal.getByRole("status").filter({ hasText: p.novasPerguntas(2, "tipo de sistema") })).toHaveCount(1);
    await expect(aplicativo).toBeFocused();
  });

  test("o carrinho guarda só ids e as respostas visíveis (a órfã não é guardada)", async ({ page }) => {
    await page.goto("/#sistema/orcamento");
    await opcao(page, ID, "tipo", "saas").etiqueta.click();
    await opcao(page, ID, "cobranca", "mensal").etiqueta.click();
    await opcao(page, ID, "tipo", "programa").etiqueta.click();
    await modalServico(page).getByRole("button", { name: t.modal.adicionar }).click();
    // Só ids e respostas visíveis: a resposta da filha que sumiu não é guardada.
    expect(await carrinhoSalvo(page)).toMatchObject({ ids: [ID], respostas: { [ID]: { tipo: "programa" } } });
    expect((await carrinhoSalvo(page))!.respostas[ID]).not.toHaveProperty("cobranca");
    await page.reload();
    await expect(modalServico(page)).toBeHidden();
  });
});
