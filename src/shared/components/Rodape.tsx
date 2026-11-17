import type { ReactNode } from "react";
import { comum, negocios } from "../../content/textos";
import { linkContato } from "../lib/whatsapp";

type Props = {
  ponte: { texto: string; link: string; href: string };
  /** Âncora da seção de contato da área (a home de Negócios por padrão). */
  contatoHref?: string;
  children?: ReactNode;
};

const link = "inline-flex min-h-alvo items-center";

export function Rodape({ ponte, contatoHref = "/#contato", children }: Props) {
  return (
    <footer className="mx-auto max-w-site border-t border-linha px-margem pt-9 pb-14 text-base text-texto-suave">
      <p className="font-semibold text-texto">
        {ponte.texto}{" "}
        <a className="inline-block min-h-alvo leading-[44px]" href={ponte.href}>
          {ponte.link}
        </a>
      </p>
      {children}
      {/* Links curtos; o texto completo de privacidade mora em /privacidade/. */}
      <p className="m-0">{comum.rodape.semRastreio}</p>
      <nav aria-label={comum.rodape.rotulo} className="flex flex-wrap items-center gap-x-6">
        <a className={link} href="/privacidade/">
          {comum.privacidadeLink}
        </a>
        <a className={link} href={contatoHref}>
          {comum.rodape.contato}
        </a>
      </nav>
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
