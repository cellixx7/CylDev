import { useEffect, useReducer, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import type { TextosDemo } from "../../content/demos";
import { rotuloFicticio } from "../../shared/estilos";
import { estadoInicialDemo, reduzirPassos, type AcaoDemo, type EstadoDemo } from "../../shared/lib/demoMaquina";

// Moldura comum das demonstrações de Como funciona: controles, relógio, texto de cada passo, lista de passos,
// pausa automática e versão sem movimento. Cada demonstração só entrega o desenho (`visual` e `estatico`).

export const celulaDemo = "border border-linha px-1.5 py-1.5 text-left align-top [overflow-wrap:anywhere] sm:px-2";
const botao =
  "min-h-alvo min-w-alvo cursor-pointer rounded-pequeno border border-texto bg-transparent px-4 font-semibold text-texto hover:bg-realce active:bg-realce aria-disabled:cursor-default aria-disabled:opacity-50";
const botaoPrincipal =
  "min-h-alvo min-w-alvo cursor-pointer rounded-pequeno border border-destaque bg-destaque px-4 font-semibold text-destaque-texto hover:border-texto hover:bg-texto hover:text-fundo";

const consultaMovimento = "(prefers-reduced-motion: reduce)";
function usarMovimentoReduzido() {
  return useSyncExternalStore(
    (avisar) => {
      const m = window.matchMedia(consultaMovimento);
      m.addEventListener("change", avisar);
      return () => m.removeEventListener("change", avisar);
    },
    () => window.matchMedia(consultaMovimento).matches,
    () => false,
  );
}

/** Verdadeiro só enquanto a aba está em primeiro plano e a seção aparece na tela. */
function usarVisivel(ref: RefObject<HTMLElement | null>) {
  const [naTela, setNaTela] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState(() => !document.hidden);
  useEffect(() => {
    const aoMudarAba = () => setAbaAtiva(!document.hidden);
    document.addEventListener("visibilitychange", aoMudarAba);
    return () => document.removeEventListener("visibilitychange", aoMudarAba);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([entrada]) => setNaTela(entrada.isIntersecting));
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return naTela && abaAtiva;
}

export function ListaPassos({ t, atual }: { t: TextosDemo; atual: number | null }) {
  return (
    <ol className="m-0 grid list-none gap-2 p-0" aria-label={t.listaPassosRotulo}>
      {t.passos.map((p, i) => {
        const n = i + 1;
        const feito = atual !== null && n <= atual;
        const corrente = atual === n;
        return (
          <li
            key={p.titulo}
            aria-current={corrente ? "step" : undefined}
            className={`rounded-pequeno border px-3 py-2 ${corrente ? "border-destaque bg-realce" : "border-linha"} ${
              atual !== null && !feito ? "text-texto-suave" : ""
            }`}
          >
            <span className="font-mono font-bold text-destaque">{n}. </span>
            <strong>{p.titulo}.</strong> <span>{p.descricao}</span>
          </li>
        );
      })}
    </ol>
  );
}

function Animada({ t, visual }: { t: TextosDemo; visual: (passo: number) => ReactNode }) {
  const ultimo = t.passos.length;
  const [estado, agir] = useReducer((e: EstadoDemo, a: AcaoDemo) => reduzirPassos(e, a, ultimo), estadoInicialDemo);
  const raiz = useRef<HTMLDivElement>(null);
  const visivel = usarVisivel(raiz);
  const { passo, tocando } = estado;
  const andando = tocando && visivel;

  useEffect(() => {
    if (!andando) return;
    const id = window.setTimeout(() => agir("avancar"), t.intervaloMs);
    return () => window.clearTimeout(id);
  }, [andando, passo, t.intervaloMs]);

  const final = passo >= ultimo;
  const descricao = passo === 0 ? t.comecoDescricao : t.passos[passo - 1].descricao;
  const titulo = passo === 0 ? t.comecoRotulo : t.passos[passo - 1].titulo;

  return (
    <div ref={raiz} className="grid gap-4">
      <div role="group" aria-label={t.rotuloControles} className="flex flex-wrap gap-2">
        <button type="button" className={botaoPrincipal} onClick={() => agir(tocando ? "pausar" : "reproduzir")}>
          {tocando ? t.controles.pausar : t.controles.reproduzir}
        </button>
        <button type="button" className={botao} aria-disabled={final} onClick={() => !final && agir("verResultado")}>
          {t.controles.verResultado}
        </button>
        <button type="button" className={botao} onClick={() => agir("recomecar")}>
          {t.controles.recomecar}
        </button>
      </div>

      <div className="grid gap-6 tab:grid-cols-2 tab:items-start">
        <div>{visual(passo)}</div>
        <div className="grid gap-3">
          <p className="m-0 text-[1rem]" data-testid="demo-passo-atual">
            <span className="font-mono font-bold text-destaque">
              {passo === 0 ? t.comecoRotulo : t.passoAtual(passo, ultimo)}
            </span>
            {passo === 0 ? null : (
              <>
                {": "}
                <strong>{titulo}.</strong>
              </>
            )}{" "}
            {descricao}
          </p>
          {passo === 0 && <p className="m-0 text-texto-suave">{t.dica}</p>}
          <ListaPassos t={t} atual={passo} />
          {/* Uma única mensagem para leitor de tela, só quando chega ao fim. */}
          <p role="status" className="m-0 font-semibold">
            {final ? t.resultado : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Versão sem movimento: o `estatico` de cada demonstração (antes e depois) e a lista dos passos. */
function Estatica({ t, estatico }: { t: TextosDemo; estatico: ReactNode }) {
  return (
    <div className="grid gap-6">
      {estatico}
      <ListaPassos t={t} atual={null} />
      <p className="m-0 font-semibold">{t.resultado}</p>
    </div>
  );
}

export function DemoMoldura({
  id,
  t,
  visual,
  estatico,
}: {
  /** Id do bloco em Como funciona (vira `demo-<id>` no data-testid). */
  id: string;
  t: TextosDemo;
  visual: (passo: number) => ReactNode;
  estatico: ReactNode;
}) {
  const reduzido = usarMovimentoReduzido();
  return (
    <section className="mt-9 border-t border-linha pt-6" aria-labelledby={`demo-${id}-titulo`} data-testid={`demo-${id}`}>
      <h3 id={`demo-${id}-titulo`} className="mt-0 mb-2 text-[1.2rem]">
        {t.titulo}
      </h3>
      <p className="mb-4">
        <span className={rotuloFicticio}>{t.rotulo}</span>
      </p>
      {reduzido ? <Estatica t={t} estatico={estatico} /> : <Animada t={t} visual={visual} />}
    </section>
  );
}
