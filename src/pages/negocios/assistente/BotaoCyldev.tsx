import { useRef } from "react";
import { assistente as t } from "../../../content/textos/assistente";
import { negocios } from "../../../content/textos";
import { Cyl, type ControleCyl } from "../../../shared/components/cyl/Cyl";
import { focoVisivel } from "../../../shared/estilos";

/**
 * Botão circular ao lado do painel (só em tela larga, onde há espaço): o Cyl dando joinha. Ao passar o mouse ou focar com o
 * teclado ele pisca (sem movimento reduzido); ao clicar, vai para a área CylDev/Comunidade (mesmo destino do Cyl do header).
 * Sem texto de dica: o nome acessível vai no aria-label.
 */
export function BotaoCyldev() {
  const cyl = useRef<ControleCyl>(null);
  return (
    <a
      href={negocios.atalhoComunidade.href}
      aria-label={t.conhecerCyldev}
      data-testid="botao-cyldev"
      onPointerEnter={(e) => e.pointerType === "mouse" && cyl.current?.tocar()}
      onFocus={() => cyl.current?.tocar()}
      className={`absolute top-0 right-full mr-2 hidden size-14 overflow-hidden rounded-full border border-linha bg-realce md:block [-webkit-tap-highlight-color:transparent] ${focoVisivel}`}
    >
      <Cyl ref={cyl} autoplay={false} animation="piscar" pose="joinha" recorte="joinha" background="circle" size={56} />
    </a>
  );
}
