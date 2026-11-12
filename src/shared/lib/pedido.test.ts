import { describe, expect, it } from "vitest";
import { servicoOrcamentoPorId } from "../../content/perguntas";
import { site } from "../../content/site";
import { calcularServico, type Respostas } from "./orcamento";
import {
  dadosEmailPedido,
  itensDoEmail,
  NAO_RESPONDEU,
  resumoPrecoItem,
  totalCurto,
  emailReal,
  linkEmailPedido,
  estadoDaEstimativa,
  linkWhatsappPedido,
  mensagemWhatsappPedido,
  montarPedido,
  progressoDoServico,
  textoPedidoCompleto,
} from "./pedido";

const semPiloto = { piloto: null };
const limpo = (t: string) => t.replace(/ /g, " ");
const modelo = (id: string) => servicoOrcamentoPorId(id)!;

const respostasPainel: Respostas = {
  negocio: "loja",
  origem: "varios", // +2 h
  responder: ["vendi", "compra-mais", "parado", "lucro"], // 2 inclusos, 2 a mais = +2 h
};

describe("progressoDoServico e estado da estimativa", () => {
  it("sem respostas: preço inicial", () => {
    const p = progressoDoServico(modelo("painel"), {});
    expect(p.respondidas).toBe(0);
    expect(p.total).toBe(modelo("painel").perguntas.length);
    expect(estadoDaEstimativa(calcularServico("painel", {})!, p)).toBe("inicial");
  });

  it("respostas parciais: em configuração, com o que falta", () => {
    const p = progressoDoServico(modelo("painel"), { negocio: "loja" });
    expect(p.respondidas).toBe(1);
    expect(p.faltam).toBe(p.total - 1);
    expect(estadoDaEstimativa(calcularServico("painel", { negocio: "loja" })!, p)).toBe("configurando");
  });

  it("múltipla vazia não conta; marcada conta", () => {
    expect(progressoDoServico(modelo("painel"), { responder: [] }).respondidas).toBe(0);
    expect(progressoDoServico(modelo("painel"), { responder: ["vendi"] }).respondidas).toBe(1);
  });

  it("ignora ids de opção que não existem", () => {
    expect(progressoDoServico(modelo("painel"), { negocio: "inexistente" }).respondidas).toBe(0);
  });

  it("todas respondidas: configurada", () => {
    const m = modelo("painel");
    const tudo: Respostas = {};
    for (const q of m.perguntas) tudo[q.id] = q.tipo === "multipla" ? [q.opcoes[0].id] : q.opcoes[0].id;
    const p = progressoDoServico(m, tudo);
    expect(p.faltam).toBe(0);
    expect(estadoDaEstimativa(calcularServico("painel", tudo)!, p)).toBe("configurada");
  });

  it("sistema sem respostas: preço inicial", () => {
    const c = calcularServico("sistema", {})!;
    expect(estadoDaEstimativa(c, progressoDoServico(modelo("sistema"), {}))).toBe("inicial");
  });
});

describe("montarPedido: o escopo acompanha o valor", () => {
  it("guarda pergunta, rótulo escolhido e acréscimo de cada resposta", () => {
    const p = montarPedido(["painel"], { painel: respostasPainel }, "", semPiloto);
    const item = p.itens[0];
    const origem = item.respostas.find((r) => r.perguntaId === "origem")!;
    expect(origem.escolhas).toEqual(["Vários arquivos soltos"]);
    expect(origem.acrescimo).toBe(2 * 50);
    const mult = item.respostas.find((r) => r.perguntaId === "responder")!;
    expect(mult.escolhas).toHaveLength(4);
    expect(mult.acrescimo).toBe(2 * 50);
    expect(item.respostas.find((r) => r.perguntaId === "negocio")!.acrescimo).toBe(0);
  });

  it("preço-base mais acréscimos bate com o valor do serviço", () => {
    const item = montarPedido(["painel"], { painel: respostasPainel }, "", semPiloto).itens[0];
    const soma = item.respostas.reduce((acc, r) => acc + r.acrescimo, 0);
    expect(item.precoBase! + soma).toBe(item.preco);
  });

  it("pergunta sem resposta fica registrada como vazia", () => {
    const item = montarPedido(["painel"], { painel: { negocio: "loja" } }, "", semPiloto).itens[0];
    expect(item.perguntasRespondidas).toBe(1);
    expect(item.respostas.filter((r) => r.escolhas.length === 0).length).toBe(item.perguntasTotal - 1);
  });

  it("sistema: ponto de partida de R$ 1.000, aproximado", () => {
    const item = montarPedido(["sistema"], {}, "", semPiloto).itens[0];
    expect(item.sobConsulta).toBe(false);
    expect(item.preco).toBe(1000);
    expect(item.precoBase).toBe(1000);
    expect(item.aproximado).toBe(true);
  });

  it("remover e readicionar preserva as respostas (elas vivem fora do carrinho)", () => {
    const respostas = { painel: respostasPainel };
    const com = montarPedido(["painel"], respostas, "", semPiloto);
    const sem = montarPedido([], respostas, "", semPiloto);
    const de_novo = montarPedido(["painel"], respostas, "", semPiloto);
    expect(sem.itens).toHaveLength(0);
    expect(de_novo.itens[0]).toEqual(com.itens[0]);
  });

  it("editar uma resposta depois de incluir muda o item e o total", () => {
    const antes = montarPedido(["planilha"], { planilha: {} }, "", semPiloto);
    const depois = montarPedido(["planilha"], { planilha: { existente: "bagunca" } }, "", semPiloto);
    expect(depois.carrinho.total).toBe(antes.carrinho.total + 50);
    expect(depois.itens[0].respostas.find((r) => r.perguntaId === "existente")!.escolhas).toEqual([
      "Sim, e precisa de arrumação grande",
    ]);
  });
});

describe("textoPedidoCompleto", () => {
  const pedido = montarPedido(
    ["planilha", "painel", "sistema"],
    { planilha: { negocio: "loja", existente: "bagunca" }, painel: respostasPainel },
    "Preciso para o mês que vem.",
    semPiloto,
  );
  const texto = limpo(textoPedidoCompleto(pedido));

  it("inclui nome, perguntas, escolhas, acréscimos, prazo e valor de cada serviço", () => {
    expect(texto).toContain("Planilha organizada");
    expect(texto).toContain("Você já tem uma planilha? Sim, e precisa de arrumação grande (+ R$ 50)");
    expect(texto).toContain("Que tipo de negócio é? Loja ou varejo");
    expect(texto).toContain("Vários arquivos soltos (+ R$ 100)");
    expect(texto).toContain("Preço-base: R$ 100");
    expect(texto).toContain("Prazo: estimado:");
  });

  it("marca pergunta sem resposta", () => {
    expect(texto).toContain("sem resposta");
  });

  it("inclui soma, desconto, total e observações", () => {
    expect(texto).toContain("Soma de tabela:");
    expect(texto).toContain(`Desconto (combo ${pedido.carrinho.desconto!.percentual}%)`);
    expect(texto).toContain("Total estimado:");
    expect(texto).toContain("Observações do cliente: Preciso para o mês que vem.");
  });

  it("não escreve observações quando vazias", () => {
    const t = textoPedidoCompleto(montarPedido(["planilha"], {}, "   ", semPiloto));
    expect(t).not.toContain("Observações");
  });

  it("mensalidade de bot aparece com o valor", () => {
    const t = limpo(textoPedidoCompleto(montarPedido(["bot-essencial"], {}, "", semPiloto)));
    expect(t).toMatch(/Mensalidade: R\$ \d+ por mês/);
  });
});

describe("canais de envio usam o mesmo pedido", () => {
  const pedido = montarPedido(["painel"], { painel: respostasPainel }, "Obs.", semPiloto);

  it("WhatsApp leva o mesmo texto completo e a origem", () => {
    const link = linkWhatsappPedido(pedido, "negocios-carrinho")!;
    expect(link.startsWith(`https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=`)).toBe(true);
    const msg = decodeURIComponent(link.split("text=")[1]);
    expect(msg).toContain("origem: negocios-carrinho");
    expect(msg).toContain(textoPedidoCompleto(pedido));
    expect(mensagemWhatsappPedido(pedido)).toContain("Vários arquivos soltos");
  });

  it("e-mail leva o mesmo texto em `mensagem`, com os campos de sempre", () => {
    const d = dadosEmailPedido(pedido, { nome: "Ana", whatsapp: "(61) 99999-0000" });
    expect(d.mensagem).toBe(textoPedidoCompleto(pedido));
    expect(d.nome).toBe("Ana");
    expect(d.contato).toBe("(61) 99999-0000");
    expect(d.preferencia).toBe("whatsapp");
    expect(d.assunto).toBe("Pedido: Painel básico");
    expect(d.pacote).toBe("Painel básico");
    expect(d.estimativa).toContain("R$");
  });

  it("pedido vazio: sem link de WhatsApp e sem mensagem", () => {
    const vazio = montarPedido([], {}, "", semPiloto);
    expect(linkWhatsappPedido(vazio)).toBeNull();
    expect(mensagemWhatsappPedido(vazio)).toBe("");
  });
});

describe("regras de preço seguem as de orcamento.ts", () => {
  it("combo de dois aplica o percentual vigente e o total do pedido é o do carrinho", () => {
    const p = montarPedido(["planilha", "painel"], {}, "", semPiloto);
    expect(p.carrinho.desconto?.tipo).toBe("combo");
    expect(p.carrinho.total).toBe(p.carrinho.somaTabela - p.carrinho.desconto!.valor);
  });

  it("piloto vence o combo quando abate mais reais", () => {
    const p = montarPedido(["planilha", "painel"], {}, "", { piloto: { percentual: 10, restam: 5 }, combo2: 5, combo3: 5 });
    expect(p.carrinho.desconto?.tipo).toBe("piloto");
  });

  it("bots não ganham prazo inventado", () => {
    const item = montarPedido(["bot-essencial"], {}, "", semPiloto).itens[0];
    expect(item.horas).toBeNull();
    expect(item.prazo).toMatch(/combinar/i);
  });
});

describe("aviso de estimativa (pergunta sem resposta)", () => {
  const todas = (id: string): Respostas =>
    Object.fromEntries(modelo(id).perguntas.map((p) => [p.id, p.tipo === "unica" ? p.opcoes[0].id : [p.opcoes[0].id]]));

  it("item sem respostas é estimativa; com tudo respondido, não", () => {
    const vazio = montarPedido(["planilha"], {}, "", semPiloto).itens[0];
    expect(vazio.estimativa).toBe(true);
    expect(vazio.perguntasSemResposta).toBe(vazio.perguntasTotal);
    const cheio = montarPedido(["planilha"], { planilha: todas("planilha") }, "", semPiloto).itens[0];
    expect(cheio.estimativa).toBe(false);
    expect(cheio.perguntasSemResposta).toBe(0);
  });

  it("estimativa é perguntasRespondidas < perguntasTotal, e o sistema sem respostas é estimativa", () => {
    for (const id of ["planilha", "painel", "bot-ia"]) {
      const i = montarPedido([id], { [id]: respostasPainel }, "", semPiloto).itens[0];
      expect(i.estimativa).toBe(i.perguntasRespondidas < i.perguntasTotal);
    }
    expect(montarPedido(["sistema"], {}, "", semPiloto).itens[0].estimativa).toBe(true);
  });

  it("o texto do WhatsApp e do e-mail marcam o item como estimativa", () => {
    const pedido = montarPedido(["planilha", "painel"], { painel: todas("painel") }, "", semPiloto);
    const whats = decodeURIComponent(linkWhatsappPedido(pedido)!.split("text=")[1]).replace(/\+/g, " ");
    const email = dadosEmailPedido(pedido, { nome: "Ana", whatsapp: "11999999999" }).mensagem;
    for (const t of [limpo(whats), limpo(email)]) {
      expect(t).toContain("Valor (estimativa):");
      expect(t).toMatch(/Estimativa: \d+ perguntas? sem resposta \(de \d+\)/);
      expect(t).toContain("Valores em estimativa (há pergunta sem resposta): Planilha organizada");
      expect(t).not.toContain("Painel básico, ");
    }
  });

  it("pedido todo respondido não traz aviso de estimativa", () => {
    const pedido = montarPedido(["painel"], { painel: todas("painel") }, "", semPiloto);
    const t = textoPedidoCompleto(pedido);
    expect(t).not.toContain("Valor (estimativa)");
    expect(t).not.toContain("Valores em estimativa");
    expect(t).toContain("Valor:");
  });
});

describe("linkEmailPedido: só com e-mail real em site.ts", () => {
  const p = montarPedido(["planilha"], {}, "", semPiloto);

  it("usa o endereço de site.email", () => {
    expect(linkEmailPedido(p)).toContain(`mailto:${site.email}?subject=`);
  });

  it("sem e-mail ou com placeholder, não há link", () => {
    for (const e of [null, "", "[SEU E-MAIL]", "[email@dominio.com]", "sem-arroba", "nome@exemplo.com", "a@b"]) {
      expect(emailReal(e), String(e)).toBe(false);
      expect(linkEmailPedido(p, "negocios-carrinho", e)).toBeNull();
    }
  });

  it("pedido vazio não gera link", () => {
    expect(linkEmailPedido(montarPedido([], {}, "", semPiloto))).toBeNull();
  });
});

describe("e-mail com os dados por serviço", () => {
  const contato = { nome: "Cliente de teste", whatsapp: "5500000000000" };

  it("um item: título, valor no formato do carrinho e uma linha por pergunta", () => {
    const pedido = montarPedido(["painel"], { painel: respostasPainel }, "", semPiloto);
    const d = dadosEmailPedido(pedido, contato);
    expect(d.itens).toHaveLength(1);
    const [item] = d.itens!;
    expect(item.titulo).toBe("Painel básico");
    const linhas = item.respostas.split("\n");
    expect(linhas).toHaveLength(modelo("painel").perguntas.length);
    expect(linhas).toContain("Que tipo de negócio é? Loja ou varejo");
    expect(item.respostas).toContain("Vários arquivos soltos");
    expect(item.valor.startsWith(resumoPrecoItem(pedido.itens[0]))).toBe(true);
    expect(d.assunto).toBe("Pedido: Painel básico");
    expect(d.total).toBe(totalCurto(pedido));
  });

  it("tudo respondido: o valor não leva '(estimativa)'", () => {
    const todas: Respostas = {};
    for (const p of modelo("painel").perguntas) todas[p.id] = p.tipo === "unica" ? p.opcoes[0].id : [p.opcoes[0].id];
    const pedido = montarPedido(["painel"], { painel: todas }, "", semPiloto);
    expect(pedido.itens[0].estimativa).toBe(false);
    const [item] = itensDoEmail(pedido);
    expect(item.valor).toBe(resumoPrecoItem(pedido.itens[0]));
    expect(item.respostas).not.toContain(NAO_RESPONDEU);
  });

  it("pergunta sem resposta: 'não respondeu' na linha e '(estimativa)' no valor", () => {
    const pedido = montarPedido(["painel"], { painel: { negocio: "loja" } }, "", semPiloto);
    const [item] = itensDoEmail(pedido);
    expect(item.valor.endsWith(" (estimativa)")).toBe(true);
    const linhas = item.respostas.split("\n");
    expect(linhas[0]).toBe("Que tipo de negócio é? Loja ou varejo");
    expect(linhas.filter((l) => l.endsWith(NAO_RESPONDEU))).toHaveLength(modelo("painel").perguntas.length - 1);
  });

  it("sistema sem respostas: a partir de R$ 1.000", () => {
    const [item] = itensDoEmail(montarPedido(["sistema"], {}, "", semPiloto));
    expect(limpo(item.valor)).toContain("a partir de R$ 1.000");
  });

  it("vários itens: um por serviço, na ordem do carrinho, e o assunto junta os nomes com ' + '", () => {
    const pedido = montarPedido(["planilha", "painel", "python"], { painel: respostasPainel }, "", semPiloto);
    const d = dadosEmailPedido(pedido, contato);
    expect(d.itens!.map((i) => i.titulo)).toEqual(pedido.itens.map((i) => i.nome));
    expect(d.itens).toHaveLength(3);
    expect(d.assunto).toBe(`Pedido: ${pedido.itens.map((i) => i.nome).join(" + ")}`);
    expect(d.total).toBe(totalCurto(pedido));
    expect(d.total).toContain("R$");
  });

  it("observação vazia vira '—'", () => {
    const d = dadosEmailPedido(montarPedido(["painel"], {}, "   ", semPiloto), contato);
    expect(d.observacoes).toBe("—");
  });

  it("observação com caracteres especiais vai como texto, sem escapar nem montar HTML", () => {
    const obs = `Entrega até 10/12 & "urgente" <b>já</b>\nSegunda linha: R$ 1.000,00 — ok? çãé {{nome}}`;
    const d = dadosEmailPedido(montarPedido(["painel"], {}, obs, semPiloto), contato);
    expect(d.observacoes).toBe(obs);
    for (const i of d.itens!) expect(`${i.titulo}${i.valor}${i.respostas}`).not.toMatch(/<[a-z/]/i);
  });

  it("mantém os campos de sempre, com `mensagem` montada (o envio a omite quando há itens)", () => {
    const pedido = montarPedido(["painel"], { painel: respostasPainel }, "Obs.", semPiloto);
    const d = dadosEmailPedido(pedido, contato);
    expect(d.mensagem).toBe(textoPedidoCompleto(pedido));
    expect(d.pacote).toBe("Painel básico");
    expect(d.origem).toBe("negocios-carrinho");
    expect(d.observacoes).toBe("Obs.");
  });
});
