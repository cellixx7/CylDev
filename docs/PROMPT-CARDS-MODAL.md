# Prompt de implementação — Cards de serviços, modal e carrinho separado

> **Objetivo deste documento:** instruir um agente de código a implementar a nova interface. **Este arquivo não implementa nenhuma mudança funcional.** A execução exige aprovação do responsável ao fim de cada bloco.

## Contexto e missão

Você é um engenheiro frontend sênior e designer de produto trabalhando no CylDev. Substitua a experiência atual de orçamento em fluxo único de três passos por uma vitrine de **oito cards**, um **modal nativo de serviço** com duas abas e um **painel separado de carrinho**. A lista, o questionário e o carrinho não devem disputar espaço na página.

**Antes de alterar qualquer coisa, leia `CLAUDE.md` e siga suas regras.** A raiz de Negócios é `/` (não `/negocios/`); a seção mantém `#orcamento`. A branch `main` é a referência atual. Não faça merge.

### Descoberta obrigatória, econômica e guiada por grafo

1. **Antes de abrir arquivos de código**, consulte `graphify-out/GRAPH_REPORT.md`. Use `graphify query` para localizar consumidores do catálogo, componentes de orçamento, funções de preço e caminhos de checkout; `graphify path` para rastrear dados de `perguntas.ts` até a interface e o EmailJS/WhatsApp; e `graphify explain` para entender os módulos relevantes. Descubra a sintaxe real dos comandos; não invente opções.
2. O relatório do grafo está em `graphify-out/` e é ignorado pelo Git. Se não existir ou o CLI não estiver disponível, **registre a limitação**, faça busca direcionada no código e não alegue ter executado Graphify. Abra arquivos completos apenas quando for necessário editá-los.
3. Consulte `docs/DECISOES.md`, `docs/ORCAMENTO-SPEC.md` se existir, a skill `.claude/skills/design-taste-frontend` e os arquivos relacionados identificados pelo grafo. Se a skill não existir, informe e aplique os critérios de design do projeto.
4. Antes de implementar, produza um inventário real dos arquivos, usos, contratos e riscos. **Pare para aprovação do Bloco 1 antes de prosseguir.**

## Restrições inegociáveis

- **Não alterar** lógica, dados nem testes existentes de `src/shared/lib/orcamento.ts`, `src/shared/lib/prazo.ts`, `src/content/perguntas.ts`, `src/content/orcamento.ts` e `src/content/servicos.ts`. Também preserve `src/content/exemplos.ts`. A mudança é de **interface**. Testes novos de UI/integração podem ser criados, sem reescrever testes protegidos.
- Preserve cálculo de base, adicionais, combo/piloto (não cumulativos), prazo, mensalidade, aulas, sob consulta e regras dos bots. Para bots com horas provisórias: **“prazo a combinar”**.
- Preserve a proteção do EmailJS (isca e mínimo de três segundos), configuração e canais existentes; não adicione chaves privadas nem dependências em runtime. Só React/React DOM; `<dialog>` nativo, sem biblioteca de modal.
- Tailwind v4 com **classes literais completas**, sem interpolação que impeça a detecção. Paleta cobalto, fontes Space Grotesk/Space Mono locais, temas claro e escuro. Sem degradê, vidro, blur ou emoji. Não invente métricas, depoimentos ou prazos; rotule exemplos.
- Conteúdo editável novo em `src/content/` quando apropriado, sem tocar nos arquivos protegidos. Não duplique preços em JSX; derive dos modelos/funções existentes. **“A partir de” só quando comercialmente verdadeiro**: respeite preço fixo, aulas e sob consulta; não rotule indiscriminadamente todos os oito serviços.
- Responsividade mobile-first, alvos de pelo menos 44 px, foco visível, `prefers-reduced-motion`, radios e checkboxes nativos. Sem modais empilhados.
- **Após cada bloco, entregue diff resumido, evidências de teste, riscos e pergunta objetiva de aprovação. Não prossiga sem minha autorização.**

## Inventário esperado: reaproveitar, substituir e remover

Confirme os nomes e usos atuais com o grafo; este é o inventário inicial, não licença para apagar código sem verificar referências.

| Área | Tratamento proposto |
|---|---|
| `src/pages/negocios/Orcamento.tsx` | **Refatorar** como orquestrador: seleção, estado de respostas por serviço, IDs do carrinho, modal ativo e painel do carrinho; sem duplicar valores derivados |
| `ListaServicos.tsx` | **Substituir visualmente** por grid de oito cards; reutilizar o mapeamento dos serviços se fizer sentido |
| `PainelServico.tsx` | **Extrair/reaproveitar** campos nativos, ajuda, estimativa e memória de cálculo dentro do modal; remover o componente antigo somente depois de migrar usos |
| `Carrinho.tsx` | **Refatorar** para painel independente e fechamento, preservando EmailJS/WhatsApp e comportamento de descontos |
| `src/shared/components/Catalogo.tsx` | **Auditar consumidores**. O catálogo já repete serviços: evitar duas vitrines concorrentes na mesma página. Se for usado em `/comunidade/` ou outras páginas, **preservar** esses usos. Em Negócios, consolidar a apresentação nos oito cards; reutilizar helpers de formatação quando apropriado, sem apagar componente compartilhado sem verificar dependências |
| `src/pages/negocios/main.tsx` | Ajustar âncoras/entrada somente se necessário; preservar Vite multi-page e demais seções |
| `src/content/textos.ts` | Incluir rótulos novos, acessíveis e editáveis sem alterar regras de preço |
| `src/styles/tema-negocios.css` e estilos compartilhados | Ajustar apenas o necessário para diálogo, painel, scroll e tokens; não afetar Comunidade |
| `src/shared/lib/orcamento.ts` e módulos protegidos | **Somente leitura**: utilizar APIs existentes para cálculo, resumo, WhatsApp e desconto |
| Testes atuais | **Preservar**; acrescentar testes de interface/integração com as ferramentas disponíveis |

Se a API atual de `textoPedido()` não incluir requisitos selecionados, **não modifique a lógica protegida**: registre a lacuna e peça autorização antes de implementar qualquer serialização alternativa que possa alterar o contrato comercial. Não permita que o novo checkout perca informações que a interface coleta.

## Bloco 1 — Cards e dados (PARAR PARA APROVAÇÃO)

**Problema:** lista de serviços compacta e catálogo redundante dificultam comparação, reconhecimento e escolha.

**Implementar:** seção `#orcamento` com oito cards, derivados dos serviços existentes, cada um com nome, uma linha de proposta de valor, preço em Space Mono e 2–3 itens reais do que está incluso. Usar semântica de preço fiel ao tipo: “a partir de R$ X” quando aplicável, valor fixo, aula/hora ou “sob consulta”. Cada card tem três ações separadas, sem click handler no card inteiro:

1. **Ver detalhes:** abre o modal na aba Detalhes (no Bloco 2; inicialmente pode usar interface provisória explicitamente indicada, sem ação quebrada ao entregar o bloco).
2. **Fazer orçamento:** abre o modal na aba Orçamento.
3. **Pôr no carrinho:** inclui o serviço imediatamente com as respostas atuais (ou vazias) e seu preço-base; duplicatas não criam itens repetidos. A edição posterior fica acessível no carrinho.

Definir estados claros: normal, foco, adicionado e serviço em edição. Garantir cartões com altura equilibrada sem truncar conteúdo, grade responsiva por largura disponível, bom contraste e ausência de catálogo duplicado em Negócios. Não ocultar serviços com preço sob consulta.

**Pronto quando:** oito serviços corretos, três ações distinguíveis, textos/preços derivados das fontes oficiais, sem duplicação com `Catalogo.tsx`, sem regressão em Comunidade, layout inicial conferido no celular. **PARAR, apresentar diff e pedir aprovação.**

## Bloco 2 — Modal nativo com abas (PARAR PARA APROVAÇÃO)

**Problema:** questionário e explicações competem com o restante da página.

**Implementar:** um único `<dialog>` controlado por React, com `showModal()`/`close()`, `aria-labelledby` ligado ao nome do serviço e botão de fechar visível. `showModal()` cria modalidade e contenção de foco nativas; testar Tab/Shift+Tab, Esc e restauração do foco ao botão exato que abriu o diálogo. Não implementar um focus trap manual desnecessário. Tratar o evento `cancel` e desmontagem/fechamento com segurança. Evitar scroll do fundo e restaurá-lo após fechar, inclusive ao navegar entre serviços. Foco inicial lógico no título ou primeira aba, sem scroll inesperado.

**Duas abas acessíveis:**
- **Detalhes:** o que é, o que você recebe e notas comerciais reais; conteúdo legível e escaneável.
- **Orçamento:** perguntas existentes, ajuda contextual, radios/checkboxes nativos, estimativa atualizada e seção “Como chegamos a esse valor” usando linhas de cálculo existentes.

Implementar abas com `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, IDs únicos e navegação de teclado (setas, Home/End, Tab), ou documentar outra implementação igualmente acessível. Trocar aba não apaga respostas. Abrir “Ver detalhes” ou “Fazer orçamento” escolhe a aba correta; editar pelo carrinho abre diretamente Orçamento.

**Mobile:** diálogo em tela cheia, altura dinâmica, conteúdo rolável e **rodapé fixo dentro do diálogo** com preço (ou “sob consulta”) e “Adicionar ao carrinho”/“Atualizar item”; respeitar safe-area, teclado virtual e zoom. Desktop: largura e altura máximas proporcionais à viewport, sem overflow horizontal. `aria-live="polite"` no preço atualizado, sem anunciar toda a árvore a cada clique.

**Link direto:** suportar `/#planilha` e demais IDs válidos, abrindo o modal do serviço. Preservar `/#orcamento` como âncora normal. Definir comportamento de histórico: abrir pelo card atualiza hash sem loops; fechar limpa/restaura o hash de forma previsível; Back/Forward sincronizam modal; hash desconhecido não abre modal. Garantir que `/comunidade/` e outras rotas não sofram interceptação. Testar carregamento direto e recarga.

**Pronto quando:** modal funciona nos dois temas e em desktop/mobile; foco, Esc, retorno ao disparador, abas, link direto e preservação das respostas validados. **PARAR para aprovação.**

## Bloco 3 — Carrinho e fechamento (PARAR PARA APROVAÇÃO)

**Problema:** carrinho misturado à configuração e falta de acesso persistente ao pedido.

**Implementar:** barra fixa “Carrinho (n) · total” (com indicação de valor estimado, “a partir de” ou itens sob consulta quando cabível), que abre **painel independente** com itens, edição, remoção, subtotal, combo/piloto aplicado, prazo, mensalidade de bots e total. Em mobile, considerar painel de tela cheia ou drawer; em desktop, painel lateral ou região destacada. **Nunca abrir painel sobre modal:** ao partir do modal, feche-o primeiro, aguarde seu fechamento e só então abra o carrinho. Editar item faz o inverso. Evite dois elementos modais ativos e garanta retorno de foco.

**Adicionar diretamente:** item entra com preço-base sem exigir respostas. Mostre estado “configuração não preenchida” quando relevante e link “Ajustar respostas” que abre Orçamento com estado preservado. Não invente perguntas obrigatórias; explique que estimativas sem respostas podem mudar. Preserve uma única entrada por serviço.

**Fechamento com mesmo peso visual:** “Enviar pelo site” (EmailJS) e “Conversar no WhatsApp”, ambos acessíveis no painel. O pedido deve conter o escopo disponível, preços, descontos, prazos e mensalidades, respeitando APIs e proteções existentes. Não envie pedido vazio. Em falha de EmailJS, mantenha alternativas de contato e feedback acessível. Preserve estado ao fechar/reabrir carrinho.

**Pronto quando:** adicionar, editar, remover, reabrir, combo, mensalidade, sob consulta, dois canais e transições modal↔painel funcionam sem sobreposição nem perda de dados. **PARAR para aprovação.**

## Bloco 4 — Acessibilidade, capturas e acabamento (PARAR PARA APROVAÇÃO)

Executar revisão mobile-first, depois tablet e desktop. Capturar **390, 768, 1024 e 1440 px, nos temas claro e escuro** (oito capturas mínimas, mais capturas do modal em ambas as abas e do carrinho). Verificar também 320 px, viewport baixa, zoom 200%, texto ampliado, teclado virtual quando disponível e `prefers-reduced-motion`. Medir overflow horizontal, cortes, elementos cobertos pela barra, sticky e scroll do fundo.

Testar somente com teclado: abrir cada ação, mudar abas, escolher radios/checkboxes, Esc, retorno de foco, editar item, fechar painel e navegar Back/Forward. Conferir nomes acessíveis, `aria-labelledby`, `aria-live`, estados desabilitados, alvos de 44 px e contraste. Capturas não substituem testes de interação.

**Pronto quando:** evidências de capturas e checklist com resultado por viewport/tema; bugs encontrados corrigidos e limitações explicitadas. **PARAR para aprovação final.**

## Testes obrigatórios

Preserve os testes de `src/shared/lib/orcamento.test.ts` e `src/shared/lib/prazo.test.ts` (se existentes). Não os edite para acomodar o redesign. Criar testes apropriados, por exemplo:

- `src/pages/negocios/Orcamento.test.tsx`: oito cards, preços por tipo, ações, inclusão sem duplicatas, respostas preservadas, atualização do carrinho, links hash.
- `src/pages/negocios/ModalServico.test.tsx`: abertura na aba correta, alternância, labels, fechamento por Esc, retorno de foco, radios/checkboxes e anúncio do preço.
- `src/pages/negocios/CarrinhoPainel.test.tsx`: abrir/fechar, editar, remover, vazio, combo/piloto, prazo, mensalidade, sob consulta, não empilhar modais.
- `src/pages/negocios/CheckoutPedido.test.tsx`: payload de EmailJS, mensagem do WhatsApp, escopo preservado, falha, spam, estado de envio.
- `src/shared/components/Catalogo.test.tsx` (se necessário): consumidores existentes sem regressão.

**Atenção ao runner:** `CLAUDE.md` informa que `npm test` roda `src/**/*.test.ts`; arquivos `.test.tsx` podem não ser coletados. Antes de criar testes, verifique `vitest.config`/`vite.config` e scripts. Ajuste apenas a configuração de descoberta de testes se necessário e aprovado, ou use testes `.test.ts` com ferramentas já instaladas. Não introduza dependências de testing library, jsdom ou browser sem aprovação. Se não houver ambiente DOM, use testes puros onde possível e automação de Chrome/CDP para integração, relatando o que ficou manual.

Antes de **cada commit**, executar `npm run typecheck`, `npm test` e `npm run build`; corrigir falhas antes de registrar o commit. Testar as duas formas de checkout sem realizar envios reais não autorizados.

## Riscos e decisões a submeter ao responsável

1. **Escopo enviado:** confirmar se a API protegida de `textoPedido()` já inclui as respostas; se não, pedir autorização específica antes de alterar contrato ou lógica.
2. **URL/hash:** decidir como o hash deve se comportar ao fechar um modal aberto diretamente por link e como preservar o botão Voltar; propor a solução na aprovação do Bloco 2.
3. **Ação “Pôr no carrinho”:** confirmar se a inclusão sem respostas deve ser sempre permitida (premissa atual) e como rotular a estimativa incompleta.
4. **Catálogo compartilhado:** apresentar consumidores reais antes de remover/ocultar qualquer instância; preservar `/comunidade/`.
5. **Preços e descontos pendentes:** não alterar valores nem anunciar descontos como confirmados se `docs/DECISOES.md` os marcar como proposta.
6. **Ferramentas de teste:** se faltarem DOM/browser/Graphify, registrar limitação e solicitar aprovação antes de adicionar dependências.
7. **Interação entre painel e modal:** especificar restauração de foco e sincronização do hash sem abrir duas superfícies simultaneamente.

Pergunte ao responsável **no máximo cinco questões**, somente se a resposta mudar implementação, escopo ou regras; caso contrário, apresente decisões recomendadas e avance apenas até a parada de aprovação do bloco.

## Fluxo de Git e entrega

- Crie uma branch **`commit_HH-MM_DD-MM_VXN`**, com hora/minuto, dia/mês e versão/número conforme a convenção do projeto; **nunca** inclua “claude”. Não trabalhe diretamente na `main`.
- Commits em **pt-BR**, com prefixos `feat:`, `fix:`, `docs:` ou `chore:`. Não faça commit sem `npm run typecheck`, `npm test` e `npm run build` aprovados imediatamente antes.
- Ao fim da implementação e após aprovação dos quatro blocos, execute `graphify update .` se disponível; não versione `graphify-out/`.
- Faça push da branch e abra **PR como rascunho**, fornecendo o link e um resumo dos quatro blocos, capturas e resultados de testes. **Não faça merge.**
- Se o ambiente não permitir push ou PR, informe a limitação; não afirme que publicou.

## Primeiro retorno esperado do agente

Apresente, **antes de escrever código**, o mapa de dependências obtido pelo grafo (ou limitação), o inventário confirmado, o plano do Bloco 1, os riscos de catálogo compartilhado e eventuais perguntas essenciais. Aguarde minha aprovação para implementar o Bloco 1. Depois, repita o ciclo de implementação → testes → evidências → aprovação em cada bloco.
