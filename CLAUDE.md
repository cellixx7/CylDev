# CLAUDE.md

Orientações para o Claude Code neste repositório.

## Stack e comandos

Site de vendas do Marcelo Vaz / CylDev, em português do Brasil. Vite multi-page + React + TypeScript + Tailwind v4. Em runtime só `react` e `react-dom`. Node >= 22 (`.nvmrc`).

```bash
npm run dev          # servidor do Vite
npm test             # vitest run (só src/**/*.test.ts)
npm run typecheck    # tsc --noEmit
npm run build        # typecheck + vite build -> dist/
npm run preview
npx vitest run src/shared/lib/orcamento.test.ts   # um arquivo de teste
npm run test:e2e     # jornadas no navegador (Playwright, só Chromium); faz o build e sobe o vite preview sozinho; fora do build e do `npm test`
```

O GitHub Actions (`.github/workflows/ci.yml`, job `verificar`) roda typecheck, `npm test`, build e `test:e2e` em todo PR; não faça merge com ele vermelho (a proteção da `main` que exige esse check está em `docs/PENDENCIAS.md`). A Netlify roda só `npm run build`.

## Estrutura

Não é SPA: cada área tem o seu HTML e a sua raiz React.

- `index.html` (Negócios, é a raiz `/`), `como-funciona/`, `comunidade/`, `obrigado/`, `404.html`. Não existe mais `/negocios/` (a Netlify redireciona o endereço antigo). Página nova exige o HTML e uma entrada em `build.rollupOptions.input` no `vite.config.ts`.
- `src/pages/<area>/main.tsx`: monta a árvore React e importa `src/styles/tema-<area>.css` e `tailwind.css`. Componentes só de uma área ficam ao lado. Em Negócios, por seção: `orcamento/` (cards, modal, configurador, carrinho, checkout), `sobre/` (seção Sobre, modais, cenas, galeria UniSER) e `exemplo/` (painel de exemplo do hero); na raiz da pasta ficam `main.tsx` e o que as seções dividem (`icones.tsx`, `magnetico.ts`, `useTravaRolagem.ts`). Os testes ficam ao lado do que testam.
- `src/content/`: dados e textos editáveis (`site.ts`, `servicos.ts`, `orcamento.ts`, `exemplos.ts`, `perguntas.ts`...). Os textos das páginas ficam em `src/content/textos/`, um arquivo por área (`comum`, `orcamento`, `negocios`, `sobre`, `comunidade`, `paginas`); importe sempre de `content/textos` (o `index.ts` reexporta tudo). Página nova ganha arquivo próprio ali e uma linha no `index.ts`.
- `src/shared/`: `components/` (Secao, Formulario, Catalogo, Rodape, cabecalho/*), `lib/` (lógica pura e testada: orcamento, prazo, whatsapp, emailjs, formato, seo), `estilos.ts` (classes repetidas, como strings literais completas; o Tailwind lê texto, então nada de montar classe dinamicamente), `tema.ts`.
- `src/styles/`: `tailwind.css`, `tema-negocios.css`, `tema-comunidade.css`. Fontes locais em `public/fonts/`.
- Documentação em `docs/`: `decisoes/` (um arquivo por tema; ao decidir algo relevante, acrescente uma seção no fim do arquivo do tema), `PENDENCIAS.md` (só o que falta, com dono e data), `DESIGN.md` (guia de estilo: cores, escala de texto, larguras, pontos de quebra, padrão de seção; siga ao criar seção nova), `COPY.md` (textos), `ORCAMENTO-SPEC.md` e `emailjs-template.md`. Mudanças publicadas na `main` vão no `CHANGELOG.md` da raiz.
- Tema: `data-theme="claro|escuro"` no `<html>`, claro por padrão em Negócios e escuro na Comunidade (sem seguir `prefers-color-scheme`; o padrão fica no `data-theme` do HTML, no `theme-color` e em `temaPadrao`), salvo por área em `tema-<area>`; acesso ao localStorage sempre em try/catch. Os `__URL__` dos HTML são trocados no build; o `<noscript>` e o JSON-LD da home são injetados no build pelo plugin `seo` do `vite.config.ts` (conteúdo em `shared/lib/seo.ts`, a partir de `src/content/`); imagens OG levam versão no nome (`og-*-v1.png`), troque o sufixo ao mudar a imagem.

## Regras

- Todo conteúdo editável (preços, textos, contatos, flags) fica em `src/content/`. Código, textos e docs em pt-BR.
- Só React em runtime. Não adicione dependência nova sem perguntar.
- Não altere `src/content/orcamento.ts`, `src/content/exemplos.ts`, `src/content/servicos.ts` nem `src/shared/lib/{orcamento,prazo}.ts` sem pedido explícito.
- Bots com `horasProvisorias: true` mostram "prazo a combinar"; não invente prazo para eles.
- EmailJS: não altere as regras de spam (campo isca e 3 s mínimos). Nenhuma chave privada no repositório.

## Design

- Negócios: cobalto sobre off-white frio (claro) e azul-noite (escuro), um só acento. Comunidade: tema próprio em `tema-comunidade.css`.
- Fontes de Negócios: Space Grotesk (títulos e texto), Space Mono (preços e números), todas locais.
- Sem degradê, vidro ou blur. Sem emoji como ícone.
- Mobile em primeiro lugar: desenhe e teste no celular antes do desktop.
- Tamanho de texto só pela escala (`text-menor`, `text-base`, `text-medio`, `text-grande`, `text-maior`); nada de `text-[...]` à mão nem abaixo de 14 px. Seção nova usa `<Secao>`. Desktop é `pc:` (não use `lg:`). Detalhes em `docs/DESIGN.md`.
- `.claude/skills/design-taste-frontend` é a skill de design do projeto.

## Honestidade

- Todo dado de exemplo é rotulado como exemplo.
- Nada de prazo, métrica, depoimento ou número inventado.

## Como explorar o código (economia de tokens, opcional)

O graphify é opcional: não é dependência do projeto e o site não precisa dele. Se não estiver instalado, use busca normal (`grep`, glob).

- Instalar (Python 3.10+): `pip install graphifyy` (o pacote tem dois "y"; o comando é `graphify`). Gerar ou atualizar o grafo: `graphify update .` (só análise do código, sem LLM e sem custo; cria `graphify-out/`).
- Com o grafo gerado, antes de buscar ou ler arquivos, consulte `graphify-out/GRAPH_REPORT.md` e use `graphify query "<pergunta>"`, `graphify path "A" "B"`, `graphify explain "X"` e `graphify affected "X"` (o que é afetado por X) para localizar o que importa.
- Abra o arquivo inteiro só quando for editá-lo.
- Depois de mudanças no código, rode `graphify update .` de novo (com `--force` depois de mover ou apagar arquivos) para o grafo não ficar defasado.
- Não versione `graphify-out/` (está no `.gitignore`).

## Fluxo

- Antes de abrir o PR, rode `npm test` e `npm run test:e2e`; o CI repete os dois.
- Branches: `commit_HH-MM_DD-MM_VXN` (hora, minuto, dia, mês, versão, nº do commit), nunca com "claude" no nome. Merge por PR (cada PR gera um deploy preview na Netlify); só vai para a `main` versão fechada, pois o deploy de produção gasta crédito.
- Commits em pt-BR com prefixo (`feat:`, `fix:`, `docs:`, `chore:`).
