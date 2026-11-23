import { describe, expect, it, vi } from "vitest";
import { assistente as t } from "../../../content/textos/assistente";
import { conversaNova, processar, textoPlano, type Conversa, type Entrada, type Resposta } from "./motor";

// Conversas reais que deram errado: serviço dito e esquecido, "pros dois", projeto grande e o envio do pedido pelo próprio chat.

type Passo = { conversa: Conversa; resposta: Resposta; texto: string };

function conversar(...mensagens: (string | Entrada)[]): Passo {
  let conversa = conversaNova();
  let resposta!: Resposta;
  for (const m of mensagens) {
    const r = processar(typeof m === "string" ? { texto: m } : m, conversa);
    conversa = r.conversa;
    resposta = r.resposta;
  }
  return { conversa, resposta, texto: textoPlano(resposta) };
}

/** Continua uma conversa já em andamento. */
function seguir(antes: Passo, ...mensagens: (string | Entrada)[]): Passo {
  let { conversa, resposta } = antes;
  for (const m of mensagens) {
    const r = processar(typeof m === "string" ? { texto: m } : m, conversa);
    conversa = r.conversa;
    resposta = r.resposta;
  }
  return { conversa, resposta, texto: textoPlano(resposta) };
}

/** Responde toda pergunta do orçamento pela primeira opção, até chegar ao resumo. */
function responderTudo(inicio: Passo): Passo {
  let atual = inicio;
  for (let i = 0; i < 60; i++) {
    const opcao = atual.resposta.chips.find((c) => "cmd" in c.entrada && c.entrada.cmd.t === "opcao");
    if (!opcao) return atual;
    atual = seguir(atual, opcao.entrada);
    const pronto = atual.resposta.chips.find((c) => "cmd" in c.entrada && c.entrada.cmd.t === "pronto");
    if (pronto && atual.conversa.orc) atual = seguir(atual, pronto.entrada);
  }
  throw new Error("o orçamento não terminou");
}

const temChipEnviar = (r: Resposta) => r.chips.some((c) => c.rotulo === t.envioChips.enviar);

describe("lembra o serviço dito e entende 'os dois'", () => {
  it("'quero montar um orçamento' depois de falar de planilha e painel não pergunta o serviço de novo", () => {
    const r = conversar("Eu queria uma planilha e depois um painel, tem desconto pra fazer os dois juntos?", "quero montar um orçamento então");
    expect(r.conversa.orc?.servicoId).toBe("planilha");
    expect(r.conversa.fila).toEqual(["painel"]);
    expect(r.texto).toContain("Planilha organizada e Painel básico");
  });

  it("'a gente acabou de falar qual serviço eu quero' segue com o que foi dito, em vez de recomeçar", () => {
    const r = conversar("quero uma planilha e um painel", "uai, a gente acabou de falar qual serviço eu quero");
    expect(r.conversa.orc?.servicoId).toBe("planilha");
    expect(r.texto).toContain(t.jaDisse);
  });

  it("uma resposta com o serviço depois de 'qual serviço?' começa o orçamento dele", () => {
    const r = conversar("quero montar um orçamento", "um painel");
    expect(r.conversa.orc?.servicoId).toBe("painel");
  });

  it("'quero arrumar uma planilha e fazer um painel' monta os dois, um de cada vez, com o combo no resumo", () => {
    const comeco = conversar("Quero arrumar e montar uma planilha e fazer um painel");
    expect(comeco.conversa.orc?.servicoId).toBe("planilha");
    const fim = responderTudo(comeco);
    expect(fim.texto).toContain("Planilha organizada");
    expect(fim.texto).toContain("Painel básico");
    expect(fim.texto).toMatch(/Desconto \(combo 10%\)/);
    expect(temChipEnviar(fim.resposta)).toBe(true);
    expect(fim.conversa.fila).toEqual([]);
  });
});

describe("projeto grande ou sob medida", () => {
  it("'um site grande' e 'site com curso' oferecem enviar o pedido por aqui, sem inventar preço", () => {
    for (const frase of ["olha, eu acho que um site grande", "eu queria um site com um bucado de coisas, que dá pra fazer curso e o escambal"]) {
      const r = conversar("to querendo montar um bagulho legal", frase);
      expect(r.texto).toContain("projeto sob medida");
      expect(r.texto).not.toMatch(/R\$|\d+ dias/);
      expect(temChipEnviar(r.resposta)).toBe(true);
    }
  });
});

describe("enviar o pedido pelo chat", () => {
  const ate = () => responderTudo(conversar("Quero montar um orçamento de planilha e painel"));

  it("pede nome e WhatsApp, valida o telefone, mostra o aceite e só envia depois da confirmação", () => {
    let r = seguir(ate(), "sim");
    expect(r.texto).toContain(t.envioNome);
    r = seguir(r, "x");
    expect(r.texto).toBe(t.envioNomeInvalido);
    r = seguir(r, "Maria da Silva");
    expect(r.texto).toContain("Prazer, Maria");
    r = seguir(r, "123");
    expect(r.conversa.envio?.etapa).toBe("whatsapp");
    expect(r.resposta.paraEnviar).toBeUndefined();
    r = seguir(r, "(61) 99999-9999");
    expect(r.conversa.envio?.etapa).toBe("confirmar");
    expect(r.texto).toContain("(61) 99999-9999");
    expect(r.texto).toContain(t.envioAceite);
    expect(r.resposta.acoes.map((a) => a.rotulo)).toEqual(expect.arrayContaining([t.acoes.termos, t.acoes.privacidade]));
    expect(r.resposta.paraEnviar).toBeUndefined();
    r = seguir(r, "pode enviar");
    expect(r.resposta.paraEnviar).toMatchObject({ nome: "Maria da Silva", whatsapp: "5561999999999", ids: ["planilha", "painel"] });
    // Confirmar duas vezes não envia duas vezes.
    expect(seguir(r, { cmd: { t: "confirmar" } }).resposta.paraEnviar).toBeUndefined();
  });

  it("envio feito: agradece sem prometer prazo certo e limpa o pedido; falhou: oferece WhatsApp e e-mail e deixa tentar de novo", () => {
    const confirmado = seguir(ate(), { cmd: { t: "enviar" } }, "Ana", "61988887777", { cmd: { t: "confirmar" } });
    const ok = seguir(confirmado, { cmd: { t: "envio", ok: true } });
    expect(ok.texto).toContain("sem garantia");
    expect(ok.conversa.orc).toBeNull();
    expect(ok.conversa.envio).toBeNull();
    const falhou = seguir(confirmado, { cmd: { t: "envio", ok: false } });
    expect(falhou.texto).toContain(t.envioFalhou);
    expect(falhou.resposta.acoes.some((a) => a.tipo === "link" && a.href.includes("wa.me"))).toBe(true);
    expect(falhou.conversa.envio?.etapa).toBe("confirmar");
    expect(seguir(falhou, { cmd: { t: "confirmar" } }).resposta.paraEnviar).toBeDefined();
  });

  it("cancelar no meio não envia nada e mantém o orçamento", () => {
    const r = seguir(ate(), { cmd: { t: "enviar" } }, "Ana", "cancelar");
    expect(r.conversa.envio).toBeNull();
    expect(r.conversa.orc).not.toBeNull();
    expect(r.resposta.paraEnviar).toBeUndefined();
  });

  it("projeto sob medida: o que a pessoa contou vai junto, sem item e sem preço", () => {
    const r = seguir(conversar("eu queria um site com curso e área de membros"), { cmd: { t: "enviar", sob: true } }, "Ana", "61988887777", "sim");
    expect(r.resposta.paraEnviar?.ids).toEqual([]);
    expect(r.resposta.paraEnviar?.observacoes).toContain("área de membros");
  });

  it("sem EmailJS configurado, o chat não oferece o envio (continua com o carrinho e o WhatsApp)", async () => {
    vi.resetModules();
    vi.doMock("../emailjs", async (orig) => ({ ...(await orig<typeof import("../emailjs")>()), emailjsConfigurado: () => false }));
    const m = await import("./motor");
    let c = m.conversaNova();
    let r = m.processar({ texto: "Quero orçar uma planilha" }, c);
    c = r.conversa;
    for (let i = 0; i < 40; i++) {
      const op = r.resposta.chips.find((x) => "cmd" in x.entrada && x.entrada.cmd.t === "opcao");
      if (!op) break;
      r = m.processar(op.entrada, c);
      c = r.conversa;
      const pr = r.resposta.chips.find((x) => "cmd" in x.entrada && x.entrada.cmd.t === "pronto");
      if (pr) {
        r = m.processar(pr.entrada, c);
        c = r.conversa;
      }
    }
    expect(r.resposta.chips.some((x) => x.rotulo === t.envioChips.enviar)).toBe(false);
    expect(r.resposta.acoes.some((a) => a.tipo === "carrinho")).toBe(true);
    vi.doUnmock("../emailjs");
  });
});
