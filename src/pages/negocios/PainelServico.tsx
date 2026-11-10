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
const pilula =
  "relative flex min-h-alvo cursor-pointer items-center gap-2 rounded-pequeno border border-linha px-3 py-1.5 text-[0.95rem] hover:bg-realce has-checked:border-destaque has-checked:bg-destaque has-checked:text-destaque-texto has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-foco";
const botaoLink =
  "inline-flex min-h-alvo cursor-pointer items-center border-0 bg-transparent px-1 font-[inherit] text-[0.9rem] font-semibold text-destaque underline underline-offset-4";

/** Preço extra (ou do formato) que a opção mostra dentro do botão. */
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
  const dica = [
    multipla ? t.marqueQuantas : null,
    multipla && muda && p.gratis !== undefined
      ? `${t.incluso(p.gratis)} ${t.cadaExtra(brl((p.horasPorExtra ?? 0) * VALOR_HORA_EXTRA))}`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-1 w-full p-0 font-bold">
        {p.texto}
        {muda && <span className="ml-2 border border-destaque px-1.5 font-mono text-[0.72rem] font-normal text-destaque">{t.mudaValorCurto}</span>}
        <button
          type="button"
          className={`${botaoLink} ml-1 align-middle`}
          aria-expanded={ajudaAberta}
          aria-controls={`${base}-ajuda`}
          onClick={() => setAjudaAberta((a) => !a)}
        >
          {t.oQueEIsso}
        </button>
      </legend>
      <p id={`${base}-ajuda`} hidden={!ajudaAberta} className="mb-2 border-l-[3px] border-destaque bg-realce px-3 py-2 text-[0.9rem]">
        {p.ajuda}
      </p>
      {dica && <p className="mb-2 font-mono text-[0.78rem] text-texto-suave">{dica}</p>}
      <div className="flex flex-wrap gap-2">
        {p.opcoes.map((o) => {
          const custo = custoDaOpcao(servicoId, p, o.id);
          return (
            <label key={o.id} className={pilula}>
              <input
                className={escondido}
                type={multipla ? "checkbox" : "radio"}
                name={`${servicoId}-${p.id}`}
                value={o.id}
                checked={marcadas.includes(o.id)}
                onChange={() => aoResponder(p.id, o.id)}
              />
              <span>{o.rotulo}</span>
              {custo && <span className="font-mono text-[0.78rem] opacity-75">{custo}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

type PerguntasProps = {
  modelo: ServicoOrcamento;
  respostas: Respostas;
  aoResponder: (perguntaId: string, opcaoId: string) => void;
};

/** Passo 2: resumo curto do serviço, o que inclui (recolhido) e as perguntas. */
export function PainelPerguntas({ modelo, respostas, aoResponder }: PerguntasProps) {
  return (
    <div>
      <h4 className="mb-1 text-[1.2rem] font-bold">{modelo.nome}</h4>
      <p className="mb-2 text-[0.95rem] text-texto-suave">{modelo.resumo}</p>
      <details className="mb-5 text-[0.95rem]">
        <summary className="min-h-alvo cursor-pointer py-2 font-semibold text-destaque">{t.inclui}</summary>
        <ul className="mt-1 mb-2 list-disc pl-5">
          {modelo.inclui.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {modelo.notas.map((n) => (
          <p key={n} className="mb-1 text-[0.9rem] text-texto-suave">
            {n}
          </p>
        ))}
      </details>
      <div className="grid gap-5">
        {modelo.perguntas.map((p) => (
          <PerguntaCampo key={p.id} servicoId={modelo.id} pergunta={p} respostas={respostas} aoResponder={aoResponder} />
        ))}
      </div>
    </div>
  );
}

// Estimativa -----------------------------------------------------------------------------

const precoGrande = "[word-spacing:-0.3em] font-mono text-[clamp(1.9rem,7vw,2.4rem)] leading-none font-bold tracking-[-0.02em]";

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
      {prefixo && <p className="mb-1 text-[0.9rem] text-texto-suave">{prefixo}</p>}
      <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {comPiloto && (
          <s className="font-mono text-[1.1rem] text-texto-suave">
            <span className="sr-only">{e.tabela}</span>
            {brl(c.preco)}
          </s>
        )}
        <span className={`${precoGrande} ${comPiloto ? "text-destaque" : ""}`}>
          {brl(comPiloto ? comDesconto(c.preco, comPiloto.percentual) : c.preco)}
        </span>
      </p>
      {comPiloto && (
        <p className="mt-2 mb-0 text-[0.85rem]">
          {e.comPiloto(comPiloto.percentual, comPiloto.restam)} <span className="text-texto-suave">{pilotoNota}</span>
        </p>
      )}
    </div>
  );
}

type EstimativaProps = {
  modelo: ServicoOrcamento;
  respostas: Respostas;
  noCarrinho: boolean;
  aoAlternar: () => void;
};

/** Estimativa do serviço aberto: valor, prazo, botão de adicionar e a conta (recolhida). */
export function PainelEstimativa({ modelo, respostas, noCarrinho, aoAlternar }: EstimativaProps) {
  const c = calcularServico(modelo.id, respostas);
  if (!c) return null;

  return (
    <div className="border-2 border-texto p-4">
      <p className="mb-1 font-mono text-[0.78rem] tracking-[0.08em] text-texto-suave uppercase">
        {e.titulo} · {modelo.nome}
      </p>
      <div aria-live="polite" aria-atomic="true">
        <Valor c={c} />
      </div>

      <dl className="my-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-[0.9rem]">
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

      {c.linhas.length > 0 && (
        <details className="mb-3 text-[0.9rem]">
          <summary className="min-h-alvo cursor-pointer py-2 font-semibold text-destaque">{e.comoChegamos}</summary>
          <ul className="m-0 list-none p-0">
            {c.linhas.map((l, i) => (
              <li key={l.rotulo} className="flex items-baseline justify-between gap-4 border-b border-linha py-1">
                <span>
                  {l.rotulo}
                  {i > 0 && l.horas > 0 && <span className="text-texto-suave"> ({horasTexto(l.horas)})</span>}
                </span>
                <span className="shrink-0 font-mono">{i === 0 ? brl(l.valor) : `+ ${brl(l.valor)}`}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <button type="button" className={`${botaoCheio} w-full cursor-pointer justify-center font-[inherit]`} onClick={aoAlternar}>
        {noCarrinho ? e.tirar : e.adicionar}
      </button>
      {c.aPartirDe && <p className="mt-2 mb-0 text-[0.82rem] text-texto-suave">{e.notaAPartirDe}</p>}
      <p className="mt-2 mb-0 text-[0.82rem] text-texto-suave">
        {c.preco === null ? e.consulta : c.estimativa ? e.notaBot : c.tipoPreco === "aula" ? "" : e.notaEstimativa}
      </p>
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
