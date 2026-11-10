import { useCallback, useEffect, useRef, useState } from "react";
import { lerHash, montarHash, type AbaModal, type ServicoNaUrl } from "../../shared/lib/hashServico";

/**
 * Serviço aberto no modal, sincronizado com o hash da URL.
 * - Abrir por botão faz `pushState`: o "voltar" do navegador fecha o modal.
 * - Fechar por botão, Esc ou fundo desfaz a entrada com `history.back()` (se ela é nossa) ou, quando o modal veio
 *   de um link direto, só tira o hash com `replaceState`. A página nunca rola nem fica com `#` solto.
 * - Trocar de aba usa `replaceState`, para o "voltar" não ficar preso em abas.
 */
export function useServicoNaUrl() {
  const [aberto, setAberto] = useState<ServicoNaUrl | null>(() =>
    typeof window === "undefined" ? null : lerHash(window.location.hash),
  );
  const entradaNossa = useRef(false);

  useEffect(() => {
    const sincronizar = () => {
      const novo = lerHash(window.location.hash);
      if (!novo) entradaNossa.current = false;
      setAberto((atual) => (atual?.id === novo?.id && atual?.aba === novo?.aba ? atual : novo));
    };
    window.addEventListener("popstate", sincronizar);
    return () => window.removeEventListener("popstate", sincronizar);
  }, []);

  const abrir = useCallback((id: string, aba: AbaModal) => {
    window.history.pushState(null, "", montarHash(id, aba));
    entradaNossa.current = true;
    setAberto({ id, aba });
  }, []);

  const trocarAba = useCallback((aba: AbaModal) => {
    setAberto((atual) => {
      if (!atual || atual.aba === aba) return atual;
      window.history.replaceState(window.history.state, "", montarHash(atual.id, aba));
      return { id: atual.id, aba };
    });
  }, []);

  const fechar = useCallback(() => {
    if (entradaNossa.current) {
      entradaNossa.current = false;
      window.history.back(); // o popstate fecha o modal
      return;
    }
    if (window.location.hash) {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    }
    setAberto(null);
  }, []);

  return { aberto, abrir, trocarAba, fechar };
}
