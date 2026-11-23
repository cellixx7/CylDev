import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent, type RefObject } from "react";
import { assistente as t } from "../../../content/textos/assistente";
import { botao, botaoCheio, focoVisivel } from "../../../shared/estilos";
import { Cyl } from "../../../shared/components/cyl/Cyl";
import { pedirCarrinho } from "../../../shared/lib/assistente/eventos";
import {
  boasVindas,
  conversaNova,
  processar,
  textoPlano,
  type Acao,
  type Chip,
  type Conversa,
  type Entrada,
  type Estado,
} from "../../../shared/lib/assistente/motor";
import {
  MAX_ANTERIORES,
  arquivarAtual,
  lerHistorico,
  registrarAtual,
  salvarHistorico,
  temMensagemDaPessoa,
  transcricao,
  type Mensagem,
  type Sessao,
} from "../../../shared/lib/assistente/historico";
import { atrasoMs, horaCurta, passoDigitacao, recortarBlocos, tamanhoDosBlocos } from "../../../shared/lib/assistente/ritmo";
import { montarHash } from "../../../shared/lib/hashServico";
import { IconeFechar } from "../icones";
import { ConversasAnteriores } from "./ConversasAnteriores";
import { Corpo } from "./Corpo";
import { useTravaRolagem } from "../useTravaRolagem";
import { BotaoCyldev } from "./BotaoCyldev";
import { AlcaRedimensionar, useTamanhoDoPainel } from "./Redimensionar";

// Painel do chat (carregado sob demanda por BotaoAssistente). Tudo roda neste aparelho: nenhuma mensagem sai daqui
// (sem rede e sem cookie). A conversa em andamento e as anteriores ficam no localStorage (shared/lib/assistente/historico.ts):
// voltam depois de recarregar a página e só somem quando a pessoa limpa os dados do site. Fechar só o painel não perde nada.
//
// Ritmo de cada resposta: o motor responde na hora, mas o chat mostra primeiro o indicador de estado (três pontinhos com
// "Digitando…", "Pensando…", "Pesquisando…" ou "Montando seu orçamento…"), depois "digita" o texto aos poucos. A pessoa pode
// pular o efeito. Com movimento reduzido não há pontinhos animados nem digitação: só um respiro curto e a resposta inteira.

/** Fase da última resposta do assistente: esperando (indicador de estado) ou sendo digitada. `null` = pronta. */
type Fase = { id: number; etapa: "espera" | "digita"; estado: Estado; atraso: number; total: number; escritos: number };

const botaoTexto = `min-h-alvo cursor-pointer border-0 bg-transparent px-3 font-[inherit] text-base font-semibold text-destaque underline underline-offset-4 ${focoVisivel}`;
const botaoChip = `min-h-alvo cursor-pointer rounded-full border border-destaque bg-transparent px-4 py-2 text-left font-[inherit] text-base text-destaque md:min-h-10 md:px-3 md:py-1.5 md:text-menor hover:bg-realce active:bg-realce ${focoVisivel}`;
const botaoChipMarcado = `min-h-alvo cursor-pointer rounded-full border border-destaque bg-destaque px-4 py-2 text-left font-[inherit] text-base text-destaque-texto md:min-h-10 md:px-3 md:py-1.5 md:text-menor ${focoVisivel}`;

const reduzido = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const agora = () => horaCurta(new Date());

/** Foto de perfil do Cyl: recorte justo no rosto (óculos, olhos, bigode e barbicha) sobre o fundo lilás, que dá contraste ao cabelo escuro. */
function Avatar({ lado }: { lado: 36 | 40 }) {
  return (
    <span aria-hidden="true" className="block shrink-0 overflow-hidden rounded-full bg-realce" style={{ width: lado, height: lado }}>
      <Cyl size={lado} recorte="rosto" background="circle" animation="idle" autoplay={false} />
    </span>
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

/** "i" dentro de um círculo: saiba mais. */
function IconeInfo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8v.01" />
    </svg>
  );
}

/** Duas folhas (copiar); com `feito`, um visto. */
function IconeCopiar({ feito }: { feito: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {feito ? <path d="m5 12.5 4.5 4.5L19 7.5" /> : <><rect x="8.5" y="8.5" width="11" height="11" rx="2" /><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5" /></>}
    </svg>
  );
}

/** Relógio com seta para trás: conversas anteriores. */
function IconeHistorico() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5" />
      <path d="M3.5 4v4.5H8M12 7.5V12l3 2" />
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

const novoId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Copia para a área de transferência; sem a API (ou sem permissão), tenta o jeito antigo com um campo escondido. */
async function copiarTexto(texto: string, dentro: HTMLElement | null): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.opacity = "0";
    (dentro ?? document.body).append(campo);
    campo.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      campo.remove();
    }
  }
}

type Props = { aberto: boolean; aoFechar: () => void };

export function PainelAssistente({ aberto, aoFechar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const rolagem = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const idCampo = useId();

  // Lido uma vez, ao montar: a conversa em andamento (se houver) e as anteriores.
  const [inicial] = useState(lerHistorico);
  const proximoId = useRef(Math.max(0, ...(inicial.atual?.mensagens.map((m) => m.id) ?? [])) + 1);
  const sessaoId = useRef(inicial.atual?.id ?? novoId());
  const iniciadaEm = useRef(inicial.atual?.iniciadaEm ?? Date.now());

  const [conversa, setConversa] = useState<Conversa>(() => inicial.atual?.conversa ?? conversaNova());
  const [mensagens, setMensagens] = useState<Mensagem[]>(() => inicial.atual?.mensagens ?? [{ id: 0, autor: "bot", hora: agora(), resposta: boasVindas() }]);
  const [anteriores, setAnteriores] = useState<Sessao[]>(inicial.anteriores);
  const [vendoAnteriores, setVendoAnteriores] = useState(false);
  const [copia, setCopia] = useState<"ok" | "erro" | null>(null);
  const [fase, setFase] = useState<Fase | null>(null);
  const [texto, setTexto] = useState("");
  const [aviso, setAviso] = useState("");
  const [avisoAberto, setAvisoAberto] = useState(false);
  const { tamanho, setTamanho, medir } = useTamanhoDoPainel(dialogo);

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

  const sessaoAtual = (): Sessao => ({ id: sessaoId.current, iniciadaEm: iniciadaEm.current, atualizadaEm: Date.now(), conversa, mensagens });

  // Guarda no navegador a cada mudança. Conversa sem mensagem da pessoa não é guardada.
  useEffect(() => {
    salvarHistorico(registrarAtual({ v: 1, atual: null, anteriores }, sessaoAtual()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversa, mensagens, anteriores]);

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
    // A conversa que acaba vai para as anteriores (se a pessoa chegou a escrever).
    if (temMensagemDaPessoa(mensagens)) setAnteriores(arquivarAtual({ v: 1, atual: sessaoAtual(), anteriores }).anteriores.slice(0, MAX_ANTERIORES));
    sessaoId.current = novoId();
    iniciadaEm.current = Date.now();
    setConversa(conversaNova());
    setFase(null);
    setMensagens([{ id: proximoId.current++, autor: "bot", hora: agora(), resposta: boasVindas() }]);
    setAviso("");
    titulo.current?.focus();
  };

  // TEMPORÁRIO (remover na entrega final; ver docs/decisoes/assistente.md): copia a conversa inteira como texto.
  const copiarConversa = async () => {
    const texto = transcricao(mensagens, t.assistente, t.voce);
    const resultado = (await copiarTexto(texto, dialogo.current)) ? "ok" : "erro";
    setCopia(resultado);
    setAviso(resultado === "ok" ? t.copiarTemp.ok : t.copiarTemp.erro);
    window.setTimeout(() => setCopia(null), 2500);
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
      style={tamanho ? ({ "--larg-assistente": `${tamanho.largura}px`, "--alt-assistente": `${tamanho.altura}px` } as CSSProperties) : undefined}
      className="assistente m-0 hidden max-h-none w-full max-w-none flex-col overflow-visible border-0 bg-transparent p-0 text-texto open:flex md:mt-auto md:mr-5 md:mb-5 md:ml-auto backdrop:bg-[rgb(0_0_0/0.6)] md:backdrop:bg-transparent"
    >
      {aberto && (
        <>
          <BotaoCyldev />
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-fundo md:rounded-2xl md:border md:border-linha">
          {/* Faixa fixa no topo: o aviso de que é um programa e de onde a conversa fica. Só o começo aparece; o resto abre em "Saiba mais" e o leitor de tela recebe tudo sempre. */}
          <div className="shrink-0 border-b border-linha bg-superficie px-3 py-1 text-menor text-texto-suave md:pr-3 md:pl-6">
            <div className="flex flex-wrap items-center gap-x-2">
              <p className="m-0 min-w-0 flex-1 basis-40" data-testid="aviso-assistente">
                <span>{t.avisoCurto}</span>
                <span className={avisoAberto ? "" : "sr-only"}> {t.avisoResto}</span>
              </p>
              <span className="flex items-center">
                <button
                  type="button"
                  onClick={() => setAvisoAberto((v) => !v)}
                  aria-expanded={avisoAberto}
                  aria-label={avisoAberto ? t.avisoMenos : t.avisoMais}
                  title={avisoAberto ? t.avisoMenos : t.avisoMais}
                  className={`grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-destaque hover:bg-realce ${focoVisivel}`}
                >
                  <IconeInfo />
                </button>
                {/* TEMPORÁRIO: remover junto com copiarConversa. */}
                {!vendoAnteriores && (
                  <button
                    type="button"
                    onClick={() => void copiarConversa()}
                    aria-label={copia === "ok" ? t.copiarTemp.ok : copia === "erro" ? t.copiarTemp.erro : t.copiarTemp.botao}
                    title={t.copiarTemp.botao}
                    className={`grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-destaque hover:bg-realce ${focoVisivel}`}
                    data-testid="copiar-conversa-temp"
                  >
                    <IconeCopiar feito={copia === "ok"} />
                  </button>
                )}
              </span>
            </div>
          </div>

          <header className="flex shrink-0 items-center justify-between gap-2 border-b border-linha px-3 py-1 md:px-4">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar lado={40} />
              <h2 id="assistente-titulo" ref={titulo} tabIndex={-1} className="m-0 py-1 text-medio leading-tight whitespace-nowrap outline-none">
                {t.titulo}
              </h2>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setVendoAnteriores((v) => !v)}
                aria-label={t.anteriores.botao}
                aria-pressed={vendoAnteriores}
                title={t.anteriores.botao}
                className={`mr-1 grid size-alvo shrink-0 cursor-pointer place-items-center rounded-full border border-linha bg-transparent p-0 text-texto hover:bg-realce active:bg-realce md:size-10 ${focoVisivel}`}
              >
                <IconeHistorico />
              </button>
              <button
                type="button"
                onClick={limpar}
                aria-label={t.novaConversa}
                title={t.novaConversa}
                className={`mr-1 grid size-alvo shrink-0 cursor-pointer place-items-center rounded-full border border-linha bg-transparent p-0 text-texto hover:bg-realce active:bg-realce md:size-10 ${focoVisivel}`}
              >
                <IconeNovaConversa />
              </button>
              <button
                type="button"
                onClick={aoFechar}
                aria-label={t.fechar}
                className={`grid size-alvo shrink-0 cursor-pointer place-items-center rounded-full border border-linha bg-transparent p-0 text-texto hover:bg-realce active:bg-realce md:size-10 ${focoVisivel}`}
              >
                <IconeFechar />
              </button>
            </div>
          </header>

          <p className="sr-only" role="status">
            {aviso}
          </p>

          {vendoAnteriores ? (
            <ConversasAnteriores sessoes={anteriores} aoVoltar={() => setVendoAnteriores(false)} />
          ) : (
            <>
              {/* Sem aria-live no registro: o efeito de digitação mudaria o texto a cada instante. O leitor de tela recebe a resposta pelo aviso acima. */}
              <div ref={rolagem} role="log" aria-label={t.conversaLog} aria-live="off" className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 md:px-4">
                <ol className="m-0 grid list-none gap-3 p-0 md:gap-3.5">
                  {mensagens.map((m) => {
                    const eu = m.autor === "eu";
                    const ultima = m.id === ultimaId;
                    const emFase = fase !== null && fase.id === m.id;
                    const esperando = emFase && fase.etapa === "espera";
                    const digitando = emFase && fase.etapa === "digita";
                    const blocos = m.resposta ? (digitando ? recortarBlocos(m.resposta.blocos, fase.escritos) : m.resposta.blocos) : [];
                    return (
                      <li key={m.id} data-msg={m.id} className={`flex items-start gap-2 ${eu ? "justify-end" : "justify-start"}`}>
                        {!eu && <Avatar lado={36} />}
                        <div className={`flex min-w-0 max-w-[88%] flex-col gap-1 ${eu ? "items-end" : "items-start"}`}>
                          <div
                            className={`rounded-2xl px-3.5 py-2 ${eu ? "rounded-br-md bg-destaque text-destaque-texto" : "rounded-bl-md border border-linha bg-superficie text-texto"}`}
                          >
                            <span className="sr-only">{eu ? t.voce : t.assistente}: </span>
                            {m.texto !== undefined ? (
                              <p className="m-0 text-base [overflow-wrap:anywhere] md:text-menor">{m.texto}</p>
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
                                        className={i === 0 && a.externo ? `${botaoCheio} text-base md:text-menor` : `${botao} text-base md:text-menor`}
                                        href={a.href}
                                        {...(a.externo ? { target: "_blank", rel: "noopener" } : {})}
                                        onClick={(e) => aoAcionar(a, e)}
                                      >
                                        {a.rotulo}
                                      </a>
                                    ) : (
                                      <button key={i} type="button" className={`${a.tipo === "carrinho" ? botaoCheio : botao} cursor-pointer font-[inherit] text-base md:text-menor ${focoVisivel}`} onClick={() => aoAcionar(a)}>
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

              <form onSubmit={aoEnviar} className="flex shrink-0 gap-2 border-t border-linha bg-fundo px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:px-4 md:pt-3 md:pb-3">
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
          </div>
          <AlcaRedimensionar medir={medir} aoMudar={setTamanho} />
        </>
      )}
    </dialog>
  );
}
