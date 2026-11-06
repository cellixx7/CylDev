import { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/base.css";
import "../../styles/negocios.css";
import { negocios as t } from "../../content/textos";
import { CabecalhoNegocios } from "../../shared/components/CabecalhoNegocios";
import { Rodape } from "../../shared/components/Rodape";

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
      el.style.color = `color-mix(in srgb, var(--cor-destaque) ${Math.round(p * 100)}%, var(--cor-texto))`;
    };
    const passo = (agora: number) => {
      const p = Math.min(Math.max((agora - t0) / duracao, 0), 1);
      const suave = 1 - Math.pow(1 - p, 3);
      if (p < 1) {
        pintar(suave);
        quadro = requestAnimationFrame(passo);
      } else {
        el.textContent = valor;
        el.style.color = "var(--cor-destaque)";
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

  return <strong className="painel__valor" ref={ref}>{valor}</strong>;
}

function SetaSobre({ className }: { className: string }) {
  return (
    <a className={`seta-sobre ${className}`} href="#sobre" aria-label="Ir para a seção Sobre">
      <span className="seta-sobre__texto">Sobre</span>
      <svg className="seta-sobre__icone" viewBox="0 0 32 18" width="32" height="18" aria-hidden="true">
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
      <main id="conteudo">
        <section className="apresentacao" id="apresentacao">
          <div className="apresentacao__grade">
            <div className="apresentacao__conteudo">
              <h1 className="apresentacao__titulo">{t.apresentacao.titulo}</h1>
              <p className="apresentacao__subtitulo">{t.apresentacao.subtitulo}</p>
              <p className="apresentacao__texto">{t.apresentacao.texto}</p>
              <div className="apresentacao__acoes">
                <a className="botao botao--cheio" href="#orcamento">
                  {t.apresentacao.botaoOrcamento}
                </a>
                <a className="botao" href="/negocios/como-funciona/">
                  {t.apresentacao.botaoComoFunciona}
                </a>
              </div>
              <SetaSobre className="seta-sobre--celular" />
            </div>
            <figure className="painel" aria-label={painel.rotulo}>
              <figcaption className="painel__cabecalho">
                <span className="painel__selo">{painel.selo}</span>
                <span className="painel__titulo">{painel.titulo}</span>
                <span className="painel__periodo">{painel.periodo}</span>
                <span className="painel__descricao">{painel.descricao}</span>
              </figcaption>
              <div className="painel__indicadores">
                {painel.indicadores.map((i, idx) => (
                  <div className="painel__cartao" key={i.nome}>
                    <span className="painel__nome">{i.nome}</span>
                    <ValorAnimado valor={i.valor} variacao={i.variacao} atraso={350 + idx * 100} />
                    <span className="painel__variacao">{i.variacao}</span>
                  </div>
                ))}
              </div>

              <div className="painel__cartao">
                <span className="painel__nome">{painel.mensalTitulo}</span>
                <div className="painel__meses" role="img" aria-label={painel.mensalTitulo}>
                  {painel.meses.map((m) => (
                    <div className="painel__mes" key={m.nome}>
                      <span className="painel__mes-valor">{m.valor}</span>
                      <div className="painel__barra" style={{ height: `${(m.valor / maxMes) * 100}%` }} />
                      <span>{m.nome}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="painel__duplo">
                <div className="painel__cartao">
                  <span className="painel__nome">{painel.categoriasTitulo}</span>
                  <div className="painel__pizza-area">
                    <div
                      className="painel__pizza"
                      role="img"
                      aria-label={painel.categoriasTitulo}
                      style={{ background: pizza }}
                    />
                    <ul className="painel__legenda">
                      {painel.categorias.map((c, i) => (
                        <li key={c.nome}>
                          <span className="painel__cor" style={{ background: cores[i % cores.length] }} />
                          {c.nome} <strong>{Math.round((c.valor / totalCategorias) * 100)}%</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="painel__cartao">
                  <span className="painel__nome">{painel.regioesTitulo}</span>
                  <ul className="painel__regioes">
                    {painel.regioes.map((r) => (
                      <li key={r.nome}>
                        <span className="painel__regiao-nome">{r.nome}</span>
                        <span className="painel__trilho">
                          <span className="painel__preenchimento" style={{ width: `${(r.valor / maxRegiao) * 100}%` }} />
                        </span>
                        <strong>{r.valor}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </figure>
          </div>
          <SetaSobre className="seta-sobre--pc" />
        </section>
        <section className="orcamento" id="orcamento">
          <h2>Orçamento</h2>
        </section>
        <section className="entregas" id="entregas"></section>
        <section className="como" id="como-funciona"></section>
        <section className="sobre" id="sobre"></section>
        <section className="contato" id="contato"></section>
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
