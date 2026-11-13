import { site } from "../../content/site";
import { negocios } from "../../content/textos";
import { Avatar } from "../../shared/components/Avatar";
import { botao, rotuloFicticio } from "../../shared/estilos";
import { destinoFalarComigo, imagensDoUniser, paragrafosSobre } from "./sobreLogica";

const t = negocios.sobre;

/** Seção #sobre: avatar (foto ou iniciais), texto em primeira pessoa e, se houver, a galeria do Uniser. */
export function Sobre() {
  const paragrafos = paragrafosSobre(site);
  const imagens = imagensDoUniser(site);
  const destino = destinoFalarComigo(site);
  // A galeria entra logo depois do parágrafo do Uniser.
  const indiceUniser = site.mostrarUniser ? paragrafos.indexOf(t.uniser) : -1;

  return (
    <section className="mx-auto max-w-hero scroll-mt-24 px-margem pt-14 pb-14" id="sobre" aria-labelledby="sobre-titulo">
      <span className="revela-barra mb-5 block h-[3px] w-12 bg-destaque" aria-hidden="true" />
      <h2 id="sobre-titulo" className="revela-titulo">
        {t.titulo}
      </h2>
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:gap-8">
        <Avatar nome={site.nome} foto={site.foto} />
        <div className="min-w-0 max-w-[40rem]">
          {paragrafos.map((texto, i) => (
            <div key={texto}>
              <p className="mb-4 text-texto-suave">{texto}</p>
              {i === indiceUniser && imagens.length > 0 && (
                <ul className="mb-4 flex list-none snap-x gap-3 overflow-x-auto p-0 sm:grid sm:grid-cols-3 sm:overflow-visible" aria-label={t.imagensUniser}>
                  {imagens.map((img) => (
                    <li key={img.src} className="w-[75%] shrink-0 snap-start sm:w-auto">
                      <img className="block h-auto w-full border border-linha" src={img.src} alt={img.alt} width={640} height={400} loading="lazy" />
                      <span className={`${rotuloFicticio} mt-2`}>{t.rotuloImagem}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
    </section>
  );
}
