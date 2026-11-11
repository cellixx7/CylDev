import { expect, test as base, type Locator, type Page } from "@playwright/test";
import { servicoOrcamentoPorId } from "../src/content/perguntas";
import { orcamento as t } from "../src/content/textos";
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
export const EMAILJS_FALSO = { templateId: "template_e2e", publicKey: "chave_e2e" };

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
   * Faz o site se comportar como se `templateId` e `publicKey` estivessem preenchidos: troca os valores vazios
   * no JS servido pelo preview. Chame antes do `goto`. `conferir()` falha se a troca não aconteceu.
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
              const novo = original.replace(
                /templateId:(``|""|''),publicKey:(``|""|'')/,
                `templateId:"${EMAILJS_FALSO.templateId}",publicKey:"${EMAILJS_FALSO.publicKey}"`,
              );
              if (novo !== original) trocou = true;
              await rota.fulfill({ response: resposta, body: novo });
            } catch {
              // O teste acabou (ou a página navegou) com o pedido em andamento: nada a entregar.
            }
          });
        },
        conferir: () => expect(trocou, "a configuração falsa do EmailJS deveria ter sido aplicada ao JS").toBe(true),
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
