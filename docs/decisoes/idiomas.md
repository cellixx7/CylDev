# Idiomas

## 25/11/2026: site em vários idiomas

**Decisão.** Os 10 idiomas mais falados: português (original, na raiz), inglês, espanhol, francês, chinês, hindi, árabe, bengali, russo e urdu. Um endereço por idioma (`/en/`, `/es/`...), o português sem prefixo. O prefixo não depende de seções futuras (`/freela`, `/cylgg`...): `/en/freela/` funcionará igual.

**Idioma no primeiro acesso.** Script no `<head>` das páginas em português (menos a 404): pula robôs (User-Agent), lê a escolha salva (`localStorage`, chave `idioma`), senão percorre `navigator.languages` e usa o primeiro idioma do site; se nenhum servir, inglês. Só idiomas listados em `src/shared/i18n/ativos.json` contam.

**Idiomas no ar.** `ativos.json` controla seletor, hreflang, sitemap, detecção e build. Um idioma só entra quando está 100% traduzido (`scripts/cobertura.ts`).

**Como é feito.** Um build por idioma (`IDIOMA=<código> vite build`; `scripts/build-idiomas.mjs` junta tudo em `dist/`). O plugin `scripts/vite-idiomas.ts` troca os textos do código por tradução no build; o código-fonte continua em português. O texto vira um id (hash do texto em português) e os trechos variáveis viram `{1}`, `{2}`. Listas em `src/content/i18n/`: `pt.txt` (gerada por `scripts/extrair-textos.ts`), `<idioma>/textos.txt`, `<idioma>/meta.json` (título e descrição de cada página), `ignorar.txt` (o que não se traduz: dados, código, nomes). Links internos usam `rota()` para levar o prefixo.

**Mudou um texto em português?** Rode `node --experimental-strip-types scripts/extrair-textos.ts`, depois `scripts/cobertura.ts`; o texto novo precisa de uma linha `id tradução` em cada idioma no ar. O teste `src/shared/i18n/traducoes.test.ts` falha se faltar texto ou se um `{n}` sumir.

**Textos jurídicos.** Seguem só em português nos outros idiomas, com um aviso de que vale a versão em português. Traduzir é pendência (ver `PENDENCIAS.md`).

**Assistente Cyl.** Só em português (motor de regras e vocabulário em português). Fora do português o botão não aparece.

**Traduções.** Feitas pelo Claude, sem revisão nativa. Nunca traduzir valor nem prazo de forma diferente do texto em português.

**Preços.** Os valores continuam em reais. Referência em dólar e euro está em `PENDENCIAS.md`.
