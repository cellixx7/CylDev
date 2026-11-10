import { useRef, useState, type FormEvent } from "react";
import { site } from "../../content/site";
import { formulario as tf, orcamento } from "../../content/textos";
import { botao, botaoCheio } from "../../shared/estilos";
import { enviarContato, pareceSpam } from "../../shared/lib/emailjs";
import { dadosEmailPedido, linkWhatsappPedido, type Pedido } from "../../shared/lib/pedido";

const t = orcamento.carrinho;
const origem = "negocios-carrinho";

const campo = "grid gap-1 text-[0.9rem] font-semibold";
const entrada =
  "min-h-alvo rounded-pequeno border border-texto-suave bg-superficie px-3 py-2 font-normal text-texto focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco";

type Estado = "pronto" | "enviando" | "falhou";

function EnviarPeloSite({ pedido }: { pedido: Pedido }) {
  const [estado, setEstado] = useState<Estado>("pronto");
  const abertoEm = useRef(Date.now());
  const vazio = pedido.itens.length === 0;

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
      await enviarContato(dadosEmailPedido(pedido, { nome: valor("nome"), whatsapp: valor("whatsapp") }, origem));
      window.location.assign("/obrigado/");
    } catch {
      setEstado("falhou");
    }
  }

  return (
    <form className="grid gap-3" onSubmit={aoEnviar}>
      <p className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          {tf.isca} <input name="site_empresa" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
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
      </div>
      <button
        className={`${botaoCheio} w-full cursor-pointer justify-center font-[inherit] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco disabled:cursor-not-allowed disabled:opacity-50`}
        type="submit"
        disabled={vazio || estado === "enviando"}
      >
        {estado === "enviando" ? t.enviando : t.enviar}
      </button>
      {estado === "falhou" && (
        <div className="border-l-[3px] border-destaque bg-realce p-3" role="alert">
          <p className="mb-2">{t.falhou}</p>
          <p className="m-0 flex flex-wrap gap-3">
            <a className={botao} href={linkWhatsappPedido(pedido, origem) ?? "#"} target="_blank" rel="noopener">
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

type Props = { pedido: Pedido };

/** Duas formas de enviar o mesmo pedido, com o mesmo peso visual: mesmo cartão e mesmo botão cheio, uma sobre a outra. */
export function CheckoutPedido({ pedido }: Props) {
  const link = linkWhatsappPedido(pedido, origem);
  return (
    <div>
      <h4 className="mb-3 text-[1.1rem] font-bold">{t.comoFechar}</h4>
      <div className="grid gap-3">
        <section className="border border-linha bg-superficie p-4" aria-labelledby="orc-fechar-site">
          <h5 id="orc-fechar-site" className="mb-1 text-[1rem] font-bold">
            {t.pelosite}
          </h5>
          <p className="mb-3 text-[0.9rem] text-texto-suave">{t.pelositeNota}</p>
          <EnviarPeloSite pedido={pedido} />
        </section>
        <section className="border border-linha bg-superficie p-4" aria-labelledby="orc-fechar-whatsapp">
          <h5 id="orc-fechar-whatsapp" className="mb-1 text-[1rem] font-bold">
            {t.pelowhats}
          </h5>
          <p className="mb-3 text-[0.9rem] text-texto-suave">{t.pelowhatsNota}</p>
          {link ? (
            <a className={`${botaoCheio} w-full justify-center`} href={link} target="_blank" rel="noopener">
              {t.whatsappBotao}
            </a>
          ) : (
            <button type="button" className={`${botaoCheio} w-full justify-center font-[inherit] disabled:opacity-50`} disabled>
              {t.whatsappBotao}
            </button>
          )}
        </section>
      </div>
      <p className="mt-3 mb-0 text-[0.82rem] text-texto-suave">{t.privacidade}</p>
    </div>
  );
}
