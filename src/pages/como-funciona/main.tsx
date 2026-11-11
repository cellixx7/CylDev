import { StrictMode, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/tailwind.css";
import "../../styles/tema-negocios.css";
import { comoFunciona as t, exemplos, type Exemplo } from "../../content/exemplos";
import { servicoPorId } from "../../content/servicos";
import { negocios } from "../../content/textos";
import { CabecalhoNegocios } from "../../shared/components/cabecalho/CabecalhoNegocios";
import { ContatoRodape, Rodape } from "../../shared/components/Rodape";
import { botaoCheio, rotuloFicticio } from "../../shared/estilos";
import { linkContato } from "../../shared/lib/whatsapp";

const rotuloLista = "mb-2 text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave";
const celula = "border border-linha px-2 py-1 text-left";
const listaPassos = "m-0 list-decimal pl-[1.2em] text-[1rem]";
const precoLinha = "flex justify-between border-b border-linha py-2";
const botaoFalso = "mb-2 inline-block rounded-pequeno bg-destaque px-4 py-2 font-semibold text-destaque-texto";

const caminho = "/como-funciona/";

function Ficticio() {
  return <span className={rotuloFicticio}>dados fictícios</span>;
}

function CopiarLink({ id }: { id: string }) {
  const [estado, setEstado] = useState<"ocioso" | "ok" | "falhou">("ocioso");
  const endereco = `${window.location.origin}${caminho}#${id}`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(endereco);
      setEstado("ok");
    } catch {
      setEstado("falhou");
    }
    window.setTimeout(() => setEstado("ocioso"), 2500);
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
      <a href={`#${id}`} className="inline-flex min-h-alvo items-center font-mono text-[1rem] text-texto-suave [overflow-wrap:anywhere]">
        {`como-funciona#${id}`}
      </a>
      <button type="button" className="min-h-alvo cursor-pointer rounded-pequeno border border-linha bg-transparent px-3 text-[1rem] text-texto hover:bg-superficie active:bg-superficie" onClick={copiar}>
        {t.copiar}
      </button>
      <span role="status" className="text-[1rem] font-semibold text-destaque">
        {estado === "ok" && t.copiado}
        {estado === "falhou" && t.copiarFalhou}
      </span>
    </div>
  );
}

function Quadro({ legenda, children }: { legenda: string; children: ReactNode }) {
  return (
    <figure className="m-0 overflow-x-auto rounded-padrao border border-linha bg-superficie p-4">
      <figcaption className="mb-4 text-[1rem] font-semibold">
        {legenda} <Ficticio />
      </figcaption>
      {children}
    </figure>
  );
}

function VisualPlanilha() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className={rotuloLista}>Antes</p>
        <table className="w-full border-collapse text-[0.875rem]">
          <tbody>
            <tr><td className={celula}>maria camisa</td><td className={celula}>2x 40</td><td className={celula}>jan</td></tr>
            <tr><td className={celula}>Camisa - João</td><td className={celula}>R$ 40,00</td><td className={celula}>03/01</td></tr>
            <tr><td className={celula}>cliente?</td><td className={celula}>80</td><td className={celula}></td></tr>
            <tr><td className={celula} colSpan={3}>TOTAL ??? (não bate)</td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <p className={rotuloLista}>Depois</p>
        <table className="w-full border-collapse text-[0.875rem]">
          <thead>
            <tr><th className={`${celula} bg-realce`}>Data</th><th className={`${celula} bg-realce`}>Cliente</th><th className={`${celula} bg-realce`}>Item</th><th className={`${celula} bg-realce`}>Valor</th></tr>
          </thead>
          <tbody>
            <tr><td className={celula}>02/01</td><td className={celula}>Maria</td><td className={celula}>Camisa</td><td className={celula}>R$ 80</td></tr>
            <tr><td className={celula}>03/01</td><td className={celula}>João</td><td className={celula}>Camisa</td><td className={celula}>R$ 40</td></tr>
            <tr className="font-bold"><td className={celula} colSpan={3}>Total</td><td className={celula}>R$ 120</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VisualPainel() {
  const barras = [
    ["Camisa", 90],
    ["Boné", 62],
    ["Caneca", 40],
    ["Adesivo", 22],
  ] as const;
  return (
    <div>
      <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-3">
        <div className="rounded-pequeno border border-linha p-3"><span className="block text-[0.875rem] text-texto-suave">Vendas no mês</span><strong className="font-mono text-[1.2rem]">R$ 4.820</strong></div>
        <div className="rounded-pequeno border border-linha p-3"><span className="block text-[0.875rem] text-texto-suave">Pedidos</span><strong className="font-mono text-[1.2rem]">63</strong></div>
        <div className="rounded-pequeno border border-linha p-3"><span className="block text-[0.875rem] text-texto-suave">Estoque baixo</span><strong className="font-mono text-[1.2rem]">3 itens</strong></div>
      </div>
      <ul className="m-0 grid list-none gap-2 p-0 text-[0.875rem]" aria-label="Itens mais vendidos">
        {barras.map(([nome, v]) => (
          <li className="grid grid-cols-[5rem_1fr] items-center gap-3" key={nome}>
            <span>{nome}</span>
            <span className="block h-[0.9rem] rounded-pequeno bg-realce">
              <span className="block h-full rounded-pequeno bg-destaque" style={{ width: `${v}%` }} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VisualAutomacao() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className={rotuloLista}>Antes, toda semana</p>
        <ol className={listaPassos}>
          <li className="mb-2">Abrir os 3 arquivos de vendas</li>
          <li className="mb-2">Copiar e colar numa aba só</li>
          <li className="mb-2">Filtrar e apagar o que sobra</li>
          <li className="mb-2">Formatar e conferir os totais</li>
        </ol>
      </div>
      <div>
        <p className={rotuloLista}>Depois</p>
        <p className={botaoFalso} aria-hidden="true">Atualizar relatório</p>
        <p className="text-[1rem] text-texto-suave">Um clique faz os quatro passos.</p>
      </div>
    </div>
  );
}

function VisualLanding() {
  return (
    <div className="rounded-padrao border border-dashed border-texto-suave p-4">
      <p className="mb-2 font-titulo text-[1.3rem] font-bold">Studio Lia · Manicure em Brasília</p>
      <p className="text-texto-suave">Atendimento com hora marcada, de segunda a sábado.</p>
      <ul className="m-0 mb-4 list-none p-0">
        <li className={precoLinha}><span>Mão</span><span>R$ 35</span></li>
        <li className={precoLinha}><span>Pé</span><span>R$ 40</span></li>
        <li className={precoLinha}><span>Mão e pé</span><span>R$ 70</span></li>
      </ul>
      <p className={botaoFalso} aria-hidden="true">Agendar no WhatsApp</p>
    </div>
  );
}

function VisualAulas() {
  return (
    <ol className={listaPassos}>
      <li className="mb-2"><strong>Aula 1.</strong> Organizar a sua planilha: tabelas e formatação.</li>
      <li className="mb-2"><strong>Aula 2.</strong> Fórmulas de soma, média e procura (PROCV).</li>
      <li className="mb-2"><strong>Aula 3.</strong> Tabela dinâmica com os seus dados de venda.</li>
      <li className="mb-2"><strong>Aula 4.</strong> Gráficos e um resumo mensal pronto.</li>
    </ol>
  );
}

function VisualSistema() {
  const etapas = ["Conversa", "Proposta escrita", "Entrada de 50%", "Entrega por etapas"];
  return (
    <ol className="m-0 grid list-none gap-2 p-0">
      {etapas.map((e, i) => (
        <li className="rounded-pequeno border border-linha px-4 py-3 font-semibold" key={e}>
          <span className="font-mono text-destaque">{i + 1}. </span>
          {e}
        </li>
      ))}
    </ol>
  );
}

const visuais: Record<string, () => ReactNode> = {
  planilhas: VisualPlanilha,
  paineis: VisualPainel,
  automacao: VisualAutomacao,
  "landing-page": VisualLanding,
  aulas: VisualAulas,
  sistema: VisualSistema,
};

function Bloco({ e }: { e: Exemplo }) {
  const Visual = visuais[e.id];
  const servico = servicoPorId(e.servicoId);
  const mensagem = `Quero algo como o exemplo "${e.rotulo}"${servico && servico.nome !== e.rotulo ? ` (${servico.nome})` : ""}.`;
  return (
    <section className="border-t border-linha target:bg-realce" id={e.id} aria-labelledby={`${e.id}-titulo`}>
      <p className="mb-2 font-mono text-[0.875rem] font-bold text-destaque">{e.rotulo}</p>
      <h2 id={`${e.id}-titulo`}>{e.titulo}</h2>
      <CopiarLink id={e.id} />
      <div className="grid gap-9 tab:grid-cols-2 tab:items-start">
        <div>
          <h3 className="mt-0 mb-2 font-texto text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave first:mt-0">{t.problemaRotulo}</h3>
          <p>{e.problema}</p>
          <h3 className="mt-4 mb-2 font-texto text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave first:mt-0">{t.colaboraRotulo}</h3>
          <ul className="my-[1em] list-disc pl-[40px]">
            {e.colabora.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p>
            <a
              className={botaoCheio}
              href={linkContato(`como-funciona-${e.id}`, mensagem)}
              target="_blank"
              rel="noopener"
            >
              {t.pedir}
            </a>
          </p>
        </div>
        <Quadro legenda={`${t.exemploRotulo}: ${e.exemplo}`}>
          <Visual />
        </Quadro>
      </div>
    </section>
  );
}

function ComoFunciona() {
  return (
    <>
      <CabecalhoNegocios />
      <main id="conteudo">
        <section className="pb-9">
          <h1 className="max-w-[20ch] text-[clamp(2rem,7.5vw,3.6rem)] tracking-[-0.01em]">{t.titulo}</h1>
          <p className="text-[1.1rem] text-texto-suave">{t.intro}</p>
          <nav aria-label={t.indice} className="mt-6">
            <p className="mb-2 text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave">{t.indice}</p>
            <ul className="m-0 flex list-none flex-wrap gap-x-3 gap-y-2 p-0">
              {exemplos.map((e) => (
                <li key={e.id}>
                  <a
                    className="inline-flex min-h-alvo items-center rounded-full border border-texto px-4 font-semibold no-underline hover:bg-realce active:bg-realce"
                    href={`#${e.id}`}
                  >
                    {e.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>
        {exemplos.map((e) => (
          <Bloco key={e.id} e={e} />
        ))}
      </main>
      <Rodape ponte={{ ...negocios.ponte, href: "/comunidade/" }}>
        <ContatoRodape origem="como-funciona-rodape" />
      </Rodape>
    </>
  );
}

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <ComoFunciona />
  </StrictMode>,
);
