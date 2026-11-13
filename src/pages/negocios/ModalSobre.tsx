import { useEffect, useRef } from "react";
import type { site } from "../../content/site";
import { negocios, type DestaqueSobre } from "../../content/textos";
import { botaoCheio, focoVisivel } from "../../shared/estilos";
import { CenasEstagio } from "./CenasEstagio";
import { GaleriaUniser } from "./GaleriaUniser";
import { IconeFechar } from "./icones";
import { useTravaRolagem } from "./useTravaRolagem";

const t = negocios.sobre;

type Props = {
  aberto: DestaqueSobre | null;
  /** Telas do Uniser (vazio sem a flag); só o modal do Uniser as mostra. */
  telas: typeof site.telasUniser;
  destino: { href: string; externo: boolean };
  aoFechar: () => void;
  /** "Falar comigo" para a âncora interna: o pai fecha o modal e só então rola. */
  aoFalar: () => void;
};

/**
 * Modal dos destaques da seção Sobre, em <dialog> nativo (mesmo padrão do ModalServico): showModal() torna o resto
 * inerte e o Esc fecha; clique no fundo e o "X" também. O foco vai para o título ao abrir; quem devolve o foco é o pai.
 */
export function ModalSobre({ aberto, telas, destino, aoFechar, aoFalar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const modal = aberto ? t.modais[aberto] : null;
  const visivel = !!modal;

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (visivel && !d.open) {
      d.showModal();
      titulo.current?.focus({ preventScroll: true });
    } else if (!visivel && d.open) {
      d.close();
    }
  }, [visivel]);

  useTravaRolagem(visivel);

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="modal-sobre-titulo"
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
      className="modal-sobre m-auto hidden h-[calc(100dvh-1rem)] max-h-none w-[calc(100%-1rem)] max-w-none flex-col overflow-hidden border border-linha bg-fundo p-0 text-texto open:flex md:h-auto md:max-h-[90dvh] md:max-w-[40rem] backdrop:bg-[rgb(0_0_0/0.6)]"
    >
      {modal && (
        <>
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-linha px-4 pt-3 pb-2 md:px-6">
            <h2 id="modal-sobre-titulo" ref={titulo} tabIndex={-1} className="m-0 py-2 text-[1.35rem] leading-tight outline-none">
              {modal.titulo}
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

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
            <p className="m-0 mb-5 text-texto-suave">{modal.texto}</p>
            {modal.secoes.map((s) => (
              <section key={s.subtitulo} className="mb-5">
                <h3 className="m-0 mb-2 text-[1.0625rem]">{s.subtitulo}</h3>
                {s.texto && <p className="m-0 text-texto-suave">{s.texto}</p>}
                {s.mais?.map((p) => (
                  <p key={p} className="m-0 mt-3 text-texto-suave">
                    {p}
                  </p>
                ))}
                {s.itens && (
                  <ul className="m-0 list-disc pl-5 text-texto-suave">
                    {s.itens.map((item) => (
                      <li key={item} className="mb-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            {modal.fecho && <p className="m-0 mb-5 text-texto-suave">{modal.fecho}</p>}
            {aberto === "estagio" && <CenasEstagio />}
            {aberto === "uniser" && <GaleriaUniser telas={telas} layout="grade" />}
          </div>

          <footer className="shrink-0 border-t border-linha bg-superficie px-4 pt-3 pb-3 md:px-6">
            <a
              className={`${botaoCheio} w-full justify-center text-center ${focoVisivel}`}
              href={destino.href}
              {...(destino.externo
                ? { target: "_blank", rel: "noopener" }
                : {
                    onClick: (e) => {
                      e.preventDefault();
                      aoFalar();
                    },
                  })}
            >
              {t.falarComigo}
            </a>
          </footer>
        </>
      )}
    </dialog>
  );
}
