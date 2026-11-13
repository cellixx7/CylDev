import { useEffect, useState } from "react";
import { cenasEstagio } from "../../content/cenasEstagio";
import { brl } from "../../shared/lib/formato";
import { focoVisivel } from "../../shared/estilos";
import { duracaoPassosPlanilha, duracaoSlides, proximo, resumoPlanilha } from "./cenasLogica";

const c = cenasEstagio;

const consultaMovimento = "(prefers-reduced-motion: reduce)";

/** Passo atual de um ciclo. Com movimento reduzido (ou pausado) não avança; com movimento reduzido fica no `final`. */
function useCiclo(duracoes: readonly number[], parado: boolean, reduzido: boolean, final: number) {
  const [passo, setPasso] = useState(0);
  useEffect(() => {
    if (parado || reduzido) return;
    const id = window.setTimeout(() => setPasso((p) => proximo(p, duracoes.length)), duracoes[passo]);
    return () => window.clearTimeout(id);
  }, [passo, parado, reduzido, duracoes]);
  return reduzido ? final : passo;
}

function useMovimentoReduzido() {
  const [reduzido, setReduzido] = useState(() => window.matchMedia(consultaMovimento).matches);
  useEffect(() => {
    const m = window.matchMedia(consultaMovimento);
    const aoMudar = () => setReduzido(m.matches);
    m.addEventListener("change", aoMudar);
    return () => m.removeEventListener("change", aoMudar);
  }, []);
  return reduzido;
}

// ---------------------------------------------------------------- planilha → painel

// Desalinhamento de cada linha no passo "solto": colunas de larguras diferentes, deslocamento e uma leve inclinação.
const SOLTO = [
  { cols: "34% 18% 26% 22%", x: -6, r: -1.2 },
  { cols: "16% 36% 22% 26%", x: 10, r: 0.8 },
  { cols: "30% 22% 16% 32%", x: -3, r: -0.5 },
  { cols: "20% 26% 34% 20%", x: 12, r: 1.4 },
  { cols: "28% 30% 18% 24%", x: -9, r: -0.9 },
  { cols: "18% 32% 24% 26%", x: 5, r: 0.6 },
  { cols: "26% 20% 30% 24%", x: -4, r: 0.4 },
];
const ALINHADO = "22% 30% 24% 24%";

function Planilha({ passo }: { passo: number }) {
  const p = c.planilha;
  const alinhado = passo >= 1;
  const padronizado = passo >= 2;
  const linhaClasse = "grid items-center gap-x-1 overflow-hidden whitespace-nowrap px-1 transition-[transform] duration-700 ease-out motion-reduce:transition-none";
  const estilo = (i: number) => ({
    gridTemplateColumns: alinhado ? ALINHADO : SOLTO[i].cols,
    transform: alinhado ? "none" : `translateX(${SOLTO[i].x}px) rotate(${SOLTO[i].r}deg)`,
  });
  return (
    <div className="absolute inset-0 flex flex-col bg-white p-2 text-[10px] leading-none text-[#2b2f3c] sm:text-[11px]" style={{ opacity: passo === 3 ? 0 : 1, transition: "opacity 600ms" }}>
      <div className={`${linhaClasse} flex-1 bg-[#e3e5ee] font-semibold`} style={estilo(0)}>
        {p.colunas.map((col) => (
          <span key={col}>{col}</span>
        ))}
      </div>
      {p.linhas.map((l, i) => (
        <div key={i} className={`${linhaClasse} flex-1 border-b border-[#eceef4]`} style={estilo(i + 1)}>
          {l.sujo.map((sujo, j) => {
            const muda = sujo !== l.limpo[j];
            return (
              <span key={j} className="truncate rounded-[2px] px-0.5 transition-colors duration-500" style={{ backgroundColor: passo === 2 && muda ? "#d8f3df" : "transparent" }}>
                {padronizado ? l.limpo[j] : sujo || " "}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Painel({ ativo }: { ativo: boolean }) {
  const r = resumoPlanilha();
  const maior = Math.max(...r.setores.map((s) => s.valor));
  const cartao = "flex flex-col gap-1 rounded-[3px] border border-[#e3e5ee] bg-white p-2";
  return (
    <div className="absolute inset-0 flex flex-col gap-2 bg-[#f5f5fa] p-2 text-[10px] text-[#2b2f3c] sm:text-[11px]" style={{ opacity: ativo ? 1 : 0, transition: "opacity 600ms" }}>
      <div className="font-semibold">{c.planilha.painel.titulo}</div>
      <div className="grid grid-cols-2 gap-2">
        <div className={cartao}>
          <span className="text-[#6b7080]">{c.planilha.painel.total}</span>
          <strong className="text-sm sm:text-base">{brl(r.total)}</strong>
        </div>
        <div className={cartao}>
          <span className="text-[#6b7080]">{c.planilha.painel.lancamentos}</span>
          <strong className="text-sm sm:text-base">{r.quantidade}</strong>
        </div>
      </div>
      <div className={`${cartao} flex-1 justify-center`}>
        <span className="text-[#6b7080]">{c.planilha.painel.porSetor}</span>
        {r.setores.map((s) => (
          <div key={s.setor} className="flex items-center gap-2">
            <span className="w-[22%] shrink-0">{s.setor}</span>
            <span className="h-2.5 rounded-[2px] bg-[#2f5bd3] transition-[width] duration-700 ease-out motion-reduce:transition-none" style={{ width: ativo ? `${(s.valor / maior) * 60}%` : "0%" }} />
            <span className="text-[#6b7080]">{brl(s.valor)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- auditório

type Forca = { corpo: string; quepe: "marinha" | "exercito" | "aeronautica"; cor: string };
const FORCAS: Forca[] = [
  { corpo: "#1d3557", quepe: "marinha", cor: "#f1f3f5" },
  { corpo: "#5d6b3b", quepe: "exercito", cor: "#3b4526" },
  { corpo: "#5b8bbd", quepe: "aeronautica", cor: "#33557d" },
];
const PELES = ["#e0b48f", "#c68a62", "#8d5a3b", "#efc9a6"];
const FILEIRAS = [
  { y: 118, s: 0.8, n: 9 },
  { y: 148, s: 0.95, n: 8 },
  { y: 182, s: 1.12, n: 7 },
];

function Pessoa({ x, y, s, forca, pele }: { x: number; y: number; s: number; forca: Forca; pele: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-12" y="-6" width="24" height="22" rx="8" fill={forca.corpo} />
      <circle cx="0" cy="-13" r="6.5" fill={pele} />
      {forca.quepe === "marinha" && <path d="M-8 -17 h16 v-3 q-8 -4 -16 0 z" fill={forca.cor} />}
      {forca.quepe === "exercito" && <ellipse cx="1" cy="-19" rx="8" ry="3.4" fill={forca.cor} />}
      {forca.quepe === "aeronautica" && <path d="M-7 -17 l7 -7 l7 7 z" fill={forca.cor} />}
    </g>
  );
}

function Auditorio({ slide }: { slide: number }) {
  const a = c.apresentacao;
  const pessoas = FILEIRAS.flatMap((f, fi) =>
    Array.from({ length: f.n }, (_, i) => {
      const x = ((i + 0.5) / f.n) * 320 + (fi % 2 ? 0 : 0);
      return <Pessoa key={`${fi}-${i}`} x={x} y={f.y} s={f.s} forca={FORCAS[(i + fi * 2) % 3]} pele={PELES[(i * 3 + fi) % 4]} />;
    }),
  );
  const camada = (n: number) => ({ opacity: slide === n ? 1 : 0, transition: "opacity 600ms" });
  return (
    <svg viewBox="0 0 320 200" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <rect width="320" height="200" fill="#e6e9f0" />
      <rect y="104" width="320" height="96" fill="#cfd4de" />
      {/* telão */}
      <rect x="66" y="8" width="188" height="86" rx="3" fill="#20242e" />
      <rect x="70" y="12" width="180" height="78" fill="#ffffff" />
      {/* painel lateral com o nome, fixo nos dois slides */}
      <rect x="184" y="12" width="66" height="78" fill="#eef1fb" />
      <text x="190" y="44" fontSize="8.5" fontWeight="700" fill="#1f2a5a">
        {a.nome}
      </text>
      <text x="190" y="56" fontSize="6.5" fill="#4a5073">
        {a.funcao}
      </text>
      <rect x="190" y="62" width="30" height="2" fill="#2f5bd3" />
      {/* slide 1: painel com barras */}
      <g style={camada(0)}>
        <text x="78" y="26" fontSize="6.5" fontWeight="700" fill="#2b2f3c">
          {a.slides[0]}
        </text>
        {[34, 52, 28, 62, 44].map((h, i) => (
          <rect key={i} x={80 + i * 20} y={84 - h} width="13" height={h} fill={i === 3 ? "#2f5bd3" : "#aab6e8"} />
        ))}
        <rect x="78" y="84" width="102" height="1" fill="#8b90a0" />
      </g>
      {/* slide 2: fluxo do processo */}
      <g style={camada(1)}>
        <text x="78" y="26" fontSize="6.5" fontWeight="700" fill="#2b2f3c">
          {a.slides[1]}
        </text>
        {a.fluxo.map((etapa, i) => (
          <g key={etapa}>
            <rect x={78 + i * 36} y="46" width="28" height="22" rx="2" fill="#dfe6fb" stroke="#2f5bd3" strokeWidth="0.8" />
            <text x={92 + i * 36} y="59" fontSize="5.2" textAnchor="middle" fill="#1f2a5a">
              {etapa}
            </text>
            {i < a.fluxo.length - 1 && <path d={`M${106 + i * 36} 57 h6 l-2 -2 m2 2 l-2 2`} stroke="#2f5bd3" strokeWidth="0.8" fill="none" />}
          </g>
        ))}
      </g>
      {/* plateia, de costas */}
      {FILEIRAS.map((f, fi) => (
        <rect key={fi} x="0" y={f.y - 2} width="320" height="3" fill="#2b2f3c" opacity="0.12" />
      ))}
      {pessoas}
    </svg>
  );
}

// ---------------------------------------------------------------- cenas

/** Botão de pausa de uma cena (cada animação tem o seu). Some com movimento reduzido, quando nada anima. */
function BotaoPausa({ pausado, aoAlternar, cena }: { pausado: boolean; aoAlternar: () => void; cena: string }) {
  return (
    <button
      type="button"
      aria-pressed={pausado}
      aria-label={`${pausado ? c.continuar : c.pausar}: ${cena}`}
      onClick={aoAlternar}
      className={`min-h-alvo shrink-0 cursor-pointer rounded-pequeno border border-linha bg-transparent px-3 text-[0.8125rem] text-texto hover:bg-realce ${focoVisivel}`}
    >
      {pausado ? c.continuar : c.pausar}
    </button>
  );
}

/** Cena da planilha que vira painel, com a própria pausa. Usada na seção Sobre e no modal do Estágio. */
export function CenaPlanilha() {
  const reduzido = useMovimentoReduzido();
  const [pausado, setPausado] = useState(false);
  const passo = useCiclo(duracaoPassosPlanilha, pausado, reduzido, 3);
  return (
    <figure className="m-0">
      <div role="img" aria-label={c.planilha.alt} className="relative aspect-[16/10] w-full overflow-hidden border border-linha">
        <Planilha passo={passo} />
        <Painel ativo={passo === 3} />
      </div>
      <figcaption className="mt-1 flex items-center justify-between gap-3 text-[0.8125rem] text-texto-suave">
        <span>
          {c.planilha.titulo}: <span data-passo={passo}>{c.planilha.passos[passo]}</span>
        </span>
        {!reduzido && <BotaoPausa pausado={pausado} aoAlternar={() => setPausado((v) => !v)} cena={c.planilha.titulo} />}
      </figcaption>
    </figure>
  );
}

/** Cena do auditório com o telão, com a própria pausa. */
export function CenaAuditorio() {
  const reduzido = useMovimentoReduzido();
  const [pausado, setPausado] = useState(false);
  const slide = useCiclo(duracaoSlides, pausado, reduzido, 0);
  return (
    <figure className="m-0">
      <div role="img" aria-label={c.apresentacao.alt} className="relative aspect-[16/10] w-full overflow-hidden border border-linha">
        <Auditorio slide={slide} />
      </div>
      <figcaption className="mt-1 flex items-center justify-between gap-3 text-[0.8125rem] text-texto-suave">
        <span>{c.apresentacao.titulo}</span>
        {!reduzido && <BotaoPausa pausado={pausado} aoAlternar={() => setPausado((v) => !v)} cena={c.apresentacao.titulo} />}
      </figcaption>
    </figure>
  );
}

/** As duas cenas no modal do Estágio. */
export function CenasEstagio() {
  return (
    <section className="mb-5" aria-labelledby="cenas-estagio-titulo">
      <h3 id="cenas-estagio-titulo" className="m-0 mb-2 text-[1.0625rem]">
        {c.titulo}
      </h3>
      <div className="mb-4">
        <CenaPlanilha />
      </div>
      <div className="mb-2">
        <CenaAuditorio />
      </div>
      <p className="m-0 text-[0.8125rem] text-texto-suave">{c.aviso}</p>
    </section>
  );
}
