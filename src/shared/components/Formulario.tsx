import { useRef, useState, type FormEvent } from "react";
import { site } from "../../content/site";
import { formulario as t } from "../../content/textos";
import { enviarContato, pareceSpam } from "../lib/emailjs";
import { linkContato } from "../lib/whatsapp";

type Estado = "pronto" | "enviando" | "falhou";

/** Formulário de contato enviado pelo EmailJS. Se falhar, mostra WhatsApp e e-mail. */
export function Formulario({ origem }: { origem: string }) {
  const [preferencia, setPreferencia] = useState<"whatsapp" | "email">("whatsapp");
  const [estado, setEstado] = useState<Estado>("pronto");
  const abertoEm = useRef(Date.now());

  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const campo = (nome: string) => String(f.get(nome) ?? "").trim();

    // Spam: finge sucesso para não ensinar o robô a contornar a proteção.
    if (pareceSpam(campo("site_empresa"), abertoEm.current)) {
      window.location.assign("/obrigado/");
      return;
    }

    setEstado("enviando");
    try {
      await enviarContato({
        nome: campo("nome"),
        preferencia,
        contato: campo(preferencia),
        assunto: preferencia === "email" ? campo("assunto") : "",
        mensagem: campo("mensagem"),
        origem,
      });
      window.location.assign("/obrigado/");
    } catch {
      setEstado("falhou");
    }
  }

  return (
    <form className="formulario" onSubmit={aoEnviar}>
      <p className="formulario__isca" aria-hidden="true">
        <label>
          {t.isca} <input name="site_empresa" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <label className="formulario__campo">
        <span>{t.nome}</span>
        <input name="nome" required maxLength={80} autoComplete="name" />
      </label>
      <fieldset className="formulario__escolha">
        <legend>{t.preferencia}</legend>
        <label>
          <input
            type="radio"
            name="preferencia"
            value="whatsapp"
            checked={preferencia === "whatsapp"}
            onChange={() => setPreferencia("whatsapp")}
          />{" "}
          {t.porWhatsapp}
        </label>
        <label>
          <input
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
        <label className="formulario__campo">
          <span>{t.whatsapp}</span>
          <input
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
          <label className="formulario__campo">
            <span>{t.email}</span>
            <input name="email" type="email" required maxLength={120} autoComplete="email" />
          </label>
          <label className="formulario__campo">
            <span>{t.assunto}</span>
            <input name="assunto" maxLength={120} />
          </label>
        </>
      )}
      <label className="formulario__campo">
        <span>{t.mensagem}</span>
        <textarea name="mensagem" rows={4} required maxLength={2000} />
      </label>
      <button className="botao botao--cheio" type="submit" disabled={estado === "enviando"}>
        {estado === "enviando" ? t.enviando : t.enviar}
      </button>
      {estado === "falhou" && (
        <div className="formulario__falha" role="alert">
          <p>{t.falhou}</p>
          <p className="formulario__alternativas">
            <a className="botao" href={linkContato(origem)} target="_blank" rel="noopener">
              WhatsApp
            </a>
            <a className="botao" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
        </div>
      )}
    </form>
  );
}
