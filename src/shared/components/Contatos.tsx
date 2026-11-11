import { site } from "../../content/site";
import { emailjsConfigurado } from "../lib/emailjs";
import { negocios } from "../../content/textos";
import { linkContato } from "../lib/whatsapp";
import { botao } from "../estilos";
import { Formulario } from "./Formulario";


type Props = { origem: string; comFormulario?: boolean };

const t = negocios.contato;
const nomeCanal = "mb-2 font-texto text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave";

/** WhatsApp, e-mail e formulário com o mesmo peso. */
export function Contatos({ origem, comFormulario = true }: Props) {
  const assunto = encodeURIComponent(`Contato pelo site (origem: ${origem})`);
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-x-9">
      <div>
        <h3 className={nomeCanal}>{t.whatsapp}</h3>
        <a className={botao} href={linkContato(origem)} target="_blank" rel="noopener">
          {formatarTelefone(site.whatsapp)}
        </a>
      </div>
      <div>
        <h3 className={nomeCanal}>{t.email}</h3>
        <a className={botao} href={`mailto:${site.email}?subject=${assunto}`}>
          {site.email}
        </a>
      </div>
      {comFormulario && emailjsConfigurado() && (
        <div className="md:col-span-full md:max-w-xl">
          <h3 className={nomeCanal}>{t.formulario}</h3>
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
