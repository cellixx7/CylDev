import { useRef, useState, type FormEvent } from "react";
import { site } from "../../content/site";
import { formulario as t } from "../../content/textos";
import { enviarContato, pareceSpam } from "../lib/emailjs";
import { linkContato } from "../lib/whatsapp";
import { botao, botaoCheio } from "../estilos";

const campo =
  "grid gap-1 font-semibold";
const entrada =
  "min-h-alvo rounded-pequeno border border-texto-suave bg-superficie px-3 py-2 font-normal text-texto";
const radio = "m-[3px_3px_3px_4px] accent-destaque";

type Estado = "pronto" | "enviando" | "falhou";

type Props = {
  origem: string;
  /** Resumo do pedido (vem da calculadora). Vai antes da mensagem, que passa a ser opcional. */
  resumo?: string;
};

/** Formulário de contato enviado pelo EmailJS. Se falhar, mostra WhatsApp e e-mail. */
export function Formulario({ origem, resumo }: Props) {
  const [preferencia, setPreferencia] = useState<"whatsapp" | "email">("whatsapp");
  const [estado, setEstado] = useState<Estado>("pronto");
  const abertoEm = useRef(Date.now());

  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
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
        preferencia,
        contato: valor(preferencia),
        assunto: preferencia === "email" ? valor("assunto") : "",
        mensagem: [resumo, valor("mensagem")].filter(Boolean).join("\n\n"),
        origem,
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
          {t.isca} <input name="site_empresa" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <label className={campo}>
        <span>{t.nome}</span>
        <input className={entrada} name="nome" required maxLength={80} autoComplete="name" />
      </label>
      <fieldset className="m-0 flex flex-wrap gap-x-6 gap-y-2 border-0 p-0">
        <legend className="mb-2 w-full px-[2px] font-semibold">{t.preferencia}</legend>
        <label className="inline-flex min-h-alvo items-center gap-2">
          <input
            className={radio}
            type="radio"
            name="preferencia"
            value="whatsapp"
            checked={preferencia === "whatsapp"}
            onChange={() => setPreferencia("whatsapp")}
          />{" "}
          {t.porWhatsapp}
        </label>
        <label className="inline-flex min-h-alvo items-center gap-2">
          <input
            className={radio}
            type="radio"
            name="preferencia"
            value="email"
            checked={preferencia === "email"}
            onChange={() => setPreferencia("email")}
          />{" "}
          {t.porEmail}
        </label>
      </fieldset>
      {preferencia === "whatsapp" ? (
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
      ) : (
        <>
          <label className={campo}>
            <span>{t.email}</span>
            <input className={entrada} name="email" type="email" required maxLength={120} autoComplete="email" />
          </label>
          <label className={campo}>
            <span>{t.assunto}</span>
            <input className={entrada} name="assunto" maxLength={120} />
          </label>
        </>
      )}
      {resumo && (
        <div className="border-l-[3px] border-destaque bg-realce px-3 py-2 text-[0.95rem]">
          <p className="m-0 font-semibold">{t.resumo}</p>
          <p className="m-0 text-texto-suave" aria-live="polite">
            {resumo}
          </p>
        </div>
      )}
      <label className={campo}>
        <span>{resumo ? t.mensagemOpcional : t.mensagem}</span>
        <textarea
          className={`${entrada} resize`}
          name="mensagem"
          rows={resumo ? 3 : 4}
          required={!resumo}
          maxLength={2000}
        />
      </label>
      <button className={`${botaoCheio} cursor-pointer justify-self-start disabled:cursor-wait disabled:opacity-60`} type="submit" disabled={estado === "enviando"}>
        {estado === "enviando" ? t.enviando : t.enviar}
      </button>
      {estado === "falhou" && (
        <div className="border-l-[3px] border-destaque bg-realce p-3" role="alert">
          <p>{t.falhou}</p>
          <p className="mt-2 flex flex-wrap gap-3">
            <a className={botao} href={linkContato(origem, resumo)} target="_blank" rel="noopener">
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
