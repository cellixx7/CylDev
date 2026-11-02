import { site } from "../../content/site";
import { negocios } from "../../content/textos";
import { linkContato } from "../lib/whatsapp";

type Props = { origem: string; comFormulario?: boolean };

const t = negocios.contato;

/** WhatsApp, e-mail e formulário com o mesmo peso. */
export function Contatos({ origem, comFormulario = true }: Props) {
  const assunto = encodeURIComponent(`Contato pelo site (origem: ${origem})`);
  return (
    <div className="contatos">
      <div className="contatos__canal">
        <h3 className="contatos__nome">{t.whatsapp}</h3>
        <a className="botao" href={linkContato(origem)} target="_blank" rel="noopener">
          {formatarTelefone(site.whatsapp)}
        </a>
      </div>
      <div className="contatos__canal">
        <h3 className="contatos__nome">{t.email}</h3>
        <a className="botao" href={`mailto:${site.email}?subject=${assunto}`}>
          {site.email}
        </a>
      </div>
      {comFormulario && (
        <div className="contatos__canal contatos__canal--formulario">
          <h3 className="contatos__nome">{t.formulario}</h3>
          {/* O formulário estático gêmeo fica no HTML da página para a Netlify detectar. */}
          <form
            className="formulario"
            name="contato"
            method="POST"
            action="/obrigado/"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
          >
            <input type="hidden" name="form-name" value="contato" />
            <input type="hidden" name="origem" value={origem} />
            <p className="formulario__isca" aria-hidden="true">
              <label>
                Não preencha: <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>
            <label className="formulario__campo">
              <span>{t.campos.nome}</span>
              <input name="nome" required autoComplete="name" />
            </label>
            <label className="formulario__campo">
              <span>{t.campos.contato}</span>
              <input name="contato" required autoComplete="email" />
            </label>
            <label className="formulario__campo">
              <span>{t.campos.mensagem}</span>
              <textarea name="mensagem" rows={4} required />
            </label>
            <button className="botao botao--cheio" type="submit">
              {t.campos.enviar}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function formatarTelefone(numero: string): string {
  const m = numero.match(/^55(\d{2})(\d{5})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : numero;
}
