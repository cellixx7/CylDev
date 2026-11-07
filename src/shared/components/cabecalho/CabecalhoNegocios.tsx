import { site } from "../../../content/site";
import { negocios } from "../../../content/textos";
import { Cabecalho } from "./Cabecalho";
import { ControleComunidade } from "./ControleComunidade";

/** Cabeçalho único de todas as páginas de /negocios (mesma marca, links e estilo). */
export function CabecalhoNegocios() {
  return (
    <Cabecalho
      area="negocios"
      temaPadrao="escuro"
      marca={site.nome}
      links={negocios.nav}
      centro={<ControleComunidade {...negocios.atalhoComunidade} />}
    />
  );
}
