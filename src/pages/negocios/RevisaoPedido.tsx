import { useId, type Ref } from "react";
import { orcamento } from "../../content/textos";
import { botao, botaoCheio } from "../../shared/estilos";
import { brl } from "../../shared/lib/formato";
import { resumoPrecoItem, type ItemPedido, type Pedido } from "../../shared/lib/pedido";
import { CheckoutPedido } from "./CheckoutPedido";

const t = orcamento.carrinho;

const botaoTexto =
  "min-h-alvo cursor-pointer border-0 bg-transparent px-3 font-[inherit] text-[0.95rem] font-semibold text-destaque underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco";

function ItemRevisao({ item: i, aoEditar, aoTirar }: { item: ItemPedido; aoEditar: () => void; aoTirar: () => void }) {
  return (
    <li className="border-b border-linha py-3 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="m-0 min-w-0 text-[1.02rem] font-bold [overflow-wrap:anywhere]">{i.nome}</h4>
        <p className="m-0 text-right font-mono text-[0.95rem] font-bold">{resumoPrecoItem(i)}</p>
      </div>
      <p className="mt-0.5 mb-0 font-mono text-[0.82rem] text-texto-suave">{i.prazo}</p>

      <details className="mt-1 text-[0.9rem]">
        <summary className="min-h-alvo cursor-pointer py-2 font-semibold text-destaque">
          {t.mostrarRespostas} <span className="font-normal text-texto-suave">({t.respondidas(i.perguntasRespondidas, i.perguntasTotal)})</span>
        </summary>
        <dl className="m-0 grid gap-2">
          {i.respostas.map((r) => (
            <div key={r.perguntaId}>
              <dt className="text-texto-suave">{r.pergunta}</dt>
              <dd className="m-0 flex items-baseline justify-between gap-3 font-semibold">
                <span className="min-w-0 [overflow-wrap:anywhere]">{r.escolhas.length > 0 ? r.escolhas.join(", ") : <span className="font-normal text-texto-suave">{t.semResposta}</span>}</span>
                {r.acrescimo > 0 && <span className="shrink-0 font-mono text-[0.82rem] text-destaque">+ {brl(r.acrescimo)}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </details>

      <div className="mt-1 -ml-3 flex flex-wrap gap-x-1">
        <button type="button" className={botaoTexto} onClick={aoEditar}>
          {t.editar}
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
  pedido: Pedido;
  observacoes: string;
  aoMudarObservacoes: (texto: string) => void;
  aoEditar: (id: string) => void;
  aoTirar: (id: string) => void;
  aoEscolherServico: () => void;
  refTitulo?: Ref<HTMLHeadingElement>;
};

/** Etapa 3: revisão completa (itens, respostas, descontos, total), observações e as duas formas de enviar. */
export function RevisaoPedido({ pedido, observacoes, aoMudarObservacoes, aoEditar, aoTirar, aoEscolherServico, refTitulo }: Props) {
  const c = pedido.carrinho;
  const vazio = pedido.itens.length === 0;
  const idObs = useId();

  return (
    <div className="max-w-3xl">
      <h3 ref={refTitulo} tabIndex={-1} className="mb-3 text-[1.35rem] leading-tight font-bold outline-none">
        {t.titulo}
      </h3>

      {vazio ? (
        <div className="border border-dashed border-texto-suave p-5">
          <p className="mb-4 text-[0.95rem]">{t.vazio}</p>
          <button type="button" className={`${botaoCheio} cursor-pointer font-[inherit]`} onClick={aoEscolherServico}>
            {t.escolher}
          </button>
        </div>
      ) : (
        <>
          <ul className="m-0 list-none border-t-2 border-texto p-0">
            {pedido.itens.map((i) => (
              <ItemRevisao key={i.id} item={i} aoEditar={() => aoEditar(i.id)} aoTirar={() => aoTirar(i.id)} />
            ))}
          </ul>

          <dl className="my-3 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 text-[0.92rem]">
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
          {c.desconto && <p className="mb-2 text-[0.82rem] text-texto-suave">{t.descontoNota}</p>}

          <div className="flex items-baseline justify-between gap-3 border-t-2 border-texto pt-2" aria-live="polite" aria-atomic="true">
            <p className="m-0 text-[0.95rem] font-semibold">
              {t.total}
              {c.totalAPartirDe && <span className="font-normal text-texto-suave"> ({orcamento.estimativa.aPartirDe})</span>}
            </p>
            <p className="m-0 font-mono text-[1.7rem] leading-none font-bold tracking-[-0.02em] [word-spacing:-0.3em]">{brl(c.total)}</p>
          </div>
          {c.temSobConsulta && (
            <p className="mt-2 mb-0 text-[0.85rem] text-texto-suave">
              {t.totalSobConsulta}
              {pedido.itens.filter((i) => i.sobConsulta).map((i) => i.nome).join(", ")}.
            </p>
          )}
          <p className="mt-1 mb-0 text-[0.82rem] text-texto-suave">{t.notaEstimativa}</p>

          <button type="button" className={`${botao} mt-4 cursor-pointer font-[inherit]`} onClick={aoEscolherServico}>
            {t.voltar}
          </button>

          <div className="mt-6 grid gap-1">
            <label htmlFor={idObs} className="text-[0.9rem] font-semibold">
              {t.observacoes}
            </label>
            <p className="m-0 text-[0.85rem] text-texto-suave">{t.observacoesDica}</p>
            <textarea
              id={idObs}
              rows={3}
              maxLength={600}
              value={observacoes}
              onChange={(ev) => aoMudarObservacoes(ev.target.value)}
              className="min-h-24 rounded-pequeno border border-texto-suave bg-superficie px-3 py-2 font-[inherit] text-texto focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco"
            />
          </div>

          <div className="mt-6 border-t-2 border-texto pt-4">
            <CheckoutPedido pedido={pedido} />
          </div>
        </>
      )}
    </div>
  );
}
