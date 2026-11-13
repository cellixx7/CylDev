import type { ReactNode } from "react";
import type { site } from "../../content/site";
import { negocios } from "../../content/textos";

const t = negocios.sobre;

type Telas = typeof site.telasUniser;
type Id = Telas[number]["id"];

type Props = {
  telas: Telas;
  /** "linha": carrossel no celular e três colunas a partir de `sm` (seção). "grade": duas colunas no celular e três a partir de `sm` (modal). */
  layout: "linha" | "grade";
};

// Cores da UniSER, só para o esquema (o resto do site usa os tokens do tema).
const VERDE = "bg-[#006b1f]";
const ESCURO = "bg-[#1b3d2b]";
const OURO = "bg-[#f5b800]";

/** Barra cinza do esqueleto: largura em % do espaço disponível, altura em px. */
function Barra({ w, h = 4, cor = "bg-[#c9ccd6]", className = "" }: { w: number; h?: number; cor?: string; className?: string }) {
  return <span className={`block shrink-0 rounded-[2px] ${cor} ${className}`} style={{ width: `${w}%`, height: h }} />;
}

/** Cartão branco com linhas de texto. */
function Cartao({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-col gap-[5px] rounded-[3px] border border-[#e3e5ee] bg-white p-[6px] ${className}`}>{children}</div>;
}

/** Menu lateral verde com o logo e os itens, como nas telas autenticadas. */
function Menu() {
  return (
    <div className={`flex w-[13%] shrink-0 flex-col items-center gap-[7px] ${VERDE} py-[7px]`}>
      <span className={`block size-[11px] rounded-full ${OURO}`} />
      {Array.from({ length: 6 }, (_, i) => (
        <Barra key={i} w={55} h={3} cor="bg-[#4f9a66]" />
      ))}
    </div>
  );
}

function Pagina({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full">
      <Menu />
      <div className="flex min-w-0 flex-1 flex-col gap-[6px] bg-[#f5f5fa] p-[8px]">{children}</div>
    </div>
  );
}

const Titulo = ({ w }: { w: number }) => <Barra w={w} h={6} cor="bg-[#2b2f3c]" />;

const esquemas: Record<Id, () => ReactNode> = {
  editais: () => (
    <div className="flex h-full flex-col bg-[#ffe9d0]">
      <div className={`flex h-[38%] flex-col items-center justify-center gap-[6px] ${ESCURO}`}>
        <span className={`block h-[22px] w-[34px] rounded-[2px] ${VERDE} ring-1 ring-[#f5b800]`} />
        <span className="flex gap-[6px]">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className="block h-[3px] w-[14px] rounded-[2px] bg-[#d5e6da]" />
          ))}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-[6px] p-[8px]">
        <Barra w={30} h={5} cor="bg-[#1b3d2b]" />
        <div className="grid flex-1 grid-cols-3 gap-[6px]">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className={`flex flex-col gap-[4px] rounded-[3px] p-[5px] ${ESCURO}`}>
              <span className={`block size-[9px] rounded-full ${OURO}`} />
              <Barra w={80} h={4} cor="bg-[#e8efe9]" />
              <Barra w={60} h={3} cor="bg-[#7ed39a]" />
              <Barra w={40} h={6} cor="bg-white" className="mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  login: () => (
    <div className="relative grid h-full place-items-center bg-[#cfd5cf]">
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 gap-[6px] p-[6px] opacity-60" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="rounded-full bg-[#aab3ab]" />
        ))}
      </div>
      <div className="relative flex w-[46%] flex-col items-center gap-[6px] rounded-[4px] bg-[#f3f3f3] p-[8px]">
        <span className="flex w-full items-center justify-between">
          <span className={`block size-[10px] rounded-full ${OURO}`} />
          <Barra w={35} h={3} cor="bg-[#2f9a4a]" />
        </span>
        <Barra w={50} h={6} cor="bg-[#2b2f3c]" />
        <Barra w={100} h={2} cor="bg-[#b5b8c2]" className="mt-[4px]" />
        <Barra w={100} h={2} cor="bg-[#b5b8c2]" className="mt-[4px]" />
        <Barra w={46} h={8} cor="bg-[#0e8a2b]" className="mt-[3px]" />
      </div>
    </div>
  ),
  grade: () => (
    <Pagina>
      <Titulo w={34} />
      <Cartao>
        <Barra w={80} h={3} />
      </Cartao>
      <Cartao className="flex-1">
        <span className="flex items-center gap-[4px]">
          <Barra w={4} h={5} cor="bg-[#2b2f3c]" />
          <Barra w={22} h={6} cor="bg-[#c9f1d6]" />
        </span>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className="flex items-center gap-[6px] border-t border-[#eceef4] pt-[4px]">
            <Barra w={12} h={3} cor="bg-[#8b90a0]" />
            <Barra w={40} h={3} cor="bg-[#2b2f3c]" />
            <Barra w={14} h={5} cor="bg-[#c9f1d6]" />
          </span>
        ))}
      </Cartao>
    </Pagina>
  ),
  dados: () => (
    <Pagina>
      <Titulo w={28} />
      {Array.from({ length: 3 }, (_, i) => (
        <Cartao key={i} className="flex-1">
          <span className="flex items-center justify-between">
            <Barra w={26} h={4} cor="bg-[#2b2f3c]" />
            <Barra w={12} h={7} cor="bg-[#eceef4]" />
          </span>
          <span className="grid grid-cols-3 gap-[4px]">
            {Array.from({ length: i === 1 ? 3 : 6 }, (_, j) => (
              <span key={j} className="flex flex-col gap-[2px]">
                <Barra w={60} h={2} cor="bg-[#a3a8b8]" />
                <Barra w={85} h={3} cor="bg-[#2b2f3c]" />
              </span>
            ))}
          </span>
        </Cartao>
      ))}
    </Pagina>
  ),
  frequencia: () => (
    <Pagina>
      <Titulo w={46} />
      <Barra w={85} h={3} />
      <Barra w={34} h={3} cor="bg-[#6b4bb8]" />
      <Titulo w={22} />
      <Cartao>
        <span className="flex gap-[6px]">
          <Barra w={18} h={4} cor="bg-[#2b2f3c]" />
          <Barra w={34} h={4} cor="bg-[#2b2f3c]" />
          <Barra w={24} h={4} cor="bg-[#2b2f3c]" />
        </span>
        <span className="flex items-center gap-[6px] border-t border-[#eceef4] pt-[5px]">
          <Barra w={18} h={3} cor="bg-[#8b90a0]" />
          <Barra w={34} h={3} cor="bg-[#2b2f3c]" />
          <Barra w={20} h={7} cor="bg-[#eceef4]" />
        </span>
      </Cartao>
    </Pagina>
  ),
  semestre: () => (
    <Pagina>
      <Titulo w={30} />
      <Barra w={70} h={4} cor="bg-[#2b2f3c]" />
      <span className="flex gap-[4px]">
        <Barra w={8} h={6} cor="bg-[#eceef4]" />
        <Barra w={22} h={6} cor="bg-[#eceef4]" />
        <Barra w={26} h={6} cor="bg-[#eceef4]" />
      </span>
      {Array.from({ length: 5 }, (_, i) => (
        <Cartao key={i} className="flex-1 justify-center">
          <Barra w={20} h={3} cor="bg-[#1d8a3a]" />
          <span className="flex items-end justify-between">
            <span className="flex w-[60%] flex-col gap-[2px]">
              <Barra w={70} h={3} cor="bg-[#2b2f3c]" />
              <Barra w={50} h={2} cor="bg-[#a3a8b8]" />
            </span>
            <Barra w={8} h={3} cor="bg-[#8b90a0]" />
          </span>
        </Cartao>
      ))}
    </Pagina>
  ),
};

/**
 * Esquemas das telas da plataforma da UniSER, em HTML e CSS (sem imagem, sem dado de pessoa ou de teste).
 * Cada tela é uma figura com `alt` próprio; os textos ficam em `site.telasUniser`.
 */
export function GaleriaUniser({ telas, layout }: Props) {
  if (telas.length === 0) return null;
  const lista =
    layout === "linha"
      ? "mb-3 flex list-none snap-x gap-3 overflow-x-auto p-0 sm:grid sm:grid-cols-3 sm:overflow-visible"
      : "m-0 mb-3 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3";
  const item = layout === "linha" ? "w-[60%] shrink-0 snap-start sm:w-auto" : "";
  return (
    <>
      <ul className={lista} aria-label={t.imagensUniser}>
        {telas.map((tela) => (
          <li key={tela.id} className={item}>
            <figure className="m-0">
              <div role="img" aria-label={tela.alt} className="aspect-[8/5] w-full overflow-hidden border border-linha">
                {esquemas[tela.id]()}
              </div>
              <figcaption className="mt-1 text-[0.8125rem] text-texto-suave">{tela.titulo}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className={`m-0 text-[0.8125rem] text-texto-suave ${layout === "linha" ? "mb-4" : "mb-5"}`}>{t.legendaTelas}</p>
    </>
  );
}
