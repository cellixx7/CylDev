import { StrictMode, useEffect, useRef, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/tailwind.css";
import { negocios as t } from "../../content/textos";
import { CabecalhoNegocios } from "../../shared/components/CabecalhoNegocios";
import { Rodape } from "../../shared/components/Rodape";
import { botao, botaoCheio } from "../../shared/estilos";

const painel = t.apresentacao.painel;
const maxMes = Math.max(...painel.meses.map((m) => m.valor));
const maxRegiao = Math.max(...painel.regioes.map((r) => r.valor));
// Paleta fixa: funciona nos temas claro e escuro.
const cores = ["#2f7d5f", "#d08a2e", "#3b6ea8", "#b4533f", "#8a8a7f"];
const totalCategorias = painel.categorias.reduce((soma, c) => soma + c.valor, 0);
const pizza = (() => {
  let acumulado = 0;
  const fatias = painel.categorias.map((c, i) => {
    const inicio = (acumulado / totalCategorias) * 100;
    acumulado += c.valor;
    const fim = (acumulado / totalCategorias) * 100;
    return `${cores[i % cores.length]} ${inicio}% ${fim}%`;
  });
  return `conic-gradient(${fatias.join(", ")})`;
})();

// Valor que sobe (ou desce) até o número final, partindo do valor anterior
// calculado pela variação (ex.: R$ 214 mil com +14% parte de 187,72 mil).
// A cor vai do texto normal até o verde de destaque.
function parseValor(valor: string) {
  const m = valor.match(/^(\D*?)(\d[\d.]*(?:,\d+)?)(.*)$/);
  if (!m) return null;
  const numero = parseFloat(m[2].replace(/\./g, "").replace(",", "."));
  const casas = m[2].includes(",") ? m[2].split(",")[1].length : 0;
  return { prefixo: m[1], numero, casas, sufixo: m[3] };
}

function ValorAnimado({ valor, variacao, atraso }: { valor: string; variacao: string; atraso: number }) {
  const ref = useRef<HTMLElement>(null);
  const v = parseValor(valor);
  const pct = parseFloat(variacao.replace(",", ".").match(/[+-]?\d+(?:\.\d+)?/)?.[0] ?? "");

  useEffect(() => {
    const el = ref.current;
    if (!el || !v || Number.isNaN(pct)) return;
    const inicio = v.numero / (1 + pct / 100);
    const dinheiro = v.prefixo.includes("R$") || /mil|mi/.test(v.sufixo);
    const casas = dinheiro ? Math.max(v.casas, 2) : v.casas;
    const duracao = 1600;
    let quadro = 0;
    const t0 = performance.now() + atraso;
    const pintar = (p: number) => {
      const atual = inicio + (v.numero - inicio) * p;
      el.textContent = `${v.prefixo}${atual.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}${v.sufixo}`;
      el.style.color = `color-mix(in srgb, var(--color-destaque) ${Math.round(p * 100)}%, var(--color-texto))`;
    };
    const passo = (agora: number) => {
      const p = Math.min(Math.max((agora - t0) / duracao, 0), 1);
      const suave = 1 - Math.pow(1 - p, 3);
      if (p < 1) {
        pintar(suave);
        quadro = requestAnimationFrame(passo);
      } else {
        el.textContent = valor;
        el.style.color = "var(--color-destaque)";
      }
    };
    pintar(0);
    quadro = requestAnimationFrame(passo);
    return () => {
      cancelAnimationFrame(quadro);
      el.textContent = valor;
      el.style.color = "";
    };
  }, [valor, variacao, atraso]);

  return <strong className="text-[1.5em] leading-[1.1]" ref={ref}>{valor}</strong>;
}

function SetaSobre({ className }: { className: string }) {
  return (
    <a
      className={`group flex flex-col items-center gap-1 font-semibold text-texto no-underline ${className}`}
      href="#sobre"
      aria-label="Ir para a seção Sobre"
    >
      <span>Sobre</span>
      <svg className="animate-seta-pulo group-hover:text-destaque" viewBox="0 0 32 18" width="32" height="18" aria-hidden="true">
        <path d="M3 3l13 12L29 3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

// Estrutura em branco da área Negócios. O conteúdo e o design serão refeitos.
function Negocios() {
  return (
    <>
      <CabecalhoNegocios />
      <main id="conteudo" className="pt-20 [&>section]:scroll-mt-24">
        <section className="flex flex-col items-center px-margem pt-9 pb-14 pc:min-h-[calc(100svh-5rem)] pc:pb-6" id="apresentacao">
          <div className="mx-auto grid w-full max-w-hero items-center gap-9 pc:my-auto pc:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] pc:gap-[clamp(2rem,4vw,4rem)]">
            <div>
              <h1 className="mb-3 text-[clamp(2.75rem,7vw,7.5rem)] leading-[1.02]">{t.apresentacao.titulo}</h1>
              <p className="mb-3 text-[clamp(1.15rem,1.8vw,2rem)] leading-[1.4]">{t.apresentacao.subtitulo}</p>
              <p className="m-0 max-w-[44rem] text-[clamp(1rem,1.2vw,1.3rem)] text-texto-suave">{t.apresentacao.texto}</p>
              <div className="mt-6 flex flex-wrap gap-3 max-pc:justify-center">
                <a className={`${botaoCheio} max-pc:max-w-[22rem] max-pc:flex-[1_1_14rem] max-pc:justify-center`} href="#orcamento">
                  {t.apresentacao.botaoOrcamento}
                </a>
                <a className={`${botao} max-pc:max-w-[22rem] max-pc:flex-[1_1_14rem] max-pc:justify-center`} href="/negocios/como-funciona/">
                  {t.apresentacao.botaoComoFunciona}
                </a>
              </div>
              <SetaSobre className="mt-6 pc:hidden" />
            </div>
            <figure
              className="m-0 grid animate-painel gap-[clamp(0.75rem,1vw,1.25rem)] rounded-[16px] border border-linha bg-superficie p-[clamp(1rem,1.4vw,1.5rem)] text-[clamp(0.875rem,0.85vw,1rem)] shadow-painel"
              aria-label={painel.rotulo}
            >
              <figcaption className="grid animate-painel-item grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 [--atraso:0.2s]">
                <span className="rounded-full bg-destaque px-[0.7em] py-[0.1em] text-[0.75em] font-bold tracking-[0.05em] text-branco uppercase">{painel.selo}</span>
                <span className="text-[1.25em] font-bold">{painel.titulo}</span>
                <span className="rounded-full bg-realce px-3 font-medium">{painel.periodo}</span>
                <span className="col-span-full text-[0.85em] leading-[1.4] text-texto-suave">{painel.descricao}</span>
              </figcaption>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))] gap-3">
                {painel.indicadores.map((i, idx) => (
                  <div
                    className="grid animate-painel-item content-start gap-2 rounded-[10px] border border-linha p-3"
                    style={{ "--atraso": `${0.35 + idx * 0.1}s` } as CSSProperties}
                    key={i.nome}
                  >
                    <span className="text-[0.85em] text-texto-suave">{i.nome}</span>
                    <ValorAnimado valor={i.valor} variacao={i.variacao} atraso={350 + idx * 100} />
                    <span className="text-[0.8em] text-destaque">{i.variacao}</span>
                  </div>
                ))}
              </div>

              <div className="grid animate-painel-item content-start gap-2 rounded-[10px] border border-linha p-3 [--atraso:0.75s]">
                <span className="text-[0.85em] text-texto-suave">{painel.mensalTitulo}</span>
                <div className="grid h-[clamp(7rem,14vh,10rem)] grid-cols-[repeat(12,1fr)] items-end gap-[clamp(2px,0.5vw,8px)]" role="img" aria-label={painel.mensalTitulo}>
                  {painel.meses.map((m, i) => (
                    <div className="flex h-full flex-col items-center justify-end gap-[2px] text-[0.72em] text-texto-suave" key={m.nome}>
                      <span className="animate-painel-aparecer-valor text-[0.9em] [--atraso:1.5s]">{m.valor}</span>
                      <div
                        className="min-h-[2px] w-full origin-bottom animate-painel-barra rounded-t-[4px] bg-destaque"
                        style={{ height: `${(m.valor / maxMes) * 100}%`, "--atraso": `${0.9 + i * 0.05}s` } as CSSProperties}
                      />
                      <span>{m.nome}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid animate-painel-item content-start gap-2 rounded-[10px] border border-linha p-3 [--atraso:1.1s]">
                  <span className="text-[0.85em] text-texto-suave">{painel.categoriasTitulo}</span>
                  <div className="flex flex-wrap items-center gap-4">
                    <div
                      className="aspect-square w-[clamp(5.5rem,8vw,7.5rem)] flex-none animate-painel-pizza rounded-full [-webkit-mask:conic-gradient(#000_var(--pizza-revelada),transparent_0)] [mask:conic-gradient(#000_var(--pizza-revelada),transparent_0)]"
                      role="img"
                      aria-label={painel.categoriasTitulo}
                      style={{ background: pizza }}
                    />
                    <ul className="m-0 grid list-none gap-1 p-0 text-[0.85em]">
                      {painel.categorias.map((c, i) => (
                        <li
                          className="flex animate-painel-aparecer items-center gap-2"
                          style={{ "--atraso": `${1.8 + i * 0.1}s` } as CSSProperties}
                          key={c.nome}
                        >
                          <span className="size-[0.7em] flex-none rounded-[2px]" style={{ background: cores[i % cores.length] }} />
                          {c.nome} <strong>{Math.round((c.valor / totalCategorias) * 100)}%</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid animate-painel-item content-start gap-2 rounded-[10px] border border-linha p-3 [--atraso:1.25s]">
                  <span className="text-[0.85em] text-texto-suave">{painel.regioesTitulo}</span>
                  <ul className="m-0 grid list-none gap-2 p-0 text-[0.85em]">
                    {painel.regioes.map((r, i) => (
                      <li className="grid grid-cols-[6em_1fr_2.2em] items-center gap-2" key={r.nome}>
                        <span className="text-texto-suave">{r.nome}</span>
                        <span className="h-[0.7em] overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-texto)_8%,transparent)]">
                          <span
                            className="block h-full origin-left animate-painel-preencher rounded-full bg-grafico-azul"
                            style={{ width: `${(r.valor / maxRegiao) * 100}%`, "--atraso": `${1.5 + i * 0.1}s` } as CSSProperties}
                          />
                        </span>
                        <strong>{r.valor}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </figure>
          </div>
          <SetaSobre className="mt-6 max-pc:hidden" />
        </section>
        <section className="mx-auto max-w-hero px-margem py-14" id="orcamento">
          <h2>Orçamento</h2>
        </section>
        <section id="entregas"></section>
        <section id="como-funciona"></section>
        <section id="sobre"></section>
        <section id="contato"></section>
      </main>
      <Rodape ponte={{ ...t.ponte, href: "/comunidade/" }} />
    </>
  );
}

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <Negocios />
  </StrictMode>,
);
