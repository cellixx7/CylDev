import type { Page } from "@playwright/test";
import { formulario as tf, orcamento as t } from "../src/content/textos";
import { TEMPO_MINIMO_MS } from "../src/shared/lib/emailjs";
import { ERRO_TELEFONE } from "../src/shared/lib/telefone";
import {
  barraCarrinho,
  card,
  emailjsRealConfigurado,
  expect,
  modalServico,
  modelo,
  NOME_FICTICIO,
  opcao,
  painelCarrinho,
  test,
} from "./apoio";

// Percursos só com o teclado nos formulários (Tab, Enter, Esc). Nenhum envio real: o EmailJS é interceptado em apoio.ts.
const ID = "planilha";
const servico = modelo(ID);
const pergunta = servico.perguntas.find((p) => p.id === "existente")!;
const escolha = pergunta.opcoes.find((o) => o.id === "bagunca")!;
const INICIO = new Date("2026-11-23T12:00:00-03:00");

const idFocado = (page: Page) => page.evaluate(() => document.activeElement?.getAttribute("name") ?? document.activeElement?.tagName ?? "");

test.describe("formulários pelo teclado", () => {
  test.beforeEach(async ({ page, emailjs }) => {
    test.skip(!emailjsRealConfigurado, "sem EmailJS os formulários não aparecem");
    await emailjs.ligar();
    await page.clock.install({ time: INICIO });
  });

  test("contato: ordem do Tab, erro do telefone anunciado e ligado ao campo, Enter envia o formulário", async ({ page, emailjs }) => {
    await page.goto("/");
    const contato = page.locator("section#contato");
    const nome = contato.getByLabel(tf.nome);
    await nome.focus();
    await page.keyboard.type(NOME_FICTICIO);

    // Nome -> rádios (um só tab stop no grupo) -> WhatsApp -> mensagem -> Enviar. A isca fica fora da ordem (tabIndex -1).
    await page.keyboard.press("Tab");
    expect(await idFocado(page)).toBe("preferencia");
    await page.keyboard.press("Tab");
    expect(await idFocado(page)).toBe("whatsapp");
    await page.keyboard.type("123");
    await page.keyboard.press("Tab");
    expect(await idFocado(page)).toBe("mensagem");
    await page.keyboard.type("Preciso de um orçamento");

    await page.clock.fastForward(TEMPO_MINIMO_MS + 1000);
    await page.keyboard.press("Tab");
    await expect(contato.getByRole("button", { name: tf.enviar, exact: true })).toBeFocused();
    await page.keyboard.press("Enter");

    const campo = contato.locator('input[name="whatsapp"]');
    const erro = contato.getByRole("alert").filter({ hasText: ERRO_TELEFONE });
    await expect(erro).toBeVisible();
    await expect(campo).toBeFocused();
    await expect(campo).toHaveAttribute("aria-invalid", "true");
    const idErro = await erro.getAttribute("id");
    expect(idErro).toBeTruthy();
    await expect(campo).toHaveAttribute("aria-describedby", idErro!);
    expect(emailjs.enviados).toHaveLength(0);
  });

  test("checkout: erro do telefone anunciado, Esc fecha o painel e o foco volta para a página", async ({ page, emailjs }) => {
    await page.goto("/");
    await card(page, ID).getByRole("button", { name: `${t.cards.fazerOrcamento}: ${servico.nome}` }).click();
    await opcao(page, ID, pergunta.id, escolha.id).etiqueta.click();
    await modalServico(page).getByRole("button", { name: t.modal.adicionar, exact: true }).click();
    await modalServico(page).getByRole("button", { name: t.modal.verCarrinho, exact: true }).click();
    const painel = painelCarrinho(page);
    await expect(painel.getByRole("heading", { level: 2, name: t.carrinho.tituloComQtd(1) })).toBeVisible();
    await page.clock.fastForward(TEMPO_MINIMO_MS + 1000);

    await painel.locator('input[name="nome"]').focus();
    await page.keyboard.type(NOME_FICTICIO);
    await page.keyboard.press("Tab");
    expect(await idFocado(page)).toBe("whatsapp");
    await page.keyboard.type("123");
    await page.keyboard.press("Enter");

    const campo = painel.locator('input[name="whatsapp"]');
    const erro = painel.getByRole("alert").filter({ hasText: ERRO_TELEFONE });
    await expect(erro).toBeVisible();
    await expect(campo).toBeFocused();
    await expect(campo).toHaveAttribute("aria-describedby", (await erro.getAttribute("id"))!);
    expect(emailjs.enviados).toHaveLength(0);

    await page.keyboard.press("Escape");
    await expect(painel).toBeHidden();
    // O foco não pode ficar perdido no <body>: volta para um controle da página.
    const tag = await page.evaluate(() => document.activeElement?.tagName);
    expect(tag).not.toBe("BODY");
    await expect(barraCarrinho(page)).toBeVisible();
  });
});
