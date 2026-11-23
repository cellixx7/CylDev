// Todos os textos das páginas, divididos por área. Fonte original: docs/COPY.md (versão 2, respostas do Marcelo em 02/11/2026).
// Importe sempre de "content/textos" (este arquivo); os arquivos ao lado são só a organização interna.
//   comum.ts      rótulos gerais, catálogo, piloto e formulário
//   orcamento.ts  seção #orcamento de Negócios
//   negocios.ts   home de Negócios (menu, hero, painel, como funciona, contato)
//   sobre.ts      seção Sobre de Negócios (parágrafos e modais)
//   comunidade.ts área Comunidade
//   paginas.ts    obrigado, 404 e os rótulos das páginas de leitura
//   versoes.ts    data da versão dos Termos e da privacidade (vai no registro de aceite do pedido)
//   tipos.ts      formato das páginas de leitura (PaginaDeTexto)
//
// Exceção: os textos longos das páginas de leitura NÃO são reexportados aqui, para não irem junto no JavaScript
// da home. Cada página importa o seu direto do arquivo (como faz src/pages/termos/main.tsx):
//   termos.ts               Termos de contratação (/termos/)
//   privacidade.ts          Política de privacidade (/privacidade/)
//   acessibilidade.ts       declaração de acessibilidade (/acessibilidade/)
//   perguntasFrequentes.ts  perguntas frequentes (/perguntas/)
//   assistente.ts           textos do chat de Negócios (só o chat, carregado ao abrir, importa)
// Página nova de leitura segue esse modelo; as demais ganham um arquivo próprio aqui e uma linha abaixo.
export { catalogo, comum, formulario, piloto, pilotoNota } from "./comum";
export { orcamento } from "./orcamento";
export { negocios } from "./negocios";
export { vejaMais } from "./vejaMais";
export { sobre, type DestaqueSobre, type ModalSobre, type ParteSobre } from "./sobre";
export { comunidade } from "./comunidade";
export { naoEncontrado, obrigado, paginaDeTexto } from "./paginas";
export { versoes } from "./versoes";
export type { BlocoTexto, PaginaDeTexto, SecaoTexto } from "./tipos";
