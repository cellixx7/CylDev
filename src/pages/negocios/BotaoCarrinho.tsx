import { useId, useState, type CSSProperties, type KeyboardEvent } from "react";
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
        className={`grid size-alvo cursor-pointer place-items-center rounded-pequeno border-0 bg-transparent p-0 transition-colors motion-reduce:transition-none hover:bg-realce focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco ${
          dentro ? "text-destaque" : "text-texto"
        }`}
      >
        {/* Decorativo. Vazio: só contorno, na cor do texto. No carrinho: cesta e itens preenchidos com a cor do botão principal. */}
        <svg
          className={
            dentro
              ? "size-6 fill-current transition-[fill] duration-200 motion-reduce:transition-none"
              : "size-6 fill-transparent transition-[fill] duration-200 motion-reduce:transition-none"
          }
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {dentro && (
            <>
              <rect className="carrinho-item" style={{ "--i": 0 } as CSSProperties} x="8.6" y="3" width="3" height="3.2" rx="0.5" strokeWidth="1" />
              <rect className="carrinho-item" style={{ "--i": 1 } as CSSProperties} x="12.8" y="1.2" width="3" height="5" rx="0.5" strokeWidth="1" />
              <rect className="carrinho-item" style={{ "--i": 2 } as CSSProperties} x="17" y="3.4" width="3" height="2.8" rx="0.5" strokeWidth="1" />
            </>
          )}
          <path d="M2 3.5h2.8l2.6 12h10.8" fill="none" />
          <path d="M5.4 8.5h15.6l-2.4 7H7.4z" />
          <circle cx="9.6" cy="19.6" r="1.3" />
          <circle cx="16.4" cy="19.6" r="1.3" />
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
