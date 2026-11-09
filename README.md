# Marcelo Vaz e CylDev

Site de vendas de serviços: área **Negócios** (raiz `/`) e área **Comunidade** (`/comunidade/`), com um atalho no cabeçalho entre as duas. Hospedado na Netlify (plano gratuito).

## Rodar

Node 22 ou superior.

```bash
npm install
npm run dev        # desenvolvimento
npm run typecheck
npm test
npm run build      # gera dist/
npm run preview    # serve dist/
```

## Onde mexer

- `src/content/site.ts`: WhatsApp, e-mail, URL padrão, opções `mostrarMinisterio` e `mostrarUniser`, foto.
- `src/content/servicos.ts`: catálogo de pacotes e preços.
- `src/content/orcamento.ts`: parâmetros do orçamento e o contador `vagasPiloto` (diminua 1 a cada venda com desconto).
- `src/content/textos.ts`: todos os textos das páginas.
- `src/styles/tokens.css`: cores, fontes e espaçamentos.

## Publicação

Trabalhe em branches (`commit_HH-MM_DD-MM_VXN`) e abra pull requests: cada PR ganha um deploy preview. Só faça merge na `main` quando a versão estiver fechada, porque cada deploy de produção gasta créditos do plano gratuito.

Decisões e pendências: `docs/DECISOES.md`. Textos para revisão: `docs/COPY.md`.
