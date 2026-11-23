import { describe, expect, it } from "vitest";
import { assistente as t } from "../../../content/textos/assistente";
import { categorias, saber, topicoPorId, topicos } from "../../../content/textos/assistenteSaber";
import { guias } from "../../../content/textos/assistenteGuias";
import { catalogo, faqPorTitulo, fatos } from "./conhecimento";
import { validarSaida } from "./guardrails";
import { conversaNova, processar, textoPlano, type Conversa, type Entrada, type Resposta } from "./motor";

// Saber geral do Assistente Cyl (Excel, planilhas, automação, sites, jeito de trabalhar) e a memória curta da conversa:
// "sim", "explica melhor", "me dá um exemplo", "e o painel?". Os testes de preço, prazo e orçamento seguem em assistente.test.ts.

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
const emojis = (texto: string) => texto.match(/\p{Extended_Pictographic}/gu) ?? [];
const textoDoTopico = (id: string) => {
  const tp = topicoPorId(id)!;
  return [...tp.direta, ...tp.explica, ...(tp.passos ?? []), ...(tp.aprofundar ?? []), tp.dica ?? "", tp.exemplo ?? ""].join("\n");
};

describe("base de tópicos: integridade", () => {
  it("tem ids únicos, categoria válida e gatilhos", () => {
    const ids = topicos.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    const cats = new Set(categorias.map((c) => c.id));
    for (const x of topicos) {
      expect(cats.has(x.categoria), x.id).toBe(true);
      expect(x.frases.length, x.id).toBeGreaterThan(2);
      expect(x.direta.length, x.id).toBeGreaterThan(0);
    }
    for (const c of categorias) expect(topicos.some((x) => x.categoria === c.id), c.id).toBe(true);
  });
  it("cobre bastante assunto (Excel, dados, painéis, automação, sites, sistemas e jeito de trabalhar)", () => {
    expect(topicos.length).toBeGreaterThanOrEqual(50);
  });
  it("relacionados, serviços e perguntas frequentes citados existem", () => {
    const servicos = new Set(catalogo().map((s) => s.id));
    for (const x of topicos) {
      for (const r of x.relacionados ?? []) expect(topicoPorId(r), `${x.id} → ${r}`).toBeTruthy();
      for (const s of [x.servico, ...(x.servicosChips ?? [])]) if (s) expect(servicos.has(s), `${x.id} → ${s}`).toBe(true);
      for (const f of x.faqTitulo ?? []) expect(faqPorTitulo(f), `${x.id} → ${f}`).toBeTruthy();
    }
  });
  it("não escreve preço, prazo nem desconto à mão (isso só sai de servicos.ts e orcamento.ts)", () => {
    for (const x of topicos) {
      const texto = [...x.direta, ...x.explica, ...(x.passos ?? []), ...(x.aprofundar ?? []), x.dica ?? "", x.exemplo ?? ""].join("\n");
      expect(texto, x.id).not.toMatch(/R\$|%/);
      expect(texto, x.id).not.toMatch(/\d+\s*(dias|horas|minutos|reais|mil)\b/i);
      expect(texto.toLowerCase(), x.id).not.toMatch(/\b(garantimos|garantido|garanto)\b(?!.*(não|nenhum|ninguém))/);
    }
  });
  it("nunca chama o valor de caro ou barato", () => {
    for (const x of topicos) expect(textoDoTopico(x.id), x.id).not.toMatch(/\b(é|está|fica) (muito )?(caro|barato)\b/i);
  });
});

describe("cada gatilho leva ao seu tópico", () => {
  for (const x of topicos) {
    it(`${x.id}`, () => {
      for (const frase of x.frases) {
        const { conversa } = conversar(frase);
        // Um tópico mais específico (frase mais longa) pode legitimamente vencer outro: aceitamos só o próprio tópico aqui,
        // então frase ambígua entre dois tópicos precisa ser reescrita.
        expect(conversa.ultimoTopico, `"${frase}"`).toBe(x.id);
      }
    });
  }
});

describe("respostas dos tópicos", () => {
  it("seguem a forma: direta, explicação, ponte para o serviço com preço de partida e pergunta no fim", () => {
    const { resposta, texto } = conversar("como uso o procv?");
    expect(resposta.blocos[0].tipo).toBe("p");
    expect(resposta.blocos.at(-1)?.tipo).toBe("pergunta");
    expect(resposta.blocos.some((b) => b.tipo === "dica")).toBe(true);
    const planilha = catalogo().find((s) => s.id === "planilha")!;
    expect(texto).toContain(`${planilha.nome} (${planilha.precoTexto})`);
  });
  it("todo número do que o assistente diz existe nos fatos do site", () => {
    const permitidos = fatos();
    for (const x of topicos) {
      for (const turnos of [0, 1, 2]) {
        const msgs: string[] = Array(turnos).fill("oi");
        const { texto } = conversar(...msgs, x.frases[0]);
        const v = validarSaida(texto, permitidos);
        expect(v.estranhos, `${x.id} (turno ${turnos})`).toEqual([]);
      }
    }
  });
  it("usa no máximo 2 emojis por resposta e nenhum botão ou ação vazio", () => {
    for (const x of topicos) {
      const { resposta, texto } = conversar(x.frases[0]);
      expect(emojis(texto).length, x.id).toBeLessThanOrEqual(2);
      expect(resposta.chips.length, x.id).toBeLessThanOrEqual(6);
      for (const c of resposta.chips) expect(c.rotulo.trim(), x.id).not.toBe("");
    }
  });
  it("todo botão de um tópico leva a uma resposta útil (nunca ao 'fora' ou ao 'não sei')", () => {
    for (const x of topicos) {
      const { resposta, conversa } = conversar({ cmd: { t: "topico", id: x.id } });
      for (const chip of resposta.chips) {
        const r = processar(chip.entrada, conversa);
        const texto = textoPlano(r.resposta);
        expect(texto.length, `${x.id} → ${chip.rotulo}`).toBeGreaterThan(20);
        expect(texto, `${x.id} → ${chip.rotulo}`).not.toContain(t.fora);
        expect(texto, `${x.id} → ${chip.rotulo}`).not.toContain(t.semBase);
      }
    }
  });
  it("o menu de assuntos e cada categoria listam os tópicos", () => {
    const menu = conversar("quais assuntos você sabe?");
    expect(menu.resposta.chips.map((c) => c.rotulo)).toEqual(expect.arrayContaining(categorias.map((c) => c.rotulo)));
    for (const c of categorias) {
      const { resposta } = conversar({ cmd: { t: "categoria", id: c.id } });
      const esperados = topicos.filter((x) => x.categoria === c.id).map((x) => x.rotulo);
      expect(resposta.chips.map((x) => x.rotulo)).toEqual(expect.arrayContaining(esperados));
    }
  });
});

describe("linguagem do dia a dia: sinônimos, gírias e erros de digitação", () => {
  for (const [frase, id] of [
    ["como faço um procv", "procv"],
    ["tem como puxar dado de outra aba?", "procv"],
    ["vc sabe fazer tabela dinamica?", "tabela-dinamica"],
    ["tabela dinamca no exel", "tabela-dinamica"],
    ["qual grafico eu uso pra mostrar vendas por mes", "qual-grafico"],
    ["minha planilha ta uma bagunça", "planilha-organizada"],
    ["apareceu #N/D na formula", "erros-excel"],
    ["como junto várias planilhas numa só?", "juntar-planilhas"],
    ["dá pra tirar dados de pdf?", "ler-pdf"],
    ["pra que serve python", "python-para-que"],
    ["preciso de site ou so instagram", "landing-page"],
    ["o que é dominio e hospedagem", "dominio-hospedagem"],
    ["vcs garantem primeiro lugar no google?", "seo-basico"],
    ["tem mensalidade?", "mensalidade"],
    ["to com pouco dinheiro, dá pra começar pequeno?", "orcamento-apertado"],
    ["vocês atendem em outra cidade?", "atendimento-online"],
    ["qual o horário de atendimento", "horario-resposta"],
    ["precisa assinar contrato?", "proposta-escrita"],
    ["vocês fazem aplicativo de celular?", "fora-do-catalogo"],
    ["vcs fazem bot de whatsapp", "whatsapp-bot"],
    ["oi, vc é uma ia?", "assistente-sobre"],
    ["voce é humano?", "assistente-sobre"],
    ["voceee guarda minha conversa?", "assistente-sobre"],
  ] as const) {
    it(`"${frase}" → ${id}`, () => expect(conversar(frase).conversa.ultimoTopico).toBe(id));
  }
  it("letra esticada e pontuação não atrapalham", () => {
    expect(conversar("qual o preeeeço??").texto).toContain("R$");
  });
});

describe("honestidade sobre o que o assistente é", () => {
  it("diz que é um assistente de regras, e não uma IA generativa, e que a conversa não é guardada", () => {
    for (const frase of ["você é uma ia?", "estou falando com um robô?", "você é o chatgpt?"]) {
      const { texto } = conversar(frase);
      expect(texto, frase).toMatch(/assistente de regras|programa de regras/);
      expect(texto, frase).toMatch(/não sou (uma )?(pessoa|inteligência|ia)|e não uma inteligência artificial/i);
      expect(texto, frase).toContain("fica só na memória desta aba");
    }
  });
  it("não escreve código nem resolve exercício, e diz por quê, sem recusa seca", () => {
    for (const frase of ["escreva um código em python que leia um csv", "me faz uma macro pra mim", "resolva este exercício de excel"]) {
      const { texto, resposta } = conversar(frase);
      expect(texto, frase).toContain(saber.pedeCodigo);
      expect(resposta.chips.length, frase).toBeGreaterThan(0);
    }
  });
  it("dúvida técnica sem tópico pronto é franca e não chuta", () => {
    const { texto, resposta } = conversar("como faço o excel abrir sozinho toda manhã?");
    expect(texto).toContain(saber.semTopico);
    expect(texto).toContain(t.tempoResposta);
    expect(resposta.acoes.some((a) => a.tipo === "link" && a.href.startsWith("https://wa.me/"))).toBe(true);
  });
  it("não promete o que o negócio não cumpre", () => {
    const { texto } = conversar("vocês garantem resposta em uma hora?");
    expect(texto.toLowerCase()).not.toMatch(/garantimos|garantido|em até 1 hora/);
  });
  it("robô de WhatsApp é dito como fora do catálogo", () => {
    const { texto } = conversar("vocês fazem robô de atendimento no whatsapp?");
    expect(texto).toContain("não está entre os serviços do catálogo");
  });
});

describe("dúvida sobre a capacidade do Marcelo (caso real do teste do Marcelo)", () => {
  for (const frase of ["Entendi, mas eu quria tentr entendr se o Marcelo é bom pra isso", "Não eu queria por aqui mesmo, o que ele ja fez?", "ele tem experiência com isso?", "quais projetos o marcelo já fez"]) {
    it(`"${frase}" abre o guia de confiança, sem 'não sei' nem só o WhatsApp`, () => {
      const { texto } = conversar(frase);
      expect(texto, frase).not.toContain(t.semBase);
      expect(texto, frase).toContain(guias.confianca.formacao);
    });
  }
});

describe("memória curta da conversa", () => {
  it("'sim' depois de uma oferta executa a oferta", () => {
    const { texto, resposta } = conversar("quanto custa a planilha?", "sim");
    expect(texto).toMatch(/Vamos montar a estimativa de Planilha organizada/);
    expect(resposta.chips.some((c) => c.rotulo === t.chips.cancelar)).toBe(true);
  });
  it("'pode ser', 'bora' e 'quero ver' também valem como sim", () => {
    for (const sim of ["pode ser", "bora", "quero ver", "claro!", "com certeza", "sim, por favor"]) {
      const { texto } = conversar("quanto custa a planilha?", sim);
      expect(texto, sim).toMatch(/Vamos montar a estimativa/);
    }
  });
  it("'agora não' dispensa com simpatia e não executa nada", () => {
    for (const nao of ["agora não", "não, obrigado", "depois eu vejo", "não quero"]) {
      const { texto, conversa } = conversar("quanto custa a planilha?", nao);
      expect(saber.recusaSimpatica.some((x) => texto.includes(x)), nao).toBe(true);
      expect(conversa.orc, nao).toBeNull();
      expect(conversa.proposta, nao).toBeNull();
    }
  });
  it("'sim' sem nada pendente pede o rumo, e 'ok' só fecha o assunto", () => {
    expect(conversar("sim").texto).toContain(saber.simSemProposta);
    expect(conversar("ok").texto).toContain(saber.confirmaNeutra[0]);
  });
  it("'sim' no meio de uma frase longa não vira um sim", () => {
    const { texto } = conversar("quanto custa a planilha?", "sim, mas antes me explica como funciona o pagamento");
    expect(texto).toMatch(/Pix/);
  });
  it("a oferta vale só para a mensagem seguinte", () => {
    const { texto } = conversar("quanto custa a planilha?", "como funciona o pagamento?", "sim");
    expect(texto).not.toMatch(/Vamos montar a estimativa/);
    expect(texto).toMatch(/entrega|receber|Combinado/i);
  });
  it("'explica melhor' aprofunda o último tópico", () => {
    const { texto } = conversar("como uso o procv?", "explica melhor");
    expect(texto).toContain(topicoPorId("procv")!.aprofundar![0]);
  });
  it("'não entendi' depois de um tópico aprofunda em vez de recomeçar", () => {
    const { texto } = conversar("o que é tabela dinâmica?", "não entendi");
    expect(texto).toContain(topicoPorId("tabela-dinamica")!.aprofundar![0]);
  });
  it("'me dá um exemplo' traz o exemplo do último tópico", () => {
    const { texto } = conversar("o que é macro?", "me dá um exemplo");
    expect(texto).toContain(topicoPorId("macro-vba")!.exemplo!);
  });
  it("sem tópico anterior, 'exemplo' segue o caminho de antes (exemplos dos serviços)", () => {
    expect(conversar("me dá um exemplo").texto).toContain("exemplos do dia a dia de cada serviço");
  });
  it("'e o painel?' repete a pergunta anterior com o serviço novo", () => {
    const planilha = catalogo().find((s) => s.id === "planilha")!;
    const painel = catalogo().find((s) => s.id === "painel")!;
    const preco = conversar("quanto custa a planilha?", "e o painel?").texto;
    expect(preco).toContain(`${painel.nome}: ${painel.precoTexto}`);
    expect(preco).not.toContain(planilha.nome);
    const prazo = conversar("qual o prazo da planilha?", "e do painel?").texto;
    expect(prazo).toContain(painel.nome);
    expect(prazo).toMatch(/prazo|dia/i);
  });
  it("lembra o serviço do tópico: 'e quanto custa?' depois de uma dica de planilha", () => {
    const { texto } = conversar("como organizar a planilha?", "e quanto custa?");
    expect(texto).toContain("Planilha organizada");
  });
  it("o turno avança a cada resposta e a conversa nova começa do zero", () => {
    expect(conversar("oi", "oi").conversa.turno).toBe(2);
    expect(conversaNova().turno).toBe(0);
  });
  it("orçamento em andamento não é atropelado por 'sim' nem por um tópico: o assistente responde e retoma a pergunta", () => {
    const { texto, conversa } = conversar("quero orçar uma planilha", "como uso o procv?");
    expect(texto).toMatch(/PROCV/);
    expect(texto).toContain(t.orcarRetomar);
    expect(conversa.orc).not.toBeNull();
  });
});

describe("respostas variadas e naturais", () => {
  it("a mesma pergunta em turnos diferentes não repete as mesmas palavras", () => {
    const a = conversar("o que é tabela dinâmica?").texto;
    const b = conversar("oi", "o que é tabela dinâmica?").texto;
    expect(a).not.toBe(b);
  });
  it("agradecimento e despedida alternam a versão", () => {
    const um = conversar("obrigado").texto;
    const dois = conversar("oi", "obrigado").texto;
    expect(um).not.toBe(dois);
    expect(conversar("tchau").texto).not.toBe(conversar("oi", "tchau").texto);
  });
  it("a primeira resposta mantém o texto de sempre (turno zero)", () => {
    expect(conversar("obrigado").texto).toContain(t.obrigado);
  });
});

describe("integração com o orçamento", () => {
  it("tópico de serviço oferece orçar e ver detalhes, com o botão que abre a conversa de orçamento", () => {
    const { resposta, conversa } = conversar("como organizar planilha bagunçada?");
    const orcar = resposta.chips.find((c) => c.rotulo.startsWith("Orçar"));
    expect(orcar).toBeTruthy();
    const r = processar(orcar!.entrada, conversa);
    expect(r.conversa.orc).not.toBeNull();
  });
  it("tópico sem serviço próprio não inventa ponte", () => {
    const { texto } = conversar("vocês atendem em outra cidade?");
    expect(texto).not.toContain("o serviço que mais se encaixa");
  });
  it("pedido que o catálogo não cobre vai para o formulário ou o WhatsApp, sem número", () => {
    const { resposta, texto } = conversar("preciso de uma loja virtual completa");
    expect(resposta.acoes.some((a) => a.tipo === "link" && a.href === "#orcamento")).toBe(true);
    expect(texto).not.toMatch(/R\$/);
  });
});
