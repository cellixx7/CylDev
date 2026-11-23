import { describe, expect, it } from "vitest";
import { assistente as t } from "../../../content/textos/assistente";
import { guias } from "../../../content/textos/assistenteGuias";
import { catalogo, fatos, mensalidadeBase, regrasGerais } from "./conhecimento";
import { numerosDoTexto, validarSaida } from "./guardrails";
import { conceitosDe, intencaoDe, tratamentoDe } from "./intencao";
import { boasVindas, conversaNova, processar, textoPlano, type Conversa, type Entrada, type Resposta } from "./motor";
import { chave } from "./normalizar";
import { atrasoMs, horaCurta, passoDigitacao, recortarBlocos, tamanhoDosBlocos } from "./ritmo";

// Assistente Cyl: guias, voz, gírias, mensagem vaga, estados e ritmo. Os testes de preço, prazo e orçamento continuam em
// assistente.test.ts.

function conversar(...mensagens: (string | Entrada)[]): { resposta: Resposta; conversa: Conversa; texto: string } {
  let conversa = conversaNova();
  let resposta!: Resposta;
  for (const m of mensagens) {
    const r = processar(typeof m === "string" ? { texto: m } : m, conversa);
    conversa = r.conversa;
    resposta = r.resposta;
  }
  return { resposta, conversa, texto: textoPlano(resposta) };
}

const rotulos = (r: Resposta) => r.chips.map((c) => c.rotulo);
const intencao = (texto: string) => intencaoDe(conceitosDe(texto));
const emojis = (texto: string) => texto.match(/\p{Extended_Pictographic}/gu) ?? [];

describe("gírias, abreviações e erros de digitação", () => {
  it("troca as gírias antes de comparar", () => {
    expect(chave("nn sei")).toBe("nao sei");
    expect(chave("tu sabe")).toBe("voce sabe");
    expect(chave("sisteminha")).toBe("sistema");
    expect(chave("salve botzão")).toBe("salve");
  });
  for (const [frase, esperado] of [
    ["qnto custa esse sisteminha", "preco"],
    ["vc faz planilhinha? qto fica", "preco"],
    ["pq demora tanto, qual o prazo", "prazo"],
    ["tu faz sitezinho pra minha loja? quero orçar", "orcar"],
    ["manda o zap de vcs", "contato"],
  ] as const) {
    it(`"${frase}" → ${esperado}`, () => expect(intencao(frase)).toBe(esperado));
  }
  it("botzão é o vocativo do chat, não um pedido de bot de Discord", () => {
    expect(intencao("e aí botzão")).not.toBe("bot");
    expect(intencao("quero um bot de discord")).toBe("bot");
  });
});

describe("mensagem vaga ou confusa: acolhe, nunca 'não encontrei'", () => {
  const frase = "salve salve botzão, me diz aí se tu sabe que prra que faz isso de sisteminha que nn da pra entedr nada idsos ae";

  it("a frase de teste: cumprimenta, explica sistema sob medida, dá exemplo e pergunta o negócio", () => {
    const { texto, resposta } = conversar(frase);
    expect(texto).toMatch(/^Opa, salve/);
    expect(texto).toContain("Um sistema sob medida é um programa feito para o jeito que o seu negócio funciona");
    expect(texto).toContain("Exemplo do dia a dia");
    expect(texto).toMatch(/tipo de negócio\?/);
    expect(texto.toLowerCase()).not.toContain("não encontrei");
    for (const chip of ["Ver exemplos", "Quanto custa?", "Montar orçamento"]) expect(rotulos(resposta)).toContain(chip);
    expect(resposta.estado).toBe("pensando");
  });
  it("linguagem simples: sem jargão técnico na explicação", () => {
    const { texto } = conversar(frase);
    for (const jargao of ["API", "backend", "banco de dados", "framework", "SaaS", "front-end"]) expect(texto).not.toContain(jargao);
  });
  it("os chips da explicação funcionam na mesma conversa: 'Quanto custa?' fala do sistema e 'Montar orçamento' começa o dele", () => {
    const a = conversar(frase);
    expect(a.conversa.ultimoServico).toBe("sistema");
    const preco = processar({ texto: "Quanto custa?" }, a.conversa);
    expect(textoPlano(preco.resposta)).toContain("Sistema sob medida");
    const orcar = processar({ texto: "Montar orçamento" }, a.conversa);
    expect(orcar.conversa.orc?.servicoId).toBe("sistema");
  });
  for (const vaga of ["asdf", "hm", "tipo assim sei lá", "vcs fazem q msm", "??", "ajuda aí mano"]) {
    it(`"${vaga}" não cai em 'não encontrei': acolhe e oferece opções clicáveis`, () => {
      const { texto, resposta } = conversar(vaga);
      expect(texto.toLowerCase()).not.toContain("não encontrei");
      expect(resposta.chips.length).toBeGreaterThanOrEqual(3);
      expect(texto.trim().endsWith("?") || resposta.chips.length > 0).toBe(true);
    });
  }
  it("'não entendi nada' sem contexto explica o que o Marcelo faz, em linguagem simples", () => {
    const { texto, resposta } = conversar("não entendi nada");
    expect(texto).toContain("transforma em algo fácil de usar");
    expect(rotulos(resposta)).toContain("Ver exemplos");
  });
  it("'o que é um painel?' explica o painel com exemplo do dia a dia", () => {
    const { texto } = conversar("o que é um painel?");
    expect(texto).toContain(guias.servicos.painel.simples);
    expect(texto).toContain(guias.servicos.painel.exemplo);
  });
});

describe("guias: resposta direta, explicação, dica e pergunta de continuação", () => {
  const assuntos: [string, string][] = [
    ["como funciona?", "comoFunciona"],
    ["o que preciso ter pronto?", "preparar"],
    ["como é o pagamento?", "pagamento"],
    ["como recebo o projeto?", "receber"],
    ["o Marcelo é confiável?", "confianca"],
    ["e depois da entrega?", "depois"],
    ["quanto custa o painel?", "preco"],
    ["qual o prazo da planilha?", "prazo"],
    ["tem desconto?", "desconto"],
    ["quais serviços vocês têm?", "servicos"],
    ["para quem é o serviço?", "publico"],
    ["tenho uma loja", "negocio"],
  ];
  for (const [pergunta] of assuntos) {
    it(`"${pergunta}" traz explicação, pergunta de continuação e opções`, () => {
      const { resposta, texto } = conversar(pergunta);
      expect(resposta.blocos.length).toBeGreaterThanOrEqual(3);
      expect(resposta.blocos[resposta.blocos.length - 1].tipo).toBe("pergunta");
      expect(texto.trim().endsWith("?")).toBe(true);
      expect(resposta.chips.length).toBeGreaterThan(0);
    });
  }

  it("como funciona segue os passos publicados: proposta, entrada, entrega por etapas, saldo", () => {
    const { texto } = conversar("como funciona?");
    for (const parte of ["Proposta por escrito", "Entrada por Pix", "Entrega por etapas", "antes de liberar os arquivos finais", "rodada de revisão"]) {
      expect(texto).toContain(parte);
    }
  });
  it("pagamento: Pix, metade e metade, e o comprovante conforme o prestador", () => {
    const { texto, resposta } = conversar("como pago?");
    expect(texto).toContain("Pix");
    expect(texto).toContain("metade na entrada e metade antes da entrega final");
    expect(texto).toMatch(/recibo|nota fiscal/);
    expect(resposta.acoes.some((a) => a.tipo === "link" && a.href === "/termos/#pagamento")).toBe(true);
  });
  it("confiança: fatos do Sobre, diferenciais e o portfólio para recrutadores em desenvolvimento", () => {
    const { texto } = conversar("posso confiar no Marcelo?");
    expect(texto).toContain("Marcelo Vaz Oliveira");
    expect(texto).toContain("Unieuro");
    expect(texto).toContain("qualidade técnica, entrega no prazo, valores justos com descontos generosos");
    expect(texto).toContain("portfólio para recrutadores está em desenvolvimento");
  });
  it("depois da entrega: revisão, garantia (dias vindos das perguntas frequentes), hora de ajuste e mensalidade dos bots", () => {
    const { texto } = conversar("e depois que entregar?");
    expect(texto).toContain("uma rodada de revisão já está incluída");
    expect(texto).toContain("90 dias");
    expect(texto).toContain(`${regrasGerais().horaExtra} por hora`);
    const m = mensalidadeBase()!;
    expect(texto).toContain(`${m.percentual} do preço de criação por mês`);
    expect(texto).toContain(m.mensal);
    expect(texto).toContain("sem multa");
  });
  it("o que preparar: identidade visual, planilhas, sistemas, organização e explicação do negócio", () => {
    const { texto } = conversar("o que eu preciso mandar?");
    for (const parte of ["identidade visual", "planilhas", "sistemas ou ferramentas", "como o trabalho acontece", "explicação do negócio"]) {
      expect(texto).toContain(parte);
    }
  });
  it("prazo cita o que o site promete e como um atraso é tratado, sem inventar", () => {
    const { texto } = conversar("qual o prazo da planilha? e se atrasar?");
    expect(texto).toContain("(pacote básico)");
    expect(texto).toContain("avisa antes da data");
  });
  it("por tipo de negócio sugere serviços do catálogo, com o preço de servicos.ts", () => {
    for (const [frase, id] of [
      ["tenho uma loja", "painel"],
      ["sou profissional liberal", "landing"],
      ["cuido de produtos e estoque", "painel"],
    ] as const) {
      const { texto } = conversar(frase);
      const s = catalogo().find((x) => x.id === id)!;
      expect(texto, frase).toContain(`${s.nome}: ${s.precoTexto}`);
    }
  });
});

describe("público: honestidade sobre empresas grandes", () => {
  it("diz que o serviço serve melhor a outro público, que o orçamento tende a ser maior e encaminha", () => {
    for (const frase of ["tenho uma empresa grande com ERP", "somos uma multinacional", "já tenho um SaaS"]) {
      const { texto, resposta } = conversar(frase);
      expect(texto, frase).toContain("pequenos negócios, profissionais liberais, comércio");
      expect(texto).toContain("o orçamento tende a ser maior");
      expect(texto).toContain("em até 2 horas, sem garantia.");
      expect(resposta.acoes.some((a) => a.tipo === "link" && a.href.startsWith("https://wa.me/"))).toBe(true);
    }
  });
  it("o guia de público cita os mesmos segmentos", () => {
    const { texto } = conversar("para quem é isso?");
    expect(texto).toContain("pequenos negócios, profissionais liberais, comércio e quem cuida de produtos e estoque");
  });
});

describe("cumprimento não repete a apresentação nem avisa de limite", () => {
  for (const [frase, esperado] of [["Bom dia", "Bom dia!"], ["boa tarde", "Boa tarde!"], ["boa noite!", "Boa noite!"], ["oi", "Oi!"]] as const) {
    it(`"${frase}" responde "${esperado}" e pergunta como ajudar`, () => {
      const { texto, resposta } = conversar(frase);
      expect(texto).toContain(esperado);
      expect(texto).toContain("Como posso ajudar?");
      expect(texto).not.toMatch(/só posso|só respondo|só falo|no site/i);
      expect(texto).not.toContain(t.boasVindas);
      expect(resposta.chips.length).toBeGreaterThan(2);
    });
  }
  it("a frase de limite só aparece quando a pergunta foge do assunto", () => {
    expect(conversar("me conta uma piada").texto).toContain("Só posso responder coisas relacionadas ao CylDev");
    expect(conversar("quanto custa o painel?").texto).not.toContain("Só posso responder");
  });
});

describe("limites", () => {
  it("nunca diz que é caro ou barato, nem que está abaixo do orçamento: fala em valor justo", () => {
    for (const frase of ["é caro?", "é barato?", "quanto custa um painel", "tem desconto?", "e o preço, tá bom?"]) {
      const { texto } = conversar(frase);
      expect(texto, frase).not.toMatch(/\b(é|está|ficou|fica|parece)\s+(muito\s+)?(caro|barato)\b/i);
      expect(texto, frase).not.toMatch(/abaixo d[oa]/i);
    }
    expect(conversar("é caro?").texto).toContain("valor justo");
  });
  it("assunto jurídico: sem opinião, e remete a Termos e Privacidade", () => {
    for (const frase of ["isso é legal? quais são os meus direitos?", "posso cancelar e pedir reembolso?", "o que a LGPD diz sobre meus dados?"]) {
      const { texto, resposta } = conversar(frase);
      expect(texto, frase).toContain("não posso dar opinião jurídica");
      const hrefs = resposta.acoes.map((a) => (a.tipo === "link" ? a.href : ""));
      expect(hrefs, frase).toContain("/termos/");
      expect(hrefs, frase).toContain("/privacidade/");
    }
  });
  it("pedido maior ou dúvida que o chat não sabe vai para o formulário ou o WhatsApp", () => {
    for (const frase of ["preciso de um aplicativo de celular", "vocês fazem o rack do meu servidor de e-mail corporativo?"]) {
      const { resposta } = conversar(frase);
      expect(resposta.acoes.some((a) => a.tipo === "link" && a.href === "#orcamento"), frase).toBe(true);
      expect(resposta.acoes.some((a) => a.tipo === "link" && a.href.startsWith("https://wa.me/")), frase).toBe(true);
    }
  });
  it("o tempo de resposta é escrito sem garantia", () => {
    expect(t.tempoResposta).toContain("costuma responder em até 2 horas");
    expect(t.tempoResposta).toContain("sem garantia");
    expect(conversar("como falo com o marcelo?").texto).toContain(t.tempoResposta);
  });
});

describe("voz: tratamento, sem gênero próprio e emojis com moderação", () => {
  it("reconhece o tratamento só quando a pessoa deixa claro (nunca pelo nome)", () => {
    expect(tratamentoDe("obrigada!")).toBe("a senhora");
    expect(tratamentoDe("sou dona de uma loja")).toBe("a senhora");
    expect(tratamentoDe("obrigado!")).toBe("o senhor");
    expect(tratamentoDe("sou dono de uma padaria")).toBe("o senhor");
    expect(tratamentoDe("meu nome é Maria")).toBeNull();
    expect(tratamentoDe("meu nome é João")).toBeNull();
    expect(tratamentoDe("como funciona?")).toBeNull();
  });
  it("sem saber o gênero, usa formas neutras (sem 'o senhor' nem 'a senhora')", () => {
    for (const frase of ["como funciona?", "o que preciso ter pronto", "para quem é?", "não entendi nada"]) {
      const { texto } = conversar(frase);
      expect(texto, frase).not.toMatch(/\b(o senhor|a senhora)\b/i);
    }
  });
  it("sabendo o gênero, trata por 'o senhor' ou 'a senhora' e mantém pelo resto da conversa", () => {
    const a = conversar("sou dona de uma loja, obrigada", "como funciona?");
    expect(a.conversa.tratamento).toBe("a senhora");
    expect(a.texto).toContain("a senhora");
    const b = conversar("sou dono de uma loja", "como funciona?");
    expect(b.texto).toContain("o senhor");
    expect(b.texto).not.toContain("a senhora");
    const c = conversar("sou dona de uma loja", "o que preciso ter pronto", "qual o prazo do painel");
    expect(c.conversa.tratamento).toBe("a senhora");
  });
  it("o assistente não se descreve no masculino nem no feminino", () => {
    const todos = [t.boasVindas, t.saudacao, t.obrigado, t.tchau, t.acolhe, JSON.stringify(guias), JSON.stringify(t)].join("\n");
    expect(todos).not.toMatch(/\b(sou (o|a|um|uma)\b|estou (feliz|certo|certa|pronto|pronta|animado|animada)\b|sincer[oa]\b|grat[oa]\b)/i);
    expect(t.nome).toBe("Assistente Cyl");
    expect(t.boasVindas).toContain("Assistente Cyl por aqui");
  });
  it("no máximo 1 ou 2 emojis por resposta", () => {
    const frases = [
      "oi", "como funciona?", "o que preciso ter pronto", "como é o pagamento?", "como recebo o projeto", "o Marcelo é confiável?",
      "e depois da entrega?", "quanto custa?", "qual o prazo?", "tem desconto?", "quais serviços?", "obrigada", "tenho uma loja",
      "não entendi nada", "salve botzão, o que é sisteminha?", "asdf", "me conta uma piada", "para quem é?", "ver exemplos",
    ];
    for (const f of frases) expect(emojis(conversar(f).texto).length, f).toBeLessThanOrEqual(2);
    expect(emojis(textoPlano(boasVindas())).length).toBeLessThanOrEqual(2);
  });
});

describe("números: nada de preço, prazo ou desconto escrito à mão", () => {
  const frases = [
    "oi", "como funciona?", "o que preciso ter pronto", "como é o pagamento?", "como recebo o projeto", "o Marcelo é confiável?",
    "e depois da entrega?", "quanto custa?", "quanto custa o sistema?", "qual o prazo?", "qual o prazo do sistema?", "tem desconto?",
    "quais serviços?", "para quem é?", "tenho uma loja", "ver exemplos", "não entendi nada", "salve botzão, o que é sisteminha?", "asdf",
    "empresa grande com erp", "como falo com o marcelo?", "posso cancelar?", "o que acontece com meus dados?", "tem nota fiscal?",
    "qual o prazo e se atrasar?", "bot de discord",
  ];
  it("todo número que o assistente fala existe nos fatos do site (servicos.ts, orcamento.ts, perguntas frequentes)", () => {
    const permitidos = fatos();
    for (const f of frases) {
      const { texto } = conversar(f);
      const v = validarSaida(texto, permitidos);
      expect(v.estranhos, `${f} -> ${texto}`).toEqual([]);
    }
  });
  it("os guias não trazem número escrito à mão, fora o que vem das regras e das perguntas frequentes", () => {
    // Os textos fixos dos guias não têm dígito: preço, prazo, percentual e dias chegam por parâmetro.
    const fixos = JSON.stringify(guias, (_k, v) => (typeof v === "function" ? undefined : v));
    expect(numerosDoTexto(fixos)).toEqual([]);
  });
  it("o validador ainda barra número inventado", () => {
    expect(validarSaida("O painel custa R$ 77", fatos()).ok).toBe(false);
  });
});

describe("estados e ritmo", () => {
  const estado = (f: string) => conversar(f).resposta.estado;
  it("cada tipo de resposta escolhe o indicador certo", () => {
    expect(estado("oi")).toBe("digitando");
    expect(estado("obrigada")).toBe("digitando");
    expect(estado("quanto custa o painel")).toBe("pesquisando");
    expect(estado("como é o pagamento?")).toBe("pesquisando");
    expect(estado("quero um orçamento de planilha")).toBe("montando");
    expect(estado("não entendi nada")).toBe("pensando");
    expect(estado("asdf")).toBe("pensando");
  });
  it("durante o orçamento todo passo é 'montando'", () => {
    const a = conversar("orçar planilha");
    expect(a.resposta.estado).toBe("montando");
    const b = processar(a.resposta.chips[0].entrada, a.conversa);
    expect(b.resposta.estado).toBe("montando");
  });
  it("os rótulos são os pedidos", () => {
    expect(t.estados).toEqual({ digitando: "Digitando…", pensando: "Pensando…", pesquisando: "Pesquisando…", montando: "Montando seu orçamento…" });
  });
  it("a espera fica entre 2 e 5 segundos e cresce com o tamanho da resposta", () => {
    const curto = atrasoMs("digitando", 40);
    const longo = atrasoMs("digitando", 600);
    expect(curto).toBeGreaterThanOrEqual(2000);
    expect(longo).toBeGreaterThan(curto);
    expect(atrasoMs("pensando", 99999)).toBe(5000);
  });
  it("com movimento reduzido há só um respiro curto", () => {
    expect(atrasoMs("pesquisando", 5000, true)).toBeLessThan(400);
  });
  it("o efeito de digitação mostra o começo da resposta e preserva a forma dos blocos", () => {
    const { resposta } = conversar("como funciona?");
    const total = tamanhoDosBlocos(resposta.blocos);
    expect(total).toBeGreaterThan(300);
    expect(recortarBlocos(resposta.blocos, 0)).toEqual([]);
    expect(tamanhoDosBlocos(recortarBlocos(resposta.blocos, 50))).toBe(50);
    expect(recortarBlocos(resposta.blocos, total)).toEqual(resposta.blocos);
    // A digitação inteira termina em poucos passos.
    expect(Math.ceil(total / passoDigitacao(total))).toBeLessThanOrEqual(80);
  });
  it("a hora do balão vem em hh:mm", () => {
    expect(horaCurta(new Date(2026, 10, 19, 9, 5))).toMatch(/^09:05$/);
  });
});

describe("todo chip leva a uma resposta útil", () => {
  it("percorre os chips de 3 níveis a partir das boas-vindas sem cair em recusa nem em acolhimento", () => {
    const vistos = new Set<string>();
    const visitar = (r: Resposta, conversa: Conversa, nivel: number) => {
      if (nivel === 0) return;
      for (const chip of r.chips) {
        const chaveChip = `${nivel}|${chip.rotulo}`;
        if (vistos.has(chaveChip) && nivel < 3) continue;
        vistos.add(chaveChip);
        const out = processar(chip.entrada, conversa);
        const texto = textoPlano(out.resposta);
        expect(texto.length, chip.rotulo).toBeGreaterThan(20);
        expect(texto, chip.rotulo).not.toContain(t.acolhe);
        expect(texto, chip.rotulo).not.toContain(t.semBase);
        expect(texto, chip.rotulo).not.toContain(t.fora);
        visitar(out.resposta, out.conversa, nivel - 1);
      }
    };
    visitar(boasVindas(), conversaNova(), 3);
    expect(vistos.size).toBeGreaterThan(15);
  });
});
