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

  const classesNav = [
    "cabecalho__nav",
    menuAberto && "cabecalho__nav--aberto",
    !temLinks && "cabecalho__nav--fixo",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={["cabecalho", flutuante && "cabecalho--flutuante", rolado && "cabecalho--rolado"].filter(Boolean).join(" ")}>
      <div className="cabecalho__barra">
        <a className="cabecalho__marca" href="/">
          {marca}
        </a>
        {temLinks && (
          <button
            type="button"
            className="cabecalho__menu-botao"
            aria-expanded={menuAberto}
            aria-controls="menu-principal"
            onClick={() => setMenuAberto((v) => !v)}
          >
            {menuAberto ? comum.menuFechar : comum.menuAbrir}
          </button>
        )}
        <nav id="menu-principal" className={classesNav} aria-label="Principal">
          {temLinks && (
            <ul className="cabecalho__lista">
              {links.map((l) => (
                <li key={l.href}>
                  <a className="cabecalho__link" href={l.href} onClick={() => setMenuAberto(false)}>
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="cabecalho__tema"
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
