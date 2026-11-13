import type { KeyboardEvent } from "react";
import { useBalao } from "../../shared/components/Dica";
import { focoVisivel } from "../../shared/estilos";
import { IconeAbrir } from "./icones";

type Props = {
  /** Trecho do parágrafo. */
  texto: string;
  /** Balão ("Saiba mais sobre o curso"). Também é a descrição acessível. */
  dica: string;
  /** Recebe o próprio destaque, para o foco voltar a ele quando o modal fechar. */
  aoAbrir: (alvo: HTMLElement) => void;
};

/**
 * Trecho do texto que abre um modal. É um <span role="button">, e não um <button>, de propósito: botão é caixa atômica
 * e não quebra de linha como texto; o span quebra. O balão abre com mouse ou foco de teclado; no toque, só o modal.
 * O alvo de 44 px vem do padding vertical do span inline, que não empurra as linhas.
 */
export function DestaqueSobre({ texto, dica, aoAbrir }: Props) {
  const { id, botao, balao, aberta, estiloBalao, setMouse, setFoco, fechar } = useBalao<HTMLSpanElement>(dica);

  const abrir = () => {
    fechar();
    if (botao.current) aoAbrir(botao.current);
  };
  const aoTeclar = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (e.repeat) return;
    abrir();
  };

  // A última palavra viaja com o ícone, para ele não ficar sozinho no começo da linha.
  const corte = texto.lastIndexOf(" ") + 1;
  const inicio = texto.slice(0, corte);
  const fim = texto.slice(corte);

  return (
    <>
      <span
        ref={botao}
        role="button"
        tabIndex={0}
        aria-describedby={id}
        onClick={abrir}
        onKeyDown={aoTeclar}
        onPointerEnter={(e) => e.pointerType === "mouse" && setMouse(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setMouse(false)}
        onFocus={(e) => {
          const el = e.currentTarget;
          if (el.dataset.semDica) delete el.dataset.semDica;
          else setFoco(el.matches(":focus-visible"));
        }}
        onBlur={fechar}
        className={`cursor-pointer py-[0.7rem] font-semibold text-texto underline decoration-destaque decoration-2 underline-offset-4 [text-decoration-style:dotted] hover:[text-decoration-style:solid] active:[text-decoration-style:solid] ${focoVisivel}`}
      >
        {inicio}
        <span className="whitespace-nowrap">
          {fim}
          <IconeAbrir className="ml-1 inline-block size-[0.8em] align-[-0.05em] text-destaque" />
        </span>
      </span>
      <span
        ref={balao}
        id={id}
        role="tooltip"
        hidden={!aberta}
        style={estiloBalao}
        className="fixed z-50 rounded-pequeno border border-linha bg-superficie px-3 py-2 text-left text-[0.9375rem] leading-snug font-normal text-texto"
      >
        {dica}
      </span>
    </>
  );
}
