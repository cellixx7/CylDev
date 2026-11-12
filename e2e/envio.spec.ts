import type { Page } from "@playwright/test";
import { site } from "../src/content/site";
import { orcamento as t } from "../src/content/textos";
import { TEMPO_MINIMO_MS } from "../src/shared/lib/emailjs";
import { dadosEmailPedido, montarPedido, NAO_RESPONDEU } from "../src/shared/lib/pedido";
import { ERRO_TELEFONE } from "../src/shared/lib/telefone";
import {
  barraCarrinho,
  card,
  carrinhoSalvo,
  emailjsEfetivo,
  emailjsRealConfigurado,
  expect,
  iconeCarrinho,
  modalServico,
  modelo,
  NOME_FICTICIO,
  opcao,
  painelCarrinho,
  TELEFONE_FICTICIO,
  TELEFONE_FICTICIO_DIGITOS,
  test,
} from "./apoio";

const ID = "planilha";
const servico = modelo(ID);
const pergunta = servico.perguntas.find((p) => p.id === "existente")!;
const escolha = pergunta.opcoes.find((o) => o.id === "bagunca")!;
const INICIO = new Date("2026-11-11T12:00:00-03:00");

const enviar = (page: Page) => painelCarrinho(page).getByRole("button", { name: t.carrinho.enviar, exact: true });
const campoNome = (page: Page) => painelCarrinho(page).locator('input[name="nome"]');
const campoWhatsapp = (page: Page) => painelCarrinho(page).locator('input[name="whatsapp"]');

/** Põe a planilha no carrinho (com uma resposta) e abre o painel. */
async function abrirCarrinhoComPedido(page: Page) {
  await card(page, ID).getByRole("button", { name: `${t.cards.fazerOrcamento}: ${servico.nome}` }).click();
  await opcao(page, ID, pergunta.id, escolha.id).etiqueta.click();
  await modalServico(page).getByRole("button", { name: t.modal.adicionar, exact: true }).click();
  await modalServico(page).getByRole("button", { name: t.modal.verCarrinho, exact: true }).click();
  await expect(painelCarrinho(page).getByRole("heading", { level: 2, name: t.carrinho.tituloComQtd(1) })).toBeVisible();
}

test.describe("4. EmailJS sem configuração (o build como está hoje)", () => {
  test("não há 'Enviar pelo site'; WhatsApp e e-mail aparecem com o pedido", async ({ page }) => {
    // Este teste descreve o site.ts de hoje. Com os três valores preenchidos, ele deixa de valer.
    test.skip(emailjsRealConfigurado, "EmailJS já configurado em site.ts");
    await page.goto("/");
    await iconeCarrinho(page, ID).click();
    await barraCarrinho(page).click();
    const painel = painelCarrinho(page);
    await expect(painel.getByRole("heading", { level: 2, name: t.carrinho.tituloComQtd(1) })).toBeVisible();

    await expect(painel.getByText(t.carrinho.enviar, { exact: true })).toHaveCount(0);
    await expect(painel.locator("form")).toHaveCount(0);
    await expect(painel.getByText(t.carrinho.dadosTitulo)).toHaveCount(0);

    const whatsapp = painel.getByRole("link", { name: t.carrinho.whatsappBotao, exact: true });
    await expect(whatsapp).toBeVisible();
    const href = (await whatsapp.getAttribute("href")) ?? "";
    // Comparação em booleano: o número do site não vai para o log.
    expect(href.startsWith(`https://wa.me/${site.whatsapp}?text=`), "link wa.me com o número de site.ts").toBe(true);
    expect(decodeURIComponent(href.split("text=")[1] ?? "").includes(servico.nome), "a mensagem leva o serviço").toBe(true);

    await expect(painel.getByRole("link", { name: t.carrinho.emailBotao, exact: true })).toBeVisible();
  });
});

test.describe("5. envio pelo site: antes e depois dos 3 s", () => {
  test("antes dos 3 s o botão fica desabilitado com o aviso; depois, habilita", async ({ page, emailjs }) => {
    await emailjs.ligar();
    // Relógio parado desde antes de a página abrir: o tempo só anda quando o teste manda.
    await page.clock.install({ time: INICIO });
    await page.clock.pauseAt(new Date(INICIO.getTime() + 60_000));
    await page.goto("/");
    emailjs.conferir();

    await abrirCarrinhoComPedido(page);
    await expect(enviar(page)).toBeDisabled();
    await expect(painelCarrinho(page).getByRole("status").filter({ hasText: t.carrinho.aguarde })).toBeVisible();
    await expect(painelCarrinho(page).getByRole("status").filter({ hasText: t.carrinho.aguarde })).toHaveText("Um instante…");

    // Enter num campo antes da hora: nada é enviado e nada é descartado.
    await campoNome(page).fill(NOME_FICTICIO);
    await campoWhatsapp(page).fill(TELEFONE_FICTICIO);
    await campoWhatsapp(page).press("Enter");
    await expect(page).not.toHaveURL(/obrigado/);
    expect(emailjs.enviados).toHaveLength(0);
    await expect(campoNome(page)).toHaveValue(NOME_FICTICIO);

    // Um pouco antes dos 3 s: ainda desabilitado.
    await page.clock.fastForward(TEMPO_MINIMO_MS - 100);
    await expect(enviar(page)).toBeDisabled();

    // Passados os 3 s (mais a folga do relógio): habilita e o aviso some.
    await page.clock.fastForward(500);
    await expect(enviar(page)).toBeEnabled();
    await expect(painelCarrinho(page).getByText(t.carrinho.aguarde)).toHaveCount(0);

    // E agora o envio acontece de verdade (interceptado).
    await enviar(page).click();
    await expect(page).toHaveURL(/\/obrigado\/$/);
    expect(emailjs.enviados).toHaveLength(1);
  });
});

test.describe("5. envio pelo site: corpo enviado, isca e falha", () => {
  test.beforeEach(async ({ page, emailjs }) => {
    await emailjs.ligar();
    await page.clock.install({ time: INICIO });
    await page.goto("/");
    emailjs.conferir();
  });

  test("depois dos 3 s envia o pedido por serviço, vai para /obrigado/ e limpa o carrinho", async ({ page, emailjs }) => {
    const observacao = `Preciso até 10/12 & "sem pressa" <b>ok</b>`;
    await abrirCarrinhoComPedido(page);
    await page.clock.fastForward(TEMPO_MINIMO_MS + 1000);
    await expect(enviar(page)).toBeEnabled();
    await painelCarrinho(page).getByLabel(t.carrinho.observacoes).fill(observacao);
    await campoNome(page).fill(NOME_FICTICIO);
    await campoWhatsapp(page).fill(TELEFONE_FICTICIO);
    expect(await carrinhoSalvo(page)).toMatchObject({ ids: [ID] });

    await enviar(page).click();
    await expect(page).toHaveURL(/\/obrigado\/$/);

    expect(emailjs.enviados).toHaveLength(1);
    const corpo = emailjs.enviados[0];
    // Comparações em booleano: com ids reais, eles não vão para o log.
    expect(corpo.service_id === emailjsEfetivo.serviceId, "service_id").toBe(true);
    expect(corpo.template_id === emailjsEfetivo.templateId, "template_id").toBe(true);
    expect(corpo.user_id === emailjsEfetivo.publicKey, "user_id").toBe(true);

    const p = corpo.template_params;
    expect(p.nome).toBe(NOME_FICTICIO);
    expect(p.preferencia).toBe("WhatsApp");
    expect(p.contato).toBe(TELEFONE_FICTICIO_DIGITOS);
    expect(p.origem).toBe("negocios-carrinho");
    expect(p.assunto).toBe(`Pedido: ${servico.nome}`);
    expect(p.observacoes).toBe(observacao);
    expect(p.itens).toHaveLength(1);
    expect(p.itens[0].titulo).toBe(servico.nome);
    expect(p.itens[0].valor).toMatch(/R\$.* \(estimativa\)$/);
    const linhas = p.itens[0].respostas.split("\n");
    expect(linhas).toHaveLength(servico.perguntas.length);
    expect(linhas).toContain(`${pergunta.texto} ${escolha.rotulo}`);
    expect(linhas.filter((l) => l.endsWith(NAO_RESPONDEU))).toHaveLength(servico.perguntas.length - 1);
    expect(String(p.total)).toContain("R$");
    expect(p.mensagem, "com itens, o pedido não se repete em `mensagem`").toBe("");

    // O corpo é exatamente o que a lib monta para o mesmo pedido (tela e e-mail não divergem).
    const esperado = dadosEmailPedido(
      montarPedido([ID], { [ID]: { [pergunta.id]: escolha.id } }, observacao),
      { nome: NOME_FICTICIO, whatsapp: TELEFONE_FICTICIO_DIGITOS },
      "negocios-carrinho",
    );
    expect(p).toMatchObject({
      itens: esperado.itens,
      total: esperado.total,
      estimativa: esperado.estimativa,
      pacote: esperado.pacote,
    });

    // Envio confirmado: o pedido guardado sai e a próxima visita começa vazia.
    expect(await carrinhoSalvo(page)).toBeNull();
    await page.goto("/");
    await expect(iconeCarrinho(page, ID)).toHaveAttribute("aria-pressed", "false");
    await expect(barraCarrinho(page)).toHaveCount(0);
  });

  test("isca preenchida: finge sucesso, não envia nada e não limpa o carrinho", async ({ page, emailjs }) => {
    await abrirCarrinhoComPedido(page);
    await page.clock.fastForward(TEMPO_MINIMO_MS + 1000);
    await campoNome(page).fill(NOME_FICTICIO);
    await campoWhatsapp(page).fill(TELEFONE_FICTICIO);
    // Um robô preenche todo campo que encontra, inclusive o escondido.
    await painelCarrinho(page)
      .locator('input[name="site_empresa"]')
      .evaluate((el: HTMLInputElement) => {
        el.value = "https://exemplo.invalid";
      });
    await enviar(page).click();
    await expect(page).toHaveURL(/\/obrigado\/$/);
    expect(emailjs.enviados).toHaveLength(0);
    expect(await carrinhoSalvo(page)).toMatchObject({ ids: [ID] });
  });

  test("a isca fica fora da tela, do teclado e do leitor de tela", async ({ page }) => {
    await abrirCarrinhoComPedido(page);
    const isca = painelCarrinho(page).locator('input[name="site_empresa"]');
    await expect(isca).toHaveAttribute("tabindex", "-1");
    await expect(painelCarrinho(page).locator('p[aria-hidden="true"]', { has: page.locator('input[name="site_empresa"]') })).toHaveCount(1);
    await expect(isca).not.toBeInViewport();
  });

  test("falha da API: mostra o aviso com WhatsApp e e-mail e mantém o carrinho", async ({ page }) => {
    await page.route("https://api.emailjs.com/**", (rota) => rota.fulfill({ status: 500, body: "erro" }));
    await abrirCarrinhoComPedido(page);
    await page.clock.fastForward(TEMPO_MINIMO_MS + 1000);
    await campoNome(page).fill(NOME_FICTICIO);
    await campoWhatsapp(page).fill(TELEFONE_FICTICIO);
    await enviar(page).click();
    await expect(painelCarrinho(page).getByRole("alert").filter({ hasText: t.carrinho.falhou })).toBeVisible();
    await expect(page).not.toHaveURL(/obrigado/);
    expect(await carrinhoSalvo(page)).toMatchObject({ ids: [ID] });
  });
});

test.describe("6. telefone do pedido", () => {
  test.beforeEach(async ({ page, emailjs }) => {
    await emailjs.ligar();
    await page.clock.install({ time: INICIO });
    await page.goto("/");
    emailjs.conferir();
    await abrirCarrinhoComPedido(page);
    await page.clock.fastForward(TEMPO_MINIMO_MS + 1000);
    await expect(enviar(page)).toBeEnabled();
    await campoNome(page).fill(NOME_FICTICIO);
  });

  test("vazio: o navegador barra o envio no campo obrigatório", async ({ page, emailjs }) => {
    await enviar(page).click();
    expect(await campoWhatsapp(page).evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
    await expect(campoWhatsapp(page)).toBeFocused();
    await expect(page).not.toHaveURL(/obrigado/);
    expect(emailjs.enviados).toHaveLength(0);
  });

  const invalidos: [string, string][] = [
    ["só espaços", "   "],
    ["só sinais", "+ ( ) - -"],
    ["poucos dígitos", "(61) 9999"],
    ["muitos dígitos", "61 99999 9999 9999"],
    ["DDD que não existe", "(01) 99999-9999"],
  ];
  for (const [caso, valor] of invalidos) {
    test(`${caso}: mostra o erro, foca o campo e não envia; corrigido, passa`, async ({ page, emailjs }) => {
      await campoWhatsapp(page).fill(valor);
      await enviar(page).click();
      const erro = painelCarrinho(page).getByRole("alert").filter({ hasText: ERRO_TELEFONE });
      await expect(erro).toBeVisible();
      await expect(campoWhatsapp(page)).toHaveAttribute("aria-invalid", "true");
      await expect(campoWhatsapp(page)).toHaveAttribute("aria-describedby", "erro-telefone-pedido");
      await expect(campoWhatsapp(page)).toBeFocused();
      await expect(page).not.toHaveURL(/obrigado/);
      expect(emailjs.enviados).toHaveLength(0);

      // Corrigir o campo tira o erro; um telefone brasileiro formatado passa.
      await campoWhatsapp(page).fill(TELEFONE_FICTICIO);
      await expect(erro).toHaveCount(0);
      await enviar(page).click();
      await expect(page).toHaveURL(/\/obrigado\/$/);
      expect(emailjs.enviados).toHaveLength(1);
      expect(emailjs.enviados[0].template_params.contato).toBe(TELEFONE_FICTICIO_DIGITOS);
    });
  }

  for (const valor of ["61 99999-9999", "+55 (61) 99999-9999", "(61) 3999-9999"]) {
    test(`telefone brasileiro formatado passa: ${valor}`, async ({ page, emailjs }) => {
      await campoWhatsapp(page).fill(valor);
      await enviar(page).click();
      await expect(page).toHaveURL(/\/obrigado\/$/);
      expect(emailjs.enviados).toHaveLength(1);
      expect(String(emailjs.enviados[0].template_params.contato)).toMatch(/^55\d{10,11}$/);
    });
  }
});
