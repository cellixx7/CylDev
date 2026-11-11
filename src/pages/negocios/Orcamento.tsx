import { useEffect, useMemo, useRef, useState } from "react";
import { servicoOrcamentoPorId } from "../../content/perguntas";
import { orcamento as t } from "../../content/textos";
import { adicionar, montarCombo, remover, responder, type EstadoCarrinho } from "../../shared/lib/carrinho-estado";
import { lerCarrinho, salvarCarrinho } from "../../shared/lib/carrinho-persistencia";
import type { AbaModal } from "../../shared/lib/hashServico";
import { montarPedido } from "../../shared/lib/pedido";
import { BarraCarrinho, ID_BOTAO_BARRA } from "./BarraCarrinho";
import { CardsServicos } from "./CardsServicos";
import { GuiaEscolha } from "./GuiaEscolha";
import { ModalServico } from "./ModalServico";
import { PainelCarrinho } from "./PainelCarrinho";
import { useServicoNaUrl } from "./useServicoNaUrl";

/**
 * Orquestra a seção: cards, modal do serviço, barra do carrinho e painel do carrinho.
 * O estado do carrinho e das respostas vive aqui, fora dos dialogs, para sobreviver a fechar e reabrir.
 * Ele também é guardado em sessionStorage (carrinho-persistencia.ts) e limpo depois de um envio com sucesso.
 *
 * Regra: nunca há dois dialogs abertos. Quem abre o carrinho a partir do modal fecha o modal antes
 * (sequencial, com o painel entrando só depois que o serviço saiu); e "Ajustar respostas" no carrinho
 * fecha o painel antes de abrir o serviço.
 */
export function Orcamento() {
  // Restaura do sessionStorage (troca de página e recarregar). Só ids e respostas; o preço é recalculado.
  const [carrinho, setCarrinho] = useState<EstadoCarrinho>(lerCarrinho);
  const [observacoes, setObservacoes] = useState("");
  const [painelAberto, setPainelAberto] = useState(false);
  const [aviso, setAviso] = useState("");
  const { aberto, abrir, trocarAba, fechar } = useServicoNaUrl();

  // Foco: o modal devolve o foco ao botão que o abriu (ou ao card, sem origem). O painel devolve à barra.
  const origem = useRef<HTMLElement | null>(null);
  const idAnterior = useRef<string | null>(aberto?.id ?? null);
  const painelDepoisDoModal = useRef(false);
  const painelAnterior = useRef(false);
  const pularFocoDoPainel = useRef(false);

  // Observações e o abre/fecha dos dialogs ficam de fora, de propósito.
  useEffect(() => salvarCarrinho(carrinho), [carrinho]);

  const pedido = useMemo(() => montarPedido(carrinho.ids, carrinho.respostas, observacoes), [carrinho, observacoes]);

  useEffect(() => {
    const anterior = idAnterior.current;
    idAnterior.current = aberto?.id ?? null;
    if (aberto && painelAberto) setPainelAberto(false); // link direto com o carrinho aberto: só um dialog por vez
    if (aberto || !anterior) return;
    if (painelDepoisDoModal.current) {
      painelDepoisDoModal.current = false;
      origem.current = null;
      setPainelAberto(true);
      return;
    }
    const alvo = origem.current?.isConnected ? origem.current : document.getElementById(`card-${anterior}`);
    origem.current = null;
    alvo?.focus();
  }, [aberto, painelAberto]);

  useEffect(() => {
    const estava = painelAnterior.current;
    painelAnterior.current = painelAberto;
    if (painelAberto || !estava) return;
    if (pularFocoDoPainel.current) {
      pularFocoDoPainel.current = false;
      return;
    }
    (document.getElementById(ID_BOTAO_BARRA) ?? document.getElementById("orcamento-titulo"))?.focus();
  }, [painelAberto]);

  const nome = (id: string) => servicoOrcamentoPorId(id)?.nome ?? "Serviço";

  const abrirModal = (id: string, aba: AbaModal) => {
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

  // Do modal para o carrinho: o modal sai primeiro; o painel abre quando `aberto` voltar a ser nulo.
  const verCarrinhoDoModal = () => {
    painelDepoisDoModal.current = true;
    fechar();
  };
  // Do carrinho para o serviço: o painel sai e o modal abre na aba Orçamento, com o foco voltando ao card ao fechar.
  const ajustar = (id: string) => {
    pularFocoDoPainel.current = true;
    origem.current = null;
    setPainelAberto(false);
    abrir(id, "orcamento");
  };

  return (
    <section
      className="mx-auto max-w-hero scroll-mt-24 px-margem pt-14 pb-14"
      id="orcamento"
      aria-labelledby="orcamento-titulo"
    >
      <span className="revela-barra mb-5 block h-[3px] w-12 bg-destaque" aria-hidden="true" />
      <h2 id="orcamento-titulo" tabIndex={-1} className="revela-titulo outline-none">
        {t.titulo}
      </h2>
      <p className="max-w-[40rem] text-texto-suave">{t.intro}</p>
      <GuiaEscolha aoVerDetalhes={(id) => abrirModal(id, "detalhes")} aoFazerOrcamento={(id) => abrirModal(id, "orcamento")} />

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

      {/* Os dialogs ficam fora do bloco `.revela`, e o painel antes do modal na ordem de efeitos. */}
      <PainelCarrinho
        aberto={painelAberto}
        pedido={pedido}
        aviso={aviso}
        observacoes={observacoes}
        aoMudarObservacoes={setObservacoes}
        aoAjustar={ajustar}
        aoTirar={tirar}
        aoFechar={() => setPainelAberto(false)}
      />
      <ModalServico
        aberto={aberto}
        respostas={carrinho.respostas}
        noCarrinho={!!aberto && carrinho.ids.includes(aberto.id)}
        aviso={aviso}
        aoMudarAba={trocarAba}
        aoResponder={(servicoId, perguntaId, opcaoId) => setCarrinho((e) => responder(e, servicoId, perguntaId, opcaoId))}
        aoAdicionar={colocar}
        aoRemover={tirar}
        aoVerCarrinho={verCarrinhoDoModal}
        aoFechar={fechar}
      />

      {/* Fora do bloco `.revela`: o transform dele prenderia o `fixed` ao bloco. */}
      <BarraCarrinho pedido={pedido} aoAbrir={() => setPainelAberto(true)} />
    </section>
  );
}
