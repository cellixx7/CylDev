import { site } from "../../content/site";
import { negocios } from "../../content/textos";
import { linkContato } from "../lib/whatsapp";
import { Formulario } from "./Formulario";

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
          <Formulario origem={origem} />
        </div>
      )}
    </div>
  );
}

function formatarTelefone(numero: string): string {
  const m = numero.match(/^55(\d{2})(\d{5})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : numero;
}
