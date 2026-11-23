import { useState } from "react";
import { assistente as t } from "../../../content/textos/assistente";
import { focoVisivel } from "../../../shared/estilos";
import type { Mensagem, Sessao } from "../../../shared/lib/assistente/historico";
import { Corpo } from "./Corpo";

// Conversas anteriores: lista das conversas guardadas no navegador e leitura de cada uma (só leitura). Ficam até a pessoa
// limpar os dados do site.

const botaoTexto = `min-h-alvo cursor-pointer border-0 bg-transparent px-3 font-[inherit] text-base font-semibold text-destaque underline underline-offset-4 ${focoVisivel}`;

const quando = (ms: number) =>
  new Date(ms).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

const primeiraPergunta = (mensagens: Mensagem[]) => mensagens.find((m) => m.autor === "eu")?.texto ?? "";

function Leitura({ sessao }: { sessao: Sessao }) {
  return (
    <ol className="m-0 grid list-none gap-4 p-0">
      {sessao.mensagens.map((m) => {
        const eu = m.autor === "eu";
        return (
          <li key={m.id} className={`flex ${eu ? "justify-end" : "justify-start"}`}>
            <div className={`flex min-w-0 max-w-[86%] flex-col gap-1 ${eu ? "items-end" : "items-start"}`}>
              <div className={`rounded-2xl px-4 py-2 ${eu ? "rounded-br-md bg-destaque text-destaque-texto" : "rounded-bl-md border border-linha bg-superficie text-texto"}`}>
                <span className="sr-only">{eu ? t.voce : t.assistente}: </span>
                {m.texto !== undefined ? <p className="m-0 text-base [overflow-wrap:anywhere] md:text-menor">{m.texto}</p> : m.resposta && <Corpo blocos={m.resposta.blocos} />}
              </div>
              <time className="px-1 text-menor text-texto-suave">{m.hora}</time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

type Props = { sessoes: Sessao[]; aoVoltar: () => void };

export function ConversasAnteriores({ sessoes, aoVoltar }: Props) {
  const [aberta, setAberta] = useState<string | null>(null);
  const sessao = sessoes.find((s) => s.id === aberta) ?? null;

  return (
    <section aria-label={t.anteriores.titulo} className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-linha px-1">
        <button type="button" onClick={sessao ? () => setAberta(null) : aoVoltar} className={botaoTexto}>
          {sessao ? t.anteriores.voltarLista : t.anteriores.voltarConversa}
        </button>
        {sessao && <span className="px-3 text-menor text-texto-suave">{quando(sessao.iniciadaEm)}</span>}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        {sessao ? (
          <Leitura sessao={sessao} />
        ) : sessoes.length === 0 ? (
          <p className="m-0 text-base text-texto-suave">{t.anteriores.vazio}</p>
        ) : (
          <>
            <p className="m-0 mb-3 text-menor text-texto-suave">{t.anteriores.aviso}</p>
            <ul className="m-0 grid list-none gap-2 p-0">
              {sessoes.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setAberta(s.id)}
                    className={`flex min-h-alvo w-full cursor-pointer flex-col gap-1 rounded-pequeno border border-linha bg-superficie px-4 py-2 text-left font-[inherit] text-texto hover:bg-realce active:bg-realce ${focoVisivel}`}
                  >
                    <span className="text-menor text-texto-suave">
                      {quando(s.iniciadaEm)} · {t.anteriores.mensagens(s.mensagens.length)}
                    </span>
                    <span className="text-base font-semibold [overflow-wrap:anywhere] md:text-menor">{primeiraPergunta(s.mensagens)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
