import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/base.css";
import "../../styles/home.css";
import { site } from "../../content/site";
import { naoEncontrado, obrigado } from "../../content/textos";
import { Cabecalho } from "../../shared/components/Cabecalho";

const raiz = document.getElementById("raiz")!;
const t = raiz.dataset.pagina === "404" ? naoEncontrado : obrigado;

function Aviso() {
  return (
    <>
      <Cabecalho area="home" temaPadrao="claro" marca={site.nome} />
      <main className="aviso" id="conteudo">
        <h1>{t.titulo}</h1>
        <p>{t.texto}</p>
        <p>
          <a className="botao" href="/">
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
