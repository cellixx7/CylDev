import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

/** Evento global: quando uma dica abre, avisa as outras (cada uma compara o id). Só uma fica aberta por vez. */
export const EVENTO_DICA_ABRIU = "cyl:dica-abriu";

const MARGEM = 8;
const FOLGA = 6;
const LARGURA_MAXIMA = 288;

type Posicao = { top: number; left: number; width: number };

/** Posição do balão dentro da área visível: centrado no botão, preso às margens, embaixo ou em cima conforme o espaço. */
export function posicionarBalao(
  botao: { top: number; bottom: number; left: number; width: number },
  balaoAltura: number,
  janela: { largura: number; altura: number },
): Posicao {
  const width = Math.min(LARGURA_MAXIMA, janela.largura - 2 * MARGEM);
  const centro = botao.left + botao.width / 2;
  const left = Math.min(Math.max(centro - width / 2, MARGEM), janela.largura - width - MARGEM);
  const cabeEmbaixo = botao.bottom + FOLGA + balaoAltura <= janela.altura - MARGEM;
  const cabeEmCima = botao.top - FOLGA - balaoAltura >= MARGEM;
  const top = cabeEmbaixo || !cabeEmCima ? botao.bottom + FOLGA : botao.top - FOLGA - balaoAltura;
  return { top: Math.max(MARGEM, top), left, width };
}

type Props = {
  /** Texto do balão. */
  texto: string;
  /** Rótulo acessível do botão, por exemplo "O que significa: Quantos usuários?". */
  rotulo: string;
};

/**
 * Botão "i" com balão de explicação. Abre ao passar o mouse, ao focar pelo teclado e ao tocar (o toque alterna).
 * Fecha com Esc (antes de fechar o diálogo), ao tocar fora, ao perder o foco e ao rolar. Um balão aberto por vez.
 * O balão é `position: fixed` dentro da área visível: não é cortado pelo overflow do diálogo nem empurra o conteúdo.
 * O alvo clicável tem 44 px; o ícone visual é menor.
 */
export function Dica({ texto, rotulo }: Props) {
  const id = useId();
  const botao = useRef<HTMLButtonElement>(null);
  const balao = useRef<HTMLSpanElement>(null);
  const [mouse, setMouse] = useState(false);
  const [foco, setFoco] = useState(false);
  const [fixa, setFixa] = useState(false);
  const [pos, setPos] = useState<Posicao | null>(null);
  const aberta = mouse || foco || fixa;

  const fechar = useCallback(() => {
    setMouse(false);
    setFoco(false);
    setFixa(false);
  }, []);

  // Mede o botão e o balão assim que abre.
  useLayoutEffect(() => {
    if (!aberta) {
      setPos(null);
      return;
    }
    const b = botao.current?.getBoundingClientRect();
    const altura = balao.current?.offsetHeight ?? 0;
    if (b) setPos(posicionarBalao(b, altura, { largura: window.innerWidth, altura: window.innerHeight }));
  }, [aberta, texto]);

  // Só uma dica aberta por vez.
  useEffect(() => {
    if (aberta) window.dispatchEvent(new CustomEvent(EVENTO_DICA_ABRIU, { detail: id }));
  }, [aberta, id]);
  useEffect(() => {
    const aoOutraAbrir = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) fechar();
    };
    window.addEventListener(EVENTO_DICA_ABRIU, aoOutraAbrir);
    return () => window.removeEventListener(EVENTO_DICA_ABRIU, aoOutraAbrir);
  }, [id, fechar]);

  // Enquanto aberta: Esc (antes do diálogo), toque fora, rolagem e redimensionamento fecham.
  useEffect(() => {
    if (!aberta) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      fechar();
    };
    const aoTocarFora = (e: PointerEvent) => {
      const alvo = e.target as Node | null;
      if (alvo && (botao.current?.contains(alvo) || balao.current?.contains(alvo))) return;
      fechar();
    };
    window.addEventListener("keydown", aoTeclar, true);
    document.addEventListener("pointerdown", aoTocarFora, true);
    window.addEventListener("scroll", fechar, true);
    window.addEventListener("resize", fechar);
    return () => {
      window.removeEventListener("keydown", aoTeclar, true);
      document.removeEventListener("pointerdown", aoTocarFora, true);
      window.removeEventListener("scroll", fechar, true);
      window.removeEventListener("resize", fechar);
    };
  }, [aberta, fechar]);

  const estiloBalao: CSSProperties = pos
    ? { top: pos.top, left: pos.left, width: pos.width }
    : { top: 0, left: 0, width: Math.min(LARGURA_MAXIMA, 320), visibility: "hidden" };

  return (
    <span
      className="inline-flex shrink-0"
      onPointerEnter={(e) => e.pointerType === "mouse" && setMouse(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setMouse(false)}
    >
      <button
        ref={botao}
        type="button"
        aria-label={rotulo}
        aria-expanded={aberta}
        aria-describedby={id}
        onClick={() => setFixa((f) => !f)}
        onFocus={(e) => setFoco(e.currentTarget.matches(":focus-visible"))}
        onBlur={fechar}
        className="group/dica grid size-alvo cursor-pointer place-items-center rounded-pequeno border-0 bg-transparent p-0 text-destaque focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco"
      >
        <span
          aria-hidden="true"
          className="grid size-5 place-items-center rounded-full border-2 border-current font-mono text-[0.75rem] leading-none font-bold group-hover/dica:bg-realce"
        >
          i
        </span>
      </button>
      <span
        ref={balao}
        id={id}
        role="tooltip"
        hidden={!aberta}
        style={estiloBalao}
        className="fixed z-50 rounded-pequeno border border-linha bg-superficie px-3 py-2 text-left text-[0.9375rem] leading-snug font-normal text-texto"
      >
        {texto}
      </span>
    </span>
  );
}
