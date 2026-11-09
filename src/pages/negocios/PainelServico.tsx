import { useId, useState } from "react";
import { VALOR_HORA_EXTRA } from "../../content/orcamento";
import type { Pergunta, ServicoOrcamento } from "../../content/perguntas";
import { servicoPorId } from "../../content/servicos";
import { orcamento, pilotoNota } from "../../content/textos";
import { botaoCheio } from "../../shared/estilos";
import { brl, horasTexto } from "../../shared/lib/formato";
import {
  calcularServico,
  comDesconto,
  descontoPilotoAtual,
  mudaOValor,
  opcoesMarcadas,
  type CalculoServico,
  type Respostas,
} from "../../shared/lib/orcamento";

const t = orcamento.painel;
const e = orcamento.estimativa;
const piloto = descontoPilotoAtual();

const escondido = "pointer-events-none absolute top-0 left-0 size-px overflow-hidden opacity-0";
const opcaoClasse =
  "group relative flex min-h-alvo cursor-pointer items-center gap-3 border border-linha px-3 py-2 hover:bg-realce has-checked:border-destaque has-checked:bg-realce has-checked:shadow-[inset_3px_0_0_var(--color-destaque)] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-foco";
const marcaBase =
  "grid size-5 shrink-0 place-items-center border border-texto-suave group-has-checked:border-destaque group-has-checked:bg-destaque";

/** Preço extra (ou do formato) que a opção mostra à direita. */
function custoDaOpcao(servicoId: string, p: Pergunta, opcaoId: string): string | null {
  if (p.formato) {
    const preco = servicoPorId(servicoId)?.preco;
    if (preco?.tipo !== "aula") return null;
    return opcaoId === "pacote" ? brl(preco.pacote.valor) : `${brl(preco.porHora)}/h`;
  }
  const horas = p.opcoes.find((o) => o.id === opcaoId)?.horas ?? 0;
  return p.tipo === "unica" && horas > 0 ? t.custo(brl(horas * VALOR_HORA_EXTRA)) : null;
}

type PerguntaProps = {
  servicoId: string;
  pergunta: Pergunta;
  respostas: Respostas;
  aoResponder: (perguntaId: string, opcaoId: string) => void;
};

function PerguntaCampo({ servicoId, pergunta: p, respostas, aoResponder }: PerguntaProps) {
  const base = useId();
  const [ajudaAberta, setAjudaAberta] = useState(false);
  const marcadas = opcoesMarcadas(p, respostas);
  const multipla = p.tipo === "multipla";
  const muda = mudaOValor(p);

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-1 w-full p-0 text-[1.05rem] font-bold">{p.texto}</legend>
      <p className="mb-1 font-mono text-[0.8rem] text-texto-suave">
        {muda ? t.mudaValor : t.naoMudaValor}
        {multipla && ` ${t.marqueQuantas}`}
      </p>
      {multipla && muda && p.gratis !== undefined && (
        <p className="mb-1 font-mono text-[0.8rem] text-texto-suave">
          {t.incluso(p.gratis)} {t.cadaExtra(brl((p.horasPorExtra ?? 0) * VALOR_HORA_EXTRA))}
        </p>
      )}
      <button
        type="button"
        className="-ml-1 mb-1 inline-flex min-h-alvo cursor-pointer items-center border-0 bg-transparent px-1 font-[inherit] text-[0.95rem] font-semibold text-destaque underline underline-offset-4"
        aria-expanded={ajudaAberta}
        aria-controls={`${base}-ajuda`}
        onClick={() => setAjudaAberta((a) => !a)}
      >
        {t.oQueEIsso}
      </button>
      <p id={`${base}-ajuda`} hidden={!ajudaAberta} className="mb-3 border-l-[3px] border-destaque bg-realce px-3 py-2 text-[0.95rem]">
        {p.ajuda}
      </p>
      <div className="grid gap-2">
        {p.opcoes.map((o) => {
          const custo = custoDaOpcao(servicoId, p, o.id);
          return (
            <label key={o.id} className={opcaoClasse}>
              <input
                className={escondido}
                type={multipla ? "checkbox" : "radio"}
                name={`${servicoId}-${p.id}`}
                value={o.id}
                checked={marcadas.includes(o.id)}
                onChange={() => aoResponder(p.id, o.id)}
              />
              <span className={`${marcaBase} ${multipla ? "rounded-[2px]" : "rounded-full"}`} aria-hidden="true">
                <svg className="size-3 text-destaque-texto opacity-0 group-has-checked:opacity-100" viewBox="0 0 12 12">
                  <path d="M2 6.5l3 3 5-6.5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <span className="flex-1">{o.rotulo}</span>
              {custo && <span className="font-mono text-[0.85rem] text-texto-suave">{custo}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// Estimativa -----------------------------------------------------------------------------

const precoGrande = "[word-spacing:-0.3em] font-mono text-[clamp(2.2rem,8vw,3rem)] leading-none font-bold tracking-[-0.02em]";

/** O piloto só vale na criação: nunca em aulas nem no sob consulta. */
const temPiloto = (c: CalculoServico) => piloto !== null && c.preco !== null && c.tipoPreco !== "aula";

function Valor({ c }: { c: CalculoServico }) {
  if (c.preco === null) return <p className={`m-0 ${precoGrande}`}>{e.sobConsulta}</p>;

  if (c.tipoPreco === "aula") {
    return (
      <p className="m-0">
        <span className={precoGrande}>{brl(c.preco)}</span>
        <span className="ml-2 text-texto-suave">{c.formatoAula === "avulsa" ? e.porHora : c.linhas[0]?.rotulo.toLowerCase()}</span>
      </p>
    );
  }

  const prefixo = c.aPartirDe ? e.aPartirDe : c.estimativa ? e.estimativaBot : null;
  const comPiloto = temPiloto(c) && piloto;
  return (
    <div>
      {prefixo && <p className="mb-1 text-[0.95rem] text-texto-suave">{prefixo}</p>}
      <p className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {comPiloto && (
          <s className="font-mono text-[1.25rem] text-texto-suave">
            <span className="sr-only">{e.tabela}</span>
            {brl(c.preco)}
          </s>
        )}
        <span className={`${precoGrande} ${comPiloto ? "text-destaque" : ""}`}>
          {brl(comPiloto ? comDesconto(c.preco, comPiloto.percentual) : c.preco)}
        </span>
      </p>
      {comPiloto && (
        <p className="mt-3 mb-0 text-[0.9rem]">
          {e.comPiloto(comPiloto.percentual, comPiloto.restam)} <span className="text-texto-suave">{pilotoNota}</span>
        </p>
      )}
    </div>
  );
}

function Estimativa({ c }: { c: CalculoServico }) {
  return (
    <div className="border-t-2 border-texto pt-5">
      <p className="mb-1 font-mono text-[0.8rem] tracking-[0.08em] text-texto-suave uppercase">{e.titulo}</p>

      {c.linhas.length > 0 && (
        <>
          <h4 className="mb-2 text-[1rem] font-bold">{e.comoChegamos}</h4>
          <ul className="m-0 mb-5 list-none p-0 text-[0.95rem]">
            {c.linhas.map((l, i) => (
              <li key={l.rotulo} className="flex items-baseline justify-between gap-4 border-b border-linha py-1.5">
                <span>
                  {l.rotulo}
                  {i > 0 && l.horas > 0 && <span className="text-texto-suave"> ({horasTexto(l.horas)})</span>}
                </span>
                <span className="shrink-0 font-mono">{i === 0 ? brl(l.valor) : `+ ${brl(l.valor)}`}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div aria-live="polite" aria-atomic="true">
        <Valor c={c} />
      </div>

      <dl className="my-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 border-y border-linha py-3 text-[0.95rem]">
        {c.horas !== null && (
          <>
            <dt className="font-semibold">{e.horas}</dt>
            <dd className="m-0 text-right font-mono">{horasTexto(c.horas)}</dd>
          </>
        )}
        <dt className="font-semibold">{e.prazo}</dt>
        <dd className="m-0 text-right font-mono">{c.prazo}</dd>
        {c.mensalidade !== null && (
          <>
            <dt className="font-semibold">{e.mensalidade}</dt>
            <dd className="m-0 text-right font-mono">{e.valorMensalidade(brl(c.mensalidade))}</dd>
          </>
        )}
      </dl>

      {c.aPartirDe && <p className="text-[0.9rem] text-texto-suave">{e.notaAPartirDe}</p>}
      <p className="text-[0.9rem] text-texto-suave">
        {c.preco === null ? e.consulta : c.estimativa ? e.notaBot : c.tipoPreco === "aula" ? "" : e.notaEstimativa}
      </p>
    </div>
  );
}

// Painel ---------------------------------------------------------------------------------

type Props = {
  modelo: ServicoOrcamento;
  respostas: Respostas;
  noCarrinho: boolean;
  aoResponder: (perguntaId: string, opcaoId: string) => void;
  aoAlternar: () => void;
};

/** Painel do serviço: resumo, perguntas e estimativa. */
export function PainelServico({ modelo, respostas, noCarrinho, aoResponder, aoAlternar }: Props) {
  const calculo = calcularServico(modelo.id, respostas);
  if (!calculo) return null;

  return (
    <div>
      <p className="mb-1 font-mono text-[0.85rem] text-texto-suave">{modelo.numero}</p>
      <h3 id="orc-foco-servico" tabIndex={-1} className="mb-3 text-[1.6rem] focus:outline-none">
        {modelo.nome}
      </h3>
      <p className="mb-4 text-texto-suave">{modelo.resumo}</p>

      <h4 className="mb-2 text-[1rem] font-bold">{t.inclui}</h4>
      <ul className="mb-4 list-disc pl-5 text-[0.95rem]">
        {modelo.inclui.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {modelo.notas.map((n) => (
        <p key={n} className="mb-2 text-[0.9rem] text-texto-suave">
          {n}
        </p>
      ))}

      <div className="mt-8 grid gap-8">
        <h4 className="m-0 text-[1.15rem] font-bold">{t.perguntas}</h4>
        {modelo.perguntas.map((p) => (
          <PerguntaCampo key={p.id} servicoId={modelo.id} pergunta={p} respostas={respostas} aoResponder={aoResponder} />
        ))}
      </div>

      <div className="mt-10">
        <Estimativa c={calculo} />
        <button
          type="button"
          className={`${botaoCheio} w-full cursor-pointer justify-center font-[inherit]`}
          onClick={aoAlternar}
        >
          {noCarrinho ? e.tirar : e.adicionar}
        </button>
      </div>
    </div>
  );
}

/** Preço curto da barra fixa do celular: o de hoje, com piloto quando valer. */
export function precoDaBarra(c: CalculoServico): string {
  if (c.preco === null) return e.sobConsulta;
  const valor = temPiloto(c) && piloto ? comDesconto(c.preco, piloto.percentual) : c.preco;
  const prefixo = c.aPartirDe ? `${e.aPartirDe} ` : c.estimativa ? `${e.estimativaBot} ` : "";
  return `${prefixo}${brl(valor)}${c.formatoAula === "avulsa" ? "/h" : ""}`;
}
