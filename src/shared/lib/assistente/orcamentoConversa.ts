import { servicoOrcamentoPorId, type Opcao, type Pergunta } from "../../../content/perguntas";
import { responder as responderCarrinho } from "../carrinho-estado";
import { calcularServico, opcoesMarcadas, perguntasVisiveis, type CalculoServico, type Respostas } from "../orcamento";
import { chave, contemFrase, radicaisUteis } from "./normalizar";

// Orçamento dentro da conversa, como funções puras. Usa as MESMAS perguntas e o MESMO cálculo do orçamento do site
// (content/perguntas.ts e calcularServico): o chat só pergunta uma de cada vez. Nada aqui define preço.

export type EstadoOrcamento = {
  servicoId: string;
  respostas: Respostas;
  /** Perguntas de múltipla escolha que a pessoa já deu por encerradas ("Pronto"). */
  concluidas: string[];
  /** Estados anteriores, para "voltar uma pergunta". */
  pilha: { respostas: Respostas; concluidas: string[] }[];
};

export function iniciarOrcamento(servicoId: string): EstadoOrcamento | null {
  return servicoOrcamentoPorId(servicoId) ? { servicoId, respostas: {}, concluidas: [], pilha: [] } : null;
}

export type Passo =
  | { tipo: "pergunta"; numero: number; pergunta: Pergunta; marcadas: string[] }
  | { tipo: "resumo"; calculo: CalculoServico };

const respondida = (p: Pergunta, e: EstadoOrcamento) =>
  p.tipo === "multipla" ? e.concluidas.includes(p.id) : opcoesMarcadas(p, e.respostas).length > 0;

/** Próxima pergunta sem resposta (na ordem da tela, filhas logo abaixo da pai) ou, se acabou, o resumo com o cálculo. */
export function proximoPasso(e: EstadoOrcamento): Passo | null {
  const modelo = servicoOrcamentoPorId(e.servicoId);
  if (!modelo) return null;
  const visiveis = perguntasVisiveis(modelo.perguntas, e.respostas);
  const indice = visiveis.findIndex((p) => !respondida(p, e));
  if (indice >= 0) {
    const pergunta = visiveis[indice];
    return { tipo: "pergunta", numero: indice + 1, pergunta, marcadas: opcoesMarcadas(pergunta, e.respostas) };
  }
  const calculo = calcularServico(e.servicoId, e.respostas);
  return calculo ? { tipo: "resumo", calculo } : null;
}

const instantaneo = (e: EstadoOrcamento) => ({ respostas: e.respostas, concluidas: e.concluidas });

/** Aplica uma opção (única troca; múltipla liga e desliga). Usa a mesma função do carrinho do site. */
export function aplicarOpcao(e: EstadoOrcamento, perguntaId: string, opcaoId: string): EstadoOrcamento {
  const antes = { respostas: e.respostas, concluidas: e.concluidas };
  const depois = responderCarrinho({ ids: [e.servicoId], respostas: { [e.servicoId]: e.respostas } }, e.servicoId, perguntaId, opcaoId);
  const respostas = depois.respostas[e.servicoId] ?? {};
  if (respostas === e.respostas) return e;
  // Uma opção de múltipla é marcada e desmarcada sem avançar; só "Pronto" encerra. A pilha só cresce em pergunta única.
  const modelo = servicoOrcamentoPorId(e.servicoId);
  const ehMultipla = modelo ? perguntasVisiveis(modelo.perguntas, e.respostas).find((p) => p.id === perguntaId)?.tipo === "multipla" : false;
  return { ...e, respostas, pilha: ehMultipla ? e.pilha : [...e.pilha, antes] };
}

/** Encerra uma pergunta de múltipla escolha (zero ou mais opções marcadas). */
export function concluirMultipla(e: EstadoOrcamento, perguntaId: string): EstadoOrcamento {
  if (e.concluidas.includes(perguntaId)) return e;
  return { ...e, concluidas: [...e.concluidas, perguntaId], pilha: [...e.pilha, instantaneo(e)] };
}

/** Desfaz a última resposta. Sem histórico, nada muda. */
export function voltarUma(e: EstadoOrcamento): EstadoOrcamento {
  const anterior = e.pilha[e.pilha.length - 1];
  if (!anterior) return e;
  return { ...e, respostas: anterior.respostas, concluidas: anterior.concluidas, pilha: e.pilha.slice(0, -1) };
}

/**
 * Liga o que a pessoa digitou a uma opção da pergunta atual: o rótulo inteiro aparece no texto, ou o texto aparece no rótulo,
 * ou a maioria dos radicais úteis do rótulo está no texto. Devolve `null` se não há uma opção clara (sem chute).
 */
export function opcaoPorTexto(pergunta: Pergunta, texto: string): Opcao | null {
  const c = chave(texto);
  if (!c) return null;
  const palavrasDoTexto = new Set(radicaisUteis(texto));
  let melhor: Opcao | null = null;
  let melhorNota = 0;
  let empate = false;
  for (const o of pergunta.opcoes) {
    const rotulo = chave(o.rotulo);
    let nota = 0;
    if (c === rotulo || contemFrase(c, rotulo)) nota = 1;
    else {
      const rad = radicaisUteis(o.rotulo);
      if (rad.length > 0) nota = rad.filter((r) => palavrasDoTexto.has(r)).length / rad.length;
      // Texto curto que é parte do rótulo ("estoque" para "Estoque"), com pelo menos uma palavra útil.
      if (palavrasDoTexto.size > 0 && [...palavrasDoTexto].every((p) => rad.includes(p))) nota = Math.max(nota, 0.75);
    }
    if (nota > melhorNota) {
      melhor = o;
      melhorNota = nota;
      empate = false;
    } else if (nota === melhorNota && nota > 0) {
      empate = true;
    }
  }
  return melhor && melhorNota >= 0.6 && !empate ? melhor : null;
}
