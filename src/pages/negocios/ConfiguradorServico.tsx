import { useEffect, useRef, useState } from "react";
import { VALOR_HORA_EXTRA } from "../../content/orcamento";
import type { Pergunta, ServicoOrcamento } from "../../content/perguntas";
import { orcamento } from "../../content/textos";
import { Dica } from "../../shared/components/Dica";
import { brl } from "../../shared/lib/formato";
import { horasExtrasDa, mudaOValor, opcoesMarcadas, perguntasVisiveisComNivel, todasAsPerguntas, type Respostas } from "../../shared/lib/orcamento";
import type { Progresso } from "../../shared/lib/pedido";
import { IconeCheck } from "./icones";

const t = orcamento.painel;

const escondido = "peer sr-only";
const opcaoBase =
  "group relative flex min-h-alvo cursor-pointer items-start gap-3 rounded-pequeno border border-linha bg-superficie px-3 py-3 text-[1rem] leading-snug transition-colors hover:border-texto-suave hover:bg-realce active:bg-realce has-checked:border-destaque has-checked:bg-realce has-checked:shadow-[inset_0_0_0_1px_var(--color-destaque)] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-foco";
const marcaBase =
  "mt-px grid size-6 shrink-0 place-items-center border-2 border-texto-suave text-destaque-texto peer-checked:border-destaque peer-checked:bg-destaque [&_svg]:opacity-0 peer-checked:[&_svg]:opacity-100";

/** Preço extra que a opção mostra ao lado do texto. */
function custoDaOpcao(p: Pergunta, opcaoId: string): string | null {
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
  const marcadas = opcoesMarcadas(p, respostas);
  const multipla = p.tipo === "multipla";
  const muda = mudaOValor(p);
  const acrescimo = horasExtrasDa(p, respostas) * VALOR_HORA_EXTRA;
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
        <span className="min-w-0 flex-1 self-center">{p.texto}</span>
        <span className="-my-2 -mr-1.5 flex shrink-0 items-center">
          <Dica texto={p.ajuda} rotulo={t.ajudaRotulo(p.texto)} />
        </span>
        {marcadas.length > 0 && (
          <span className="shrink-0 self-center text-destaque">
            <IconeCheck />
            <span className="sr-only">respondida</span>
          </span>
        )}
      </legend>
      {orientacao && <p className="mb-2 text-[0.875rem] text-texto-suave">{orientacao}</p>}
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))] gap-2.5">
        {p.opcoes.map((o) => {
          const custo = custoDaOpcao(p, o.id);
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
                <IconeCheck className="size-4" />
              </span>
              <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{o.rotulo}</span>
              {custo && <span className="shrink-0 pl-2 font-mono text-[0.875rem] whitespace-nowrap text-texto-suave">{custo}</span>}
            </label>
          );
        })}
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4">
        <p className="m-0 font-mono text-[0.875rem] text-texto-suave" aria-live="polite">
          {acrescimo > 0 ? <span className="text-destaque">{t.somaAgora(brl(acrescimo))}</span> : muda ? t.mudaValorCurto : null}
        </p>
      </div>
    </fieldset>
  );
}

function ProgressoConfiguracao({ progresso: p }: { progresso: Progresso }) {
  if (p.total === 0) return <p className="m-0 text-[1rem] text-texto-suave">{t.semPerguntas}</p>;
  return (
    <div>
      <p className="m-0 font-mono text-[0.875rem] font-bold" role="status">
        {t.progresso(p.respondidas, p.total)}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1" aria-hidden="true">
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
};

/** Corpo da aba Orçamento: o progresso e as perguntas. O nome, o resumo e a estimativa ficam no modal. */
export function ConfiguradorServico({ modelo, respostas, progresso, aoResponder }: Props) {
  const visiveis = perguntasVisiveisComNivel(modelo.perguntas, respostas);
  const chave = visiveis.map((v) => v.pergunta.id).join("|");
  const anteriores = useRef<Set<string> | null>(null);
  const [aviso, setAviso] = useState("");
  const [novas, setNovas] = useState<Set<string>>(new Set());

  // Perguntas que acabaram de abrir: animam por pouco tempo e são anunciadas, sem mover o foco.
  useEffect(() => {
    const atuais = new Set(visiveis.map((v) => v.pergunta.id));
    const antes = anteriores.current;
    anteriores.current = atuais;
    if (!antes) return;
    const abertas = visiveis.filter((v) => !antes.has(v.pergunta.id));
    setNovas(new Set(abertas.map((v) => v.pergunta.id)));
    if (abertas.length === 0) {
      setAviso("");
      return;
    }
    const pai = todasAsPerguntas(modelo.perguntas).find((q) => q.id === abertas[0].paiId);
    setAviso(t.novasPerguntas(abertas.length, pai?.curto.toLowerCase() ?? ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  return (
    <div>
      <div className="mb-5 grid gap-1">
        <ProgressoConfiguracao progresso={progresso} />
        {progresso.total > 0 && <p className="m-0 text-[0.875rem] text-texto-suave">{t.legendaValor}</p>}
      </div>

      <div className="grid gap-6">
        {visiveis.map(({ pergunta: p, nivel }) => (
          <div
            key={p.id}
            className={`${nivel > 0 ? "ml-2 border-l-[3px] border-linha pl-3 md:ml-4 md:pl-4" : ""} ${novas.has(p.id) ? "pergunta-nova" : ""}`}
          >
            <PerguntaCampo servicoId={modelo.id} pergunta={p} respostas={respostas} aoResponder={aoResponder} />
          </div>
        ))}
      </div>
      <p className="sr-only" role="status">
        {aviso}
      </p>
    </div>
  );
}
