import { useRef, useState, type FormEvent } from "react";
import { site } from "../../content/site";
import { formulario as tf, orcamento } from "../../content/textos";
import { botaoCheio, botao } from "../../shared/estilos";
import { enviarContato, pareceSpam } from "../../shared/lib/emailjs";
import { brl } from "../../shared/lib/formato";
import {
  linkWhatsappCarrinho,
  textoEstimativa,
  textoPedido,
  textoPrecoItem,
  type Carrinho as DadosCarrinho,
} from "../../shared/lib/orcamento";

const t = orcamento.carrinho;
const origem = "negocios-carrinho";

const campo = "grid gap-1 font-semibold";
const entrada = "min-h-alvo rounded-pequeno border border-texto-suave bg-superficie px-3 py-2 font-normal text-texto";
const botaoTexto =
  "min-h-alvo cursor-pointer border-0 bg-transparent px-2 font-[inherit] text-[0.95rem] font-semibold text-destaque underline underline-offset-4";

type Estado = "pronto" | "enviando" | "falhou";

function FecharPeloSite({ carrinho }: { carrinho: DadosCarrinho }) {
  const [estado, setEstado] = useState<Estado>("pronto");
  const abertoEm = useRef(Date.now());
  const vazio = carrinho.itens.length === 0;

  async function aoEnviar(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (vazio) return;
    const f = new FormData(ev.currentTarget);
    const valor = (nome: string) => String(f.get(nome) ?? "").trim();

    // Spam: finge sucesso para não ensinar o robô a contornar a proteção.
    if (pareceSpam(valor("site_empresa"), abertoEm.current)) {
      window.location.assign("/obrigado/");
      return;
    }

    setEstado("enviando");
    try {
      await enviarContato({
        nome: valor("nome"),
        preferencia: "whatsapp",
        contato: valor("whatsapp"),
        assunto: "Pedido pelo site",
        mensagem: textoPedido(carrinho),
        origem,
        pacote: carrinho.itens.map((i) => i.nome).join(", "),
        estimativa: textoEstimativa(carrinho),
      });
      window.location.assign("/obrigado/");
    } catch {
      setEstado("falhou");
    }
  }

  return (
    <form className="grid gap-4" onSubmit={aoEnviar}>
      <p className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          {tf.isca} <input name="site_empresa" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <label className={campo}>
        <span>{t.nome}</span>
        <input className={entrada} name="nome" required maxLength={80} autoComplete="name" />
      </label>
      <label className={campo}>
        <span>{t.whatsapp}</span>
        <input
          className={entrada}
          name="whatsapp"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          pattern="[0-9()+\-\s]{10,20}"
          maxLength={20}
        />
      </label>
      <button
        className={`${botaoCheio} w-full cursor-pointer justify-center font-[inherit] aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:cursor-wait disabled:opacity-60`}
        type="submit"
        aria-disabled={vazio ? "true" : undefined}
        disabled={estado === "enviando"}
      >
        {estado === "enviando" ? t.enviando : t.enviar}
      </button>
      {vazio && <p className="m-0 text-[0.9rem] text-texto-suave">{t.vazioAviso}</p>}
      {estado === "falhou" && (
        <div className="border-l-[3px] border-destaque bg-realce p-3" role="alert">
          <p className="mb-2">{t.falhou}</p>
          <p className="m-0 flex flex-wrap gap-3">
            <a className={botao} href={linkWhatsappCarrinho(carrinho, origem)} target="_blank" rel="noopener">
              WhatsApp
            </a>
            <a className={botao} href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
        </div>
      )}
    </form>
  );
}

type Props = {
  carrinho: DadosCarrinho;
  aoEditar: (id: string) => void;
  aoTirar: (id: string) => void;
};

/** Carrinho: itens, resumo de valores e as duas formas de fechar, com o mesmo peso. */
export function Carrinho({ carrinho: c, aoEditar, aoTirar }: Props) {
  const vazio = c.itens.length === 0;

  return (
    <div>
      <h3 id="orc-foco-carrinho" tabIndex={-1} className="mb-3 text-[1.15rem] font-bold focus:outline-none">
        {t.titulo}
      </h3>

      {vazio ? (
        <p className="border-t-2 border-texto pt-4 text-texto-suave">{t.vazio}</p>
      ) : (
        <ul className="m-0 list-none border-t-2 border-texto p-0">
          {c.itens.map((i) => (
            <li key={i.id} className="border-b border-linha py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{i.nome}</span>
                <span className="shrink-0 text-right font-mono text-[0.9rem]">{textoPrecoItem(i)}</span>
              </div>
              <div className="-ml-2 flex gap-2">
                <button type="button" className={botaoTexto} onClick={() => aoEditar(i.id)}>
                  {t.editar}
                  <span className="sr-only">: {i.nome}</span>
                </button>
                <button type="button" className={botaoTexto} onClick={() => aoTirar(i.id)}>
                  {t.tirar}
                  <span className="sr-only">: {i.nome}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!vazio && (
        <>
          <dl className="my-4 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-[0.95rem]">
            <dt>{t.soma}</dt>
            <dd className="m-0 text-right font-mono">{brl(c.somaTabela)}</dd>
            {c.desconto && (
              <>
                <dt>{t.desconto(c.desconto.rotulo)}</dt>
                <dd className="m-0 text-right font-mono text-destaque">− {brl(c.desconto.valor)}</dd>
              </>
            )}
            {c.prazoCombinaveis && (
              <>
                <dt>{t.prazo}</dt>
                <dd className="m-0 text-right font-mono">{c.prazoCombinaveis.texto}</dd>
              </>
            )}
            {c.prazosOutros.map((p) => (
              <div key={p.nome} className="col-span-full flex justify-between gap-4 text-texto-suave">
                <dt>{p.nome}</dt>
                <dd className="m-0 text-right font-mono">{p.texto}</dd>
              </div>
            ))}
            {c.mensalidade > 0 && (
              <>
                <dt>{t.mensalidade}</dt>
                <dd className="m-0 text-right font-mono">{orcamento.estimativa.valorMensalidade(brl(c.mensalidade))}</dd>
              </>
            )}
          </dl>
          {c.desconto && <p className="text-[0.85rem] text-texto-suave">{t.descontoNota}</p>}

          <div className="border-t-2 border-texto pt-3" aria-live="polite" aria-atomic="true">
            <p className="mb-1 text-[0.95rem] font-semibold">
              {t.total}
              {c.totalAPartirDe && <span className="font-normal text-texto-suave"> · {orcamento.estimativa.aPartirDe}</span>}
            </p>
            <p className="m-0 font-mono [word-spacing:-0.3em] text-[clamp(2rem,7vw,2.6rem)] leading-none font-bold tracking-[-0.02em]">{brl(c.total)}</p>
          </div>
          {c.temSobConsulta && <p className="mt-2 text-[0.85rem] text-texto-suave">{t.totalSobConsulta}</p>}
          <p className="mt-2 text-[0.85rem] text-texto-suave">{t.notaEstimativa}</p>
        </>
      )}

      <h3 className="mt-8 mb-3 text-[1.15rem] font-bold">{t.comoFechar}</h3>
      <div className="grid gap-6">
        <section className="border border-linha p-4" aria-labelledby="orc-fechar-site">
          <h4 id="orc-fechar-site" className="mb-1 text-[1rem] font-bold">
            {t.pelosite}
          </h4>
          <p className="mb-3 text-[0.95rem] text-texto-suave">{t.pelositeTexto}</p>
          <FecharPeloSite carrinho={c} />
        </section>
        <section className="border border-linha p-4" aria-labelledby="orc-fechar-whatsapp">
          <h4 id="orc-fechar-whatsapp" className="mb-1 text-[1rem] font-bold">
            WhatsApp
          </h4>
          <p className="mb-3 text-[0.95rem] text-texto-suave">{t.whatsappTexto}</p>
          <a
            className={`${botaoCheio} w-full justify-center`}
            href={linkWhatsappCarrinho(c, origem)}
            target="_blank"
            rel="noopener"
          >
            {t.whatsappBotao}
          </a>
        </section>
      </div>
      <p className="mt-4 text-[0.85rem] text-texto-suave">{t.privacidade}</p>
    </div>
  );
}
