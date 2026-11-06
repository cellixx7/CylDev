import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/base.css";
import "../../styles/home.css";
import { home } from "../../content/textos";
import { Cabecalho } from "../../shared/components/Cabecalho";

function Home() {
  return (
    <>
      <Cabecalho area="home" temaPadrao="claro" marca={home.titulo} />
      <main className="home" id="conteudo">
        <h1 className="home__titulo">{home.linha}</h1>
        <ul className="home__portas">
          {home.portas.map((p, i) => (
            <li key={p.href} className={`porta porta--${i === 0 ? "negocios" : "comunidade"}`}>
              <a className="porta__link" href={p.href}>
                <span className="porta__rotulo">{p.rotulo}</span>
                <span className="porta__guia">{p.guia}</span>
                <span className="porta__assinatura">{p.assinatura}</span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
);
