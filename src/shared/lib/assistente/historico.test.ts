import { describe, expect, it } from "vitest";
import { conversaNova } from "./motor";
import {
  MAX_ANTERIORES,
  arquivarAtual,
  historicoVazio,
  normalizarHistorico,
  registrarAtual,
  semDadosPessoais,
  TEXTO_DADO_PESSOAL,
  transcricao,
  type Mensagem,
  type Sessao,
} from "./historico";

const bot: Mensagem = { id: 0, autor: "bot", hora: "10:00", resposta: { blocos: [{ tipo: "p", texto: "Oi!" }], chips: [], acoes: [] } };
const eu: Mensagem = { id: 1, autor: "eu", hora: "10:01", texto: "quanto custa?" };
const sessao = (id: string, mensagens: Mensagem[] = [bot, eu]): Sessao => ({ id, iniciadaEm: 1, atualizadaEm: 2, conversa: conversaNova(), mensagens });

describe("histórico do chat", () => {
  it("conversa só com as boas-vindas não é guardada", () => {
    expect(registrarAtual(historicoVazio(), sessao("a", [bot])).atual).toBeNull();
    expect(registrarAtual(historicoVazio(), sessao("a")).atual?.id).toBe("a");
  });

  it("nova conversa arquiva a atual (a mais nova primeiro) e ignora a vazia", () => {
    let h = registrarAtual(historicoVazio(), sessao("a"));
    h = arquivarAtual(h);
    expect(h.atual).toBeNull();
    h = arquivarAtual(registrarAtual(h, sessao("b")));
    expect(h.anteriores.map((s) => s.id)).toEqual(["b", "a"]);
    expect(arquivarAtual(h).anteriores).toHaveLength(2);
  });

  it("guarda no máximo MAX_ANTERIORES conversas, descartando as mais antigas", () => {
    let h = historicoVazio();
    for (let i = 0; i < MAX_ANTERIORES + 5; i++) h = arquivarAtual(registrarAtual(h, sessao(`s${i}`)));
    expect(h.anteriores).toHaveLength(MAX_ANTERIORES);
    expect(h.anteriores[0].id).toBe(`s${MAX_ANTERIORES + 4}`);
  });

  it("ida e volta pelo JSON preserva tudo; lixo e versão desconhecida viram histórico vazio", () => {
    const h = arquivarAtual(registrarAtual(registrarAtual(historicoVazio(), sessao("a")), sessao("b")));
    const h2 = registrarAtual(h, sessao("c"));
    expect(normalizarHistorico(JSON.parse(JSON.stringify(h2)))).toEqual(h2);
    for (const lixo of [null, 42, "x", [], {}, { v: 2, atual: null, anteriores: [] }]) expect(normalizarHistorico(lixo)).toEqual(historicoVazio());
  });

  it("descarta só a sessão estragada e completa campos novos da conversa", () => {
    const antiga = { ...sessao("velha"), conversa: { orc: null, guia: null } };
    const ruim = { id: "ruim", iniciadaEm: 1, atualizadaEm: 2, conversa: {}, mensagens: [{ id: "x" }] };
    const h = normalizarHistorico({ v: 1, atual: ruim, anteriores: [antiga] });
    expect(h.atual).toBeNull();
    expect(h.anteriores).toHaveLength(1);
    expect(h.anteriores[0].conversa).toEqual({ ...conversaNova(), orc: null, guia: null });
  });

  it("a transcrição traz hora, quem falou e o texto das respostas", () => {
    expect(transcricao([bot, eu], "Assistente Cyl", "Você")).toBe("[10:00] Assistente Cyl: Oi!\n\n[10:01] Você: quanto custa?");
  });

  it("nome e WhatsApp do envio do pedido não vão para o storage (nem o envio em andamento)", () => {
    const nome: Mensagem = { id: 2, autor: "eu", hora: "10:02", texto: "Maria da Silva", sensivel: true };
    const confirma: Mensagem = { id: 3, autor: "bot", hora: "10:02", sensivel: true, resposta: { blocos: [{ tipo: "p", texto: "Confere? (61) 99999-9999" }], chips: [], acoes: [] } };
    const s = { ...sessao("a", [bot, eu, nome, confirma]), conversa: { ...conversaNova(), envio: { etapa: "confirmar" as const, ids: ["planilha"], respostas: {}, observacoes: "", nome: "Maria", whatsapp: "5561999999999" } } };
    const guardado = registrarAtual(historicoVazio(), s).atual!;
    const json = JSON.stringify(guardado);
    expect(json).not.toContain("Maria");
    expect(json).not.toContain("99999");
    expect(guardado.conversa.envio).toBeNull();
    expect(guardado.mensagens[2].texto).toBe(TEXTO_DADO_PESSOAL);
    expect(guardado.mensagens[1].texto).toBe("quanto custa?");
    // Também ao arquivar e sem mexer na sessão original (que continua inteira na tela).
    expect(JSON.stringify(arquivarAtual({ v: 1, atual: s, anteriores: [] }).anteriores)).not.toContain("Maria");
    expect(s.mensagens[2].texto).toBe("Maria da Silva");
    expect(semDadosPessoais(sessao("b")).mensagens).toEqual([bot, eu]);
  });
});
