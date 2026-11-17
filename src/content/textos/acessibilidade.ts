// Declaração de acessibilidade (página /acessibilidade/). Etapa 5 da auditoria de 16/11/2026.
// Faz parte de src/content/textos/ (ver index.ts). Formato em tipos.ts; links como [rótulo](endereço).
// Só entra aqui o que o site faz de verdade (docs/DESIGN.md e os testes de e2e/). Nada de selo ou nota inventada.
import { site } from "../site";
import type { PaginaDeTexto } from "./tipos";

const VERSAO = "16/11/2026";
const email = `[${site.email}](mailto:${site.email})`;

export const acessibilidade: PaginaDeTexto = {
  titulo: "Acessibilidade",
  versao: VERSAO,
  atualizado: `Versão de ${VERSAO}.`,
  intro: ["Quero que qualquer pessoa consiga ler este site e pedir um orçamento, com mouse, teclado, toque ou leitor de tela. Esta página diz o que o site já faz, o que ainda falta e como avisar de um problema."],
  secoes: [
    {
      id: "faz",
      titulo: "O que o site faz",
      texto: ["O site foi feito tendo como referência as Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1, nível AA. Na prática:"],
      itens: [
        "dá para usar tudo pelo teclado, com o foco sempre visível e um atalho para pular direto ao conteúdo;",
        "os botões e links têm pelo menos 44 px de altura, para o toque no celular;",
        "nenhum texto é menor do que 14 px, e o texto de leitura tem 16 px;",
        "há tema claro e tema escuro, com cores escolhidas para manter o contraste;",
        "as animações só aparecem para quem não pediu ao sistema para reduzir movimento;",
        "os títulos seguem uma ordem, sem pular nível, e as janelas (orçamento, carrinho) prendem o foco e fecham com Esc;",
        "não há rolagem para os lados no celular;",
        "gráficos e esquemas têm descrição em texto.",
      ],
    },
    {
      id: "limites",
      titulo: "O que ainda falta",
      itens: [
        "O site não passou por auditoria externa de acessibilidade. Os pontos acima são conferidos por testes automáticos e por revisão minha.",
        "Ainda não testei todas as páginas com leitor de tela em um celular de verdade. Pode haver trecho que não leia bem.",
        "As demonstrações animadas de Como funciona dependem de JavaScript.",
      ],
    },
    {
      id: "avisar",
      titulo: "Como avisar de um problema",
      texto: [
        `Se alguma parte do site atrapalhar você, escreva para ${email} ou chame no [WhatsApp da página de contato](/#contato), dizendo a página e o que aconteceu. Eu respondo e corrijo.`,
        "Se preferir, peça o orçamento direto por esses canais, sem usar o site.",
      ],
    },
  ],
};
