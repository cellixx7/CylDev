import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  negocios,
  paginaDeTexto as r,
  type PaginaDeTexto,
} from "../../content/textos";
import { botao } from "../estilos";
import { CabecalhoNegocios } from "./cabecalho/CabecalhoNegocios";
import { ContatoRodape, Rodape } from "./Rodape";
import { TextoRico } from "./TextoRico";
import { idiomaAtual, rota } from "../i18n/rota";

/**
 * Página de leitura (Termos, privacidade, acessibilidade, perguntas): título, versão, índice e seções com âncora.
 * O conteúdo vem de src/content/textos/ no formato PaginaDeTexto. Guia em docs/DESIGN.md.
 */
export function PaginaTexto({
  pagina: t,
  origem,
}: {
  pagina: PaginaDeTexto;
  origem: string;
}) {
  const titulo = (i: number, texto: string) =>
    t.numerada ? `${i + 1}. ${texto}` : texto;
  return (
    <>
      <CabecalhoNegocios />
      <main className="mx-auto max-w-[72rem] px-margem py-16" id="conteudo">
        <div className="pc:grid pc:grid-cols-[16rem_minmax(0,1fr)] pc:gap-x-16">
          <header className="min-w-0 max-w-leitura pc:col-start-2 pc:row-start-1">
            <h1 id="topo" className="scroll-mt-24">
              {t.titulo}
            </h1>
            <p className="text-texto-suave">{t.atualizado}</p>
            {idiomaAtual !== "pt" && (
              <p
                role="note"
                className="border-l-[3px] border-destaque bg-realce px-4 py-3"
              >
                {r.avisoIdioma}
              </p>
            )}
            {t.intro.map((p) => (
              <p key={p}>
                <TextoRico texto={p} />
              </p>
            ))}
          </header>
          <nav
            aria-label={r.indice}
            className="mb-8 border-l-[3px] border-destaque bg-realce px-4 py-3 pc:sticky pc:top-24 pc:col-start-1 pc:row-span-2 pc:row-start-1 pc:mb-0 pc:max-h-[calc(100vh-8rem)] pc:self-start pc:overflow-y-auto pc:border-l pc:border-linha pc:bg-transparent pc:py-0 pc:pl-4"
          >
            <p className="m-0 text-menor font-semibold tracking-[0.06em] text-texto-suave uppercase">
              {r.indice}
            </p>
            <ol className="m-0 list-none p-0">
              {t.secoes.map((s, i) => (
                <li key={s.id}>
                  <a
                    className={
                      t.numerada
                        ? "grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-x-2 py-1 leading-snug pc:grid-cols-[2rem_minmax(0,1fr)] pc:py-0.5"
                        : "inline-flex items-center py-1 leading-snug pc:py-0.5"
                    }
                    href={`#${s.id}`}
                  >
                    {t.numerada ? (
                      <>
                        <span className="text-right font-mono tabular-nums text-texto-suave">
                          {i + 1}.
                        </span>
                        <span>{s.titulo}</span>
                      </>
                    ) : (
                      s.titulo
                    )}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="min-w-0 max-w-leitura pc:col-start-2 pc:row-start-2">
            {t.secoes.map((s, i) => (
              <section
                key={s.id}
                className="mt-10 scroll-mt-24 p-0"
                id={s.id}
                aria-labelledby={`${s.id}-titulo`}
              >
                <h2 id={`${s.id}-titulo`}>{titulo(i, s.titulo)}</h2>
                {s.texto?.map((p) => (
                  <p key={p}>
                    <TextoRico texto={p} />
                  </p>
                ))}
                {s.itens && (
                  <ul className="m-0 grid list-disc gap-2 pl-[1.2em] marker:text-destaque">
                    {s.itens.map((item) => (
                      <li key={item}>
                        <TextoRico texto={item} />
                      </li>
                    ))}
                  </ul>
                )}
                {s.depois?.map((p, n) => (
                  <p key={p} className={n === 0 ? "mt-4" : undefined}>
                    <TextoRico texto={p} />
                  </p>
                ))}
                {s.blocos?.map((b) => (
                  <div
                    key={b.titulo}
                    className="mt-6 border-t border-linha pt-4"
                  >
                    <h3 className="mb-2 text-medio">{b.titulo}</h3>
                    {b.texto.map((p) => (
                      <p key={p} className="last:mb-0">
                        <TextoRico texto={p} />
                      </p>
                    ))}
                  </div>
                ))}
              </section>
            ))}
            <p className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
              <a className={botao} href={rota("/")}>
                {r.voltar}
              </a>
              <a className="inline-flex min-h-alvo items-center" href="#topo">
                {r.topo}
              </a>
            </p>
          </div>
        </div>
      </main>
      <Rodape ponte={{ ...negocios.ponte, href: "/comunidade/" }}>
        <ContatoRodape origem={origem} />
      </Rodape>
    </>
  );
}

/** Monta a página de leitura em `#raiz`. Cada página tem o seu main.tsx de poucas linhas, para o texto das outras não ir junto. */
export function montarPaginaTexto(pagina: PaginaDeTexto, origem: string) {
  createRoot(document.getElementById("raiz")!).render(
    <StrictMode>
      <PaginaTexto pagina={pagina} origem={origem} />
    </StrictMode>,
  );
}
