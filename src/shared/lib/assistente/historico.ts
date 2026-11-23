import { conversaNova, textoPlano, type Conversa, type Resposta } from "./motor";

// Memória do chat no navegador (localStorage, só neste aparelho; nada vai para a rede). Guarda a conversa em andamento
// (volta igual depois de recarregar ou de fechar só o painel) e as conversas anteriores, que só somem quando a pessoa
// limpa os dados do site. Tudo aqui é lógica pura e testada; a leitura e a escrita no storage ficam nas duas últimas
// funções, sempre em try/catch (o storage pode estar bloqueado ou cheio).

export type Mensagem = { id: number; autor: "eu" | "bot"; hora: string; texto?: string; resposta?: Resposta };

export type Sessao = {
  id: string;
  iniciadaEm: number;
  atualizadaEm: number;
  conversa: Conversa;
  mensagens: Mensagem[];
};

export type Historico = { v: 1; atual: Sessao | null; anteriores: Sessao[] };

export const CHAVE_HISTORICO = "assistente-cyl";
/** Quantas conversas anteriores ficam guardadas (a mais antiga sai primeiro). */
export const MAX_ANTERIORES = 30;
/** Teto de mensagens por conversa, para não encher o armazenamento. */
export const MAX_MENSAGENS = 200;

export const historicoVazio = (): Historico => ({ v: 1, atual: null, anteriores: [] });

const ehObjeto = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);

function mensagemValida(m: unknown): m is Mensagem {
  if (!ehObjeto(m)) return false;
  if (typeof m.id !== "number" || (m.autor !== "eu" && m.autor !== "bot") || typeof m.hora !== "string") return false;
  if (m.texto !== undefined && typeof m.texto !== "string") return false;
  if (m.resposta !== undefined) {
    if (!ehObjeto(m.resposta) || !Array.isArray(m.resposta.blocos) || !Array.isArray(m.resposta.chips) || !Array.isArray(m.resposta.acoes)) return false;
  }
  return m.texto !== undefined || m.resposta !== undefined;
}

function sessaoValida(s: unknown): Sessao | null {
  if (!ehObjeto(s) || typeof s.id !== "string" || typeof s.iniciadaEm !== "number" || typeof s.atualizadaEm !== "number") return null;
  if (!ehObjeto(s.conversa) || !Array.isArray(s.mensagens) || !s.mensagens.every(mensagemValida)) return null;
  // Campos novos da conversa que a versão gravada não conhecia ficam com o valor inicial.
  return { ...(s as unknown as Sessao), conversa: { ...conversaNova(), ...(s.conversa as Partial<Conversa>) } };
}

/** Aceita o que veio do storage (qualquer coisa) e devolve um histórico válido; o que estiver estragado é descartado. */
export function normalizarHistorico(bruto: unknown): Historico {
  if (!ehObjeto(bruto) || bruto.v !== 1) return historicoVazio();
  const anteriores = Array.isArray(bruto.anteriores) ? bruto.anteriores.map(sessaoValida).filter((s): s is Sessao => s !== null) : [];
  return { v: 1, atual: sessaoValida(bruto.atual), anteriores: anteriores.slice(0, MAX_ANTERIORES) };
}

/** A pessoa já escreveu algo? Conversa só com as boas-vindas não vale guardar. */
export const temMensagemDaPessoa = (mensagens: Mensagem[]): boolean => mensagens.some((m) => m.autor === "eu");

/** Fecha a conversa em andamento (se tiver mensagem da pessoa) e a põe no início das anteriores. */
export function arquivarAtual(h: Historico): Historico {
  const { atual } = h;
  if (!atual || !temMensagemDaPessoa(atual.mensagens)) return { ...h, atual: null };
  return { v: 1, atual: null, anteriores: [atual, ...h.anteriores].slice(0, MAX_ANTERIORES) };
}

/** Atualiza a conversa em andamento. Sem mensagem da pessoa, não há o que guardar. */
export function registrarAtual(h: Historico, sessao: Sessao): Historico {
  if (!temMensagemDaPessoa(sessao.mensagens)) return { ...h, atual: null };
  return { ...h, atual: { ...sessao, mensagens: sessao.mensagens.slice(-MAX_MENSAGENS) } };
}

/** Texto corrido da conversa, para copiar e colar. */
export function transcricao(mensagens: Mensagem[], nomeBot: string, nomePessoa: string): string {
  return mensagens
    .map((m) => `[${m.hora}] ${m.autor === "eu" ? nomePessoa : nomeBot}: ${m.texto ?? (m.resposta ? textoPlano(m.resposta) : "")}`)
    .join("\n\n");
}

export function lerHistorico(): Historico {
  try {
    const bruto = localStorage.getItem(CHAVE_HISTORICO);
    return bruto ? normalizarHistorico(JSON.parse(bruto)) : historicoVazio();
  } catch {
    return historicoVazio();
  }
}

export function salvarHistorico(h: Historico): void {
  try {
    if (!h.atual && h.anteriores.length === 0) {
      localStorage.removeItem(CHAVE_HISTORICO);
      return;
    }
    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(h));
  } catch {
    // Storage bloqueado ou cheio: o chat segue funcionando só na memória da aba.
  }
}
