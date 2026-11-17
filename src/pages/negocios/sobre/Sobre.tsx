import { Fragment, useEffect, useRef, useState } from "react";
import { site } from "../../../content/site";
import { negocios, type DestaqueSobre } from "../../../content/textos";
import { Avatar } from "../../../shared/components/Avatar";
import { Secao } from "../../../shared/components/Secao";
import { botao } from "../../../shared/estilos";
import { DestaqueSobre as Destaque } from "./DestaqueSobre";
import { cenasEstagio } from "../../../content/cenasEstagio";
import { CenaPlanilha } from "./CenasEstagio";
import { GaleriaUniser } from "./GaleriaUniser";
import { ModalSobre } from "./ModalSobre";
import { destinoBotaoSobre, mostrarCenaPlanilha, paragrafosSobre, telasDaSecao, telasDoUniser } from "./sobreLogica";

const t = negocios.sobre;

/** Seção #sobre: avatar (foto ou iniciais), texto em primeira pessoa com destaques que abrem modal e, ao lado, a cena da planilha e duas telas do Uniser (as demais ficam só no modal). */
export function Sobre() {
  const paragrafos = paragrafosSobre(site);
  const telas = telasDoUniser(site);
  const telasLado = telasDaSecao(telas);
  const cenaPlanilha = mostrarCenaPlanilha(site);
  const temLado = cenaPlanilha || telasLado.length > 0;
  const destino = destinoBotaoSobre();
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
  // devolve o foco ao destaque que abriu, ou segue para a âncora do "Fazer orçamento".
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
    <Secao id="sobre" titulo={t.titulo}>
      <div className="mt-6 grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-8 pc:grid-cols-[auto_minmax(0,40rem)_22rem]">
        <Avatar nome={site.nome} foto={site.foto} />
        <div className="min-w-0 max-w-leitura">
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
            </Fragment>
          ))}
          <a
            data-magnetico
            className={`${botao} mt-2`}
            href={destino.href}
            {...(destino.externo ? { target: "_blank", rel: "noopener" } : {})}
          >
            {t.botaoOrcamento}
          </a>
        </div>
        {temLado && (
          <aside className="flex min-w-0 max-w-leitura flex-col gap-5 sm:col-start-2 pc:col-start-3 pc:row-start-1 pc:max-w-none" aria-label={t.lado}>
            {cenaPlanilha && (
              <div>
                <CenaPlanilha />
                <p className="mt-1 mb-0 text-menor text-texto-suave">{cenasEstagio.avisoCena}</p>
              </div>
            )}
            <GaleriaUniser telas={telasLado} layout="lateral" />
          </aside>
        )}
      </div>
      <ModalSobre aberto={aberto} telas={telas} destino={destino} aoFechar={() => setAberto(null)} aoFalar={falar} />
    </Secao>
  );
}
