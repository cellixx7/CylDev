import { useEffect, useState, type ReactNode } from "react";
import { comum } from "../../../content/textos";
import { aplicarTema, lerTema, salvarTema, type Tema } from "../../tema";

type Link = { href: string; rotulo: string };

type Props = {
  area: string;
  temaPadrao: Tema;
  marca: string;
  links?: Link[];
  /** Elemento fixo no centro da barra (ex.: atalho para outra área). */
  centro?: ReactNode;
};

export function Cabecalho({ area, temaPadrao, marca, links = [], centro }: Props) {
  const [tema, setTema] = useState<Tema>(() => lerTema(area, temaPadrao));
  const [menuAberto, setMenuAberto] = useState(false);
  const temLinks = links.length > 0;

  useEffect(() => {
    aplicarTema(tema);
  }, [tema]);

  useEffect(() => {
    if (!menuAberto) return;
    const fechar = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuAberto(false);
    document.addEventListener("keydown", fechar);
    return () => document.removeEventListener("keydown", fechar);
  }, [menuAberto]);

  const alternarTema = () => {
    const novo: Tema = tema === "claro" ? "escuro" : "claro";
    setTema(novo);
    salvarTema(area, novo);
  };

  const classesHeader =
    "sticky top-2 z-50 mx-2 md:top-3 md:mx-auto md:w-[calc(100%-2rem)] md:max-w-site";
  // Três colunas: marca | centro | menu. As laterais têm a mesma largura, então o centro fica no meio de verdade.
  const classesBarra =
    "relative grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-padrao border border-linha bg-fundo/95 px-3 py-1 shadow-lg backdrop-blur md:px-5";

  const classesMarca =
    "justify-self-start inline-flex min-h-alvo items-center font-titulo text-[1.05rem] font-bold tracking-[-0.01em] no-underline";

  const botaoBase =
    "min-h-alvo cursor-pointer rounded-pequeno border border-linha bg-transparent px-3 text-[0.95rem] text-texto aria-pressed:bg-texto aria-pressed:text-fundo";

  // Mobile e tablet: some até abrir o menu. Desktop (pc+): sempre em linha, dentro da barra.
  // O corte é em "pc" (e não "md") porque cada lado da barra fica com só metade da largura.
  const aberto = menuAberto
    ? "absolute inset-x-0 top-full mt-2 block rounded-padrao border border-linha bg-fundo px-4 pt-3 pb-4 shadow-lg"
    : temLinks
      ? "hidden"
      : "block";
  const classesNav = `${aberto} pc:static pc:flex pc:items-center pc:mt-0 pc:border-0 pc:p-0 pc:shadow-none`;

  return (
    <>
      <header className={classesHeader}>
        <div className={classesBarra}>
          <a className={classesMarca} href="/">
            {marca}
          </a>
          <div className="justify-self-center">{centro}</div>
          <div className="flex items-center justify-self-end">
            {temLinks && (
              <button
                type="button"
                className={`${botaoBase} inline-flex items-center justify-center px-2 pc:hidden`}
                aria-label={menuAberto ? comum.menuFechar : comum.menuAbrir}
                aria-expanded={menuAberto}
                aria-controls="menu-principal"
                onClick={() => setMenuAberto((v) => !v)}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  {menuAberto ? (
                    <path d="M6 6l12 12M18 6L6 18" />
                  ) : (
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  )}
                </svg>
              </button>
            )}
            <nav
              id="menu-principal"
              className={classesNav}
              aria-label="Principal"
            >
              {temLinks && (
                <ul className="mb-3 list-none p-0 pc:m-0 pc:flex pc:gap-4 xl:gap-6">
                  {links.map((l) => (
                    <li key={l.href}>
                      <a
                        className="flex min-h-alvo items-center text-[1.1rem] whitespace-nowrap no-underline hover:underline pc:text-[0.95rem]"
                        href={l.href}
                        onClick={() => setMenuAberto(false)}
                      >
                        {l.rotulo}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          </div>
        </div>
      </header>
      <button
        type="button"
        className="fixed bottom-5 left-5 z-50 inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-linha bg-fundo text-texto shadow-lg"
        aria-label={tema === "escuro" ? comum.temaClaro : comum.temaEscuro}
        title={tema === "escuro" ? comum.temaClaro : comum.temaEscuro}
        onClick={alternarTema}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"

        >
          {tema === "escuro" ? (
            <>
              <circle cx="12" cy="12" r="4.5" />
              <path
                fill="none"
                d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"
              />
            </>
          ) : (
            <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
          )}
        </svg>
      </button>
    </>
  );
}
