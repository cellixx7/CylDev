import { partesDoTexto } from "../lib/texto-rico";
import { AvisoNovaAba } from "./AvisoNovaAba";

/** Texto de conteúdo com links no formato [rótulo](endereço). Link externo abre em outra aba. */
export function TextoRico({ texto }: { texto: string }) {
  return (
    <>
      {partesDoTexto(texto).map((p, i) =>
        p.href ? (
          <a key={i} href={p.href} {...(p.href.startsWith("https://") ? { target: "_blank", rel: "noopener" } : {})}>
            {p.texto}
            {p.href.startsWith("https://") && <AvisoNovaAba />}
          </a>
        ) : (
          p.texto
        ),
      )}
    </>
  );
}
