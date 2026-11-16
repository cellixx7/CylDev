// Todos os textos das páginas, divididos por área. Fonte original: docs/COPY.md (versão 2, respostas do Marcelo em 02/11/2026).
// Importe sempre de "content/textos" (este arquivo); os arquivos ao lado são só a organização interna.
//   comum.ts      rótulos gerais, catálogo, piloto e formulário
//   orcamento.ts  seção #orcamento de Negócios
//   negocios.ts   home de Negócios (menu, hero, painel, como funciona, contato)
//   sobre.ts      seção Sobre de Negócios (parágrafos e modais)
//   comunidade.ts área Comunidade
//   paginas.ts    privacidade, obrigado e 404
// Novas páginas (Termos, FAQ...) ganham um arquivo próprio aqui e uma linha abaixo.
export { catalogo, comum, formulario, piloto, pilotoNota } from "./comum";
export { orcamento } from "./orcamento";
export { negocios } from "./negocios";
export { sobre, type DestaqueSobre, type ModalSobre, type ParteSobre } from "./sobre";
export { comunidade } from "./comunidade";
export { naoEncontrado, obrigado, privacidade } from "./paginas";
