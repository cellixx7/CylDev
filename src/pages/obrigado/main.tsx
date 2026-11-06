import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/tailwind.css";
import { site } from "../../content/site";
import { naoEncontrado, obrigado } from "../../content/textos";
import { Cabecalho } from "../../shared/components/Cabecalho";
import { botao } from "../../shared/estilos";

const raiz = document.getElementById("raiz")!;
const t = raiz.dataset.pagina === "404" ? naoEncontrado : obrigado;

function Aviso() {
  return (
    <>
      <Cabecalho area="home" temaPadrao="claro" marca={site.nome} />
      <main className="mx-auto max-w-site px-margem py-20" id="conteudo">
        <h1>{t.titulo}</h1>
        <p>{t.texto}</p>
        <p>
          <a className={botao} href="/">
            {t.voltar}
          </a>
        </p>
      </main>
    </>
  );
}

createRoot(raiz).render(
  <StrictMode>
    <Aviso />
  </StrictMode>,
);
