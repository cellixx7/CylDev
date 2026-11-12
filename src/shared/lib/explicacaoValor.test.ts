import { describe, expect, it } from "vitest";
import { VALOR_HORA_EXTRA } from "../../content/orcamento";
import { servicoOrcamentoPorId } from "../../content/perguntas";
import { explicarValor, somaDoDetalhamento } from "./explicacaoValor";
import { calcularCarrinho, type OpcoesCarrinho, type Respostas } from "./orcamento";

/** Respostas determinísticas: `modo` 0 = nada respondido; 1 = primeira opção; 2 = última opção (e todas nas múltiplas). */
function responder(id: string, modo: 0 | 1 | 2): Respostas {
  const r: Respostas = {};
  if (modo === 0) return r;
  for (const p of servicoOrcamentoPorId(id)!.perguntas) {
    if (p.tipo === "multipla") r[p.id] = modo === 1 ? [p.opcoes[0].id] : p.opcoes.map((o) => o.id);
    else r[p.id] = modo === 1 ? p.opcoes[0].id : p.opcoes[p.opcoes.length - 1].id;
  }
  return r;
}

const carrinhos: string[][] = [
  ["planilha"],
  ["python"],
  ["sistema"],
  ["planilha", "painel"],
  ["planilha", "painel", "automacao"],
  ["planilha", "painel", "automacao", "landing"],
  ["planilha", "python"],
  ["planilha", "painel", "python"],
  ["planilha", "sistema"],
  ["planilha", "painel", "python", "sistema"],
];
const pilotos: OpcoesCarrinho["piloto"][] = [null, { percentual: 10, restam: 5 }, { percentual: 5, restam: 5 }];

describe("explicarValor: a soma do detalhamento fecha com o total do carrinho", () => {
  for (const ids of carrinhos) {
    for (const piloto of pilotos) {
      for (const modo of [0, 1, 2] as const) {
        it(`${ids.join("+")} | piloto ${piloto?.percentual ?? "nenhum"} | respostas ${modo}`, () => {
          const respostas = Object.fromEntries(ids.map((id) => [id, responder(id, modo)]));
          const carrinho = calcularCarrinho(ids, respostas, { piloto });
          const e = explicarValor(carrinho, respostas, { piloto });
          expect(somaDoDetalhamento(e)).toBe(carrinho.total);
          expect(e.total).toBe(carrinho.total);
          expect(e.somaTabela).toBe(carrinho.somaTabela);
          for (const i of e.itens) {
            const calculo = carrinho.itens.find((c) => c.id === i.id)!;
            expect(i.preco).toBe(calculo.preco);
            if (i.precoBase !== null) expect(i.precoBase + i.extras.reduce((a, x) => a + x.valor, 0)).toBe(i.preco);
          }
        });
      }
    }
  }
});

describe("explicarValor: desconto", () => {
  it("combo vence: dois combináveis e piloto de 5%", () => {
    const piloto = { percentual: 5 as const, restam: 5 };
    const e = explicarValor(calcularCarrinho(["planilha", "painel"], {}, { piloto }), {}, { piloto });
    expect(e.desconto).toMatchObject({ tipo: "combo", percentual: 10, qtdCombinaveis: 2 });
    expect(e.desconto?.alternativa).toMatchObject({ tipo: "piloto", percentual: 5 });
    expect(e.desconto!.alternativa!.valor).toBeLessThan(e.desconto!.valor);
    expect(e.desconto?.empate).toBe(false);
  });

  it("piloto vence: o Python entra no piloto e fica fora do combo", () => {
    const piloto = { percentual: 10 as const, restam: 5 };
    const e = explicarValor(calcularCarrinho(["planilha", "painel", "python"], {}, { piloto }), {}, { piloto });
    expect(e.desconto?.tipo).toBe("piloto");
    expect(e.desconto?.alternativa?.tipo).toBe("combo");
    expect(e.desconto!.alternativa!.valor).toBeLessThan(e.desconto!.valor);
  });

  it("empate: vale o combo e a explicação avisa", () => {
    const piloto = { percentual: 10 as const, restam: 5 };
    const e = explicarValor(calcularCarrinho(["planilha", "painel"], {}, { piloto }), {}, { piloto });
    expect(e.desconto?.tipo).toBe("combo");
    expect(e.desconto?.empate).toBe(true);
  });

  it("sem desconto: um só combinável e sem piloto", () => {
    const e = explicarValor(calcularCarrinho(["planilha"], {}, { piloto: null }), {}, { piloto: null });
    expect(e.desconto).toBeNull();
    expect(e.total).toBe(e.somaTabela);
  });

  it("sistema: base de R$ 1.000, horas a combinar e filhas no detalhamento", () => {
    const respostas = { sistema: { tipo: "saas", cobranca: "mensal" } };
    const e = explicarValor(calcularCarrinho(["planilha", "sistema"], respostas, { piloto: null }), respostas, { piloto: null });
    const s = e.itens.find((i) => i.id === "sistema")!;
    expect(s).toMatchObject({ sobConsulta: false, precoBase: 1000, preco: 1500, horasACombinar: true });
    expect(s.extras.map((x) => x.pergunta)).toEqual(["Tipo de sistema", "Cobrança"]);
    expect(s.semResposta).toContain("Tipos de usuário");
  });
});

describe("explicarValor: respostas", () => {
  it("lista o que somou horas, o que ficou sem resposta e o que mais mudaria", () => {
    const respostas = { planilha: responder("planilha", 0) };
    const e = explicarValor(calcularCarrinho(["planilha"], respostas, { piloto: null }), respostas, { piloto: null });
    const i = e.itens[0];
    expect(i.extras).toEqual([]);
    expect(i.semResposta.length).toBe(servicoOrcamentoPorId("planilha")!.perguntas.length);
    expect(i.mudariam.length).toBeGreaterThan(0);
    expect(e.temSemResposta).toBe(true);
  });

  it("cada extra tem horas inteiras vezes o valor da hora", () => {
    const respostas = { planilha: responder("planilha", 2) };
    const e = explicarValor(calcularCarrinho(["planilha"], respostas, { piloto: null }), respostas, { piloto: null });
    const extras = e.itens[0].extras;
    expect(extras.length).toBeGreaterThan(0);
    for (const x of extras) expect(x.valor).toBe(x.horas! * VALOR_HORA_EXTRA);
  });

  it("bot com horas provisórias: sem horas, a combinar", () => {
    const id = "bot-essencial";
    if (!servicoOrcamentoPorId(id)) return;
    const respostas = { [id]: responder(id, 2) };
    const e = explicarValor(calcularCarrinho([id], respostas, { piloto: null }), respostas, { piloto: null });
    expect(e.itens[0].horasACombinar).toBe(true);
    for (const x of e.itens[0].extras) expect(x.horas).toBeNull();
  });
});
