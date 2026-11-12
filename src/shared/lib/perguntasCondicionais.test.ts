import { describe, expect, it } from "vitest";
import { LIMITES_ARVORE, servicoOrcamentoPorId, servicosOrcamento, type Pergunta } from "../../content/perguntas";
import { adicionar, estadoInicial, responder } from "./carrinho-estado";
import { restaurarCarrinho, serializarCarrinho, VERSAO_CARRINHO } from "./carrinho-persistencia";
import { explicarValor, somaDoDetalhamento } from "./explicacaoValor";
import { calcularCarrinho, perguntasVisiveis, perguntasVisiveisComNivel, podarRespostas, todasAsPerguntas } from "./orcamento";
import { dadosEmailPedido, mensagemWhatsappPedido, montarPedido, progressoDoServico, totalCurto } from "./pedido";

const sistema = servicoOrcamentoPorId("sistema")!;
const ids = (r: Parameters<typeof perguntasVisiveis>[1]) => perguntasVisiveis(sistema.perguntas, r).map((p) => p.id);
const semPiloto = { piloto: null };

describe("árvore de perguntas: limites", () => {
  /** Percorre a árvore pelos ids e confere profundidade, filhas por opção e ciclos. */
  function conferir(lista: Pergunta[], nivel: number, caminho: string[], nomes: string[]) {
    for (const p of lista) {
      expect(caminho, `ciclo em ${p.id}`).not.toContain(p.id);
      nomes.push(`${nivel}:${p.id}`);
      for (const o of p.opcoes) {
        if (!o.abre) continue;
        expect(o.abre.length, `${p.id}/${o.id} abre demais`).toBeLessThanOrEqual(LIMITES_ARVORE.filhasPorOpcao);
        expect(nivel + 1, `${p.id}/${o.id} passa do limite de níveis`).toBeLessThanOrEqual(LIMITES_ARVORE.niveis);
        conferir(o.abre, nivel + 1, [...caminho, p.id], nomes);
      }
    }
  }

  for (const s of servicosOrcamento) {
    it(`${s.id}: sem ciclos, no máximo 2 filhas por opção e 2 níveis`, () => {
      conferir(s.perguntas, 0, [], []);
    });

    it(`${s.id}: ids de pergunta únicos e opções com horas inteiras`, () => {
      const todas = todasAsPerguntas(s.perguntas);
      expect(new Set(todas.map((p) => p.id)).size).toBe(todas.length);
      // Duas perguntas diferentes com o mesmo id (e não a mesma pergunta aberta por duas opções) seriam um erro.
      const vistas = new Map<string, Pergunta>();
      const visitar = (lista: Pergunta[]) =>
        lista.forEach((p) => {
          const antes = vistas.get(p.id);
          if (antes) expect(antes, `id repetido: ${p.id}`).toBe(p);
          vistas.set(p.id, p);
          p.opcoes.forEach((o) => {
            if (o.horas !== undefined) expect(Number.isInteger(o.horas) && o.horas >= 0).toBe(true);
            if (o.abre) visitar(o.abre);
          });
        });
      visitar(s.perguntas);
    });
  }

  it("só o sistema tem perguntas condicionais, e no pior caso ficam 20 visíveis (8 principais + 12 filhas)", () => {
    const comFilhas = servicosOrcamento.filter((s) => todasAsPerguntas(s.perguntas).length !== s.perguntas.length).map((s) => s.id);
    expect(comFilhas).toEqual(["sistema"]);
    // Pior caso: para cada principal, a opção que abre mais perguntas (todas abrem 2).
    let pior = 0;
    const contar = (lista: Pergunta[]): number =>
      lista.reduce((acc, p) => acc + 1 + Math.max(0, ...p.opcoes.map((o) => (o.abre ? contar(o.abre) : 0))), 0);
    pior = contar(sistema.perguntas);
    expect(pior).toBe(20);
  });
});

describe("abertura e fechamento", () => {
  it("sem respostas, só as principais aparecem", () => {
    expect(ids({})).toEqual(sistema.perguntas.map((p) => p.id));
  });

  it("a resposta abre as filhas logo abaixo da pai", () => {
    const lista = ids({ tipo: "saas" });
    expect(lista.slice(0, 3)).toEqual(["tipo", "cobranca", "tipos-usuario"]);
    const niveis = perguntasVisiveisComNivel(sistema.perguntas, { tipo: "saas" }).map((v) => [v.pergunta.id, v.nivel, v.paiId]);
    expect(niveis.slice(0, 3)).toEqual([["tipo", 0, null], ["cobranca", 1, "tipo"], ["tipos-usuario", 1, "tipo"]]);
  });

  it("opção sem filhas não abre nada", () => {
    expect(ids({ tipo: "programa" })).toEqual(ids({}));
  });

  it("clientes e público abrem as mesmas duas perguntas, sem repetir", () => {
    expect(ids({ usuarios: "clientes" })).toContain("login");
    expect(ids({ usuarios: "publico" })).toContain("cadastro");
    expect(ids({ usuarios: "equipe" })).not.toContain("login");
  });

  it("trocar a resposta pai descarta as respostas das filhas", () => {
    let e = adicionar(estadoInicial(), "sistema");
    e = responder(e, "sistema", "tipo", "saas");
    e = responder(e, "sistema", "cobranca", "mensal");
    e = responder(e, "sistema", "tipos-usuario", "tres");
    expect(e.respostas.sistema).toMatchObject({ cobranca: "mensal", "tipos-usuario": "tres" });
    e = responder(e, "sistema", "tipo", "programa");
    expect(e.respostas.sistema).toEqual({ tipo: "programa" });
    // Voltar para SaaS reabre as perguntas, vazias: a resposta antiga não volta sozinha.
    e = responder(e, "sistema", "tipo", "saas");
    expect(e.respostas.sistema).toEqual({ tipo: "saas" });
  });

  it("podarRespostas tira as órfãs e mantém as visíveis", () => {
    const r = podarRespostas(sistema.perguntas, { tipo: "programa", cobranca: "mensal", volume: "medio" });
    expect(r).toEqual({ tipo: "programa", volume: "medio" });
  });
});

describe("contadores e horas só com as visíveis", () => {
  it("'X de Y' conta só as visíveis", () => {
    expect(progressoDoServico(sistema, {})).toEqual({ respondidas: 0, total: 8, faltam: 8 });
    expect(progressoDoServico(sistema, { tipo: "saas" })).toEqual({ respondidas: 1, total: 10, faltam: 9 });
    expect(progressoDoServico(sistema, { tipo: "saas", cobranca: "mensal" })).toEqual({ respondidas: 2, total: 10, faltam: 8 });
    expect(progressoDoServico(sistema, { tipo: "programa", cobranca: "mensal" })).toEqual({ respondidas: 1, total: 8, faltam: 7 });
  });

  it("órfãs não somam horas nem entram no pedido", () => {
    const orfa = { tipo: "programa", cobranca: "mensal", "tipos-usuario": "tres" };
    const limpa = { tipo: "programa" };
    const a = montarPedido(["sistema"], { sistema: orfa }, "", semPiloto);
    const b = montarPedido(["sistema"], { sistema: limpa }, "", semPiloto);
    expect(a.carrinho.total).toBe(b.carrinho.total);
    expect(a.itens[0].respostas.map((r) => r.perguntaId)).not.toContain("cobranca");
    expect(a.itens[0].perguntasTotal).toBe(8);
  });

  it("o pedido lista as filhas abertas, com 'não respondeu' nas vazias", () => {
    const p = montarPedido(["sistema"], { sistema: { tipo: "saas", cobranca: "mensal" } }, "", semPiloto);
    const email = dadosEmailPedido(p, { nome: "Cliente de Teste", whatsapp: "(61) 99999-9999" });
    expect(email.itens![0].respostas).toContain("Como o sistema será cobrado dos clientes? Mensalidade (assinatura)");
    expect(email.itens![0].respostas).toContain("Quantos tipos de usuário o sistema terá? não respondeu");
    expect(email.itens![0].respostas).not.toContain("Precisa de login");
  });

  it("total idêntico no carrinho, no WhatsApp, no e-mail e no detalhamento", () => {
    const respostas = { sistema: { tipo: "aplicativo", "onde-roda": "os-dois", "sem-internet": "sim", pagamento: "recorrente", "meio-pagamento": "nenhum" } };
    const pedido = montarPedido(["sistema"], respostas, "", semPiloto);
    const carrinho = calcularCarrinho(["sistema"], respostas, semPiloto);
    // 6 + 8 + 6 + 10 + 2 = 32 h extras
    expect(carrinho.total).toBe(300 + 32 * 50);
    const total = totalCurto(pedido);
    expect(total).toContain("1.900");
    expect(mensagemWhatsappPedido(pedido)).toContain("1.900");
    expect(dadosEmailPedido(pedido, { nome: "X", whatsapp: "1" }).total).toBe(total);
    expect(somaDoDetalhamento(explicarValor(carrinho, respostas, semPiloto))).toBe(carrinho.total);
  });

  it("o detalhamento inclui as filhas abertas e a soma fecha", () => {
    const respostas = { sistema: { tipo: "saas", cobranca: "mensal", "tipos-usuario": "dois", usuarios: "clientes", login: "sim" } };
    const carrinho = calcularCarrinho(["sistema"], respostas, semPiloto);
    const e = explicarValor(carrinho, respostas, semPiloto);
    expect(e.itens[0].extras.map((x) => x.pergunta)).toEqual(["Tipo de sistema", "Cobrança", "Tipos de usuário", "Quem usa", "Login"]);
    expect(somaDoDetalhamento(e)).toBe(carrinho.total);
  });
});

describe("persistência com filhas", () => {
  it("guarda só ids e respostas, na mesma versão do esquema", () => {
    let e = adicionar(estadoInicial(), "sistema");
    e = responder(e, "sistema", "tipo", "saas");
    e = responder(e, "sistema", "cobranca", "mensal");
    const salvo = JSON.parse(serializarCarrinho(e));
    expect(Object.keys(salvo).sort()).toEqual(["ids", "respostas", "v"]);
    expect(salvo.v).toBe(VERSAO_CARRINHO);
    expect(restaurarCarrinho(serializarCarrinho(e))).toEqual(e);
  });

  it("ao reabrir, a filha aberta volta e a órfã é ignorada", () => {
    const texto = JSON.stringify({
      v: VERSAO_CARRINHO,
      ids: ["sistema"],
      respostas: { sistema: { tipo: "programa", cobranca: "mensal", volume: "medio", "tipos-usuario": "tres" } },
    });
    expect(restaurarCarrinho(texto).respostas.sistema).toEqual({ tipo: "programa", volume: "medio" });
    const aberta = JSON.stringify({ v: VERSAO_CARRINHO, ids: ["sistema"], respostas: { sistema: { tipo: "saas", cobranca: "mensal" } } });
    expect(restaurarCarrinho(aberta).respostas.sistema).toEqual({ tipo: "saas", cobranca: "mensal" });
  });

  it("respostas antigas do sistema (perguntas que não existem mais) são descartadas", () => {
    const antigo = JSON.stringify({ v: VERSAO_CARRINHO, ids: ["sistema"], respostas: { sistema: { resolver: ["pedidos"], quando: "urgencia" } } });
    const e = restaurarCarrinho(antigo);
    expect(e.ids).toEqual(["sistema"]);
    expect(e.respostas.sistema).toBeUndefined();
  });

  it("opção que não existe na filha é descartada", () => {
    const texto = JSON.stringify({ v: VERSAO_CARRINHO, ids: ["sistema"], respostas: { sistema: { tipo: "saas", cobranca: "inventada" } } });
    expect(restaurarCarrinho(texto).respostas.sistema).toEqual({ tipo: "saas" });
  });
});
