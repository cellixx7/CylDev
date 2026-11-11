import { useEffect, useId, useRef, useState } from "react";
import { guia, type ResultadoGuia } from "../../content/guia";
import { servicoPorId } from "../../content/servicos";
import { botao, botaoCheio } from "../../shared/estilos";
import { escolher, passoDoGuia, voltar } from "../../shared/lib/guia";

const foco = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco";
const opcaoClasse = `flex min-h-alvo w-full cursor-pointer items-center rounded-pequeno border border-texto bg-transparent px-4 py-3 text-left font-[inherit] text-[1rem] text-texto hover:bg-realce active:bg-realce ${foco}`;
const textoClasse = `min-h-alvo cursor-pointer border-0 bg-transparent px-1 font-[inherit] text-[1rem] font-semibold text-destaque underline underline-offset-4 ${foco}`;

type Props = {
  aoVerDetalhes: (id: string) => void;
  aoFazerOrcamento: (id: string) => void;
};

export function Resultado({ r, aoVerDetalhes, aoFazerOrcamento }: { r: ResultadoGuia } & Props) {
  return (
    <div>
      <p className="mt-0 mb-3 text-texto-suave">{r.porque}</p>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {r.servicos.map((id) => (
          <li key={id} className="rounded-pequeno border border-linha bg-superficie p-4">
            <p className="m-0 font-semibold">{servicoPorId(id)?.nome}</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button type="button" className={`${botaoCheio} cursor-pointer justify-center font-[inherit] ${foco}`} onClick={() => aoFazerOrcamento(id)}>
                {guia.fazerOrcamento}
              </button>
              <button type="button" className={`${botao} cursor-pointer justify-center bg-transparent font-[inherit] ${foco}`} onClick={() => aoVerDetalhes(id)}>
                {guia.verDetalhes}
              </button>
            </div>
          </li>
        ))}
      </ul>
      {r.saida && (
        <a className={`${botaoCheio} ${foco}`} href={r.saida.href}>
          {r.saida.rotulo}
        </a>
      )}
      {r.servicos.length > 0 && <p className="mt-3 mb-0 text-[1rem] text-texto-suave">{guia.semCompromisso}</p>}
    </div>
  );
}

/**
 * "Não sei qual escolher": painel dentro da página (não é dialog, então nunca disputa com o modal nem com o carrinho).
 * Cada resposta é um botão; a escolha leva à pergunta seguinte ou a uma sugestão. Não bloqueia nem substitui os cards.
 */
export function GuiaEscolha({ aoVerDetalhes, aoFazerOrcamento }: Props) {
  const [aberto, setAberto] = useState(false);
  const [escolhas, setEscolhas] = useState<string[]>([]);
  const idPainel = useId();
  const titulo = useRef<HTMLHeadingElement>(null);
  const botaoAbrir = useRef<HTMLButtonElement>(null);

  const passo = passoDoGuia(escolhas);

  // O foco acompanha cada etapa: o leitor de tela ouve a pergunta ou a sugestão nova, e o teclado não se perde.
  useEffect(() => {
    if (!aberto) return;
    titulo.current?.focus();
  }, [aberto, escolhas]);

  const fechar = () => {
    setAberto(false);
    setEscolhas([]);
    botaoAbrir.current?.focus();
  };

  return (
    <div className="mt-5">
      <button
        ref={botaoAbrir}
        type="button"
        className={`${botao} cursor-pointer bg-transparent font-[inherit] ${foco}`}
        aria-expanded={aberto}
        aria-controls={idPainel}
        onClick={() => (aberto ? fechar() : setAberto(true))}
      >
        {guia.botao}
      </button>

      <section id={idPainel} hidden={!aberto} aria-label={guia.titulo} className="mt-3 max-w-[40rem] border-l-[3px] border-destaque bg-realce px-4 py-4">
        {aberto && (
          <>
            <p className="m-0 text-[1rem] text-texto-suave">{passo.pergunta ? guia.intro : guia.titulo}</p>
            <h3 ref={titulo} tabIndex={-1} className="mt-2 mb-3 text-[1.25rem] outline-none">
              {passo.pergunta ? `${guia.rotuloPergunta(escolhas.length + 1)}: ${passo.pergunta.texto}` : guia.resultadoTitulo}
            </h3>
            {passo.pergunta ? (
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {passo.pergunta.opcoes.map((o) => (
                  <li key={o.id}>
                    <button type="button" className={opcaoClasse} onClick={() => setEscolhas((e) => escolher(e, o.id))}>
                      {o.rotulo}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <Resultado r={passo.resultado} aoVerDetalhes={aoVerDetalhes} aoFazerOrcamento={aoFazerOrcamento} />
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {escolhas.length > 0 && (
                <button type="button" className={textoClasse} onClick={() => setEscolhas(voltar)}>
                  {guia.voltar}
                </button>
              )}
              {!passo.pergunta && (
                <button type="button" className={textoClasse} onClick={() => setEscolhas([])}>
                  {guia.recomecar}
                </button>
              )}
              <button type="button" className={textoClasse} onClick={fechar}>
                {guia.fechar}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
