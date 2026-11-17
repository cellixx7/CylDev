import { site } from "../src/content/site";
import { comum, formulario, negocios, orcamento as t, paginaDeTexto } from "../src/content/textos";
import { acessibilidade } from "../src/content/textos/acessibilidade";
import { perguntasFrequentes } from "../src/content/textos/perguntasFrequentes";
import { privacidade } from "../src/content/textos/privacidade";
import { termos } from "../src/content/textos/termos";
import { identificacaoPrestador } from "../src/shared/lib/prestador";
import { emailjsRealConfigurado, expect, iconeCarrinho, barraCarrinho, painelCarrinho, semRolagemHorizontal, test } from "./apoio";

const ID = "planilha";

test.describe("privacidade", () => {
  test("o rodapé de cada página leva à política", async ({ page }) => {
    for (const caminho of ["/", "/como-funciona/", "/comunidade/"]) {
      await page.goto(caminho);
      await page.getByRole("contentinfo").getByRole("link", { name: comum.privacidadeLink, exact: true }).click();
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
    await expect(corpo).toContainText("ANPD");
    await expect(corpo).toContainText(privacidade.versao);
    await expect(corpo.getByRole("link", { name: site.email }).first()).toHaveAttribute("href", `mailto:${site.email}`);
    await expect(corpo).not.toContainText("](");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/privacidade\/$/);
  });

  test("o carrinho diz o que é enviado e liga à política", async ({ page }) => {
    test.skip(!emailjsRealConfigurado, "sem EmailJS o formulário (e a linha) não aparece");
    await page.goto("/");
    await iconeCarrinho(page, ID).click();
    await barraCarrinho(page).click();
    const painel = painelCarrinho(page);
    await expect(painel.getByText(t.carrinho.privacidade)).toBeVisible();
    const aceite = painel.locator("[data-aceite]");
    await expect(aceite).toContainText(t.carrinho.aceite.antes);
    await expect(aceite.getByRole("link", { name: t.carrinho.aceite.termosLink })).toHaveAttribute("href", "/termos/");
    await painel.getByRole("link", { name: t.carrinho.privacidadeLink }).click();
    await expect(page).toHaveURL(/\/privacidade\/$/);
  });

  test("sitemap e página sem noindex", async ({ request }) => {
    const mapa = await request.get("/sitemap.xml");
    const texto = await mapa.text();
    for (const caminho of ["/privacidade/", "/termos/", "/perguntas/", "/acessibilidade/"]) expect(texto, caminho).toContain(caminho);
  });
});

test.describe("páginas jurídicas e de apoio (Etapa 5)", () => {
  const paginas = [
    { caminho: "/termos/", pagina: termos, link: comum.rodape.termos },
    { caminho: "/perguntas/", pagina: perguntasFrequentes, link: comum.rodape.perguntas },
    { caminho: "/acessibilidade/", pagina: acessibilidade, link: comum.rodape.acessibilidade },
  ];

  for (const { caminho, pagina, link } of paginas) {
    test(`${caminho}: o rodapé leva até ela, e ela tem título, versão, índice e canonical`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("contentinfo").getByRole("link", { name: link, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${caminho}$`));
      await expect(page.getByRole("heading", { level: 1, name: pagina.titulo })).toBeVisible();
      await expect(page.locator("main")).toContainText(pagina.versao);
      await expect(page.locator("main")).not.toContainText("](");
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${caminho}$`));
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
      await expect(page.getByRole("navigation", { name: paginaDeTexto.indice }).getByRole("link")).toHaveCount(pagina.secoes.length);
      for (const s of pagina.secoes) await expect(page.locator(`section#${s.id}`)).toHaveCount(1);
    });
  }

  test("os Termos têm âncora de pagamento e a cláusula de dados de terceiros; o índice leva à seção", async ({ page }) => {
    await page.goto("/termos/#pagamento");
    await expect(page.locator("section#pagamento")).toBeInViewport();
    await expect(page.locator("section#pagamento")).toContainText("50% de entrada");
    await page.getByRole("navigation", { name: paginaDeTexto.indice }).getByRole("link", { name: /Dados que você me passa/ }).click();
    await expect(page).toHaveURL(/#dados$/);
    await expect(page.locator("section#dados")).toBeInViewport();
    await expect(page.locator("section#dados")).toContainText("operador");
  });

  test.describe("sem JavaScript", () => {
    test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

    for (const { caminho, pagina } of [...paginas, { caminho: "/privacidade/", pagina: privacidade }]) {
      test(`${caminho}: o texto inteiro continua legível`, async ({ page }) => {
        await page.goto(caminho);
        await expect(page.getByRole("heading", { level: 1, name: pagina.titulo })).toBeVisible();
        await expect(page.getByRole("heading", { level: 2 })).toHaveCount(pagina.secoes.length);
        await expect(page.locator("main")).toContainText(pagina.versao);
        await expect(page.locator("main")).toContainText(site.email);
        await semRolagemHorizontal(page);
      });
    }
  });

  test("o rodapé de todas as páginas identifica quem presta o serviço", async ({ page }) => {
    for (const caminho of ["/", "/como-funciona/", "/comunidade/", "/termos/", "/privacidade/", "/perguntas/", "/acessibilidade/"]) {
      await page.goto(caminho);
      const linha = page.getByRole("contentinfo").locator("[data-prestador]");
      for (const parte of identificacaoPrestador()) await expect(linha, `${caminho}: ${parte}`).toContainText(parte);
    }
  });

  test("a seção Entregas da home liga aos Termos e às perguntas", async ({ page }) => {
    await page.goto("/");
    const secao = page.locator("section#entregas");
    await expect(secao.getByRole("link", { name: negocios.comoFunciona.regras.termos })).toHaveAttribute("href", "/termos/");
    await expect(secao.getByRole("link", { name: negocios.comoFunciona.regras.perguntas })).toHaveAttribute("href", "/perguntas/");
  });

  test("o formulário de contato avisa para que servem os dados e liga à política", async ({ page }) => {
    test.skip(!emailjsRealConfigurado, "sem EmailJS o formulário não aparece");
    await page.goto("/");
    const contato = page.locator("section#contato");
    await expect(contato.getByText(formulario.privacidade)).toBeVisible();
    await expect(contato.getByRole("link", { name: formulario.privacidadeLink })).toHaveAttribute("href", "/privacidade/");
  });
});
