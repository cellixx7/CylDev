import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { servicoOrcamentoPorId } from "../../content/perguntas";
import { orcamento as t } from "../../content/textos";
import { botaoCheio } from "../../shared/estilos";
import { calcularCarrinho, calcularServico, type Respostas } from "../../shared/lib/orcamento";
import { Carrinho } from "./Carrinho";
import { ListaServicos } from "./ListaServicos";
import { PainelEstimativa, PainelPerguntas, precoDaBarra } from "./PainelServico";

const COMBO = ["planilha", "painel", "automacao"];

/** Aulas começam no formato avulso, que é o que o preço mostra sem resposta. */
const respostasIniciais: Record<string, Respostas> = { aulas: { pagamento: "avulsa" } };

function Passo({ n, titulo, children }: { n: number; titulo: string; children: ReactNode }) {
  return (
    <section className="mb-8" aria-label={titulo}>
      <h3 className="mb-3 flex items-center gap-2 text-[1.1rem] font-bold">
        <span className="grid size-7 place-items-center rounded-full bg-texto font-mono text-[0.85rem] text-fundo" aria-hidden="true">
          {n}
        </span>
        {titulo}
      </h3>
      {children}
    </section>
  );
}

export function Orcamento() {
  const [servicoId, setServicoId] = useState("planilha");
  const [ids, setIds] = useState<string[]>([]);
  const [respostas, setRespostas] = useState<Record<string, Respostas>>(respostasIniciais);
  const [visivel, setVisivel] = useState(false);
  const secao = useRef<HTMLElement>(null);

  const modelo = servicoOrcamentoPorId(servicoId) ?? servicoOrcamentoPorId("planilha")!;
  const carrinho = useMemo(() => calcularCarrinho(ids, respostas), [ids, respostas]);
  const calculo = calcularServico(modelo.id, respostas[modelo.id]);
  const noCarrinho = ids.includes(modelo.id);

  // A barra fixa do celular só aparece enquanto a seção está na tela.
  useEffect(() => {
    const el = secao.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const o = new IntersectionObserver(([entrada]) => setVisivel(entrada.isIntersecting));
    o.observe(el);
    return () => o.disconnect();
  }, []);

  const abrir = (id: string) => {
    setServicoId(id);
    document.getElementById("orc-passo-perguntas")?.scrollIntoView({ block: "nearest" });
  };
  const alternar = (id: string) =>
    setIds((atual) => (atual.includes(id) ? atual.filter((i) => i !== id) : [...atual, id]));
  const montarCombo = () => setIds((atual) => [...atual, ...COMBO.filter((id) => !atual.includes(id))]);
  const responder = (perguntaId: string, opcaoId: string) => {
    const pergunta = modelo.perguntas.find((p) => p.id === perguntaId);
    if (!pergunta) return;
    setRespostas((atual) => {
      const dele = atual[modelo.id] ?? {};
      if (pergunta.tipo === "unica") return { ...atual, [modelo.id]: { ...dele, [perguntaId]: opcaoId } };
      const marcadas = Array.isArray(dele[perguntaId]) ? (dele[perguntaId] as string[]) : [];
      const novas = marcadas.includes(opcaoId) ? marcadas.filter((i) => i !== opcaoId) : [...marcadas, opcaoId];
      return { ...atual, [modelo.id]: { ...dele, [perguntaId]: novas } };
    });
  };

  return (
    <section
      ref={secao}
      className={`mx-auto max-w-hero px-margem pt-14 lg:pb-14 ${visivel ? "pb-32" : "pb-14"}`}
      id="orcamento"
      aria-labelledby="orcamento-titulo"
    >
      <span className="revela-barra mb-5 block h-[3px] w-12 bg-destaque" aria-hidden="true" />
      <h2 id="orcamento-titulo" className="revela-titulo">
        {t.titulo}
      </h2>
      <p className="max-w-[40rem] text-texto-suave">{t.intro}</p>

      <div className="revela mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)] lg:items-start lg:gap-x-12">
        <div className="min-w-0">
          <Passo n={1} titulo={t.passos.servico}>
            <ListaServicos servicoId={modelo.id} noCarrinho={ids} aoAbrir={abrir} aoMontarCombo={montarCombo} />
          </Passo>
          <div id="orc-passo-perguntas">
            <Passo n={2} titulo={t.passos.perguntas}>
              <PainelPerguntas modelo={modelo} respostas={respostas[modelo.id] ?? {}} aoResponder={responder} />
            </Passo>
          </div>
        </div>

        <div className="min-w-0 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto">
          <Passo n={3} titulo={t.passos.pedido}>
            <div className="grid gap-6">
              <PainelEstimativa
                modelo={modelo}
                respostas={respostas[modelo.id] ?? {}}
                noCarrinho={noCarrinho}
                aoAlternar={() => alternar(modelo.id)}
              />
              <Carrinho carrinho={carrinho} aoEditar={abrir} aoTirar={alternar} />
            </div>
          </Passo>
        </div>
      </div>

      {/* Fora do bloco `revela`: o transform dele prenderia o `fixed` ao bloco. */}
      {visivel && calculo && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t-2 border-texto bg-fundo px-margem py-2 lg:hidden">
          {/* pl-12: o botão de tema da página fica fixo no canto inferior esquerdo. */}
          <p className="m-0 min-w-0 pl-12 font-mono text-[1.05rem] leading-tight font-bold [word-spacing:-0.3em]">{precoDaBarra(calculo)}</p>
          <button
            type="button"
            className={`${botaoCheio} shrink-0 cursor-pointer font-[inherit]`}
            onClick={() => alternar(modelo.id)}
          >
            {noCarrinho ? t.estimativa.tirar : t.estimativa.adicionar}
          </button>
        </div>
      )}
    </section>
  );
}
