import { useEffect, useRef, useState } from "react";
import { comum } from "../../../content/textos";
import { enderecoNoIdioma, idiomas, separarIdioma, type CodigoIdioma } from "../../i18n/idiomas";
import { dadosIdiomaAtual, idiomaAtual } from "../../i18n/rota";
import { salvarIdioma } from "../../i18n/preferencia";

/** Endereço da página que está aberta, no idioma pedido (mesma página, mesma âncora). */
function enderecoDaPagina(codigo: CodigoIdioma): string {
  const { caminho } = separarIdioma(window.location.pathname);
  return enderecoNoIdioma(`${caminho}${window.location.search}${window.location.hash}`, codigo);
}

/**
 * Botão de idioma do cabeçalho. Cada idioma é uma página própria (/en/, /es/...), então escolher um é navegar:
 * a escolha fica salva no navegador e vale nas próximas visitas, mesmo que o navegador esteja em outro idioma.
 */
export function SeletorIdioma() {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const fechar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    const fora = (e: PointerEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("keydown", fechar);
    document.addEventListener("pointerdown", fora);
    return () => {
      document.removeEventListener("keydown", fechar);
      document.removeEventListener("pointerdown", fora);
    };
  }, [aberto]);

  return (
    <div ref={raiz} className="relative">
      <button
        type="button"
        className="inline-flex min-h-alvo cursor-pointer items-center justify-center gap-1 rounded-pequeno border border-linha bg-transparent px-2 text-base text-texto"
        aria-label={`${comum.idioma.rotulo}: ${dadosIdiomaAtual.nome}`}
        aria-expanded={aberto}
        aria-controls="lista-idiomas"
        onClick={() => setAberto((v) => !v)}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
        </svg>
        <span lang="en">{dadosIdiomaAtual.sigla}</span>
      </button>
      {aberto && (
        <ul
          id="lista-idiomas"
          className="absolute end-0 top-full z-50 mt-2 grid min-w-44 list-none gap-0 rounded-padrao border border-linha bg-fundo p-1 shadow-lg"
          aria-label={comum.idioma.rotulo}
        >
          {idiomas.map((i) => (
            <li key={i.codigo}>
              <a
                className="flex min-h-alvo items-center justify-between gap-3 rounded-pequeno px-3 text-base text-texto no-underline hover:bg-texto hover:text-fundo aria-[current=true]:font-bold"
                href={enderecoDaPagina(i.codigo)}
                lang={i.bcp47}
                hrefLang={i.bcp47}
                aria-current={i.codigo === idiomaAtual ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  salvarIdioma(i.codigo);
                  window.location.assign(enderecoDaPagina(i.codigo));
                }}
              >
                <span>{i.nome}</span>
                <span lang="en" aria-hidden="true" className="text-menor opacity-70">
                  {i.sigla}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
