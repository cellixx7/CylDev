import { site } from "../../content/site";
import { negocios } from "../../content/textos";
import { Cabecalho } from "./Cabecalho";

/** Cabeçalho único de todas as páginas de /negocios (mesma marca, links e estilo). */
export function CabecalhoNegocios() {
  return <Cabecalho flutuante area="negocios" temaPadrao="claro" marca={site.nome} links={negocios.nav} />;
}
