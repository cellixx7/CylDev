import { useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, type Ref } from "react";
import { ANIMACOES, quadros, type NomeAnimacao } from "./cylAnimacoes";
import { cylSvg } from "./cylSvg";

/** Recortes do quadro do mestre (580×870). A mão do aceno chega perto da borda direita, então o recorte do aceno é mais largo. */
export const RECORTES = {
  /** Corpo inteiro, como no mestre. */
  completo: "-15 40 620 870",
  /** Da cabeça à cintura, com a mão acenando (sem as pernas); alargado à direita para a mão não cortar. */
  aceno: "-10 48 600 600",
  /** Só o rosto e os ombros (avatar do chat). */
  rosto: "40 115 470 470",
} as const;

/** `tocar` devolve true se a animação começou (false com movimento reduzido, aba oculta ou sem animação). */
export type ControleCyl = { tocar: () => boolean };

type Props = {
  animation?: NomeAnimacao;
  /** Lado em px (número) ou medida CSS. O quadro é sempre proporcional ao recorte. */
  size?: number | string;
  /** Repete a animação, com `pausaMs` entre os ciclos. */
  loop?: boolean;
  /** Intervalo entre ciclos quando `loop` está ligado. */
  pausaMs?: number;
  /** Roda ao montar. Sem isso, só roda por `ref.tocar()`. */
  autoplay?: boolean;
  background?: "transparent" | "circle";
  recorte?: keyof typeof RECORTES;
  /** Nome acessível. Sem ele o desenho é decorativo (aria-hidden), para uso dentro de botão ou link. */
  titulo?: string;
  onAnimationComplete?: () => void;
  className?: string;
  ref?: Ref<ControleCyl>;
};

const reduzido = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Mascote Cyl em SVG inline. O desenho vem de `cylSvg.ts`, o movimento de `cylAnimacoes.ts` (Web Animations API, só transform e
 * opacity) e este componente junta os dois. Respeita `prefers-reduced-motion` (fica na pose parada) e pausa com a aba oculta.
 */
export function Cyl({ animation = "idle", size = 240, loop = false, pausaMs = 4000, autoplay = true, background = "transparent", recorte = "aceno", titulo, onAnimationComplete, className, ref }: Props) {
  const prefixo = `cyl${useId().replace(/[^a-zA-Z0-9]/g, "")}-`;
  const raiz = useRef<SVGSVGElement>(null);
  const rodando = useRef<Animation[]>([]);
  const timer = useRef<number | undefined>(undefined);
  const aoTerminar = useRef(onAnimationComplete);
  aoTerminar.current = onAnimationComplete;

  const html = useMemo(() => {
    let s = cylSvg(prefixo).replace(/(data-parte="hand-left-wave"[^>]*?) display="none"/, '$1 opacity="0"');
    if (background === "circle") s = s.replace(/(data-parte="background"[^>]*?) display="none"/, "$1");
    return s;
  }, [prefixo, background]);

  const parar = useCallback(() => {
    window.clearTimeout(timer.current);
    for (const a of rodando.current) a.cancel();
    rodando.current = [];
  }, []);

  const tocar = useCallback(() => {
    const def = ANIMACOES[animation];
    const svg = raiz.current;
    if (!svg || def.faixas.length === 0 || reduzido() || document.hidden) return false;
    parar();
    const anims = def.faixas.flatMap((faixa) => {
      const alvo = svg.querySelector<SVGElement>(`[data-parte="${faixa.parte}"]`);
      if (!alvo) return [];
      alvo.style.transformOrigin = "0 0";
      return [alvo.animate(quadros(faixa), { duration: def.duracaoMs, fill: "none" })];
    });
    rodando.current = anims;
    Promise.all(anims.map((a) => a.finished)).then(
      () => {
        if (rodando.current !== anims) return;
        rodando.current = [];
        aoTerminar.current?.();
      },
      () => {}, // cancelada (reinício ou desmontagem)
    );
    return true;
  }, [animation, parar]);

  useImperativeHandle(ref, () => ({ tocar }), [tocar]);

  // Autoplay e repetição.
  useEffect(() => {
    if (!autoplay) return;
    tocar();
    if (!loop) return;
    const def = ANIMACOES[animation];
    const id = window.setInterval(tocar, def.duracaoMs + pausaMs);
    return () => window.clearInterval(id);
  }, [autoplay, loop, pausaMs, animation, tocar]);

  // Aba oculta: pausa; volta a rodar ao reaparecer. Preferência de movimento reduzido: para na hora.
  useEffect(() => {
    const visibilidade = () => {
      for (const a of rodando.current) document.hidden ? a.pause() : a.play();
    };
    const mm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const movimento = () => mm.matches && parar();
    document.addEventListener("visibilitychange", visibilidade);
    mm.addEventListener("change", movimento);
    return () => {
      document.removeEventListener("visibilitychange", visibilidade);
      mm.removeEventListener("change", movimento);
      parar();
    };
  }, [parar]);

  const caixa = RECORTES[recorte].split(" ").map(Number);
  const proporcao = caixa[2] / caixa[3];
  const lado = typeof size === "number" ? `${size}px` : size;
  const decorativo = !titulo;

  return (
    <svg
      ref={raiz}
      viewBox={RECORTES[recorte]}
      role={decorativo ? undefined : "img"}
      aria-label={titulo}
      aria-hidden={decorativo ? true : undefined}
      focusable="false"
      className={className}
      style={{ height: lado, width: `calc(${lado} * ${proporcao})`, display: "block" }}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
