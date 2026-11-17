import type { ReactNode } from "react";

type Props = {
  /** Âncora da seção (`#id`). O título recebe `${id}-titulo` e é ligado pelo `aria-labelledby`. */
  id: string;
  titulo: string;
  /** Parágrafo curto abaixo do título, na largura de leitura. */
  intro?: ReactNode;
  /** Quando o título recebe foco por script (ex.: ao fechar um painel). */
  tituloFocavel?: boolean;
  children?: ReactNode;
};

/** Esqueleto de toda seção: largura, respiro, barra de destaque, `h2` e intro. Guia em docs/DESIGN.md. */
export const classesSecao = "mx-auto max-w-hero scroll-mt-24 px-margem pt-14 pb-14";

export function Secao({ id, titulo, intro, tituloFocavel = false, children }: Props) {
  const idTitulo = `${id}-titulo`;
  return (
    <section className={classesSecao} id={id} aria-labelledby={idTitulo}>
      <span className="revela-barra mb-5 block h-[3px] w-12 bg-destaque" aria-hidden="true" />
      <h2 id={idTitulo} className="revela-titulo outline-none" {...(tituloFocavel ? { tabIndex: -1 } : {})}>
        {titulo}
      </h2>
      {intro && <p className="max-w-leitura text-texto-suave">{intro}</p>}
      {children}
    </section>
  );
}
