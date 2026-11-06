import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/tailwind.css";
import "../../styles/tema-negocios.css";
import { negocios as t } from "../../content/textos";
import { CabecalhoNegocios } from "../../shared/components/CabecalhoNegocios";
import { Rodape } from "../../shared/components/Rodape";
import { botao, botaoCheio } from "../../shared/estilos";
import { PainelExemplo } from "./PainelExemplo";

// Estrutura em branco da área Negócios. O conteúdo e o design serão refeitos.
function Negocios() {
  return (
    <>
      <CabecalhoNegocios />
      <main id="conteudo">
        <section
          className="grid gap-10 px-margem pt-10 pb-14 pc:min-h-[calc(100svh-4rem)] pc:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] pc:items-center pc:gap-[clamp(2.5rem,5vw,5rem)]"
          id="apresentacao"
        >
          <div>
            <span className="mb-5 block h-[3px] w-12 bg-destaque" aria-hidden="true" />
            <h1 className="mb-5 text-[clamp(3rem,14vw,5rem)] leading-[0.95] pc:text-[clamp(3rem,6vw,5rem)] font-extrabold tracking-[-0.035em]">
              {t.apresentacao.titulo}
            </h1>
            <p className="mb-4 max-w-[36rem] text-[1.2rem] leading-[1.4] font-medium text-texto md:text-[1.35rem]">
              {t.apresentacao.subtitulo}
            </p>
            <p className="m-0 max-w-[36rem] text-[1.05rem] text-texto-suave">{t.apresentacao.texto}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a className={`${botaoCheio} justify-center`} href="#orcamento">
                {t.apresentacao.botaoOrcamento}
              </a>
              <a className={`${botao} justify-center`} href="/negocios/como-funciona/">
                {t.apresentacao.botaoComoFunciona}
              </a>
            </div>
          </div>
          <PainelExemplo />
        </section>
        <section className="mx-auto max-w-hero px-margem py-14" id="orcamento">
          <h2>Orçamento</h2>
        </section>
        <section id="entregas"></section>
        <section id="como-funciona"></section>
        <section id="sobre"></section>
        <section id="contato"></section>
      </main>
      <Rodape ponte={{ ...t.ponte, href: "/comunidade/" }} />
    </>
  );
}

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <Negocios />
  </StrictMode>,
);
