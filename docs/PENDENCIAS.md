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

## Assistente do chat (dev)

Etapa 1 (motor de regras + interface) entregue em 19/11/2026; detalhes em `decisoes/assistente.md`.

| | Pendência | Dono | Desde |
|---|---|---|---|
| [ ] | Etapa 2: modelo de linguagem no navegador (WebLLM, Web Worker, aviso do download, detecção de WebGPU, validador de números). Exige antes: seção na `privacidade.ts` (CDN dos pesos vê o IP), data nova em `versoes.ts`, registro em `juridico.md` e CSP (`connect-src`, `worker-src`, `wasm-unsafe-eval`) | dev | 19/11/2026 |
| [ ] | Testar o chat em celular de verdade (teclado virtual no iOS e no Android, altura pela `visualViewport`); os testes automáticos só cobrem Chromium de desktop | Marcelo | 19/11/2026 |
| [ ] | Ler as respostas do chat com olho de dono: o vocabulário (`src/content/assistente.ts`) e os textos (`src/content/textos/assistente.ts` e `assistenteGuias.ts`) são editáveis | Marcelo | 19/11/2026 |
| [ ] | Publicar no site (ou confirmar) o que o Assistente Cyl diz e ainda não está escrito em nenhuma página: "portfólio para recrutadores em desenvolvimento" e os diferenciais (qualidade técnica, entrega no prazo, valores justos com descontos generosos, apoio em outros projetos). Quem mudar o que o site promete deve mudar `textos/assistente.ts` e `assistenteGuias.ts` junto | Marcelo | 19/11/2026 |
| [ ] | Conferir a ordem do processo: o chat segue o que está publicado (proposta, entrada de metade e começo do trabalho, entrega por etapas, saldo antes dos arquivos finais), e não "pagamento parcial depois de começar" | Marcelo | 19/11/2026 |

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

## Jurídico (Marcelo)

Abertas na Etapa 5 da auditoria (16/11/2026). Os textos não são parecer jurídico; detalhes em `decisoes/juridico.md`.

| | Pendência | Onde mexer | Desde |
|---|---|---|---|
| [x] | **CPF:** publicado mascarado (`095*****199`) em 19/11/2026; o número completo vai em toda proposta. MEI/CNPJ fica para quando o faturamento justificar (ver `decisoes/juridico.md`) | `site.prestador.documento` em `src/content/site.ts` | 19/11/2026 |
| [x] | **Cidade/UF:** Brasília/DF, informada pelo Marcelo em 16/11/2026 (rodapé, Termos e foro). Com CNPJ, conferir se o endereço fiscal é o mesmo | `site.prestador.cidadeUf` | 16/11/2026 |
| [x] | **Recibo ou nota fiscal:** recibo, confirmado pelo Marcelo em 16/11/2026. Se um dia houver nota de serviço, trocar para `"nota"` (muda os Termos e a FAQ) e ajustar "Emito recibo" em `negocios.comoFunciona.pagamento` | `site.prestador.comprovante` | 16/11/2026 |
| [ ] | **Confirmar os prazos propostos nos Termos:** revisão pedida em até 7 dias; 30 dias sem resposta encerra o serviço; devolução de valores em até 10 dias; arquivos do cliente apagados em até 30 dias depois da entrega; aviso de incidente em até 2 dias úteis | `prazosDosTermos` em `src/content/textos/termos.ts` | 16/11/2026 |
| [ ] | **Confirmar as cláusulas novas dos Termos**, que não existiam em lugar nenhum: desistência em 7 dias (`#arrependimento`), cancelamento pagando o que foi feito (`#cancelamento`), cancelamento da mensalidade dos bots no fim do mês pago (`#bots`), propriedade e portfólio, limite de responsabilidade para quem não é consumidor, e a promessa de segurança ("equipamento e contas com acesso só meu, protegidos por senha") | `src/content/textos/termos.ts` | 16/11/2026 |
| [ ] | **Confirmar as respostas da FAQ que dependem de como você trabalha:** "Você precisa acessar o meu computador?" (hoje: não, só os arquivos enviados e a tela compartilhada no Meet), "Preciso ter algum programa pago?" e o passo a passo de envio de arquivos (link do Drive ou OneDrive só com o seu e-mail) | `src/content/textos/perguntasFrequentes.ts` | 16/11/2026 |
| [ ] | **Privacidade:** confirmar o prazo de 15 dias para responder pedidos, a guarda dos documentos de contrato "em regra, 5 anos" e a frase sobre não ter encarregado nomeado (o e-mail de contato para titulares foi confirmado em 16/11/2026) | `src/content/textos/privacidade.ts` | 16/11/2026 |
| [ ] | **Revisão de advogado** (cerca de 1 hora) dos Termos e da privacidade antes de tratá-los como definitivos. Primeiro ponto: a regra de desistência quando já houve entrega dentro dos 7 dias. Depois de qualquer mudança, trocar a data em `versoes.ts` | `src/content/textos/` | 16/11/2026 |
| [ ] | **EmailJS:** acrescentar `{{aceite}}` no template do painel (linha em `docs/emailjs-template.md`); sem isso o registro do aceite é enviado mas não aparece no e-mail | painel do EmailJS | 16/11/2026 |
| [ ] | **Cumprir o que os textos prometem:** apagar os pedidos com mais de 12 meses, apagar as cópias dos arquivos do cliente depois da entrega, guardar proposta, aceite e comprovantes, e usar `docs/MODELO-PROPOSTA.md` nas propostas | rotina | 16/11/2026 |
| [ ] | **Declaração de acessibilidade:** testar as páginas com leitor de tela num celular de verdade; se estiver tudo certo, tirar a linha de "O que ainda falta" | `src/content/textos/acessibilidade.ts` | 16/11/2026 |
| [ ] | **Rotina de fechar venda:** baixar `vagasPiloto10` (e depois `vagasPiloto5`) em `src/content/orcamento.ts` a cada venda fechada com desconto de piloto, no dia em que a entrada for paga. Contador esquecido é número falso no site. Definir também `pilotoValeAte` (AAAA-MM-DD; hoje `null`, sem limite) | `src/content/orcamento.ts` | Marcelo | 23/11/2026 |
| [ ] | **Imagem OG v2** gerada em 23/11/2026 no padrão do site (cobalto sobre off-white, Space Grotesk); a v1 era verde com serifa. Confirmar se fica assim ou se prefere igual à antiga | `public/og-negocios-v2.png` | Marcelo | 23/11/2026 |
| [ ] | **Licença das fontes** (Space Grotesk, Space Mono; repositório declara SIL OFL, não confirmado na origem): confirmar na fonte oficial e juntar o texto da licença em `public/fonts/` | `public/fonts/` | dev | 23/11/2026 |
| [ ] | **Perguntas para o advogado** (menores de idade, Marco Civil, norma do DF, encarregado, art. 33): lista em `auditorias/conformidade-legal.md`, seção 7. Revisar também a privacidade de 23/11/2026 | advogado | Marcelo | 23/11/2026 |
| [ ] | **Aviso de nova aba** nos links dinâmicos do Assistente, do Sobre e do modal do Sobre; e passar o teste manual de teclado e leitor de tela em celular | `PainelAssistente.tsx`, `Sobre.tsx`, `ModalSobre.tsx` | dev | 23/11/2026 |

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
- [ ] **Etapa 3, para depois:** quebrar `PainelExemplo.tsx`, `PorQueEsseValor.tsx`, `CenasEstagio.tsx` e `PainelCarrinho.tsx` em partes menores quando cada um for mexido de novo (na Etapa 4 o `PainelExemplo` só ganhou o nível dos títulos; não foi dividido). Se o volume de pedidos crescer: Netlify Function que recebe o pedido, recalcula o preço e guarda uma cópia, só com o ok do Marcelo. Dono: dev.
- [x] **Etapa 4, ajustes do FrontEnd** (16/11/2026): escala de texto, nada abaixo de 14 px, `<Secao>`, hero com a promessa no `h1`, seção Entregas, mini exemplos recolhidos no celular, rodapé curto e `docs/DESIGN.md` completo; ver `CHANGELOG.md` e `decisoes/arquitetura-e-design.md`.
- [ ] **Etapa 4, para conferir (Marcelo):** os textos novos do hero (`negocios.apresentacao.titulo` e `subtitulo`), a intro da seção Entregas (`negocios.comoFunciona.intro`) e a troca de "Estagio em TI" por "Sou estagiário de TI" no Sobre (`src/content/textos/sobre.ts`).
- [ ] **Etapa 4, para depois:** passar a Comunidade para o `<Secao>` quando a área for revisada; o botão de tema flutuante do desktop encosta na margem esquerda do conteúdo (já era assim antes da etapa). Dono: dev.
- [x] **Etapa 5, páginas jurídicas e de apoio** (16/11/2026): Termos (`/termos/`), privacidade completa (LGPD), identificação no rodapé, aceite no checkout com registro no e-mail, perguntas frequentes, acessibilidade e modelo de proposta; ver `CHANGELOG.md` e `decisoes/juridico.md`. O que depende do Marcelo está na seção "Jurídico" acima.
- [ ] **Etapa 5, para depois:** casos reais (`/trabalhos/`, só com trabalho real e autorização do cliente) e uma página por serviço (`/servicos/...`, pede texto próprio por serviço). Comunidade: termos e privacidade do CylBot, termos de bot sob medida, regras de conduta, FAQ dos bots e aviso de não afiliação completo. Dono: Marcelo (conteúdo) e dev.

## Resolvidas recentemente

- [x] Termo de estágio: texto do Ministério liberado em 13/11/2026 (`mostrarMinisterio: true` em `src/content/site.ts`). Sem siglas nem nomes internos de órgãos, programas ou sistemas.
- [x] `serviceId`, `templateId` e `publicKey` preenchidos em `site.emailjs` (11/11/2026).
- [x] Combo: `COMBO_2` = 10% e `COMBO_3` = 15%, e a regra do "vale o maior" entre combo e piloto, confirmados em 12/11/2026 (ver `decisoes/orcamento.md`).
- [x] Imagens reais do UniSER (13/11/2026): ver `decisoes/sobre.md`.
