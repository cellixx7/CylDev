import { servicosComDemo } from "../../content/demos";
import type { ServicoOrcamento } from "../../content/perguntas";
import { servicoPorId } from "../../content/servicos";
import { orcamento } from "../../content/textos";
import { textoMensalidade, textoPrazo } from "../../shared/components/Catalogo";

const t = orcamento.modal;

const titulo = "mb-1 mt-6 text-[1rem] font-bold first:mt-0";

/** Aba Detalhes: o que é, o que você recebe, prazo, mensalidade e notas. Tudo vem de perguntas.ts e servicos.ts. */
export function AbaDetalhes({ modelo }: { modelo: ServicoOrcamento }) {
  const s = servicoPorId(modelo.id);
  const demoId = servicosComDemo[modelo.id];
  const prazo = s ? textoPrazo(s) : null;
  const mensalidade = s ? textoMensalidade(s) : null;
  const notas = [...modelo.notas, ...(s?.nota && !modelo.notas.includes(s.nota) ? [s.nota] : [])];
  return (
    <div>
      <h3 className={titulo}>{t.oQueE}</h3>
      <p className="m-0 max-w-[60ch]">{modelo.resumo}</p>

      <h3 className={titulo}>{t.voceRecebe}</h3>
      <ul className="m-0 list-disc pl-5">
        {modelo.inclui.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {demoId && (
        <p className="mt-4 mb-0">
          <a
            className="inline-flex min-h-alvo items-center font-semibold"
            href={`/como-funciona/#${demoId}`}
          >
            {t.verComoFunciona}
          </a>
        </p>
      )}

      {(prazo || mensalidade) && (
        <dl className="mt-6 mb-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-[1rem]">
          {prazo && (
            <>
              <dt className="font-semibold">{t.prazo}</dt>
              <dd className="m-0">{prazo}</dd>
            </>
          )}
          {mensalidade && (
            <>
              <dt className="font-semibold">{t.mensalidade}</dt>
              <dd className="m-0">{mensalidade}</dd>
            </>
          )}
        </dl>
      )}

      {notas.length > 0 && (
        <>
          <h3 className={titulo}>{t.notas}</h3>
          {notas.map((n) => (
            <p key={n} className="mt-0 mb-2 max-w-[60ch] text-[1rem] text-texto-suave">
              {n}
            </p>
          ))}
        </>
      )}
    </div>
  );
}
