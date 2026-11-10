import { useId, useState, type ReactNode } from "react";
import { VALOR_HORA_EXTRA } from "../../content/orcamento";
import type { Pergunta, ServicoOrcamento } from "../../content/perguntas";
import { servicoPorId } from "../../content/servicos";
import { orcamento } from "../../content/textos";
import { brl } from "../../shared/lib/formato";
import { horasExtrasDa, mudaOValor, opcoesMarcadas, type Respostas } from "../../shared/lib/orcamento";
import type { Progresso } from "../../shared/lib/pedido";
import { IconeCheck } from "./icones";

const t = orcamento.painel;

const escondido = "peer sr-only";
const opcaoBase =
  "group relative flex min-h-alvo cursor-pointer items-start gap-3 rounded-pequeno border border-linha bg-superficie px-3 py-2.5 text-[0.95rem] leading-snug transition-colors hover:border-texto-suave hover:bg-realce has-checked:border-destaque has-checked:bg-realce has-checked:shadow-[inset_0_0_0_1px_var(--color-destaque)] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-foco";
const marcaBase =
  "mt-0.5 grid size-5 shrink-0 place-items-center border-2 border-texto-suave text-destaque-texto peer-checked:border-destaque peer-checked:bg-destaque [&_svg]:opacity-0 peer-checked:[&_svg]:opacity-100";
const botaoLink =
  "inline-flex min-h-alvo cursor-pointer items-center border-0 bg-transparent px-1 font-[inherit] text-[0.9rem] font-semibold text-destaque underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco";

/** Preço extra (ou do formato) que a opção mostra ao lado do texto. */
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
  const acrescimo = p.formato ? 0 : horasExtrasDa(p, respostas) * VALOR_HORA_EXTRA;
  const orientacao = [
    multipla ? t.marqueQuantas : null,
    multipla && muda && p.gratis !== undefined
      ? `${t.incluso(p.gratis)} ${t.cadaExtra(brl((p.horasPorExtra ?? 0) * VALOR_HORA_EXTRA))}`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-1 flex w-full items-start gap-2 p-0 text-[1.02rem] leading-snug font-bold">
        <span className="min-w-0 flex-1">{p.texto}</span>
        {marcadas.length > 0 && (
          <span className="mt-1 shrink-0 text-destaque">
            <IconeCheck />
            <span className="sr-only">respondida</span>
          </span>
        )}
      </legend>
      {orientacao && <p className="mb-2 text-[0.85rem] text-texto-suave">{orientacao}</p>}
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))] gap-2">
        {p.opcoes.map((o) => {
          const custo = custoDaOpcao(servicoId, p, o.id);
          return (
            <label key={o.id} className={opcaoBase}>
              <input
                className={escondido}
                type={multipla ? "checkbox" : "radio"}
                name={`${servicoId}-${p.id}`}
                value={o.id}
                checked={marcadas.includes(o.id)}
                onChange={() => aoResponder(p.id, o.id)}
              />
              <span className={`${marcaBase} ${multipla ? "" : "rounded-full"}`} aria-hidden="true">
                <IconeCheck className="size-3" />
              </span>
              <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{o.rotulo}</span>
              {custo && <span className="shrink-0 pl-2 font-mono text-[0.82rem] whitespace-nowrap text-texto-suave">{custo}</span>}
            </label>
          );
        })}
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4">
        <p className="m-0 font-mono text-[0.8rem] text-texto-suave" aria-live="polite">
          {acrescimo > 0 ? <span className="text-destaque">{t.somaAgora(brl(acrescimo))}</span> : muda ? t.mudaValorCurto : null}
        </p>
        <button
          type="button"
          className={botaoLink}
          aria-expanded={ajudaAberta}
          aria-controls={`${base}-ajuda`}
          onClick={() => setAjudaAberta((a) => !a)}
        >
          {t.oQueEIsso}
        </button>
      </div>
      <p id={`${base}-ajuda`} hidden={!ajudaAberta} className="mb-1 border-l-[3px] border-destaque bg-realce px-3 py-2 text-[0.9rem]">
        {p.ajuda}
      </p>
    </fieldset>
  );
}

function ProgressoConfiguracao({ progresso: p }: { progresso: Progresso }) {
  if (p.total === 0) return <p className="m-0 text-[0.9rem] text-texto-suave">{t.semPerguntas}</p>;
  return (
    <div>
      <p className="m-0 font-mono text-[0.85rem] font-bold" role="status">
        {t.progresso(p.respondidas, p.total)}
      </p>
      <div className="mt-1.5 flex gap-1" aria-hidden="true">
        {Array.from({ length: p.total }, (_, i) => (
          <span key={i} className={`h-1 w-6 ${i < p.respondidas ? "bg-destaque" : "bg-linha"}`} />
        ))}
      </div>
    </div>
  );
}

type Props = {
  modelo: ServicoOrcamento;
  respostas: Respostas;
  progresso: Progresso;
  aoResponder: (perguntaId: string, opcaoId: string) => void;
  /** Estimativa do serviço, mostrada aqui no celular (no desktop ela fica na lateral). */
  estimativa?: ReactNode;
};

/** Etapa 2: o serviço aberto, o que ele inclui, o progresso e as perguntas. */
export function ConfiguradorServico({ modelo, respostas, progresso, aoResponder, estimativa }: Props) {
  return (
    <div>
      <h4 className="mb-1 text-[1.35rem] leading-tight font-bold">{modelo.nome}</h4>
      <p className="mb-2 max-w-[60ch] text-[0.95rem] text-texto-suave">{modelo.resumo}</p>
      <details className="mb-4 text-[0.95rem]">
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

      <div className="mb-5 grid gap-1 border-t border-linha pt-3">
        <ProgressoConfiguracao progresso={progresso} />
        {progresso.total > 0 && <p className="m-0 text-[0.85rem] text-texto-suave">{t.legendaValor}</p>}
      </div>

      {estimativa && <div className="mb-6 lg:hidden">{estimativa}</div>}

      <div className="grid gap-6">
        {modelo.perguntas.map((p) => (
          <PerguntaCampo key={p.id} servicoId={modelo.id} pergunta={p} respostas={respostas} aoResponder={aoResponder} />
        ))}
      </div>
    </div>
  );
}
