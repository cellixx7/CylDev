import { useId, useState, type ReactNode } from "react";
import { orcamento } from "../../../content/textos";

const t = orcamento.cards.miniExemplo;

const caixa = "rounded-pequeno border border-linha bg-fundo p-2.5";
const barra = "block rounded-[2px] bg-destaque";
const check = (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-destaque" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 8.5l3.2 3L13 4.5" />
  </svg>
);

function Planilha() {
  const d = t.planilha;
  return (
    <div className="grid gap-2">
      <ul className="m-0 flex list-none flex-wrap gap-1 p-0" aria-label={t.antes}>
        {d.antes.map((n) => (
          <li key={n} className="rounded-[2px] border border-dashed border-linha px-1.5 py-0.5 font-mono text-menor text-texto-suave line-through">
            {n}
          </li>
        ))}
      </ul>
      <div className="flex justify-center text-texto-suave" aria-hidden="true">
        <svg viewBox="0 0 16 16" className="h-4 w-4 rotate-90" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </div>
      <div className={`${caixa} grid gap-1 font-mono text-menor`}>
        <span className="grid grid-cols-3 border-b border-linha pb-1 font-bold">
          {d.colunas.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </span>
        {d.linhas.map((l) => (
          <span key={l} className="grid grid-cols-3 items-center text-texto-suave">
            <span>{l}</span>
            <span className={`${barra} h-1.5 w-4 opacity-40`} />
            <span className={`${barra} h-1.5 w-6 opacity-40`} />
          </span>
        ))}
        <span className="grid grid-cols-3 items-center border-t border-linha pt-1 font-bold">
          <span>{d.total}</span>
          <span />
          <span className={`${barra} h-1.5 w-8`} />
        </span>
      </div>
    </div>
  );
}

function Painel() {
  const d = t.painel;
  const alturas = ["h-3", "h-5", "h-4", "h-7", "h-6", "h-9"];
  const larguras = ["w-9", "w-7", "w-8"];
  return (
    <div className="grid gap-2">
      <ul className="m-0 grid list-none grid-cols-3 gap-1.5 p-0">
        {d.indicadores.map((n, i) => (
          <li key={n} className={`${caixa} !p-1.5`}>
            <span className="block text-menor text-texto-suave">{n}</span>
            <span className={`${barra} mt-1.5 h-2 ${larguras[i]}`} />
          </li>
        ))}
      </ul>
      <div className={caixa}>
        <span className="block text-menor text-texto-suave">{d.grafico}</span>
        <span className="mt-1.5 flex h-10 items-end gap-1.5">
          {alturas.map((h, i) => (
            <span key={h + i} className={`${barra} w-full ${h} ${i === alturas.length - 1 ? "" : "opacity-45"}`} />
          ))}
        </span>
      </div>
    </div>
  );
}

function Automacao() {
  const d = t.automacao;
  return (
    <div className="grid gap-2">
      <span className="inline-flex w-fit items-center rounded-pequeno border border-destaque bg-destaque px-3 py-1 text-menor font-semibold text-destaque-texto">
        {d.botao}
      </span>
      <ol className="m-0 grid list-none gap-1 p-0">
        {d.passos.map((p, i) => (
          <li key={p} className={`${caixa} flex items-center gap-2 !py-1.5 text-menor`}>
            <span className="grid size-6 shrink-0 place-items-center rounded-full border border-destaque font-mono text-menor leading-none font-bold text-destaque">
              {i + 1}
            </span>
            {p}
            <span className="ml-auto">{check}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Landing() {
  const d = t.landing;
  return (
    <div className="overflow-hidden rounded-pequeno border border-linha bg-fundo">
      <div className="flex items-center gap-1.5 border-b border-linha px-2 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-linha" />
        <span className="h-1.5 w-1.5 rounded-full bg-linha" />
        <span className="h-1.5 w-1.5 rounded-full bg-linha" />
        <span className="ml-1 truncate font-mono text-menor text-texto-suave">{d.endereco}</span>
      </div>
      <div className="grid gap-1.5 p-2.5">
        <span className="text-base leading-tight font-bold">{d.titulo}</span>
        <span className={`${barra} h-1.5 w-4/5 opacity-30`} />
        <span className="font-mono text-menor text-texto-suave">{d.preco}</span>
        <span className="inline-flex w-fit items-center rounded-pequeno border border-destaque bg-destaque px-2.5 py-1 text-menor font-semibold text-destaque-texto">
          {d.botao}
        </span>
      </div>
    </div>
  );
}

function Python() {
  const d = t.python;
  return (
    <div className="grid gap-1.5">
      <ul className="m-0 flex list-none flex-wrap gap-1 p-0">
        {d.entrada.map((n) => (
          <li key={n} className="rounded-[2px] border border-dashed border-linha px-1.5 py-0.5 font-mono text-menor text-texto-suave">
            {n}
          </li>
        ))}
      </ul>
      <span className="flex justify-center text-texto-suave">
        <svg viewBox="0 0 16 16" className="h-4 w-4 rotate-90" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </span>
      <span className={`${caixa} text-center font-mono text-menor font-bold`}>{d.script}</span>
      <span className="flex justify-center text-texto-suave">
        <svg viewBox="0 0 16 16" className="h-4 w-4 rotate-90" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </span>
      <span className={`${caixa} flex items-center gap-2 !py-1.5 text-menor font-semibold`}>
        {check}
        {d.saida}
      </span>
    </div>
  );
}

function Sistema() {
  const d = t.sistema;
  return (
    <div className="grid gap-2">
      <ul className="m-0 flex list-none flex-wrap gap-1 p-0">
        {d.tipos.map((n) => (
          <li key={n} className="rounded-[2px] border border-destaque px-1.5 py-0.5 font-mono text-menor font-bold text-destaque">
            {n}
          </li>
        ))}
      </ul>
      <ol className="m-0 grid list-none gap-1 p-0">
        {d.camadas.map((c, i) => (
          <li key={c.nome} className="contents">
            <span className={`${caixa} flex items-baseline justify-between gap-2 !py-1.5 text-menor`}>
              <span className="font-semibold">{c.nome}</span>
              <span className="text-right text-menor text-texto-suave">{c.detalhe}</span>
            </span>
            {i < d.camadas.length - 1 && (
              <span className="flex justify-center text-texto-suave" aria-hidden="true">
                <svg viewBox="0 0 16 16" className="-my-0.5 h-3 w-3 rotate-90" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

const visuais: Record<string, { legenda: string; corpo: ReactNode }> = {
  planilha: { legenda: t.planilha.legenda, corpo: <Planilha /> },
  painel: { legenda: t.painel.legenda, corpo: <Painel /> },
  automacao: { legenda: t.automacao.legenda, corpo: <Automacao /> },
  landing: { legenda: t.landing.legenda, corpo: <Landing /> },
  python: { legenda: t.python.legenda, corpo: <Python /> },
  sistema: { legenda: t.sistema.legenda, corpo: <Sistema /> },
};

/**
 * Miniatura ilustrativa do que o serviço entrega. Sem dado real: é desenho, rotulado como exemplo.
 * No celular vem recolhida ("Ver exemplo"), para a lista de cards não ficar comprida; de `md` para cima fica sempre aberta.
 */
export function MiniExemplo({ servicoId, nome }: { servicoId: string; nome: string }) {
  const [aberto, setAberto] = useState(false);
  const id = useId();
  const v = visuais[servicoId];
  if (!v) return null;
  return (
    <figure className="m-0 mb-4 rounded-pequeno border border-linha bg-realce px-3 py-1 md:py-3">
      <figcaption className="flex items-center justify-between gap-3">
        <span className="rounded-[2px] border border-destaque px-1.5 py-0.5 font-mono text-menor leading-tight font-bold tracking-wide text-destaque uppercase">
          {t.rotulo}
        </span>
        <button
          type="button"
          className="inline-flex min-h-alvo cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-[inherit] text-menor font-semibold text-texto underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco md:hidden"
          aria-expanded={aberto}
          aria-controls={id}
          aria-label={`${aberto ? t.ocultar : t.ver}: ${nome}`}
          onClick={() => setAberto((a) => !a)}
        >
          {aberto ? t.ocultar : t.ver}
        </button>
      </figcaption>
      <div id={id} className={`${aberto ? "block pb-2" : "hidden"} md:mt-2 md:block md:pb-0`}>
        <div aria-hidden="true">{v.corpo}</div>
        <p className="mt-2 mb-0 text-menor text-texto-suave">{v.legenda}</p>
      </div>
    </figure>
  );
}
