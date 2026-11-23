import type { Bloco } from "../../../shared/lib/assistente/motor";

/** Blocos de uma resposta do assistente (texto, título, lista, dica, pergunta). Usado no chat e nas conversas anteriores. */
export function Corpo({ blocos }: { blocos: Bloco[] }) {
  return (
    <>
      {blocos.map((b, i) => {
        if (b.tipo === "titulo") {
          return (
            <p key={i} className="m-0 mt-3 text-base md:text-menor font-bold first:mt-0">
              {b.texto}
            </p>
          );
        }
        if (b.tipo === "lista") {
          return (
            <ul key={i} className="m-0 mt-2 grid list-disc gap-1 pl-5 text-base md:text-menor first:mt-0">
              {b.itens.map((item, j) => (
                <li key={j} className="[overflow-wrap:anywhere]">
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (b.tipo === "dica") {
          return (
            <p key={i} className="m-0 mt-3 border-l-2 border-destaque pl-3 text-base md:text-menor text-texto-suave [overflow-wrap:anywhere] first:mt-0">
              {b.texto}
            </p>
          );
        }
        return (
          <p key={i} className={`m-0 mt-2 text-base md:text-menor [overflow-wrap:anywhere] first:mt-0 ${b.tipo === "pergunta" ? "font-semibold" : ""}`}>
            {b.texto}
          </p>
        );
      })}
    </>
  );
}
