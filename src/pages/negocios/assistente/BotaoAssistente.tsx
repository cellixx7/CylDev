import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { assistente as t } from "../../../content/textos/assistente";
import { focoVisivel } from "../../../shared/estilos";

// Só este arquivo (o botão) vai no JavaScript da home. O painel do chat, o motor e a base de conhecimento ficam em outro
// pedaço, baixado na primeira vez que a pessoa abre o assistente.
const PainelAssistente = lazy(() => import("./PainelAssistente").then((m) => ({ default: m.PainelAssistente })));

function IconeChat() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <g fill="var(--color-fundo)" stroke="none">
        <circle cx="8.5" cy="10.5" r="1.2" />
        <circle cx="12" cy="10.5" r="1.2" />
        <circle cx="15.5" cy="10.5" r="1.2" />
      </g>
    </svg>
  );
}

/**
 * Bolinha redonda no canto de baixo à direita, no mesmo estilo do botão de tema (sol/lua) que fica à esquerda. O nome aparece
 * em um balão no mouse e no foco do teclado; no celular o rótulo acessível (aria-label) cobre o leitor de tela. Abre o painel
 * (carregado sob demanda) e devolve o foco ao botão ao fechar.
 */
export function BotaoAssistente() {
  const [aberto, setAberto] = useState(false);
  const [carregou, setCarregou] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const jaAbriu = useRef(false);

  useEffect(() => {
    if (aberto) {
      jaAbriu.current = true;
      return;
    }
    if (jaAbriu.current) botao.current?.focus();
  }, [aberto]);

  const abrir = () => {
    setCarregou(true);
    setAberto(true);
  };

  return (
    <>
      {!aberto && (
        <button
          ref={botao}
          type="button"
          aria-haspopup="dialog"
          aria-label={t.botaoAbrir}
          onClick={abrir}
          // Aquece o pedaço do chat quando a pessoa chega perto, para abrir sem espera.
          onPointerEnter={() => void import("./PainelAssistente")}
          className={`botao-assistente group fixed right-4 bottom-5 z-40 inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-linha bg-fundo p-0 text-texto shadow-lg hover:bg-realce sm:right-5 ${focoVisivel}`}
        >
          <IconeChat />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded-pequeno bg-texto px-3 py-1.5 text-menor font-semibold whitespace-nowrap text-fundo opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
          >
            {t.botao}
          </span>
        </button>
      )}
      {carregou && (
        <Suspense fallback={null}>
          <PainelAssistente aberto={aberto} aoFechar={() => setAberto(false)} />
        </Suspense>
      )}
    </>
  );
}
