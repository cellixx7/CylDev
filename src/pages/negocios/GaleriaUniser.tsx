import type { site } from "../../content/site";
import { negocios } from "../../content/textos";
import { rotuloFicticio } from "../../shared/estilos";

const t = negocios.sobre;

type Props = {
  imagens: typeof site.imagensUniser;
  /** "linha": carrossel no celular e três colunas no tablet (seção). "coluna": uma abaixo da outra, maiores (modal). */
  layout: "linha" | "coluna";
};

/** Imagens do Uniser, cada uma com o rótulo de exemplo. As reais entram trocando só os arquivos e `site.imagensUniser`. */
export function GaleriaUniser({ imagens, layout }: Props) {
  if (imagens.length === 0) return null;
  const lista =
    layout === "linha"
      ? "mb-4 flex list-none snap-x gap-3 overflow-x-auto p-0 sm:grid sm:grid-cols-3 sm:overflow-visible"
      : "m-0 flex list-none flex-col gap-5 p-0";
  const item = layout === "linha" ? "w-[75%] shrink-0 snap-start sm:w-auto" : "";
  return (
    <ul className={lista} aria-label={t.imagensUniser}>
      {imagens.map((img) => (
        <li key={img.src} className={item}>
          <img className="block h-auto w-full border border-linha" src={img.src} alt={img.alt} width={640} height={400} loading="lazy" />
          <span className={`${rotuloFicticio} mt-2`}>{t.rotuloImagem}</span>
        </li>
      ))}
    </ul>
  );
}
