import { useEffect, useMemo, useRef, useState } from "react";
import { servicoOrcamentoPorId } from "../../content/perguntas";
import { orcamento as t } from "../../content/textos";
import { botaoCheio } from "../../shared/estilos";
import { calcularCarrinho, calcularServico, type Respostas } from "../../shared/lib/orcamento";
import { Carrinho } from "./Carrinho";
import { ListaServicos } from "./ListaServicos";
import { PainelServico, precoDaBarra } from "./PainelServico";

type Tela = "lista" | "servico" | "carrinho";

const COMBO = ["planilha", "painel", "automacao"];
/** Abaixo do breakpoint lg (64rem) o orçamento mostra uma tela por vez. */
const consultaCelular = "(max-width: 63.99rem)";

/** Aulas começam no formato avulso, que é o que o preço mostra sem resposta. */
const respostasIniciais: Record<string, Respostas> = { aulas: { pagamento: "avulsa" } };

const botaoNav =
  "inline-flex min-h-alvo cursor-pointer items-center border-0 bg-transparent px-2 font-[inherit] font-semibold text-texto underline underline-offset-4 hover:text-destaque";

export function Orcamento() {
  const [servicoId, setServicoId] = useState("planilha");
  const [tela, setTela] = useState<Tela>("lista");
  const [ids, setIds] = useState<string[]>([]);
  const [respostas, setRespostas] = useState<Record<string, Respostas>>(respostasIniciais);
  const [visivel, setVisivel] = useState(false);
  const secao = useRef<HTMLElement>(null);
  const primeiraTela = useRef(true);

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

  // No celular, trocar de tela leva ao topo da seção e o foco ao título da nova tela.
  useEffect(() => {
    if (primeiraTela.current) {
      primeiraTela.current = false;
      return;
    }
    if (!window.matchMedia(consultaCelular).matches) return;
    secao.current?.scrollIntoView({ block: "start" });
    document.getElementById(`orc-foco-${tela}`)?.focus({ preventScroll: true });
  }, [tela]);

  const abrir = (id: string) => {
    setServicoId(id);
    setTela("servico");
  };
  const alternar = (id: string) =>
    setIds((atual) => (atual.includes(id) ? atual.filter((i) => i !== id) : [...atual, id]));
  const montarCombo = () => {
    setIds((atual) => [...atual, ...COMBO.filter((id) => !atual.includes(id))]);
    setTela("carrinho");
  };
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

  const barraFixa = tela === "servico" && visivel;
  const mostra = (alvo: Tela) => (tela === alvo ? "" : "hidden");

  return (
    <section
      ref={secao}
      className={`mx-auto max-w-hero px-margem pt-14 lg:pb-14 ${barraFixa ? "pb-32" : "pb-14"}`}
      id="orcamento"
      aria-labelledby="orcamento-titulo"
    >
      <span className="revela-barra mb-5 block h-[3px] w-12 bg-destaque" aria-hidden="true" />
      <h2 id="orcamento-titulo" className="revela-titulo">
        {t.titulo}
      </h2>
      <p className="max-w-[40rem] text-texto-suave">{t.intro}</p>

      <div className="revela mt-8">
        {/* Celular: cabeçalho para ir e voltar entre as três telas. */}
        <div className="mb-4 flex items-center justify-between gap-2 border-y border-linha lg:hidden">
          {tela === "lista" ? (
            <span className="px-2 font-mono text-[0.85rem] text-texto-suave">{t.lista.titulo}</span>
          ) : (
            <button type="button" className={botaoNav} onClick={() => setTela("lista")}>
              {t.navegacao.voltar}
            </button>
          )}
          {tela !== "carrinho" && (
            <button type="button" className={botaoNav} onClick={() => setTela("carrinho")}>
              {t.navegacao.carrinho(carrinho.itens.length)}
            </button>
          )}
        </div>

        <div className="lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start lg:gap-x-10 lg:gap-y-12 xl:grid-cols-[minmax(19rem,22rem)_minmax(0,1fr)_minmax(20rem,25rem)]">
          <div className={`${mostra("lista")} lg:row-span-2 lg:block xl:row-span-1`}>
            <ListaServicos servicoId={modelo.id} noCarrinho={ids} aoAbrir={abrir} aoMontarCombo={montarCombo} />
          </div>
          <div className={`${mostra("servico")} min-w-0 lg:block`}>
            <PainelServico
              modelo={modelo}
              respostas={respostas[modelo.id] ?? {}}
              noCarrinho={noCarrinho}
              aoResponder={responder}
              aoAlternar={() => alternar(modelo.id)}
            />
          </div>
          <div className={`${mostra("carrinho")} min-w-0 lg:col-start-2 lg:block xl:col-start-3 xl:row-start-1`}>
            <Carrinho carrinho={carrinho} aoEditar={abrir} aoTirar={alternar} />
          </div>
        </div>
      </div>

      {/* Fora do bloco `revela`: o transform dele prenderia o `fixed` ao bloco. */}
      {barraFixa && calculo && (
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
