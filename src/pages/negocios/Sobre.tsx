import { Fragment, useEffect, useRef, useState } from "react";
import { site } from "../../content/site";
import { negocios, type DestaqueSobre } from "../../content/textos";
import { Avatar } from "../../shared/components/Avatar";
import { botao } from "../../shared/estilos";
import { DestaqueSobre as Destaque } from "./DestaqueSobre";
import { GaleriaUniser } from "./GaleriaUniser";
import { ModalSobre } from "./ModalSobre";
import { destinoFalarComigo, imagensDoUniser, paragrafosSobre } from "./sobreLogica";

const t = negocios.sobre;

/** Seção #sobre: avatar (foto ou iniciais), texto em primeira pessoa com destaques que abrem modal e, se houver, a galeria do Uniser. */
export function Sobre() {
  const paragrafos = paragrafosSobre(site);
  const imagens = imagensDoUniser(site);
  const destino = destinoFalarComigo(site);
  const [aberto, setAberto] = useState<DestaqueSobre | null>(null);
  const origem = useRef<HTMLElement | null>(null);
  const irParaDestino = useRef(false);

  const abrir = (id: DestaqueSobre) => (alvo: HTMLElement) => {
    origem.current = alvo;
    setAberto(id);
  };
  const falar = () => {
    origem.current = null;
    irParaDestino.current = true;
    setAberto(null);
  };

  // Depois que o modal fechou (o <dialog> e a trava de rolagem já foram desfeitos, pois efeitos de filho rodam antes):
  // devolve o foco ao destaque que abriu, ou segue para a âncora do "Falar comigo".
  useEffect(() => {
    if (aberto) return;
    const alvo = origem.current;
    origem.current = null;
    if (alvo) {
      alvo.dataset.semDica = "1"; // o foco devolvido não deve reabrir o balão
      alvo.focus({ preventScroll: true });
      delete alvo.dataset.semDica; // o evento de foco é síncrono; se não houve, a marca não fica pendurada
    }
    if (irParaDestino.current) {
      irParaDestino.current = false;
      if (window.location.hash !== destino.href) window.location.hash = destino.href;
      else document.getElementById(destino.href.slice(1))?.scrollIntoView();
    }
  }, [aberto, destino.href]);

  return (
    <section className="mx-auto max-w-hero scroll-mt-24 px-margem pt-14 pb-14" id="sobre" aria-labelledby="sobre-titulo">
      <span className="revela-barra mb-5 block h-[3px] w-12 bg-destaque" aria-hidden="true" />
      <h2 id="sobre-titulo" className="revela-titulo">
        {t.titulo}
      </h2>
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:gap-8">
        <Avatar nome={site.nome} foto={site.foto} />
        <div className="min-w-0 max-w-[40rem]">
          {paragrafos.map(({ id, partes }, i) => (
            <Fragment key={`${id}-${i}`}>
              <p className="mb-4 text-texto-suave">
                {partes.map((p, j) =>
                  p.destaque ? (
                    <Destaque key={j} texto={p.texto} dica={t.modais[p.destaque].dica} aoAbrir={abrir(p.destaque)} />
                  ) : (
                    <Fragment key={j}>{p.texto}</Fragment>
                  ),
                )}
              </p>
              {/* A galeria entra logo depois do parágrafo do Uniser. */}
              {id === "uniser" && <GaleriaUniser imagens={imagens} layout="linha" />}
            </Fragment>
          ))}
          <a
            data-magnetico
            className={`${botao} mt-2`}
            href={destino.href}
            {...(destino.externo ? { target: "_blank", rel: "noopener" } : {})}
          >
            {t.falarComigo}
          </a>
        </div>
      </div>
      <ModalSobre aberto={aberto} imagens={imagens} destino={destino} aoFechar={() => setAberto(null)} aoFalar={falar} />
    </section>
  );
}
