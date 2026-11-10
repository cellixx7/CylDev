import { servicosOrcamento } from "../../content/perguntas";
import { servicoPorId } from "../../content/servicos";
import { orcamento } from "../../content/textos";
import { brl } from "../../shared/lib/formato";
import { IconeCheck } from "./icones";

const t = orcamento.lista;

/** Preço curto do cartão: o de tabela, antes das respostas. */
function precoCurto(id: string): string {
  const p = servicoPorId(id)?.preco;
  if (!p) return "";
  switch (p.tipo) {
    case "fixo":
      return brl(p.valor);
    case "aPartirDe":
      return `a partir de ${brl(p.valor)}`;
    case "aula":
      return `${brl(p.porHora)}${t.porHora}`;
    case "sobConsulta":
      return t.sobConsulta;
  }
}

type Props = {
  servicoId: string;
  noCarrinho: string[];
  aoAbrir: (id: string) => void;
  aoMontarCombo: () => void;
};

/**
 * Etapa 1: cartões de serviço. A grade usa colunas de largura mínima (não breakpoints), então o número
 * de colunas segue o espaço real: uma no celular estreito, mais conforme a largura permite.
 * Aberto (em configuração) e no pedido são estados diferentes e cada um tem texto próprio, não só cor.
 */
export function ListaServicos({ servicoId, noCarrinho, aoAbrir, aoMontarCombo }: Props) {
  return (
    <div>
      <ul
        className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,13.5rem),1fr))] gap-2 p-0"
        aria-label={t.rotuloLista}
      >
        {servicosOrcamento.map((s) => {
          const dentro = noCarrinho.includes(s.id);
          const aberto = s.id === servicoId;
          return (
            <li key={s.id} className="flex min-w-0">
              <button
                type="button"
                aria-pressed={aberto}
                onClick={() => aoAbrir(s.id)}
                className="group flex min-h-[4.25rem] w-full min-w-0 cursor-pointer flex-col items-start justify-between gap-2 rounded-pequeno border border-linha bg-superficie px-3 py-2.5 text-left font-[inherit] text-texto transition-colors hover:border-texto-suave hover:bg-realce focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco aria-pressed:border-destaque aria-pressed:bg-realce aria-pressed:shadow-[inset_0_0_0_1px_var(--color-destaque)]"
              >
                <span className="min-w-0">
                  <span className="block text-[1rem] leading-tight font-semibold [overflow-wrap:anywhere]">{s.nome}</span>
                  <span className="mt-0.5 block font-mono text-[0.82rem] leading-tight text-texto-suave">{precoCurto(s.id)}</span>
                </span>
                {(aberto || dentro) && (
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem] leading-none font-semibold">
                    {aberto && <span className="text-destaque">{t.aberto}</span>}
                    {dentro && (
                      <span className="inline-flex items-center gap-1 text-texto">
                        <span className="grid size-4 place-items-center rounded-pequeno bg-destaque text-destaque-texto">
                          <IconeCheck className="size-3" />
                        </span>
                        {t.noCarrinho}
                      </span>
                    )}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 mb-0 text-[0.9rem] text-texto-suave">
        {t.comboTexto}{" "}
        <button
          type="button"
          className="inline min-h-alvo cursor-pointer border-0 bg-transparent p-0 font-[inherit] font-semibold text-destaque underline underline-offset-4"
          onClick={aoMontarCombo}
        >
          {t.comboBotao}
        </button>
      </p>
    </div>
  );
}
