import "../../styles/tailwind.css";
import "../../styles/tema-negocios.css";
// Texto importado direto do arquivo (e não de content/textos) para só esta página carregá-lo.
import { termos } from "../../content/textos/termos";
import { montarPaginaTexto } from "../../shared/components/PaginaTexto";

montarPaginaTexto(termos, "termos-rodape");
