import { useEffect, useId, useRef, useState, type FocusEvent } from "react";
import { orcamento } from "../../content/textos";
import { botao, botaoCheio } from "../../shared/estilos";
import { emailjsConfigurado } from "../../shared/lib/emailjs";
import { brl } from "../../shared/lib/formato";
import { resumoPrecoItem, type ItemPedido, type Pedido } from "../../shared/lib/pedido";
import { totalCurto } from "./BarraCarrinho";
import { AcoesDoPedido, DadosDoPedido, useEnvioPedido } from "./CheckoutPedido";
import { IconeFechar } from "./icones";
import { useTravaRolagem } from "./useTravaRolagem";

const t = orcamento.carrinho;

const focoVisivel = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco";
const botaoTexto = `min-h-alvo cursor-pointer border-0 bg-transparent px-3 font-[inherit] text-[1rem] font-semibold text-destaque underline underline-offset-4 ${focoVisivel}`;

function ItemCarrinho({ item: i, aoAjustar, aoTirar }: { item: ItemPedido; aoAjustar: () => void; aoTirar: () => void }) {
  return (
    <li className="border-b border-linha py-3 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="m-0 min-w-0 text-[1.02rem] font-bold [overflow-wrap:anywhere]">{i.nome}</h3>
        <p className="m-0 text-right font-mono text-[1rem] font-bold">{resumoPrecoItem(i)}</p>
      </div>
      <p className="mt-0.5 mb-0 font-mono text-[0.875rem] text-texto-suave">{i.prazo}</p>
      {i.estimativa && (
        <p className="mt-1.5 mb-0 text-[0.875rem]">
          <span className="mr-2 border border-destaque px-1.5 font-mono text-[0.875rem] leading-5 text-destaque">estimativa</span>
          <span className="text-texto-suave">{t.estimativaItem(i.perguntasSemResposta)}</span>
        </p>
      )}

      <details className="mt-1 text-[1rem]">
        <summary className="min-h-alvo cursor-pointer py-2 font-semibold text-destaque">
          {t.mostrarRespostas} <span className="font-normal text-texto-suave">({t.respondidas(i.perguntasRespondidas, i.perguntasTotal)})</span>
        </summary>
        <dl className="m-0 grid gap-2">
          {i.respostas.map((r) => (
            <div key={r.perguntaId}>
              <dt className="text-texto-suave">{r.pergunta}</dt>
              <dd className="m-0 flex items-baseline justify-between gap-3 font-semibold">
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  {r.escolhas.length > 0 ? r.escolhas.join(", ") : <span className="font-normal text-texto-suave">{t.semResposta}</span>}
                </span>
                {r.acrescimo > 0 && <span className="shrink-0 font-mono text-[0.875rem] text-destaque">+ {brl(r.acrescimo)}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </details>

      <div className="mt-1 -ml-3 flex flex-wrap gap-x-1">
        <button type="button" className={botaoTexto} onClick={aoAjustar}>
          {t.ajustar}
          <span className="sr-only">: {i.nome}</span>
        </button>
        <button type="button" className={botaoTexto} onClick={aoTirar}>
          {t.tirar}
          <span className="sr-only">: {i.nome}</span>
        </button>
      </div>
    </li>
  );
}

type Props = {
  aberto: boolean;
  pedido: Pedido;
  /** Aviso de "removido". O painel deixa o resto da página inerte, então ele tem a própria região de status. */
  aviso: string;
  observacoes: string;
  aoMudarObservacoes: (texto: string) => void;
  /** Fecha o carrinho e abre o serviço na aba Orçamento. */
  aoAjustar: (id: string) => void;
  aoTirar: (id: string) => void;
  aoFechar: () => void;
};

/**
 * Painel do carrinho, separado do modal do serviço: gaveta à direita a partir do tablet, tela cheia no celular.
 * É um <dialog> próprio, e nunca fica aberto junto com o modal do serviço (quem abre um fecha o outro antes).
 */
export function PainelCarrinho({ aberto, pedido, aviso, observacoes, aoMudarObservacoes, aoAjustar, aoTirar, aoFechar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const idObs = useId();
  const c = pedido.carrinho;
  const qtd = pedido.itens.length;
  const vazio = qtd === 0;
  const temEstimativa = pedido.itens.some((i) => i.estimativa);
  const { estado, aoEnviar } = useEnvioPedido(pedido);

  // Teclado virtual: o campo em foco rola para o meio da área de rolagem e o rodapé encolhe para só o botão de enviar.
  const [editando, setEditando] = useState(false);
  const aoFocar = (e: FocusEvent<HTMLElement>) => {
    const alvo = e.target;
    if (!(alvo instanceof HTMLInputElement || alvo instanceof HTMLTextAreaElement)) return;
    setEditando(true);
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => alvo.scrollIntoView({ block: "center", behavior: reduzido ? "auto" : "smooth" }), 300);
  };
  const aoDesfocar = () => setEditando(false);

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

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="painel-carrinho-titulo"
      onClose={aoFechar}
      onFocusCapture={aoFocar}
      onBlurCapture={aoDesfocar}
      onClick={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
      className="painel-carrinho m-0 hidden h-dvh max-h-none w-full max-w-none flex-col overflow-hidden border-0 bg-fundo p-0 text-texto open:flex md:ml-auto md:w-[34rem] md:border-l md:border-linha backdrop:bg-[rgb(0_0_0/0.6)]"
    >
      {aberto && (
        <>
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-linha px-4 py-3 md:px-6">
            <h2 id="painel-carrinho-titulo" ref={titulo} tabIndex={-1} className="m-0 py-2 text-[1.35rem] leading-tight outline-none">
              {vazio ? orcamento.barra.rotulo : t.tituloComQtd(qtd)}
            </h2>
            <button
              type="button"
              onClick={aoFechar}
              aria-label={t.fechar}
              className={`grid size-alvo shrink-0 cursor-pointer place-items-center rounded-pequeno border border-linha bg-transparent p-0 text-texto hover:bg-realce active:bg-realce ${focoVisivel}`}
            >
              <IconeFechar />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
            <p className="sr-only" role="status">
              {aviso}
            </p>
            {vazio ? (
              <div className="border border-dashed border-texto-suave p-5">
                <p className="mb-4 text-[1rem]">{t.vazio}</p>
                <button type="button" className={`${botaoCheio} cursor-pointer font-[inherit] ${focoVisivel}`} onClick={aoFechar}>
                  {t.escolher}
                </button>
              </div>
            ) : (
              <>
                <ul className="m-0 list-none border-t-2 border-texto p-0">
                  {pedido.itens.map((i) => (
                    <ItemCarrinho key={i.id} item={i} aoAjustar={() => aoAjustar(i.id)} aoTirar={() => aoTirar(i.id)} />
                  ))}
                </ul>

                <dl className="my-3 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 text-[1rem]">
                  {c.desconto && (
                    <>
                      <dt>{t.soma}</dt>
                      <dd className="m-0 text-right font-mono">{brl(c.somaTabela)}</dd>
                      <dt>{t.desconto(c.desconto.rotulo)}</dt>
                      <dd className="m-0 text-right font-mono text-destaque">- {brl(c.desconto.valor)}</dd>
                    </>
                  )}
                  {c.prazoCombinaveis && c.itens.filter((i) => i.combinavel).length > 1 && (
                    <>
                      <dt>{t.prazoCombinaveis}</dt>
                      <dd className="m-0 text-right font-mono">{c.prazoCombinaveis.texto}</dd>
                    </>
                  )}
                  {c.mensalidade > 0 && (
                    <>
                      <dt>{t.mensalidade}</dt>
                      <dd className="m-0 text-right font-mono">{orcamento.estimativa.valorMensalidade(brl(c.mensalidade))}</dd>
                    </>
                  )}
                </dl>
                {c.desconto && <p className="mb-2 text-[0.875rem] text-texto-suave">{t.descontoNota}</p>}

                <div className="flex items-baseline justify-between gap-3 border-t-2 border-texto pt-2" aria-live="polite" aria-atomic="true">
                  <p className="m-0 text-[1rem] font-semibold">
                    {t.total}
                    {c.totalAPartirDe && <span className="font-normal text-texto-suave"> ({orcamento.estimativa.aPartirDe})</span>}
                  </p>
                  <p className="m-0 font-mono text-[1.7rem] leading-none font-bold tracking-[-0.02em] [word-spacing:-0.3em]">{brl(c.total)}</p>
                </div>
                {temEstimativa && <p className="mt-2 mb-0 text-[0.875rem] font-semibold">{t.avisoEstimativa}</p>}
                {c.temSobConsulta && (
                  <p className="mt-2 mb-0 text-[0.875rem] text-texto-suave">
                    {t.totalSobConsulta}
                    {pedido.itens.filter((i) => i.sobConsulta).map((i) => i.nome).join(", ")}.
                  </p>
                )}
                <p className="mt-1 mb-0 text-[0.875rem] text-texto-suave">{t.notaEstimativa}</p>

                <button type="button" className={`${botao} mt-4 cursor-pointer font-[inherit] ${focoVisivel}`} onClick={aoFechar}>
                  {t.voltar}
                </button>

                <div className="mt-6 grid gap-1">
                  <label htmlFor={idObs} className="text-[1rem] font-semibold">
                    {t.observacoes}
                  </label>
                  <p className="m-0 text-[0.875rem] text-texto-suave">{t.observacoesDica}</p>
                  <textarea
                    id={idObs}
                    rows={3}
                    maxLength={600}
                    value={observacoes}
                    onChange={(ev) => aoMudarObservacoes(ev.target.value)}
                    className={`min-h-24 rounded-pequeno border border-texto-suave bg-superficie px-3 py-2 font-[inherit] text-texto ${focoVisivel}`}
                  />
                </div>

                {emailjsConfigurado() && (
                  <div className="mt-6 border-t-2 border-texto pt-4">
                    <DadosDoPedido pedido={pedido} estado={estado} aoEnviar={aoEnviar} envioAtivo />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Rodapé fixo: o total e as duas formas de fechar, sempre à vista (celular e desktop). */}
          {!vazio && (
            <footer className="shrink-0 border-t-2 border-texto bg-superficie px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6">
              {!editando && (
                <p className="m-0 mb-2 text-[1rem] font-semibold">
                  {t.totalRodape}: <span className="font-mono font-bold [word-spacing:-0.3em]">{totalCurto(pedido)}</span>
                </p>
              )}
              <AcoesDoPedido pedido={pedido} estado={estado} compacto={editando} envioAtivo={emailjsConfigurado()} />
            </footer>
          )}
        </>
      )}
    </dialog>
  );
}
