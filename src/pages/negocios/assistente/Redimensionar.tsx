import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from "react";
import { assistente as t } from "../../../content/textos/assistente";
import { focoVisivel } from "../../../shared/estilos";

// Tamanho do painel do chat em tela larga (a partir de md = 48rem; abaixo disso o chat ocupa a tela e não há alça).
// O painel fica ancorado no canto inferior direito; a alça fica no canto superior esquerdo e crescer é puxar para cima e para a esquerda.
// O tamanho vive só na memória: guardar no navegador (localStorage) exigiria mudar a Política de Privacidade, que hoje só declara o tema e a conversa.

export type Tamanho = { largura: number; altura: number };

export const LIMITES = {
  minLargura: 320,
  minAltura: 420,
  /** Folga até a borda da janela, acima e à esquerda (o painel já tem 20 px de margem à direita e embaixo). */
  margem: 24,
  /** Espaço à esquerda reservado para o botão circular do Cyl (56 px + 8 px de vão). */
  reservaBotao: 64,
  /** Margem fixa do painel à direita e embaixo (classes md:mr-5 e md:mb-5). */
  margemFixa: 20,
  passoTeclado: 24,
} as const;

/** Maior tamanho possível na janela atual, e o menor (o mínimo cede se a janela for menor que ele). */
export function limitesDaJanela(janelaL: number, janelaA: number) {
  const maxLargura = Math.max(0, janelaL - LIMITES.margemFixa - LIMITES.margem - LIMITES.reservaBotao);
  const maxAltura = Math.max(0, janelaA - LIMITES.margemFixa - LIMITES.margem);
  return {
    maxLargura,
    maxAltura,
    minLargura: Math.min(LIMITES.minLargura, maxLargura),
    minAltura: Math.min(LIMITES.minAltura, maxAltura),
  };
}

export function limitar(t: Tamanho, janelaL: number, janelaA: number): Tamanho {
  const l = limitesDaJanela(janelaL, janelaA);
  return {
    largura: Math.round(Math.min(l.maxLargura, Math.max(l.minLargura, t.largura))),
    altura: Math.round(Math.min(l.maxAltura, Math.max(l.minAltura, t.altura))),
  };
}

const larguraDeTela = () => window.matchMedia("(min-width: 48rem)").matches;

/** Estado do tamanho (null = padrão do CSS) e o que o mantém dentro da janela, inclusive depois de redimensionar a janela. */
export function useTamanhoDoPainel(painel: RefObject<HTMLDialogElement | null>) {
  const [tamanho, setTamanho] = useState<Tamanho | null>(null);

  useEffect(() => {
    const ajustar = () => setTamanho((atual) => (atual ? limitar(atual, window.innerWidth, window.innerHeight) : atual));
    window.addEventListener("resize", ajustar);
    return () => window.removeEventListener("resize", ajustar);
  }, []);

  /** Tamanho de agora (o do estado, ou o que o CSS está dando ao painel). */
  const medir = useCallback((): Tamanho => {
    if (tamanho) return tamanho;
    const r = painel.current?.getBoundingClientRect();
    return { largura: Math.round(r?.width ?? 416), altura: Math.round(r?.height ?? 704) };
  }, [tamanho, painel]);

  return { tamanho, setTamanho, medir };
}

function IconeAlca() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M2 10 10 2M2 6.5 6.5 2" />
    </svg>
  );
}

type Props = {
  medir: () => Tamanho;
  aoMudar: (t: Tamanho | null) => void;
};

/** Alça do canto superior esquerdo. Mouse, toque e caneta (pointer events); teclado com as setas; Enter ou duplo clique voltam ao padrão. */
export function AlcaRedimensionar({ medir, aoMudar }: Props) {
  const arrasto = useRef<{ x: number; y: number; t: Tamanho } | null>(null);

  const aplicar = (novo: Tamanho | null) => {
    aoMudar(novo ? limitar(novo, window.innerWidth, window.innerHeight) : null);
  };

  const comecar = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !larguraDeTela()) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    arrasto.current = { x: e.clientX, y: e.clientY, t: medir() };
    e.preventDefault();
  };
  const mover = (e: PointerEvent<HTMLDivElement>) => {
    const a = arrasto.current;
    if (!a) return;
    aplicar({ largura: a.t.largura + (a.x - e.clientX), altura: a.t.altura + (a.y - e.clientY) });
  };
  const terminar = (e: PointerEvent<HTMLDivElement>) => {
    arrasto.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const teclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const p = LIMITES.passoTeclado;
    const atual = medir();
    // Ancorado embaixo à direita: seta para a esquerda ou para cima aumenta; para a direita ou para baixo diminui.
    if (e.key === "ArrowLeft") aplicar({ ...atual, largura: atual.largura + p });
    else if (e.key === "ArrowRight") aplicar({ ...atual, largura: atual.largura - p });
    else if (e.key === "ArrowUp") aplicar({ ...atual, altura: atual.altura + p });
    else if (e.key === "ArrowDown") aplicar({ ...atual, altura: atual.altura - p });
    else if (e.key === "Enter" || e.key === "Home") aplicar(null);
    else return;
    e.preventDefault();
  };

  const l = limitesDaJanela(window.innerWidth, window.innerHeight);
  const agora = medir();

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={t.redimensionar}
      aria-valuemin={l.minLargura}
      aria-valuemax={l.maxLargura}
      aria-valuenow={agora.largura}
      aria-valuetext={`${agora.largura} por ${agora.altura} pixels`}
      tabIndex={0}
      data-testid="alca-redimensionar"
      onPointerDown={comecar}
      onPointerMove={mover}
      onPointerUp={terminar}
      onPointerCancel={terminar}
      onLostPointerCapture={() => (arrasto.current = null)}
      onDoubleClick={() => aplicar(null)}
      onKeyDown={teclar}
      className={`absolute top-0 left-0 z-10 hidden size-5 cursor-nwse-resize touch-none items-start justify-start rounded-tl-2xl p-1 text-texto-suave select-none md:flex ${focoVisivel}`}
    >
      <IconeAlca />
    </div>
  );
}
