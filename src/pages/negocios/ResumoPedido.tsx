import { useEffect, useRef } from "react";
import { orcamento } from "../../content/textos";
import { botao, botaoCheio } from "../../shared/estilos";
import { brl } from "../../shared/lib/formato";
import { type Pedido } from "../../shared/lib/pedido";
import { IconeSeta } from "./icones";

const t = orcamento.resumo;
const MAX_LINHAS = 3;

/** Total em texto curto: "R$ 900" ou "a partir de R$ 900". */
export function totalCurto(p: Pedido): string {
  const c = p.carrinho;
  if (c.itens.length === 0) return "";
  if (c.total === 0 && c.temSobConsulta) return orcamento.estimativa.sobConsulta;
  return `${c.totalAPartirDe ? `${orcamento.estimativa.aPartirDe} ` : ""}${brl(c.total)}`;
}

/** Resumo compacto do pedido para a lateral do desktop: poucas linhas, o total e o caminho para a revisão. */
export function ResumoPedido({ pedido, aoRevisar }: { pedido: Pedido; aoRevisar: () => void }) {
  const itens = pedido.itens;
  const vistos = itens.slice(0, MAX_LINHAS);
  const resto = itens.length - vistos.length;

  return (
    <section className="border border-linha p-4" aria-labelledby="orc-resumo-titulo">
      <h3 id="orc-resumo-titulo" className="mb-2 text-[1rem] font-bold">
        {t.titulo}
      </h3>
      {itens.length === 0 ? (
        <p className="m-0 text-[0.9rem] text-texto-suave">{t.vazio}</p>
      ) : (
        <>
          <ul className="m-0 list-none p-0 text-[0.9rem]">
            {vistos.map((i) => (
              <li key={i.id} className="flex items-baseline justify-between gap-3 border-b border-linha py-1.5">
                <span className="min-w-0 font-semibold [overflow-wrap:anywhere]">{i.nome}</span>
                <span className="shrink-0 text-right font-mono text-[0.8rem] text-texto-suave">
                  {i.preco === null ? orcamento.lista.sobConsulta : brl(i.preco)}
                </span>
              </li>
            ))}
          </ul>
          {resto > 0 && <p className="mt-1.5 mb-0 text-[0.85rem] text-texto-suave">{t.maisItens(resto)}</p>}
          <div className="mt-3 flex items-baseline justify-between gap-3" aria-live="polite" aria-atomic="true">
            <span className="text-[0.9rem] font-semibold">{t.total}</span>
            <span className="text-right font-mono text-[1.15rem] font-bold [word-spacing:-0.3em]">{totalCurto(pedido)}</span>
          </div>
          <button type="button" className={`${botao} mt-3 w-full cursor-pointer justify-center gap-2 font-[inherit]`} onClick={aoRevisar}>
            {orcamento.estimativa.verPedido}
            <IconeSeta />
          </button>
        </>
      )}
    </section>
  );
}

type BarraProps = {
  pedido: Pedido;
  /** Serviço em configuração ainda fora do pedido: a barra oferece adicioná-lo. */
  podeAdicionar: boolean;
  aoAdicionar: () => void;
  aoRevisar: () => void;
};

/**
 * Barra fixa do celular. Esquerda: o pedido (quantidade e total) e o caminho para revisá-lo.
 * Direita: uma ação só. Configurando um serviço novo, "Adicionar"; nos demais casos, "Ver pedido".
 * Mede a própria altura e publica em --altura-barra, que o botão de tema e o fim da página usam
 * para não ficarem por baixo dela (funciona com texto ampliado e com a área segura do iPhone).
 */
export function BarraPedidoMobile({ pedido, podeAdicionar, aoAdicionar, aoRevisar }: BarraProps) {
  const ref = useRef<HTMLDivElement>(null);
  const qtd = pedido.itens.length;
  const b = orcamento.barra;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const raiz = document.documentElement;
    const medir = () => raiz.style.setProperty("--altura-barra", `${el.offsetHeight}px`);
    medir();
    if (typeof ResizeObserver === "undefined") return () => raiz.style.removeProperty("--altura-barra");
    const o = new ResizeObserver(medir);
    o.observe(el);
    return () => {
      o.disconnect();
      raiz.style.removeProperty("--altura-barra");
    };
  }, []);

  return (
    <div
      ref={ref}
      role="region"
      aria-label={b.rotulo}
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t-2 border-texto bg-fundo px-margem pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <button
        type="button"
        onClick={aoRevisar}
        disabled={qtd === 0}
        className="min-h-alvo min-w-0 cursor-pointer border-0 bg-transparent p-0 text-left font-[inherit] text-texto focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco disabled:cursor-default"
      >
        <span className="block text-[0.8rem] leading-tight text-texto-suave">{qtd === 0 ? b.vazio : b.itens(qtd)}</span>
        {qtd > 0 && <span className="block font-mono text-[1.05rem] leading-tight font-bold [word-spacing:-0.3em]">{totalCurto(pedido)}</span>}
      </button>
      {podeAdicionar ? (
        <button type="button" className={`${botaoCheio} shrink-0 cursor-pointer font-[inherit]`} onClick={aoAdicionar}>
          {b.adicionar}
        </button>
      ) : (
        qtd > 0 && (
          <button type="button" className={`${botaoCheio} shrink-0 cursor-pointer gap-2 font-[inherit]`} onClick={aoRevisar}>
            {b.verPedido}
            <IconeSeta />
          </button>
        )
      )}
    </div>
  );
}
