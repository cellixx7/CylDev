# Pendências

Só o que ainda falta. Quando um item for resolvido, marque `[x]` com a data e, se virou decisão, registre em [`decisoes/`](decisoes/README.md); itens fechados há mais de um mês podem sair daqui (ficam no histórico do git).

Dono: **Marcelo** (decisão comercial ou ação fora do código) ou **dev** (mudança no repositório).

## Confirmações comerciais (Marcelo)

| | Pendência | Onde mexer | Desde |
|---|---|---|---|
| [ ] | Horas base do bot essencial e do bot com IA (hoje provisórias: 4 h e 8 h). Ao confirmar, remover `horasProvisorias` | `src/content/servicos.ts` | 09/11/2026 |
| [ ] | Desconto do plano de 6 meses dos bots | `mensalidadeBots.descontoPlanoAdiantado` em `src/content/orcamento.ts` | 09/11/2026 |
| [ ] | Confirmar que o desconto de piloto vale só sobre a criação | `src/content/orcamento.ts` | 02/11/2026 |
| [ ] | Horas extras por resposta do orçamento (propostas, marcadas PENDENTE no topo do arquivo) | `src/content/perguntas.ts` | 09/11/2026 |
| [ ] | "Ainda não tenho" no painel soma 2 h: manter ou sugerir a planilha antes | `src/content/perguntas.ts` | 09/11/2026 |
| [ ] | Sistema sob medida: preço-base de 6 h x R$ 50 (a partir de R$ 300, sem teto) e as horas das respostas | `HORAS_BASE_SISTEMA` em `servicos.ts`, `perguntasSistema.ts` | 12/11/2026 |
| [ ] | Conferir os textos dos modais do Sobre | `src/content/textos/sobre.ts` | 13/11/2026 |

## Configuração e publicação (Marcelo)

| | Pendência | Onde | Desde |
|---|---|---|---|
| [ ] | EmailJS: conferir no painel que o template tem os campos de `docs/emailjs-template.md` (`itens`, `total`, `observacoes`) e fazer um envio real de teste (a lista `itens` nunca foi testada de verdade) | painel do EmailJS, deploy preview | 11/11/2026 |
| [ ] | GitHub: proteger a `main` exigindo o check `verificar` (Settings > Branches > Add branch ruleset ou "Add classic branch protection rule": branch `main`, "Require status checks to pass", escolher `verificar`). Até lá o CI roda e avisa, mas não bloqueia o merge | GitHub, Settings > Branches | 16/11/2026 |
| [ ] | EmailJS: acrescentar `{{aviso_valor}}` no template do painel (linha sugerida em `docs/emailjs-template.md`); sem isso o aviso de valor estimado não aparece no e-mail | painel do EmailJS | 16/11/2026 |
| [ ] | Gmail: criar um filtro para os e-mails do EmailJS com "Nunca enviar para o spam" e um marcador (ex.: "Pedidos do site"), para nenhum pedido sumir | Gmail, Configurações > Filtros | 16/11/2026 |
| [ ] | EmailJS: conferir a cota de envios uma vez por mês (se acabar, o cliente vê o erro e você não fica sabendo) | painel do EmailJS | 16/11/2026 |
| [ ] | Escolher o nome do site na Netlify e atualizar `site.urlPadrao` | `src/content/site.ts` | 02/11/2026 |
| [ ] | Foto (opcional): colocar em `public/` e apontar `site.foto` | `src/content/site.ts` | 02/11/2026 |
| [ ] | Vídeo do CylBot (talvez UniSER e CylSense). Nenhum vídeo para a planilha | `public/` | 02/11/2026 |

## Validação (Marcelo e dev)

| | Pendência | Dono | Desde |
|---|---|---|---|
| [ ] | Validar com pessoas do público se o guia "Não sei qual escolher" ajuda a decidir (textos das perguntas e dos "porquês" são propostas) | Marcelo | 11/11/2026 |
| [ ] | Ver a demo da planilha num celular de verdade e com leitor de tela; conferir se o ritmo de 2,2 s por passo agrada | Marcelo | 11/11/2026 |

## Auditoria geral de 16/11/2026

Detalhes e prioridades no relatório da auditoria (fora do repositório). Resumo do que segue aberto:

- [ ] **Etapa 1, segurança** (adiada de propósito até depois da entrega de 26/11): origens permitidas e limite de envios no EmailJS, decidir repositório privado, `frame-ancestors`/`X-Frame-Options`, tirar `'unsafe-inline'` e ativar a CSP, HSTS e e-mail do domínio quando houver domínio próprio. Dono: Marcelo (painéis) e dev (`netlify.toml`).
- [x] **Etapa 2, pastas e documentação** (16/11/2026): ver `CHANGELOG.md`. Fica para a Etapa 4: completar `docs/DESIGN.md` com a escala de tipografia e o `<Secao>`.
- [x] **Etapa 3, FrontEnd e BackEnd qualitativo** (16/11/2026): CI no GitHub, `<noscript>`, JSON-LD, `lastmod` no sitemap, seções vazias removidas e aviso de valor estimado no e-mail; ver `CHANGELOG.md`. Ficaram com o Marcelo as quatro linhas de 16/11 em "Configuração e publicação".
- [ ] **Etapa 3, para depois:** quebrar `PainelExemplo.tsx`, `PorQueEsseValor.tsx`, `CenasEstagio.tsx` e `PainelCarrinho.tsx` em partes menores quando cada um for mexido de novo (o `PainelExemplo` na Etapa 4). Se o volume de pedidos crescer: Netlify Function que recebe o pedido, recalcula o preço e guarda uma cópia, só com o ok do Marcelo. Dono: dev.
- [ ] **Etapa 4:** decidir se a seção Entregas volta preenchida (as vazias saíram na Etapa 3), texto abaixo de 14 px, escala de tipografia, `<Secao>` (e atualizar `docs/DESIGN.md`). Dono: dev.
- [ ] **Etapa 5:** Termos (com "o valor do site é estimativa; o valor final vai na proposta por escrito", que desde a Etapa 3 já vai no e-mail do pedido), privacidade completa (LGPD), identificação do prestador, FAQ. Dono: Marcelo (conteúdo e revisão jurídica) e dev.

## Resolvidas recentemente

- [x] Termo de estágio: texto do Ministério liberado em 13/11/2026 (`mostrarMinisterio: true` em `src/content/site.ts`). Sem siglas nem nomes internos de órgãos, programas ou sistemas.
- [x] `serviceId`, `templateId` e `publicKey` preenchidos em `site.emailjs` (11/11/2026).
- [x] Combo: `COMBO_2` = 10% e `COMBO_3` = 15%, e a regra do "vale o maior" entre combo e piloto, confirmados em 12/11/2026 (ver `decisoes/orcamento.md`).
- [x] Imagens reais do UniSER (13/11/2026): ver `decisoes/sobre.md`.
