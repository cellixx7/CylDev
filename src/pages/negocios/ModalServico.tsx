import { useEffect, useRef, type KeyboardEvent } from "react";
import { useTravaRolagem } from "./useTravaRolagem";
import { servicoOrcamentoPorId } from "../../content/perguntas";
import { orcamento } from "../../content/textos";
import type { AbaModal, ServicoNaUrl } from "../../shared/lib/hashServico";
import { calcularServico, type Respostas } from "../../shared/lib/orcamento";
import { estadoDaEstimativa, progressoDoServico } from "../../shared/lib/pedido";
import { AbaDetalhes } from "./AbaDetalhes";
import { AbaOrcamento } from "./AbaOrcamento";
import { IconeFechar } from "./icones";
import { PrecoRodape } from "./ResumoEstimativa";

const t = orcamento.modal;
const abas: AbaModal[] = ["detalhes", "orcamento"];

const focoVisivel = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco";
const botaoRodape = `inline-flex min-h-alvo w-full cursor-pointer items-center justify-center rounded-pequeno border px-4 py-2 text-center font-[inherit] font-semibold transition-colors ${focoVisivel}`;
const cheio = `${botaoRodape} border-destaque bg-destaque text-destaque-texto hover:border-texto hover:bg-texto hover:text-fundo active:border-texto active:bg-texto active:text-fundo`;
const contorno = `${botaoRodape} border-texto bg-transparent text-texto hover:bg-realce active:bg-realce`;

type Props = {
  aberto: ServicoNaUrl | null;
  respostas: Record<string, Respostas>;
  noCarrinho: boolean;
  /** Aviso de "adicionado" e "removido". O modal deixa o resto da página inerte, então ele tem a própria região de status. */
  aviso: string;
  aoMudarAba: (aba: AbaModal) => void;
  aoResponder: (servicoId: string, perguntaId: string, opcaoId: string) => void;
  aoAdicionar: (servicoId: string) => void;
  aoRemover: (servicoId: string) => void;
  /** Fecha este modal e, só depois, abre o painel do carrinho (nunca modal sobre modal). */
  aoVerCarrinho: () => void;
  aoFechar: () => void;
};

/**
 * Modal do serviço em <dialog> nativo: showModal() deixa o resto inerte e prende o foco, e o Esc fecha.
 * O estado (serviço, aba, respostas) vive em Orcamento.tsx, então trocar de aba ou reabrir não perde respostas.
 */
export function ModalServico({ aberto, respostas, noCarrinho, aviso, aoMudarAba, aoResponder, aoAdicionar, aoRemover, aoVerCarrinho, aoFechar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const modelo = aberto ? servicoOrcamentoPorId(aberto.id) : undefined;
  const visivel = !!(aberto && modelo);

  // Abre e fecha o <dialog> conforme o estado.
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (visivel && !d.open) {
      d.showModal();
      titulo.current?.focus({ preventScroll: true });
    } else if (!visivel && d.open) {
      d.close();
    }
  }, [visivel]);

  // A página atrás não rola enquanto o modal está aberto. O contador fica no hook.
  useTravaRolagem(visivel);

  const respostasDele = (aberto && respostas[aberto.id]) || {};
  const calculo = aberto && modelo ? calcularServico(aberto.id, respostasDele) : null;
  const progresso = modelo ? progressoDoServico(modelo, respostasDele) : null;
  const estado = calculo && progresso ? estadoDaEstimativa(calculo, progresso) : null;

  const aoTeclarAba = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!aberto) return;
    const i = abas.indexOf(aberto.aba);
    let prox: number | null = null;
    if (e.key === "ArrowRight") prox = (i + 1) % abas.length;
    else if (e.key === "ArrowLeft") prox = (i - 1 + abas.length) % abas.length;
    else if (e.key === "Home") prox = 0;
    else if (e.key === "End") prox = abas.length - 1;
    if (prox === null) return;
    e.preventDefault();
    aoMudarAba(abas[prox]);
    document.getElementById(`aba-${abas[prox]}`)?.focus();
  };

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="modal-servico-titulo"
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
      className="m-0 hidden h-dvh max-h-none w-full max-w-none flex-col border-0 bg-fundo p-0 text-texto open:flex overflow-hidden md:m-auto md:h-auto md:max-h-[90dvh] md:max-w-[44rem] md:border md:border-linha backdrop:bg-[rgb(0_0_0/0.6)]"
    >
      {visivel && aberto && modelo && calculo && progresso && estado && (
        <>
          <header className="shrink-0 border-b border-linha px-4 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-6">
            <div className="flex items-start justify-between gap-3">
              <h2 id="modal-servico-titulo" ref={titulo} tabIndex={-1} className="m-0 py-2 text-[1.35rem] leading-tight outline-none">
                {modelo.nome}
              </h2>
              <button
                type="button"
                onClick={aoFechar}
                aria-label={t.fechar}
                className={`grid size-alvo shrink-0 cursor-pointer place-items-center rounded-pequeno border border-linha bg-transparent p-0 text-texto hover:bg-realce ${focoVisivel}`}
              >
                <IconeFechar />
              </button>
            </div>
            <div role="tablist" aria-label={t.rotuloAbas} className="-mb-px mt-2 flex gap-1">
              {abas.map((aba) => {
                const ativa = aberto.aba === aba;
                return (
                  <button
                    key={aba}
                    id={`aba-${aba}`}
                    type="button"
                    role="tab"
                    aria-selected={ativa}
                    aria-controls={`painel-${aba}`}
                    tabIndex={ativa ? 0 : -1}
                    onClick={() => aoMudarAba(aba)}
                    onKeyDown={aoTeclarAba}
                    className={`min-h-alvo cursor-pointer border-0 border-b-[3px] bg-transparent px-4 font-[inherit] text-[1rem] font-semibold ${focoVisivel} ${
                      ativa ? "border-destaque text-texto" : "border-transparent text-texto-suave hover:text-texto"
                    }`}
                  >
                    {t.abas[aba]}
                  </button>
                );
              })}
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
            <div id="painel-detalhes" role="tabpanel" aria-labelledby="aba-detalhes" hidden={aberto.aba !== "detalhes"}>
              <AbaDetalhes modelo={modelo} />
            </div>
            <div id="painel-orcamento" role="tabpanel" aria-labelledby="aba-orcamento" hidden={aberto.aba !== "orcamento"}>
              <AbaOrcamento
                modelo={modelo}
                respostas={respostasDele}
                calculo={calculo}
                progresso={progresso}
                estado={estado}
                aoResponder={(perguntaId, opcaoId) => aoResponder(modelo.id, perguntaId, opcaoId)}
              />
            </div>
          </div>

          <footer className="shrink-0 border-t border-linha bg-superficie px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6">
            <p className="m-0 mb-2 text-[1.05rem]" aria-live="polite" aria-atomic="true">
              <PrecoRodape c={calculo} progresso={progresso} />
            </p>
            {noCarrinho ? (
              <div className="grid gap-2">
                <button type="button" className={cheio} onClick={aoVerCarrinho}>
                  {t.verCarrinho}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" aria-disabled="true" className={`${botaoRodape} cursor-default border-linha bg-realce text-texto`}>
                    {t.noCarrinho}
                  </button>
                  <button type="button" className={contorno} onClick={() => aoRemover(modelo.id)}>
                    {t.tirar}
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className={cheio} onClick={() => aoAdicionar(modelo.id)}>
                {t.adicionar}
              </button>
            )}
            <p className="sr-only" role="status">
              {aviso}
            </p>
          </footer>
        </>
      )}
    </dialog>
  );
}
