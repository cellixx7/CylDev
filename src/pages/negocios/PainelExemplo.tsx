import { negocios } from "../../content/textos";

const painel = negocios.apresentacao.painel;

const maxMes = Math.max(...painel.meses.map((m) => m.valor));
const maxRegiao = Math.max(...painel.regioes.map((r) => r.valor));
const totalCategorias = painel.categorias.reduce((soma, c) => soma + c.valor, 0);

// Uma cor por série. Definidas em tailwind.css (claro) e tema-negocios.css (escuro).
const seriesFundo = ["bg-serie-1", "bg-serie-2", "bg-serie-3", "bg-serie-4", "bg-serie-5"];

const titulo = "mb-3 font-texto text-[0.75rem] font-semibold tracking-[0.06em] text-texto-suave uppercase";

/** Painel de exemplo (loja fictícia). Estático: sem animação e sem interação. */
export function PainelExemplo() {
  return (
    <figure
      className="m-0 rounded-padrao border border-linha bg-superficie p-4 pc:p-6"
      aria-label={painel.rotulo}
    >
      <figcaption className="mb-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="rounded-pequeno border border-destaque px-2 font-mono text-[0.7rem] font-bold tracking-[0.08em] text-destaque uppercase">
            {painel.selo}
          </span>
          <span className="font-titulo text-[1.1rem] font-bold">{painel.titulo}</span>
          <span className="ml-auto font-mono text-[0.8rem] text-texto-suave">{painel.periodo}</span>
        </div>
        <p className="mt-2 mb-0 max-w-none text-[0.9rem] leading-[1.45] text-texto-suave">{painel.descricao}</p>
      </figcaption>

      <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-5">
        {painel.indicadores.map((i) => (
          <div className="border-t-2 border-texto pt-2" key={i.nome}>
            <dt className="text-[0.85rem] text-texto-suave">{i.nome}</dt>
            <dd className="m-0 font-mono text-[1.45rem] leading-[1.2] font-bold">{i.valor}</dd>
            <dd className="m-0 font-mono text-[0.78rem] text-texto-suave">{i.variacao}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-7" aria-labelledby="painel-mensal">
        <h3 className={titulo} id="painel-mensal">
          {painel.mensalTitulo}
        </h3>
        <ol
          className="m-0 grid h-36 list-none grid-cols-[repeat(12,1fr)] items-end gap-[3px] border-b border-linha p-0 sm:gap-1.5"
          aria-label={painel.mensalTitulo}
        >
          {painel.meses.map((m, i) => (
            <li className="flex h-full flex-col items-center justify-end gap-1" key={m.nome}>
              <span className="font-mono text-[0.62rem] text-texto-suave">{m.valor}</span>
              <span
                className={`w-full rounded-t-pequeno ${i === painel.meses.length - 1 ? "bg-destaque" : "bg-serie-3"}`}
                style={{ height: `${(m.valor / maxMes) * 100}%` }}
              />
            </li>
          ))}
        </ol>
        <ol className="m-0 mt-1 grid list-none grid-cols-[repeat(12,1fr)] gap-[3px] p-0 sm:gap-1.5" aria-hidden="true">
          {painel.meses.map((m) => (
            <li className="text-center font-mono text-[0.6rem] text-texto-suave" key={m.nome}>
              {m.nome}
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-7 grid gap-7 sm:grid-cols-2">
        <section aria-labelledby="painel-categorias">
          <h3 className={titulo} id="painel-categorias">
            {painel.categoriasTitulo}
          </h3>
          <div className="flex h-3 overflow-hidden rounded-pequeno" role="img" aria-label={painel.categoriasTitulo}>
            {painel.categorias.map((c, i) => (
              <span
                className={seriesFundo[i % seriesFundo.length]}
                style={{ width: `${(c.valor / totalCategorias) * 100}%` }}
                key={c.nome}
              />
            ))}
          </div>
          <ul className="m-0 mt-3 grid list-none gap-1 p-0 text-[0.88rem]">
            {painel.categorias.map((c, i) => (
              <li className="flex items-center gap-2" key={c.nome}>
                <span className={`size-2.5 flex-none rounded-[1px] ${seriesFundo[i % seriesFundo.length]}`} />
                <span className="text-texto-suave">{c.nome}</span>
                <span className="ml-auto font-mono font-bold">{Math.round((c.valor / totalCategorias) * 100)}%</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="painel-regioes">
          <h3 className={titulo} id="painel-regioes">
            {painel.regioesTitulo}
          </h3>
          <ul className="m-0 grid list-none gap-2 p-0 text-[0.88rem]">
            {painel.regioes.map((r) => (
              <li className="grid grid-cols-[6.25rem_1fr_2rem] items-center gap-2" key={r.nome}>
                <span className="text-texto-suave">{r.nome}</span>
                <span className="h-2 bg-realce">
                  <span className="block h-full bg-serie-2" style={{ width: `${(r.valor / maxRegiao) * 100}%` }} />
                </span>
                <span className="text-right font-mono font-bold">{r.valor}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </figure>
  );
}
