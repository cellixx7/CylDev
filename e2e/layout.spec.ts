import type { Page } from "@playwright/test";
import { site } from "../src/content/site";
import { exemplos } from "../src/content/exemplos";
import { comum, comunidade, negocios, orcamento } from "../src/content/textos";
import { barraCarrinho, expect, iconeCarrinho, modalServico, modelo, semRolagemHorizontal, test } from "./apoio";

const menu = (page: Page) => page.getByRole("navigation", { name: "Principal" });

/**
 * Mede a barra do cabeçalho. "Não quebra" aqui quer dizer: cada texto da barra fica em uma linha só,
 * as três colunas (marca, centro, menu) ficam lado a lado sem se sobrepor e nada passa da largura da barra.
 */
async function medirCabecalho(page: Page) {
  return page.locator("header").first().evaluate((header) => {
    const barra = header.firstElementChild as HTMLElement;
    const caixa = barra.getBoundingClientRect();
    // No celular o menu aberto é uma gaveta abaixo da barra (position: absolute): ela não faz parte da linha.
    const gaveta = [...barra.querySelectorAll("nav")].find((n) => getComputedStyle(n).position === "absolute");
    const visivel = (el: Element) => {
      if (gaveta?.contains(el)) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
    };
    // Linhas de cada texto visível da barra (o menu fechado no celular fica de fora).
    const textosQuebrados: string[] = [];
    const andar = document.createTreeWalker(barra, NodeFilter.SHOW_TEXT);
    for (let no = andar.nextNode(); no; no = andar.nextNode()) {
      const pai = no.parentElement;
      if (!pai || !no.textContent?.trim() || !visivel(pai)) continue;
      const faixa = document.createRange();
      faixa.selectNodeContents(no);
      const topos = new Set([...faixa.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top)));
      if (topos.size > 1) textosQuebrados.push(no.textContent.trim());
    }
    const colunas = [...barra.children].filter(visivel).map((el) => {
      // A caixa do conteúdo de verdade (a coluna da grade pode ser mais larga que ele).
      const filhos = [...el.querySelectorAll("a, button")].filter(visivel);
      const caixas = (filhos.length > 0 ? filhos : [el]).map((f) => f.getBoundingClientRect());
      return {
        esquerda: Math.min(...caixas.map((c) => c.left)),
        direita: Math.max(...caixas.map((c) => c.right)),
        topo: Math.min(...caixas.map((c) => c.top)),
        base: Math.max(...caixas.map((c) => c.bottom)),
      };
    });
    return { esquerda: caixa.left, direita: caixa.right, topo: caixa.top, base: caixa.bottom, textosQuebrados, colunas };
  });
}

async function cabecalhoInteiro(page: Page) {
  const m = await medirCabecalho(page);
  expect(m.textosQuebrados, "nenhum texto do cabeçalho quebra em duas linhas").toEqual([]);
  expect(m.colunas.length).toBeGreaterThanOrEqual(2);
  for (const c of m.colunas) {
    expect(c.esquerda, "nada passa da borda esquerda da barra").toBeGreaterThanOrEqual(m.esquerda - 0.5);
    expect(c.direita, "nada passa da borda direita da barra").toBeLessThanOrEqual(m.direita + 0.5);
    expect(c.topo, "nada sai por cima da barra").toBeGreaterThanOrEqual(m.topo - 0.5);
    expect(c.base, "nada sai por baixo da barra").toBeLessThanOrEqual(m.base + 0.5);
  }
  const emOrdem = [...m.colunas].sort((a, b) => a.esquerda - b.esquerda);
  for (let i = 1; i < emOrdem.length; i++) {
    expect(emOrdem[i].esquerda, "as colunas do cabeçalho não se sobrepõem").toBeGreaterThanOrEqual(emOrdem[i - 1].direita - 0.5);
  }
}

const paginas = ["/", "/como-funciona/", "/comunidade/", "/privacidade/", "/obrigado/"];

for (const largura of [360, 390]) {
  test.describe(`7. em ${largura} px`, () => {
    test.use({ viewport: { width: largura, height: 780 }, hasTouch: true, isMobile: true });

    for (const caminho of paginas) {
      test(`${caminho}: sem rolagem horizontal e o cabeçalho não quebra`, async ({ page }) => {
        await page.goto(caminho);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await cabecalhoInteiro(page);
        await semRolagemHorizontal(page);
        // Até o fim da página (conteúdo que aparece ao rolar também conta).
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await semRolagemHorizontal(page);
        expect(await page.evaluate(() => window.scrollX)).toBe(0);
      });
    }

    test("menu aberto: os links cabem e nada rola para os lados", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: comum.menuAbrir, exact: true }).click();
      for (const l of negocios.nav.filter((l) => !l.secao || site.menuSecoes[l.secao])) {
        await expect(menu(page).getByRole("link", { name: l.rotulo, exact: true })).toBeVisible();
      }
      await cabecalhoInteiro(page);
      await semRolagemHorizontal(page);
      // A gaveta do menu fica dentro da tela.
      const gaveta = await menu(page).evaluate((n) => ({ esquerda: n.getBoundingClientRect().left, direita: n.getBoundingClientRect().right, tela: document.documentElement.clientWidth }));
      expect(gaveta.esquerda).toBeGreaterThanOrEqual(0);
      expect(gaveta.direita).toBeLessThanOrEqual(gaveta.tela);
    });

    test("com item no carrinho, com o modal e com o painel abertos: sem rolagem horizontal", async ({ page }) => {
      const id = "planilha";
      await page.goto("/");
      await iconeCarrinho(page, id).click();
      await expect(barraCarrinho(page)).toBeVisible();
      await semRolagemHorizontal(page);

      await page.locator(`#card-${id}`).getByRole("button", { name: `${orcamento.cards.fazerOrcamento}: ${modelo(id).nome}` }).click();
      await expect(modalServico(page).getByRole("heading", { level: 2, name: modelo(id).nome })).toBeVisible();
      await semRolagemHorizontal(page);
      const modal = await modalServico(page).evaluate((d) => ({ largura: d.getBoundingClientRect().width, conteudo: d.scrollWidth }));
      expect(modal.conteudo, "o modal não rola para os lados").toBeLessThanOrEqual(Math.ceil(modal.largura));
      await page.keyboard.press("Escape");

      await barraCarrinho(page).click();
      const painel = page.locator("dialog.painel-carrinho");
      await expect(painel).toBeVisible();
      await semRolagemHorizontal(page);
      const medida = await painel.evaluate((d) => ({ largura: d.getBoundingClientRect().width, conteudo: d.scrollWidth }));
      expect(medida.conteudo, "o painel do carrinho não rola para os lados").toBeLessThanOrEqual(Math.ceil(medida.largura));
    });
  });
}

test.describe("9. Comunidade: Contato do menu", () => {
  const contato = comunidade.nav.find((l) => l.rotulo === "Contato")!;

  async function chegouNoContato(page: Page) {
    const url = new URL(page.url());
    expect(url.pathname).toBe("/comunidade/");
    expect(url.hash).toBe("#contato");
    await expect(page.locator("section#contato")).toBeInViewport();
    await expect(page.getByRole("heading", { level: 2, name: comunidade.contato.titulo })).toBeVisible();
  }

  test("no desktop, leva à seção de contato da própria página", async ({ page }) => {
    await page.goto("/comunidade/");
    await menu(page).getByRole("link", { name: contato.rotulo, exact: true }).click();
    await chegouNoContato(page);
  });

  test.describe("no celular", () => {
    test.use({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
    test("pelo menu aberto, leva à mesma seção e o menu fecha", async ({ page }) => {
      await page.goto("/comunidade/");
      await page.getByRole("button", { name: comum.menuAbrir, exact: true }).click();
      await menu(page).getByRole("link", { name: contato.rotulo, exact: true }).click();
      await chegouNoContato(page);
      await expect(page.getByRole("button", { name: comum.menuAbrir, exact: true })).toHaveAttribute("aria-expanded", "false");
    });
  });
});

test.describe("10. menu de Negócios segue as flags de site.ts", () => {
  const esperados = negocios.nav.filter((l) => !l.secao || site.menuSecoes[l.secao]).map((l) => l.rotulo);
  const desligados = negocios.nav.filter((l) => l.secao && !site.menuSecoes[l.secao]);

  for (const caminho of ["/", "/como-funciona/", "/obrigado/"]) {
    test(`${caminho}: só os links ligados aparecem`, async ({ page }) => {
      await page.goto(caminho);
      await expect(menu(page).getByRole("link")).toHaveText(esperados);
      for (const l of desligados) {
        await expect(menu(page).getByRole("link", { name: l.rotulo, exact: true })).toHaveCount(0);
        await expect(page.locator(`header a[href="${l.href}"]`)).toHaveCount(0);
      }
    });
  }

  test("Entregas do menu leva à seção com os passos numerados", async ({ page }) => {
    test.skip(!site.menuSecoes.entregas, "seção Entregas desligada em site.ts");
    await page.goto("/");
    await menu(page).getByRole("link", { name: "Entregas", exact: true }).click();
    const secao = page.locator("section#entregas");
    await expect(secao).toBeInViewport();
    await expect(secao.getByRole("heading", { level: 2, name: negocios.comoFunciona.titulo })).toBeVisible();
    await expect(secao.getByRole("listitem")).toHaveCount(negocios.comoFunciona.passos.length);
    await expect(secao.getByText(negocios.comoFunciona.pagamento)).toBeVisible();
  });

  test("hoje: Sobre, Entregas e Contato estão desligados", async ({ page }) => {
    // Descreve o site.ts de hoje. Ao religar uma seção, este teste passa a ser pulado.
    test.skip(Object.values(site.menuSecoes).some(Boolean), "alguma seção já foi religada em site.ts");
    await page.goto("/");
    for (const rotulo of ["Sobre", "Entregas", "Contato"]) {
      await expect(menu(page).getByRole("link", { name: rotulo, exact: true })).toHaveCount(0);
    }
    await expect(menu(page).getByRole("link")).toHaveCount(2);
  });
});

test.describe("links com âncora vindos de outra página", () => {
  // O conteúdo é montado pelo React; a âncora da URL precisa valer mesmo assim.
  const alvos = ["/#orcamento", "/comunidade/#bots", "/comunidade/#contato", `/como-funciona/#${exemplos[0].id}`];
  for (const endereco of alvos) {
    test(`${endereco} abre já na seção`, async ({ page }) => {
      await page.goto("/obrigado/");
      await page.goto(endereco);
      await expect(page.locator(`#${endereco.split("#")[1]}`)).toBeInViewport();
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    });
  }
});

test.describe("11. Negócios: seção Contato", () => {
  test.use({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });

  test("o Contato do menu leva à seção com WhatsApp, e-mail e formulário, sem rolagem lateral", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: comum.menuAbrir, exact: true }).click();
    await menu(page).getByRole("link", { name: "Contato", exact: true }).click();
    await expect(page).toHaveURL(/#contato$/);
    const secao = page.locator("section#contato");
    await expect(secao).toBeInViewport();
    await expect(secao.getByRole("heading", { level: 2, name: negocios.contato.titulo })).toBeVisible();
    await expect(secao.getByRole("link", { name: site.email })).toHaveAttribute("href", /^mailto:/);
    await expect(secao.locator('a[href*="wa.me"], a[href*="whatsapp"]').first()).toBeVisible();
    await expect(secao.getByRole("heading", { level: 3, name: negocios.contato.formulario })).toBeVisible();
    await semRolagemHorizontal(page);
  });
});

/** Tamanhos (px) dos textos visíveis abaixo do mínimo do guia de estilo (14 px). */
async function textosPequenos(page: Page) {
  return page.evaluate(() => {
    const achados: string[] = [];
    const andar = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let no = andar.nextNode(); no; no = andar.nextNode()) {
      const el = no.parentElement;
      if (!el || !no.textContent?.trim() || el.closest(".sr-only, script, style, noscript")) continue;
      const caixa = el.getBoundingClientRect();
      if (caixa.width === 0 || caixa.height === 0) continue;
      const tamanho = parseFloat(getComputedStyle(el).fontSize);
      if (tamanho < 13.99) achados.push(`${tamanho}px: ${no.textContent.trim().slice(0, 30)}`);
    }
    return achados;
  });
}

/** Níveis dos títulos visíveis, na ordem do documento. */
async function niveisDosTitulos(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]
      .filter((h) => h.getBoundingClientRect().width > 0 && !h.closest("dialog:not([open])"))
      .map((h) => Number(h.tagName[1])),
  );
}

for (const [nome, largura, altura] of [["celular", 390, 780], ["desktop", 1440, 900]] as const) {
  test.describe(`12. guia de estilo no ${nome}`, () => {
    test.use({ viewport: { width: largura, height: altura } });

    for (const caminho of paginas) {
      test(`${caminho}: nenhum texto abaixo de 14 px e os títulos não pulam nível`, async ({ page }) => {
        await page.goto(caminho);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        // No celular os mini exemplos vêm recolhidos: abre todos para medir o que está dentro.
        const fechados = page.getByRole("button", { name: new RegExp(`^${orcamento.cards.miniExemplo.ver}`) });
        while ((await fechados.count()) > 0) await fechados.first().click();
        expect(await textosPequenos(page)).toEqual([]);
        const niveis = await niveisDosTitulos(page);
        expect(niveis[0], "a página começa pelo h1").toBe(1);
        expect(niveis.filter((n) => n === 1)).toHaveLength(1);
        niveis.forEach((n, i) => {
          if (i > 0) expect(n - niveis[i - 1], `título ${i + 1} não pula nível`).toBeLessThanOrEqual(1);
        });
      });
    }
  });
}

test.describe("13. mini exemplo dos cards", () => {
  const id = "planilha";
  const nome = () => new RegExp(`: ${modelo(id).nome}$`);

  test.describe("no celular", () => {
    test.use({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
    test("vem recolhido e abre e fecha pelo botão", async ({ page }) => {
      await page.goto("/");
      const card = page.locator(`#card-${id}`);
      const legenda = card.getByText(orcamento.cards.miniExemplo.planilha.legenda);
      const abrir = card.getByRole("button", { name: nome() }).filter({ hasText: orcamento.cards.miniExemplo.ver });
      await expect(legenda).toBeHidden();
      await expect(abrir).toHaveAttribute("aria-expanded", "false");
      await abrir.click();
      await expect(legenda).toBeVisible();
      const fechar = card.getByRole("button", { name: nome() }).filter({ hasText: orcamento.cards.miniExemplo.ocultar });
      await expect(fechar).toHaveAttribute("aria-expanded", "true");
      await semRolagemHorizontal(page);
      await fechar.click();
      await expect(legenda).toBeHidden();
    });
  });

  test("no desktop fica sempre aberto, sem botão", async ({ page }) => {
    await page.goto("/");
    const card = page.locator(`#card-${id}`);
    await expect(card.getByText(orcamento.cards.miniExemplo.planilha.legenda)).toBeVisible();
    await expect(card.getByRole("button", { name: orcamento.cards.miniExemplo.ver })).toHaveCount(0);
  });
});

test.describe("14. hero de Negócios", () => {
  test("o h1 é a promessa, com o nome acima; no desktop o painel de exemplo fica ao lado a partir de 992 px", async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1, name: negocios.apresentacao.titulo });
    await expect(h1).toBeVisible();
    await expect(page.locator("#apresentacao").getByText(site.nome, { exact: true })).toBeVisible();
    const painel = await page.getByRole("figure", { name: negocios.apresentacao.painel.rotulo }).boundingBox();
    const titulo = await h1.boundingBox();
    expect(painel!.x, "o painel fica à direita do título, não abaixo do orçamento").toBeGreaterThan(titulo!.x + titulo!.width - 1);
  });

  test.describe("no celular", () => {
    test.use({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
    test("tem o botão do WhatsApp logo abaixo do orçamento", async ({ page }) => {
      await page.goto("/");
      const whatsapp = page.locator("#apresentacao").getByRole("link", { name: negocios.apresentacao.botaoWhatsapp });
      await expect(whatsapp).toBeVisible();
      expect((await whatsapp.getAttribute("href"))?.startsWith("https://wa.me/"), "link do WhatsApp").toBe(true);
    });
  });
});
