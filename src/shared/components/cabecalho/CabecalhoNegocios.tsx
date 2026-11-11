import { site } from "../../../content/site";
import { negocios } from "../../../content/textos";
import { Cabecalho } from "./Cabecalho";
import { ControleComunidade } from "./ControleComunidade";

/** Só entram no menu os links sem seção ou com a flag ligada em site.menuSecoes. */
export const linksDoMenu = negocios.nav.filter((l) => !l.secao || site.menuSecoes[l.secao]);

/** Cabeçalho único de todas as páginas de Negócios (mesma marca, links e estilo). */
export function CabecalhoNegocios() {
  return (
    <Cabecalho
      area="negocios"
      temaPadrao="escuro"
      marca={site.nome}
      links={linksDoMenu}
      centro={<ControleComunidade {...negocios.atalhoComunidade} />}
    />
  );
}
