# Orçamento, carrinho e preços

Como o orçamento calcula preço e prazo, como a interface funciona e o que foi decidido sobre combo, piloto, bots e sistema. Seções em ordem de data; a mais nova fica no fim.

## Seção de orçamento (06/11/2026)

- **Onde:** `#orcamento` em Negócios, logo abaixo da apresentação (`src/pages/negocios/orcamento/Orcamento.tsx`).
- **Calculadora + formulário:** o cliente escolhe o pacote (todos os de Negócios) e o tamanho (Básico, Médio, Complexo). A estimativa mostra o valor, as horas e o prazo; aulas trocam o tamanho pelo formato (avulsa ou pacote); Sistema sob medida fica sob consulta.
- **Resumo do pedido:** `resumoOrcamento()` em `src/shared/lib/orcamento.ts` monta a linha que vai no WhatsApp e no formulário (prop `resumo` do `Formulario`, que deixa a mensagem opcional). Origem: `negocios-orcamento-<id>`.
- **Desconto de piloto:** preço de tabela riscado ao lado do valor com desconto (`comDesconto()`), com as vagas restantes. Não vale para aulas.
- **Confirmados pelo Marcelo:** fator 1,5 da complexidade média e 6 h base da automação.

## Orçamento por respostas e carrinho (09/11/2026, em andamento)

Fonte: `docs/ORCAMENTO-SPEC.md`. Substitui o "tamanho" (Básico, Médio, Complexo) e o fator 1,5, que deixaram de existir (`complexidades` e `estimar()` removidos).

- **Modelo de perguntas:** `src/content/perguntas.ts` (textos, opções, ajuda e horas por resposta).
- **Preço:** base do serviço (`servicos.ts`, sem alteração) + horas extras das respostas × `VALOR_HORA_EXTRA` (R$ 50, igual a `parametros.valorHoraAvulsa`). Múltipla: `max(0, n - gratis) * horasPorExtra`. Aulas: só o formato. Sistema: sob consulta.
- **Prazo:** `ceil(horas / 2) + 1` dia de revisão ("estimado: N dias úteis"). Bots: sempre "prazo a combinar"; o preço varia pelas respostas e aparece como estimativa. Os dois bots não mostram horas.
- **Carrinho** (`calcularCarrinho()` em `src/shared/lib/orcamento.ts`): soma de tabela, desconto, prazo único dos combináveis (horas somadas, uma só revisão), mensalidade dos bots (10% da criação já com as extras, sem piloto) e total.
- **Combo e piloto não se somam:** vale o que abate mais reais. O combo incide só nos combináveis (planilha, painel, automação, landing); o piloto, em toda a criação (combináveis e bots), nunca em aulas, sistema ou mensalidade. Em empate, vale o combo. Essa leitura do "vale o maior" é minha, confirmar.

- **Interface (Bloco 2):** `Orcamento.tsx` monta três áreas (`ListaServicos`, `PainelServico`, `Carrinho`, ao lado dele). A partir de 1280 px ficam lado a lado; de 1024 a 1279 px o carrinho desce para baixo do painel (não cabem três áreas legíveis); abaixo de 1024 px é uma tela por vez (lista, serviço, carrinho), com "← Serviços", "Carrinho (n)" e barra fixa de preço na tela do serviço (só aparece enquanto a seção está na tela).
- **Fontes:** Space Grotesk (variável) e Space Mono 400 e 700, subconjunto latino, woff2 da Google Fonts, licença SIL OFL, em `public/fonts/` (nomes iguais aos de `tema-negocios.css`). Sem requisição externa em runtime.
- **Fechar pelo site:** o formulário do carrinho já envia pelo `enviarContato` (origem `negocios-carrinho`); os campos `pedido` e `estimativa` do template entram no Bloco 3.
- **"Vale o maior" (combo ou piloto):** comparação por reais abatidos. A confirmar.

- **Pendências desta mudança:** foram para `docs/PENDENCIAS.md`.

## Orçamento compacto (09/11/2026)

- **Interface:** a seção virou um fluxo único em 3 passos (1 escolha o serviço, 2 responda, 3 seu pedido), sem as três telas do celular. Serviços em grade de botões (nome e preço); perguntas com opções em botões lado a lado; "O que está incluso" e "Como chegamos a esse valor" recolhidos; no desktop o passo 3 (estimativa e carrinho) fica fixo ao lado. Lógica, preços e perguntas não mudaram.

## Orçamento: refatoração de UX (etapas, pedido estruturado)

- **Etapas:** Serviços → Configuração → Meu pedido (`Orcamento.tsx`). No desktop, serviços e configuração dividem a tela, com lateral compacta (estimativa do serviço e resumo do pedido); no celular, uma etapa por vez, com barra fixa (quantidade, total e uma ação). Sem rolagem interna: a lateral só fica sticky em janelas com altura de 60rem ou mais.
- **Pedido estruturado:** `src/shared/lib/pedido.ts` (novo) monta o pedido (respostas, acréscimos, preço-base, prazo, mensalidade, desconto, sob consulta, observações) a partir de `calcularCarrinho()` e alimenta tela de revisão, WhatsApp e EmailJS. `orcamento.ts` não foi alterado; `textoPedido()` dele (sem respostas) ficou sem uso na interface.
- **Perguntas não são obrigatórias:** o spec não define obrigatoriedade. O progresso ("3 de 5") informa, não bloqueia. Estados da estimativa: preço inicial, em configuração, configurada, sob consulta.
- **Pedido vazio:** sem formulário nem WhatsApp; a revisão mostra o caminho de volta aos serviços.
- **Pendências comerciais inalteradas:** horas extras e piloto continuam como propostas a confirmar. (Combos: confirmados em 12/11/2026, ver "Combo oficial" em `orcamento.md`.)

## Orçamento em cards com modal (10/11/2026)

- **Cards:** só dois botões, "Fazer orçamento" (principal) e "Ver detalhes". O carrinho é um ícone no canto superior direito do card (`BotaoCarrinho.tsx`): contorno quando vazio, preenchido com `--color-destaque` (a cor do botão principal) quando o serviço está no carrinho. Clicar alterna; as respostas ficam guardadas (`carrinho-estado.ts`). `aria-pressed`, rótulo completo e dinâmico, alvo de 44 px, anúncio em `role="status"`.
- **Dica do ícone:** abre com hover e com foco, fecha com Esc, `role="tooltip"` e `aria-describedby`; sem número de desconto. Só os serviços combináveis mencionam o combo.
- **Animação:** "pop" de escala de ~260 ms ao entrar no carrinho; com `prefers-reduced-motion` a troca é direta.
- **Combo:** vale para quaisquer 2 ou mais entre planilha, painel, automação e landing (regra já existente em `calcularCarrinho`, agora coberta por teste). O atalho da linha abaixo dos cards continua pondo planilha, painel e automação.
- **`Catalogo.tsx`** não foi alterado: a Comunidade o usa e `orcamento.test.ts` importa `textoPrazo` dele.

- **Modal do serviço (bloco 2):** `<dialog>` nativo (`ModalServico.tsx`) com abas Detalhes e Orçamento (padrão ARIA tabs, setas, Home e End), rodapé fixo com o preço (`aria-live`) e "Adicionar ao carrinho". Celular em tela cheia; a partir de 48 rem, caixa de até 44 rem. O estado (serviço, aba, respostas) vive em `Orcamento.tsx`.
- **Link direto:** `#planilha` abre em Detalhes e `#planilha/orcamento` em Orçamento (`hashServico.ts`). `pushState` ao abrir, então o "voltar" fecha o modal; fechar por botão, Esc ou fundo faz `history.back()` (ou `replaceState` quando o modal veio de link direto). Trocar de aba usa `replaceState`. O foco volta ao botão que abriu ou, sem origem, ao card.
- **Estimativa:** o `aria-live` do preço ficou só no rodapé do modal (antes havia um segundo, no painel). O rodapé mostra o preço de tabela riscado e "com N% de desconto de piloto" quando há piloto.

- **Ícone do carrinho (revisão):** vazio é só contorno na cor de texto principal do tema; no carrinho é uma cesta cheia com 3 itens por cima, preenchida com `destaque` (a mesma cor do botão "Fazer orçamento"). Os itens caem em sequência (3 animações, atraso de 90 ms, 220 ms cada, ~400 ms no total); com `prefers-reduced-motion` a troca é direta. Validado no Chrome via DevTools Protocol (`document.getAnimations()` com e sem movimento reduzido).
- **Rótulo do preço no modal:** com pergunta sem resposta, "estimativa a partir de R$ X"; com tudo respondido, "estimativa R$ X". Aulas e sob consulta não ganham rótulo. É só texto (`rotuloDoPreco`, em `ResumoEstimativa.tsx`): o valor vem de `calcularServico()`.
- **Atalho do combo:** "Pôr planilha, painel e automação no carrinho".

- **Carrinho (bloco 3):** barra fixa "Carrinho (n) · total" (`BarraCarrinho.tsx`) em todas as larguras, só quando há itens, fora do `.revela` e publicando `--altura-barra` (o botão de tema e o fim da página sobem junto). Abre o `PainelCarrinho.tsx`: `<dialog>` próprio, gaveta de 34 rem à direita a partir do tablet e tela cheia no celular, com itens, "Ajustar respostas", "Remover", desconto (combo ou piloto, vindo do cálculo), prazo, mensalidade, total, observações e as duas formas de fechar (site e WhatsApp, mesmo cartão e mesmo botão cheio, uma sobre a outra).
- **Nunca modal sobre modal:** "Ver carrinho" no rodapé do modal fecha o modal e só depois abre o painel; "Ajustar respostas" fecha o painel e abre o modal na aba Orçamento (`#servico/orcamento`). Um contador (`useTravaRolagem`) cuida da trava de rolagem. Foco: o painel devolve à barra; o modal, ao botão que abriu ou ao card.
- **Aviso de estimativa:** `ItemPedido.estimativa` = tem valor e `perguntasRespondidas < perguntasTotal` (`pedido.ts`, fora dos arquivos protegidos). Aparece no painel (etiqueta e frase por item, aviso no total), na barra ("estimativa a partir de R$ X") e no texto do WhatsApp e do EmailJS ("Valor (estimativa)", "Estimativa: N perguntas sem resposta" e "Valores em estimativa: ..."). Os dois canais usam o mesmo `textoPedidoCompleto`.
- **Removidos:** `ResumoPedido.tsx` (barra e lateral antigas) e as chaves de texto de etapas, passos, lista e resumo. `RevisaoPedido.tsx` virou `PainelCarrinho.tsx`.
- **Nome unificado:** o serviço 02 agora se chama "Painel básico" no card, no modal, no carrinho e na mensagem (antes o modal e o carrinho diziam "Painel de dados"). Pedido do Marcelo; mudou só `nome` em `perguntas.ts` (protegido) e a expectativa do nome em `pedido.test.ts` e `orcamento.test.ts`.
- **Validação:** fluxo completo conferido no Chrome via DevTools Protocol, em 390 px (emulação de dispositivo) e 1024 px: abrir e fechar por barra, Esc, "voltar", retorno do foco, um só dialog por vez, trava de rolagem e texto do WhatsApp.

## Pedido preservado entre páginas (P1-02, 11/11/2026)

**Substitui a decisão D3 ("sem persistência", só memória) do prompt dos cards com modal.**

- **O que é guardado:** em `sessionStorage`, chave `carrinho-negocios`: versão do formato (`v: 1`), ids dos serviços no carrinho e respostas (ids de pergunta e de opção). **Nunca** nome, telefone, e-mail, observações nem preço. Acesso sempre em try/catch (`carrinho-persistencia.ts`).
- **Ao restaurar:** valida contra os serviços e perguntas atuais; id de serviço, pergunta ou opção que não existe mais é descartado; versão desconhecida ou texto corrompido volta ao carrinho vazio. Não existe preço salvo: o valor sai sempre de `montarPedido`/`calcularServico` com as respostas restauradas.
- **Regra:** restaura ao navegar entre páginas e ao recarregar (mesma aba); limpa depois de um envio pelo site com sucesso (o descarte silencioso de spam não limpa); o abre/fecha do modal e do painel não é persistido; as observações também não.
- **Não limpa:** clicar em "Chamar no WhatsApp" ou "Enviar por e-mail" (o site não tem como saber se a mensagem foi enviada). Fechar a aba encerra a sessão e o carrinho some.
- **Pendente:** verificação no navegador (ida a Como funciona e volta) fica para os testes de jornada do P4-03.

## Bloco 3 da auditoria: bots, mensalidade e planilha

- **A. Bots fora de Negócios:** `servicosDoCatalogo` (`perguntas.ts`) é a lista do que Negócios vende (área `negocios`); cards, link direto (`#bot-ia` não abre mais modal), `adicionar` do carrinho e a restauração do `sessionStorage` usam essa lista. Os bots seguem em `servicosOrcamento` só para o cálculo e a Comunidade (`servicos.ts`, `orcamento.ts` e as perguntas dos bots não mudaram). Carrinho salvo antes com `bot-essencial`/`bot-ia`: ids e respostas dos bots são descartados em silêncio e o resto fica (teste em `carrinho-persistencia.test.ts`).
- **Chamada para a Comunidade:** bloco abaixo dos cards ("Quer um bot para o seu servidor de Discord?") com link para `/comunidade/#bots`. **Removida em 16/11/2026 (Etapa 4 da auditoria):** misturava as duas áreas no ponto em que o cliente de negócio decide; ficam o atalho "Comunidade" do cabeçalho e a ponte do rodapé.
- **B. Mensalidade (P2-04):** o parágrafo da Comunidade dizia que a mensalidade "cobre hospedagem" e somava a hospedagem. Agora separa: mensalidade = monitoramento e correção de erros (10% da criação por mês); hospedagem = custo à parte; IA = cobrada pelo provedor na conta de quem contrata. Isso segue o que o resto do site e a mensagem do WhatsApp já diziam ("hospedagem à parte"). **Confirmar:** se o Marcelo hospeda os bots dentro da mensalidade, a frase e o "mais a hospedagem" de todo o site mudam.
- **C. Pergunta da planilha (P2-06):** opção 1 escolhida pelo Marcelo. Só texto, sem mudar preço, horas nem `servicos.ts`: nova opção "Sim, e está em boa ordem" (+0) e "Sim, e precisa de arrumação grande" (+1 h, mesmo id `bagunca`, então carrinhos salvos continuam válidos). A ajuda define a limpeza básica incluída (linhas vazias e repetidas, colunas padronizadas) e diz quando soma 1 h. **Confirmar:** o limite da limpeza básica é sugestão minha.

## Bloco 4: "Não sei qual escolher" (P4-02)

- **Onde:** botão logo abaixo da introdução da seção `#orcamento`; abre um painel na própria página (`GuiaEscolha.tsx`), sem dialog, então não há modal sobre modal. Os cards continuam todos visíveis e livres, sem cadastro.
- **Conteúdo:** perguntas, opções e resultados ficam em `src/content/guia.ts`, sem número, preço nem prazo (teste confere). No máximo duas perguntas: o objetivo (números, página, aulas, sistema, bot) e, para "números", o que mais atrapalha (planilha bagunçada, painel, automação).
- **Resultado:** o serviço recomendado com o porquê e os mesmos caminhos dos cards ("Fazer orçamento" abre o modal na aba Orçamento; "Ver detalhes", na aba Detalhes). "Quero um bot" não recomenda card: leva a `/comunidade/#bots` (a seção existe em `comunidade/main.tsx`).
- **Lógica:** `shared/lib/guia.ts` (pura): escolha inválida é ignorada, não avança depois do resultado, "Voltar" e "Recomeçar". Acessibilidade: botões nativos, `aria-expanded`/`aria-controls`, foco no título de cada etapa.
- **Pendente (do relatório da auditoria):** validar com pessoas do público se conseguem escolher e justificar a escolha; não foi feito. Os textos das perguntas e dos "porquês" são propostas minhas.

## Combo oficial, A-03 e e-mail sem duplicação (12/11/2026)

- **Combo oficial:** 1 serviço, preço normal (com o piloto, se houver vaga); 2 combináveis, 10%; 3 ou mais, 15%. O rótulo "pendente" saiu de `orcamento.ts`. Teste novo: 1 combinável, e combinável + aula/sistema, não formam combo.
- **Piloto x combo (como já era):** não se somam nem se multiplicam; o código calcula os dois sobre a soma de tabela e aplica só o que abate mais reais (empate: combo). O combo incide só nos combináveis; o piloto, em toda a criação (inclui bots) e nunca em aulas, sistema nem mensalidade. Não há desconto embutido no preço-base. Ordem mantida: só seria preciso mudar se o piloto desse ao cliente menos que o combo, o que não acontece.
- **A-03:** "Preços fechados" saiu da descrição e do `og:description` de `index.html`: agora "Orçamento na hora, com preço a partir de R$ 100." (não há `twitter:description`).
- **E-mail:** `enviarContato` manda `mensagem` vazia quando há `itens`; sem itens, vai como veio. O WhatsApp segue com a mensagem completa. `docs/emailjs-template.md` atualizado (precisa de teste real do template).

## Aulas saem, entra Automação com Python (12/11/2026)

- **Decisão do Marcelo:** as aulas de Excel/programação saem do catálogo (o tipo de preço `aula` e o formato avulsa/pacote foram removidos do código). No lugar entra o serviço `python` (Automação com Python), no mesmo lugar da grade (6 cards, 3 + 3). Não é combinável (fora do combo e do prazo único), mas recebe o piloto como criação e tem prazo calculado.
- **Preço-base R$ 300 ("a partir de"), 6 h base (regra do Marcelo, 12/11/2026):** 6 horas x R$ 50 (`VALOR_HORA_EXTRA`), sem desconto embutido. Substitui a conta anterior (12 h e "média dos pisos de mercado menos 10%", R$ 585), que foi descartada. Mesmo esquema da planilha e do painel: cada resposta soma horas inteiras (R$ 50 cada).
- **Horas das respostas (propostas, confirmar):** tarefas a mais 1 h cada (a 1ª é inclusa); origem dos dados: planilha/CSV 0 h, PDF 1 h, site 2 h, vários lugares 3 h; como roda: manual 0 h, horário marcado 1 h, tela de botões 2 h. Caso simples (1 tarefa, só uma das extras) fica em R$ 350 a R$ 400; o prazo sai de `prazoEmDias` (6 h = 4 dias úteis com a revisão).
- **Contra o Excel:** o card e o guia avisam que, se a tarefa couber no Excel, a Automação em Excel tem o mesmo valor de partida (R$ 300), e o Python fica para o que o Excel não alcança.
- **Carrinho salvo:** um carrinho antigo com o id `aulas` é descartado ao restaurar (id fora do catálogo).

## Tela "Por que esse valor?" (12/11/2026)

- **O que é:** diálogo nativo com o botão "Por que esse valor?" no resumo da aba Orçamento (explica só o serviço aberto, no mesmo valor que o resumo mostra) e no painel do carrinho, abaixo do total (explica o pedido todo). Parte 1 geral, parte 2 "No seu pedido" (só com serviço). Textos em `orcamento.valor` (`textos.ts`), espelho em `COPY.md`.
- **Sem regra de preço nova:** `src/shared/lib/explicacaoValor.ts` só lê o resultado de `calcularCarrinho()`. Os extras vêm de `horasExtrasDa()` x `VALOR_HORA_EXTRA`, e o desconto escolhido é o do carrinho. O único cálculo próprio é quanto a outra regra abateria, só para explicar por que a vencedora venceu. `orcamento.ts`, `servicos.ts`, `exemplos.ts`, `prazo.ts` e as regras de spam não foram tocados.
- **A soma fecha:** `explicacaoValor.test.ts` confere, em 90 combinações (10 carrinhos x 3 pilotos x 3 níveis de resposta, com piloto vencendo, combo vencendo e empate), que preço-base + extras - desconto é igual a `carrinho.total`. O e2e confere os números na tela.
- **Bots (horas provisórias):** sem hora e sem prazo; a tela diz "horas e prazo: a combinar".
- **Sem hash `#valor` (decisão, avise se quiser):** o `popstate` do modal trata qualquer hash que não seja um serviço como "nenhum serviço" e fecharia o modal; o carrinho não usa hash. Para não arriscar o fluxo atual, o diálogo não mexe na URL (Esc, botão e fundo fecham; o foco volta ao botão).
- **Diálogo dentro de diálogo:** abre por cima do modal do serviço ou do painel (camada superior do navegador); o Esc fecha só ele. O React propaga o evento `close` pela árvore, então o `onClose` dele chama `stopPropagation()`; sem isso o modal de baixo fechava junto (pego pelo e2e).
- **Aulas:** o pedido citava "piloto não vale para aulas", mas as aulas saíram do catálogo (ver acima). O texto diz que o piloto não vale para a mensalidade nem para o sistema sob consulta.
- **E-mail e WhatsApp:** nenhum texto novo entrou neles.
- **Contraste:** só usa os tokens já auditados (texto, texto suave, destaque, linha); não rodei auditoria nova nos dois temas com o diálogo aberto.

## Sistema sob medida com orçamento base (12/11/2026)

- **PENDENTE (Marcelo confirmar):** preço-base provisório de **6 horas x R$ 50 = a partir de R$ 300**, sem teto (`HORAS_BASE_SISTEMA` em `servicos.ts`) e **todas as horas das respostas** (`perguntasSistema.ts`, um arquivo só, sem número em componente). O sistema deixou de ser "sob consulta".
- **Prazo:** o `prazo.ts` não cobre sistemas, então o item usa `horasProvisorias` e mostra "prazo a combinar", sem hora calculada (como os bots). A tela "Por que esse valor?" mostra o valor das respostas e "horas e prazo: a combinar".
- **Combo e piloto (regras existentes, sem mudança):** o sistema **não** é combinável (continua fora do combo e do prazo único). Mudança de comportamento: como deixou de ser sob consulta, **agora recebe o piloto** como criação (antes ficava de fora). Se não for o desejado, é só voltar a tratá-lo à parte no `calcularCarrinho`.
- **Modelo condicional:** `Opcao.abre?: Pergunta[]` (máx. 2 por opção), no máx. 2 níveis abaixo da principal (`LIMITES_ARVORE`), ids únicos no serviço; a mesma filha pode ser aberta por duas opções da mesma pai (ex.: clientes e público abrem login e cadastro). Teste percorre a árvore de todos os serviços (ciclos, níveis, ids).
- **Visíveis:** `perguntasVisiveis*` (em `orcamento.ts`) decide o que aparece; preço, "X de Y", pedido, e-mail, WhatsApp e "Por que esse valor?" usam só as visíveis. `responder()` poda as filhas que sumiram (resposta descartada). Ao restaurar o carrinho, respostas órfãs ou de perguntas que não existem mais são ignoradas.
- **Persistência:** formato igual (só ids e respostas), então `VERSAO_CARRINHO` continua 1; o descarte seguro já cobre as respostas antigas do sistema (`resolver`, `quando`), que deixaram de existir.
- **Perguntas antigas:** "O que você precisa resolver?" e "Para quando?" saíram para caber no teto; o campo de observações do carrinho cobre esse contexto.
- **Pior caso:** 8 principais + 12 filhas = **20 perguntas visíveis** (acima da meta de ~16; cada ramo abre 2). Caso típico: 8 a 12. No celular mantive a lista única com a barra de progresso (quebra de linha) em vez de etapas: é o padrão atual e o mais simples; filhas vêm recuadas, com fade curto (some com movimento reduzido) e sem roubar o foco.
- **Textos:** "O valor depende do que a automação vai fazer" virou "do que vai ser feito" (valia também para o sistema); a regra geral do "Por que esse valor?" agora diz que o piloto não vale para a mensalidade.
- **E-mail e WhatsApp:** nenhum texto novo; só passam a listar as perguntas visíveis do sistema.

## Dica "i" nas perguntas e base de R$ 300 do sistema (12/11/2026)

- **Sem teto:** o sistema é só "a partir de R$ 300" (6 h x `VALOR_HORA_EXTRA`, `HORAS_BASE_SISTEMA`); as respostas somam horas sem limite. **PENDENTE (Marcelo confirmar):** preço-base e horas das respostas.
- **Dica "i"** (`src/shared/components/Dica.tsx`): componente reutilizável, balão `position: fixed` posicionado dentro da área visível (vira para cima ou para baixo), sem biblioteca. Substitui o botão "O que é isso?". `ajuda` já era obrigatório em `Pergunta`; novo teste falha se faltar e se o texto citar R$, horas ou prazo. Hover, foco, toque, Esc e "uma por vez" são cobertos em `e2e/dica.spec.ts` (o vitest roda em node, sem DOM, e não se adicionou dependência).
