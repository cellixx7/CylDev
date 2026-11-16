# Guia de estilo

Versão inicial (16/11/2026, Etapa 2 da auditoria): descreve **o que o site usa hoje**, para que uma seção nova não precise redecidir tudo. A escala de tipografia e o componente `<Secao>` entram na Etapa 4; quando entrarem, atualize as partes marcadas como **a definir**.

Onde as regras moram no código:

- `src/styles/tailwind.css`: tokens base (`@theme`), pontos de quebra, animações.
- `src/styles/tema-negocios.css` e `tema-comunidade.css`: cores e fontes de cada área (claro e escuro).
- `src/shared/estilos.ts`: classes repetidas (botões, rótulo de exemplo, foco), sempre como string literal completa (o Tailwind lê o texto; não monte classe com variável).

## Princípios

- Mobile em primeiro lugar: desenhe e teste em 360 a 390 px antes do desktop. Nada de rolagem lateral.
- Um só acento por área. Sem degradê, vidro ou blur. Sem emoji como ícone.
- Texto de leitura em 16 px; **nenhum texto abaixo de 14 px** (`0.875rem`).
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

**A definir (Etapa 4):** escala única em tokens. Proposta da auditoria: `0.875rem`, `1rem`, `1.125rem`, `1.35rem`, `1.75rem` e títulos com `clamp`.

Hoje os tamanhos estão escritos à mão (`text-[...]`). Os mais usados, para copiar enquanto a escala não existe:

| Uso | Tamanho |
|---|---|
| Texto de leitura | `text-[1rem]` (16 px) |
| Texto secundário, legendas, rótulos | `text-[0.875rem]` (14 px, o mínimo) |
| Subtítulo de card ou bloco | `text-[1.2rem]` |
| Título de bloco menor | `text-[1.35rem]` |

Evite os valores fora disso (`0.6875`, `0.75`, `0.8125rem` ficam abaixo do mínimo e vão sair na Etapa 4; `1.05`, `1.1`, `1.15rem` são quase iguais e serão unificados).

## Espaçamento e larguras

- Escala padrão do Tailwind (`1` = `0.25rem`). Respiro entre seções: `pt-14 pb-14`.
- Margem lateral da página: `px-margem` (`clamp(1rem, 4vw, 4rem)`).
- Larguras máximas: `max-w-site` (96 rem) para a página, `max-w-hero` (86 rem) para o conteúdo das seções, `max-w-[40rem]` para parágrafos e intros. (Na Etapa 4 as larguras à mão viram tokens.)
- Raio: `rounded-pequeno` / `rounded-padrao` (2 px em Negócios).

## Pontos de quebra

| Prefixo | A partir de | Para que serve hoje |
|---|---|---|
| (nenhum) | 0 | celular, o padrão |
| `sm:` | 40 rem (640 px) | celular grande deitado: textos curtos ao lado do ícone, duas colunas simples |
| `md:` | 48 rem (768 px) | tablet em pé: grades de 2 colunas |
| `tab:` | 56 rem (896 px) | tablet deitado: layouts de 2 colunas com painel lateral |
| `pc:` | 62 rem (992 px) | desktop: menu completo no cabeçalho, botão de tema flutuante |
| `lg:` | 64 rem (1024 px) | coluna lateral do Sobre |
| `xl:` | 80 rem (1280 px) | telas largas: grades mais abertas (ex.: painel de exemplo, catálogo) |

`md` e `tab` são usados de forma parecida; ao criar algo novo, prefira `md` para "2 colunas" e `pc` para "layout de desktop".

## Padrão de seção

Toda seção da home segue o mesmo esqueleto (hoje repetido em `Orcamento.tsx`, `Sobre.tsx` e no Contato de `main.tsx`; vira o componente `<Secao>` na Etapa 4):

```tsx
<section className="mx-auto max-w-hero scroll-mt-24 px-margem pt-14 pb-14" id="..." aria-labelledby="...-titulo">
  <span className="revela-barra mb-5 block h-[3px] w-12 bg-destaque" aria-hidden="true" />
  <h2 id="...-titulo" className="revela-titulo">Título</h2>
  <p className="max-w-[40rem] text-texto-suave">Intro curta.</p>
  {/* conteúdo */}
</section>
```

- Um `h2` por seção, com `id` ligado ao `aria-labelledby`. Dentro da seção, `h3`; não pule nível.
- `scroll-mt-24` para o título não ficar embaixo do cabeçalho fixo ao usar âncora.
- Seção nova no menu: entrada em `negocios.nav` (`src/content/textos/negocios.ts`) e flag em `site.menuSecoes`.

## Componentes base

- Botões: `botao` (contorno) e `botaoCheio` (ação principal, uma por bloco), de `src/shared/estilos.ts`.
- Foco: `focoVisivel` em todo elemento clicável que não seja link ou botão nativo.
- Rótulo de exemplo: `rotuloFicticio`.
- Dica "i": `src/shared/components/Dica.tsx`.
- Modais: `<dialog>` nativo, foco preso e devolvido ao botão que abriu, `Esc` fecha.
