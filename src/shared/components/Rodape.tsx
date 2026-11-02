import type { ReactNode } from "react";
import { comum } from "../../content/textos";

type Props = {
  ponte: { texto: string; link: string; href: string };
  children?: ReactNode;
};

export function Rodape({ ponte, children }: Props) {
  return (
    <footer className="rodape">
      <p className="rodape__ponte">
        {ponte.texto} <a href={ponte.href}>{ponte.link}</a>
      </p>
      {children}
      <p className="rodape__privacidade">{comum.privacidade}</p>
    </footer>
  );
}
