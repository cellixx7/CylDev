import "../../styles/tailwind.css";
import "../../styles/tema-negocios.css";
// Texto importado direto do arquivo (e não de content/textos) para só esta página carregá-lo.
import { acessibilidade } from "../../content/textos/acessibilidade";
import { montarPaginaTexto } from "../../shared/components/PaginaTexto";

montarPaginaTexto(acessibilidade, "acessibilidade-rodape");
