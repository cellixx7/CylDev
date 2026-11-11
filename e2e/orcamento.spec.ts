import type { Page } from "@playwright/test";
import { orcamento as t, negocios } from "../src/content/textos";
import { barraCarrinho, card, carrinhoSalvo, expect, focoDentroDe, iconeCarrinho, modalServico, modelo, opcao, painelCarrinho, test } from "./apoio";

const ID = "planilha";
const servico = modelo(ID);
// Pergunta de escolha única da planilha e uma opção que não é a primeira.
const pergunta = servico.perguntas.find((p) => p.id === "existente")!;
const escolha = pergunta.opcoes.find((o) => o.id === "bagunca")!;

const fazerOrcamento = (page: Page) => card(page, ID).getByRole("button", { name: `${t.cards.fazerOrcamento}: ${servico.nome}` });
const verDetalhes = (page: Page) => card(page, ID).getByRole("button", { name: `${t.cards.verDetalhes}: ${servico.nome}` });

test.describe("1. escolher, ajustar uma resposta e pôr no carrinho", () => {
  test("o card tem dois botões de texto e o ícone do carrinho", async ({ page }) => {
    await page.goto("/");
    await expect(card(page, ID).getByRole("button")).toHaveCount(3);
    await expect(fazerOrcamento(page)).toHaveText(t.cards.fazerOrcamento);
    await expect(verDetalhes(page)).toHaveText(t.cards.verDetalhes);
    await expect(iconeCarrinho(page, ID)).toHaveAttribute("aria-pressed", "false");
  });

  test("responde no modal, põe no carrinho pelo ícone do card e o painel mostra a resposta", async ({ page }) => {
    await page.goto("/");
    await fazerOrcamento(page).click();

    const modal = modalServico(page);
    await expect(modal).toBeVisible();
    await expect(modal.getByRole("heading", { level: 2, name: servico.nome })).toBeVisible();
    await expect(modal.getByRole("tab", { name: t.modal.abas.orcamento })).toHaveAttribute("aria-selected", "true");

    const { entrada, etiqueta } = opcao(page, ID, pergunta.id, escolha.id);
    await expect(entrada).not.toBeChecked();
    await etiqueta.click();
    await expect(entrada).toBeChecked();
    await expect(modal.getByText(t.painel.progresso(1, servico.perguntas.length))).toBeVisible();

    await modal.getByRole("button", { name: t.modal.fechar, exact: true }).click();
    await expect(modal).toBeHidden();
    await expect(barraCarrinho(page)).toHaveCount(0);

    await iconeCarrinho(page, ID).click();
    await expect(iconeCarrinho(page, ID)).toHaveAttribute("aria-pressed", "true");
    await expect(barraCarrinho(page)).toContainText(t.barra.titulo(1));

    await barraCarrinho(page).click();
    const painel = painelCarrinho(page);
    await expect(painel.getByRole("heading", { level: 2, name: t.carrinho.tituloComQtd(1) })).toBeVisible();
    await expect(painel.getByRole("heading", { level: 3, name: servico.nome })).toBeVisible();
    await painel.getByText(t.carrinho.mostrarRespostas).click();
    await expect(painel.getByText(escolha.rotulo)).toBeVisible();
    expect(await carrinhoSalvo(page)).toMatchObject({ ids: [ID], respostas: { [ID]: { [pergunta.id]: escolha.id } } });
  });

  test("o ícone alterna: o segundo clique tira do carrinho", async ({ page }) => {
    await page.goto("/");
    await iconeCarrinho(page, ID).click();
    await expect(iconeCarrinho(page, ID)).toHaveAttribute("aria-pressed", "true");
    await iconeCarrinho(page, ID).click();
    await expect(iconeCarrinho(page, ID)).toHaveAttribute("aria-pressed", "false");
    await expect(barraCarrinho(page)).toHaveCount(0);
  });
});

test.describe("2. o carrinho sobrevive à troca de página e ao recarregar", () => {
  async function conferirPedido(page: Page) {
    await expect(barraCarrinho(page)).toContainText(t.barra.titulo(1));
    await expect(iconeCarrinho(page, ID)).toHaveAttribute("aria-pressed", "true");
    await fazerOrcamento(page).click();
    await expect(opcao(page, ID, pergunta.id, escolha.id).entrada).toBeChecked();
    await page.keyboard.press("Escape");
    await expect(modalServico(page)).toBeHidden();
  }

  test("ida a Como funciona e volta, depois recarregar", async ({ page }) => {
    await page.goto("/");
    await fazerOrcamento(page).click();
    await opcao(page, ID, pergunta.id, escolha.id).etiqueta.click();
    await modalServico(page).getByRole("button", { name: t.modal.adicionar, exact: true }).click();
    await page.keyboard.press("Escape");
    await expect(modalServico(page)).toBeHidden();

    const comoFunciona = negocios.nav.find((l) => l.href === "/como-funciona/")!;
    const orcamentoNoMenu = negocios.nav.find((l) => l.href === "/#orcamento")!;
    const menu = page.getByRole("navigation", { name: "Principal" });
    await menu.getByRole("link", { name: comoFunciona.rotulo, exact: true }).click();
    await expect(page).toHaveURL(/\/como-funciona\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await menu.getByRole("link", { name: orcamentoNoMenu.rotulo, exact: true }).click();
    await expect(page).toHaveURL(/\/#orcamento$/);
    // Vindo de outra página, a âncora leva até a seção (e não ao topo).
    await expect(page.locator("#orcamento-titulo")).toBeInViewport();
    await conferirPedido(page);

    await page.reload();
    await conferirPedido(page);
  });
});

test.describe("3. modal: teclado, Esc e voltar do navegador", () => {
  async function abrirPeloTeclado(page: Page) {
    await verDetalhes(page).focus();
    await page.keyboard.press("Enter");
    await expect(modalServico(page)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`#${ID}$`));
    // O foco entra no modal, no título.
    await expect(modalServico(page).getByRole("heading", { level: 2 })).toBeFocused();
  }

  async function fechouComFocoNoCard(page: Page) {
    await expect(modalServico(page)).toBeHidden();
    await expect.poll(() => focoDentroDe(card(page, ID)), { message: "o foco volta ao card" }).toBe(true);
    // Dentro do card, o foco volta ao botão que abriu o modal.
    await expect(verDetalhes(page)).toBeFocused();
    // Sem hash solto na URL.
    expect(new URL(page.url()).hash).toBe("");
  }

  test("abre com Enter e fecha com Esc", async ({ page }) => {
    await page.goto("/");
    await abrirPeloTeclado(page);
    await page.keyboard.press("Escape");
    await fechouComFocoNoCard(page);
  });

  test("fecha pelo botão Fechar, alcançado com Tab", async ({ page }) => {
    await page.goto("/");
    await abrirPeloTeclado(page);
    await page.keyboard.press("Tab");
    await expect(modalServico(page).getByRole("button", { name: t.modal.fechar, exact: true })).toBeFocused();
    await page.keyboard.press("Enter");
    await fechouComFocoNoCard(page);
  });

  test("as abas trocam com as setas e o Tab não sai do modal", async ({ page }) => {
    await page.goto("/");
    await abrirPeloTeclado(page);
    const abaDetalhes = modalServico(page).getByRole("tab", { name: t.modal.abas.detalhes });
    const abaOrcamento = modalServico(page).getByRole("tab", { name: t.modal.abas.orcamento });
    await abaDetalhes.focus();
    await page.keyboard.press("ArrowRight");
    await expect(abaOrcamento).toBeFocused();
    await expect(abaOrcamento).toHaveAttribute("aria-selected", "true");
    await expect(page).toHaveURL(new RegExp(`#${ID}/orcamento$`));
    // Nenhum elemento da página atrás recebe o foco enquanto o modal está aberto.
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      const foraDoModal = await page.evaluate(() => {
        const a = document.activeElement;
        return !!a && a !== document.body && !a.closest("dialog");
      });
      expect(foraDoModal, "o Tab não alcança a página atrás do modal").toBe(false);
    }
    await page.keyboard.press("Escape");
    await fechouComFocoNoCard(page);
  });

  test("o voltar do navegador fecha o modal e fica na página", async ({ page }) => {
    await page.goto("/");
    await abrirPeloTeclado(page);
    await page.goBack();
    await fechouComFocoNoCard(page);
    expect(new URL(page.url()).pathname).toBe("/");
    // Avançar reabre o mesmo serviço.
    await page.goForward();
    await expect(modalServico(page)).toBeVisible();
    await expect(modalServico(page).getByRole("heading", { level: 2, name: servico.nome })).toBeVisible();
  });
});
