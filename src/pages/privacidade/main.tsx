import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/tailwind.css";
import "../../styles/tema-negocios.css";
import { site } from "../../content/site";
import { privacidade as t } from "../../content/textos";
import { CabecalhoNegocios } from "../../shared/components/cabecalho/CabecalhoNegocios";
import { botao } from "../../shared/estilos";

function Pagina() {
  return (
    <>
      <CabecalhoNegocios />
      <main className="mx-auto max-w-leitura px-margem py-16" id="conteudo">
        <h1 id="topo" className="scroll-mt-24">
          {t.titulo}
        </h1>
        <p className="text-texto-suave">{t.atualizado}</p>
        <p>{t.intro}</p>
        <nav aria-label={t.indice} className="mb-8 border-l-[3px] border-destaque bg-realce px-4 py-3">
          <p className="m-0 text-menor font-semibold tracking-[0.06em] text-texto-suave uppercase">{t.indice}</p>
          <ol className="m-0 list-none p-0">
            {t.secoes.map((s, i) => (
              <li key={s.titulo}>
                <a className="inline-flex min-h-alvo items-center" href={`#secao-${i + 1}`}>
                  {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {t.secoes.map((s, i) => (
          <section key={s.titulo} className="mt-10 scroll-mt-24 p-0" id={`secao-${i + 1}`} aria-labelledby={`secao-${i + 1}-titulo`}>
            <h2 id={`secao-${i + 1}-titulo`}>{s.titulo}</h2>
            <ul className="m-0 grid gap-2 pl-[1.2em]">
              {s.itens.map((i) => (
                <li key={i}>{i.replace("{email}", site.email)}</li>
              ))}
            </ul>
          </section>
        ))}
        <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          <a className={botao} href="/">
            {t.voltar}
          </a>
          <a className="inline-flex min-h-alvo items-center" href="#topo">
            {t.topo}
          </a>
        </p>
      </main>
    </>
  );
}

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <Pagina />
  </StrictMode>,
);
