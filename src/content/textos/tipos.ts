// Formato das páginas de leitura (Termos, privacidade, acessibilidade, perguntas). Renderizadas por PaginaTexto.tsx.
// Os textos aceitam links no formato [rótulo](endereço) (ver shared/lib/texto-rico.ts).

/** Bloco com título próprio dentro de uma seção (uma pergunta e a resposta, por exemplo). */
export type BlocoTexto = { titulo: string; texto: string[] };

export type SecaoTexto = {
  /** Âncora estável da seção (`/termos/#pagamento`). Não troque depois de publicar: há links apontando para ela. */
  id: string;
  titulo: string;
  /** Parágrafos. */
  texto?: string[];
  /** Lista de itens, depois dos parágrafos. */
  itens?: string[];
  /** Parágrafos depois da lista. */
  depois?: string[];
  blocos?: BlocoTexto[];
};

export type PaginaDeTexto = {
  titulo: string;
  /** Data da versão (DD/MM/AAAA). Entra na linha de vigência e no registro de aceite do pedido. */
  versao: string;
  /** Linha abaixo do título, com a data. */
  atualizado: string;
  intro: string[];
  /** Numera os títulos das seções (1., 2., ...), como em contrato. */
  numerada?: boolean;
  secoes: SecaoTexto[];
};
