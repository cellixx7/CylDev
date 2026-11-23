import { comum } from "../../content/textos";

/** Texto só para leitor de tela, no fim de um link com target="_blank". */
export function AvisoNovaAba() {
  return <span className="sr-only">{comum.novaAba}</span>;
}
