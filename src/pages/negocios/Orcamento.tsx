import { useState } from "react";
import { complexidades, type Complexidade } from "../../content/orcamento";
import { servicos, type Servico } from "../../content/servicos";
import { orcamento as t, pilotoNota } from "../../content/textos";
import { Formulario } from "../../shared/components/Formulario";
import { textoPreco } from "../../shared/components/Catalogo";
import { botaoCheio } from "../../shared/estilos";
import { brl, horasTexto } from "../../shared/lib/formato";
import {
  comDesconto,
  descontoPilotoAtual,
  estimar,
  resumoOrcamento,
  type FormatoAula,
} from "../../shared/lib/orcamento";
import { formatarPrazo } from "../../shared/lib/prazo";
import { linkContato } from "../../shared/lib/whatsapp";

const pacotes = servicos.filter((s) => s.area === "negocios" && s.disponivel);
const desconto = descontoPilotoAtual();
const tamanhos = Object.keys(complexidades) as Complexidade[];

const legenda = "mb-3 p-0 font-titulo text-[1.15rem] font-bold";
const opcaoSegmentada =
  "flex min-h-alvo flex-1 cursor-pointer items-center justify-center border-r border-texto px-3 py-2 text-center font-semibold last:border-r-0 has-checked:bg-texto has-checked:text-fundo has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-foco";
const escondido = "absolute size-px overflow-hidden opacity-0";

/** Preço curto na lista de pacotes: as aulas mostram só o valor da hora. */
function precoNaLista(s: Servico): string {
  return s.preco.tipo === "aula" ? `${brl(s.preco.porHora)}/h` : textoPreco(s.preco);
}

/** Pacote, tamanho e estimativa em texto, para o e-mail do formulário. */
function detalhesDoPedido(s: Servico, tamanho: Complexidade, formatoAula: FormatoAula) {
  const e = estimar(s, tamanho);
  if (s.preco.tipo === "aula") {
    const pacote = formatoAula === "pacote";
    return {
      pacote: s.nome,
      tamanho: "—",
      estimativa: pacote ? `${brl(s.preco.pacote.valor)} (${s.preco.pacote.aulas} aulas)` : `${brl(s.preco.porHora)} por hora`,
    };
  }
  if (!e) return { pacote: s.nome, tamanho: "—", estimativa: textoPreco(s.preco) };
  return {
    pacote: s.nome,
    tamanho: complexidades[tamanho].rotulo,
    estimativa: `${e.aPartirDe ? "a partir de " : ""}${brl(e.preco)}`,
  };
}

export function Orcamento() {
  const [servicoId, setServicoId] = useState("painel");
  const [tamanho, setTamanho] = useState<Complexidade>("basico");
  const [formatoAula, setFormatoAula] = useState<FormatoAula>("pacote");

  const s = pacotes.find((p) => p.id === servicoId) ?? pacotes[0];
  const estimativa = estimar(s, tamanho);
  const resumo = resumoOrcamento(s, tamanho, formatoAula, desconto);
  const origem = `negocios-orcamento-${s.id}`;

  return (
    <section className="mx-auto max-w-hero px-margem py-14" id="orcamento" aria-labelledby="orcamento-titulo">
      <span className="mb-5 block h-[3px] w-12 bg-destaque" aria-hidden="true" />
      <h2 id="orcamento-titulo">{t.titulo}</h2>
      <p className="max-w-[40rem] text-texto-suave">{t.intro}</p>

      <div className="mt-8 grid gap-12 pc:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] pc:items-start pc:gap-[clamp(2rem,5vw,5rem)]">
        <div className="grid gap-10">
          <fieldset className="m-0 border-0 p-0">
            <legend className={legenda}>{t.passoServico}</legend>
            <div className="border-t-2 border-texto">
              {pacotes.map((p) => (
                <label
                  key={p.id}
                  className="flex min-h-alvo cursor-pointer items-baseline gap-3 border-b border-linha px-2 py-3 hover:bg-realce has-checked:bg-realce has-checked:shadow-[inset_3px_0_0_var(--color-destaque)]"
                >
                  <input
                    className="translate-y-[2px] accent-destaque"
                    type="radio"
                    name="orcamento-servico"
                    value={p.id}
                    checked={p.id === s.id}
                    onChange={() => setServicoId(p.id)}
                  />
                  <span className="flex-1 font-semibold">{p.nome}</span>
                  <span className="text-right font-mono text-[0.9rem] text-texto-suave">{precoNaLista(p)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {estimativa && (
            <fieldset className="m-0 border-0 p-0">
              <legend className={legenda}>{t.passoTamanho}</legend>
              <div className="flex rounded-pequeno border border-texto">
                {tamanhos.map((c) => (
                  <label key={c} className={opcaoSegmentada}>
                    <input
                      className={escondido}
                      type="radio"
                      name="orcamento-tamanho"
                      value={c}
                      checked={c === tamanho}
                      onChange={() => setTamanho(c)}
                    />
                    {complexidades[c].rotulo}
                  </label>
                ))}
              </div>
              <p className="mt-3 mb-0 text-[0.95rem] text-texto-suave">{t.tamanhos[tamanho]}</p>
            </fieldset>
          )}

          {s.preco.tipo === "aula" && (
            <fieldset className="m-0 border-0 p-0">
              <legend className={legenda}>{t.passoAula}</legend>
              <div className="flex rounded-pequeno border border-texto">
                {(["pacote", "avulsa"] as const).map((f) => (
                  <label key={f} className={opcaoSegmentada}>
                    <input
                      className={escondido}
                      type="radio"
                      name="orcamento-aula"
                      value={f}
                      checked={f === formatoAula}
                      onChange={() => setFormatoAula(f)}
                    />
                    {f === "pacote" && s.preco.tipo === "aula" ? t.aulaPacote(s.preco.pacote.aulas) : t.aulaAvulsa}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>

        <div>
          <div className="border-t-2 border-texto pt-5">
            <p className="mb-1 font-mono text-[0.8rem] tracking-[0.08em] text-texto-suave uppercase">{t.estimativa}</p>
            <h3 className="mb-2 text-[1.5rem]">
              {s.nome}
              {estimativa && <span className="font-normal text-texto-suave"> · {complexidades[tamanho].rotulo}</span>}
            </h3>
            <p className="mb-5 text-[0.95rem] text-texto-suave">{s.resultado}</p>

            <div aria-live="polite">
              <Valor servico={s} formatoAula={formatoAula} preco={estimativa?.preco ?? null} aPartirDe={estimativa?.aPartirDe ?? false} />

              <dl className="my-5 grid grid-cols-[auto_1fr] gap-x-6 border-y border-linha py-3 text-[0.95rem]">
                {estimativa && (
                  <>
                    <dt className="font-semibold">{t.trabalho}</dt>
                    <dd className="m-0 text-right font-mono">{horasTexto(estimativa.horas)}</dd>
                  </>
                )}
                <dt className="font-semibold">{t.prazo}</dt>
                <dd className="m-0 text-right font-mono">
                  {estimativa ? formatarPrazo(estimativa.dias) : (s.prazoTexto ?? "")}
                </dd>
              </dl>
            </div>

            {estimativa?.aPartirDe && <p className="text-[0.9rem] text-texto-suave">{t.notaAPartirDe}</p>}
            <p className="text-[0.9rem] text-texto-suave">{estimativa ? t.notaEstimativa : s.preco.tipo === "sobConsulta" ? t.consulta : ""}</p>

            <a
              className={`${botaoCheio} w-full justify-center sm:w-auto`}
              href={linkContato(origem, resumo)}
              target="_blank"
              rel="noopener"
            >
              {t.enviarWhatsapp}
            </a>
          </div>

          <div className="mt-10 border-t border-linha pt-6">
            <h3 className="mb-1">{t.formularioTitulo}</h3>
            <p className="text-texto-suave">{t.formularioTexto}</p>
            <Formulario origem={origem} resumo={resumo} detalhes={detalhesDoPedido(s, tamanho, formatoAula)} />
          </div>
        </div>
      </div>
    </section>
  );
}

type ValorProps = {
  servico: Servico;
  formatoAula: FormatoAula;
  preco: number | null;
  aPartirDe: boolean;
};

/** Valor em destaque: preço de tabela riscado e preço com desconto de piloto, quando houver vaga. */
function Valor({ servico: s, formatoAula, preco, aPartirDe }: ValorProps) {
  const grande = "font-mono text-[clamp(2.2rem,6vw,3rem)] leading-none font-bold tracking-[-0.02em]";

  if (s.preco.tipo === "aula") {
    const pacote = formatoAula === "pacote";
    return (
      <p className="m-0">
        <span className={grande}>{brl(pacote ? s.preco.pacote.valor : s.preco.porHora)}</span>
        {!pacote && <span className="ml-2 text-texto-suave">{t.porHora}</span>}
      </p>
    );
  }

  if (preco === null) {
    return <p className={`m-0 ${grande}`}>{textoPreco(s.preco)}</p>;
  }

  return (
    <div>
      {aPartirDe && <p className="mb-1 text-[0.95rem] text-texto-suave">{t.aPartirDe}</p>}
      <p className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {desconto && (
          <s className="font-mono text-[1.25rem] text-texto-suave">
            <span className="sr-only">Preço de tabela: </span>
            {brl(preco)}
          </s>
        )}
        <span className={`${grande} ${desconto ? "text-destaque" : ""}`}>
          {brl(desconto ? comDesconto(preco, desconto.percentual) : preco)}
        </span>
      </p>
      {desconto && (
        <p className="mt-3 mb-0 text-[0.9rem]">
          {t.comPiloto(desconto.percentual, desconto.restam)}{" "}
          <span className="text-texto-suave">{pilotoNota}</span>
        </p>
      )}
    </div>
  );
}
