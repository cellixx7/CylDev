import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type MouseEvent, type RefObject } from "react";
import { assistente as t } from "../../../content/textos/assistente";
import { botao, botaoCheio, focoVisivel } from "../../../shared/estilos";
import { pedirCarrinho } from "../../../shared/lib/assistente/eventos";
import { boasVindas, conversaNova, processar, textoPlano, type Acao, type Bloco, type Chip, type Conversa, type Entrada, type Resposta } from "../../../shared/lib/assistente/motor";
import { montarHash } from "../../../shared/lib/hashServico";
import { IconeFechar } from "../icones";
import { useTravaRolagem } from "../useTravaRolagem";

// Painel do chat (carregado sob demanda por BotaoAssistente). Tudo roda neste aparelho: nenhuma mensagem sai daqui,
// nada vai para localStorage, cookie ou rede. A conversa vive só na memória desta aba e some ao recarregar.

type Mensagem = { id: number; autor: "eu" | "bot"; texto?: string; resposta?: Resposta };

const botaoTexto = `min-h-alvo cursor-pointer border-0 bg-transparent px-3 font-[inherit] text-base font-semibold text-destaque underline underline-offset-4 ${focoVisivel}`;
const botaoChip = `min-h-alvo cursor-pointer rounded-pequeno border border-destaque bg-transparent px-3 py-2 text-left font-[inherit] text-base text-destaque hover:bg-realce active:bg-realce ${focoVisivel}`;
const botaoChipMarcado = `min-h-alvo cursor-pointer rounded-pequeno border border-destaque bg-destaque px-3 py-2 text-left font-[inherit] text-base text-destaque-texto ${focoVisivel}`;

const reduzido = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
        return (
          <p key={i} className="m-0 mt-2 text-base first:mt-0 [overflow-wrap:anywhere]">
            {b.texto}
          </p>
        );
      })}
    </>
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
  const [mensagens, setMensagens] = useState<Mensagem[]>(() => [{ id: 0, autor: "bot", resposta: boasVindas() }]);
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

  // Nova mensagem: o início da resposta nova aparece no topo da área (respostas longas começam a ser lidas do começo).
  useEffect(() => {
    const area = rolagem.current;
    if (!area || !aberto) return;
    const ultima = mensagens[mensagens.length - 1];
    const alvo = ultima?.autor === "bot" ? area.querySelector<HTMLElement>(`[data-msg="${ultima.id}"]`) : null;
    const topo = alvo ? alvo.offsetTop - 8 : area.scrollHeight;
    area.scrollTo({ top: topo, behavior: reduzido() ? "auto" : "smooth" });
  }, [mensagens, aberto]);

  const enviar = (entrada: Entrada, rotuloDoUsuario: string) => {
    const r = processar(entrada, conversa);
    setConversa(r.conversa);
    setMensagens((atual) => [
      ...atual,
      { id: proximoId.current++, autor: "eu", texto: rotuloDoUsuario },
      { id: proximoId.current++, autor: "bot", resposta: r.resposta },
    ]);
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
    setMensagens([{ id: proximoId.current++, autor: "bot", resposta: boasVindas() }]);
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
      setMensagens((atual) => [...atual, { id: proximoId.current++, autor: "bot", resposta: { blocos: [{ tipo: "p", texto: t.orcarCarrinhoOk }], chips: [], acoes: [] } }]);
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
      className="assistente m-0 hidden max-h-none w-full max-w-none flex-col overflow-hidden border-0 bg-fundo p-0 text-texto open:flex md:mt-auto md:mr-5 md:mb-5 md:ml-auto md:w-[26rem] md:border md:border-linha backdrop:bg-[rgb(0_0_0/0.6)] md:backdrop:bg-transparent"
    >
      {aberto && (
        <>
          <header className="flex shrink-0 items-center justify-between gap-2 border-b border-linha px-4 py-2">
            <h2 id="assistente-titulo" ref={titulo} tabIndex={-1} className="m-0 py-2 text-medio leading-tight outline-none">
              {t.titulo}
            </h2>
            <div className="flex items-center">
              <button type="button" onClick={limpar} className={botaoTexto}>
                {t.limpar}
              </button>
              <button
                type="button"
                onClick={aoFechar}
                aria-label={t.fechar}
                className={`grid size-alvo shrink-0 cursor-pointer place-items-center rounded-pequeno border border-linha bg-transparent p-0 text-texto hover:bg-realce active:bg-realce ${focoVisivel}`}
              >
                <IconeFechar />
              </button>
            </div>
          </header>

          <p className="m-0 shrink-0 border-b border-linha bg-superficie px-4 py-2 text-menor text-texto-suave">{t.aviso}</p>

          <p className="sr-only" role="status">
            {aviso}
          </p>

          <div ref={rolagem} role="log" aria-label={t.conversaLog} aria-live="polite" aria-relevant="additions" className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <ol className="m-0 grid list-none gap-3 p-0">
              {mensagens.map((m) => {
                const eu = m.autor === "eu";
                const ultima = m.id === ultimaId;
                return (
                  <li key={m.id} data-msg={m.id} className={`flex flex-col gap-2 ${eu ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-[92%] rounded-pequeno border px-3 py-2 ${eu ? "border-destaque bg-destaque text-destaque-texto" : "border-linha bg-superficie text-texto"}`}
                    >
                      <span className="sr-only">{eu ? t.voce : t.assistente}: </span>
                      {m.texto !== undefined ? <p className="m-0 text-base [overflow-wrap:anywhere]">{m.texto}</p> : m.resposta && <Corpo blocos={m.resposta.blocos} />}
                    </div>
                    {/* Botões e links só na última resposta: as antigas viram histórico. */}
                    {ultima && m.resposta && (
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
              className={`min-h-alvo min-w-0 flex-1 rounded-pequeno border border-texto-suave bg-superficie px-3 font-[inherit] text-base text-texto placeholder:text-texto-suave ${focoVisivel}`}
            />
            <button type="submit" className={`${botaoCheio} cursor-pointer justify-center font-[inherit] text-base ${focoVisivel}`}>
              {t.enviar}
            </button>
          </form>
        </>
      )}
    </dialog>
  );
}
