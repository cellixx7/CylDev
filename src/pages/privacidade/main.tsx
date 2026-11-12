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
      <main className="mx-auto max-w-[44rem] px-margem py-16" id="conteudo">
        <h1>{t.titulo}</h1>
        <p className="text-texto-suave">{t.atualizado}</p>
        <p>{t.intro}</p>
        {t.secoes.map((s) => (
          <section key={s.titulo} aria-labelledby={`p-${s.titulo}`}>
            <h2 id={`p-${s.titulo}`}>{s.titulo}</h2>
            <ul className="m-0 grid gap-2 pl-[1.2em]">
              {s.itens.map((i) => (
                <li key={i}>{i.replace("{email}", site.email)}</li>
              ))}
            </ul>
          </section>
        ))}
        <p className="mt-8">
          <a className={botao} href="/">
            {t.voltar}
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
