# Marcelo Vaz e CylDev

Site de vendas de serviços: área **Negócios** (raiz `/`) e área **Comunidade** (`/comunidade/`), com um atalho no cabeçalho entre as duas. Hospedado na Netlify (plano gratuito).

## Rodar

Node 22 ou superior.

```bash
npm install
npm run dev        # desenvolvimento
npm run typecheck
npm test
npm run test:e2e   # jornadas no navegador (Playwright); faz o build e sobe o preview sozinho
npm run build      # gera dist/
npm run preview    # serve dist/
```

Todo PR passa pelo CI do GitHub (`.github/workflows/ci.yml`: typecheck, testes, build e e2e); só faça merge com ele verde.

## Onde mexer

- `src/content/site.ts`: WhatsApp, e-mail, URL padrão, opções `mostrarMinisterio` e `mostrarUniser`, foto.
- `src/content/servicos.ts`: catálogo de pacotes e preços.
- `src/content/orcamento.ts`: parâmetros do orçamento e o contador `vagasPiloto10` e `vagasPiloto5` (diminua 1 a cada venda com desconto).
- `src/content/textos/`: todos os textos das páginas, um arquivo por área (`negocios.ts`, `orcamento.ts`, `sobre.ts`, `comunidade.ts`, `paginas.ts`, `comum.ts`) e um por página de leitura (`termos.ts`, `privacidade.ts`, `perguntasFrequentes.ts`, `acessibilidade.ts`).
- `src/styles/tema-negocios.css` e `tema-comunidade.css`: cores, fontes e espaçamentos de cada área. `e2e/`: testes de jornada.

## Publicação

Trabalhe em branches (`commit_HH-MM_DD-MM_VXN`) e abra pull requests: cada PR ganha um deploy preview. Só faça merge na `main` quando a versão estiver fechada, porque cada deploy de produção gasta créditos do plano gratuito.

## Documentação

- `docs/PENDENCIAS.md`: o que ainda falta decidir ou fazer, com dono e data.
- `docs/decisoes/`: decisões já tomadas, um arquivo por tema (índice em `docs/decisoes/README.md`).
- `docs/DESIGN.md`: guia de estilo (cores, tamanhos, pontos de quebra, padrão de seção).
- `docs/MODELO-PROPOSTA.md`: modelo da proposta por escrito que vai para o cliente.
- `docs/COPY.md`: textos para revisão. `docs/ORCAMENTO-SPEC.md`: especificação do orçamento. `docs/emailjs-template.md`: template do e-mail.
- `CHANGELOG.md`: o que mudou em cada versão publicada.

## Licença

Sem licença de código aberto: todos os direitos reservados ao autor. O código está visível no GitHub, mas não pode ser copiado nem reutilizado sem autorização.
