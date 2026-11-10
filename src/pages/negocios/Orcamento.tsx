import { useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { servicoOrcamentoPorId } from "../../content/perguntas";
import { orcamento as t } from "../../content/textos";
import { calcularServico, type Respostas } from "../../shared/lib/orcamento";
import { estadoDaEstimativa, montarPedido, progressoDoServico } from "../../shared/lib/pedido";
import { ConfiguradorServico } from "./ConfiguradorServico";
import { ListaServicos } from "./ListaServicos";
import { ResumoEstimativa } from "./ResumoEstimativa";
import { BarraPedidoMobile, ResumoPedido } from "./ResumoPedido";
import { RevisaoPedido } from "./RevisaoPedido";

const COMBO = ["planilha", "painel", "automacao"];

/** Aulas começam no formato avulso, que é o que o preço mostra sem resposta. */
const respostasIniciais: Record<string, Respostas> = { aulas: { pagamento: "avulsa" } };

type Etapa = "servicos" | "configurar" | "pedido";

const desktop = () => typeof window !== "undefined" && window.matchMedia("(min-width: 64rem)").matches;

function Passo({ titulo, refTitulo, children }: { titulo: string; refTitulo?: Ref<HTMLHeadingElement>; children: ReactNode }) {
  return (
    <section className="mb-8" aria-label={titulo}>
      <h3 ref={refTitulo} tabIndex={-1} className="mb-3 text-[1.15rem] font-bold outline-none">
        {titulo}
      </h3>
      {children}
    </section>
  );
}

type EtapaBotao = { id: Etapa; numero: number; rotulo: string };

/** Navegação entre as três etapas. No desktop, serviços e configuração aparecem juntos; no celular, uma por vez. */
function Etapas({ etapa, qtd, aoIr }: { etapa: Etapa; qtd: number; aoIr: (e: Etapa) => void }) {
  const lista: EtapaBotao[] = [
    { id: "servicos", numero: 1, rotulo: t.etapas.servicos },
    { id: "configurar", numero: 2, rotulo: t.etapas.configurar },
    { id: "pedido", numero: 3, rotulo: qtd > 0 ? t.etapas.pedidoComQtd(qtd) : t.etapas.pedido },
  ];
  return (
    <nav aria-label={t.etapas.rotulo} className="mt-6">
      <ol className="m-0 grid max-w-3xl list-none grid-cols-3 gap-1 p-0 sm:gap-2">
        {lista.map((e) => {
          const ativa = e.id === etapa;
          return (
            <li key={e.id} className="flex min-w-0">
              <button
                type="button"
                aria-current={ativa ? "step" : undefined}
                onClick={() => aoIr(e.id)}
                className={`flex min-h-alvo w-full min-w-0 cursor-pointer flex-col items-start justify-center gap-0.5 rounded-pequeno border px-2 py-1.5 text-left font-[inherit] transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco sm:flex-row sm:items-center sm:gap-2 sm:px-3 ${
                  ativa ? "border-texto bg-texto text-fundo" : "border-linha bg-transparent text-texto hover:bg-realce"
                }`}
              >
                <span className="font-mono text-[0.78rem] leading-none" aria-hidden="true">
                  {e.numero}
                </span>
                <span className="text-[0.85rem] leading-tight font-semibold sm:text-[0.92rem] [overflow-wrap:anywhere]">{e.rotulo}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Orcamento() {
  const [servicoId, setServicoId] = useState("planilha");
  const [etapa, setEtapa] = useState<Etapa>("servicos");
  const [ids, setIds] = useState<string[]>([]);
  const [respostas, setRespostas] = useState<Record<string, Respostas>>(respostasIniciais);
  const [observacoes, setObservacoes] = useState("");
  const [aviso, setAviso] = useState("");
  const [barraVisivel, setBarraVisivel] = useState(false);

  const secao = useRef<HTMLElement>(null);
  const tituloServicos = useRef<HTMLHeadingElement>(null);
  const tituloPerguntas = useRef<HTMLHeadingElement>(null);
  const tituloPedido = useRef<HTMLHeadingElement>(null);
  const primeira = useRef(true);

  const modelo = servicoOrcamentoPorId(servicoId) ?? servicoOrcamentoPorId("planilha")!;
  const respostasDele = respostas[modelo.id] ?? {};
  const calculo = calcularServico(modelo.id, respostasDele)!;
  const progresso = progressoDoServico(modelo, respostasDele);
  const estado = estadoDaEstimativa(calculo, progresso);
  const pedido = useMemo(() => montarPedido(ids, respostas, observacoes), [ids, respostas, observacoes]);
  const noPedido = ids.includes(modelo.id);

  // A barra fixa do celular só existe enquanto a seção está na tela.
  useEffect(() => {
    const el = secao.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const o = new IntersectionObserver(([entrada]) => setBarraVisivel(entrada.isIntersecting));
    o.observe(el);
    return () => o.disconnect();
  }, []);

  // Mudança de etapa: leva o foco ao título e, no celular, volta ao começo da etapa.
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    const alvo = etapa === "servicos" ? tituloServicos : etapa === "configurar" ? tituloPerguntas : tituloPedido;
    alvo.current?.focus({ preventScroll: true });
    if (!desktop() || etapa === "pedido") secao.current?.scrollIntoView({ block: "start" });
  }, [etapa]);

  const abrir = (id: string) => {
    setServicoId(id);
    setEtapa("configurar");
  };
  const adicionar = () => {
    setIds((atual) => (atual.includes(modelo.id) ? atual : [...atual, modelo.id]));
    setAviso(`${modelo.nome} adicionado ao pedido.`);
  };
  const tirar = (id: string) => {
    setIds((atual) => atual.filter((i) => i !== id));
    setAviso(`${servicoOrcamentoPorId(id)?.nome ?? "Serviço"} removido do pedido.`);
  };
  const montarCombo = () => {
    setIds((atual) => [...atual, ...COMBO.filter((id) => !atual.includes(id))]);
    setAviso("Combo adicionado ao pedido.");
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

  // No desktop, serviços e configuração dividem a tela; no celular, só a etapa atual aparece.
  const lista = etapa === "servicos" ? "block" : etapa === "configurar" ? "hidden lg:block" : "hidden";
  const config = etapa === "configurar" ? "block" : etapa === "servicos" ? "hidden lg:block" : "hidden";

  const estimativa = (
    <ResumoEstimativa
      nome={modelo.nome}
      calculo={calculo}
      progresso={progresso}
      estado={estado}
      noCarrinho={noPedido}
      aoAdicionar={adicionar}
      aoRemover={() => tirar(modelo.id)}
      aoOutroServico={() => setEtapa("servicos")}
    />
  );

  return (
    <section
      ref={secao}
      className="mx-auto max-w-hero scroll-mt-24 px-margem pt-14 pb-[calc(3.5rem+var(--altura-barra,0px))] lg:pb-14"
      id="orcamento"
      aria-labelledby="orcamento-titulo"
    >
      <span className="revela-barra mb-5 block h-[3px] w-12 bg-destaque" aria-hidden="true" />
      <h2 id="orcamento-titulo" className="revela-titulo">
        {t.titulo}
      </h2>
      <p className="max-w-[40rem] text-texto-suave">{t.intro}</p>

      <Etapas etapa={etapa} qtd={pedido.itens.length} aoIr={setEtapa} />

      <p className="sr-only" role="status">
        {aviso}
      </p>

      <div className="revela mt-8">
        {etapa !== "pedido" && (
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_clamp(19rem,30%,25rem)] lg:items-start lg:gap-x-10 xl:gap-x-14">
            <div className="min-w-0">
              <div className={lista}>
                <Passo titulo={t.passos.servico} refTitulo={tituloServicos}>
                  <ListaServicos servicoId={modelo.id} noCarrinho={ids} aoAbrir={abrir} aoMontarCombo={montarCombo} />
                </Passo>
              </div>
              <div className={config}>
                <Passo titulo={t.passos.perguntas} refTitulo={tituloPerguntas}>
                  <ConfiguradorServico
                    modelo={modelo}
                    respostas={respostasDele}
                    progresso={progresso}
                    aoResponder={responder}
                    estimativa={estimativa}
                  />
                </Passo>
              </div>
            </div>

            {/* Lateral só no desktop. Sticky só quando a janela é alta o bastante para caber tudo, sem rolagem interna. */}
            <aside
              className="hidden min-w-0 gap-4 lg:grid lg:[@media(min-height:60rem)]:sticky lg:[@media(min-height:60rem)]:top-24"
              aria-label={t.resumo.titulo}
            >
              {estimativa}
              <ResumoPedido pedido={pedido} aoRevisar={() => setEtapa("pedido")} />
            </aside>
          </div>
        )}

        {etapa === "pedido" && (
          <RevisaoPedido
            pedido={pedido}
            observacoes={observacoes}
            aoMudarObservacoes={setObservacoes}
            aoEditar={abrir}
            aoTirar={tirar}
            aoEscolherServico={() => setEtapa("servicos")}
            refTitulo={tituloPedido}
          />
        )}
      </div>

      {/* Fora do bloco `revela`: o transform dele prenderia o `fixed` ao bloco. */}
      {barraVisivel && etapa !== "pedido" && (
        <BarraPedidoMobile
          pedido={pedido}
          podeAdicionar={etapa === "configurar" && !noPedido}
          aoAdicionar={adicionar}
          aoRevisar={() => setEtapa("pedido")}
        />
      )}
    </section>
  );
}
