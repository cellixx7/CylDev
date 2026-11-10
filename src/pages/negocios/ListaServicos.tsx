import { servicosOrcamento } from "../../content/perguntas";
import { servicoPorId } from "../../content/servicos";
import { orcamento } from "../../content/textos";
import { brl } from "../../shared/lib/formato";

const t = orcamento.lista;

/** Preço curto do botão: o de tabela, antes das respostas. */
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

/** Escolha do serviço: grade de botões compactos (nome e preço), sem resumo. */
export function ListaServicos({ servicoId, noCarrinho, aoAbrir, aoMontarCombo }: Props) {
  return (
    <div>
      <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 md:grid-cols-4" aria-label={t.rotuloLista}>
        {servicosOrcamento.map((s) => {
          const dentro = noCarrinho.includes(s.id);
          return (
            <li key={s.id} className="flex">
              <button
                type="button"
                aria-pressed={s.id === servicoId}
                onClick={() => aoAbrir(s.id)}
                className="relative flex min-h-alvo w-full cursor-pointer flex-col items-start gap-0.5 rounded-pequeno border border-linha bg-transparent px-3 py-2 text-left font-[inherit] text-texto hover:bg-realce aria-pressed:border-destaque aria-pressed:bg-realce aria-pressed:shadow-[inset_0_-3px_0_var(--color-destaque)]"
              >
                <span className="text-[0.95rem] leading-tight font-semibold">{s.nome}</span>
                <span className="font-mono text-[0.78rem] leading-tight text-texto-suave">{precoCurto(s.id)}</span>
                {dentro && (
                  <span className="absolute top-1.5 right-1.5 font-mono text-[0.7rem] text-destaque" title={t.noCarrinho}>
                    ✓<span className="sr-only"> {t.noCarrinho}</span>
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
