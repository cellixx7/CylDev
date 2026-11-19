import { StrictMode, useEffect, useState, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/tailwind.css";
import "../../styles/tema-negocios.css";
import { site } from "../../content/site";
import { negocios as t } from "../../content/textos";
import { CabecalhoNegocios } from "../../shared/components/cabecalho/CabecalhoNegocios";
import { Carrossel } from "../../shared/components/Carrossel";
import { Contatos } from "../../shared/components/Contatos";
import { ContatoRodape, Rodape } from "../../shared/components/Rodape";
import { Secao } from "../../shared/components/Secao";
import { botao, botaoCheio } from "../../shared/estilos";
import { brl } from "../../shared/lib/formato";
import { precoDePartida } from "../../shared/lib/seo";
import { linkContato } from "../../shared/lib/whatsapp";
import { ativarMagnetico } from "./magnetico";
import { Orcamento } from "./orcamento/Orcamento";
import { PainelExemplo } from "./exemplo/PainelExemplo";
import { Sobre } from "./sobre/Sobre";

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

/** Seção #entregas: os 5 passos do pedido à entrega, numerados. Uma coluna no celular, cinco no desktop. */
function Entregas() {
  const c = t.comoFunciona;
  return (
    <Secao id="entregas" titulo={c.titulo} intro={c.intro}>
      <div className="revela mt-6">
      <Carrossel as="ol" gradeMd="md:grid-cols-2 md:gap-x-6 md:gap-y-5 pc:grid-cols-5">
        {c.passos.map((p, i) => (
          <li key={p.titulo} className="grid grid-cols-[auto_minmax(0,1fr)] content-start gap-x-3 gap-y-1 rounded-pequeno border border-linha bg-superficie p-4 md:rounded-none md:border-0 md:border-t md:bg-transparent md:p-0 md:pt-3 pc:grid-cols-1">
            <span className="font-mono text-medio font-bold text-destaque" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="m-0 mb-1 text-medio">{p.titulo}</h3>
              <p className="m-0 text-texto-suave">{p.texto}</p>
            </div>
          </li>
        ))}
      </Carrossel>
      </div>
      <p className="mt-6 mb-0 font-semibold">{c.pagamento}</p>
      <p className="mt-2 mb-0 text-texto-suave">
        {c.regras.antes}{" "}
        <a className="py-3" href="/termos/">
          {c.regras.termos}
        </a>{" "}
        {c.regras.meio}{" "}
        <a className="py-3" href="/perguntas/">
          {c.regras.perguntas}
        </a>
        .
      </p>
    </Secao>
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
              </a>
              <a data-magnetico className={`${botao} justify-center`} href="/como-funciona/">
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
        <Entregas />
        <Sobre />
        <Secao id="contato" titulo={t.contato.titulo} intro={t.contato.intro}>
          <Contatos origem="negocios-contato" />
        </Secao>
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
