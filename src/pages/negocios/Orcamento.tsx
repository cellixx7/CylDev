import { useMemo, useState } from "react";
import { servicoOrcamentoPorId } from "../../content/perguntas";
import { orcamento as t } from "../../content/textos";
import { adicionar, estadoInicial, montarCombo, remover, type EstadoCarrinho } from "../../shared/lib/carrinho-estado";
import { montarPedido } from "../../shared/lib/pedido";
import { CardsServicos } from "./CardsServicos";

export type AbaModal = "detalhes" | "orcamento";

/**
 * Orquestra a seção: cards, carrinho e (nos próximos blocos) o modal e o painel do carrinho.
 * Bloco 1: "Ver detalhes" e "Fazer orçamento" só registram o serviço aberto e a aba; o modal entra no bloco 2.
 */
export function Orcamento() {
  const [carrinho, setCarrinho] = useState<EstadoCarrinho>(estadoInicial);
  const [aberto, setAberto] = useState<{ id: string; aba: AbaModal } | null>(null);
  const [aviso, setAviso] = useState("");

  // Será usado pela barra e pelo painel do carrinho (bloco 3).
  const pedido = useMemo(() => montarPedido(carrinho.ids, carrinho.respostas), [carrinho]);

  const nome = (id: string) => servicoOrcamentoPorId(id)?.nome ?? "Serviço";

  const alternar = (id: string) => {
    const dentro = carrinho.ids.includes(id);
    setCarrinho((e) => (dentro ? remover(e, id) : adicionar(e, id)));
    setAviso(dentro ? t.cards.removido(nome(id)) : t.cards.adicionado(nome(id)));
  };
  const combo = () => {
    setCarrinho(montarCombo);
    setAviso(t.cards.comboAdicionado);
  };

  return (
    <section
      className="mx-auto max-w-hero scroll-mt-24 px-margem pt-14 pb-14"
      id="orcamento"
      aria-labelledby="orcamento-titulo"
      data-servico-aberto={aberto ? `${aberto.id}/${aberto.aba}` : undefined}
      data-itens-no-carrinho={pedido.itens.length}
    >
      <span className="revela-barra mb-5 block h-[3px] w-12 bg-destaque" aria-hidden="true" />
      <h2 id="orcamento-titulo" className="revela-titulo">
        {t.titulo}
      </h2>
      <p className="max-w-[40rem] text-texto-suave">{t.intro}</p>

      <p className="sr-only" role="status">
        {aviso}
      </p>

      <div className="revela mt-8">
        <CardsServicos
          ids={carrinho.ids}
          aoVerDetalhes={(id) => setAberto({ id, aba: "detalhes" })}
          aoFazerOrcamento={(id) => setAberto({ id, aba: "orcamento" })}
          aoAlternarCarrinho={alternar}
          aoMontarCombo={combo}
        />
      </div>
    </section>
  );
}
