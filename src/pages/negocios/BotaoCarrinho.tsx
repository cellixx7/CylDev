import { useId, useState, type KeyboardEvent } from "react";
import { orcamento } from "../../content/textos";

const t = orcamento.cards.carrinho;

type Props = {
  nome: string;
  dentro: boolean;
  /** Entra no combo: a dica menciona o desconto (sem número). */
  combinavel: boolean;
  aoAlternar: () => void;
};

/**
 * Ícone de carrinho no canto do card. Vazio: só contorno. No carrinho: preenchido com a cor do botão principal
 * (var do tema, via `text-destaque`). O preenchimento anima por CSS (ver .carrinho-pop em tema-negocios.css),
 * e some com prefers-reduced-motion. A dica abre com hover e com foco, e fecha com Esc.
 */
export function BotaoCarrinho({ nome, dentro, combinavel, aoAlternar }: Props) {
  const idDica = useId();
  const [mouse, setMouse] = useState(false);
  const [foco, setFoco] = useState(false);
  const [fechada, setFechada] = useState(false);

  const aberta = (mouse || foco) && !fechada;
  const dica = dentro ? t.dicaDentro : combinavel ? t.dicaCombinavel : t.dica;

  const aoTeclar = (e: KeyboardEvent) => {
    if (e.key === "Escape" && aberta) {
      e.stopPropagation();
      setFechada(true);
    }
  };

  return (
    <span
      className="absolute top-1 right-1"
      onMouseEnter={() => {
        setMouse(true);
        setFechada(false);
      }}
      onMouseLeave={() => setMouse(false)}
      onKeyDown={aoTeclar}
    >
      <button
        type="button"
        aria-pressed={dentro}
        aria-label={dentro ? t.tirar(nome) : t.por(nome)}
        aria-describedby={aberta ? idDica : undefined}
        onClick={aoAlternar}
        onFocus={() => {
          setFoco(true);
          setFechada(false);
        }}
        onBlur={() => setFoco(false)}
        className="grid size-alvo cursor-pointer place-items-center rounded-pequeno border-0 bg-transparent p-0 text-destaque transition-colors hover:bg-realce focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco"
      >
        <svg
          className={
            dentro
              ? "carrinho-pop size-6 fill-current transition-[fill] duration-200 motion-reduce:transition-none"
              : "size-6 fill-transparent transition-[fill] duration-200 motion-reduce:transition-none"
          }
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2.5 3.5h3l2.2 11h10.6l2-8H6.2" />
          <circle cx="9.5" cy="19.5" r="1.4" />
          <circle cx="17" cy="19.5" r="1.4" />
        </svg>
      </button>
      {aberta && (
        <span
          id={idDica}
          role="tooltip"
          className="absolute top-full right-0 z-20 mt-1 w-max max-w-[16rem] rounded-pequeno border border-linha bg-superficie px-3 py-2 text-left text-[0.85rem] leading-snug font-normal text-texto"
        >
          {dica}
        </span>
      )}
    </span>
  );
}
