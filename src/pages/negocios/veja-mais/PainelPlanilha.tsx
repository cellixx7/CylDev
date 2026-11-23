import { useMemo, useState, type KeyboardEvent } from "react";
import { vejaMais } from "../../../content/textos";
import { focoVisivel } from "../../../shared/estilos";
import { brl, formatarDia, formatarMes, percentual } from "../../../shared/lib/formato";
import {
  alternar, filtrar, indicadores, opcoes, ordenar, pagina, porCategoria, porPagamento, semFiltros, serieDiaria, serieMensal, temFiltro, topClientes,
  type ColunaTabela, type Dimensao, type Filtros, type Ordem, type Ponto, type Venda,
} from "../../../shared/lib/painelPlanilha";

const t = vejaMais.painel;

const chip = `inline-flex min-h-alvo cursor-pointer items-center rounded-full border px-4 text-base font-semibold ${focoVisivel}`;
const cartao = "min-w-0 rounded-padrao border border-linha bg-superficie p-4";
const tituloGrafico = "m-0 mb-3 text-medio";

/** Setas movem o foco entre as barras do mesmo gráfico (`data-grupo`), na ordem em que aparecem. */
function moverFoco(e: KeyboardEvent<Element>) {
  const proximo = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
  if (!proximo) return;
  const grupo = e.currentTarget.closest("[data-grupo]");
  if (!grupo) return;
  const itens = Array.from(grupo.querySelectorAll<HTMLElement>("[data-barra]"));
  const alvo = itens[itens.indexOf(e.currentTarget as HTMLElement) + proximo];
  if (alvo) {
    e.preventDefault();
    alvo.focus();
  }
}

/** Enter e Espaço acionam o que não é <button> (os pontos do SVG). */
function teclaAciona(acao: () => void) {
  return (e: KeyboardEvent<Element>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      acao();
    } else moverFoco(e);
  };
}

type Selecao = { selecionados: string[]; aoAlternar: (chave: string) => void };

function dicaDe(p: Ponto, nome: string, total: number): string {
  return t.graficos.dica(nome, brl(p.valor), percentual(p.valor, total), p.vendas);
}

/** Alternativa em tabela para leitor de tela: os mesmos números do gráfico. */
function TabelaSr({ titulo, pontos, nome }: { titulo: string; pontos: Ponto[]; nome: (chave: string) => string }) {
  const g = t.graficos;
  return (
    <table className="sr-only">
      <caption>{g.tabelaAlternativa(titulo)}</caption>
      <thead>
        <tr>
          <th scope="col">{g.colunaNome}</th>
          <th scope="col">{g.colunaValor}</th>
          <th scope="col">{g.colunaVendas}</th>
        </tr>
      </thead>
      <tbody>
        {pontos.map((p) => (
          <tr key={p.chave}>
            <th scope="row">{nome(p.chave)}</th>
            <td>{brl(p.valor)}</td>
            <td>{p.vendas}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function resumo(titulo: string, pontos: Ponto[], nome: (c: string) => string): string {
  const itens = pontos.length ? pontos.map((p) => `${nome(p.chave)} ${brl(p.valor)}`).join("; ") : t.graficos.semDados;
  return t.graficos.resumo(titulo, itens);
}

/** Gráfico de barras horizontais: cada barra é um botão que liga o filtro daquele valor. */
function BarrasHorizontais({ titulo, pontos, total, nome, selecionados, aoAlternar }: { titulo: string; pontos: Ponto[]; total: number; nome: (c: string) => string } & Selecao) {
  const [dica, setDica] = useState("");
  const maior = Math.max(1, ...pontos.map((p) => p.valor));
  const filtrado = selecionados.length > 0;
  return (
    <section className={cartao} aria-label={titulo}>
      <h3 className={tituloGrafico}>{titulo}</h3>
      <ul role="group" aria-label={resumo(titulo, pontos, nome)} data-grupo className="m-0 grid list-none gap-1 p-0">
        {pontos.map((p) => {
          const ligado = selecionados.includes(p.chave);
          const apagado = filtrado && !ligado;
          const texto = dicaDe(p, nome(p.chave), total);
          return (
            <li key={p.chave} className="m-0">
              <button
                type="button"
                data-barra
                data-chave={p.chave}
                aria-pressed={ligado}
                aria-label={`${texto}. ${t.graficos.aoClicar}`}
                onClick={() => aoAlternar(p.chave)}
                onKeyDown={moverFoco}
                onMouseEnter={() => setDica(texto)}
                onMouseLeave={() => setDica("")}
                onFocus={() => setDica(texto)}
                onBlur={() => setDica("")}
                className={`grid min-h-alvo w-full cursor-pointer grid-cols-[minmax(4.5rem,7rem)_minmax(0,1fr)_auto] items-center gap-3 rounded-pequeno border-0 bg-transparent p-0 text-left text-base text-texto hover:bg-realce ${focoVisivel} ${apagado ? "opacity-50" : ""}`}
              >
                <span className="truncate pl-1">{nome(p.chave)}</span>
                <span className={`block h-[1.1rem] rounded-pequeno bg-realce ${ligado ? "outline-2 outline-offset-1 outline-texto" : ""}`} aria-hidden="true">
                  <span className="block h-full rounded-pequeno bg-serie-1 motion-safe:transition-[width] motion-safe:duration-300" style={{ width: `${(p.valor / maior) * 100}%` }} />
                </span>
                <span className="pr-1 text-right font-mono text-menor">{brl(p.valor)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="m-0 mt-2 min-h-[2.8em] text-menor text-texto-suave" aria-hidden="true">{dica || t.graficos.aoClicar}</p>
      <TabelaSr titulo={titulo} pontos={pontos} nome={nome} />
    </section>
  );
}

/** Barras verticais por mês. */
function BarrasMensais({ titulo, pontos, total, selecionados, aoAlternar }: { titulo: string; pontos: Ponto[]; total: number } & Selecao) {
  const [dica, setDica] = useState("");
  const maior = Math.max(1, ...pontos.map((p) => p.valor));
  const filtrado = selecionados.length > 0;
  return (
    <section className={cartao} aria-label={titulo}>
      <h3 className={tituloGrafico}>{titulo}</h3>
      <ul role="group" aria-label={resumo(titulo, pontos, formatarMes)} data-grupo className="m-0 grid list-none grid-flow-col auto-cols-fr gap-3 p-0">
        {pontos.map((p) => {
          const ligado = selecionados.includes(p.chave);
          const apagado = filtrado && !ligado;
          const texto = dicaDe(p, formatarMes(p.chave), total);
          return (
            <li key={p.chave} className="m-0">
              <button
                type="button"
                data-barra
                data-chave={p.chave}
                aria-pressed={ligado}
                aria-label={`${texto}. ${t.graficos.aoClicar}`}
                onClick={() => aoAlternar(p.chave)}
                onKeyDown={moverFoco}
                onMouseEnter={() => setDica(texto)}
                onMouseLeave={() => setDica("")}
                onFocus={() => setDica(texto)}
                onBlur={() => setDica("")}
                className={`flex h-48 w-full cursor-pointer flex-col justify-end gap-1 rounded-pequeno border-0 bg-transparent p-1 text-center text-base text-texto hover:bg-realce ${focoVisivel} ${apagado ? "opacity-50" : ""}`}
              >
                <span className="font-mono text-menor">{brl(p.valor)}</span>
                <span
                  className={`block w-full rounded-pequeno bg-serie-1 motion-safe:transition-[height] motion-safe:duration-300 ${ligado ? "outline-2 outline-offset-1 outline-texto" : ""}`}
                  style={{ height: `${Math.max(2, (p.valor / maior) * 8)}rem` }}
                  aria-hidden="true"
                />
                <span className="font-semibold">{formatarMes(p.chave)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="m-0 mt-2 min-h-[2.8em] text-menor text-texto-suave" aria-hidden="true">{dica || t.graficos.aoClicar}</p>
      <TabelaSr titulo={titulo} pontos={pontos} nome={formatarMes} />
    </section>
  );
}

const L = 640;
const A = 220;
const margem = { e: 56, d: 16, s: 28, i: 28 };

/** Linha do faturamento por dia, em SVG. Cada ponto é clicável (área de toque maior que o ponto desenhado). */
function LinhaDiaria({ titulo, pontos, total, selecionados, aoAlternar }: { titulo: string; pontos: Ponto[]; total: number } & Selecao) {
  const [dica, setDica] = useState("");
  const maior = Math.max(1, ...pontos.map((p) => p.valor));
  const x = (i: number) => margem.e + (pontos.length < 2 ? (L - margem.e - margem.d) / 2 : (i / (pontos.length - 1)) * (L - margem.e - margem.d));
  const y = (v: number) => A - margem.i - (v / maior) * (A - margem.i - margem.s);
  const caminho = pontos.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.valor).toFixed(1)}`).join(" ");
  const filtrado = selecionados.length > 0;
  const nome = formatarDia;
  const marcas = [0, 0.5, 1].map((f) => Math.round(maior * f));
  return (
    <section className={`${cartao} md:col-span-2`} aria-label={titulo}>
      <h3 className={tituloGrafico}>{titulo}</h3>
      <div className="overflow-x-auto" tabIndex={-1}>
        <svg viewBox={`0 0 ${L} ${A}`} className="block h-auto w-full min-w-[40rem] text-texto" role="group" aria-label={resumo(titulo, pontos, nome)} data-grupo>
          {marcas.map((m) => (
            <g key={m}>
              <line x1={margem.e} x2={L - margem.d} y1={y(m)} y2={y(m)} className="stroke-linha" strokeWidth="1" />
              <text x={margem.e - 6} y={y(m) + 5} textAnchor="end" className="fill-texto-suave font-mono" style={{ fontSize: 14 }}>{m}</text>
            </g>
          ))}
          <path d={caminho} fill="none" className="stroke-serie-1" strokeWidth="2" />
          {pontos.map((p, i) => {
            const ligado = selecionados.includes(p.chave);
            const apagado = filtrado && !ligado;
            const texto = dicaDe(p, nome(p.chave), total);
            const acao = () => aoAlternar(p.chave);
            return (
              <g
                key={p.chave}
                data-barra
                data-chave={p.chave}
                role="button"
                tabIndex={0}
                aria-pressed={ligado}
                aria-label={`${texto}. ${t.graficos.aoClicar}`}
                onClick={acao}
                onKeyDown={teclaAciona(acao)}
                onMouseEnter={() => setDica(texto)}
                onMouseLeave={() => setDica("")}
                onFocus={() => setDica(texto)}
                onBlur={() => setDica("")}
                className="cursor-pointer outline-none [&:focus-visible_.anel]:stroke-foco [&:focus-visible_.anel]:[stroke-width:3]"
                opacity={apagado ? 0.45 : 1}
              >
                <circle cx={x(i)} cy={y(p.valor)} r="16" fill="transparent" />
                <circle className="anel fill-none stroke-transparent" cx={x(i)} cy={y(p.valor)} r="9" />
                <circle cx={x(i)} cy={y(p.valor)} r={ligado ? 6 : 4} className={ligado ? "fill-texto stroke-serie-1" : "fill-serie-1"} strokeWidth="2" />
              </g>
            );
          })}
          {[0, pontos.length - 1].filter((i, k, a) => pontos[i] && a.indexOf(i) === k).map((i) => (
            <text key={i} x={x(i)} y={A - 6} textAnchor={i === 0 ? "start" : "end"} className="fill-texto-suave font-mono" style={{ fontSize: 14 }}>{nome(pontos[i].chave)}</text>
          ))}
        </svg>
      </div>
      <p className="m-0 mt-2 min-h-[2.8em] text-menor text-texto-suave" aria-hidden="true">{dica || t.graficos.aoClicar}</p>
      <TabelaSr titulo={titulo} pontos={pontos} nome={nome} />
    </section>
  );
}

const colunasTabela: ColunaTabela[] = ["data", "cliente", "produto", "qtd", "valorTotal", "pagamento", "situacao"];

function TabelaVendas({ vendas }: { vendas: Venda[] }) {
  const c = t.tabela;
  const [ordem, setOrdem] = useState<Ordem>({ coluna: "data", decrescente: false });
  const [numero, setNumero] = useState(1);
  const ordenadas = useMemo(() => ordenar(vendas, ordem), [vendas, ordem]);
  const p = pagina(ordenadas, numero);

  return (
    <section className={`${cartao} md:col-span-2`} aria-label={c.titulo}>
      <h3 className={tituloGrafico}>{c.titulo}</h3>
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={c.titulo}>
        <table className="w-full min-w-[40rem] border-collapse text-menor">
          <thead>
            <tr>
              {colunasTabela.map((col) => {
                const ativa = ordem.coluna === col;
                const numerica = col === "qtd" || col === "valorTotal";
                return (
                  <th key={col} scope="col" aria-sort={ativa ? (ordem.decrescente ? "descending" : "ascending") : "none"} className={`border-b border-linha p-0 ${numerica ? "text-right" : "text-left"}`}>
                    <button
                      type="button"
                      aria-label={c.ordenarPor(c.colunas[col])}
                      onClick={() => {
                        setOrdem({ coluna: col, decrescente: ativa ? !ordem.decrescente : false });
                        setNumero(1);
                      }}
                      className={`inline-flex min-h-alvo w-full cursor-pointer items-center gap-1 border-0 bg-transparent px-2 text-menor font-bold text-texto hover:bg-realce ${numerica ? "justify-end" : ""} ${focoVisivel}`}
                    >
                      {c.colunas[col]}
                      <span aria-hidden="true">{ativa ? (ordem.decrescente ? "↓" : "↑") : ""}</span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {p.itens.map((v, i) => (
              <tr key={`${v.data}-${v.cliente}-${i}`} className={v.situacao === "fiado" ? "bg-fiado text-fiado-texto" : ""}>
                <td className="border-b border-linha px-2 py-2 font-mono whitespace-nowrap">{formatarDia(v.data)}</td>
                <td className="border-b border-linha px-2 py-2">{v.cliente}</td>
                <td className="border-b border-linha px-2 py-2">{v.produto}</td>
                <td className="border-b border-linha px-2 py-2 text-right font-mono">{v.qtd}</td>
                <td className="border-b border-linha px-2 py-2 text-right font-mono whitespace-nowrap">{brl(v.valorTotal)}</td>
                <td className="border-b border-linha px-2 py-2">{v.pagamento}</td>
                <td className="border-b border-linha px-2 py-2 font-semibold">{vejaMais.painel.filtros.situacoes[v.situacao]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button type="button" disabled={p.atual <= 1} onClick={() => setNumero(p.atual - 1)} className={`${chip} border-texto bg-transparent text-texto hover:bg-realce disabled:cursor-default disabled:opacity-40`}>
          {c.anterior}
        </button>
        <p className="m-0 font-mono text-menor text-texto-suave">{c.pagina(p.atual, p.total)}</p>
        <button type="button" disabled={p.atual >= p.total} onClick={() => setNumero(p.atual + 1)} className={`${chip} border-texto bg-transparent text-texto hover:bg-realce disabled:cursor-default disabled:opacity-40`}>
          {c.proxima}
        </button>
      </div>
    </section>
  );
}

function Chips({ rotulo, dimensao, valores, filtros, nome, aoAlternar }: { rotulo: string; dimensao: Dimensao; valores: string[]; filtros: Filtros; nome: (v: string) => string; aoAlternar: (d: Dimensao, v: string) => void }) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-2 p-0 text-menor font-bold tracking-[0.06em] text-texto-suave uppercase">{rotulo}</legend>
      <div className="flex flex-wrap gap-2">
        {valores.map((v) => {
          const ligado = filtros[dimensao].includes(v);
          return (
            <button
              key={v}
              type="button"
              aria-pressed={ligado}
              data-filtro={`${dimensao}:${v}`}
              onClick={() => aoAlternar(dimensao, v)}
              className={`${chip} ${ligado ? "border-destaque bg-destaque text-destaque-texto" : "border-linha bg-transparent text-texto hover:bg-realce"}`}
            >
              {nome(v)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Nome legível de um valor de filtro, por dimensão. */
function nomeDoFiltro(d: Dimensao, v: string): string {
  if (d === "meses") return formatarMes(v);
  if (d === "dias") return formatarDia(v);
  if (d === "situacoes") return t.filtros.situacoes[v] ?? v;
  return v;
}

const rotuloDimensao: Record<Dimensao, string> = {
  meses: t.filtros.mes,
  dias: "Dia",
  categorias: t.filtros.categoria,
  pagamentos: t.filtros.pagamento,
  situacoes: t.filtros.situacao,
  clientes: t.filtros.cliente,
};

/** Painel interativo (estilo BI): filtros, indicadores, gráficos com filtro cruzado e tabela. Carregado sob demanda. */
export default function PainelPlanilha({ vendas }: { vendas: Venda[] }) {
  const [filtros, setFiltros] = useState<Filtros>(semFiltros);
  const [filtrosAbertos, setFiltrosAbertos] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 62rem)").matches);
  const op = useMemo(() => opcoes(vendas), [vendas]);

  const alterna = (d: Dimensao, v: string) => setFiltros((f) => alternar(f, d, v));
  const limpar = () => setFiltros(semFiltros);

  const filtradas = useMemo(() => filtrar(vendas, filtros), [vendas, filtros]);
  // Cada gráfico ignora o filtro da própria dimensão: assim as outras barras continuam visíveis (apagadas) e dá para trocar a seleção.
  const doMes = useMemo(() => serieMensal(filtrar(vendas, filtros, "meses"), op.meses), [vendas, filtros, op.meses]);
  const doDia = useMemo(() => serieDiaria(filtrar(vendas, filtros, "dias")), [vendas, filtros]);
  const daCategoria = useMemo(() => porCategoria(filtrar(vendas, filtros, "categorias"), op.categorias), [vendas, filtros, op.categorias]);
  const doPagamento = useMemo(() => porPagamento(filtrar(vendas, filtros, "pagamentos"), op.pagamentos), [vendas, filtros, op.pagamentos]);
  const dosClientes = useMemo(() => topClientes(filtrar(vendas, filtros, "clientes")), [vendas, filtros]);
  const totalDe = (d: Dimensao) => indicadores(filtrar(vendas, filtros, d)).faturamento;

  const ind = indicadores(filtradas);
  const ativos = (Object.keys(filtros) as Dimensao[]).flatMap((d) => filtros[d].map((v) => ({ d, v })));
  const f = t.filtros;

  return (
    <div data-testid="painel-planilha">
      <p className="sr-only" role="status" data-testid="painel-anuncio">
        {t.anuncio(filtradas.length, vendas.length, brl(ind.faturamento))}
      </p>

      <details
        open={filtrosAbertos}
        onToggle={(e) => setFiltrosAbertos(e.currentTarget.open)}
        className="mb-4 rounded-padrao border border-linha bg-superficie"
      >
        <summary className={`flex min-h-alvo cursor-pointer items-center px-4 text-base font-bold ${focoVisivel}`}>{f.titulo}</summary>
        <div className="grid gap-4 border-t border-linha p-4 md:grid-cols-2">
          <Chips rotulo={f.mes} dimensao="meses" valores={op.meses} filtros={filtros} nome={formatarMes} aoAlternar={alterna} />
          <Chips rotulo={f.situacao} dimensao="situacoes" valores={op.situacoes} filtros={filtros} nome={(v) => f.situacoes[v] ?? v} aoAlternar={alterna} />
          <Chips rotulo={f.categoria} dimensao="categorias" valores={op.categorias} filtros={filtros} nome={(v) => v} aoAlternar={alterna} />
          <Chips rotulo={f.pagamento} dimensao="pagamentos" valores={op.pagamentos} filtros={filtros} nome={(v) => v} aoAlternar={alterna} />
          <div>
            <label htmlFor="filtro-cliente" className="mb-2 block text-menor font-bold tracking-[0.06em] text-texto-suave uppercase">{f.cliente}</label>
            <select
              id="filtro-cliente"
              value={filtros.clientes.length === 1 ? filtros.clientes[0] : ""}
              onChange={(e) => setFiltros((x) => ({ ...x, clientes: e.target.value ? [e.target.value] : [] }))}
              className={`min-h-alvo w-full rounded-pequeno border border-texto bg-superficie px-3 text-base text-texto md:max-w-xs ${focoVisivel}`}
            >
              <option value="">{f.todosClientes}</option>
              {op.clientes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </details>

      <div className="mb-4 flex flex-wrap items-center gap-2" aria-label={f.ativos}>
        <p className="m-0 mr-2 font-mono text-menor text-texto-suave" data-testid="painel-contador">{f.contador(filtradas.length, vendas.length)}</p>
        {ativos.map(({ d, v }) => (
          <button
            key={`${d}:${v}`}
            type="button"
            aria-label={f.remover(`${rotuloDimensao[d]}: ${nomeDoFiltro(d, v)}`)}
            onClick={() => alterna(d, v)}
            className={`${chip} border-destaque bg-realce text-texto hover:bg-superficie`}
          >
            {rotuloDimensao[d]}: {nomeDoFiltro(d, v)} <span aria-hidden="true" className="ml-2">×</span>
          </button>
        ))}
        {temFiltro(filtros) && (
          <button type="button" onClick={limpar} className={`${chip} border-texto bg-transparent text-texto hover:bg-realce`}>
            {f.limpar}
          </button>
        )}
      </div>

      <dl className="m-0 mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          [t.indicadores.faturamento, brl(ind.faturamento), "faturamento"],
          [t.indicadores.vendas, String(ind.vendas), "vendas"],
          [t.indicadores.ticket, brl(ind.ticketMedio), "ticket"],
          [t.indicadores.fiado, brl(ind.fiadoAReceber), "fiado"],
        ].map(([nome, valor, id]) => (
          <div key={id} className={cartao}>
            <dt className="text-menor text-texto-suave">{nome}</dt>
            <dd className="m-0 font-mono text-maior font-bold" data-testid={`ind-${id}`}>{valor}</dd>
          </div>
        ))}
      </dl>

      {filtradas.length === 0 ? (
        <div className={`${cartao} grid place-items-center gap-3 py-10 text-center`} data-testid="painel-vazio">
          <p className="m-0 text-medio font-semibold">{t.vazio.titulo}</p>
          <button type="button" onClick={limpar} className={`${chip} border-destaque bg-destaque text-destaque-texto`}>
            {t.vazio.acao}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <BarrasMensais titulo={t.graficos.mes} pontos={doMes} total={totalDe("meses")} selecionados={filtros.meses} aoAlternar={(c) => alterna("meses", c)} />
          <BarrasHorizontais titulo={t.graficos.categoria} pontos={daCategoria} total={totalDe("categorias")} nome={(c) => c} selecionados={filtros.categorias} aoAlternar={(c) => alterna("categorias", c)} />
          <LinhaDiaria titulo={t.graficos.dia} pontos={doDia} total={totalDe("dias")} selecionados={filtros.dias} aoAlternar={(c) => alterna("dias", c)} />
          <BarrasHorizontais titulo={t.graficos.pagamento} pontos={doPagamento} total={totalDe("pagamentos")} nome={(c) => c} selecionados={filtros.pagamentos} aoAlternar={(c) => alterna("pagamentos", c)} />
          <BarrasHorizontais titulo={t.graficos.clientes} pontos={dosClientes} total={totalDe("clientes")} nome={(c) => c} selecionados={filtros.clientes} aoAlternar={(c) => alterna("clientes", c)} />
          <TabelaVendas vendas={filtradas} />
        </div>
      )}
    </div>
  );
}
