import type { ReactNode } from "react";
import { comum, negocios } from "../../content/textos";
import { identificacaoPrestador } from "../lib/prestador";
import { linkContato } from "../lib/whatsapp";
import { AvisoNovaAba } from "./AvisoNovaAba";
import { rota } from "../i18n/rota";

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
        <a className="inline-block min-h-alvo leading-[44px]" href={rota(ponte.href)}>
          {ponte.link}
        </a>
      </p>
      {children}
      {/* Identificação de quem vende (Decreto 7.962/2013): nome, CPF ou CNPJ, cidade/UF e e-mail, o que houver em site.prestador. */}
      <p className="m-0" data-prestador>
        {comum.rodape.prestador} {identificacaoPrestador().join(" · ")}
      </p>
      {/* Links curtos; os textos completos moram nas páginas de leitura. */}
      <p className="m-0">{comum.rodape.semRastreio}</p>
      <nav aria-label={comum.rodape.rotulo} className="flex flex-wrap items-center gap-x-6">
        <a className={link} href={rota("/termos/")}>
          {comum.rodape.termos}
        </a>
        <a className={link} href={rota("/privacidade/")}>
          {comum.privacidadeLink}
        </a>
        <a className={link} href={rota("/perguntas/")}>
          {comum.rodape.perguntas}
        </a>
        <a className={link} href={rota("/acessibilidade/")}>
          {comum.rodape.acessibilidade}
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
        <AvisoNovaAba />
      </a>
    </p>
  );
}
