import { useEffect, useState } from "react";
import { comum } from "../../content/textos";
import { aplicarTema, lerTema, salvarTema, type Tema } from "../tema";

type Link = { href: string; rotulo: string };

type Props = {
  area: string;
  /** Barra fixa e flutuante, em formato de pílula com vidro fosco. */
  flutuante?: boolean;
  temaPadrao: Tema;
  marca: string;
  links?: Link[];
};

export function Cabecalho({ area, temaPadrao, marca, links = [], flutuante = false }: Props) {
  const [tema, setTema] = useState<Tema>(() => lerTema(area, temaPadrao));
  const [menuAberto, setMenuAberto] = useState(false);
  const [rolado, setRolado] = useState(false);
  const temLinks = links.length > 0;

  useEffect(() => {
    aplicarTema(tema);
  }, [tema]);

  useEffect(() => {
    if (!flutuante) return;
    const aoRolar = () => setRolado(window.scrollY > 8);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, [flutuante]);

  useEffect(() => {
    if (!menuAberto) return;
    const fechar = (e: KeyboardEvent) => e.key === "Escape" && setMenuAberto(false);
    document.addEventListener("keydown", fechar);
    return () => document.removeEventListener("keydown", fechar);
  }, [menuAberto]);

  const alternarTema = () => {
    const novo: Tema = tema === "claro" ? "escuro" : "claro";
    setTema(novo);
    salvarTema(area, novo);
  };

  const vidro = "backdrop-blur-[18px] backdrop-saturate-[1.6]";
  const contornoVidro = "border-[color-mix(in_srgb,var(--color-texto)_12%,transparent)]";

  const classesHeader = flutuante
    ? "pointer-events-none fixed inset-x-0 top-3 z-50 border-0 bg-transparent px-margem"
    : "sticky top-0 z-50 border-b border-linha bg-fundo";

  const classesBarra = flutuante
    ? [
        "pointer-events-auto relative mx-auto flex max-w-[62rem] items-center gap-3 rounded-full border py-1 pr-2 pl-6 transition-[box-shadow,background] duration-[250ms] ease-[ease] not-supports-[backdrop-filter:blur(1px)]:bg-superficie",
        vidro,
        contornoVidro,
        rolado
          ? "bg-[color-mix(in_srgb,var(--color-superficie)_86%,transparent)] shadow-pilula-rolada"
          : "bg-[color-mix(in_srgb,var(--color-superficie)_72%,transparent)] shadow-pilula",
      ].join(" ")
    : "relative mx-auto flex max-w-site items-center gap-3 px-margem py-2";

  const classesMarca =
    "mr-auto inline-flex min-h-alvo items-center font-titulo text-[1.15rem] font-bold no-underline" +
    (flutuante ? " tracking-[0.01em]" : "");

  const botaoBase =
    "min-h-alvo cursor-pointer border px-3 text-[0.95rem] text-texto aria-pressed:bg-texto aria-pressed:text-fundo " +
    (flutuante
      ? "rounded-full border-transparent bg-[color-mix(in_srgb,var(--color-texto)_7%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-texto)_14%,transparent)]"
      : "rounded-pequeno border-linha bg-transparent");

  // Mobile: some até abrir o menu. Desktop (md+): sempre em linha, dentro da barra.
  const aberto = menuAberto
    ? "absolute inset-x-0 block pt-3 " +
      (flutuante
        ? `top-[calc(100%+0.5rem)] rounded-[28px] border px-6 pb-4 shadow-menu ${contornoVidro} ${vidro} bg-[color-mix(in_srgb,var(--color-superficie)_88%,transparent)] not-supports-[backdrop-filter:blur(1px)]:bg-superficie md:rounded-none md:bg-transparent md:shadow-none md:backdrop-filter-none`
        : "top-full border-b border-linha bg-fundo px-margem pb-6")
    : temLinks
      ? "hidden"
      : "block";
  const classesNav = `${aberto} md:static md:flex md:items-center md:gap-6 md:border-0 md:p-0`;

  return (
    <header className={classesHeader}>
      <div className={classesBarra}>
        <a className={classesMarca} href="/">
          {marca}
        </a>
        {temLinks && (
          <button
            type="button"
            className={`${botaoBase} md:hidden`}
            aria-expanded={menuAberto}
            aria-controls="menu-principal"
            onClick={() => setMenuAberto((v) => !v)}
          >
            {menuAberto ? comum.menuFechar : comum.menuAbrir}
          </button>
        )}
        <nav id="menu-principal" className={classesNav} aria-label="Principal">
          {temLinks && (
            <ul className="mb-3 list-none p-0 md:m-0 md:flex md:gap-6">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    className={
                      "flex min-h-alvo items-center text-[1.1rem] no-underline hover:underline md:text-[0.98rem]" +
                      (flutuante
                        ? " md:rounded-full md:px-3 md:hover:no-underline md:hover:bg-[color-mix(in_srgb,var(--color-texto)_8%,transparent)]"
                        : "")
                    }
                    href={l.href}
                    onClick={() => setMenuAberto(false)}
                  >
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className={botaoBase}
            aria-pressed={tema === "escuro"}
            onClick={alternarTema}
          >
            {comum.temaEscuro}
          </button>
        </nav>
      </div>
    </header>
  );
}
