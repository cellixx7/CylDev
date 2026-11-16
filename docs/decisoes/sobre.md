# Seção Sobre

Texto, destaques, modais, UniSER e cenas animadas da seção Sobre. Seções em ordem de data; a mais nova fica no fim.

## Seção Sobre (13/11/2026)

- **Onde:** `Sobre.tsx` em `#sobre` (depois do Orçamento e do exemplo de painel no celular, antes do Contato; a seção Entregas ainda não existe). A lógica testável fica em `sobreLogica.ts` (parágrafos por flag, galeria, destino do botão); o nome não é `sobre.ts` porque o Windows não distingue de `Sobre.tsx`.
- **Ministério:** liberado em 13/11/2026, só com o texto de `negocios.sobre.ministerio`. Sem siglas nem nomes internos de órgãos, programas ou sistemas; um teste barra palavras só em maiúsculas nesse texto.
- **Imagens do Uniser:** eram SVGs de exemplo; foram trocadas pelas telas reais (ver a seção "UniSER corrigida, Simbionte e imagens reais").
- **Botão "Fazer orçamento" (antes "Falar comigo"):** no fim da seção Sobre e de cada modal, leva a `#orcamento` (`destinoBotaoSobre`). Pedido do Marcelo em 14/11/2026: quem lê o Sobre segue direto para o orçamento; o Contato continua no menu.
- **Menu:** `menuSecoes.sobre: true`; `scroll-mt-24` deixa o título livre do cabeçalho fixo.
- **Foto:** `site.foto` continua `null` (iniciais) até haver arquivo em `public/`.

## Destaques com "Saiba mais" na seção Sobre (13/11/2026)

- **Texto como dados:** cada parágrafo de `negocios.sobre` é uma lista de partes `{ texto, destaque? }` (`faculdade`, `estagio`, `uniser`); nada de achar trecho com `indexOf`. O texto dos parágrafos não mudou. Os modais ficam em `negocios.sobre.modais` (título, dica, texto, seções, fecho). O destaque do Estágio e o do Uniser somem com `mostrarMinisterio` e `mostrarUniser` desligadas (`sobreLogica.ts`).
- **`<span role="button">` em vez de `<button>`:** botão é caixa atômica no Chromium e não quebra de linha como texto (testado: um único retângulo). O span quebra, tem `tabindex="0"`, Enter e Espaço abrem. O alvo de 44 px vem do padding vertical do span inline, que não empurra as linhas.
- **Dica:** a lógica do balão saiu de `Dica.tsx` para o hook `useBalao`, usado pelo "i" e pelos destaques (mesma posição dentro da tela, uma dica por vez). No toque não há balão: o toque abre o modal.
- **Modal:** `ModalSobre.tsx`, `<dialog>` nativo como o `ModalServico`; o pai (`Sobre.tsx`) devolve o foco ao destaque ao fechar. "Fazer orçamento" segue `destinoBotaoSobre`; para `#orcamento`, fecha o modal e só depois rola (a rolagem da página estava travada).
- **Galeria:** `GaleriaUniser.tsx` serve à seção (carrossel/3 colunas) e ao modal (uma abaixo da outra, maiores). Hoje com as telas reais, sem rótulo.
- **PENDENTE (Marcelo):** conferir os textos dos modais.

## UniSER corrigida, Simbionte e imagens reais (13/11/2026)

- **Descrição corrigida:** o projeto é a UniSER, Universidade do Envelhecer da UnB; a plataforma é desenvolvida por estudantes da Unieuro com orientação de professores da Unieuro. Não é "portal do aluno" nem "cursos para idosos", e não é "parceria com a UnB". Um teste barra essas frases em `negocios.sobre`. No destaque do parágrafo continua o nome curto "Uniser".
- **Modal do Uniser:** título, o que o sistema faz, "O que isso tem a ver com o seu projeto" (login seguro, cada pessoa vê só o que é dela, registro e testes) e tecnologias (inclui Node.js com Express).
- **Simbionte:** parágrafo novo no modal da faculdade, em "Iniciação científica" (campo `mais` da seção, para o segundo parágrafo), sem link para o repositório.
- **Imagens reais trocadas por esquemas em HTML e CSS (decisão posterior, mesmo dia):** as capturas viraram desenhos "esqueleto" (barras, cartões e menu verde) em `GaleriaUniser.tsx`, sem imagem, sem dado de pessoa e sem os editais de teste. São seis telas: Editais, Login, Grade curricular, Meus dados, Frequência e Meu semestre, em grade de 3 colunas (2 no celular, dentro do modal; carrossel no celular, na seção). Nome e descrição de cada tela ficam em `site.telasUniser`; a legenda "Esquemas ilustrativos das telas, sem dados reais." fica em `negocios.sobre.legendaTelas`. Isso também tira a dúvida sobre a foto de pessoas e o logo do login. Os WebP e `site.imagensUniser` foram removidos.
- **Originais fora do git:** `src/pages/uniser/` está no `.gitignore`; servem só de referência para os esquemas e não são versionados. SVGs de exemplo apagados.

## Cenas animadas no modal do Estágio (13/11/2026)

- **O que é:** duas cenas ilustrativas em HTML, CSS e SVG, sem imagem, em `CenasEstagio.tsx`; textos e dados em `src/content/cenasEstagio.ts` (dados fictícios, rotulados: "Cenas ilustrativas, com dados fictícios.").
- **Planilha ao painel:** planilha com colunas e linhas fora do lugar e textos sem padrão (4 passos: solto, colunas e linhas no lugar, palavras e valores padronizados, painel). O painel (total, lançamentos, valor por setor) é calculado das mesmas linhas (`resumoPlanilha` em `cenasLogica.ts`), então bate com a planilha.
- **Apresentação:** auditório visto de trás, com plateia fardada da Marinha, do Exército e da Aeronáutica (só cores e quepes genéricos, sem insígnia), e um telão com dois slides que se alternam (painel do mês, fluxo do processo). O nome (`site.nome`) fica ao lado, fixo nos dois slides.
- **Acessibilidade:** cada cena é `role="img"` com descrição própria; botão "Pausar animação" (aria-pressed) serve às duas; com `prefers-reduced-motion` nada anima, aparece o resultado final e o botão some. Os temporizadores só existem com o modal do Estágio aberto.

## Cenas ao lado do texto da seção Sobre (13/11/2026)

- **Disposição:** a seção virou uma grade: avatar, texto e, em tela larga (a partir de `lg`), uma coluna lateral de 22 rem (`<aside>`); abaixo disso a coluna vai para baixo do texto. Antes a galeria ficava abaixo do parágrafo do Uniser.
- **Coluna lateral:** em cima, a cena animada da planilha que vira painel (com pausa própria; aparece com `mostrarMinisterio`, pois é o assunto do estágio); embaixo, só 2 telas do Uniser (Editais e Login, marcadas com `naSecao` em `site.telasUniser`). As 6 telas continuam no modal do Uniser; o modal do Estágio mantém as duas cenas.
- **Pausa por cena:** cada animação tem o seu botão pequeno, só com o ícone de pausa/continuar (rótulo acessível "Pausar animação: <cena>", alvo de toque de 44 px), ao lado da legenda.
- **Aviso na seção (14/11/2026):** abaixo da cena da planilha na coluna lateral vai "Cena ilustrativa, com dados fictícios." (`cenasEstagio.avisoCena`), o mesmo aviso do modal no singular. Os destaques do texto passaram a usar um ícone de "mais informações" (círculo com "+", `IconeMais`) no lugar do de link externo, que sugeria sair do site.
