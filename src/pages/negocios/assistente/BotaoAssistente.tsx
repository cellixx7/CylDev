import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { assistente as t } from "../../../content/textos/assistente";
import { focoVisivel } from "../../../shared/estilos";

// Só este arquivo (o botão) vai no JavaScript da home. O painel do chat, o motor e a base de conhecimento ficam em outro
// pedaço, baixado na primeira vez que a pessoa abre o assistente.
const PainelAssistente = lazy(() => import("./PainelAssistente").then((m) => ({ default: m.PainelAssistente })));

function IconeChat() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="M3 4h14v10H9l-4 3.5V14H3z" />
    </svg>
  );
}

/** Botão fixo no canto, acima da barra do carrinho. Abre o painel (carregado sob demanda) e devolve o foco a ele ao fechar. */
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
        style={{ bottom: "calc(var(--altura-barra, 0px) + 1.25rem)" }}
        className={`fixed right-4 z-40 inline-flex min-h-alvo cursor-pointer items-center gap-2 rounded-pequeno border border-destaque bg-destaque px-4 py-2 font-[inherit] text-base font-semibold text-destaque-texto hover:border-texto hover:bg-texto hover:text-fundo sm:right-5 ${focoVisivel}`}
      >
        <IconeChat />
        {t.botao}
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
