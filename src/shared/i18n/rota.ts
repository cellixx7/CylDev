// Endereços internos no idioma da página atual. O idioma vem do build (vite.config.ts define __IDIOMA__):
// cada idioma é um site estático em /<codigo>/, com o português na raiz.
import { dadosDoIdioma, enderecoNoIdioma, type CodigoIdioma } from "./idiomas";

declare const __IDIOMA__: CodigoIdioma | undefined;

/** Idioma deste build. Em testes (sem o define) vale o português. */
export const idiomaAtual: CodigoIdioma = typeof __IDIOMA__ === "undefined" ? "pt" : __IDIOMA__;
export const dadosIdiomaAtual = dadosDoIdioma(idiomaAtual);

/** Põe o prefixo do idioma atual em um endereço interno ("/termos/" vira "/en/termos/"). Links externos e âncoras passam direto. */
export function rota(endereco: string): string {
  return enderecoNoIdioma(endereco, idiomaAtual);
}
