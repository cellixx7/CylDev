// Planilha de exemplo da seção "Veja mais" (home de Negócios): loja fictícia, os mesmos dados nos três cards.
// Os CSV ficam em src/content/exemplo-planilha/ e entram no site com `?raw` (texto dentro do próprio JavaScript,
// carregado só quando a seção chega perto da tela). Não há fetch nem chamada externa. Tudo aqui é dado de exemplo.

export const exemploPlanilha = {
  /**
   * Ponto de extensão: endereço de um CSV publicado (por exemplo, "Publicar na web" do Google Sheets).
   * Hoje é null e nada é buscado. Se um dia for preenchido, o fetch entra em `dados.ts` e a CSP e a Privacidade
   * precisam ser revistas antes (ver docs/decisoes/veja-mais.md).
   */
  urlCsvPublicado: null as string | null,

  /** Abas da planilha bagunçada, na ordem em que aparecem (o nome é o que está na aba, com a bagunça). */
  abasBagunca: [
    { id: "planilha1", nome: "Planilha1" },
    { id: "fev", nome: "Fev" },
    { id: "fev-2", nome: "Fev (2)" },
    { id: "marco-novo", nome: "MARÇO NOVO" },
    { id: "contas", nome: "Contas" },
  ],
};

export type AbaBagunca = (typeof exemploPlanilha.abasBagunca)[number]["id"];
