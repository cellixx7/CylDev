import { StrictMode, useEffect, useState, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/tailwind.css";
import "../../styles/tema-negocios.css";
import { servicosDa } from "../../content/servicos";
import { negocios as t } from "../../content/textos";
import { CabecalhoNegocios } from "../../shared/components/cabecalho/CabecalhoNegocios";
import { ContatoRodape, Rodape } from "../../shared/components/Rodape";
import { botao, botaoCheio } from "../../shared/estilos";
import { brl } from "../../shared/lib/formato";
import { ativarMagnetico } from "./magnetico";
import { Orcamento } from "./Orcamento";
import { PainelExemplo } from "./PainelExemplo";

// Título cinético: cada letra sobe de uma máscara, em cascata (ver .letra em tema-negocios.css).
function TituloCinetico({ texto }: { texto: string }) {
  let i = 0;
  return (
    <span aria-label={texto}>
      {texto.split(" ").map((palavra, p) => (
        <span key={p} className="palavra" aria-hidden="true">
          {[...palavra].map((letra) => (
            <span key={i} className="mascara">
              <span className="letra" style={{ "--i": i++ } as CSSProperties}>
                {letra}
              </span>
            </span>
          ))}
          {" "}
        </span>
      ))}
    </span>
  );
}

/** Menor preço de partida entre os pacotes de Negócios (fixo ou "a partir de"), direto de servicos.ts. */
function precoDePartida() {
  const pacotes = servicosDa("negocios").flatMap((s) => (s.preco.tipo === "fixo" || s.preco.tipo === "aPartirDe" ? [{ nome: s.nome, valor: s.preco.valor }] : []));
  return pacotes.reduce((a, b) => (b.valor < a.valor ? b : a));
}

/** No celular o exemplo de painel vem depois do orçamento (que é o que o cliente veio fazer); no desktop fica ao lado do título. */
function useDesktop() {
  const consulta = "(min-width: 64rem)";
  const [desktop, setDesktop] = useState(() => typeof window !== "undefined" && window.matchMedia(consulta).matches);
  useEffect(() => {
    const m = window.matchMedia(consulta);
    const mudou = () => setDesktop(m.matches);
    m.addEventListener("change", mudou);
    return () => m.removeEventListener("change", mudou);
  }, []);
  return desktop;
}

function Negocios() {
  useEffect(() => ativarMagnetico(), []);
  const desktop = useDesktop();
  const partida = precoDePartida();

  return (
    <>
      <div className="progresso" aria-hidden="true" />
      <CabecalhoNegocios />
      <main id="conteudo">
        <section
          className="mx-auto grid w-full max-w-hero gap-8 px-margem pt-6 pb-8 sm:pt-10 sm:pb-14 pc:min-h-[calc(100svh-4.5rem)] pc:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] pc:items-center pc:gap-[clamp(2rem,4vw,4.5rem)] pc:py-6"
          id="apresentacao"
        >
          <div className="hero-sai">
            <span className="barra mb-5 block h-[3px] w-12 bg-destaque" aria-hidden="true" />
            <h1 className="mb-5 text-[clamp(2.75rem,12vw,5rem)] leading-[0.95] pc:text-[clamp(3rem,6vw,5rem)] font-extrabold tracking-[-0.035em]">
              <TituloCinetico texto={t.apresentacao.titulo} />
            </h1>
            <p style={{ "--atraso": 0.5 } as CSSProperties} className="entra mb-4 max-w-[36rem] text-[1.2rem] leading-[1.4] font-medium text-texto md:text-[1.35rem]">
              {t.apresentacao.subtitulo}
            </p>
            <p style={{ "--atraso": 0.65 } as CSSProperties} className="entra m-0 hidden max-w-[36rem] text-[1.05rem] text-texto-suave sm:block">{t.apresentacao.texto}</p>
            {/* O que o cliente precisa nos primeiros segundos: o preço de partida e como pedir. */}
            <p style={{ "--atraso": 0.65 } as CSSProperties} className="entra m-0 max-w-[36rem] text-[1rem] text-texto-suave sm:mt-4">
              {t.apresentacao.partida(partida.nome)} <strong className="font-mono text-texto">{t.apresentacao.aPartirDe(brl(partida.valor))}</strong>. {t.apresentacao.comoPedir}
            </p>
            <div style={{ "--atraso": 0.8 } as CSSProperties} className="entra mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row">
              <a data-magnetico className={`${botaoCheio} justify-center`} href="#orcamento">
                {t.apresentacao.botaoOrcamento}
              </a>
              <a data-magnetico className={`${botao} justify-center`} href="/como-funciona/">
                {t.apresentacao.botaoComoFunciona}
              </a>
            </div>
          </div>
          {desktop && (
            <div className="hero-painel">
              <PainelExemplo />
            </div>
          )}
        </section>
        <Orcamento />
        {!desktop && (
          <section className="mx-auto max-w-hero px-margem pb-14" id="exemplo" aria-labelledby="exemplo-titulo">
            <h2 id="exemplo-titulo" className="mb-4 text-[1.5rem]">
              {t.exemploTitulo}
            </h2>
            <PainelExemplo />
          </section>
        )}
        <section id="entregas"></section>
        <section id="como-funciona"></section>
        <section id="sobre"></section>
        <section id="contato"></section>
      </main>
      <Rodape ponte={{ ...t.ponte, href: "/comunidade/" }}>
        <ContatoRodape origem="negocios-rodape" />
      </Rodape>
    </>
  );
}

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <Negocios />
  </StrictMode>,
);
