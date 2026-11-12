import { describe, expect, it } from "vitest";
import { servicosOrcamento } from "../../content/perguntas";
import { prazoACombinar, servicoPorId } from "../../content/servicos";
import { textoPrazo } from "../components/Catalogo";
import {
  calcularCarrinho,
  calcularServico,
  comDesconto,
  descontoPilotoAtual,
  horasExtrasDa,
  linkWhatsappCarrinho,
  mensagemCarrinho,
  mensalidadeDe,
  mudaOValor,
  percentualCombo,
  textoEstimativa,
  type CalculoServico,
} from "./orcamento";

// brl() usa espaço não separável entre "R$" e o número.
const limpo = (t: string) => t.replace(/ /g, " ");
const servico = (id: string, respostas = {}) => calcularServico(id, respostas) as CalculoServico;
const semPiloto = { piloto: null };
const piloto10 = { piloto: { percentual: 10 as const, restam: 5 } };

describe("descontoPilotoAtual", () => {
  it("usa 10% enquanto houver vaga, depois 5%", () => {
    expect(descontoPilotoAtual(5, 5)).toEqual({ percentual: 10, restam: 5 });
    expect(descontoPilotoAtual(0, 3)).toEqual({ percentual: 5, restam: 3 });
  });

  it("some quando as vagas acabam", () => {
    expect(descontoPilotoAtual(0, 0)).toBeNull();
  });
});

describe("mensalidadeDe e comDesconto", () => {
  it("mensalidade é 10% do preço de criação", () => {
    expect(mensalidadeDe(300)).toBe(30);
    expect(mensalidadeDe(500)).toBe(50);
  });

  it("desconto aplica o percentual e arredonda", () => {
    expect(comDesconto(400, 10)).toBe(360);
    expect(comDesconto(450, 5)).toBe(428);
  });
});

describe("preço base, sem respostas", () => {
  it("mantém preço e horas do catálogo", () => {
    const planilha = servico("planilha");
    expect(planilha).toMatchObject({ preco: 100, horas: 2, dias: 2, horasExtras: 0, aPartirDe: false });
    expect(planilha.linhas).toEqual([{ rotulo: "Base do pacote", valor: 100, horas: 2 }]);
    expect(servico("painel")).toMatchObject({ preco: 200, horas: 4, dias: 3 });
    expect(servico("landing")).toMatchObject({ preco: 300, horas: 5, dias: 4 });
  });

  it("automação continua 'a partir de'", () => {
    expect(servico("automacao")).toMatchObject({ preco: 300, horas: 6, dias: 4, aPartirDe: true });
  });

  it("id desconhecido não calcula", () => {
    expect(calcularServico("nao-existe")).toBeNull();
  });
});

describe("escolha única com horas", () => {
  it("soma as horas da opção marcada, R$ 50 cada", () => {
    const c = servico("planilha", { existente: "bagunca" });
    expect(c).toMatchObject({ preco: 150, horas: 3, horasExtras: 1, dias: 3 });
    expect(c.linhas[1]).toEqual({ rotulo: "Material de partida: Sim, e precisa de arrumação grande", valor: 50, horas: 1 });
  });

  it("opção sem efeito não muda o valor", () => {
    expect(servico("planilha", { existente: "zero", negocio: "loja", sensiveis: "sim" }).preco).toBe(100);
  });

  it("painel: 'ainda não tenho' soma 2 h", () => {
    expect(servico("painel", { origem: "nenhum" })).toMatchObject({ preco: 300, horas: 6, dias: 4 });
  });

  it("ignora opção que não existe", () => {
    expect(servico("planilha", { existente: "xyz" }).preco).toBe(100);
  });
});

describe("escolha múltipla com itens inclusos (gratis)", () => {
  it("os primeiros itens saem de graça", () => {
    expect(servico("planilha", { controles: ["clientes"] }).preco).toBe(100);
    expect(servico("painel", { responder: ["vendi", "compra-mais"] }).preco).toBe(200);
  });

  it("cada item acima do incluso soma as horas extras", () => {
    const c = servico("planilha", { controles: ["clientes", "estoque", "vendas"] });
    expect(c).toMatchObject({ preco: 200, horas: 4, horasExtras: 2 });
    expect(c.linhas[1].rotulo).toBe("Controles a mais: 2 a mais");
  });

  it("automação: cada tarefa extra soma 2 h", () => {
    expect(servico("automacao", { tarefas: ["planilha", "avisos", "juntar"] })).toMatchObject({
      preco: 500,
      horas: 10,
      dias: 6,
    });
  });

  it("nunca fica negativo e ignora ids repetidos ou inválidos", () => {
    const p = servicosOrcamento.find((s) => s.id === "planilha")!.perguntas.find((q) => q.id === "controles")!;
    expect(horasExtrasDa(p, {})).toBe(0);
    expect(horasExtrasDa(p, { controles: ["clientes", "clientes", "xyz"] })).toBe(0);
    expect(horasExtrasDa(p, { controles: ["clientes", "estoque", "estoque"] })).toBe(1);
  });

  it("combina várias respostas", () => {
    const c = servico("landing", {
      objetivos: ["whatsapp", "servicos", "fotos", "agendamentos"],
      material: "nenhum",
      paginas: "tres",
    });
    expect(c).toMatchObject({ preco: 600, horas: 11, dias: 7, horasExtras: 6 });
  });
});

describe("mudaOValor", () => {
  it("separa perguntas que mudam o valor das que não mudam", () => {
    const perguntas = (id: string) => servicosOrcamento.find((s) => s.id === id)!.perguntas;
    expect(perguntas("planilha").map(mudaOValor)).toEqual([false, true, true, true, false]);
    expect(perguntas("aulas").map(mudaOValor)).toEqual([true, false, false]);
    expect(perguntas("sistema").map(mudaOValor)).toEqual([false, false]);
  });
});

describe("aulas", () => {
  it("o preço depende só do formato", () => {
    expect(servico("aulas")).toMatchObject({ preco: 50, formatoAula: "avulsa", horas: null, dias: null });
    expect(servico("aulas", { pagamento: "avulsa" }).preco).toBe(50);
    expect(servico("aulas", { pagamento: "pacote" }).preco).toBe(180);
  });

  it("nível e foco não mudam o valor", () => {
    expect(servico("aulas", { pagamento: "pacote", nivel: "avancar", foco: ["excel", "powerbi", "graficos"] }).preco).toBe(180);
  });

  it("começa quando o cliente quiser", () => {
    expect(servico("aulas").prazo).toBe("Começa quando você quiser");
  });
});

describe("sistema sob medida", () => {
  it("é sempre sob consulta, com prazo na proposta", () => {
    const c = servico("sistema", { resolver: ["pedidos", "agenda", "area-cliente"], quando: "urgencia" });
    expect(c).toMatchObject({ preco: null, tipoPreco: "sobConsulta", prazo: "Combinado na proposta" });
  });
});

describe("prazo calculado versus 'a combinar'", () => {
  it("prazo calculado: ceil(horas / 2) + 1 dia de revisão", () => {
    const c = servico("planilha", { existente: "papel", controles: ["clientes", "estoque"], dinheiro: "sim" });
    expect(c.horas).toBe(5);
    expect(c.dias).toBe(4);
    expect(c.prazo).toBe("estimado: 4 dias úteis");
  });

  it("bots: o preço varia pelas respostas, o prazo é sempre a combinar", () => {
    const essencial = servico("bot-essencial", { funcoes: ["boas-vindas", "tickets", "anuncios", "cargos"] });
    expect(essencial).toMatchObject({ preco: 400, estimativa: true, horas: null, dias: null, prazo: prazoACombinar });
    expect(essencial.linhas[0].horas).toBe(0);
    const ia = servico("bot-ia", { papeis: ["duvidas", "conversa", "regras"], provedor: "ajuda" });
    expect(ia).toMatchObject({ preco: 750, aPartirDe: true, horas: null, dias: null, prazo: prazoACombinar });
  });

  it("nenhum prazo de bot tem dias úteis", () => {
    for (const id of ["bot-essencial", "bot-ia"]) {
      expect(servico(id).prazo).not.toMatch(/dias/);
      expect(servico(id, { servidor: "jogo" }).prazo).toBe("prazo a combinar");
    }
  });

  it("mensalidade é 10% da criação já com as extras", () => {
    expect(servico("bot-essencial").mensalidade).toBe(30);
    expect(servico("bot-essencial", { funcoes: ["boas-vindas", "tickets", "anuncios", "cargos"] }).mensalidade).toBe(40);
    expect(servico("bot-ia", { papeis: ["duvidas", "conversa", "regras"], provedor: "ajuda" }).mensalidade).toBe(75);
    expect(servico("planilha").mensalidade).toBeNull();
  });
});

describe("percentualCombo", () => {
  it("2 combináveis = 10%, 3 ou mais = 15%", () => {
    expect([0, 1, 2, 3, 4].map((n) => percentualCombo(n))).toEqual([0, 0, 10, 15, 15]);
  });
});

describe("carrinho", () => {
  it("vazio: sem itens, total zero e mensagem genérica", () => {
    const c = calcularCarrinho([], {}, piloto10);
    expect(c).toMatchObject({ itens: [], somaTabela: 0, total: 0, desconto: null, prazoCombinaveis: null, mensalidade: 0 });
    expect(mensagemCarrinho(c)).toBe("Quero fazer um orçamento.");
    expect(decodeURIComponent(linkWhatsappCarrinho(c))).toContain("Quero fazer um orçamento.");
    expect(textoEstimativa(c)).toBe("");
  });

  it("um item sem desconto: soma de tabela é o total", () => {
    const c = calcularCarrinho(["painel"], {}, semPiloto);
    expect(c).toMatchObject({ somaTabela: 200, total: 200, desconto: null });
  });

  it("usa as respostas de cada item, ignora repetidos e ids inválidos", () => {
    const c = calcularCarrinho(["planilha", "planilha", "xyz"], { planilha: { dinheiro: "sim" } }, semPiloto);
    expect(c.itens).toHaveLength(1);
    expect(c.total).toBe(150);
  });

  it("combo: 1 combinável paga o preço normal; combinável + aula ou sistema não forma combo", () => {
    const um = calcularCarrinho(["painel"], {}, semPiloto);
    expect(um.desconto).toBeNull();
    expect(um.total).toBe(um.somaTabela);
    const comAula = calcularCarrinho(["painel", "aulas"], { aulas: { pagamento: "pacote" } }, semPiloto);
    expect(comAula.desconto).toBeNull();
    expect(calcularCarrinho(["painel", "sistema"], {}, semPiloto).desconto).toBeNull();
  });

  it("combo com 2 combináveis: 10% e prazo único", () => {
    const c = calcularCarrinho(["planilha", "painel"], {}, semPiloto);
    expect(c.somaTabela).toBe(300);
    expect(c.desconto).toMatchObject({ tipo: "combo", percentual: 10, valor: 30, rotulo: "combo 10%" });
    expect(c.total).toBe(270);
    // 2 h + 4 h = 6 h: ceil(6 / 2) + 1 = 4 dias (e não 2 + 3 = 5)
    expect(c.prazoCombinaveis).toEqual({ horas: 6, dias: 4, texto: "estimado: 4 dias úteis" });
  });

  it("combo com 3 combináveis: 15%", () => {
    const c = calcularCarrinho(["planilha", "painel", "automacao"], {}, semPiloto);
    expect(c.somaTabela).toBe(600);
    expect(c.desconto).toMatchObject({ tipo: "combo", percentual: 15, valor: 90 });
    expect(c.total).toBe(510);
    expect(c.prazoCombinaveis).toMatchObject({ horas: 12, dias: 7 });
    expect(c.totalAPartirDe).toBe(true);
  });

  it("combo com 4 combináveis também é 15%", () => {
    const c = calcularCarrinho(["planilha", "painel", "automacao", "landing"], {}, semPiloto);
    expect(c.desconto).toMatchObject({ tipo: "combo", percentual: 15 });
    expect(c.total).toBe(900 - 135);
  });

  it("piloto sozinho: 10% sobre a criação", () => {
    const c = calcularCarrinho(["planilha"], {}, piloto10);
    expect(c.desconto).toMatchObject({ tipo: "piloto", percentual: 10, valor: 10, rotulo: "piloto 10%" });
    expect(c.total).toBe(90);
  });

  it("combo e piloto não se somam: vale o maior", () => {
    // 3 combináveis: combo 15% (R$ 90) contra piloto 10% (R$ 60).
    const tres = calcularCarrinho(["planilha", "painel", "automacao"], {}, piloto10);
    expect(tres.desconto).toMatchObject({ tipo: "combo", valor: 90 });
    expect(tres.total).toBe(510);
    // 2 combináveis e um bot: piloto 10% sobre R$ 600 (R$ 60) contra combo 10% sobre R$ 300 (R$ 30).
    const comBot = calcularCarrinho(["planilha", "painel", "bot-essencial"], {}, piloto10);
    expect(comBot.desconto).toMatchObject({ tipo: "piloto", percentual: 10, valor: 60, rotulo: "piloto 10%" });
    expect(comBot.total).toBe(540);
  });

  it("empate entre combo e piloto: vale o combo, sem somar", () => {
    const c = calcularCarrinho(["planilha", "painel"], {}, piloto10);
    expect(c.desconto).toMatchObject({ tipo: "combo", valor: 30 });
    expect(c.total).toBe(270);
  });

  it("itens fora do combo: bots só recebem piloto; aulas e sistema, nenhum", () => {
    const bots = calcularCarrinho(["bot-essencial", "bot-ia"], {}, piloto10);
    expect(bots.desconto).toMatchObject({ tipo: "piloto", valor: 80 });
    expect(bots.total).toBe(720);
    const semDesconto = calcularCarrinho(["aulas", "sistema"], { aulas: { pagamento: "pacote" } }, piloto10);
    expect(semDesconto).toMatchObject({ somaTabela: 180, desconto: null, total: 180, temSobConsulta: true });
    const misto = calcularCarrinho(["planilha", "aulas"], { aulas: { pagamento: "pacote" } }, piloto10);
    expect(misto.desconto?.valor).toBe(10);
    expect(misto.total).toBe(270);
  });

  it("aulas e bots não entram no prazo único dos combináveis", () => {
    const c = calcularCarrinho(["planilha", "bot-essencial", "aulas", "sistema"], {}, semPiloto);
    expect(c.prazoCombinaveis).toMatchObject({ horas: 2, dias: 2 });
    expect(c.prazosOutros).toEqual([
      { nome: "Bot de Discord essencial", texto: "prazo a combinar" },
      { nome: "Aulas de Excel e Power BI", texto: "Começa quando você quiser" },
      { nome: "Sistema sob medida", texto: "Combinado na proposta" },
    ]);
  });

  it("só bots: sem prazo calculado", () => {
    expect(calcularCarrinho(["bot-essencial"], {}, semPiloto).prazoCombinaveis).toBeNull();
  });

  it("mensalidade soma só os bots, sem desconto de piloto", () => {
    const c = calcularCarrinho(["bot-essencial", "bot-ia", "planilha"], {}, piloto10);
    expect(c.mensalidade).toBe(80);
    expect(calcularCarrinho(["planilha"], {}, piloto10).mensalidade).toBe(0);
  });

  it("sem vaga de piloto e sem combo, não há desconto", () => {
    expect(calcularCarrinho(["planilha", "bot-essencial"], {}, semPiloto).desconto).toBeNull();
  });
});

describe("mensagem do WhatsApp", () => {
  it("lista serviços, valores e o total estimado", () => {
    const c = calcularCarrinho(["planilha", "painel", "bot-essencial", "aulas"], { aulas: { pagamento: "pacote" } }, piloto10);
    expect(limpo(mensagemCarrinho(c))).toBe(
      [
        "Quero fazer um orçamento com:",
        "- Planilha organizada: R$ 100; 2 h; estimado: 2 dias úteis",
        "- Painel básico: R$ 200; 4 h; estimado: 3 dias úteis",
        "- Bot de Discord essencial: estimativa R$ 300; prazo a combinar",
        "- Aulas de Excel e Power BI: R$ 180; Começa quando você quiser",
        "Prazo dos combináveis, juntos: estimado: 4 dias úteis",
        "Total estimado: a partir de R$ 720, com piloto 10%, mais mensalidade de R$ 30 (hospedagem à parte) (estimativa, confirmada na conversa).",
      ].join("\n"),
    );
  });

  it("aula avulsa mostra o valor por hora; sistema fica de fora do total", () => {
    const c = calcularCarrinho(["aulas", "sistema"], {}, semPiloto);
    expect(limpo(mensagemCarrinho(c))).toContain("- Aulas de Excel e Power BI: R$ 50 por hora;");
    expect(mensagemCarrinho(c)).toContain("- Sistema sob medida: sob consulta; Combinado na proposta");
    expect(limpo(textoEstimativa(c))).toBe("R$ 50, sistema sob consulta, fora do total");
  });

  it("o link leva a origem e a mensagem codificada", () => {
    const c = calcularCarrinho(["planilha"], {}, semPiloto);
    const url = linkWhatsappCarrinho(c);
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    const texto = limpo(decodeURIComponent(url.split("?text=")[1]));
    expect(texto).toContain("origem: negocios-carrinho");
    expect(texto).toContain("- Planilha organizada: R$ 100");
  });
});

describe("textoPrazo (catálogo)", () => {
  it("mostra 'prazo a combinar' nos bots", () => {
    expect(textoPrazo(servicoPorId("bot-essencial")!)).toBe("prazo a combinar");
    expect(textoPrazo(servicoPorId("bot-ia")!)).toBe("prazo a combinar");
  });

  it("mantém dias úteis nos demais", () => {
    expect(textoPrazo(servicoPorId("painel")!)).toMatch(/dias úteis$/);
    expect(textoPrazo(servicoPorId("planilha")!)).toMatch(/dias? útei?s?$/);
  });
});
