import { site } from "../../content/site";
import { negocios, type ParteSobre } from "../../content/textos";
import { linkContato } from "../../shared/lib/whatsapp";

type Flags = Pick<typeof site, "mostrarMinisterio" | "mostrarUniser" | "menuSecoes">;
type Textos = typeof negocios.sobre;

export type BlocoSobre = { id: "fixo" | "ministerio" | "uniser" | "atendimento"; partes: ParteSobre[] };

/** Blocos da seção, na ordem: os fixos, o Ministério e o Uniser (só com a flag) e, por fim, o atendimento online. Os destaques de cada bloco somem junto com ele. */
export function paragrafosSobre(flags: Pick<Flags, "mostrarMinisterio" | "mostrarUniser">, t: Textos = negocios.sobre): BlocoSobre[] {
  return [
    ...t.paragrafos.map((partes): BlocoSobre => ({ id: "fixo", partes })),
    ...(flags.mostrarMinisterio ? [{ id: "ministerio" as const, partes: t.ministerio }] : []),
    ...(flags.mostrarUniser ? [{ id: "uniser" as const, partes: t.uniser }] : []),
    { id: "atendimento", partes: [{ texto: t.atendimento }] },
  ];
}

/** A galeria só existe com o Uniser visível e com ao menos uma imagem cadastrada. */
export function imagensDoUniser(flags: Pick<Flags, "mostrarUniser">, imagens: typeof site.imagensUniser = site.imagensUniser) {
  return flags.mostrarUniser ? imagens : [];
}

/** "Falar comigo" vai para #contato quando a seção existe (menu ligado); até lá, abre o WhatsApp. */
export function destinoFalarComigo(flags: Pick<Flags, "menuSecoes">) {
  return flags.menuSecoes.contato
    ? { href: "#contato", externo: false }
    : { href: linkContato("negocios-sobre"), externo: true };
}
