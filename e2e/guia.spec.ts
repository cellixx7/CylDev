import type { Page } from "@playwright/test";
import { guia, perguntasGuia, resultadosGuia } from "../src/content/guia";
import { site } from "../src/content/site";
import { orcamento as t } from "../src/content/textos";
import { expect, modalServico, modelo, test } from "./apoio";

const raiz = perguntasGuia.find((p) => p.id === guia.raiz)!;
const rotulo = (perguntaId: string, opcaoId: string) => perguntasGuia.find((p) => p.id === perguntaId)!.opcoes.find((o) => o.id === opcaoId)!.rotulo;
const resultado = (id: string) => resultadosGuia.find((r) => r.id === id)!;

const botaoGuia = (page: Page) => page.getByRole("button", { name: guia.botao, exact: true });
const painel = (page: Page) => page.getByRole("region", { name: guia.titulo });
const titulo = (page: Page) => painel(page).getByRole("heading", { level: 3 });

async function abrirGuia(page: Page) {
  await page.goto("/");
  await expect(botaoGuia(page)).toHaveAttribute("aria-expanded", "false");
  await botaoGuia(page).click();
  await expect(botaoGuia(page)).toHaveAttribute("aria-expanded", "true");
  await expect(titulo(page)).toContainText(raiz.texto);
}

test.describe('8. guia "Não sei qual escolher"', () => {
  test("(a) responde as perguntas, vê o serviço sugerido e abre Ver detalhes por ele", async ({ page }) => {
    const sugerido = modelo(resultado("planilha").servicos[0]);
    await abrirGuia(page);
    await painel(page).getByRole("button", { name: rotulo("objetivo", "numeros"), exact: true }).click();
    await expect(titulo(page)).toContainText(guia.rotuloPergunta(2));
    await painel(page).getByRole("button", { name: rotulo("numeros", "bagunca"), exact: true }).click();

    await expect(titulo(page)).toHaveText(guia.resultadoTitulo);
    await expect(painel(page).getByText(sugerido.nome, { exact: true })).toBeVisible();
    await expect(painel(page).getByText(resultado("planilha").porque)).toBeVisible();
    // O guia não esconde os cards: todos continuam na página.
    await expect(page.locator(`#card-${sugerido.id}`)).toBeVisible();

    await painel(page).getByRole("button", { name: guia.verDetalhes, exact: true }).click();
    const modal = modalServico(page);
    await expect(modal.getByRole("heading", { level: 2, name: sugerido.nome })).toBeVisible();
    await expect(modal.getByRole("tab", { name: t.modal.abas.detalhes })).toHaveAttribute("aria-selected", "true");
    await expect(page).toHaveURL(new RegExp(`#${sugerido.id}$`));

    // Ao fechar, o foco volta ao botão do guia que abriu o modal.
    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
    await expect(painel(page).getByRole("button", { name: guia.verDetalhes, exact: true })).toBeFocused();
  });

  test('(b) "Quero um bot" leva a /comunidade/#bots', async ({ page }) => {
    const saida = resultado("bot").saida!;
    await abrirGuia(page);
    await painel(page).getByRole("button", { name: rotulo("objetivo", "bot"), exact: true }).click();
    await expect(titulo(page)).toHaveText(guia.resultadoTitulo);
    // Sem card recomendado: só a saída para a Comunidade.
    await expect(painel(page).getByRole("button", { name: guia.verDetalhes, exact: true })).toHaveCount(0);
    const link = painel(page).getByRole("link", { name: saida.rotulo, exact: true });
    await expect(link).toHaveAttribute("href", "/comunidade/#bots");
    await link.click();
    await expect(page).toHaveURL(/\/comunidade\/#bots$/);
    await expect(page.locator("#bots")).toBeInViewport();
  });

  test('(c) "Não sei, prefiro conversar" mostra o WhatsApp com a mensagem pré-preenchida', async ({ page }) => {
    const saida = resultado("conversar").saida!;
    await abrirGuia(page);
    await painel(page).getByRole("button", { name: rotulo("objetivo", "conversar"), exact: true }).click();
    await expect(titulo(page)).toHaveText(guia.resultadoTitulo);
    const link = painel(page).getByRole("link", { name: saida.rotulo, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveText("Falar comigo no WhatsApp");
    await expect(link).toHaveAttribute("target", "_blank");
    const href = (await link.getAttribute("href")) ?? "";
    // Comparação em booleano: o número do site não vai para o log.
    expect(href.startsWith(`https://wa.me/${site.whatsapp}?text=`), "link wa.me com o número de site.ts").toBe(true);
    const mensagem = decodeURIComponent(href.split("text=")[1] ?? "");
    expect(mensagem).toContain(guia.mensagemWhatsapp);
    expect(mensagem).toContain(`origem: ${guia.origemWhatsapp}`);
  });

  test("(d) uso só pelo teclado, com o foco em cada etapa", async ({ page }) => {
    await page.goto("/");
    await botaoGuia(page).focus();
    await page.keyboard.press("Enter");
    // Etapa 1: o foco vai para a pergunta.
    await expect(titulo(page)).toBeFocused();
    await expect(titulo(page)).toContainText(`${guia.rotuloPergunta(1)}: ${raiz.texto}`);

    // O Tab seguinte cai na primeira opção ("Cuidar dos números"), que leva à segunda pergunta.
    await page.keyboard.press("Tab");
    await expect(painel(page).getByRole("button", { name: raiz.opcoes[0].rotulo, exact: true })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(titulo(page)).toBeFocused();
    await expect(titulo(page)).toContainText(guia.rotuloPergunta(2));

    // Etapa 2: segunda opção, com Tab duas vezes e espaço.
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(painel(page).getByRole("button", { name: rotulo("numeros", "enxergar"), exact: true })).toBeFocused();
    await page.keyboard.press("Space");
    await expect(titulo(page)).toBeFocused();
    await expect(titulo(page)).toHaveText(guia.resultadoTitulo);
    await expect(painel(page).getByText(modelo(resultado("painel").servicos[0]).nome, { exact: true })).toBeVisible();

    // Voltar devolve à pergunta anterior, com o foco na pergunta.
    await painel(page).getByRole("button", { name: guia.voltar, exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(titulo(page)).toBeFocused();
    await expect(titulo(page)).toContainText(guia.rotuloPergunta(2));

    // Fechar devolve o foco ao botão que abriu o guia.
    await painel(page).getByRole("button", { name: guia.fechar, exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(botaoGuia(page)).toBeFocused();
    await expect(botaoGuia(page)).toHaveAttribute("aria-expanded", "false");
    await expect(painel(page)).toBeHidden();
  });
});
