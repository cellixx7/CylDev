import { servicosDoCatalogo } from "../../content/perguntas";
import { orcamento } from "../../content/textos";
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
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,17rem),1fr))] gap-3 p-0" aria-label={t.rotuloLista}>
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
      <p className="mt-4 mb-0 text-[1rem] text-texto-suave">
        {t.comboTexto}{" "}
        <button
          type="button"
          className="inline min-h-alvo cursor-pointer border-0 bg-transparent p-0 font-[inherit] font-semibold text-destaque underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco"
          onClick={aoMontarCombo}
        >
          {t.comboBotao}
        </button>
      </p>
      <aside className="mt-6 border-l-[3px] border-destaque bg-realce px-4 py-3" aria-labelledby="chamada-comunidade-titulo">
        <h3 id="chamada-comunidade-titulo" className="m-0 text-[1.0625rem]">
          {t.chamadaComunidade.titulo}
        </h3>
        <p className="mt-1 mb-2 text-texto-suave">{t.chamadaComunidade.texto}</p>
        <a
          className="inline-flex min-h-alvo items-center font-semibold text-destaque underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco"
          href={t.chamadaComunidade.href}
        >
          {t.chamadaComunidade.link}
        </a>
      </aside>
    </div>
  );
}
