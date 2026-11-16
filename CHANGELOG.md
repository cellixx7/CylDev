# Changelog

O que muda em cada versão publicada na `main` (cada merge na `main` gera um deploy de produção). A mais nova fica em cima. Detalhes de cada decisão em `docs/decisoes/`; o que falta em `docs/PENDENCIAS.md`.

Formato: `## AAAA-MM-DD: título curto (PR #n)` e, embaixo, só o que o visitante ou quem mexe no código percebe.

## Não publicado

### Etapa 3 da auditoria: FrontEnd e BackEnd qualitativo

- Verificação automática no GitHub (`.github/workflows/ci.yml`): typecheck, testes, build e jornadas no navegador em todo PR; a `main` só aceita merge com o check `verificar` verde.
- Home sem JavaScript: `<noscript>` com a frase principal, o preço de partida e os contatos.
- Dados estruturados (JSON-LD `ProfessionalService`) na home e `lastmod` no `sitemap.xml`.
- Seções vazias `#entregas` e `#como-funciona` removidas da home (nenhuma mudança visível além de menos espaço em branco antes do Contato).
- E-mail do pedido leva o aviso "Valor estimado pelo site. O valor final vai na proposta por escrito." (parâmetro `aviso_valor`; falta pôr no template do EmailJS).
- Teste de jornada instável ("ida a Como funciona e volta, depois recarregar") corrigido.

## 2026-11-16: Etapa 2 da auditoria, pastas e documentação (PR #16)

- Textos das páginas divididos por área em `src/content/textos/` (os imports de `content/textos` continuam iguais).
- `src/pages/negocios/` organizada em `orcamento/`, `sobre/` e `exemplo/`.
- `docs/DECISOES.md` dividido em `docs/decisoes/` (um arquivo por tema) e `docs/PENDENCIAS.md` (só o que falta, com dono e data).
- `docs/DESIGN.md`: primeira versão do guia de estilo (estado atual; a escala de tipografia entra na Etapa 4).
- Página 404 usa o e-mail de `site.ts`; textos sem uso removidos.
- React num arquivo próprio do build (`vendor-react-*.js`).
- Mockups antigos removidos de `docs/mockups/` (continuam no histórico do git); `.gitignore` sem sobras de Next.js.
- `CLAUDE.md`: graphify marcado como opcional, com instalação; estrutura nova descrita.
- Nenhuma mudança visível no site.

## Até 16/11/2026 (PR #15, commit `1402f21`)

Versão no ar antes da auditoria geral: Negócios com orçamento em cards, carrinho e checkout por EmailJS, seção Sobre com destaques e cenas, Como funciona com demonstrações, Comunidade, privacidade, obrigado e 404. Histórico anterior: `docs/decisoes/` e `git log`.
