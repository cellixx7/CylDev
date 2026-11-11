import { afterEach, describe, expect, it, vi } from "vitest";
import { servicoOrcamentoPorId, servicosDoCatalogo } from "../../content/perguntas";
import { adicionar, estadoInicial, responder } from "./carrinho-estado";
import {
  CHAVE_CARRINHO,
  lerCarrinho,
  limparCarrinho,
  restaurarCarrinho,
  salvarCarrinho,
  serializarCarrinho,
  VERSAO_CARRINHO,
} from "./carrinho-persistencia";
import { montarPedido } from "./pedido";

const planilha = servicoOrcamentoPorId("planilha")!;
const unica = planilha.perguntas.find((p) => p.tipo === "unica")!;
const painel = servicoOrcamentoPorId("painel")!;
const multipla = painel.perguntas.find((p) => p.tipo === "multipla")!;
const semPiloto = { piloto: null };

function estadoCheio() {
  let e = adicionar(adicionar(estadoInicial(), "planilha"), "painel");
  e = responder(e, "planilha", unica.id, unica.opcoes[1].id);
  e = responder(e, "painel", multipla.id, multipla.opcoes[0].id);
  e = responder(e, "painel", multipla.id, multipla.opcoes[1].id);
  return e;
}

describe("serializarCarrinho", () => {
  it("guarda só versão, ids e respostas", () => {
    const salvo = JSON.parse(serializarCarrinho(estadoCheio()));
    expect(Object.keys(salvo).sort()).toEqual(["ids", "respostas", "v"]);
    expect(salvo.v).toBe(VERSAO_CARRINHO);
    expect(salvo.ids).toEqual(["planilha", "painel"]);
  });

  it("nunca leva dados pessoais nem preço, mesmo que o estado venha com campos a mais", () => {
    const sujo = {
      ...estadoCheio(),
      nome: "Ana",
      whatsapp: "61999999999",
      email: "ana@dominio.com",
      observacoes: "urgente",
      total: 999,
    };
    const texto = serializarCarrinho(sujo);
    for (const proibido of ["Ana", "61999999999", "ana@dominio.com", "urgente", "999", "nome", "whatsapp", "email", "observacoes", "total"]) {
      expect(texto, proibido).not.toContain(proibido);
    }
  });
});

describe("restaurarCarrinho", () => {
  it("ida e volta devolve o mesmo estado e o mesmo pedido", () => {
    const e = estadoCheio();
    const deVolta = restaurarCarrinho(serializarCarrinho(e));
    expect(deVolta).toEqual(e);
    expect(montarPedido(deVolta.ids, deVolta.respostas, "", semPiloto).carrinho.total).toBe(
      montarPedido(e.ids, e.respostas, "", semPiloto).carrinho.total,
    );
  });

  it("ausente, vazio ou corrompido volta ao estado inicial", () => {
    for (const texto of [null, undefined, "", "{", "isto não é json", "null", "[]", "42", '"texto"']) {
      expect(restaurarCarrinho(texto), String(texto)).toEqual(estadoInicial());
    }
  });

  it("versão desconhecida ou ausente é ignorada", () => {
    const salvo = JSON.parse(serializarCarrinho(estadoCheio()));
    expect(restaurarCarrinho(JSON.stringify({ ...salvo, v: VERSAO_CARRINHO + 1 }))).toEqual(estadoInicial());
    expect(restaurarCarrinho(JSON.stringify({ ...salvo, v: String(VERSAO_CARRINHO) }))).toEqual(estadoInicial());
    expect(restaurarCarrinho(JSON.stringify({ ids: ["planilha"], respostas: {} }))).toEqual(estadoInicial());
  });

  it("descarta id de serviço removido, duplicado ou de tipo errado", () => {
    const texto = JSON.stringify({ v: VERSAO_CARRINHO, ids: ["planilha", "servico-extinto", "planilha", 7, null], respostas: {} });
    expect(restaurarCarrinho(texto).ids).toEqual(["planilha"]);
  });

  it("serviço que saiu do catálogo some do carrinho e das respostas", () => {
    const semPainel = servicosDoCatalogo.filter((s) => s.id !== "painel");
    const r = restaurarCarrinho(serializarCarrinho(estadoCheio()), semPainel);
    expect(r.ids).toEqual(["planilha"]);
    expect(r.respostas.painel).toBeUndefined();
    expect(r.respostas.planilha).toEqual(estadoCheio().respostas.planilha);
  });

  it("carrinho antigo com bots: descarta os ids e as respostas dos bots sem erro e mantém o resto", () => {
    const texto = JSON.stringify({
      v: VERSAO_CARRINHO,
      ids: ["bot-essencial", "planilha", "bot-ia"],
      respostas: {
        "bot-essencial": { funcoes: ["tickets"] },
        "bot-ia": { papeis: ["duvidas"] },
        planilha: estadoCheio().respostas.planilha,
      },
    });
    let r!: ReturnType<typeof restaurarCarrinho>;
    expect(() => (r = restaurarCarrinho(texto))).not.toThrow();
    expect(r.ids).toEqual(["planilha"]);
    expect(r.respostas["bot-essencial"]).toBeUndefined();
    expect(r.respostas["bot-ia"]).toBeUndefined();
    expect(r.respostas.planilha).toEqual(estadoCheio().respostas.planilha);
    // E o estado restaurado ainda vira um pedido, sem bot e sem mensalidade.
    const p = montarPedido(r.ids, r.respostas, "", semPiloto);
    expect(p.itens.map((i) => i.id)).toEqual(["planilha"]);
  });

  it("só bots salvos: volta ao carrinho vazio", () => {
    const texto = JSON.stringify({ v: VERSAO_CARRINHO, ids: ["bot-essencial", "bot-ia"], respostas: {} });
    expect(restaurarCarrinho(texto)).toEqual(estadoInicial());
  });

  it("descarta pergunta e opção que não existem mais, e resposta em formato errado", () => {
    const texto = JSON.stringify({
      v: VERSAO_CARRINHO,
      ids: ["planilha", "painel"],
      respostas: {
        planilha: { [unica.id]: "opcao-extinta", "pergunta-extinta": "x" },
        painel: { [multipla.id]: [multipla.opcoes[0].id, "opcao-extinta", multipla.opcoes[0].id, 3] },
        "servico-extinto": { a: "b" },
      },
    });
    const r = restaurarCarrinho(texto);
    expect(r.respostas.planilha).toBeUndefined();
    expect(r.respostas.painel).toEqual({ [multipla.id]: [multipla.opcoes[0].id] });
    expect(r.respostas["servico-extinto"]).toBeUndefined();
  });

  it("estruturas corrompidas por dentro não quebram", () => {
    expect(restaurarCarrinho(JSON.stringify({ v: VERSAO_CARRINHO, ids: "planilha", respostas: ["x"] }))).toEqual(estadoInicial());
    const outro = JSON.stringify({ v: VERSAO_CARRINHO, ids: ["planilha"], respostas: { planilha: "texto", painel: null } });
    expect(restaurarCarrinho(outro)).toEqual({ ...estadoInicial(), ids: ["planilha"] });
  });

  it("preço salvo é ignorado: o valor vem sempre do cálculo atual", () => {
    const texto = JSON.stringify({ v: VERSAO_CARRINHO, ids: ["planilha"], respostas: {}, total: 1, precos: { planilha: 1 } });
    const r = restaurarCarrinho(texto);
    expect(Object.keys(r).sort()).toEqual(["ids", "respostas"]);
    const limpo = adicionar(estadoInicial(), "planilha");
    expect(montarPedido(r.ids, r.respostas, "", semPiloto).carrinho.total).toBe(
      montarPedido(limpo.ids, limpo.respostas, "", semPiloto).carrinho.total,
    );
  });

  it("mantém a resposta de partida das aulas quando o salvo não a traz", () => {
    const texto = JSON.stringify({ v: VERSAO_CARRINHO, ids: ["aulas"], respostas: {} });
    expect(restaurarCarrinho(texto).respostas.aulas).toEqual(estadoInicial().respostas.aulas);
  });
});

describe("sessionStorage", () => {
  afterEach(() => vi.unstubAllGlobals());

  function armazenamentoFalso() {
    const dados = new Map<string, string>();
    return {
      dados,
      getItem: (k: string) => dados.get(k) ?? null,
      setItem: (k: string, v: string) => void dados.set(k, v),
      removeItem: (k: string) => void dados.delete(k),
    };
  }

  it("salva, lê e limpa", () => {
    const falso = armazenamentoFalso();
    vi.stubGlobal("sessionStorage", falso);
    salvarCarrinho(estadoCheio());
    expect(falso.dados.has(CHAVE_CARRINHO)).toBe(true);
    expect(lerCarrinho()).toEqual(estadoCheio());
    limparCarrinho();
    expect(falso.dados.has(CHAVE_CARRINHO)).toBe(false);
    expect(lerCarrinho()).toEqual(estadoInicial());
  });

  it("armazenamento bloqueado não lança erro", () => {
    const bloqueado = () => {
      throw new Error("bloqueado");
    };
    vi.stubGlobal("sessionStorage", { getItem: bloqueado, setItem: bloqueado, removeItem: bloqueado });
    expect(lerCarrinho()).toEqual(estadoInicial());
    expect(() => salvarCarrinho(estadoCheio())).not.toThrow();
    expect(() => limparCarrinho()).not.toThrow();
  });

  it("sem sessionStorage (fora do navegador) também não lança erro", () => {
    expect(lerCarrinho()).toEqual(estadoInicial());
    expect(() => salvarCarrinho(estadoCheio())).not.toThrow();
    expect(() => limparCarrinho()).not.toThrow();
  });
});
