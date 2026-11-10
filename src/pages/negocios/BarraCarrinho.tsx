import { useEffect, useRef } from "react";
import { orcamento } from "../../content/textos";
import { brl } from "../../shared/lib/formato";
import type { Pedido } from "../../shared/lib/pedido";
import { IconeSeta } from "./icones";

const t = orcamento.barra;

/**
 * Total em texto curto: "R$ 900", "a partir de R$ 900" ou, havendo pergunta sem resposta em algum item,
 * "estimativa a partir de R$ 900" (as respostas que faltam podem somar horas).
 */
export function totalCurto(p: Pedido): string {
  const c = p.carrinho;
  if (c.itens.length === 0) return "";
  if (c.total === 0 && c.temSobConsulta) return orcamento.estimativa.sobConsulta;
  const prefixo = p.itens.some((i) => i.estimativa)
    ? `${orcamento.estimativa.estimativaAPartirDe} `
    : c.totalAPartirDe
      ? `${orcamento.estimativa.aPartirDe} `
      : "";
  return `${prefixo}${brl(c.total)}`;
}

export const ID_BOTAO_BARRA = "barra-carrinho-botao";

type Props = { pedido: Pedido; aoAbrir: () => void };

/**
 * Barra fixa "Carrinho (n) · total", só quando há itens. Abre o painel do carrinho.
 * Mede a própria altura e publica em --altura-barra, que o botão de tema e o fim da página usam para não
 * ficarem por baixo dela (funciona com texto ampliado e com a área segura do iPhone).
 * Fica fora do bloco `.revela`: o transform dele prenderia o `fixed` ao bloco.
 */
export function BarraCarrinho({ pedido, aoAbrir }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const qtd = pedido.itens.length;
  const visivel = qtd > 0;

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
  }, [visivel]);

  if (!visivel) return null;
  const total = totalCurto(pedido);

  return (
    <div
      ref={ref}
      role="region"
      aria-label={t.rotulo}
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-texto bg-fundo px-margem pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <button
        id={ID_BOTAO_BARRA}
        type="button"
        aria-haspopup="dialog"
        aria-label={t.rotuloBotao(qtd, total)}
        onClick={aoAbrir}
        className="mx-auto flex min-h-alvo w-full max-w-hero cursor-pointer items-center justify-between gap-3 border-0 bg-transparent p-0 text-left font-[inherit] text-texto focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco"
      >
        <span className="min-w-0">
          <span className="font-semibold">{t.titulo(qtd)}</span>
          <span aria-hidden="true"> · </span>
          <span className="font-mono font-bold [word-spacing:-0.3em]">{total}</span>
        </span>
        <IconeSeta className="size-5 shrink-0" />
      </button>
    </div>
  );
}
