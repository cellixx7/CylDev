import type { ServicoOrcamento } from "../../content/perguntas";
import type { CalculoServico, Respostas } from "../../shared/lib/orcamento";
import type { EstadoEstimativa, Progresso } from "../../shared/lib/pedido";
import { ConfiguradorServico } from "./ConfiguradorServico";
import { ResumoEstimativa } from "./ResumoEstimativa";

type Props = {
  modelo: ServicoOrcamento;
  respostas: Respostas;
  calculo: CalculoServico;
  progresso: Progresso;
  estado: EstadoEstimativa;
  aoResponder: (perguntaId: string, opcaoId: string) => void;
};

/** Aba Orçamento: as perguntas e, abaixo, a estimativa com o "como chegamos a esse valor" (recolhido). */
export function AbaOrcamento({ modelo, respostas, calculo, progresso, estado, aoResponder }: Props) {
  return (
    <div className="grid gap-8">
      <ConfiguradorServico modelo={modelo} respostas={respostas} progresso={progresso} aoResponder={aoResponder} />
      <ResumoEstimativa nome={modelo.nome} calculo={calculo} progresso={progresso} estado={estado} />
    </div>
  );
}
