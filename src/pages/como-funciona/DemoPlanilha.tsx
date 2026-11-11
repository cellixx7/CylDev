import { useEffect, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { demoPlanilha as t } from "../../content/demoPlanilha";
import { rotuloFicticio } from "../../shared/estilos";
import {
  cabecalhoDoPasso,
  estadoInicialDemo,
  linhasDoPasso,
  reduzirDemo,
  totalDoPasso,
  ultimoPasso,
} from "../../shared/lib/demoPassos";

const celula = "border border-linha px-1.5 py-1.5 text-left align-top [overflow-wrap:anywhere] sm:px-2";
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
function usarVisivel(ref: React.RefObject<HTMLElement | null>) {
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

function Tabela({ passo, legenda }: { passo: number; legenda: string }) {
  const linhas = linhasDoPasso(passo);
  const cab = cabecalhoDoPasso(passo);
  const separado = passo >= 4;
  return (
    <table className="w-full table-fixed border-collapse text-[0.875rem]" aria-label={legenda}>
      <thead>
        <tr>
          {cab.map((c, i) => (
            <th key={`${c}-${separado}`} className={`${celula} demo-entra bg-realce`} colSpan={!separado && i === 1 ? 3 : 1}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {linhas.map((l) => (
          <tr key={l.id}>
            <td className={celula}>
              <span key={l.data} className="demo-entra block min-h-[1.25rem]">
                {l.data}
              </span>
            </td>
            {l.colunas ? (
              l.colunas.map((c, i) => (
                <td className={celula} key={i}>
                  <span className="demo-entra block">{c}</span>
                </td>
              ))
            ) : (
              <td className={celula} colSpan={3}>
                <span key={l.nota} className="demo-entra block min-h-[1.25rem]">
                  {l.nota}
                </span>
              </td>
            )}
          </tr>
        ))}
        <tr className="font-bold">
          <td className={celula} colSpan={4}>
            <span key={totalDoPasso(passo)} className="demo-entra block">
              {totalDoPasso(passo)}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function ListaPassos({ atual }: { atual: number | null }) {
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

/** Versão sem movimento: antes e depois lado a lado (empilhados no celular), com a lista dos passos. */
function Estatica() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave">{t.antes}</p>
          <Tabela passo={0} legenda={t.tabelaAntes} />
        </div>
        <div>
          <p className="mb-2 text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave">{t.depois}</p>
          <Tabela passo={ultimoPasso} legenda={t.tabelaDepois} />
        </div>
      </div>
      <ListaPassos atual={null} />
      <p className="m-0 font-semibold">{t.resultado}</p>
    </div>
  );
}

function Animada() {
  const [estado, agir] = useReducer(reduzirDemo, estadoInicialDemo);
  const raiz = useRef<HTMLDivElement>(null);
  const visivel = usarVisivel(raiz);
  const { passo, tocando } = estado;
  const andando = tocando && visivel;

  useEffect(() => {
    if (!andando) return;
    const id = window.setTimeout(() => agir("avancar"), t.intervaloMs);
    return () => window.clearTimeout(id);
  }, [andando, passo]);

  const final = passo >= ultimoPasso;
  const descricao = passo === 0 ? t.comecoDescricao : t.passos[passo - 1].descricao;
  const titulo = passo === 0 ? t.comecoRotulo : t.passos[passo - 1].titulo;

  return (
    <div ref={raiz} className="grid gap-4">
      <div role="group" aria-label={t.rotuloControles} className="flex flex-wrap gap-2">
        <button
          type="button"
          className={botaoPrincipal}
          onClick={() => agir(tocando ? "pausar" : "reproduzir")}
        >
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
        <div>
          <Tabela passo={passo} legenda={t.tabelaAtual} />
        </div>
        <div className="grid gap-3">
          <p className="m-0 text-[1rem]" data-testid="demo-passo-atual">
            <span className="font-mono font-bold text-destaque">
              {passo === 0 ? t.comecoRotulo : t.passoAtual(passo, ultimoPasso)}
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
          <ListaPassos atual={passo} />
          {/* Uma única mensagem para leitor de tela, só quando chega ao fim. */}
          <p role="status" className="m-0 font-semibold">
            {final ? t.resultado : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DemoPlanilha() {
  const reduzido = usarMovimentoReduzido();
  return (
    <section className="mt-9 border-t border-linha pt-6" aria-labelledby="demo-planilha-titulo" data-testid="demo-planilha">
      <h3 id="demo-planilha-titulo" className="mt-0 mb-2 text-[1.2rem]">
        {t.titulo}
      </h3>
      <p className="mb-4">
        <span className={rotuloFicticio}>{t.rotulo}</span>
      </p>
      {reduzido ? <Estatica /> : <Animada />}
    </section>
  );
}
