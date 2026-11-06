import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/tailwind.css";
import { home } from "../../content/textos";
import { Cabecalho } from "../../shared/components/cabecalho/Cabecalho";

function Home() {
  return (
    <>
      <Cabecalho area="home" temaPadrao="claro" marca={home.titulo} />
      <main className="mx-auto max-w-site px-margem pt-9 pb-20" id="conteudo">
        <h1 className="mb-9 max-w-[24ch] text-[clamp(1.5rem,5vw,2.2rem)]">{home.linha}</h1>
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-[3fr_2fr] md:items-stretch">
          {home.portas.map((p, i) => (
            <li key={p.href} className={i === 0 ? "" : "md:self-end"}>
              <a
                className={`group flex flex-col gap-2 rounded-padrao border p-6 no-underline ${
                  i === 0
                    ? "min-h-44 border-destaque bg-destaque text-destaque-texto md:min-h-80"
                    : "min-h-44 border-roxo-noite bg-roxo-noite text-papel"
                }`}
                href={p.href}
              >
                <span className="font-titulo text-[clamp(1.5rem,6vw,2.1rem)] leading-[1.15] font-bold underline decoration-2 underline-offset-[0.18em] group-hover:decoration-4">
                  {p.rotulo}
                </span>
                <span className="max-w-[40ch]">{p.guia}</span>
                <span
                  className={`mt-auto text-[0.85rem] tracking-[0.08em] uppercase ${
                    i === 0 ? "text-inherit opacity-85" : "font-mono text-lilas"
                  }`}
                >
                  {p.assinatura}
                </span>
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
