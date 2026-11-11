import { expect, test as base, type Locator, type Page } from "@playwright/test";
import { servicoOrcamentoPorId } from "../src/content/perguntas";
import { site } from "../src/content/site";
import { orcamento as t } from "../src/content/textos";
import { emailjsConfigurado } from "../src/shared/lib/emailjs";
import { CHAVE_CARRINHO } from "../src/shared/lib/carrinho-persistencia";

// Apoio dos testes de jornada. Regras:
// - Nenhum envio real: toda chamada à API do EmailJS é interceptada aqui.
// - Nenhum telefone real em log: comparações com o número do site viram booleanos antes do `expect`.

const API_EMAILJS = "https://api.emailjs.com/**";

/** Telefone fictício (o mesmo do exemplo da mensagem de erro). */
export const TELEFONE_FICTICIO = "(61) 99999-9999";
export const TELEFONE_FICTICIO_DIGITOS = "5561999999999";
export const NOME_FICTICIO = "Cliente de Teste";

/** Ids claramente falsos, usados só no navegador do teste. Nada disso vai para site.ts. */
export const EMAILJS_FALSO = { serviceId: "service_e2e", templateId: "template_e2e", publicKey: "chave_e2e" };

/**
 * Os ids que o navegador do teste de fato usa: os de site.ts quando estão preenchidos e, para cada um que estiver
 * vazio, o id falso. Com os três reais, nada é trocado; com algum vazio, só o vazio é preenchido.
 */
export const emailjsEfetivo = {
  serviceId: site.emailjs.serviceId || EMAILJS_FALSO.serviceId,
  templateId: site.emailjs.templateId || EMAILJS_FALSO.templateId,
  publicKey: site.emailjs.publicKey || EMAILJS_FALSO.publicKey,
};
/** Os três já estão preenchidos em site.ts: o site mostra o envio sem nenhuma troca. */
export const emailjsRealConfigurado = emailjsConfigurado(site.emailjs);

export type CorpoEmailjs = {
  service_id: string;
  template_id: string;
  user_id: string;
  template_params: Record<string, unknown> & { itens: { titulo: string; valor: string; respostas: string }[] };
};

type Emailjs = {
  /** Corpos das chamadas feitas à API (interceptadas). */
  enviados: CorpoEmailjs[];
  /**
   * Garante que o site tem os três ids do EmailJS. Só os ids que estão vazios em site.ts são trocados (no JS servido
   * pelo preview); com os três preenchidos, nada é trocado. A API continua interceptada nos dois casos.
   * Chame antes do `goto`. `conferir()` falha se o site não ficou com os ids esperados.
   */
  ligar: () => Promise<void>;
  conferir: () => void;
};

export const test = base.extend<{ emailjs: Emailjs }>({
  emailjs: [
    async ({ page }, use) => {
      const enviados: CorpoEmailjs[] = [];
      let ligado = false;
      let trocou = false;
      await page.route(API_EMAILJS, async (rota) => {
        enviados.push(rota.request().postDataJSON() as CorpoEmailjs);
        await rota.fulfill({ status: 200, contentType: "text/plain", body: "OK" });
      });
      await use({
        enviados,
        ligar: async () => {
          ligado = true;
          await page.route("**/assets/*.js", async (rota) => {
            try {
              const resposta = await rota.fetch();
              const original = await resposta.text();
              const novo = emailjsRealConfigurado
                ? original
                : original.replace(
                    /serviceId:(["'`])(.*?)\1,templateId:(["'`])(.*?)\3,publicKey:(["'`])(.*?)\5/,
                    (_todo, _a, servico, _b, modelo, _c, chave) =>
                      `serviceId:"${servico || emailjsEfetivo.serviceId}",templateId:"${modelo || emailjsEfetivo.templateId}",publicKey:"${chave || emailjsEfetivo.publicKey}"`,
                  );
              // Com ids reais não há troca; sem eles, a troca precisa ter casado.
              if (emailjsRealConfigurado || novo !== original) trocou = true;
              await rota.fulfill({ response: resposta, body: novo });
            } catch {
              // O teste acabou (ou a página navegou) com o pedido em andamento: nada a entregar.
            }
          });
        },
        conferir: () => expect(trocou, "os ids do EmailJS deveriam estar no JS (trocados só onde vazios em site.ts)").toBe(true),
      });
      await page.unrouteAll({ behavior: "ignoreErrors" });
      // Sem `ligar()`, o site está sem EmailJS e nenhuma chamada pode sair.
      if (!ligado) expect(enviados, "sem EmailJS configurado, nada pode ser enviado").toHaveLength(0);
    },
    { auto: true },
  ],
});

export { expect };

export const modelo = (id: string) => servicoOrcamentoPorId(id)!;

export const card = (page: Page, id: string) => page.locator(`#card-${id}`);
export const iconeCarrinho = (page: Page, id: string) =>
  card(page, id).getByRole("button", { name: t.cards.carrinho.rotulo(modelo(id).nome), exact: true });
export const modalServico = (page: Page) => page.locator('dialog[aria-labelledby="modal-servico-titulo"]');
export const painelCarrinho = (page: Page) => page.locator("dialog.painel-carrinho");
export const barraCarrinho = (page: Page) => page.locator("#barra-carrinho-botao");

/** A opção de uma pergunta dentro do modal (o input é escondido; o clique vai na etiqueta). */
export function opcao(page: Page, servicoId: string, perguntaId: string, opcaoId: string) {
  const entrada = modalServico(page).locator(`input[name="${servicoId}-${perguntaId}"][value="${opcaoId}"]`);
  return { entrada, etiqueta: modalServico(page).locator("label", { has: page.locator(`input[name="${servicoId}-${perguntaId}"][value="${opcaoId}"]`) }) };
}

/** O que está guardado no sessionStorage (só ids e respostas), ou null. */
export const carrinhoSalvo = (page: Page) =>
  page.evaluate((chave) => {
    const texto = sessionStorage.getItem(chave);
    return texto ? (JSON.parse(texto) as { v: number; ids: string[]; respostas: Record<string, Record<string, unknown>> }) : null;
  }, CHAVE_CARRINHO);

/** O foco está no elemento ou dentro dele. */
export const focoDentroDe = (alvo: Locator) => alvo.evaluate((el) => el === document.activeElement || el.contains(document.activeElement));

/** A página não rola para os lados. */
export async function semRolagemHorizontal(page: Page) {
  const medida = await page.evaluate(() => ({
    conteudo: document.documentElement.scrollWidth,
    janela: document.documentElement.clientWidth,
  }));
  expect(medida.conteudo, "largura do conteúdo não pode passar da janela").toBeLessThanOrEqual(medida.janela);
}
