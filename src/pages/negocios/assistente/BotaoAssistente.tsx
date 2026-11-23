import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { assistente as t } from "../../../content/textos/assistente";
import { focoVisivel } from "../../../shared/estilos";

// Só este arquivo (o botão) vai no JavaScript da home. O painel do chat, o motor e a base de conhecimento ficam em outro
// pedaço, baixado na primeira vez que a pessoa abre o assistente.
const PainelAssistente = lazy(() => import("./PainelAssistente").then((m) => ({ default: m.PainelAssistente })));

const DURACAO_CONVITE_MS = 5000;
const CICLO_CONVITE_MS = 30000;

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

  const [convite, setConvite] = useState(false);
  const [pausado, setPausado] = useState(false);
  const encerrado = useRef(false);

  // Convite: aparece já no carregamento, fica 5 s e volta a cada 30 s. Fechar no "x" encerra os convites desta visita.
  useEffect(() => {
    if (aberto) {
      setConvite(false);
      return;
    }
    const mostrar = () => {
      if (!encerrado.current) setConvite(true);
    };
    mostrar();
    const ciclo = window.setInterval(mostrar, CICLO_CONVITE_MS);
    return () => window.clearInterval(ciclo);
  }, [aberto]);

  useEffect(() => {
    if (!convite || pausado) return;
    const fim = window.setTimeout(() => setConvite(false), DURACAO_CONVITE_MS);
    return () => window.clearTimeout(fim);
  }, [convite, pausado]);

  const fecharConvite = () => {
    encerrado.current = true;
    setConvite(false);
  };

  const abrir = () => {
    setCarregou(true);
    setAberto(true);
  };

  return (
    <>
      {!aberto && convite && (
        <div
          data-testid="convite-assistente"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
          onFocus={() => setPausado(true)}
          onBlur={() => setPausado(false)}
          className="fixed right-4 bottom-20 z-40 flex max-w-[min(18rem,calc(100vw-2rem))] items-start gap-2 rounded-pequeno border border-linha bg-texto py-2 pr-2 pl-3 text-menor font-semibold text-fundo shadow-lg sm:right-5"
        >
          <button type="button" onClick={abrir} className={`cursor-pointer border-0 bg-transparent p-0 py-1 text-left text-menor font-semibold text-fundo ${focoVisivel}`}>
            {t.convite}
          </button>
          <button
            type="button"
            aria-label={t.conviteFechar}
            onClick={fecharConvite}
            className={`inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-fundo ${focoVisivel}`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}
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
