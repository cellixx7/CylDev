/** Telefone brasileiro: DDD (11 a 99) + 8 ou 9 dígitos, com 55 opcional na frente. */

export type TelefoneValidado = { valido: true; digitos: string } | { valido: false; erro: string };

export const ERRO_TELEFONE = "Informe o WhatsApp com DDD, por exemplo (61) 99999-9999.";

/** Só os dígitos do texto. */
export function soDigitos(texto: string): string {
  return texto.replace(/\D/g, "");
}

/**
 * Valida e normaliza. Aceita formatação livre (parênteses, espaços, hífen, +55).
 * `digitos` volta sempre com o prefixo 55, pronto para o envio.
 */
export function validarTelefone(texto: string): TelefoneValidado {
  let d = soDigitos(texto);
  // O 55 só é removido quando sobra um número nacional completo (10 ou 11 dígitos).
  if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2);
  if (d.length !== 10 && d.length !== 11) return { valido: false, erro: ERRO_TELEFONE };
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99) return { valido: false, erro: ERRO_TELEFONE };
  return { valido: true, digitos: `55${d}` };
}
