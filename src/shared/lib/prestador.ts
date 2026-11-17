// Identificação de quem presta o serviço, a partir de site.ts. Usada no rodapé e nos Termos.
import { site } from "../../content/site";

type Prestador = Pick<typeof site, "nome" | "email" | "prestador">;

/** Partes da linha de identificação, na ordem: nome, CPF ou CNPJ, cidade/UF e e-mail. Campo sem dado fica de fora. */
export function identificacaoPrestador(s: Prestador = site): string[] {
  const { documento, cidadeUf } = s.prestador;
  return [s.nome, documento ? `${documento.tipo} ${documento.numero}` : null, cidadeUf, s.email].filter((p): p is string => Boolean(p));
}

/** O que ainda falta informar em site.prestador (para o teste e para a documentação avisarem). */
export function faltaNaIdentificacao(s: Prestador = site): string[] {
  const falta: string[] = [];
  if (!s.prestador.documento) falta.push("CPF ou CNPJ");
  if (!s.prestador.cidadeUf) falta.push("cidade/UF");
  return falta;
}
