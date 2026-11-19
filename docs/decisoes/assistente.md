# Assistente do chat (só Negócios)

Decisões do assistente de conversa. Ficam aqui o porquê e o que ainda falta; o como está nos comentários de cada arquivo.

## Motor de regras primeiro, modelo depois (19/11/2026)

**Decisão (Marcelo):** assistente de chat que roda 100% no navegador, só em Negócios. Entrega em duas etapas: (1) motor de regras + interface; (2) modelo de linguagem opcional (WebLLM, com WebGPU) por cima. Biblioteca da etapa 2: WebLLM (`@mlc-ai/web-llm`), exceção à regra "só React em runtime" porque carrega sob demanda. Pesos do modelo em CDN externo na v1, com aviso de que o CDN vê o IP; hospedar no próprio site fica para se a banda compensar.

**Por que o motor decide e o modelo só reescreve:** modelo pequeno no navegador (1 a 3 bilhões de parâmetros) erra número. Preço, prazo e desconto saem de `servicos.ts` e `orcamento.ts` por código; um modelo, quando entrar, só reescreve o texto do motor, e um validador (`validarSaida`) descarta a resposta se aparecer número que não existe nos fatos do site. "Nunca inventar preço ou prazo" é garantido por código, não por pedido educado em prompt.

**Etapa 1 (entregue):**

- `src/content/assistente.ts`: rede de sinônimos (conceitos), intenções e padrões de proteção. `src/content/textos/assistente.ts`: textos da interface (fora do `index.ts`, para não ir no JavaScript da home).
- `src/shared/lib/assistente/`: `normalizar` (sem acento, radical leve, tolera uma letra errada em palavra de 5+ letras), `intencao` (preço = valor = quanto custa; empate resolvido pela ordem em `intencoes`), `conhecimento` (só `servicos.ts`, `orcamento.ts`, perguntas frequentes e `site.ts`), `guardrails` (injeção de prompt, limite de 400 caracteres, validador de números), `orcamentoConversa` (mesmas perguntas e mesmo `calcularServico` do orçamento do site, uma pergunta por vez), `motor` (orquestra), `eventos` (ponte com o carrinho).
- Guardrails: recusa assunto de fora (lista `fora`); pedido maior (app, loja virtual, integração, urgência...) e o que não sabe vão para o formulário (`#orcamento`) ou o WhatsApp, sem número; pedidos para ignorar regras, fingir outro papel ou revelar instruções são recusados antes de qualquer outra regra. Bots de Discord apontam para a Comunidade.
- Interface em `src/pages/negocios/assistente/`: só `BotaoAssistente.tsx` entra no JavaScript da home; `PainelAssistente.tsx` (com o motor) é um pedaço separado, baixado na primeira abertura (e aquecido quando o ponteiro chega perto do botão). `<dialog>` como os outros modais (tela cheia no celular, cartão no canto a partir de `md`), com a altura presa à área visível (`visualViewport`) por causa do teclado.
- Orçamento na conversa termina com "Adicionar ao carrinho e revisar": o chat avisa a seção Orçamento por um evento (`assistente:carrinho`), que coloca o serviço no carrinho com as respostas (`comRespostas` em `carrinho-estado.ts`, que descarta o que não existe) e abre o painel do carrinho, onde está o formulário de envio. Também oferece o WhatsApp com a mesma mensagem do carrinho.
- LGPD: a conversa vive só na memória da aba (nada em `localStorage`, cookie ou rede; o teste de jornada confere), some ao recarregar e tem botão "Limpar a conversa". Sem análise de uso. Nesta etapa nenhum dado sai do aparelho, então `privacidade.ts` não mudou.

**Etapa 2 (a fazer, ver `PENDENCIAS.md`):** WebLLM em Web Worker, só depois de o visitante confirmar o aviso do download (tamanho em MB, uso de dados móveis); detecção de `navigator.gpu`, memória e `saveData`, e sem WebGPU o chat continua só com o motor. Antes de publicar: seção nova em `privacidade.ts` (o CDN dos pesos vê o IP do visitante; o texto digitado não sai), data nova em `versoes.ts`, registro em `juridico.md`, e `connect-src`/`worker-src`/`wasm-unsafe-eval` na CSP do `netlify.toml`.

**Limites conhecidos:** o assistente escreve "do jeito que está nas perguntas do site" ao citar as perguntas frequentes (que falam em primeira pessoa do Marcelo); o motor não entende frases muito livres (aí encaminha); a navegação para outra página (Termos, Comunidade) encerra a conversa, porque ela só existe na memória.
