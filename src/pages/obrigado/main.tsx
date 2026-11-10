import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/tailwind.css";
import "../../styles/tema-negocios.css";
import { naoEncontrado, obrigado } from "../../content/textos";
import { CabecalhoNegocios } from "../../shared/components/cabecalho/CabecalhoNegocios";
import { botao } from "../../shared/estilos";

const raiz = document.getElementById("raiz")!;
const t = raiz.dataset.pagina === "404" ? naoEncontrado : obrigado;

function Aviso() {
  return (
    <>
      <CabecalhoNegocios />
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
