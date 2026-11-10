import { servicoPorId, type Servico } from "../../content/servicos";
import { orcamento } from "../../content/textos";
import { textoMensalidade } from "../../shared/components/Catalogo";
import { brl } from "../../shared/lib/formato";
import { IconeCheck } from "./icones";

const t = orcamento.cards;

/** "a partir de" vale também para o preço fixo: as respostas do orçamento podem somar horas ao pacote. */
export function precoDoCard(s: Servico): string {
  switch (s.preco.tipo) {
    case "fixo":
    case "aPartirDe":
      return t.aPartirDe(brl(s.preco.valor));
    case "aula":
      return t.porHora(brl(s.preco.porHora));
    case "sobConsulta":
      return t.sobConsulta;
  }
}

/** Até 3 itens do que vem incluso, os primeiros de servicos.ts. */
export const inclusosDoCard = (s: Servico) => s.inclui.slice(0, 3);

type Props = {
  servicoId: string;
  noCarrinho: boolean;
  aoVerDetalhes: (id: string) => void;
  aoFazerOrcamento: (id: string) => void;
  aoAlternarCarrinho: (id: string) => void;
};

const base =
  "inline-flex min-h-alvo w-full cursor-pointer items-center justify-center rounded-pequeno border px-4 py-2 text-center font-[inherit] font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco";
const cheio = `${base} border-destaque bg-destaque text-destaque-texto hover:border-texto hover:bg-texto hover:text-fundo`;
const contorno = `${base} border-texto bg-transparent text-texto hover:bg-realce`;

export function CardServico({ servicoId, noCarrinho, aoVerDetalhes, aoFazerOrcamento, aoAlternarCarrinho }: Props) {
  const s = servicoPorId(servicoId);
  if (!s) return null;
  const titulo = `card-${s.id}-titulo`;
  const mensalidade = textoMensalidade(s);
  return (
    <li
      id={`card-${s.id}`}
      tabIndex={-1}
      aria-labelledby={titulo}
      className="flex min-w-0 scroll-mt-24 flex-col rounded-pequeno border border-linha bg-superficie p-4 outline-none"
    >
      <h3 id={titulo} className="m-0 text-[1.2rem] leading-tight">
        {s.nome}
      </h3>
      <p className="mt-2 mb-3 text-texto-suave">{t.linhas[s.id]}</p>
      <p className="m-0 font-mono text-[1.05rem] font-bold">{precoDoCard(s)}</p>
      {mensalidade && <p className="mt-1 mb-0 font-mono text-[0.85rem] text-texto-suave">+ {mensalidade}</p>}

      <p className="mt-4 mb-1 text-[0.85rem] font-semibold">{t.inclui}</p>
      <ul className="m-0 list-disc pl-[1.1em] text-[0.95rem] text-texto-suave">
        {inclusosDoCard(s).map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>

      <div className="mt-auto grid gap-2 pt-5">
        {noCarrinho && (
          <p className="m-0 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold">
            <span className="grid size-4 place-items-center rounded-pequeno bg-destaque text-destaque-texto">
              <IconeCheck className="size-3" />
            </span>
            {t.noCarrinho}
          </p>
        )}
        <button type="button" className={cheio} onClick={() => aoFazerOrcamento(s.id)} aria-label={`${t.fazerOrcamento}: ${s.nome}`}>
          {t.fazerOrcamento}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className={contorno} onClick={() => aoVerDetalhes(s.id)} aria-label={`${t.verDetalhes}: ${s.nome}`}>
            {t.verDetalhes}
          </button>
          <button
            type="button"
            className={contorno}
            aria-pressed={noCarrinho}
            onClick={() => aoAlternarCarrinho(s.id)}
            aria-label={`${noCarrinho ? t.tirarDoCarrinho : t.porNoCarrinho}: ${s.nome}`}
          >
            {noCarrinho ? t.tirarDoCarrinho : t.porNoCarrinho}
          </button>
        </div>
      </div>
    </li>
  );
}
