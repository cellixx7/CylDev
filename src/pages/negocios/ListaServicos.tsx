import { servicosOrcamento } from "../../content/perguntas";
import { servicoPorId } from "../../content/servicos";
import { orcamento } from "../../content/textos";
import { botao } from "../../shared/estilos";
import { brl } from "../../shared/lib/formato";

const t = orcamento.lista;

/** Preço curto da lista: o de tabela, antes das respostas. */
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

/** Lista de serviços, como uma lista de conversas. */
export function ListaServicos({ servicoId, noCarrinho, aoAbrir, aoMontarCombo }: Props) {
  return (
    <div>
      <h3 id="orc-foco-lista" tabIndex={-1} className="mb-3 text-[1.15rem] font-bold focus:outline-none">
        {t.titulo}
      </h3>
      <ul className="m-0 list-none border-t-2 border-texto p-0" aria-label={t.rotuloLista}>
        {servicosOrcamento.map((s) => {
          const dentro = noCarrinho.includes(s.id);
          return (
            <li key={s.id}>
              <button
                type="button"
                aria-current={s.id === servicoId ? "true" : undefined}
                onClick={() => aoAbrir(s.id)}
                className="flex min-h-alvo w-full cursor-pointer items-start gap-3 border-0 border-b border-linha bg-transparent px-3 py-3 text-left font-[inherit] text-texto hover:bg-realce aria-[current=true]:bg-realce aria-[current=true]:shadow-[inset_3px_0_0_var(--color-destaque)]"
              >
                <span className="pt-[0.15rem] font-mono text-[0.85rem] text-texto-suave">{s.numero}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{s.nome}</span>
                  <span className="mt-0.5 line-clamp-2 text-[0.9rem] leading-[1.4] text-texto-suave">{s.resumo}</span>
                  {dentro && (
                    <span className="mt-1.5 inline-block border border-destaque px-1.5 font-mono text-[0.75rem] text-destaque">
                      {t.noCarrinho}
                    </span>
                  )}
                </span>
                <span className="max-w-[6.5rem] shrink-0 pt-[0.1rem] text-right font-mono text-[0.85rem] leading-[1.3] text-texto-suave">
                  {precoCurto(s.id)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 border border-linha bg-realce p-4">
        <p className="mb-1 font-semibold">{t.comboTitulo}</p>
        <p className="mb-3 text-[0.95rem] text-texto-suave">{t.comboTexto}</p>
        <button type="button" className={`${botao} cursor-pointer bg-transparent font-[inherit]`} onClick={aoMontarCombo}>
          {t.comboBotao}
        </button>
      </div>
    </div>
  );
}
