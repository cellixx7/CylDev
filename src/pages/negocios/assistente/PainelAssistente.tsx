import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type MouseEvent, type RefObject } from "react";
import { assistente as t } from "../../../content/textos/assistente";
import { botao, botaoCheio, focoVisivel } from "../../../shared/estilos";
import { pedirCarrinho } from "../../../shared/lib/assistente/eventos";
import {
  boasVindas,
  conversaNova,
  processar,
  textoPlano,
  type Acao,
  type Bloco,
  type Chip,
  type Conversa,
  type Entrada,
  type Estado,
  type Resposta,
} from "../../../shared/lib/assistente/motor";
import { atrasoMs, horaCurta, passoDigitacao, recortarBlocos, tamanhoDosBlocos } from "../../../shared/lib/assistente/ritmo";
import { montarHash } from "../../../shared/lib/hashServico";
import { IconeFechar } from "../icones";
import { useTravaRolagem } from "../useTravaRolagem";

// Painel do chat (carregado sob demanda por BotaoAssistente). Tudo roda neste aparelho: nenhuma mensagem sai daqui,
// nada vai para localStorage, cookie ou rede. A conversa vive só na memória desta aba e some ao recarregar.
//
// Ritmo de cada resposta: o motor responde na hora, mas o chat mostra primeiro o indicador de estado (três pontinhos com
// "Digitando…", "Pensando…", "Pesquisando…" ou "Montando seu orçamento…"), depois "digita" o texto aos poucos. A pessoa pode
// pular o efeito. Com movimento reduzido não há pontinhos animados nem digitação: só um respiro curto e a resposta inteira.

type Mensagem = { id: number; autor: "eu" | "bot"; hora: string; texto?: string; resposta?: Resposta };

/** Fase da última resposta do assistente: esperando (indicador de estado) ou sendo digitada. `null` = pronta. */
type Fase = { id: number; etapa: "espera" | "digita"; estado: Estado; atraso: number; total: number; escritos: number };

const botaoTexto = `min-h-alvo cursor-pointer border-0 bg-transparent px-3 font-[inherit] text-base font-semibold text-destaque underline underline-offset-4 ${focoVisivel}`;
const botaoChip = `min-h-alvo cursor-pointer rounded-full border border-destaque bg-transparent px-4 py-2 text-left font-[inherit] text-base text-destaque hover:bg-realce active:bg-realce ${focoVisivel}`;
const botaoChipMarcado = `min-h-alvo cursor-pointer rounded-full border border-destaque bg-destaque px-4 py-2 text-left font-[inherit] text-base text-destaque-texto ${focoVisivel}`;

const reduzido = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const agora = () => horaCurta(new Date());

function Avatar({ pequeno = false }: { pequeno?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-destaque font-titulo font-bold text-destaque-texto ${pequeno ? "size-8 text-base" : "size-10 text-medio"}`}
    >
      {t.avatar}
    </span>
  );
}

function Corpo({ blocos }: { blocos: Bloco[] }) {
  return (
    <>
      {blocos.map((b, i) => {
        if (b.tipo === "titulo") {
          return (
            <p key={i} className="m-0 mt-3 text-base font-bold first:mt-0">
              {b.texto}
            </p>
          );
        }
        if (b.tipo === "lista") {
          return (
            <ul key={i} className="m-0 mt-2 grid list-disc gap-1 pl-5 text-base first:mt-0">
              {b.itens.map((item, j) => (
                <li key={j} className="[overflow-wrap:anywhere]">
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (b.tipo === "dica") {
          return (
            <p key={i} className="m-0 mt-3 border-l-2 border-destaque pl-3 text-base text-texto-suave [overflow-wrap:anywhere] first:mt-0">
              {b.texto}
            </p>
          );
        }
        return (
          <p key={i} className={`m-0 mt-2 text-base [overflow-wrap:anywhere] first:mt-0 ${b.tipo === "pergunta" ? "font-semibold" : ""}`}>
            {b.texto}
          </p>
        );
      })}
    </>
  );
}

/** Balão de chat com um "+": começa uma conversa nova. */
function IconeNovaConversa() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12.5V16a2 2 0 0 1-2 2h-6.5L7 21v-3H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7" />
      <path d="M18 3v6M15 6h6" />
    </svg>
  );
}

/** Indicador de estado: o texto ("Digitando…") com três pontinhos que pulam (parados com movimento reduzido). */
function Indicador({ estado }: { estado: Estado }) {
  return (
    <p className="m-0 flex items-center gap-2 text-base text-texto-suave" data-estado={estado}>
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        <span className="ponto-digitando" />
        <span className="ponto-digitando" />
        <span className="ponto-digitando" />
      </span>
      {/* Antes de toda resposta o texto é "Digitando…" (decisão do Marcelo em 19/11/2026); o estado do motor segue disponível em data-estado. */}
      <span>{t.estados.digitando}</span>
    </p>
  );
}

/** Mantém a altura do painel igual à parte visível da tela (o teclado do celular encolhe a área visível). */
function useAlturaVisivel(ativo: boolean, painel: RefObject<HTMLDialogElement | null>) {
  useLayoutEffect(() => {
    const vv = window.visualViewport;
    const el = painel.current;
    if (!ativo || !vv || !el) return;
    const ajustar = () => {
      el.style.setProperty("--altura-assistente", `${Math.round(vv.height)}px`);
      el.style.setProperty("--topo-assistente", `${Math.round(vv.offsetTop)}px`);
    };
    ajustar();
    vv.addEventListener("resize", ajustar);
    vv.addEventListener("scroll", ajustar);
    return () => {
      vv.removeEventListener("resize", ajustar);
      vv.removeEventListener("scroll", ajustar);
      el.style.removeProperty("--altura-assistente");
      el.style.removeProperty("--topo-assistente");
    };
  }, [ativo, painel]);
}

type Props = { aberto: boolean; aoFechar: () => void };

export function PainelAssistente({ aberto, aoFechar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const rolagem = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const idCampo = useId();
  const proximoId = useRef(1);

  const [conversa, setConversa] = useState<Conversa>(conversaNova);
  const [mensagens, setMensagens] = useState<Mensagem[]>(() => [{ id: 0, autor: "bot", hora: agora(), resposta: boasVindas() }]);
  const [fase, setFase] = useState<Fase | null>(null);
  const [texto, setTexto] = useState("");
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (aberto && !d.open) {
      d.showModal();
      titulo.current?.focus({ preventScroll: true });
    } else if (!aberto && d.open) {
      d.close();
    }
  }, [aberto]);

  useTravaRolagem(aberto);
  useAlturaVisivel(aberto, dialogo);

  // Espera (indicador de estado) e depois digitação. Sem movimento reduzido: pontinhos e texto aos poucos; com ele: um respiro curto.
  const faseId = fase?.id;
  const faseEtapa = fase?.etapa;
  useEffect(() => {
    if (faseId === undefined || !faseEtapa) return;
    if (faseEtapa === "espera") {
      const id = window.setTimeout(() => {
        setFase((f) => (f && f.id === faseId ? (reduzido() ? null : { ...f, etapa: "digita" }) : f));
      }, fase?.atraso ?? 0);
      return () => window.clearTimeout(id);
    }
    const passo = passoDigitacao(fase?.total ?? 0);
    const id = window.setInterval(() => {
      setFase((f) => {
        if (!f || f.id !== faseId) return f;
        const escritos = f.escritos + passo;
        return escritos >= f.total ? null : { ...f, escritos };
      });
    }, 25);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faseId, faseEtapa]);

  // Nova mensagem: o início da resposta nova aparece no topo da área (respostas longas começam a ser lidas do começo).
  // Também roda quando a digitação termina, para os botões da resposta ficarem à vista.
  const pronta = fase === null;
  useEffect(() => {
    const area = rolagem.current;
    if (!area || !aberto) return;
    const ultima = mensagens[mensagens.length - 1];
    const alvo = ultima?.autor === "bot" ? area.querySelector<HTMLElement>(`[data-msg="${ultima.id}"]`) : null;
    const topo = alvo ? alvo.offsetTop - 8 : area.scrollHeight;
    area.scrollTo({ top: topo, behavior: reduzido() ? "auto" : "smooth" });
  }, [mensagens, aberto, pronta]);

  const enviar = (entrada: Entrada, rotuloDoUsuario: string) => {
    const r = processar(entrada, conversa);
    const idBot = proximoId.current + 1;
    const estado = r.resposta.estado ?? "digitando";
    const total = tamanhoDosBlocos(r.resposta.blocos);
    setConversa(r.conversa);
    setMensagens((atual) => [
      ...atual,
      { id: proximoId.current++, autor: "eu", hora: agora(), texto: rotuloDoUsuario },
      { id: proximoId.current++, autor: "bot", hora: agora(), resposta: r.resposta },
    ]);
    setFase({ id: idBot, etapa: "espera", estado, atraso: atrasoMs(estado, total, reduzido()), total, escritos: 0 });
    // O leitor de tela recebe a resposta inteira de uma vez; o efeito de digitação é só visual.
    setAviso(textoPlano(r.resposta));
  };

  const aoEnviar = (e: FormEvent) => {
    e.preventDefault();
    const limpo = texto.trim();
    if (!limpo) return;
    setTexto("");
    enviar({ texto: limpo }, limpo);
    campo.current?.focus();
  };

  const limpar = () => {
    setConversa(conversaNova());
    setFase(null);
    setMensagens([{ id: proximoId.current++, autor: "bot", hora: agora(), resposta: boasVindas() }]);
    setAviso("");
    titulo.current?.focus();
  };

  /** Fecha o chat e, só depois que a página destrava a rolagem, vai para o destino. */
  const sairPara = (ir: () => void) => {
    aoFechar();
    window.setTimeout(ir, 150);
  };

  const aoAcionar = (a: Acao, e?: MouseEvent) => {
    if (a.tipo === "carrinho") {
      sairPara(() => pedirCarrinho({ servicoId: a.servicoId, respostas: a.respostas }));
      setAviso(t.orcarCarrinhoOk);
      setMensagens((atual) => [
        ...atual,
        { id: proximoId.current++, autor: "bot", hora: agora(), resposta: { blocos: [{ tipo: "p", texto: t.orcarCarrinhoOk }], chips: [], acoes: [] } },
      ]);
      return;
    }
    if (a.tipo === "servico") {
      sairPara(() => {
        window.location.hash = montarHash(a.servicoId, a.aba);
      });
      return;
    }
    // Link interno da mesma página (#orcamento, #sobre): fecha o chat e rola; os demais seguem o caminho normal.
    if (a.href.startsWith("#")) {
      e?.preventDefault();
      sairPara(() => {
        window.history.pushState(null, "", a.href);
        document.getElementById(a.href.slice(1))?.scrollIntoView({ behavior: reduzido() ? "auto" : "smooth" });
      });
    }
  };

  const ultimaId = mensagens[mensagens.length - 1]?.id;

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="assistente-titulo"
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
      className="assistente m-0 hidden max-h-none w-full max-w-none flex-col overflow-hidden border-0 bg-fundo p-0 text-texto open:flex md:mt-auto md:mr-5 md:mb-5 md:ml-auto md:w-[26rem] md:rounded-2xl md:border md:border-linha backdrop:bg-[rgb(0_0_0/0.6)] md:backdrop:bg-transparent"
    >
      {aberto && (
        <>
          <header className="flex shrink-0 items-center justify-between gap-2 border-b border-linha px-4 py-2">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar />
              <h2 id="assistente-titulo" ref={titulo} tabIndex={-1} className="m-0 py-2 text-medio leading-tight whitespace-nowrap outline-none">
                {t.titulo}
              </h2>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={limpar}
                aria-label={t.novaConversa}
                title={t.novaConversa}
                className={`mr-1 grid size-alvo shrink-0 cursor-pointer place-items-center rounded-full border border-linha bg-transparent p-0 text-texto hover:bg-realce active:bg-realce ${focoVisivel}`}
              >
                <IconeNovaConversa />
              </button>
              <button
                type="button"
                onClick={aoFechar}
                aria-label={t.fechar}
                className={`grid size-alvo shrink-0 cursor-pointer place-items-center rounded-full border border-linha bg-transparent p-0 text-texto hover:bg-realce active:bg-realce ${focoVisivel}`}
              >
                <IconeFechar />
              </button>
            </div>
          </header>

          <p className="m-0 shrink-0 border-b border-linha bg-superficie px-4 py-2 text-menor text-texto-suave">{t.aviso}</p>

          <p className="sr-only" role="status">
            {aviso}
          </p>

          {/* Sem aria-live no registro: o efeito de digitação mudaria o texto a cada instante. O leitor de tela recebe a resposta pelo aviso acima. */}
          <div ref={rolagem} role="log" aria-label={t.conversaLog} aria-live="off" className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <ol className="m-0 grid list-none gap-4 p-0">
              {mensagens.map((m) => {
                const eu = m.autor === "eu";
                const ultima = m.id === ultimaId;
                const emFase = fase !== null && fase.id === m.id;
                const esperando = emFase && fase.etapa === "espera";
                const digitando = emFase && fase.etapa === "digita";
                const blocos = m.resposta ? (digitando ? recortarBlocos(m.resposta.blocos, fase.escritos) : m.resposta.blocos) : [];
                return (
                  <li key={m.id} data-msg={m.id} className={`flex items-start gap-2 ${eu ? "justify-end" : "justify-start"}`}>
                    {!eu && <Avatar pequeno />}
                    <div className={`flex min-w-0 max-w-[86%] flex-col gap-1 ${eu ? "items-end" : "items-start"}`}>
                      <div
                        className={`rounded-2xl px-4 py-2 ${eu ? "rounded-br-md bg-destaque text-destaque-texto" : "rounded-bl-md border border-linha bg-superficie text-texto"}`}
                      >
                        <span className="sr-only">{eu ? t.voce : t.assistente}: </span>
                        {m.texto !== undefined ? (
                          <p className="m-0 text-base [overflow-wrap:anywhere]">{m.texto}</p>
                        ) : esperando ? (
                          <Indicador estado={fase.estado} />
                        ) : (
                          m.resposta && <Corpo blocos={blocos} />
                        )}
                      </div>
                      {!esperando && (
                        <time className="px-1 text-menor text-texto-suave">{m.hora}</time>
                      )}
                      {emFase && (
                        <button type="button" onClick={() => setFase(null)} className={`${botaoTexto} px-1`}>
                          {t.pular}
                        </button>
                      )}
                      {/* Botões e links só na última resposta, quando ela já está pronta: as antigas viram histórico. */}
                      {ultima && !emFase && m.resposta && (
                        <>
                          {m.resposta.acoes.length > 0 && (
                            <div className="flex max-w-full flex-wrap gap-2">
                              {m.resposta.acoes.map((a, i) =>
                                a.tipo === "link" ? (
                                  <a
                                    key={i}
                                    className={i === 0 && a.externo ? `${botaoCheio} text-base` : `${botao} text-base`}
                                    href={a.href}
                                    {...(a.externo ? { target: "_blank", rel: "noopener" } : {})}
                                    onClick={(e) => aoAcionar(a, e)}
                                  >
                                    {a.rotulo}
                                  </a>
                                ) : (
                                  <button key={i} type="button" className={`${a.tipo === "carrinho" ? botaoCheio : botao} cursor-pointer font-[inherit] text-base ${focoVisivel}`} onClick={() => aoAcionar(a)}>
                                    {a.rotulo}
                                  </button>
                                ),
                              )}
                            </div>
                          )}
                          {m.resposta.chips.length > 0 && (
                            <div className="flex max-w-full flex-wrap gap-2" role="group" aria-label={textoPlano({ ...m.resposta, blocos: m.resposta.blocos.slice(0, 1) })}>
                              {m.resposta.chips.map((c: Chip, i) => (
                                <button
                                  key={`${i}-${c.rotulo}`}
                                  type="button"
                                  aria-pressed={c.marcado === undefined ? undefined : c.marcado}
                                  className={c.marcado ? botaoChipMarcado : botaoChip}
                                  onClick={() => enviar(c.entrada, c.rotulo)}
                                >
                                  {c.rotulo}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <form onSubmit={aoEnviar} className="flex shrink-0 gap-2 border-t border-linha bg-fundo px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <label htmlFor={idCampo} className="sr-only">
              {t.campoRotulo}
            </label>
            <input
              id={idCampo}
              ref={campo}
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={t.maximoCaracteres}
              placeholder={t.campoDica}
              autoComplete="off"
              enterKeyHint="send"
              className={`min-h-alvo min-w-0 flex-1 rounded-full border border-texto-suave bg-superficie px-4 font-[inherit] text-base text-texto placeholder:text-texto-suave ${focoVisivel}`}
            />
            <button type="submit" className={`${botaoCheio} cursor-pointer justify-center rounded-full! font-[inherit] text-base ${focoVisivel}`}>
              {t.enviar}
            </button>
          </form>
        </>
      )}
    </dialog>
  );
}
