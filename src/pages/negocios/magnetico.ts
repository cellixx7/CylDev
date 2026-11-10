/*
 * Puxão magnético dos botões marcados com data-magnetico.
 * Só grava as variáveis CSS --mx e --my (sem estado do React, sem re-render).
 * Ignora toque e quem prefere menos movimento.
 */
const FORCA = 0.28;
const LIMITE = 10; // px

export function ativarMagnetico(): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const limpar: Array<() => void> = [];

  document.querySelectorAll<HTMLElement>("[data-magnetico]").forEach((el) => {
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const trava = (v: number) => Math.max(-LIMITE, Math.min(LIMITE, v * FORCA));
      el.style.setProperty("--mx", `${trava(dx)}px`);
      el.style.setProperty("--my", `${trava(dy)}px`);
    };
    const soltar = () => {
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", soltar);
    limpar.push(() => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", soltar);
    });
  });

  return () => limpar.forEach((f) => f());
}
