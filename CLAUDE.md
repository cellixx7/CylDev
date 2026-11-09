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
```

## Estrutura

Não é SPA: cada área tem o seu HTML e a sua raiz React.

- `home/`, `negocios/` (padrão: `/` redireciona), `negocios/como-funciona/`, `comunidade/`, `obrigado/`, `404.html`. Página nova exige o HTML e uma entrada em `build.rollupOptions.input` no `vite.config.ts`.
- `src/pages/<area>/main.tsx`: monta a árvore React e importa `src/styles/tema-<area>.css` e `tailwind.css`. Componentes só de uma área ficam ao lado (ex.: `src/pages/negocios/Orcamento.tsx`).
- `src/content/`: dados e textos editáveis (`site.ts`, `servicos.ts`, `orcamento.ts`, `textos.ts`, `exemplos.ts`).
- `src/shared/`: `components/` (Formulario, Catalogo, Rodape, cabecalho/*), `lib/` (lógica pura e testada: orcamento, prazo, whatsapp, emailjs, formato), `estilos.ts` (classes repetidas, como strings literais completas; o Tailwind lê texto, então nada de montar classe dinamicamente), `tema.ts`.
- `src/styles/`: `tailwind.css`, `tema-negocios.css`, `tema-comunidade.css`. Fontes locais em `public/fonts/`.
- `docs/DECISOES.md` (decisões e pendências; atualize ao decidir algo relevante) e `docs/COPY.md`.
- Tema: `data-theme="claro|escuro"` no `<html>`, escuro por padrão, salvo por área em `tema-<area>`; acesso ao localStorage sempre em try/catch. Os `__URL__` dos HTML são trocados no build; imagens OG levam versão no nome (`og-*-v1.png`), troque o sufixo ao mudar a imagem.

## Regras

- Todo conteúdo editável (preços, textos, contatos, flags) fica em `src/content/`. Código, textos e docs em pt-BR.
- Só React em runtime. Não adicione dependência nova sem perguntar.
- Não altere `src/content/orcamento.ts`, `src/content/exemplos.ts`, `src/content/servicos.ts` nem `src/shared/lib/{orcamento,prazo}.ts` sem pedido explícito.
- Bots com `horasProvisorias: true` mostram "prazo a combinar"; não invente prazo para eles.
- EmailJS: não altere as regras de spam (campo isca e 3 s mínimos). Nenhuma chave privada no repositório.

## Design

- Negócios: paleta N2, grafite com terracota. Comunidade: tema próprio em `tema-comunidade.css`.
- Fontes: Schibsted Grotesk (títulos), Source Sans 3 (texto), JetBrains Mono (preços e números), todas locais.
- Sem degradê, vidro ou blur. Sem emoji como ícone.
- Mobile em primeiro lugar: desenhe e teste no celular antes do desktop.
- `.claude/skills/design-taste-frontend` é a skill de design do projeto.

## Honestidade

- Todo dado de exemplo é rotulado como exemplo.
- Nada de prazo, métrica, depoimento ou número inventado.

## Fluxo

- Branches: `commit_HH-MM_DD-MM_VXN` (hora, minuto, dia, mês, versão, nº do commit), nunca com "claude" no nome. Merge por PR (cada PR gera um deploy preview na Netlify); só vai para a `main` versão fechada, pois o deploy de produção gasta crédito.
- Commits em pt-BR com prefixo (`feat:`, `fix:`, `docs:`, `chore:`).
