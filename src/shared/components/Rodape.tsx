import type { ReactNode } from "react";
import { comum } from "../../content/textos";

type Props = {
  ponte: { texto: string; link: string; href: string };
  children?: ReactNode;
};

export function Rodape({ ponte, children }: Props) {
  return (
    <footer className="mx-auto max-w-site border-t border-linha px-margem pt-9 pb-14 text-[1rem] text-texto-suave">
      <p className="font-semibold text-texto">
        {ponte.texto}{" "}
        <a className="inline-block min-h-alvo leading-[44px]" href={ponte.href}>
          {ponte.link}
        </a>
      </p>
      {children}
      <p>{comum.privacidade}</p>
    </footer>
  );
}
