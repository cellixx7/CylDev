import { site } from "../../content/site";

/** Monta o link wa.me com a mensagem codificada. O número fica só com dígitos. */
export function whatsappLink(numero: string, mensagem: string): string {
  const digitos = numero.replace(/\D/g, "");
  if (!digitos) throw new Error("Número de WhatsApp vazio.");
  const texto = mensagem.trim();
  return texto
    ? `https://wa.me/${digitos}?text=${encodeURIComponent(texto)}`
    : `https://wa.me/${digitos}`;
}

/** Mensagem padrão com a origem escrita, para o Marcelo saber de onde veio o contato. */
export function mensagemComOrigem(origem: string, complemento?: string): string {
  const base = `Oi, Marcelo! Vim pelo site (origem: ${origem}).`;
  return complemento ? `${base}\n${complemento}` : base;
}

export function linkContato(origem: string, complemento?: string): string {
  return whatsappLink(site.whatsapp, mensagemComOrigem(origem, complemento));
}
