import { StrictMode, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/base.css";
import "../../styles/como-funciona.css";
import { comoFunciona as t, exemplos, type Exemplo } from "../../content/exemplos";
import { servicoPorId } from "../../content/servicos";
import { negocios } from "../../content/textos";
import { CabecalhoNegocios } from "../../shared/components/CabecalhoNegocios";
import { Rodape } from "../../shared/components/Rodape";
import { linkContato } from "../../shared/lib/whatsapp";

const caminho = "/negocios/como-funciona/";

function Ficticio() {
  return <span className="rotulo-ficticio">dados fictícios</span>;
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
    <div className="exemplo__link">
      <a href={`#${id}`} className="exemplo__endereco">
        {`negocios/como-funciona#${id}`}
      </a>
      <button type="button" className="exemplo__copiar" onClick={copiar}>
        {t.copiar}
      </button>
      <span role="status" className="exemplo__aviso">
        {estado === "ok" && t.copiado}
        {estado === "falhou" && t.copiarFalhou}
      </span>
    </div>
  );
}

function Quadro({ legenda, children }: { legenda: string; children: ReactNode }) {
  return (
    <figure className="quadro">
      <figcaption className="quadro__legenda">
        {legenda} <Ficticio />
      </figcaption>
      {children}
    </figure>
  );
}

function VisualPlanilha() {
  return (
    <div className="antes-depois">
      <div>
        <p className="antes-depois__rotulo">Antes</p>
        <table className="mini">
          <tbody>
            <tr><td>maria camisa</td><td>2x 40</td><td>jan</td></tr>
            <tr><td>Camisa - João</td><td>R$ 40,00</td><td>03/01</td></tr>
            <tr><td>cliente?</td><td>80</td><td></td></tr>
            <tr><td colSpan={3}>TOTAL ??? (não bate)</td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <p className="antes-depois__rotulo">Depois</p>
        <table className="mini">
          <thead>
            <tr><th>Data</th><th>Cliente</th><th>Item</th><th>Valor</th></tr>
          </thead>
          <tbody>
            <tr><td>02/01</td><td>Maria</td><td>Camisa</td><td>R$ 80</td></tr>
            <tr><td>03/01</td><td>João</td><td>Camisa</td><td>R$ 40</td></tr>
            <tr className="mini__total"><td colSpan={3}>Total</td><td>R$ 120</td></tr>
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
    <div className="painel">
      <div className="painel__kpis">
        <div><span>Vendas no mês</span><strong>R$ 4.820</strong></div>
        <div><span>Pedidos</span><strong>63</strong></div>
        <div><span>Estoque baixo</span><strong>3 itens</strong></div>
      </div>
      <ul className="painel__barras" aria-label="Itens mais vendidos">
        {barras.map(([nome, v]) => (
          <li key={nome}>
            <span>{nome}</span>
            <span className="painel__trilho"><span style={{ width: `${v}%` }} /></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VisualAutomacao() {
  return (
    <div className="antes-depois">
      <div>
        <p className="antes-depois__rotulo">Antes, toda semana</p>
        <ol className="lista-passos">
          <li>Abrir os 3 arquivos de vendas</li>
          <li>Copiar e colar numa aba só</li>
          <li>Filtrar e apagar o que sobra</li>
          <li>Formatar e conferir os totais</li>
        </ol>
      </div>
      <div>
        <p className="antes-depois__rotulo">Depois</p>
        <p className="botao-falso" aria-hidden="true">Atualizar relatório</p>
        <p className="mini__nota">Um clique faz os quatro passos.</p>
      </div>
    </div>
  );
}

function VisualLanding() {
  return (
    <div className="esboco">
      <p className="esboco__titulo">Studio Lia · Manicure em Brasília</p>
      <p className="esboco__texto">Atendimento com hora marcada, de segunda a sábado.</p>
      <ul className="esboco__precos">
        <li><span>Mão</span><span>R$ 35</span></li>
        <li><span>Pé</span><span>R$ 40</span></li>
        <li><span>Mão e pé</span><span>R$ 70</span></li>
      </ul>
      <p className="botao-falso" aria-hidden="true">Agendar no WhatsApp</p>
    </div>
  );
}

function VisualAulas() {
  return (
    <ol className="lista-passos">
      <li><strong>Aula 1.</strong> Organizar a sua planilha: tabelas e formatação.</li>
      <li><strong>Aula 2.</strong> Fórmulas de soma, média e procura (PROCV).</li>
      <li><strong>Aula 3.</strong> Tabela dinâmica com os seus dados de venda.</li>
      <li><strong>Aula 4.</strong> Gráficos e um resumo mensal pronto.</li>
    </ol>
  );
}

function VisualSistema() {
  const etapas = ["Conversa", "Proposta escrita", "Entrada de 50%", "Entrega por etapas"];
  return (
    <ol className="fluxo">
      {etapas.map((e) => (
        <li key={e}>{e}</li>
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
  const mensagem = `Quero algo como o exemplo "${e.rotulo}"${servico ? ` (${servico.nome})` : ""}.`;
  return (
    <section className="exemplo" id={e.id} aria-labelledby={`${e.id}-titulo`}>
      <p className="exemplo__rotulo">{e.rotulo}</p>
      <h2 id={`${e.id}-titulo`}>{e.titulo}</h2>
      <CopiarLink id={e.id} />
      <div className="exemplo__corpo">
        <div className="exemplo__texto">
          <h3>{t.problemaRotulo}</h3>
          <p>{e.problema}</p>
          <h3>{t.colaboraRotulo}</h3>
          <ul>
            {e.colabora.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p>
            <a
              className="botao botao--cheio"
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
        <section className="intro">
          <h1 className="apresentacao__titulo">{t.titulo}</h1>
          <p className="apresentacao__texto">{t.intro}</p>
          <nav aria-label={t.indice} className="indice">
            <p className="indice__titulo">{t.indice}</p>
            <ul>
              {exemplos.map((e) => (
                <li key={e.id}>
                  <a href={`#${e.id}`}>{e.rotulo}</a>
                </li>
              ))}
            </ul>
          </nav>
        </section>
        {exemplos.map((e) => (
          <Bloco key={e.id} e={e} />
        ))}
      </main>
      <Rodape ponte={{ ...negocios.ponte, href: "/comunidade/" }} />
    </>
  );
}

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <ComoFunciona />
  </StrictMode>,
);
