import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { exemploPlanilha } from "../../../content/exemploPlanilha";
import { comum, vejaMais as t } from "../../../content/textos";
import { Carrossel } from "../../../shared/components/Carrossel";
import { Secao } from "../../../shared/components/Secao";
import { botao, focoVisivel, rotuloFicticio } from "../../../shared/estilos";
import { brl, formatarMes } from "../../../shared/lib/formato";
import { indicadores, opcoes, serieMensal } from "../../../shared/lib/painelPlanilha";
import type { DadosVejaMais } from "./dados";
import { GradePlanilha } from "./GradePlanilha";
import { ModalVejaMais } from "./ModalVejaMais";

const PainelPlanilha = lazy(() => import("./PainelPlanilha"));

type Aberto = "antes" | "depois" | "painel" | null;
type Estado = { fase: "espera" } | { fase: "carregando" } | { fase: "pronto"; dados: DadosVejaMais } | { fase: "falhou" };

/** Carrega os CSV e a lógica do painel só quando a seção chega perto da tela (ou quando alguém abre um card). */
function useDados(alvo: React.RefObject<HTMLElement | null>) {
  const [estado, setEstado] = useState<Estado>({ fase: "espera" });
  const pedido = useRef(false);

  const carregar = () => {
    if (pedido.current) return;
    pedido.current = true;
    setEstado({ fase: "carregando" });
    import("./dados")
      .then((m) => setEstado({ fase: "pronto", dados: m.carregarDados() }))
      .catch(() => setEstado({ fase: "falhou" }));
  };

  useEffect(() => {
    const el = alvo.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      carregar();
      return;
    }
    const o = new IntersectionObserver((e) => e.some((x) => x.isIntersecting) && (carregar(), o.disconnect()), { rootMargin: "400px" });
    o.observe(el);
    return () => o.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alvo]);

  return { estado, carregar };
}

function Rotulo({ n }: { n: number }) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-menor font-bold tracking-[0.08em] text-destaque uppercase">
        {String(n).padStart(2, "0")} · {t.rotuloExemplar}
      </span>
      <span className={rotuloFicticio}>{comum.dadosFicticios}</span>
    </span>
  );
}

function Reserva({ texto }: { texto: string }) {
  return <div className="grid min-h-40 place-items-center rounded-pequeno border border-dashed border-texto-suave p-4 text-center text-texto-suave">{texto}</div>;
}

/** Prévia do painel no card: os indicadores e o faturamento por mês, só para ver (o painel completo é interativo). */
function PreviaPainel({ dados }: { dados: DadosVejaMais }) {
  const ind = indicadores(dados.vendas);
  const meses = serieMensal(dados.vendas, opcoes(dados.vendas).meses);
  const maior = Math.max(1, ...meses.map((m) => m.valor));
  return (
    <div className="grid gap-3 rounded-pequeno border border-linha bg-fundo p-3" data-testid="previa-painel">
      <dl className="m-0 grid grid-cols-2 gap-2">
        {[
          ["Faturamento", brl(ind.faturamento)],
          ["Vendas", String(ind.vendas)],
          ["Ticket médio", brl(ind.ticketMedio)],
          ["Fiado a receber", brl(ind.fiadoAReceber)],
        ].map(([nome, valor]) => (
          <div key={nome} className="min-w-0 rounded-pequeno border border-linha bg-superficie p-2">
            <dt className="truncate text-menor text-texto-suave">{nome}</dt>
            <dd className="m-0 font-mono text-medio font-bold">{valor}</dd>
          </div>
        ))}
      </dl>
      <div>
        <p className="m-0 mb-2 text-menor text-texto-suave">{t.painelCard.previa}</p>
        <ul className="m-0 grid list-none grid-cols-3 items-end gap-2 p-0" aria-label={t.painelCard.previa}>
          {meses.map((m) => (
            <li key={m.chave} className="m-0 grid justify-items-center gap-1 text-menor">
              <span className="font-mono">{brl(m.valor)}</span>
              <span className="block w-full rounded-pequeno bg-serie-1" style={{ height: `${Math.max(4, (m.valor / maior) * 4)}rem` }} aria-hidden="true" />
              <span className="font-semibold">{formatarMes(m.chave)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Seção #veja-mais: a planilha de uma loja fictícia como chega, arrumada e em painel interativo. */
export function VejaMais() {
  const secao = useRef<HTMLElement | null>(null);
  const { estado, carregar } = useDados(secao);
  const [aberto, setAberto] = useState<Aberto>(null);
  const [aba, setAba] = useState<string>(exemploPlanilha.abasBagunca[0].id);
  const origem = useRef<HTMLElement | null>(null);

  const abrir = (qual: Exclude<Aberto, null>) => (e: React.MouseEvent<HTMLElement>) => {
    carregar();
    origem.current = e.currentTarget;
    setAberto(qual);
  };

  // Depois que o modal fechou, o foco volta ao botão que abriu (o <dialog> e a trava já foram desfeitos).
  useEffect(() => {
    if (aberto) return;
    const alvo = origem.current;
    origem.current = null;
    alvo?.focus({ preventScroll: true });
  }, [aberto]);

  const dados = estado.fase === "pronto" ? estado.dados : null;
  const avisoEstado = estado.fase === "falhou" ? t.falhou : t.carregando;
  const abaAtual = exemploPlanilha.abasBagunca.find((a) => a.id === aba) ?? exemploPlanilha.abasBagunca[0];
  const botaoAbrir = `${botao} justify-center ${focoVisivel}`;

  const cartao = "flex min-w-0 flex-col gap-3 rounded-padrao border border-linha bg-superficie p-4";

  return (
    <div ref={secao as React.RefObject<HTMLDivElement>}>
      <Secao id="veja-mais" titulo={t.titulo} intro={t.intro}>
        <div className="revela mt-6">
          <Carrossel as="ol" rotulo={t.titulo} gradeMd="md:grid-cols-3 md:gap-4">
            <li className={cartao} data-testid="card-antes">
              <Rotulo n={1} />
              <h3 className="m-0 text-medio">{t.antes.titulo}</h3>
              <p className="m-0 text-texto-suave">{t.antes.legenda}</p>
              {dados ? <GradePlanilha linhas={dados.bagunca.planilha1} nome={t.antes.titulo} maxLinhas={8} /> : <Reserva texto={avisoEstado} />}
              <button type="button" className={`${botaoAbrir} mt-auto`} onClick={abrir("antes")}>
                {t.antes.abrir}
              </button>
            </li>
            <li className={cartao} data-testid="card-depois">
              <Rotulo n={2} />
              <h3 className="m-0 text-medio">{t.depois.titulo}</h3>
              <p className="m-0 text-texto-suave">{t.depois.legenda}</p>
              {dados ? <GradePlanilha linhas={dados.arrumada} nome={t.depois.titulo} cabecalho maxLinhas={8} /> : <Reserva texto={avisoEstado} />}
              <button type="button" className={`${botaoAbrir} mt-auto`} onClick={abrir("depois")}>
                {t.depois.abrir}
              </button>
            </li>
            <li className={cartao} data-testid="card-painel">
              <Rotulo n={3} />
              <h3 className="m-0 text-medio">{t.painelCard.titulo}</h3>
              <p className="m-0 text-texto-suave">{t.painelCard.legenda}</p>
              {dados ? <PreviaPainel dados={dados} /> : <Reserva texto={avisoEstado} />}
              <button type="button" className={`${botaoAbrir} mt-auto`} onClick={abrir("painel")}>
                {t.painelCard.abrir}
              </button>
            </li>
          </Carrossel>
        </div>
      </Secao>

      <ModalVejaMais aberto={aberto === "antes"} titulo={t.antes.modalTitulo} aoFechar={() => setAberto(null)}>
        <p className="m-0 mb-4 text-texto-suave">{t.antes.modalIntro} <span className={rotuloFicticio}>{comum.dadosFicticios}</span></p>
        {dados && (
          <>
            <div role="tablist" aria-label={t.antes.abas} className="mb-3 flex flex-wrap gap-2">
              {exemploPlanilha.abasBagunca.map((a, i, lista) => (
                <button
                  key={a.id}
                  type="button"
                  role="tab"
                  id={`aba-${a.id}`}
                  aria-selected={aba === a.id}
                  aria-controls="painel-aba"
                  tabIndex={aba === a.id ? 0 : -1}
                  onClick={() => setAba(a.id)}
                  onKeyDown={(e) => {
                    const passo = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                    if (!passo) return;
                    e.preventDefault();
                    const prox = lista[(i + passo + lista.length) % lista.length];
                    setAba(prox.id);
                    document.getElementById(`aba-${prox.id}`)?.focus();
                  }}
                  className={`inline-flex min-h-alvo cursor-pointer items-center rounded-pequeno border px-4 font-semibold ${focoVisivel} ${aba === a.id ? "border-destaque bg-destaque text-destaque-texto" : "border-linha bg-transparent text-texto hover:bg-realce"}`}
                >
                  {a.nome}
                </button>
              ))}
            </div>
            <div role="tabpanel" id="painel-aba" aria-labelledby={`aba-${abaAtual.id}`}>
              <GradePlanilha linhas={dados.bagunca[abaAtual.id as keyof typeof dados.bagunca]} nome={abaAtual.nome} />
            </div>
          </>
        )}
      </ModalVejaMais>

      <ModalVejaMais aberto={aberto === "depois"} titulo={t.depois.modalTitulo} aoFechar={() => setAberto(null)}>
        <p className="m-0 mb-4 text-texto-suave">{t.depois.modalIntro} <span className={rotuloFicticio}>{comum.dadosFicticios}</span></p>
        <h3 className="m-0 mb-2 text-medio">{t.depois.arrumadoTitulo}</h3>
        <ul className="m-0 mb-4 list-disc pl-5 text-texto-suave">
          {t.depois.arrumado.map((item) => (
            <li key={item} className="mb-1">{item}</li>
          ))}
        </ul>
        {dados && <GradePlanilha linhas={dados.arrumada} nome={t.depois.modalTitulo} cabecalho />}
      </ModalVejaMais>

      <ModalVejaMais aberto={aberto === "painel"} titulo={t.painelCard.modalTitulo} aoFechar={() => setAberto(null)} largo>
        <p className="m-0 mb-4"><span className={rotuloFicticio}>{comum.dadosFicticios}</span></p>
        {dados ? (
          <Suspense fallback={<p className="m-0 text-texto-suave">{t.carregando}</p>}>
            <PainelPlanilha vendas={dados.vendas} />
          </Suspense>
        ) : (
          <p className="m-0 text-texto-suave" role="status">{avisoEstado}</p>
        )}
      </ModalVejaMais>
    </div>
  );
}
