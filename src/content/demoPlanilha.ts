// Demonstração animada da planilha (página Como funciona). Todo texto e todo dado ficam aqui.
import { demoComum, type PassoDemo } from "./demos";

// Os dados são fictícios e a página os rotula assim. Nenhum número aqui é resultado real de cliente.

export type LinhaDemo = {
  id: string;
  /** Data: [como foi digitada, depois de padronizar (passo 1 em diante)]. */
  data: [string, string];
  /** Anotação livre: [digitada, com o nome padronizado (passo 2 em diante)]. */
  nota: [string, string];
  /** Colunas separadas (passo 4 em diante): cliente, item e valor. */
  colunas: [string, string, string];
  /** Passo em que a linha sai da tabela (repetida ou vazia). Ausente = fica. */
  saiNoPasso?: number;
};

export const demoPlanilha = {
  ...demoComum,
  titulo: "Veja uma planilha sendo arrumada",
  resultado: "Agora eu consigo preencher e conferir sem me perder.",
  comecoRotulo: "Como a planilha chega",
  comecoDescricao: "Datas e nomes escritos de jeitos diferentes, linhas repetidas e uma linha vazia.",
  tabelaAntes: "Tabela antes da arrumação",
  tabelaDepois: "Tabela depois da arrumação",
  tabelaAtual: "Tabela de exemplo",
  cabecalhoBagunca: ["Data", "Anotação"],
  cabecalhoColunas: ["Data", "Cliente", "Item", "Valor"],
  passos: [
    { titulo: "Padroniza as datas", descricao: "Todas passam a ser dia/mês, do mesmo jeito." },
    { titulo: "Padroniza os nomes", descricao: "Maiúsculas e minúsculas no lugar certo." },
    { titulo: "Remove repetidas e vazias", descricao: "Uma linha repetida e uma linha vazia saem da tabela." },
    { titulo: "Separa em colunas", descricao: "Cliente, item e valor, cada um no seu lugar." },
    { titulo: "Confere os totais", descricao: "A soma bate com os pedidos que sobraram." },
  ] satisfies PassoDemo[],
  /** Total mostrado na última linha, conforme o passo atual. */
  totais: {
    comRepetida: "Total: R$ 185 (tem linha repetida, não bate)",
    semConferir: "Total: R$ 145 (falta conferir)",
    conferido: "Total: R$ 145, conferido com os 3 pedidos",
  },
  linhas: [
    { id: "a", data: ["2 jan", "02/01"], nota: ["MARIA - camisa - 80", "Maria - camisa - 80"], colunas: ["Maria", "Camisa", "R$ 80"] },
    { id: "b", data: ["3/1", "03/01"], nota: ["joão camisa 40", "João camisa 40"], colunas: ["João", "Camisa", "R$ 40"] },
    { id: "c", data: ["3 de jan", "03/01"], nota: ["JOÃO camisa 40", "João camisa 40"], colunas: ["João", "Camisa", "R$ 40"], saiNoPasso: 3 },
    { id: "d", data: ["", ""], nota: ["", ""], colunas: ["", "", ""], saiNoPasso: 3 },
    { id: "e", data: ["05-jan", "05/01"], nota: ["ana caneca 25", "Ana caneca 25"], colunas: ["Ana", "Caneca", "R$ 25"] },
  ] satisfies LinhaDemo[],
};

/** Serviços cuja demonstração animada já existe (piloto: só a planilha). */
export const servicosComDemo: Record<string, string> = { planilha: "planilhas" };
