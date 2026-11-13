import { describe, expect, it } from "vitest";
import { guia, perguntasGuia, resultadosGuia } from "../../content/guia";
import { estaNoCatalogo } from "../../content/perguntas";
import { servicoPorId } from "../../content/servicos";
import { escolher, passoDoGuia, voltar } from "./guia";

describe("conteúdo do guia", () => {
  it("toda opção leva a uma pergunta ou a um resultado que existem, e nunca aos dois", () => {
    for (const p of perguntasGuia) {
      expect(p.opcoes.length, p.id).toBeGreaterThanOrEqual(2);
      for (const o of p.opcoes) {
        expect(Boolean(o.pergunta) !== Boolean(o.resultado), `${p.id}/${o.id}`).toBe(true);
        if (o.pergunta) expect(perguntasGuia.some((q) => q.id === o.pergunta), `${p.id}/${o.id}`).toBe(true);
        if (o.resultado) expect(resultadosGuia.some((r) => r.id === o.resultado), `${p.id}/${o.id}`).toBe(true);
      }
    }
  });

  it("no máximo duas perguntas até qualquer resultado", () => {
    const profundidade = (id: string, n: number): number =>
      Math.max(...perguntasGuia.find((p) => p.id === id)!.opcoes.map((o) => (o.pergunta ? profundidade(o.pergunta, n + 1) : n)));
    expect(profundidade(guia.raiz, 1)).toBeLessThanOrEqual(2);
  });

  it("resultados só recomendam serviços do catálogo de Negócios", () => {
    for (const r of resultadosGuia) {
      for (const id of r.servicos) {
        expect(estaNoCatalogo(id), id).toBe(true);
        expect(servicoPorId(id)?.area).toBe("negocios");
      }
      expect(r.servicos.length > 0 || r.saida !== undefined, r.id).toBe(true);
    }
  });

  it("todo serviço do catálogo pode ser alcançado pelo guia", () => {
    const recomendados = new Set(resultadosGuia.flatMap((r) => r.servicos));
    for (const id of ["planilha", "painel", "automacao", "landing", "python", "sistema"]) expect(recomendados.has(id), id).toBe(true);
  });

  it("a saída 'quero um bot' vai para /comunidade/#bots", () => {
    const bot = resultadosGuia.find((r) => r.id === "bot")!;
    expect(bot.servicos).toEqual([]);
    expect(bot.saida).toEqual({ tipo: "link", href: "/comunidade/#bots", rotulo: "Ver os bots na Comunidade" });
  });

  it("'Não sei, prefiro conversar' leva a um resultado sem serviços, com texto curto e saída pelo WhatsApp", () => {
    const opcao = perguntasGuia.find((p) => p.id === guia.raiz)!.opcoes.find((o) => o.id === "conversar")!;
    expect(opcao.rotulo).toBe("Não sei, prefiro conversar");
    const r = resultadosGuia.find((x) => x.id === opcao.resultado)!;
    expect(r.servicos).toEqual([]);
    expect(r.porque).toBe("Sem problema, me conta o seu caso e eu te ajudo a escolher.");
    expect(r.saida).toEqual({ tipo: "whatsapp", rotulo: "Falar comigo no WhatsApp" });
  });

  it("nenhum endereço de contato fica escrito no conteúdo do guia", () => {
    const json = JSON.stringify({ guia, perguntasGuia, resultadosGuia });
    expect(json).not.toMatch(/wa\.me|@|\d{8,}/);
  });

  it("o resultado de planilha termina avisando do desconto, sem número", () => {
    const r = resultadosGuia.find((x) => x.id === "planilha")!;
    expect(r.porque.endsWith("Juntando serviços, há desconto.")).toBe(true);
  });

  it("nenhum texto traz número, preço ou prazo", () => {
    const textos = [
      guia.titulo,
      guia.intro,
      guia.semCompromisso,
      ...perguntasGuia.flatMap((p) => [p.texto, ...p.opcoes.map((o) => o.rotulo)]),
      ...resultadosGuia.flatMap((r) => [r.porque, r.saida?.rotulo ?? ""]),
    ];
    for (const t of textos) {
      expect(t, t).not.toMatch(/\d/);
      expect(t, t).not.toMatch(/R\$|\bdias?\b|\bhoras?\b/i);
    }
  });
});

describe("passoDoGuia", () => {
  it("sem escolhas mostra a primeira pergunta", () => {
    expect(passoDoGuia([]).pergunta?.id).toBe(guia.raiz);
  });

  it("segue pelas perguntas até o resultado", () => {
    expect(passoDoGuia(["numeros"]).pergunta?.id).toBe("numeros");
    expect(passoDoGuia(["numeros", "repeticao"]).resultado?.id).toBe("automacao");
    expect(passoDoGuia(["pagina"]).resultado?.servicos).toEqual(["landing"]);
    expect(passoDoGuia(["bot"]).resultado?.saida).toMatchObject({ href: "/comunidade/#bots" });
    expect(passoDoGuia(["conversar"]).resultado?.id).toBe("conversar");
  });

  it("escolha inválida é ignorada, sem erro", () => {
    expect(passoDoGuia(["nao-existe"]).pergunta?.id).toBe(guia.raiz);
    expect(passoDoGuia(["numeros", "nao-existe"]).pergunta?.id).toBe("numeros");
  });
});

describe("escolher e voltar", () => {
  it("escolher só aceita opção da pergunta atual e não avança depois do resultado", () => {
    expect(escolher([], "repeticao")).toEqual([]);
    expect(escolher([], "numeros")).toEqual(["numeros"]);
    expect(escolher(["pagina"], "numeros")).toEqual(["pagina"]);
  });

  it("voltar desfaz a última escolha e é seguro no vazio", () => {
    expect(voltar(["numeros", "bagunca"])).toEqual(["numeros"]);
    expect(voltar([])).toEqual([]);
  });
});
