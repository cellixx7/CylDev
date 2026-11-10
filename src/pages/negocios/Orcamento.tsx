import { useEffect, useMemo, useRef, useState } from "react";
import { servicoOrcamentoPorId } from "../../content/perguntas";
import { orcamento as t } from "../../content/textos";
import { adicionar, estadoInicial, montarCombo, remover, responder, type EstadoCarrinho } from "../../shared/lib/carrinho-estado";
import { montarPedido } from "../../shared/lib/pedido";
import { CardsServicos } from "./CardsServicos";
import { ModalServico } from "./ModalServico";
import { useServicoNaUrl } from "./useServicoNaUrl";

/**
 * Orquestra a seção: cards, carrinho e modal do serviço (o painel do carrinho entra no bloco 3).
 * O estado do carrinho e das respostas vive aqui, fora do modal, para sobreviver a fechar e reabrir.
 */
export function Orcamento() {
  const [carrinho, setCarrinho] = useState<EstadoCarrinho>(estadoInicial);
  const [aviso, setAviso] = useState("");
  const { aberto, abrir, trocarAba, fechar } = useServicoNaUrl();

  // Elemento que abriu o modal: o foco volta a ele ao fechar. Em abertura por link direto não há origem, e o foco vai ao card.
  const origem = useRef<HTMLElement | null>(null);
  const idAnterior = useRef<string | null>(aberto?.id ?? null);

  // Será usado pela barra e pelo painel do carrinho (bloco 3).
  const pedido = useMemo(() => montarPedido(carrinho.ids, carrinho.respostas), [carrinho]);

  useEffect(() => {
    const anterior = idAnterior.current;
    idAnterior.current = aberto?.id ?? null;
    if (aberto || !anterior) return;
    const alvo = origem.current?.isConnected ? origem.current : document.getElementById(`card-${anterior}`);
    origem.current = null;
    alvo?.focus();
  }, [aberto]);

  const nome = (id: string) => servicoOrcamentoPorId(id)?.nome ?? "Serviço";

  const abrirModal = (id: string, aba: "detalhes" | "orcamento") => {
    origem.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    abrir(id, aba);
  };
  const colocar = (id: string) => {
    setCarrinho((e) => adicionar(e, id));
    setAviso(t.cards.adicionado(nome(id)));
  };
  const tirar = (id: string) => {
    setCarrinho((e) => remover(e, id));
    setAviso(t.cards.removido(nome(id)));
  };
  const alternar = (id: string) => (carrinho.ids.includes(id) ? tirar(id) : colocar(id));
  const combo = () => {
    setCarrinho(montarCombo);
    setAviso(t.cards.comboAdicionado);
  };

  return (
    <section
      className="mx-auto max-w-hero scroll-mt-24 px-margem pt-14 pb-14"
      id="orcamento"
      aria-labelledby="orcamento-titulo"
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
          aoVerDetalhes={(id) => abrirModal(id, "detalhes")}
          aoFazerOrcamento={(id) => abrirModal(id, "orcamento")}
          aoAlternarCarrinho={alternar}
          aoMontarCombo={combo}
        />
      </div>

      <ModalServico
        aberto={aberto}
        respostas={carrinho.respostas}
        noCarrinho={!!aberto && carrinho.ids.includes(aberto.id)}
        aviso={aviso}
        aoMudarAba={trocarAba}
        aoResponder={(servicoId, perguntaId, opcaoId) => setCarrinho((e) => responder(e, servicoId, perguntaId, opcaoId))}
        aoAdicionar={colocar}
        aoRemover={tirar}
        aoFechar={fechar}
      />
    </section>
  );
}
