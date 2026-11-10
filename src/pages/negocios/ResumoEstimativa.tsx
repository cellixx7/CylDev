import { orcamento, pilotoNota } from "../../content/textos";
import { botao, botaoCheio } from "../../shared/estilos";
import { brl, horasTexto } from "../../shared/lib/formato";
import { comDesconto, descontoPilotoAtual, type CalculoServico } from "../../shared/lib/orcamento";
import type { EstadoEstimativa, Progresso } from "../../shared/lib/pedido";

const e = orcamento.estimativa;
const piloto = descontoPilotoAtual();

const precoGrande = "[word-spacing:-0.3em] font-mono text-[clamp(1.7rem,6vw,2.2rem)] leading-none font-bold tracking-[-0.02em]";
const acaoBase = "w-full cursor-pointer justify-center font-[inherit] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco";

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
  const final = comPiloto ? comDesconto(c.preco, comPiloto.percentual) : c.preco;
  return (
    <div>
      {prefixo && <p className="mb-1 text-[0.9rem] text-texto-suave">{prefixo}</p>}
      <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {comPiloto && (
          <s className="font-mono text-[1.05rem] text-texto-suave">
            <span className="sr-only">{e.tabela}</span>
            {brl(c.preco)}
          </s>
        )}
        {/* key: o valor novo remonta o span e dispara o realce discreto (some com movimento reduzido). */}
        <span key={final} className={`valor-atualiza ${precoGrande} ${comPiloto ? "text-destaque" : ""}`}>
          {brl(final)}
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

function notaDoEstado(estado: EstadoEstimativa, p: Progresso): string | null {
  switch (estado) {
    case "inicial":
      return e.estadosNota.inicial;
    case "configurando":
      return e.estadosNota.configurando(p.faltam);
    case "configurada":
      return e.estadosNota.configurada;
    case "consulta":
      return null;
  }
}

type Props = {
  nome: string;
  calculo: CalculoServico;
  progresso: Progresso;
  estado: EstadoEstimativa;
  noCarrinho: boolean;
  aoAdicionar: () => void;
  aoRemover: () => void;
  aoOutroServico: () => void;
};

/** Responde "quanto custa o serviço que estou configurando?". O conjunto do pedido fica em ResumoPedido. */
export function ResumoEstimativa({ nome, calculo: c, progresso, estado, noCarrinho, aoAdicionar, aoRemover, aoOutroServico }: Props) {
  const nota = notaDoEstado(estado, progresso);

  return (
    <div className="border-2 border-texto bg-superficie p-4">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="m-0 min-w-0 text-[0.95rem] font-bold [overflow-wrap:anywhere]">{nome}</p>
        <p className="m-0 border border-destaque px-1.5 font-mono text-[0.72rem] leading-5 whitespace-nowrap text-destaque">
          {e.estados[estado]}
        </p>
      </div>

      <div aria-live="polite" aria-atomic="true">
        <Valor c={c} />
      </div>
      {nota && <p className="mt-2 mb-0 text-[0.85rem] text-texto-suave">{nota}</p>}

      <dl className="my-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-0.5 border-t border-linha pt-3 text-[0.9rem]">
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
                <span className="min-w-0">
                  {l.rotulo}
                  {i > 0 && l.horas > 0 && <span className="text-texto-suave"> ({horasTexto(l.horas)})</span>}
                </span>
                <span className="shrink-0 font-mono">{i === 0 ? brl(l.valor) : `+ ${brl(l.valor)}`}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {noCarrinho ? (
        <div className="grid gap-2">
          <p className="m-0 text-[0.9rem] font-semibold">{e.incluido}</p>
          <button type="button" className={`${botao} ${acaoBase}`} onClick={aoOutroServico}>
            {e.outroServico}
          </button>
          <button type="button" className={`${acaoBase} min-h-alvo cursor-pointer border-0 bg-transparent px-2 text-[0.9rem] font-semibold text-destaque underline underline-offset-4`} onClick={aoRemover}>
            {e.tirar}
          </button>
        </div>
      ) : (
        <button type="button" className={`${botaoCheio} ${acaoBase}`} onClick={aoAdicionar}>
          {e.adicionar}
        </button>
      )}

      {c.aPartirDe && <p className="mt-3 mb-0 text-[0.82rem] text-texto-suave">{e.notaAPartirDe}</p>}
      <p className="mt-2 mb-0 text-[0.82rem] text-texto-suave">
        {c.preco === null ? e.consulta : c.estimativa ? e.notaBot : c.tipoPreco === "aula" ? "" : e.notaEstimativa}
      </p>
    </div>
  );
}
