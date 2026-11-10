import { useRef, useState, type FormEvent } from "react";
import { site } from "../../content/site";
import { formulario as tf, orcamento } from "../../content/textos";
import { botao, botaoCheio } from "../../shared/estilos";
import { enviarContato, pareceSpam } from "../../shared/lib/emailjs";
import { dadosEmailPedido, linkWhatsappPedido, type Pedido } from "../../shared/lib/pedido";

const t = orcamento.carrinho;
const origem = "negocios-carrinho";

/** O botão "Enviar pelo site" fica no rodapé do painel e envia este formulário pelo atributo `form`. */
export const ID_FORM_PEDIDO = "form-pedido";

const campo = "grid gap-1 text-[1rem] font-semibold";
// 16 px no campo: abaixo disso o Safari do iPhone dá zoom ao focar.
const entrada =
  "min-h-alvo rounded-pequeno border border-texto-suave bg-superficie px-3 py-2 text-[1rem] font-normal text-texto focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco";
const focoVisivel = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-foco";

export type EstadoEnvio = "pronto" | "enviando" | "falhou";

/** Envio pelo site (EmailJS). As regras de spam (campo isca e 3 s mínimos) ficam em emailjs.ts, sem mudança. */
export function useEnvioPedido(pedido: Pedido) {
  const [estado, setEstado] = useState<EstadoEnvio>("pronto");
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

  return { estado, aoEnviar };
}

type DadosProps = { pedido: Pedido; estado: EstadoEnvio; aoEnviar: (ev: FormEvent<HTMLFormElement>) => void };

/** Dados de contato para o envio pelo site. Nome e WhatsApp com tipo, autocomplete e teclado certos. */
export function DadosDoPedido({ pedido, estado, aoEnviar }: DadosProps) {
  return (
    <section aria-labelledby="orc-dados-titulo">
      <h3 id="orc-dados-titulo" className="mb-1 text-[1.1rem] font-bold">
        {t.dadosTitulo}
      </h3>
      <p className="mb-3 text-[1rem] text-texto-suave">{t.dadosNota}</p>
      <form id={ID_FORM_PEDIDO} className="grid gap-3" onSubmit={aoEnviar}>
        <p className="absolute -left-[9999px]" aria-hidden="true">
          <label>
            {tf.isca} <input name="site_empresa" tabIndex={-1} autoComplete="off" />
          </label>
        </p>
        <label className={campo}>
          <span>{t.nome}</span>
          <input className={entrada} name="nome" type="text" required maxLength={80} autoComplete="name" enterKeyHint="next" />
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
            enterKeyHint="send"
            pattern="[0-9()+\-\s]{10,20}"
            maxLength={20}
          />
        </label>
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
      <p className="mt-3 mb-0 text-[0.875rem] text-texto-suave">{t.privacidade}</p>
    </section>
  );
}

type AcoesProps = {
  pedido: Pedido;
  estado: EstadoEnvio;
  /** Teclado aberto no celular: só o botão de enviar fica, para não tomar a tela. */
  compacto?: boolean;
};

/**
 * As duas formas de fechar, com o mesmo peso visual (mesmo botão cheio, mesma largura e altura):
 * pelo site e direto no WhatsApp (link wa.me, que abre o app no celular).
 */
export function AcoesDoPedido({ pedido, estado, compacto = false }: AcoesProps) {
  const link = linkWhatsappPedido(pedido, origem);
  const vazio = pedido.itens.length === 0;
  const base = `${botaoCheio} w-full cursor-pointer justify-center text-center font-[inherit] ${focoVisivel} disabled:cursor-not-allowed disabled:opacity-50`;
  return (
    <div className="grid gap-2 min-[26rem]:grid-cols-2">
      <button className={base} type="submit" form={ID_FORM_PEDIDO} disabled={vazio || estado === "enviando"}>
        {estado === "enviando" ? t.enviando : t.enviar}
      </button>
      {link ? (
        <a className={`${base} ${compacto ? "max-md:hidden" : ""}`} href={link} target="_blank" rel="noopener">
          {t.whatsappBotao}
        </a>
      ) : (
        <button type="button" className={`${base} ${compacto ? "max-md:hidden" : ""}`} disabled>
          {t.whatsappBotao}
        </button>
      )}
    </div>
  );
}
