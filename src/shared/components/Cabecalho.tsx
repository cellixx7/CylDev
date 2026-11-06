import { useEffect, useState } from "react";
import { comum } from "../../content/textos";
import { aplicarTema, lerTema, salvarTema, type Tema } from "../tema";

type Link = { href: string; rotulo: string };

type Props = {
  area: string;
  temaPadrao: Tema;
  marca: string;
  links?: Link[];
};

export function Cabecalho({ area, temaPadrao, marca, links = [] }: Props) {
  const [tema, setTema] = useState<Tema>(() => lerTema(area, temaPadrao));
  const [menuAberto, setMenuAberto] = useState(false);
  const temLinks = links.length > 0;

  useEffect(() => {
    aplicarTema(tema);
  }, [tema]);

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

  const classesHeader = "sticky top-0 z-50 border-b border-linha bg-fundo";
  const classesBarra = "relative mx-auto flex max-w-site items-center gap-3 px-margem py-2";

  const classesMarca =
    "mr-auto inline-flex min-h-alvo items-center font-titulo text-[1.15rem] font-bold tracking-[-0.01em] no-underline";

  const botaoBase =
    "min-h-alvo cursor-pointer rounded-pequeno border border-linha bg-transparent px-3 text-[0.95rem] text-texto aria-pressed:bg-texto aria-pressed:text-fundo";

  // Mobile: some até abrir o menu. Desktop (md+): sempre em linha, dentro da barra.
  const aberto = menuAberto
    ? "absolute inset-x-0 top-full block border-b border-linha bg-fundo px-margem pt-3 pb-6"
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
                    className="flex min-h-alvo items-center text-[1.1rem] no-underline hover:underline md:text-[0.98rem]"
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
