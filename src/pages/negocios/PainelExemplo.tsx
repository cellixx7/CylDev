import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import { negocios } from "../../content/textos";
import { maior, visaoDoFoco, type Foco, type Item } from "../../shared/lib/painelVendas";

const painel = negocios.apresentacao.painel;
const txt = painel.foco;

// Uma cor por série. Definidas em tailwind.css (claro) e tema-negocios.css (escuro).
const seriesTraco = ["stroke-serie-1", "stroke-serie-2", "stroke-serie-3", "stroke-serie-4", "stroke-serie-5"];

/** Valor em R$ mil com até uma casa decimal ("12", "2,5"). */
const fmt = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

// Atraso de entrada (em segundos) como variável CSS lida pelas classes animate-painel-* e painel-*.
const atraso = (s: number) => ({ "--atraso": `${s}s` }) as CSSProperties;

/*
 * Pizza de categorias em SVG. Cada fatia é um círculo de raio R/2 com traço de
 * espessura R e pathLength 100: o traço visível (stroke-dasharray) é a fatia em %,
 * e a animação faz cada uma se abrir de 0 até o seu tamanho, em sequência.
 * Rótulos ficam fora da pizza, ligados por uma linha guia, sem legenda.
 */
const L = 290; // largura do viewBox
const A = 204; // altura do viewBox
const cx = L / 2;
const cy = 104;
const R = 58;
const alturaRotulo = 34; // distância mínima entre rótulos do mesmo lado
const passoFatias = 0.22; // s entre uma fatia e a próxima
const fimRotulo = 0.5; // s (igual a --animate-painel-fatia)

function calcularPizza(itens: Item[], inicioFatias: number, passo: number) {
  const visiveis = itens.filter((c) => c.valor > 0);
  const total = visiveis.reduce((soma, c) => soma + c.valor, 0);
  let acumulado = 0;
  const fatias = visiveis.map((c, i) => {
    const pct = (c.valor / total) * 100;
    const inicio = acumulado;
    acumulado += pct;
    const meio = ((inicio + pct / 2) / 100) * 2 * Math.PI; // radianos a partir do topo, sentido horário
    const sen = Math.sin(meio);
    const cos = Math.cos(meio);
    const direita = sen >= 0;
    return {
      nome: c.nome,
      pct,
      rotulo: `${Math.round(pct)}%`,
      inicio,
      cor: seriesTraco[painel.categorias.findIndex((x) => x.nome === c.nome) % seriesTraco.length],
      atraso: inicioFatias + i * passo,
      direita,
      borda: { x: cx + R * sen, y: cy - R * cos },
      cotovelo: { x: cx + (R + 10) * sen, y: cy - (R + 10) * cos },
      y: cy - (R + 14) * cos,
      // Divisória no início da fatia (traço na cor do fundo do painel).
      divisoria: { x: cx + R * Math.sin((inicio / 100) * 2 * Math.PI), y: cy - R * Math.cos((inicio / 100) * 2 * Math.PI) },
    };
  });

  // Evita rótulos sobrepostos: em cada lado, ordena por altura e empurra para baixo.
  for (const lado of [true, false]) {
    const doLado = fatias.filter((f) => f.direita === lado).sort((a, b) => a.y - b.y);
    for (let i = 1; i < doLado.length; i++) {
      doLado[i].y = Math.max(doLado[i].y, doLado[i - 1].y + alturaRotulo);
    }
  }
  return fatias;
}

/** `destaque`: nome da fatia em foco (as outras esmaecem); null deixa todas plenas. */
function GraficoPizza({ itens, destaque, intro }: { itens: Item[]; destaque: string | null; intro: boolean }) {
  const fatias = useMemo(() => calcularPizza(itens, intro ? 1.3 : 0.1, intro ? passoFatias : 0.12), [itens, intro]);
  const apaga = (nome: string) => (destaque && nome !== destaque ? "opacity-30" : "");
  const resumo = `${painel.categoriasTitulo}: ${fatias.map((f) => `${f.nome} ${f.rotulo}`).join(", ")}`;
  return (
    <svg className="mx-auto block w-full max-w-[19rem] pc:max-w-[min(19rem,36svh)]" viewBox={`0 0 ${L} ${A}`} role="img" aria-label={resumo}>
      {fatias.map((f) => (
        <circle
          key={f.nome}
          className={`animate-painel-fatia fill-none motion-safe:transition-opacity motion-safe:duration-500 ${f.cor} ${apaga(f.nome)}`}
          cx={cx}
          cy={cy}
          r={R / 2}
          strokeWidth={R}
          pathLength={100}
          transform={`rotate(${-90 + f.inicio * 3.6} ${cx} ${cy})`}
          style={{ strokeDasharray: `${f.pct} 100`, ...atraso(f.atraso) }}
        />
      ))}
      {fatias.map((f) => (
        <line
          key={`div-${f.nome}`}
          className="animate-painel-aparecer stroke-superficie"
          x1={cx}
          y1={cy}
          x2={f.divisoria.x}
          y2={f.divisoria.y}
          strokeWidth={1.5}
          style={atraso(f.atraso)}
        />
      ))}
      {fatias.map((f) => {
        const xTexto = cx + (f.direita ? R + 22 : -(R + 22));
        const ancora = f.direita ? "start" : "end";
        return (
          <g key={`rot-${f.nome}`} className="animate-painel-aparecer" style={atraso(f.atraso + fimRotulo)} aria-hidden="true">
            <polyline
              className={`fill-none stroke-linha ${apaga(f.nome)}`}
              strokeWidth={1}
              points={`${f.borda.x},${f.borda.y} ${f.cotovelo.x},${f.cotovelo.y} ${xTexto + (f.direita ? -4 : 4)},${f.y}`}
            />
            <text className={`fill-texto-suave font-texto ${apaga(f.nome)}`} x={xTexto} y={f.y - 3} textAnchor={ancora} fontSize={14}>
              {f.nome}
            </text>
            <text className={`fill-texto font-mono ${apaga(f.nome)}`} x={xTexto} y={f.y + 14} textAnchor={ancora} fontSize={15} fontWeight={700}>
              {f.rotulo}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const titulo = "mb-3 font-texto text-[0.875rem] font-semibold tracking-[0.06em] text-texto-suave uppercase";

function querMenosMovimento() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// "R$ 8,4 mil" -> { prefixo: "R$ ", numero: 8.4, casas: 1, sufixo: " mil" }
function parseValor(valor: string) {
  const m = valor.match(/^(\D*?)(\d[\d.]*(?:,\d+)?)(.*)$/);
  if (!m) return null;
  const numero = parseFloat(m[2].replace(/\./g, "").replace(",", "."));
  const casas = m[2].includes(",") ? m[2].split(",")[1].length : 0;
  return { prefixo: m[1], numero, casas, sufixo: m[3] };
}

// Conta do valor anterior (calculado pela variação, ex.: 214 mil com +14% parte de ~188 mil)
// até o valor final. O texto final é sempre o original, então leitores de tela e quem
// prefere menos movimento recebem o número certo direto.
function ValorAnimado({ valor, variacao, atrasoMs }: { valor: string; variacao: string; atrasoMs: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const v = parseValor(valor);
    const pct = parseFloat(variacao.replace(",", ".").match(/[+-]?\d+(?:\.\d+)?/)?.[0] ?? "");
    if (!el || !v || Number.isNaN(pct) || querMenosMovimento()) return;

    const inicio = v.numero / (1 + pct / 100);
    const duracao = 1600;
    const t0 = performance.now() + atrasoMs;
    let quadro = 0;

    const pintar = (p: number) => {
      const atual = inicio + (v.numero - inicio) * p;
      el.textContent = `${v.prefixo}${atual.toLocaleString("pt-BR", { minimumFractionDigits: v.casas, maximumFractionDigits: v.casas })}${v.sufixo}`;
    };
    const passo = (agora: number) => {
      const p = Math.min(Math.max((agora - t0) / duracao, 0), 1);
      if (p < 1) {
        pintar(1 - Math.pow(1 - p, 3));
        quadro = requestAnimationFrame(passo);
      } else {
        el.textContent = valor;
      }
    };

    pintar(0);
    quadro = requestAnimationFrame(passo);
    return () => {
      cancelAnimationFrame(quadro);
      el.textContent = valor;
    };
  }, [valor, variacao, atrasoMs]);

  return (
    <span ref={ref}>
      {valor}
    </span>
  );
}

/*
 * Roteiro: depois da entrada, um item de cada gráfico ganha o foco (o que mais vendeu no mês, na categoria e na
 * região). O gráfico do item continua inteiro, com ele em destaque; os outros dois passam a mostrar só as vendas dele.
 */
const anoTodo = visaoDoFoco(null);
const roteiro: Foco[] = [
  { tipo: "mes", nome: maior(anoTodo.meses).nome },
  { tipo: "categoria", nome: maior(anoTodo.categorias).nome },
  { tipo: "regiao", nome: maior(anoTodo.regioes).nome },
];
const entradaMs = 3600; // a entrada do painel termina antes de o roteiro começar
const etapaMs = 3800;
const descansoMs = 5000; // depois da última etapa, o painel fica sem nenhum foco antes de recomeçar

/**
 * `visto`: o painel já apareceu na tela (a entrada só toca uma vez, nesse momento: no carregamento
 * no desktop, ao rolar até ele no celular). `etapa`: posição no roteiro (-1 = ainda na entrada; depois da última
 * etapa vem o descanso, sem foco); o roteiro repete enquanto o painel está na tela. Com movimento reduzido nada disso roda.
 */
function usarAnimacao(ref: RefObject<HTMLElement | null>) {
  const semObservador = typeof IntersectionObserver === "undefined";
  const [visto, setVisto] = useState(() => semObservador || querMenosMovimento());
  const [etapa, setEtapa] = useState(-1);
  const naTela = useRef(semObservador);

  useEffect(() => {
    const el = ref.current;
    if (!el || semObservador || querMenosMovimento()) return;
    const obs = new IntersectionObserver(([e]) => {
      naTela.current = e.isIntersecting;
      if (e.isIntersecting) setVisto(true);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, semObservador]);

  useEffect(() => {
    if (!visto || querMenosMovimento()) return;
    let id = 0;
    let atual = 0;
    const agendar = () => {
      id = window.setTimeout(() => {
        if (naTela.current && !document.hidden) {
          atual = (atual + 1) % (roteiro.length + 1);
          setEtapa(atual);
        }
        agendar();
      }, atual === roteiro.length ? descansoMs : etapaMs);
    };
    const inicio = window.setTimeout(() => {
      setEtapa(0);
      agendar();
    }, entradaMs);
    return () => {
      window.clearTimeout(inicio);
      window.clearTimeout(id);
    };
  }, [visto]);

  return { visto, etapa };
}

const transicao = "motion-safe:transition-[opacity,background-color] motion-safe:duration-500";

/** Painel de exemplo (loja fictícia). Entra animado uma vez e depois percorre os gráficos em loop. */
export function PainelExemplo() {
  const figura = useRef<HTMLElement>(null);
  const { visto, etapa } = usarAnimacao(figura);
  const foco = roteiro[etapa] ?? null; // -1 (entrada) e o descanso não têm foco
  const intro = etapa < 0;
  const visao = useMemo(() => visaoDoFoco(foco), [foco]);

  // Entrada: invisível até aparecer na tela; depois a classe de animação assume.
  const entra = (classe: string) => (visto ? classe : "opacity-0");
  // Um gráfico mostra só o que é do item em foco quando o foco é de outro gráfico; aí ganha uma etiqueta no título.
  const filtradoPor = (tipo: Foco["tipo"]) => (foco && foco.tipo !== tipo ? foco.nome : null);
  // Remonta (e reanima) o gráfico quando ele passa a mostrar outro recorte.
  const chave = (tipo: Foco["tipo"]) => `${visto}-${filtradoPor(tipo) ?? "todos"}`;
  const etiqueta = (tipo: Foco["tipo"]) => {
    const nome = filtradoPor(tipo);
    return nome ? <span className="ml-1.5 text-destaque">· {txt.so(nome)}</span> : null;
  };

  const maiorMes = maior(visao.meses).nome;
  const maiorRegiao = maior(visao.regioes).nome;
  const maxMes = Math.max(...visao.meses.map((m) => m.valor));
  const maxRegiao = Math.max(...visao.regioes.map((r) => r.valor));
  const base = (i: number, passo: number, introInicio: number, introPasso: number) => (intro ? introInicio + i * introPasso : 0.05 + i * passo);

  return (
    <figure
      ref={figura}
      className={`m-0 w-full ${entra("animate-painel")} rounded-padrao border border-linha bg-superficie p-4 sm:p-5`}
      aria-label={painel.rotulo}
    >
      <figcaption className={`mb-4 ${entra("animate-painel-item")}`} style={atraso(0.2)}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="rounded-pequeno border border-destaque px-2 font-mono text-[0.875rem] font-bold tracking-[0.08em] text-destaque uppercase">
            {painel.selo}
          </span>
          <span className="font-titulo text-[1.1rem] font-bold">{painel.titulo}</span>
          <span className="ml-auto font-mono text-[0.875rem] text-texto-suave">{painel.periodo}</span>
        </div>
        <p className="mt-1.5 mb-0 max-w-none text-[1rem] leading-[1.45] text-texto-suave">{painel.descricao}</p>
      </figcaption>

      <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-4 xl:grid-cols-4">
        {painel.indicadores.map((i, idx) => {
          // O primeiro indicador (vendas) acompanha o foco; os outros não existem por mês, categoria ou região e esmaecem.
          const segue = idx === 0 && foco;
          const fora = foco && !segue;
          const pct = Math.round((visao.total / anoTodo.total) * 100);
          return (
            <div className={`${entra("animate-painel-item")} border-t-2 pt-2 ${segue ? "border-destaque" : "border-texto"}`} style={atraso(0.35 + idx * 0.1)} key={i.nome}>
              <div className={`${transicao} ${fora ? "opacity-40" : ""}`}>
                <dt className={`text-[0.875rem] ${segue ? "font-bold text-destaque" : "text-texto-suave"}`}>{segue ? txt.vendas(foco.nome) : i.nome}</dt>
                <dd className={`m-0 font-mono text-[1.35rem] leading-[1.2] font-bold whitespace-nowrap tabular-nums xl:text-[1.15rem] ${segue ? "text-destaque" : ""}`}>
                  {segue ? <span key={foco.nome}>R$ {fmt(visao.total)} mil</span> : <ValorAnimado key={String(visto)} valor={i.valor} variacao={i.variacao} atrasoMs={350 + idx * 100} />}
                </dd>
                <dd className="m-0 font-mono text-[0.875rem] text-texto-suave">{segue ? txt.doAno(pct) : i.variacao}</dd>
              </div>
            </div>
          );
        })}
      </dl>

      <section className={`mt-6 ${entra("animate-painel-item")} pc:mt-5`} style={atraso(0.75)} aria-labelledby="painel-mensal">
        <h3 className={titulo} id="painel-mensal">
          {painel.mensalTitulo}
          {etiqueta("mes")}
        </h3>
        <ol
          key={chave("mes")}
          className="m-0 grid h-28 list-none pc:h-[clamp(4.5rem,13svh,7rem)] grid-cols-[repeat(12,1fr)] items-end gap-[3px] border-b border-linha p-0 sm:gap-1.5"
          aria-label={painel.mensalTitulo}
        >
          {painel.meses.map((m, i) => {
            const v = visao.meses[i].valor;
            const filtrado = filtradoPor("mes") !== null;
            const emFoco = foco?.tipo === "mes";
            const cor = emFoco
              ? m.nome === foco.nome
                ? "bg-destaque"
                : "bg-serie-3 opacity-40"
              : filtrado
                ? m.nome === maiorMes
                  ? "bg-destaque"
                  : "bg-serie-2"
                : i === painel.meses.length - 1
                  ? "bg-destaque"
                  : "bg-serie-3";
            return (
              <li className="flex h-full flex-col items-center justify-end gap-1" key={m.nome}>
                <span className="sr-only">{painel.mesFalado(m.completo, fmt(v))}</span>
                <span
                  className={`animate-painel-aparecer font-mono text-[0.875rem] ${emFoco && m.nome === foco.nome ? "font-bold text-texto" : "text-texto-suave"}`}
                  style={atraso(base(i, 0.04, 0.9, 0.05))}
                  aria-hidden="true"
                >
                  {fmt(v)}
                </span>
                <span
                  className={`w-full painel-sobe rounded-t-pequeno ${transicao} ${cor}`}
                  style={{ height: `${(v / maxMes) * 100}%`, ...atraso(base(i, 0.04, 0.9, 0.05)) }}
                  aria-hidden="true"
                />
              </li>
            );
          })}
        </ol>
        <ol className="m-0 mt-1 grid list-none grid-cols-[repeat(12,1fr)] gap-[3px] p-0 sm:gap-1.5" aria-hidden="true">
          {painel.meses.map((m) => (
            <li className={`text-center font-mono text-[0.875rem] ${foco?.tipo === "mes" && m.nome === foco.nome ? "font-bold text-texto" : "text-texto-suave"}`} key={m.nome}>
              <span className="sm:hidden">{m.nome[0]}</span>
              <span className="hidden sm:inline">{m.nome}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-6 grid items-start gap-6 pc:mt-5 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <section className={entra("animate-painel-item")} style={atraso(1.1)} aria-labelledby="painel-categorias">
          <h3 className={titulo} id="painel-categorias">
            {painel.categoriasTitulo}
            {etiqueta("categoria")}
          </h3>
          <GraficoPizza key={chave("categoria")} itens={visao.categorias} destaque={foco?.tipo === "categoria" ? foco.nome : null} intro={intro} />
        </section>

        <section className={entra("animate-painel-item")} style={atraso(1.25)} aria-labelledby="painel-regioes">
          <h3 className={titulo} id="painel-regioes">
            {painel.regioesTitulo}
            {etiqueta("regiao")}
          </h3>
          <ul key={chave("regiao")} className="m-0 grid list-none gap-3 p-0 text-[1rem]">
            {painel.regioes.map((r, i) => {
              const v = visao.regioes[i].valor;
              const emFoco = foco?.tipo === "regiao";
              const filtrado = filtradoPor("regiao") !== null;
              const destaque = emFoco ? r.nome === foco.nome : filtrado && r.nome === maiorRegiao;
              return (
                <li className={`grid grid-cols-[6.25rem_1fr_2rem] items-center gap-2 ${transicao} ${emFoco && !destaque ? "opacity-40" : ""}`} key={r.nome}>
                  <span className={destaque ? "font-bold text-texto" : "text-texto-suave"}>{r.nome}</span>
                  <span className="h-2 bg-realce">
                    <span
                      className={`block h-full origin-left animate-painel-preencher ${destaque ? "bg-destaque" : "bg-serie-2"}`}
                      style={{ width: `${(v / maxRegiao) * 100}%`, ...atraso(base(i, 0.08, 1.5, 0.1)) }}
                    />
                  </span>
                  <span className="text-right font-mono font-bold">{fmt(v)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </figure>
  );
}
