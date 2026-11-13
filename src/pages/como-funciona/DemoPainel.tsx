import { useState, type CSSProperties } from "react";
import { demoPainel as t, type FiltroDemo } from "../../content/demoPainel";
import { filtroDoPasso, resumoDoFiltro } from "../../shared/lib/demoPainel";
import { celulaDemo as celula, DemoMoldura } from "./DemoMoldura";

const ultimo = t.passos.length;
const filtros: { id: FiltroDemo; nome: string }[] = [{ id: "todos", nome: t.painel.todos }, ...t.meses.map((m) => ({ id: m.id, nome: m.nome }))];

const botaoFiltro =
  "min-h-alvo min-w-alvo cursor-pointer rounded-pequeno border border-texto px-3 font-semibold hover:bg-realce active:bg-realce";

// Intervalo (s) entre uma linha da tabela acender e a barra seguinte crescer: as duas andam juntas.
const passoLinha = 0.3;
const atraso = (s: number) => ({ "--atraso": `${s}s` }) as CSSProperties;

/** `animar` muda a cada passo ou filtro: remonta as linhas e a tabela acende linha a linha, na ordem das barras. */
function TabelaVendas({ filtro, animar }: { filtro: FiltroDemo; animar?: string }) {
  const destaque = (mes: string) => (filtro === mes ? " bg-realce" : "");
  const acende = animar ? " demo-flash" : "";
  return (
    <table className="w-full table-fixed border-collapse text-[0.875rem]" aria-label={t.tabela.legenda}>
      <thead>
        <tr>
          <th className={`${celula} bg-superficie`}>{t.tabela.produto}</th>
          {t.meses.map((m) => (
            <th key={m.id} className={`${celula} text-right${destaque(m.id)}`}>
              {m.nome}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {t.produtos.map((p, i) => (
          <tr key={`${p.nome}-${animar}`} style={atraso(i * passoLinha)}>
            <td className={`${celula}${acende}`}>{p.nome}</td>
            {t.meses.map((m) => (
              <td key={m.id} className={`${celula} text-right font-mono${destaque(m.id)}${acende}`}>
                {p.vendas[m.id]}
              </td>
            ))}
          </tr>
        ))}
        <tr className="font-bold" key={`total-${animar}`} style={atraso(t.produtos.length * passoLinha)}>
          <td className={`${celula}${acende}`}>{t.tabela.total}</td>
          {t.meses.map((m) => (
            <td key={m.id} className={`${celula} text-right font-mono${destaque(m.id)}${acende}`}>
              {t.produtos.reduce((s, p) => s + p.vendas[m.id], 0)}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

/** O painel em uso. O filtro vem do passo; se a pessoa escolher outro, vale até o passo mudar. */
function Painel({ passo, mesPadrao, aoFiltrar }: { passo: number; mesPadrao?: FiltroDemo; aoFiltrar?: (f: FiltroDemo) => void }) {
  const [escolha, setEscolha] = useState<{ passo: number; filtro: FiltroDemo } | null>(null);
  const filtro = escolha && escolha.passo === passo ? escolha.filtro : (mesPadrao ?? filtroDoPasso(passo));
  const r = resumoDoFiltro(filtro);
  const p = t.painel;
  return (
    <div className="demo-entra rounded-padrao border border-linha p-3 sm:p-4" role="group" aria-label={`${p.titulo}: ${p.resumo(r.periodo, r.total, r.maisVende.nome, r.menosSai.nome)}`}>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="m-0 font-titulo text-[1.1rem] font-bold">{p.titulo}</p>
        <div role="group" aria-label={p.filtroRotulo} className="flex flex-wrap gap-2">
          {filtros.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filtro === f.id}
              className={`${botaoFiltro} ${filtro === f.id ? "bg-destaque text-destaque-texto border-destaque" : "bg-transparent text-texto"}`}
              onClick={() => {
                setEscolha({ passo, filtro: f.id });
                aoFiltrar?.(f.id);
              }}
            >
              {f.nome}
            </button>
          ))}
        </div>
      </div>

      <dl className="m-0 mb-4 grid grid-cols-1 gap-3 min-[400px]:grid-cols-3">
        <div className="border-t-2 border-texto pt-2">
          <dt className="text-[0.875rem] text-texto-suave">{p.indicadores.vendido}</dt>
          <dd key={r.total + filtro} className="demo-entra m-0 font-mono text-[1.2rem] font-bold">
            R$ {r.total} mil
          </dd>
        </div>
        <div className="border-t-2 border-destaque pt-2">
          <dt className="text-[0.875rem] text-texto-suave">{p.indicadores.maisVende}</dt>
          <dd key={r.maisVende.nome + filtro} className="demo-entra m-0 font-mono text-[1.2rem] font-bold">
            {r.maisVende.nome}
          </dd>
        </div>
        <div className="border-t-2 border-serie-1 pt-2">
          <dt className="text-[0.875rem] text-texto-suave">{p.indicadores.menosSai}</dt>
          <dd key={r.menosSai.nome + filtro} className="demo-entra m-0 font-mono text-[1.2rem] font-bold">
            {r.menosSai.nome}
          </dd>
        </div>
      </dl>

      <p className="mb-2 text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave">{p.graficoTitulo}</p>
      <ul className="m-0 grid list-none gap-2 p-0 text-[0.875rem]">
        {r.vendas.map((v, i) => {
          const cor = v.nome === r.maisVende.nome ? "bg-destaque" : v.nome === r.menosSai.nome ? "bg-serie-1" : "bg-serie-3";
          return (
            <li key={`${v.nome}-${passo}-${filtro}`} className="grid grid-cols-[5.5rem_minmax(0,1fr)_2rem] items-center gap-2">
              <span>{v.nome}</span>
              <span className="block h-[0.9rem] bg-realce">
                <span
                  className={`demo-barra block h-full origin-left rounded-pequeno ${cor}`}
                  style={{ transform: `scaleX(${v.valor / r.maximo})`, ...atraso(i * passoLinha) }}
                />
              </span>
              <span className="text-right font-mono font-bold">{v.valor}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const estatico = (
  <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
    <div>
      <p className="mb-2 text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave">{t.antes}</p>
      <TabelaVendas filtro="todos" />
    </div>
    <div>
      <p className="mb-2 text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave">{t.depois}</p>
      <Painel passo={ultimo} mesPadrao="todos" />
      <p className="mt-2 mb-0 text-texto-suave">{t.usar}</p>
    </div>
  </div>
);

function Visual({ passo }: { passo: number }) {
  // O filtro que a pessoa escolhe também vale para a tabela; um passo novo volta ao filtro do passo.
  const [escolha, setEscolha] = useState<{ passo: number; filtro: FiltroDemo } | null>(null);
  const filtro = escolha && escolha.passo === passo ? escolha.filtro : filtroDoPasso(passo);
  return (
    <div className="grid gap-4">
      <TabelaVendas filtro={passo === 0 ? "todos" : filtro} animar={passo >= 1 ? `${passo}-${filtro}` : undefined} />
      {passo >= 1 && (
        <>
          <Painel passo={passo} aoFiltrar={(f) => setEscolha({ passo, filtro: f })} />
          {passo === ultimo && <p className="m-0 text-texto-suave">{t.usar}</p>}
        </>
      )}
    </div>
  );
}


export function DemoPainel() {
  return <DemoMoldura id="painel" t={t} visual={(passo) => <Visual passo={passo} />} estatico={estatico} />;
}
