# Guia de estilo

Descreve **o que o site usa hoje**, para que uma seção nova não precise redecidir tudo. Primeira versão em 16/11/2026 (Etapa 2 da auditoria); a escala de texto, as larguras em token e o componente `<Secao>` entraram na Etapa 4 (16/11/2026).

Onde as regras moram no código:

- `src/styles/tailwind.css`: tokens base (`@theme`): cores, escala de texto, larguras, pontos de quebra, animações.
- `src/styles/tema-negocios.css` e `tema-comunidade.css`: cores e fontes de cada área (claro e escuro).
- `src/shared/estilos.ts`: classes repetidas (botões, rótulo de exemplo, foco), sempre como string literal completa (o Tailwind lê o texto; não monte classe com variável).
- `src/shared/components/Secao.tsx`: o esqueleto de toda seção.

## Princípios

- Mobile em primeiro lugar: desenhe e teste em 360 a 390 px antes do desktop. Nada de rolagem lateral.
- Um só acento por área. Sem degradê, vidro ou blur. Sem emoji como ícone.
- Texto de leitura em 16 px; **nenhum texto abaixo de 14 px** (`text-menor`), nem dentro de ilustração ou mini exemplo. Se não couber, simplifique o desenho (menos colunas, palavra mais curta), não diminua a letra. O teste "12. guia de estilo" (`e2e/layout.spec.ts`) mede isso em todas as páginas.
- Alvo de toque mínimo de 44 px (`min-h-alvo`).
- Toda animação só dentro de `@media (prefers-reduced-motion: no-preference)`; sem ela, aparece o estado final.
- Todo dado de exemplo leva o rótulo de exemplo (`rotuloFicticio`, texto `comum.dadosFicticios`: "dados fictícios").

## Cores

Use sempre os tokens (`bg-fundo`, `text-texto-suave`, `border-linha`...), nunca hex no componente.

| Token | Uso | Negócios claro | Negócios escuro |
|---|---|---|---|
| `fundo` | fundo da página | `#f2f4f8` | `#090c18` |
| `superficie` | cards, modais | `#ffffff` | `#11162a` |
| `texto` | texto principal | `#0c1226` | `#e9edf8` |
| `texto-suave` | texto secundário, legendas | `#4b5368` | `#9ba4bd` |
| `linha` | bordas e divisórias | `#cfd5e2` | `#252c47` |
| `destaque` | acento (cobalto): botão cheio, barra de título, links | `#1a3fe0` | `#6c8cff` |
| `destaque-texto` | texto sobre `destaque` | `#ffffff` | `#060919` |
| `realce` | hover e fundo de item ativo | `#e3e8f5` | `#181f3a` |
| `foco` | contorno de foco do teclado | `#0c1226` | `#e9edf8` |
| `serie-1` a `serie-5` | séries de gráfico, da mais forte à mais fraca | ver `tema-negocios.css` | |

A Comunidade tem a própria tabela em `tema-comunidade.css` (escura por padrão).

## Fontes

- Negócios: **Space Grotesk** em títulos e texto (`font-titulo`, `font-texto`) e **Space Mono** em preços e números (`font-mono`). Arquivos locais em `public/fonts/`, `font-display: swap`.
- Preço, horas e totais sempre em `font-mono`.

## Tamanhos de texto

Escala única, em tokens no `@theme` de `tailwind.css`. Use só as classes abaixo; **não escreva `text-[...]` com tamanho à mão**. Os tamanhos padrão do Tailwind (`text-xs`, `text-sm`, `text-lg`...) estão desligados de propósito (`--text-*: initial`), então não geram classe.

| Classe | Tamanho | Uso |
|---|---|---|
| `text-menor` | 0,875 rem (14 px) | legendas, rótulos, notas, selo de exemplo. É o mínimo |
| `text-base` | 1 rem (16 px) | texto de leitura (é o padrão do `body`; só escreva a classe para voltar a ele) |
| `text-medio` | 1,125 rem (18 px) | texto de destaque, preço do card, título pequeno (`h4`, título de bloco dentro de modal) |
| `text-grande` | 1,35 rem | título de card, de modal e de bloco (`h3` padrão) |
| `text-maior` | 1,75 rem | número em destaque (total do carrinho, iniciais do avatar) |
| `text-preco` | `clamp(1.7rem, 6vw, 2.2rem)` | total da estimativa |
| `text-secao` | `clamp(1.6rem, 4vw, 2.2rem)` | `h2` de seção (já é o padrão do `h2`) |
| `text-pagina` | `clamp(2rem, 7.5vw, 3.6rem)` | `h1` das páginas internas (já é o padrão do `h1`) |
| `text-hero` / `text-hero-pc` | `clamp(...)` | `h1` da home, no celular e no desktop |

- Os tokens não trazem altura de linha: o corpo usa 1.6 e os títulos 1.2 (em `@layer base`); ajuste com `leading-*` quando precisar.
- Em telas a partir de 1440 px o `html` cresce (112,5% e depois 125%), então tudo que está em `rem` cresce junto.
- Títulos seguem a ordem `h1` > `h2` > `h3` > `h4`, sem pular nível (o mesmo teste confere).

## Espaçamento e larguras

- Escala padrão do Tailwind (`1` = `0.25rem`). Respiro entre seções: `pt-14 pb-14` (já vem no `<Secao>`).
- Margem lateral da página: `px-margem` (`clamp(1rem, 4vw, 4rem)`).
- Larguras máximas, todas em token (não escreva `max-w-[...]` para texto):

| Classe | Largura | Uso |
|---|---|---|
| `max-w-site` | 96 rem | a página (cabeçalho, rodapé) |
| `max-w-hero` | 86 rem | o conteúdo das seções |
| `max-w-leitura` | 40 rem | parágrafos, intros, modais de texto, página de privacidade |
| `max-w-titulo` | 20 ch | `h1` das páginas internas |

- Raio: `rounded-pequeno` / `rounded-padrao` (2 px em Negócios).

## Pontos de quebra

| Prefixo | A partir de | Significa | Use para |
|---|---|---|---|
| (nenhum) | 0 | celular, o padrão | tudo em uma coluna |
| `sm:` | 40 rem (640 px) | celular deitado, tablet pequeno | botões lado a lado, texto ao lado de ícone ou avatar |
| `md:` | 48 rem (768 px) | tablet em pé | grades de 2 colunas; mini exemplos dos cards sempre abertos |
| `tab:` | 56 rem (896 px) | tablet deitado | 2 colunas com painel lateral (Como funciona, Comunidade) |
| `pc:` | 62 rem (992 px) | desktop | menu completo no cabeçalho, botão de tema flutuante, hero com o painel ao lado, cards em 3 colunas, coluna lateral do Sobre |
| `xl:` | 80 rem (1280 px) | telas largas | grades mais abertas (painel de exemplo, catálogo) |

- O desktop tem **um só corte: `pc:`**. O `lg:` (1024 px) saiu na Etapa 4: entre 992 e 1023 px o hero já estava em duas colunas, mas o painel de exemplo ainda não aparecia ao lado. Não use `lg:`.
- Quando o JavaScript precisar saber se é desktop (ex.: `useDesktop` em `negocios/main.tsx`), use a mesma medida do `pc:` (`min-width: 62rem`).
- `md` e `tab` são parecidos; em algo novo, prefira `md` para "2 colunas" e `pc` para "layout de desktop". O `tab` fica onde já está.

## Padrão de seção

Toda seção da home usa o componente `<Secao>` (`src/shared/components/Secao.tsx`), que já traz largura (`max-w-hero`), margem lateral, respiro (`pt-14 pb-14`), `scroll-mt-24` (o título não fica embaixo do cabeçalho fixo), a barra de destaque, o `h2` ligado ao `aria-labelledby` e a intro na largura de leitura:

```tsx
<Secao id="entregas" titulo="Do pedido à entrega" intro="Intro curta, opcional.">
  {/* conteúdo; títulos internos em h3 */}
</Secao>
```

- O `id` vira a âncora (`/#entregas`) e o título recebe `id="entregas-titulo"`. Use `tituloFocavel` quando um script devolve o foco ao título (caso do Orçamento).
- Um `h2` por seção. Dentro dela, `h3`; não pule nível.
- Usam hoje: Orçamento, o exemplo de painel no celular, Entregas, Sobre e Contato. Ordem na home: hero, Orçamento, exemplo (só no celular), Entregas, Sobre, Contato.
- Seção nova no menu: entrada em `negocios.nav` (`src/content/textos/negocios.ts`), na mesma ordem da página, e flag em `site.menuSecoes`.
- A Comunidade ainda usa o esqueleto antigo (`main > section` em `tailwind.css`); passa para o `<Secao>` quando a área for revisada.

## Componentes base

- Botões: `botao` (contorno) e `botaoCheio` (ação principal, uma por bloco), de `src/shared/estilos.ts`.
- Foco: `focoVisivel` em todo elemento clicável que não seja link ou botão nativo.
- Rótulo de exemplo: `rotuloFicticio`. Nos cards, o mini exemplo leva o selo "Exemplo" e, no celular, vem recolhido atrás do botão "Ver exemplo" (`MiniExemplo.tsx`).
- Rodapé: `Rodape.tsx`, com a ponte para a outra área e os links curtos (Privacidade, Contato; "Termos" entra na Etapa 5). Texto longo não vai no rodapé.
- Dica "i": `src/shared/components/Dica.tsx`.
- Modais: `<dialog>` nativo, foco preso e devolvido ao botão que abriu, `Esc` fecha.
