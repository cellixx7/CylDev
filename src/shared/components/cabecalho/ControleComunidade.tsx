import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";

type Props = {
  href: string;
  rotulo: string;
  dicaTitulo: string;
  dicaTexto: string;
  dicaAcao: string;
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

/** Clique com modificador ou botão do meio: nova aba/janela, o navegador cuida. */
const cliqueEspecial = (e: MouseEvent) =>
  e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

/**
 * Controle de videogame no centro do header.
 * Mouse: passar por cima inclina e mostra a dica; clicar alinha, cresce e "explode"
 * antes de abrir a área de comunidade.
 * Toque: o primeiro toque só abre a dica (com um botão "Ir para o CylDev");
 * o segundo toque no controle, ou o toque no botão, faz a explosão.
 */
export function ControleComunidade({ href, rotulo, dicaTitulo, dicaTexto, dicaAcao }: Props) {
  const [explosao, setExplosao] = useState<Explosao | null>(null);
  const [dicaAberta, setDicaAberta] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const caixaRef = useRef<HTMLSpanElement>(null);
  // Tipo do último ponteiro que encostou no controle ("mouse", "touch" ou "pen").
  const ponteiro = useRef<string>("mouse");

  // Voltar pelo histórico (bfcache) devolve a página como estava: limpa a animação e a dica.
  useEffect(() => {
    const limpar = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      setExplosao(null);
      setDicaAberta(false);
    };
    window.addEventListener("pageshow", limpar);
    return () => window.removeEventListener("pageshow", limpar);
  }, []);

  useEffect(() => {
    if (!explosao) return;
    const id = window.setTimeout(() => window.location.assign(href), ESPERA_MS);
    return () => window.clearTimeout(id);
  }, [explosao, href]);

  // Dica aberta pelo toque: fecha ao tocar fora dela, ao rolar a página ou com Esc.
  useEffect(() => {
    if (!dicaAberta) return;
    const tocarFora = (e: globalThis.PointerEvent) => {
      if (!caixaRef.current?.contains(e.target as Node)) setDicaAberta(false);
    };
    const fechar = () => setDicaAberta(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    document.addEventListener("pointerdown", tocarFora);
    document.addEventListener("keydown", esc);
    window.addEventListener("scroll", fechar, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", tocarFora);
      document.removeEventListener("keydown", esc);
      window.removeEventListener("scroll", fechar);
    };
  }, [dicaAberta]);

  const explodir = (e: MouseEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    if (explosao || !ref.current) return;

    const r = ref.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const largura = Math.max(x, window.innerWidth - x);
    const altura = Math.max(y, window.innerHeight - y);
    setDicaAberta(false);
    setExplosao({ x, y, diametro: 2 * Math.hypot(largura, altura) + 4 });
  };

  const registrarPonteiro = (e: PointerEvent) => {
    ponteiro.current = e.pointerType;
  };

  const clicarControle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (cliqueEspecial(e)) return;
    // Primeiro toque: só mostra a dica. O segundo segue para a explosão.
    // detail 0 = Enter no teclado: vale como clique direto, mesmo que antes tenha havido toque.
    const toque = e.detail !== 0 && ponteiro.current !== "mouse";
    if (toque && !dicaAberta) {
      e.preventDefault();
      setDicaAberta(true);
      return;
    }
    explodir(e);
  };

  const clicarAcao = (e: MouseEvent<HTMLAnchorElement>) => {
    if (cliqueEspecial(e)) return;
    explodir(e);
  };

  const explodindo = explosao !== null;

  const visivel = "visible translate-y-0 opacity-100";
  const estadoDica = explodindo
    ? "invisible opacity-0"
    : dicaAberta
      ? `${visivel} pointer-events-auto`
      : "pointer-events-none invisible translate-y-1 opacity-0 group-focus-within/dica:visible group-focus-within/dica:translate-y-0 group-focus-within/dica:opacity-100 group-hover/dica:visible group-hover/dica:translate-y-0 group-hover/dica:opacity-100 group-hover/dica:delay-150";

  return (
    <span ref={caixaRef} className="group/dica relative inline-flex">
      <a
        ref={ref}
        href={href}
        aria-label={rotulo}
        aria-describedby="dica-comunidade"
        aria-expanded={dicaAberta}
        onPointerDown={registrarPonteiro}
        onClick={clicarControle}
        className="group relative inline-flex size-12 items-center justify-center rounded-full text-texto no-underline [-webkit-tap-highlight-color:transparent]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={
            explodindo
              ? "animate-controle-explodir"
              : `transition-transform duration-300 ease-[cubic-bezier(0.3,1.4,0.5,1)] group-hover:-rotate-[14deg] group-focus-visible:-rotate-[14deg] ${
                  dicaAberta ? "-rotate-[14deg]" : ""
                }`
          }
        >
          <path d="M7 6.5h10a4.6 4.6 0 0 1 4.5 3.8l.95 5.3a2.6 2.6 0 0 1-4.4 2.3L15.8 16H8.2l-2.25 1.9a2.6 2.6 0 0 1-4.4-2.3l.95-5.3A4.6 4.6 0 0 1 7 6.5z" />
          <path d="M7.5 9.6v4M5.5 11.6h4" />
          <circle cx="15.6" cy="10.6" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="17.9" cy="12.7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
        {explodindo && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-0">
            {FAISCAS.map((f, i) => (
              <span
                key={f.ang}
                className={`animate-controle-faisca absolute top-1/2 left-1/2 -mt-[3px] h-[6px] w-[10px] origin-left rounded-full ${
                  i % 2 ? "bg-lilas" : "bg-serie-1"
                }`}
                style={{ "--ang": `${f.ang}deg`, "--dist": `${f.dist}px` } as CSSProperties}
              />
            ))}
          </span>
        )}
      </a>
      {/* Dica no visual da área de comunidade (cores fixas, iguais nos dois temas). */}
      <span
        id="dica-comunidade"
        className={`absolute top-full left-1/2 z-10 mt-3 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-padrao border border-[#3a3248] border-t-2 border-t-lilas bg-roxo-noite px-4 py-3 text-left text-papel shadow-lg transition duration-200 ${estadoDica}`}
      >
        <span
          aria-hidden="true"
          className="absolute -top-[6px] left-1/2 size-2.5 -translate-x-1/2 rotate-45 bg-lilas"
        />
        <span className="block font-mono text-[1rem] font-bold tracking-[-0.01em] text-lilas">
          {dicaTitulo}
        </span>
        <span className="mt-1 block text-[0.875rem] leading-snug text-[#cfc9dc]">{dicaTexto}</span>
        {dicaAberta && (
          <a
            href={href}
            onClick={clicarAcao}
            className="mt-3 inline-flex min-h-alvo w-full items-center justify-center gap-2 rounded-pequeno bg-lilas px-3 font-mono text-[1rem] font-bold text-roxo-noite no-underline"
          >
            {dicaAcao}
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        )}
      </span>
      {explosao &&
        createPortal(
          <div
            aria-hidden="true"
            className="animate-controle-cobrir pointer-events-none fixed z-[100] rounded-full bg-roxo-noite"
            style={{
              left: explosao.x,
              top: explosao.y,
              width: explosao.diametro,
              height: explosao.diametro,
            }}
          />,
          document.body,
        )}
    </span>
  );
}
