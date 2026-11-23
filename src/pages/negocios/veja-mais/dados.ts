// Dados da seção "Veja mais". Este módulo é carregado com import() só quando a seção chega perto da tela:
// os CSV (texto, `?raw`) e a lógica do painel não entram no JavaScript inicial da home.
import { exemploPlanilha, type AbaBagunca } from "../../../content/exemploPlanilha";
import { lerCsv } from "../../../shared/lib/csv";
import { vendasDoCsv, type Venda } from "../../../shared/lib/painelPlanilha";
import arrumada from "../../../content/exemplo-planilha/planilha-arrumada.csv?raw";
import planilha1 from "../../../content/exemplo-planilha/bagunca-1-janeiro-Planilha1.csv?raw";
import fev from "../../../content/exemplo-planilha/bagunca-2-fev.csv?raw";
import fev2 from "../../../content/exemplo-planilha/bagunca-3-fev-copia.csv?raw";
import marco from "../../../content/exemplo-planilha/bagunca-4-marco-novo.csv?raw";
import contas from "../../../content/exemplo-planilha/bagunca-5-contas.csv?raw";

export type DadosVejaMais = {
  /** Uma lista de linhas por aba, com a bagunça intacta. */
  bagunca: Record<AbaBagunca, string[][]>;
  arrumada: string[][];
  vendas: Venda[];
};

const textoDaAba: Record<AbaBagunca, string> = { planilha1, fev, "fev-2": fev2, "marco-novo": marco, contas };

export function carregarDados(): DadosVejaMais {
  // Quando `urlCsvPublicado` for usado, o fetch entra aqui (ver exemploPlanilha.ts). Hoje só há os arquivos locais.
  void exemploPlanilha.urlCsvPublicado;
  const bagunca = Object.fromEntries(Object.entries(textoDaAba).map(([id, texto]) => [id, lerCsv(texto)])) as DadosVejaMais["bagunca"];
  return { bagunca, arrumada: lerCsv(arrumada, { descartarVazias: true }), vendas: vendasDoCsv(arrumada) };
}
