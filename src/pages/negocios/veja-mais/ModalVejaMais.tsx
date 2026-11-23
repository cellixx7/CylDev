import { useEffect, useRef, type ReactNode } from "react";
import { vejaMais as t } from "../../../content/textos";
import { focoVisivel } from "../../../shared/estilos";
import { IconeFechar } from "../icones";
import { useTravaRolagem } from "../useTravaRolagem";

type Props = {
  aberto: boolean;
  titulo: string;
  aoFechar: () => void;
  /** `largo` é o painel: ocupa quase a tela toda. */
  largo?: boolean;
  children: ReactNode;
};

/**
 * <dialog> nativo (mesmo padrão do ModalSobre): showModal() deixa o resto inerte, o Esc fecha, clique no fundo e "X" também.
 * O foco vai para o título ao abrir; quem devolve o foco ao botão de origem é o pai, depois que o modal fecha.
 */
export function ModalVejaMais({ aberto, titulo, aoFechar, largo = false, children }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (aberto && !d.open) {
      d.showModal();
      tituloRef.current?.focus({ preventScroll: true });
    } else if (!aberto && d.open) {
      d.close();
    }
  }, [aberto]);

  useTravaRolagem(aberto);

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="modal-veja-mais-titulo"
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
      className={`modal-sobre m-auto hidden h-[calc(100dvh-1rem)] max-h-none w-[calc(100%-1rem)] max-w-none flex-col overflow-hidden border border-linha bg-fundo p-0 text-texto open:flex md:h-auto md:max-h-[92dvh] ${largo ? "md:w-[min(72rem,calc(100%-3rem))]" : "md:max-w-[min(56rem,calc(100%-3rem))]"} backdrop:bg-[rgb(0_0_0/0.6)]`}
    >
      {aberto && (
        <>
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-linha px-4 pt-3 pb-2 md:px-6">
            <h2 id="modal-veja-mais-titulo" ref={tituloRef} tabIndex={-1} className="m-0 py-2 text-grande leading-tight outline-none">
              {titulo}
            </h2>
            <button
              type="button"
              onClick={aoFechar}
              aria-label={t.fechar}
              className={`grid size-alvo shrink-0 cursor-pointer place-items-center rounded-pequeno border border-linha bg-transparent p-0 text-texto hover:bg-realce active:bg-realce ${focoVisivel}`}
            >
              <IconeFechar />
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">{children}</div>
        </>
      )}
    </dialog>
  );
}
