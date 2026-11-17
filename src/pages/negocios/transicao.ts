import { addTransitionType, startTransition } from "react";

/**
 * Roda uma atualização de estado como transição de view do React (<ViewTransition>).
 * O tipo "local" marca a transição como "dentro da página": o CSS (tema-negocios.css) usa isso para a página
 * inteira não repetir o fade da troca de página (tailwind.css), que é só para navegação entre documentos.
 */
export function comTransicao(atualizar: () => void) {
  startTransition(() => {
    addTransitionType("local");
    atualizar();
  });
}
