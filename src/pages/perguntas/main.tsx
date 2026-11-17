import "../../styles/tailwind.css";
import "../../styles/tema-negocios.css";
// Texto importado direto do arquivo (e não de content/textos) para só esta página carregá-lo.
import { perguntasFrequentes } from "../../content/textos/perguntasFrequentes";
import { montarPaginaTexto } from "../../shared/components/PaginaTexto";

montarPaginaTexto(perguntasFrequentes, "perguntas-rodape");
