import { useEffect } from "react";

let travas = 0;

/** Trava a rolagem da página enquanto algum dialog está aberto. Um contador evita que fechar um destrave o outro. */
export function useTravaRolagem(ativo: boolean) {
  useEffect(() => {
    if (!ativo) return;
    travas++;
    document.documentElement.classList.add("modal-aberto");
    return () => {
      travas = Math.max(0, travas - 1);
      if (travas === 0) document.documentElement.classList.remove("modal-aberto");
    };
  }, [ativo]);
}
