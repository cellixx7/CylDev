import { demoComum, type PassoDemo } from "./demos";

// Demonstração da automação (Como funciona). Dados fictícios; nenhum número aqui é resultado real de cliente.
// Nenhuma promessa de tempo ou de economia: o que dá para automatizar depende do caso de cada pessoa.

export type LinhaArquivo = { item: string; valor: number; situacao: "ok" | "cancelado" };
export type ArquivoDemo = { id: string; nome: string; linhas: LinhaArquivo[] };

export const demoAutomacao = {
  ...demoComum,
  titulo: "Veja uma tarefa repetida virar um clique",
  resultado: "Consigo deixar de repetir esse trabalho.",
  comecoRotulo: "Os três arquivos da semana",
  comecoDescricao: "Cada loja manda o seu arquivo. Toda semana alguém abre os três para montar o relatório.",
  passos: [
    { titulo: "Copia e cola numa aba só", descricao: "As linhas dos três arquivos são juntadas, uma por uma, numa tabela." },
    { titulo: "Filtra e apaga o que sobra", descricao: "As linhas canceladas saem da tabela." },
    { titulo: "Formata e confere os totais", descricao: "A soma é refeita e conferida com o que sobrou." },
    { titulo: "Com a automação, um clique", descricao: "O botão faz esses três passos de uma vez. O resultado é o mesmo, sem copiar e colar." },
  ] satisfies PassoDemo[],
  arquivos: [
    {
      id: "a",
      nome: "vendas-loja-a",
      linhas: [
        { item: "Camisa", valor: 80, situacao: "ok" },
        { item: "Boné", valor: 30, situacao: "cancelado" },
      ],
    },
    {
      id: "b",
      nome: "vendas-loja-b",
      linhas: [
        { item: "Caneca", valor: 25, situacao: "ok" },
        { item: "Camisa", valor: 40, situacao: "ok" },
      ],
    },
    {
      id: "c",
      nome: "vendas-loja-c",
      linhas: [
        { item: "Boné", valor: 30, situacao: "ok" },
        { item: "Casaco", valor: 120, situacao: "cancelado" },
      ],
    },
  ] as ArquivoDemo[],
  cabecalho: { arquivo: "Arquivo", item: "Item", valor: "Valor", situacao: "Situação" },
  situacao: { ok: "ok", cancelado: "cancelado" },
  botao: { rotulo: "Atualizar relatório", legenda: "Botão de exemplo, não é clicável aqui", clicado: "clicado" },
  totalRotulo: "Total",
  totalConferido: (valor: number, linhas: number) => `R$ ${valor}, conferido com ${linhas} linhas`,
  tabelaArquivo: (nome: string) => `Arquivo ${nome}`,
  tabelaJunta: "Relatório da semana",
  tabelaAntes: "Antes: os arquivos separados",
  tabelaDepois: "Depois: o relatório pronto",
  /** Aviso honesto sobre o alcance da automação. */
  aviso: "Nem toda tarefa dá para automatizar. Eu confirmo o que é possível na conversa, antes de combinar o trabalho.",
};
