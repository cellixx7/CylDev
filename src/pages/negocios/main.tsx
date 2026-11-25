import { StrictMode, useEffect, useState, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/tailwind.css";
import "../../styles/tema-negocios.css";
import { site } from "../../content/site";
import { negocios as t } from "../../content/textos";
import { CabecalhoNegocios } from "../../shared/components/cabecalho/CabecalhoNegocios";
import { Contatos } from "../../shared/components/Contatos";
import { ContatoRodape, Rodape } from "../../shared/components/Rodape";
import { Secao } from "../../shared/components/Secao";
import { botao, botaoCheio } from "../../shared/estilos";
import { brl } from "../../shared/lib/formato";
import { precoDePartida } from "../../shared/lib/seo";
import { linkContato } from "../../shared/lib/whatsapp";
import { idiomaAtual } from "../../shared/i18n/rota";
import { BotaoAssistente } from "./assistente/BotaoAssistente";
import { ativarMagnetico } from "./magnetico";
import { Orcamento } from "./orcamento/Orcamento";
import { PainelExemplo } from "./exemplo/PainelExemplo";
import { Sobre } from "./sobre/Sobre";
import { VejaMais } from "./veja-mais/VejaMais";
import { AvisoNovaAba } from "../../shared/components/AvisoNovaAba";

// Título cinético: cada palavra sobe de uma máscara, em cascata (ver .letra em tema-negocios.css).
function TituloCinetico({ texto }: { texto: string }) {
  return (
    <span aria-label={texto}>
      {texto.split(" ").map((palavra, i) => (
        <span key={i} className="palavra" aria-hidden="true">
          <span className="mascara">
            <span className="letra" style={{ "--i": i } as CSSProperties}>
              {palavra}
            </span>
          </span>{" "}
        </span>
      ))}
    </span>
  );
}

/** No celular o exemplo de painel vem depois do orçamento (que é o que o cliente veio fazer); no desktop fica ao lado do título. */
function useDesktop() {
  const consulta = "(min-width: 62rem)"; // o mesmo corte de `pc:` (tailwind.css)
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
            {/* O nome é o sobretítulo; o h1 é a promessa (o que a pessoa leva). */}
            <p className="entra mb-3 font-mono text-menor font-bold tracking-[0.08em] text-destaque uppercase">{site.nome}</p>
            <h1 className="mb-5 text-hero leading-[1.02] font-extrabold tracking-[-0.03em] pc:text-hero-pc">
              <TituloCinetico texto={t.apresentacao.titulo} />
            </h1>
            <p style={{ "--atraso": 0.5 } as CSSProperties} className="entra mb-4 max-w-leitura text-medio leading-[1.45] font-medium text-texto md:text-grande md:leading-[1.4]">
              {t.apresentacao.subtitulo}
            </p>
            <p style={{ "--atraso": 0.65 } as CSSProperties} className="entra m-0 hidden max-w-leitura text-texto-suave sm:block">{t.apresentacao.texto}</p>
            {/* O que o cliente precisa nos primeiros segundos: o preço de partida e como pedir. */}
            <p style={{ "--atraso": 0.65 } as CSSProperties} className="entra m-0 max-w-leitura text-texto-suave sm:mt-4">
              {t.apresentacao.partida(partida.nome)} <strong className="font-mono text-texto">{t.apresentacao.aPartirDe(brl(partida.valor))}</strong>. {t.apresentacao.comoPedir}
            </p>
            <div style={{ "--atraso": 0.8 } as CSSProperties} className="entra mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row">
              <a data-magnetico className={`${botaoCheio} justify-center`} href="#orcamento">
                {t.apresentacao.botaoOrcamento}
              </a>
              <a className={`${botao} justify-center sm:hidden`} href={linkContato("negocios-hero")} target="_blank" rel="noopener">
                {t.apresentacao.botaoWhatsapp}
                <AvisoNovaAba />
              </a>
              <a data-magnetico className={`${botao} justify-center`} href="#veja-mais">
                {t.apresentacao.botaoComoFunciona}
              </a>
            </div>
          </div>
          {desktop && (
            <div className="hero-painel">
              <PainelExemplo nivel={2} />
            </div>
          )}
        </section>
        <Orcamento />
        {!desktop && (
          <Secao id="exemplo" titulo={t.exemploTitulo}>
            <div className="mt-6">
              <PainelExemplo nivel={3} />
            </div>
          </Secao>
        )}
        <VejaMais />
        <Sobre />
        <Secao id="contato" titulo={t.contato.titulo} intro={t.contato.intro}>
          <Contatos origem="negocios-contato" />
        </Secao>
      </main>
      <Rodape ponte={{ ...t.ponte, href: "/comunidade/" }}>
        <ContatoRodape origem="negocios-rodape" />
      </Rodape>
      {/* O assistente entende e responde só em português por enquanto (docs/decisoes/idiomas.md). */}
      {idiomaAtual === "pt" && <BotaoAssistente />}
    </>
  );
}

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <Negocios />
  </StrictMode>,
);
