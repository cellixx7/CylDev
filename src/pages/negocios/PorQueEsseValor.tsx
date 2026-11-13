import { useEffect, useId, useRef, useState } from "react";
import { VALOR_HORA_EXTRA } from "../../content/orcamento";
import { orcamento } from "../../content/textos";
import { botao } from "../../shared/estilos";
import { explicarValor, type ExplicacaoValor, type ItemExplicado } from "../../shared/lib/explicacaoValor";
import { brl, horasTexto } from "../../shared/lib/formato";
import { calcularCarrinho, descontoPilotoAtual, type Carrinho, type Respostas } from "../../shared/lib/orcamento";
import { IconeFechar } from "./icones";
import { useTravaRolagem } from "./useTravaRolagem";

const t = orcamento.valor;
const p = t.pedido;

const focoVisivel = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco";
const botaoTexto = `min-h-alvo cursor-pointer border-0 bg-transparent px-0 py-2 text-left font-[inherit] text-[1rem] font-semibold text-destaque underline underline-offset-4 ${focoVisivel}`;
const celula = "border-b border-linha py-1.5 align-baseline";

// Parte 1: geral ---------------------------------------------------------------------------

function ComoOPrecoEMontado() {
  const g = t.geral;
  const piloto = descontoPilotoAtual();
  const linhas = [g.precoBase, g.horaExtra(brl(VALOR_HORA_EXTRA)), g.combo, g.piloto(piloto?.percentual ?? null), g.regras, g.estimativa];
  return (
    <section aria-labelledby="valor-geral-titulo">
      <h3 id="valor-geral-titulo" className="mt-0 mb-2 text-[1.1rem]">
        {g.titulo}
      </h3>
      <ul className="m-0 grid list-disc gap-2 pl-5 text-[1rem]">
        {linhas.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </section>
  );
}

// Parte 2: no pedido -----------------------------------------------------------------------

function TabelaDoItem({ item: i }: { item: ItemExplicado }) {
  return (
    <section className="mb-5" aria-labelledby={`valor-item-${i.id}`}>
      <h4 id={`valor-item-${i.id}`} className="mt-0 mb-1 text-[1rem] font-bold [overflow-wrap:anywhere]">
        {i.nome}
      </h4>
      {i.sobConsulta ? (
        <p className="m-0 text-[1rem] text-texto-suave">{p.sobConsulta}</p>
      ) : (
        <>
          <table className="w-full border-collapse text-[1rem]">
            <caption className="sr-only">{i.nome}</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">{p.colunaItem}</th>
                <th scope="col">{p.colunaValor}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className={`${celula} text-left font-normal`}>
                  {p.base}
                </th>
                <td className={`${celula} pl-3 text-right font-mono`}>{brl(i.precoBase ?? 0)}</td>
              </tr>
              {i.extras.map((x) => (
                <tr key={x.pergunta}>
                  <th scope="row" className={`${celula} text-left font-normal`}>
                    <span className="[overflow-wrap:anywhere]">
                      {x.pergunta}: {x.resposta}
                    </span>
                    {x.horas !== null && (
                      <span className="block text-[0.875rem] text-texto-suave">{p.horas(horasTexto(x.horas), brl(VALOR_HORA_EXTRA))}</span>
                    )}
                  </th>
                  <td className={`${celula} pl-3 text-right font-mono`}>+ {brl(x.valor)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" className="py-1.5 text-left font-bold">
                  {p.soma}
                </th>
                <td className="py-1.5 pl-3 text-right font-mono font-bold">{brl(i.preco ?? 0)}</td>
              </tr>
            </tfoot>
          </table>
          {i.horasACombinar && <p className="mt-1 mb-0 text-[0.875rem] text-texto-suave">{p.horasACombinar}</p>}
          {i.semResposta.length > 0 && <p className="mt-1 mb-0 text-[0.875rem] text-texto-suave">{p.semResposta(i.semResposta.join(", "))}</p>}
          {i.mensalidade !== null && <p className="mt-1 mb-0 text-[0.875rem] text-texto-suave">{p.mensalidade(brl(i.mensalidade))}</p>}
        </>
      )}
    </section>
  );
}

function PorqueDoDesconto({ e }: { e: ExplicacaoValor }) {
  const d = e.desconto;
  if (!d) return <p className="mt-1 mb-0 text-[0.875rem] text-texto-suave">{p.semDesconto}</p>;
  const linhas: string[] = [];
  linhas.push(d.tipo === "combo" ? p.comboPorque(d.qtdCombinaveis, brl(d.base)) : p.pilotoPorque(brl(d.base)));
  if (d.alternativa) {
    if (d.empate) linhas.push(p.empate(brl(d.valor)));
    else linhas.push(d.tipo === "piloto" ? p.pilotoMaior(brl(d.alternativa.valor), brl(d.valor)) : p.comboMaior(brl(d.alternativa.valor), brl(d.valor)));
  }
  return (
    <>
      {linhas.map((l) => (
        <p key={l} className="mt-1 mb-0 text-[0.875rem] text-texto-suave">
          {l}
        </p>
      ))}
    </>
  );
}

function NoSeuPedido({ e }: { e: ExplicacaoValor }) {
  const mudam = e.itens.filter((i) => i.mudariam.length > 0);
  return (
    <section aria-labelledby="valor-pedido-titulo">
      <h3 id="valor-pedido-titulo" className="mt-0 mb-3 text-[1.1rem]">
        {p.titulo}
      </h3>
      {e.itens.map((i) => (
        <TabelaDoItem key={i.id} item={i} />
      ))}

      <h4 className="mt-0 mb-1 text-[1rem] font-bold">{p.fechamento}</h4>
      <table className="w-full border-collapse text-[1rem]">
        <caption className="sr-only">{p.fechamento}</caption>
        <tbody>
          <tr>
            <th scope="row" className={`${celula} text-left font-normal`}>
              {p.somaTabela}
            </th>
            <td className={`${celula} pl-3 text-right font-mono`}>{brl(e.somaTabela)}</td>
          </tr>
          {e.desconto && (
            <tr>
              <th scope="row" className={`${celula} text-left font-normal`}>
                {p.descontoLinha(`${e.desconto.tipo === "combo" ? "combo" : "piloto"} ${e.desconto.percentual}%`)}
              </th>
              <td className={`${celula} pl-3 text-right font-mono`}>- {brl(e.desconto.valor)}</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className="py-2 text-left font-bold">
              {e.totalAPartirDe ? p.totalAPartirDe : p.total}
            </th>
            <td className="py-2 pl-3 text-right font-mono text-[1.15rem] font-bold">{brl(e.total)}</td>
          </tr>
        </tfoot>
      </table>
      <PorqueDoDesconto e={e} />
      {e.temSemResposta && <p className="mt-2 mb-0 text-[0.875rem] font-semibold">{p.estimativa}</p>}

      {mudam.length > 0 && (
        <p className="mt-4 mb-0 text-[1rem]">
          <span className="font-semibold">{p.mudaria}: </span>
          {mudam.map((i) => p.mudariaLinha(i.nome, i.mudariam.join(", "))).join("; ")}. <span className="text-texto-suave">{p.mudariaNota}</span>
        </p>
      )}
    </section>
  );
}

// Dialog -----------------------------------------------------------------------------------

type DialogoProps = {
  aberto: boolean;
  carrinho: Carrinho;
  respostas: Record<string, Respostas>;
  aoFechar: () => void;
};

/**
 * <dialog> nativo, como os outros: showModal() (foco inicial no título, Esc fecha), rolagem interna, dvh e safe-area.
 * Pode abrir por cima do modal do serviço ou do painel do carrinho (camada superior do navegador): o Esc fecha só ele.
 * Sem hash na URL, de propósito: #valor não é um serviço e o `popstate` do modal o trataria como "nenhum serviço".
 */
export function DialogoValor({ aberto, carrinho, respostas, aoFechar }: DialogoProps) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const idTitulo = useId();

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

  const explicacao = aberto && carrinho.itens.length > 0 ? explicarValor(carrinho, respostas) : null;

  return (
    <dialog
      ref={dialogo}
      aria-labelledby={idTitulo}
      onClose={(e) => {
        // O React propaga o `close` pela árvore: sem isto, fechar este diálogo fecharia também o modal ou o painel que o contém.
        e.stopPropagation();
        aoFechar();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
      className="dialogo-valor m-0 hidden h-dvh max-h-none w-full max-w-none flex-col overflow-hidden border-0 bg-fundo p-0 text-texto open:flex md:m-auto md:h-auto md:max-h-[90dvh] md:max-w-[40rem] md:border md:border-linha backdrop:bg-[rgb(0_0_0/0.6)]"
    >
      {aberto && (
        <>
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-linha px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 md:px-6">
            <h2 id={idTitulo} ref={titulo} tabIndex={-1} className="m-0 py-2 text-[1.35rem] leading-tight outline-none">
              {t.titulo}
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
            <ComoOPrecoEMontado />
            <div className="mt-6 border-t-2 border-texto pt-5">
              {explicacao ? <NoSeuPedido e={explicacao} /> : <p className="m-0 text-[1rem] text-texto-suave">{t.vazio}</p>}
            </div>
          </div>

          <footer className="shrink-0 border-t border-linha bg-superficie px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6">
            <button type="button" className={`${botao} w-full cursor-pointer font-[inherit] ${focoVisivel}`} onClick={aoFechar}>
              {t.fecharRodape}
            </button>
          </footer>
        </>
      )}
    </dialog>
  );
}

type Props = {
  /** Serviços que a explicação cobre. Vazio: só a parte geral. */
  ids: string[];
  respostas: Record<string, Respostas>;
  /** Já calculado por quem mostra o total (carrinho). Sem ele, é calculado aqui a partir de `ids`. */
  carrinho?: Carrinho;
};

/** Botão "Por que esse valor?" e o diálogo dele. O foco volta ao botão ao fechar. */
export function PorQueEsseValor({ ids, respostas, carrinho }: Props) {
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const c = carrinho ?? calcularCarrinho(ids, respostas);

  const fechar = () => {
    setAberto(false);
    botaoRef.current?.focus({ preventScroll: true });
  };

  return (
    <>
      <button ref={botaoRef} type="button" className={botaoTexto} aria-haspopup="dialog" onClick={() => setAberto(true)}>
        {t.botao}
      </button>
      <DialogoValor aberto={aberto} carrinho={c} respostas={respostas} aoFechar={fechar} />
    </>
  );
}
