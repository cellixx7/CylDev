import { servicosDoCatalogo } from "../../../content/perguntas";
import { orcamento } from "../../../content/textos";
import { CardServico } from "./CardServico";

const t = orcamento.cards;

type Props = {
  ids: string[];
  aoVerDetalhes: (id: string) => void;
  aoFazerOrcamento: (id: string) => void;
  aoAlternarCarrinho: (id: string) => void;
  aoMontarCombo: () => void;
};

/** Grade de colunas de largura mínima: uma coluna no celular e mais conforme o espaço real permite. */
export function CardsServicos({ ids, aoVerDetalhes, aoFazerOrcamento, aoAlternarCarrinho, aoMontarCombo }: Props) {
  return (
    <div>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 md:grid-cols-2 pc:grid-cols-3 p-0" aria-label={t.rotuloLista}>
        {servicosDoCatalogo.map((s) => (
          <CardServico
            key={s.id}
            servicoId={s.id}
            noCarrinho={ids.includes(s.id)}
            aoVerDetalhes={aoVerDetalhes}
            aoFazerOrcamento={aoFazerOrcamento}
            aoAlternarCarrinho={aoAlternarCarrinho}
          />
        ))}
      </ul>
      <p className="mt-4 mb-0 text-base text-texto-suave">
        {t.comboTexto}{" "}
        <button
          type="button"
          className="inline min-h-alvo cursor-pointer border-0 bg-transparent p-0 font-[inherit] font-semibold text-destaque underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco"
          onClick={aoMontarCombo}
        >
          {t.comboBotao}
        </button>
      </p>
    </div>
  );
}
