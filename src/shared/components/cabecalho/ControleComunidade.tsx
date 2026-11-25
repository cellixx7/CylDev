import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Cyl, type ControleCyl } from "../cyl/Cyl";
import { rota } from "../../i18n/rota";

type Props = {
  href: string;
  rotulo: string;
  /** Rótulo curto visível ao lado do Cyl (a partir de sm; no celular não cabe ao lado da marca). */
  rotuloCurto?: string;
};

type Explosao = { x: number; y: number; diametro: number };

/** Ângulos das faíscas (graus). Desencontrados de propósito, para não parecer um asterisco. */
const FAISCAS = [
  { ang: 0, dist: 46 },
  { ang: 40, dist: 38 },
  { ang: 75, dist: 50 },
  { ang: 115, dist: 40 },
  { ang: 150, dist: 48 },
  { ang: 190, dist: 36 },
  { ang: 228, dist: 50 },
  { ang: 268, dist: 40 },
  { ang: 305, dist: 46 },
  { ang: 335, dist: 34 },
];

/** Tempo até trocar de página: o círculo já cobriu a tela. */
const ESPERA_MS = 760;

/** De quanto em quanto tempo o Cyl volta a acenar sozinho (também acena ao carregar, ao passar o mouse e ao focar). */
const CICLO_ACENO_MS = 60000;
/** Espera depois de carregar a página para o primeiro aceno. */
const PRIMEIRO_ACENO_MS = 900;

/** Clique com modificador ou botão do meio: nova aba/janela, o navegador cuida. */
const cliqueEspecial = (e: MouseEvent) => e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

/**
 * Atalho para a área de comunidade, no centro do header: o mascote Cyl acenando.
 * Acena ao carregar, a cada CICLO_ACENO_MS e ao passar o mouse ou focar (sem acenar de novo antes de acabar o ciclo atual).
 * Clicar alinha, cresce e "explode" antes de abrir a área de comunidade. Sem texto de dica: o nome acessível vai no aria-label.
 */
export function ControleComunidade({ href, rotulo, rotuloCurto }: Props) {
  const [explosao, setExplosao] = useState<Explosao | null>(null);
  const ref = useRef<HTMLAnchorElement>(null);
  const cyl = useRef<ControleCyl>(null);
  const acenando = useRef(false);

  const acenar = () => {
    if (acenando.current) return;
    acenando.current = cyl.current?.tocar() ?? false;
  };
  const acenarRef = useRef(acenar);
  acenarRef.current = acenar;

  useEffect(() => {
    const primeiro = window.setTimeout(() => acenarRef.current(), PRIMEIRO_ACENO_MS);
    const ciclo = window.setInterval(() => acenarRef.current(), CICLO_ACENO_MS);
    return () => {
      window.clearTimeout(primeiro);
      window.clearInterval(ciclo);
    };
  }, []);

  // Voltar pelo histórico (bfcache) devolve a página como estava: limpa a animação.
  useEffect(() => {
    const limpar = (e: PageTransitionEvent) => {
      if (e.persisted) setExplosao(null);
    };
    window.addEventListener("pageshow", limpar);
    return () => window.removeEventListener("pageshow", limpar);
  }, []);

  useEffect(() => {
    if (!explosao) return;
    const id = window.setTimeout(() => window.location.assign(rota(href)), ESPERA_MS);
    return () => window.clearTimeout(id);
  }, [explosao, href]);

  const clicar = (e: MouseEvent<HTMLAnchorElement>) => {
    if (cliqueEspecial(e)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    if (explosao || !ref.current) return;

    const r = ref.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const largura = Math.max(x, window.innerWidth - x);
    const altura = Math.max(y, window.innerHeight - y);
    setExplosao({ x, y, diametro: 2 * Math.hypot(largura, altura) + 4 });
  };

  const explodindo = explosao !== null;

  return (
    <span className="relative inline-flex">
      <a
        ref={ref}
        href={rota(href)}
        aria-label={rotulo}
        title={rotulo}
        onClick={clicar}
        onPointerEnter={(e) => e.pointerType === "mouse" && acenar()}
        onFocus={acenar}
        className="group relative inline-flex h-14 min-w-14 items-center justify-center gap-2 rounded-full text-texto no-underline sm:pr-3 [-webkit-tap-highlight-color:transparent]"
      >
        <span className={`block ${explodindo ? "animate-controle-explodir" : ""}`}>
          <Cyl ref={cyl} autoplay={false} size={56} recorte="aceno" animation="wave" onAnimationComplete={() => (acenando.current = false)} />
        </span>
        {rotuloCurto && <span className="hidden text-base font-semibold sm:inline">{rotuloCurto}</span>}
        {explodindo && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-0">
            {FAISCAS.map((f, i) => (
              <span
                key={f.ang}
                className={`animate-controle-faisca absolute top-1/2 left-1/2 -mt-[3px] h-[6px] w-[10px] origin-left rounded-full ${i % 2 ? "bg-lilas" : "bg-serie-1"}`}
                style={{ "--ang": `${f.ang}deg`, "--dist": `${f.dist}px` } as CSSProperties}
              />
            ))}
          </span>
        )}
      </a>
      {explosao &&
        createPortal(
          <div
            aria-hidden="true"
            className="animate-controle-cobrir pointer-events-none fixed z-[100] rounded-full bg-roxo-noite"
            style={{ left: explosao.x, top: explosao.y, width: explosao.diametro, height: explosao.diametro }}
          />,
          document.body,
        )}
    </span>
  );
}
