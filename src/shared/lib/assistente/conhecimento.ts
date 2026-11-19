import { COMBO_2, COMBO_3, mensalidadeBots, VALOR_HORA_EXTRA } from "../../../content/orcamento";
import { servicosDoCatalogo } from "../../../content/perguntas";
import { servicoPorId } from "../../../content/servicos";
import { site } from "../../../content/site";
import { assistente as t } from "../../../content/textos/assistente";
import { perguntasFrequentes } from "../../../content/textos/perguntasFrequentes";
import { guias } from "../../../content/textos/assistenteGuias";
import { brl } from "../formato";
import { calcularServico, descontoPilotoAtual, mensalidadeDe, textoPrecoItem, type CalculoServico } from "../orcamento";
import { linkContato } from "../whatsapp";
import { partesDoTexto, textoSemLinks } from "../texto-rico";
import { radicaisUteis } from "./normalizar";

// Base de conhecimento do assistente: SÓ o que já está no site (servicos.ts, orcamento.ts, perguntas frequentes, site.ts).
// Nada é escrito à mão aqui. Quem responde (motor.ts) e quem valida (guardrails.ts) leem desta mesma fonte.

export type InfoServico = {
  id: string;
  nome: string;
  resultado: string;
  inclui: string[];
  nota?: string;
  combinavel: boolean;
  /** Cálculo do pacote básico (sem respostas). */
  calculo: CalculoServico;
  /** "R$ 100", "a partir de R$ 300"... */
  precoTexto: string;
  /** "estimado: 2 dias úteis" ou "prazo a combinar". */
  prazoTexto: string;
  /** Bots com horas provisórias, sistema: o prazo não é calculado. */
  prazoACombinar: boolean;
};

/** Serviços de Negócios (o catálogo do site), com preço e prazo já calculados. */
export function catalogo(): InfoServico[] {
  const lista: InfoServico[] = [];
  for (const m of servicosDoCatalogo) {
    const s = servicoPorId(m.id);
    const calculo = calcularServico(m.id);
    if (!s || !calculo || !s.disponivel) continue;
    lista.push({
      id: m.id,
      nome: s.nome,
      resultado: s.resultado,
      inclui: s.inclui,
      nota: s.nota,
      combinavel: m.combinavel,
      calculo,
      precoTexto: textoPrecoItem(calculo),
      prazoTexto: calculo.prazo,
      prazoACombinar: calculo.dias === null,
    });
  }
  return lista;
}

export const servicoDoCatalogo = (id: string): InfoServico | undefined => catalogo().find((s) => s.id === id);

// Perguntas frequentes -------------------------------------------------------------------------------------------------

export type Faq = {
  id: string;
  pergunta: string;
  /** Parágrafos sem a marcação de link. */
  paragrafos: string[];
  links: { rotulo: string; href: string }[];
  /** Radicais da pergunta e da resposta, para a busca por assunto. */
  radicaisPergunta: string[];
  radicaisResposta: string[];
};

let faqsCache: Faq[] | null = null;

export function faqs(): Faq[] {
  if (faqsCache) return faqsCache;
  faqsCache = perguntasFrequentes.secoes.flatMap((secao) =>
    (secao.blocos ?? []).map((b, i) => {
      const links = b.texto.flatMap((t) => partesDoTexto(t).filter((p) => p.href).map((p) => ({ rotulo: p.texto, href: p.href! })));
      return {
        id: `${secao.id}-${i}`,
        pergunta: b.titulo,
        paragrafos: b.texto.map(textoSemLinks),
        links,
        radicaisPergunta: radicaisUteis(b.titulo),
        radicaisResposta: radicaisUteis(b.texto.map(textoSemLinks).join(" ")),
      };
    }),
  );
  return faqsCache;
}

/**
 * Procura a pergunta frequente que mais combina com o assunto. Exige dois radicais em comum (ou um da pergunta com 6+ letras).
 * `minimo` baixa a exigência: o chat usa 2 quando a mensagem é vaga e vale arriscar um palpite.
 */
export function buscarFaq(texto: string, minimo = 4): Faq | null {
  const r = new Set(radicaisUteis(texto));
  if (r.size === 0) return null;
  let melhor: Faq | null = null;
  let pontos = 0;
  for (const f of faqs()) {
    let p = 0;
    for (const x of f.radicaisPergunta) if (r.has(x)) p += x.length >= 6 ? 3 : 2;
    for (const x of f.radicaisResposta) if (r.has(x)) p += 1;
    if (p > pontos) {
      melhor = f;
      pontos = p;
    }
  }
  return pontos >= minimo ? melhor : null;
}

/** Pergunta frequente pelo começo do título (ex.: "Como é o pagamento"). Casa sem acento e sem diferença de caixa. */
export function faqPorTitulo(inicio: string): Faq | null {
  const alvo = inicio.toLowerCase();
  return faqs().find((f) => f.pergunta.toLowerCase().startsWith(alvo)) ?? null;
}

// Regras gerais ------------------------------------------------------------------------------------------------------------

export function regrasGerais() {
  const piloto = descontoPilotoAtual();
  return {
    horaExtra: brl(VALOR_HORA_EXTRA),
    combo2: `${COMBO_2}%`,
    combo3: `${COMBO_3}%`,
    combinaveis: catalogo().filter((s) => s.combinavel).map((s) => s.nome),
    piloto: piloto ? { percentual: `${piloto.percentual}%`, restam: piloto.restam } : null,
  };
}

/**
 * Mensalidade-base de um bot, para mostrar um exemplo de valor: a fração do preço de criação (orcamento.ts) aplicada ao bot
 * mais simples da Comunidade. Hospedagem fica de fora (é cobrada à parte).
 */
export function mensalidadeBase() {
  const bot = servicoPorId("bot-essencial");
  const calculo = bot ? calcularServico(bot.id) : null;
  if (!bot || !calculo || calculo.preco === null) return null;
  return {
    percentual: `${Math.round(mensalidadeBots.fracaoDaCriacao * 100)}%`,
    nome: bot.nome,
    criacao: brl(calculo.preco),
    mensal: brl(mensalidadeDe(calculo.preco)),
  };
}

export function contatos() {
  return {
    whatsappLink: linkContato("negocios-assistente"),
    email: site.email,
    emailLink: `mailto:${site.email}`,
  };
}

// Fatos (para o validador de saída) --------------------------------------------------------------------------------------------

/**
 * Todo texto que o assistente pode citar com número: o que um modelo de linguagem receberá e o que o validador usa
 * para barrar valor inventado. Inclui os cálculos de cada serviço e as perguntas frequentes.
 */
export function fatos(): string[] {
  const lista: string[] = [];
  for (const s of catalogo()) {
    lista.push(`${s.nome}: ${s.precoTexto}; ${s.prazoTexto}.`);
    lista.push(s.resultado, ...s.inclui);
    if (s.nota) lista.push(s.nota);
  }
  const g = regrasGerais();
  lista.push(`Hora extra: ${g.horaExtra}.`, `Combo: ${g.combo2} com 2, ${g.combo3} com 3 ou mais.`);
  if (g.piloto) lista.push(`Piloto: ${g.piloto.percentual}, restam ${g.piloto.restam}.`);
  for (const f of faqs()) lista.push(f.pergunta, ...f.paragrafos);
  // Textos fixos do assistente que citam número (tempo de resposta) e a mensalidade-base dos bots.
  lista.push(t.tempoResposta);
  if (site.prestador.documento) lista.push(`${site.prestador.documento.tipo} ${site.prestador.documento.numero}`);
  const m = mensalidadeBase();
  if (m) lista.push(guias.depois.bots(m.percentual, m.nome, m.criacao, m.mensal));
  return lista;
}
