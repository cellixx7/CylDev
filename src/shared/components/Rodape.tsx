import type { ReactNode } from "react";
import { comum, negocios } from "../../content/textos";
import { linkContato } from "../lib/whatsapp";

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

/** Link discreto de WhatsApp para o rodapé das páginas de Negócios. */
export function ContatoRodape({ origem }: { origem: string }) {
  return (
    <p>
      {negocios.rodapeWhatsapp}{" "}
      <a className="inline-block min-h-alvo leading-[44px]" href={linkContato(origem)} target="_blank" rel="noopener">
        {negocios.rodapeWhatsappLink}
      </a>
    </p>
  );
}
