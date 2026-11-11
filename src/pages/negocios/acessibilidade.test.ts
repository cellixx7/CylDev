import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TEMPO_MINIMO_MS } from "../../shared/lib/emailjs";
import { adicionar, estadoInicial } from "../../shared/lib/carrinho-estado";
import { montarPedido } from "../../shared/lib/pedido";
import { BarraCarrinho } from "./BarraCarrinho";
import { BotaoCarrinho } from "./BotaoCarrinho";
import { AcoesDoPedido, DadosDoPedido, envioLiberado } from "./CheckoutPedido";

const pedido = (ids: string[]) => {
  const e = ids.reduce(adicionar, estadoInicial());
  return montarPedido(e.ids, e.respostas, "", { piloto: null });
};
const noop = () => {};

describe("acessibilidade dos controles novos", () => {
  it("ícone do carrinho: rótulo fixo (o estado vai só em aria-pressed) e svg decorativo", () => {
    for (const dentro of [false, true]) {
      const html = renderToStaticMarkup(createElement(BotaoCarrinho, { nome: "Planilha", dentro, combinavel: true, aoAlternar: noop }));
      expect(html).toContain('aria-label="Carrinho: Planilha"');
      expect(html).toContain(`aria-pressed="${dentro}"`);
      expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
      expect(html).toContain("focus-visible:outline-3");
      expect(html).toContain("size-alvo");
    }
  });

  it("campo isca do spam fora da árvore de acessibilidade e da tabulação", () => {
    const p = pedido(["planilha"]);
    const html = renderToStaticMarkup(createElement(DadosDoPedido, { pedido: p, estado: "pronto", aoEnviar: noop, envioAtivo: true }));
    expect(html).toMatch(/<p[^>]*aria-hidden="true"[^>]*><label>[^<]*<input[^>]*tabindex="-1"[^>]*name="site_empresa"/);
  });

  it("campos do pedido têm rótulo visível e tipo/autocomplete certos", () => {
    const html = renderToStaticMarkup(createElement(DadosDoPedido, { pedido: pedido(["planilha"]), estado: "pronto", aoEnviar: noop, envioAtivo: true }));
    expect(html).toMatch(/<label[^>]*><span>Nome<\/span><input[^>]*autoComplete="name"/i);
    expect(html).toMatch(/type="tel"[^>]*inputMode="tel"[^>]*autoComplete="tel"/i);
  });

  it("falha de envio é anunciada (role=alert) e os dois botões continuam com foco visível", () => {
    const p = pedido(["planilha"]);
    const dados = renderToStaticMarkup(createElement(DadosDoPedido, { pedido: p, estado: "falhou", aoEnviar: noop, envioAtivo: true }));
    expect(dados).toContain('role="alert"');
    const acoes = renderToStaticMarkup(createElement(AcoesDoPedido, { pedido: p, estado: "pronto", envioAtivo: true }));
    expect(acoes.match(/focus-visible:outline-3/g)).toHaveLength(2);
  });

  it("barra: região nomeada, botão com rótulo completo e foco visível", () => {
    const html = renderToStaticMarkup(createElement(BarraCarrinho, { pedido: pedido(["planilha"]), aoAbrir: noop }));
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toMatch(/aria-label="Abrir o carrinho: 1 serviço, estimativa a partir de/);
    expect(html).toContain("focus-visible:outline-3");
  });

  it("EmailJS configurado: formulário e botão 'Enviar pelo site' aparecem, sem botão de e-mail", () => {
    const p = pedido(["planilha"]);
    expect(renderToStaticMarkup(createElement(DadosDoPedido, { pedido: p, estado: "pronto", aoEnviar: noop, envioAtivo: true }))).toContain("<form");
    const acoes = renderToStaticMarkup(createElement(AcoesDoPedido, { pedido: p, estado: "pronto", envioAtivo: true }));
    expect(acoes).toContain("Enviar pelo site");
    expect(acoes).toContain("Chamar no WhatsApp");
    expect(acoes).not.toContain("mailto:");
  });

  it("EmailJS sem configuração: sem formulário nem botão de envio; ficam WhatsApp e e-mail, sem texto de erro", () => {
    const p = pedido(["planilha"]);
    expect(renderToStaticMarkup(createElement(DadosDoPedido, { pedido: p, estado: "pronto", aoEnviar: noop, envioAtivo: false }))).toBe("");
    const acoes = renderToStaticMarkup(createElement(AcoesDoPedido, { pedido: p, estado: "pronto", envioAtivo: false }));
    expect(acoes).not.toContain("Enviar pelo site");
    expect(acoes).not.toContain('type="submit"');
    expect(acoes).toContain("https://wa.me/");
    expect(acoes).toContain("mailto:");
    expect(acoes).not.toContain("Não consegui");
  });

  it("antes dos 3 s: envio desabilitado e aviso 'Um instante…' em role=status; depois, habilitado e sem aviso", () => {
    const p = pedido(["planilha"]);
    const antes = renderToStaticMarkup(createElement(AcoesDoPedido, { pedido: p, estado: "pronto", envioAtivo: true, liberado: false }));
    expect(antes).toMatch(/<button[^>]*type="submit"[^>]*disabled/);
    const avisoAntes = renderToStaticMarkup(createElement(DadosDoPedido, { pedido: p, estado: "pronto", aoEnviar: noop, envioAtivo: true, liberado: false }));
    expect(avisoAntes).toMatch(/role="status"[^>]*>Um instante/);
    const depois = renderToStaticMarkup(createElement(AcoesDoPedido, { pedido: p, estado: "pronto", envioAtivo: true, liberado: true }));
    expect(depois).not.toMatch(/<button[^>]*type="submit"[^>]*disabled/);
    const avisoDepois = renderToStaticMarkup(createElement(DadosDoPedido, { pedido: p, estado: "pronto", aoEnviar: noop, envioAtivo: true, liberado: true }));
    expect(avisoDepois).not.toContain("Um instante");
  });

  it("envioLiberado segue a regra dos 3 s com relógio controlado", () => {
    expect(envioLiberado(1000, 1000)).toBe(false);
    expect(envioLiberado(1000, 1000 + TEMPO_MINIMO_MS - 1)).toBe(false);
    expect(envioLiberado(1000, 1000 + TEMPO_MINIMO_MS)).toBe(true);
  });
});
