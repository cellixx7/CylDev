import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { comum } from "../../content/textos";
import { focoVisivel } from "../estilos";

const t = comum.carrossel;

const setaBase = `inline-flex h-alvo w-alvo cursor-pointer items-center justify-center rounded-full border border-texto bg-transparent p-0 text-texto transition-colors hover:bg-realce active:bg-realce disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent ${focoVisivel}`;

type Props = {
  /** Os filhos são `<li>`. Do tablet (md) em diante vira a grade `gradeMd` e os controles somem. */
  children: ReactNode;
  as?: "ul" | "ol";
  rotulo?: string;
  /** Classes da grade no tablet/desktop, como string literal completa (o Tailwind lê texto). */
  gradeMd: string;
};

/**
 * Lista em faixa deslizante no celular, como o carrossel do Instagram: arrasta (snap) ou usa as setas.
 * Sem JavaScript de rolagem própria: é `overflow-x` com `scroll-snap`; o código só lê a posição para as
 * setas e o "2 de 6". A lista continua sendo `ul/ol` com `li`, então leitor de tela lê tudo normalmente.
 */
export function Carrossel({ children, as: Lista = "ul", rotulo, gradeMd }: Props) {
  const faixa = useRef<HTMLElement | null>(null);
  const [atual, setAtual] = useState(0);
  const total = Children.count(children);

  const ler = useCallback(() => {
    const el = faixa.current;
    if (!el || el.children.length < 2) return;
    const passo = (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
    if (passo <= 0) return;
    const fim = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setAtual(fim ? el.children.length - 1 : Math.round(el.scrollLeft / passo));
  }, []);

  useEffect(() => {
    ler();
    window.addEventListener("resize", ler);
    return () => window.removeEventListener("resize", ler);
  }, [ler]);

  const ir = (indice: number) => {
    const el = faixa.current;
    const alvo = el?.children[Math.max(0, Math.min(total - 1, indice))] as HTMLElement | undefined;
    if (!el || !alvo) return;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: alvo.offsetLeft - (el.clientWidth - alvo.offsetWidth) / 2, behavior: reduzido ? "auto" : "smooth" });
  };

  return (
    <div>
      <Lista
        ref={faixa as never}
        aria-label={rotulo}
        onScroll={ler}
        className={`-mx-margem my-0 flex list-none snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-margem px-margem pb-1 pt-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>li]:w-[85%] [&>li]:shrink-0 [&>li]:snap-center md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 md:[&>li]:w-auto ${gradeMd}`}
      >
        {children}
      </Lista>
      <div className="mt-3 flex items-center justify-between md:hidden">
        <button type="button" className={setaBase} onClick={() => ir(atual - 1)} disabled={atual <= 0} aria-label={t.anterior}>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <p className="m-0 font-mono text-menor text-texto-suave" aria-live="polite">
          {t.posicao(atual + 1, total)}
        </p>
        <button type="button" className={setaBase} onClick={() => ir(atual + 1)} disabled={atual >= total - 1} aria-label={t.proximo}>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
