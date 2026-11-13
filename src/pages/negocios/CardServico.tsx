import { servicoOrcamentoPorId } from "../../content/perguntas";
import { servicoPorId, type Servico } from "../../content/servicos";
import { orcamento } from "../../content/textos";
import { textoMensalidade } from "../../shared/components/Catalogo";
import { brl } from "../../shared/lib/formato";
import { BotaoCarrinho } from "./BotaoCarrinho";
import { MiniExemplo } from "./MiniExemplo";

const t = orcamento.cards;

/** "a partir de" vale também para o preço fixo: as respostas do orçamento podem somar horas ao pacote. */
export function precoDoCard(s: Servico): string {
  switch (s.preco.tipo) {
    case "fixo":
    case "aPartirDe":
      return t.aPartirDe(brl(s.preco.valor));
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
const cheio = `${base} border-destaque bg-destaque text-destaque-texto hover:border-texto hover:bg-texto hover:text-fundo active:border-texto active:bg-texto active:text-fundo`;
const contorno = `${base} border-texto bg-transparent text-texto hover:bg-realce active:bg-realce`;

export function CardServico({ servicoId, noCarrinho, aoVerDetalhes, aoFazerOrcamento, aoAlternarCarrinho }: Props) {
  const s = servicoPorId(servicoId);
  if (!s) return null;
  const titulo = `card-${s.id}-titulo`;
  const mensalidade = textoMensalidade(s);
  const combinavel = servicoOrcamentoPorId(s.id)?.combinavel ?? false;
  return (
    <li
      id={`card-${s.id}`}
      tabIndex={-1}
      aria-labelledby={titulo}
      className="relative flex min-w-0 scroll-mt-24 flex-col rounded-pequeno border border-linha bg-superficie p-5 outline-none"
    >
      <BotaoCarrinho nome={s.nome} dentro={noCarrinho} combinavel={combinavel} aoAlternar={() => aoAlternarCarrinho(s.id)} />
      {/* pr-11: o ícone de carrinho ocupa o canto, o título nunca fica por baixo dele. */}
      <h3 id={titulo} className="m-0 pr-11 text-[1.2rem] leading-tight">
        {s.nome}
      </h3>
      <p className="mt-2 mb-4 text-texto-suave">{t.linhas[s.id]}</p>
      <MiniExemplo servicoId={s.id} />
      <div className="flex flex-wrap items-baseline gap-x-2 border-y border-linha py-2.5">
        <p className="m-0 font-mono text-[1.15rem] font-bold">{precoDoCard(s)}</p>
        {mensalidade && <p className="m-0 font-mono text-[0.875rem] text-texto-suave">+ {mensalidade}</p>}
      </div>
      {/* Visível sempre: no toque não há hover, então o combo não pode depender da dica do ícone. */}
      {combinavel && <p className="mt-2 mb-0 text-[0.875rem] font-semibold text-destaque">{t.comboNoCard}</p>}

      <p className="mt-4 mb-1 text-[0.875rem] font-semibold">{t.inclui}</p>
      <ul className="m-0 grid list-none gap-1.5 p-0 text-[1rem] text-texto-suave">
        {inclusosDoCard(s).map((i) => (
          <li key={i} className="flex gap-2">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-[0.3em] h-4 w-4 shrink-0 text-destaque" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8.5l3.2 3L13 4.5" />
            </svg>
            <span>{i}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto grid gap-2 pt-5">
        <button type="button" className={cheio} onClick={() => aoFazerOrcamento(s.id)} aria-label={`${t.fazerOrcamento}: ${s.nome}`}>
          {t.fazerOrcamento}
        </button>
        <button type="button" className={contorno} onClick={() => aoVerDetalhes(s.id)} aria-label={`${t.verDetalhes}: ${s.nome}`}>
          {t.verDetalhes}
        </button>
      </div>
    </li>
  );
}
