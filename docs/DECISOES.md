# Decisões técnicas e pendências

## V1 (02/11/2026)

- **Stack:** Vite multi-page + React + TypeScript + Tailwind v4 (`@tailwindcss/vite`), com tokens nos temas em `src/styles/`. Produção depende só de `react` e `react-dom`. Classes repetidas ficam em `src/shared/estilos.ts`, como strings literais completas.
- **Páginas:** `index.html` (Negócios na raiz), `como-funciona/`, `comunidade/`, `obrigado/`, `404.html`, declaradas em `vite.config.ts`.
- **Open Graph:** o build troca `__URL__` nos HTML pela variável `URL` da Netlify (ou `site.urlPadrao`). Imagens em `public/og-*-v1.png`; ao trocar a imagem, mude o sufixo (`-v2`) por causa do cache do WhatsApp.
- **Tema:** `data-theme` no `<html>`, escuro por padrão em todas as áreas; um script inline aplica a escolha salva antes da pintura. Chave por área (`tema-negocios`, `tema-comunidade`), leitura e escrita em `try/catch`.
- **Formulário:** ver V1.1 (EmailJS).
- **Fontes:** locais, em `public/fonts/` (`font-display: swap`): Space Grotesk nos títulos e no texto e Space Mono nos preços e números (Negócios).
- **Visual:** Negócios usa a paleta N2, grafite com terracota (`src/styles/tema-negocios.css`); a Comunidade tem tema próprio em `src/styles/tema-comunidade.css`. Sem degradê, vidro ou blur e sem emoji como ícone.
- **Catálogo por área:** pacotes de Discord aparecem em `/comunidade/`; os demais na raiz `/`. Campo `area` em `servicos.ts`.
- **Prazo calculado:** `ceil(horas / horasPorDiaUtil) + diasDeRevisao`.
- **Demos:** ficam para a V2 (sem demo, não há dado fictício exposto na V1).

## V1.1 (02/11/2026): mudanças de escopo

- **Formulário por EmailJS** (`src/shared/lib/emailjs.ts`, API REST via `fetch`, sem dependência). `serviceId`, `templateId` e `publicKey` ficam em `site.emailjs` (são públicos); nenhuma chave privada no repositório. Proteção: campo isca + tempo mínimo de 3 s (spam finge sucesso) + limites de tamanho. No painel do EmailJS, restringir as origens permitidas ao domínio do site. Se o envio falhar (ou faltar configuração), o formulário mostra WhatsApp e e-mail. O template do EmailJS deve usar: `nome`, `preferencia`, `contato`, `assunto`, `mensagem`, `origem`, `pacote`, `tamanho`, `estimativa` (os três últimos vão como "—" quando o pedido não vem da calculadora).
- **Netlify Forms removido** (gêmeo estático apagado de `index.html`).
- **Descontos de piloto:** `vagasPiloto10` e `vagasPiloto5` em `src/content/orcamento.ts`; o aviso aparece em Negócios e Comunidade e some com os dois em 0. Desconto só sobre a criação.
- **Mensalidade dos bots:** 10% do preço de criação por mês + hospedagem (`mensalidadeBots`); funcionalidade nova a R$ 50/h. Landing, painel e planilha sem mensalidade; ajustes a R$ 50/h.
- **Calculadora (V2):** `estimar()` em `src/shared/lib/orcamento.ts` multiplica horas e preço pela complexidade (`complexidades`).
- **Preços e horas:** planilha R$ 100 / 2 h (prazo 2 dias úteis), painel R$ 200 / 4 h, landing R$ 300 / 5 h, bot essencial R$ 300, automação a partir de R$ 300, bot com IA a partir de R$ 500.
- **Textos:** COPY v2 aplicada (`docs/COPY.md`). Uniser visível só com texto. Promessas de "vídeo curto" e "teste com os seus arquivos" removidas.

## Seção de orçamento (06/11/2026)

- **Onde:** `#orcamento` em Negócios, logo abaixo da apresentação (`src/pages/negocios/Orcamento.tsx`).
- **Calculadora + formulário:** o cliente escolhe o pacote (todos os de Negócios) e o tamanho (Básico, Médio, Complexo). A estimativa mostra o valor, as horas e o prazo; aulas trocam o tamanho pelo formato (avulsa ou pacote); Sistema sob medida fica sob consulta.
- **Resumo do pedido:** `resumoOrcamento()` em `src/shared/lib/orcamento.ts` monta a linha que vai no WhatsApp e no formulário (prop `resumo` do `Formulario`, que deixa a mensagem opcional). Origem: `negocios-orcamento-<id>`.
- **Desconto de piloto:** preço de tabela riscado ao lado do valor com desconto (`comDesconto()`), com as vagas restantes. Não vale para aulas.
- **Confirmados pelo Marcelo:** fator 1,5 da complexidade média e 6 h base da automação.

## EmailJS e prazo provisório (09/11/2026)

- **EmailJS:** `serviceId` configurado (`service_2qsfdk9`) em `site.emailjs`. `templateId` e `publicKey` continuam vazios; enquanto faltarem, o formulário cai no WhatsApp e no e-mail. `Orcamento.tsx` envia ao `Formulario` os campos `pacote`, `tamanho` e `estimativa` (ex.: "a partir de R$ 300"), além do `resumo`.
- **Prazo provisório:** o campo `horasProvisorias: true` em `servicos.ts` marca pacotes com horas ainda não confirmadas (hoje: bot essencial e bot com IA). Neles o site mostra "prazo a combinar" no catálogo (`textoPrazo`), na calculadora e no `resumoOrcamento` (WhatsApp e e-mail). Os demais seguem com dias úteis calculados. Quando o Marcelo confirmar as horas, remover a marca. As horas provisórias (4 h e 8 h) ainda aparecem na calculadora e no resumo.

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

### Pendências desta mudança (valores PROPOSTOS, a confirmar)

- [ ] Horas extras por resposta (todas em `perguntas.ts`; marcadas como PENDENTE no topo do arquivo).
- [ ] Combo: `COMBO_2` = 10% (2 combináveis) e `COMBO_3` = 15% (3 ou mais), em `src/content/orcamento.ts`.
- [ ] Combo e piloto: regra do "maior" (acima).
- [ ] Horas base dos bots (provisórias): o prazo fica "a combinar".
- [ ] "Ainda não tenho" no painel soma 2 h: manter ou sugerir a planilha antes.
- [ ] Desconto do plano de 6 meses dos bots.

## Pendências do Marcelo

- [ ] Conferir o termo de estágio com o supervisor **antes do merge na main** (`mostrarMinisterio: true` em `src/content/site.ts`).
- [x] `serviceId`, `templateId` e `publicKey` preenchidos em `site.emailjs` (11/11/2026). Falta conferir no painel do EmailJS que o template tem os campos de `docs/emailjs-template.md` (`itens`, `total`, `observacoes`) e que as origens permitidas são só o domínio do site.
- [ ] Horas base do bot essencial e do bot com IA (hoje provisórias: 4 h e 8 h). Ao confirmar, remover `horasProvisorias` em `servicos.ts`.
- [ ] Desconto do plano de 6 meses dos bots (`mensalidadeBots.descontoPlanoAdiantado`).
- [ ] Confirmar que o desconto de piloto vale só sobre a criação.
- [ ] Escolher o nome do site na Netlify e atualizar `site.urlPadrao`.
- [ ] Foto (opcional): colocar em `public/` e apontar `site.foto`.
- [ ] Vídeo do CylBot (talvez Uniser e CylSense). Nenhum vídeo para a planilha.

## Orçamento compacto (09/11/2026)

- **Interface:** a seção virou um fluxo único em 3 passos (1 escolha o serviço, 2 responda, 3 seu pedido), sem as três telas do celular. Serviços em grade de botões (nome e preço); perguntas com opções em botões lado a lado; "O que está incluso" e "Como chegamos a esse valor" recolhidos; no desktop o passo 3 (estimativa e carrinho) fica fixo ao lado. Lógica, preços e perguntas não mudaram.

## Orçamento: refatoração de UX (etapas, pedido estruturado)

- **Etapas:** Serviços → Configuração → Meu pedido (`Orcamento.tsx`). No desktop, serviços e configuração dividem a tela, com lateral compacta (estimativa do serviço e resumo do pedido); no celular, uma etapa por vez, com barra fixa (quantidade, total e uma ação). Sem rolagem interna: a lateral só fica sticky em janelas com altura de 60rem ou mais.
- **Pedido estruturado:** `src/shared/lib/pedido.ts` (novo) monta o pedido (respostas, acréscimos, preço-base, prazo, mensalidade, desconto, sob consulta, observações) a partir de `calcularCarrinho()` e alimenta tela de revisão, WhatsApp e EmailJS. `orcamento.ts` não foi alterado; `textoPedido()` dele (sem respostas) ficou sem uso na interface.
- **Perguntas não são obrigatórias:** o spec não define obrigatoriedade. O progresso ("3 de 5") informa, não bloqueia. Estados da estimativa: preço inicial, em configuração, configurada, sob consulta.
- **Pedido vazio:** sem formulário nem WhatsApp; a revisão mostra o caminho de volta aos serviços.
- **Pendências comerciais inalteradas:** horas extras, combos e piloto continuam como propostas a confirmar.

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

## Revisão mobile-first (360, 390, 412 e 768 px)

- **Método:** Chrome real com emulação de dispositivo (CDP), nos dois temas, sem captura headless de desktop. Auditoria automática de texto abaixo de 14 px, alvos abaixo de 44 px e rolagem horizontal; tudo limpo (o único "alvo" pequeno é o campo isca do spam, fora da tela).
- **Hero:** de ~1620 px para ~500 px no celular. Mostra o que é o serviço, o preço de partida (calculado de `servicos.ts`, sem número novo) e como pedir. O parágrafo secundário fica oculto no celular.
- **Exemplo de painel:** no celular vem depois do orçamento, para o orçamento aparecer antes. Continua rotulado como exemplo.
- **Textos:** nenhum abaixo de 14 px; corpo em 16 px. Campos de formulário em 16 px (evita zoom no iPhone).
- **Combo sem hover:** frase visível no card e no modal; o tooltip virou só reforço no desktop.
- **Modal e painel:** tela cheia no celular, cabeçalho e rodapé fixos, rolagem só no meio, `dvh` e `env(safe-area-inset-*)`. No painel, "Enviar pelo site" e "Chamar no WhatsApp" ficam no rodapé. Com o teclado aberto o rodapé fica só com o botão de enviar e o campo focado é centralizado (`interactive-widget=resizes-content`).
- **Barra do carrinho:** uma linha, rótulo curto "a partir de"; empurra o rodapé do site (`--altura-barra`) e o botão de tema.
- **Toque:** `touch-action: manipulation` e variantes `:active` onde havia só `:hover`.
- **Desempenho (CPU 4x, ~Fast 3G, 360 e 412 px):** CLS 0, LCP ~1,8 s, 167 KB transferidos, zero animações infinitas. A única animação (itens do carrinho) usa transform/opacidade e some com `prefers-reduced-motion`.
- **Pendências para decidir:** ver o relatório final (exemplo depois do orçamento, parágrafo do hero oculto, granularidade dos commits).

## Acessibilidade dos controles novos (bloco 4)

- **Verificado no Chrome real (CDP), tema claro e escuro:** ordem de tabulação nos cards (ícone, Fazer orçamento, Ver detalhes), foco visível (contorno de 3 px em todos), tooltip ligado por `aria-describedby` e fechado com Esc, abas com `aria-selected`/`aria-controls`/`aria-labelledby` e setas, foco no título ao abrir o modal e de volta ao card ao fechar, tabulação presa dentro do dialog, barra como região nomeada, painel com campos rotulados.
- **Corrigido:** o ícone do carrinho trocava o rótulo ("Pôr…"/"Tirar…") e também usava `aria-pressed`, e o leitor de tela anunciava o estado duas vezes. Agora o rótulo é fixo ("Carrinho: Planilha organizada") e o estado vai só em `aria-pressed`. Os textos `por`/`tirar` saíram de `textos.ts`.
- **Contraste do ícone vazio (claro):** usa `text-texto` (#0c1226) sobre o card (#ffffff), contraste acima de 15:1; cheio usa o azul do botão principal. Nos dois temas passa dos 3:1 exigidos para componente gráfico.
- **Campo isca do spam:** continua em `<p aria-hidden="true">` com `tabindex="-1"`; regras do EmailJS intactas. Coberto por teste.
- **Fica como está:** os anúncios `role="status"` do carrinho ("X no carrinho.") e do rodapé do modal já existiam; o painel e o modal nunca abrem juntos, então não há anúncio duplicado.

## Correções da auditoria do PR #7 (11/11/2026), bloco 1

- **P0-01 EmailJS sem configuração:** `templateId` e `publicKey` seguem vazios em `site.ts` (o Marcelo fornece). Sem os três valores, o carrinho não mostra formulário nem "Enviar pelo site": só "Chamar no WhatsApp" e "Enviar por e-mail" (mailto com o pedido, `linkEmailPedido` em `pedido.ts`). Com configuração válida, o comportamento anterior continua. `Contatos` também só mostra o formulário com EmailJS configurado.
- **P1-03 antispam sem falso sucesso:** a regra (isca e 3 s) não mudou. O botão "Enviar pelo site" fica desabilitado até 3 s depois da montagem, com o aviso "Um instante…" (`role="status"`); `envioLiberado` só reaproveita `pareceSpam`. Enter num campo antes da hora é ignorado, sem descartar. Isca preenchida continua com descarte silencioso. O `Formulario` compartilhado (hoje sem uso com formulário) não ganhou o botão desabilitado.
- **P1-01 menu:** Sobre, Entregas e Contato saem do menu pelas flags `site.menuSecoes` (religue com `true` quando a seção existir; as seções vazias continuam no HTML). Não havia contato visível fora do carrinho, então o rodapé de Negócios e de Como funciona ganhou "Prefere falar direto? Chame no WhatsApp".
- **P2-03 telefone:** `validarTelefone` (`telefone.ts`): só dígitos, 10 ou 11 dígitos, DDD de 11 a 99, 55 opcional (removido só com 12 ou 13 dígitos). O envio leva `55` + número. Erro específico no campo, com `aria-invalid`, `aria-describedby` e `role="alert"`. O `pattern` antigo saiu.
- **P2-02 gráfico mensal:** cada mês expõe "Janeiro, R$ 12 mil" em texto só para leitor de tela; o valor visível e a barra ficam `aria-hidden`; a lista de iniciais continua `aria-hidden`.
- **P2-01 painel de exemplo:** os meses somavam R$ 224 mil e o KPI e as regiões R$ 214 mil. Correção escolhida pelo Marcelo: Ago 18→16, Set 20→18, Out 22→20, Nov 24→20, com Dezembro em 30 (pico mantido); KPI, regiões, pedidos x ticket e variação não mudaram. Nenhum texto do site cita "melhor mês" ou crescimento do gráfico. Teste: soma mensal = KPI = soma das regiões. Continua rotulado como exemplo.
- **P3-01 Comunidade:** rótulo visível "Comunidade" ao lado do ícone a partir de 640 px (`sm`). No celular não cabe ao lado da marca em 360 e 390 px; o `aria-label` longo continua.
- **P3-02 nomenclatura:** em Como funciona, o rótulo do exemplo do painel passou de "Painel" para "Painel básico" (`exemplos.ts`, a pedido), com o título de apoio mantido.
- **"Enviar por e-mail":** o endereço do mailto é o `site.email` de `src/content/site.ts`. O botão só aparece se esse valor for um e-mail real (`emailReal`: formato de endereço, sem colchetes nem "exemplo"); com placeholder ou vazio, fica só o WhatsApp.
- **Menu da Comunidade:** "Contato" apontava para `/#contato`, a seção vazia da home de Negócios. Agora aponta para `#contato`, a seção de contato da própria Comunidade (WhatsApp e e-mail).

## Pedido preservado entre páginas (P1-02, 11/11/2026)

**Substitui a decisão D3 ("sem persistência", só memória) do prompt dos cards com modal.**

- **O que é guardado:** em `sessionStorage`, chave `carrinho-negocios`: versão do formato (`v: 1`), ids dos serviços no carrinho e respostas (ids de pergunta e de opção). **Nunca** nome, telefone, e-mail, observações nem preço. Acesso sempre em try/catch (`carrinho-persistencia.ts`).
- **Ao restaurar:** valida contra os serviços e perguntas atuais; id de serviço, pergunta ou opção que não existe mais é descartado; versão desconhecida ou texto corrompido volta ao carrinho vazio. Não existe preço salvo: o valor sai sempre de `montarPedido`/`calcularServico` com as respostas restauradas.
- **Regra:** restaura ao navegar entre páginas e ao recarregar (mesma aba); limpa depois de um envio pelo site com sucesso (o descarte silencioso de spam não limpa); o abre/fecha do modal e do painel não é persistido; as observações também não.
- **Não limpa:** clicar em "Chamar no WhatsApp" ou "Enviar por e-mail" (o site não tem como saber se a mensagem foi enviada). Fechar a aba encerra a sessão e o carrinho some.
- **Pendente:** verificação no navegador (ida a Como funciona e volta) fica para os testes de jornada do P4-03.

## Bloco 3 da auditoria: bots, mensalidade e planilha

- **A. Bots fora de Negócios:** `servicosDoCatalogo` (`perguntas.ts`) é a lista do que Negócios vende (área `negocios`); cards, link direto (`#bot-ia` não abre mais modal), `adicionar` do carrinho e a restauração do `sessionStorage` usam essa lista. Os bots seguem em `servicosOrcamento` só para o cálculo e a Comunidade (`servicos.ts`, `orcamento.ts` e as perguntas dos bots não mudaram). Carrinho salvo antes com `bot-essencial`/`bot-ia`: ids e respostas dos bots são descartados em silêncio e o resto fica (teste em `carrinho-persistencia.test.ts`).
- **Chamada para a Comunidade:** bloco abaixo dos cards ("Quer um bot para o seu servidor de Discord?") com link para `/comunidade/#bots`. Textos em `orcamento.cards.chamadaComunidade`.
- **B. Mensalidade (P2-04):** o parágrafo da Comunidade dizia que a mensalidade "cobre hospedagem" e somava a hospedagem. Agora separa: mensalidade = monitoramento e correção de erros (10% da criação por mês); hospedagem = custo à parte; IA = cobrada pelo provedor na conta de quem contrata. Isso segue o que o resto do site e a mensagem do WhatsApp já diziam ("hospedagem à parte"). **Confirmar:** se o Marcelo hospeda os bots dentro da mensalidade, a frase e o "mais a hospedagem" de todo o site mudam.
- **C. Pergunta da planilha (P2-06):** opção 1 escolhida pelo Marcelo. Só texto, sem mudar preço, horas nem `servicos.ts`: nova opção "Sim, e está em boa ordem" (+0) e "Sim, e precisa de arrumação grande" (+1 h, mesmo id `bagunca`, então carrinhos salvos continuam válidos). A ajuda define a limpeza básica incluída (linhas vazias e repetidas, colunas padronizadas) e diz quando soma 1 h. **Confirmar:** o limite da limpeza básica é sugestão minha.

## Bloco 4: "Não sei qual escolher" (P4-02)

- **Onde:** botão logo abaixo da introdução da seção `#orcamento`; abre um painel na própria página (`GuiaEscolha.tsx`), sem dialog, então não há modal sobre modal. Os cards continuam todos visíveis e livres, sem cadastro.
- **Conteúdo:** perguntas, opções e resultados ficam em `src/content/guia.ts`, sem número, preço nem prazo (teste confere). No máximo duas perguntas: o objetivo (números, página, aulas, sistema, bot) e, para "números", o que mais atrapalha (planilha bagunçada, painel, automação).
- **Resultado:** o serviço recomendado com o porquê e os mesmos caminhos dos cards ("Fazer orçamento" abre o modal na aba Orçamento; "Ver detalhes", na aba Detalhes). "Quero um bot" não recomenda card: leva a `/comunidade/#bots` (a seção existe em `comunidade/main.tsx`).
- **Lógica:** `shared/lib/guia.ts` (pura): escolha inválida é ignorada, não avança depois do resultado, "Voltar" e "Recomeçar". Acessibilidade: botões nativos, `aria-expanded`/`aria-controls`, foco no título de cada etapa.
- **Pendente (do relatório da auditoria):** validar com pessoas do público se conseguem escolher e justificar a escolha; não foi feito. Os textos das perguntas e dos "porquês" são propostas minhas.

## E-mail do pedido com os dados por serviço (11/11/2026)

- **O que mudou:** o envio pelo site (EmailJS) passa a levar, além dos parâmetros de sempre, `itens` (array de objetos `{ titulo, valor, respostas }`, um por serviço do carrinho), `total` e `observacoes`. `mensagem` continua com o pedido inteiro em texto, como reserva. Sem dado, `total` e `observacoes` vão como "—" e `itens` como lista vazia. Formato completo e sugestão de template em `docs/emailjs-template.md`.
- **Formato:** `titulo` = nome do serviço; `valor` = o mesmo texto do carrinho (`resumoPrecoItem`), com " (estimativa)" quando `ItemPedido.estimativa` (tem valor e há pergunta sem resposta; "sob consulta" não ganha o aviso, como no carrinho); `respostas` = uma linha por pergunta, "não respondeu" quando faltar; `assunto` = "Pedido: A + B"; `total` = `totalCurto`, o mesmo texto do rodapé do carrinho (a função saiu de `BarraCarrinho.tsx` para `pedido.ts`, sem mudar).
- **Linha da resposta:** as perguntas terminam em "?", então a linha sai "Pergunta? resposta"; os dois-pontos ("Pergunta: resposta") só entram quando a pergunta não termina em pontuação. Decisão minha, para não escrever "?:".
- **Texto simples:** nenhum HTML é montado no código; o template do EmailJS decide a aparência. Regras de spam (isca e 3 s) e lógica de preço intactas.
- **Pendente:** a sintaxe de lista do template não foi testada com conta real (faltam `templateId` e `publicKey`).

## Bloco 5: testes de jornada no navegador (P4-03, 11/11/2026)

- **Por quê:** os testes do Vitest cobrem a lógica pura; foco, `<dialog>`, histórico do navegador, `sessionStorage`, largura de tela e o caminho inteiro do pedido só aparecem num navegador de verdade. A pendência de "verificar no navegador a ida a Como funciona e volta" (P1-02) fica coberta aqui.
- **Como:** `@playwright/test` como devDependency (nunca runtime), só Chromium. `npm run test:e2e` roda `tsc -p tsconfig.e2e.json` e o Playwright; o `webServer` faz `npm run build` e sobe o `vite preview` na porta 4319, e o próprio Playwright encerra o servidor que abriu. Testes em `e2e/*.spec.ts`, apoio em `e2e/apoio.ts`. Na primeira vez: `npx playwright install chromium`.
- **Fora do build:** `npm run build` e `npm test` não mudaram e não chamam o Playwright (`tsconfig.json` e o `include` do Vitest não enxergam `e2e/`). Na Netlify, o `npm install` baixa o pacote `@playwright/test` como qualquer devDependency, mas nenhum navegador é baixado (isso só acontece com `playwright install`) e nada dele roda.
- **EmailJS nos testes:** a API (`api.emailjs.com`) é sempre interceptada, com ou sem ids reais; nenhum envio real. Os testes de envio precisam dos três ids no site: cada id que estiver vazio em `site.ts` é trocado por um falso (`service_e2e`, `template_e2e`, `chave_e2e`) no JS servido ao navegador do teste (`emailjs.ligar()` em `e2e/apoio.ts`), e os que já estão preenchidos ficam como estão (com os três reais, nada é trocado). Os testes conferem o corpo enviado contra os ids efetivos, sem imprimi-los. O cenário "sem configuração" só roda enquanto faltar algum id e é pulado sozinho quando os três estiverem preenchidos. Conferido nos dois casos: ids vazios (49 passam) e ids reais simulados (48 passam, 1 pulado).
- **Dados de teste:** nome e telefone fictícios (`(61) 99999-9999`, o mesmo do exemplo da mensagem de erro). As comparações com o WhatsApp de `site.ts` viram booleano antes do `expect`, para o número não ir para o log.
- **Relógio:** os testes dos 3 s usam o relógio falso do Playwright (`page.clock`), sem mexer na regra de spam.
- **Bug achado e corrigido:** link com âncora vindo de outra página (`/#orcamento` no menu de Como funciona, `/comunidade/#bots` no guia e na chamada dos cards, links copiados de Como funciona) abria no topo, porque o React monta a seção depois que o navegador tenta rolar. `rolarParaAncora()` (`shared/lib/ancora.ts`), chamado no `Cabecalho`, rola até a seção depois da montagem, só se a página ainda estiver no topo.
- **Telefone vazio:** o campo é `required`, então quem barra o envio é a validação nativa do navegador (balão do próprio navegador), e não a mensagem do site; o teste confere isso. As outras formas de telefone inválido mostram a mensagem do site.
- **Não coberto:** Safari e Firefox, celular de verdade (teclado virtual, área segura do iPhone), leitor de tela, e o envio real pelo EmailJS (template e entrega do e-mail).


## Bloco 6: demonstração animada da planilha (piloto, 11/11/2026)

- **Onde:** dentro do bloco `#planilhas` de Como funciona (id que já existia), abaixo do "antes e depois" estático, que ficou como estava. Componente em `src/pages/como-funciona/DemoPlanilha.tsx`; texto e dados fictícios em `src/content/demoPlanilha.ts`; máquina de passos pura em `src/shared/lib/demoPassos.ts` (testada). Só React e CSS, sem dependência nova.
- **História:** tabela bagunçada → padroniza datas → padroniza nomes → remove repetida e vazia → separa em colunas → confere o total. Rótulo fixo "Exemplo com dados fictícios". Os totais (R$ 185 com a linha repetida, R$ 145 no final) são só a soma dos dados fictícios, não resultado de cliente.
- **Controles:** "Reproduzir" vira "Pausar" enquanto toca; "Ver resultado" e "Recomeçar". Botões nativos de 44 px. "Ver resultado" no final usa `aria-disabled` (não perde o foco). Começa parada: o visitante decide tocar. Sem loop: ao chegar ao fim, para; "Reproduzir" no final recomeça.
- **Pausa automática:** o relógio só anda com a aba em primeiro plano e a seção na tela (`visibilitychange` + `IntersectionObserver`); ao voltar, continua do mesmo passo.
- **Movimento reduzido:** `prefers-reduced-motion: reduce` troca a animação por antes e depois lado a lado (empilhados no celular) e a lista dos passos, sem controles. A troca acompanha a preferência do sistema em tempo real.
- **Acessibilidade:** cada passo aparece em texto visível e na lista de passos (`aria-current="step"`). Não há região `aria-live` que fale a cada passo; só a frase de resultado tem `role="status"`, uma vez, ao chegar ao fim.
- **Animação:** só `opacity` e `transform` (`@keyframes demo-entra` em `tema-negocios.css`, também restrito a `no-preference`). As linhas removidas somem de uma vez (animar a altura exigiria layout).
- **Modal:** a aba Detalhes do serviço `planilha` ganhou o link "Ver como funciona" para `/como-funciona/#planilhas`. O mapa `servicosComDemo` em `demoPlanilha.ts` controla quais serviços têm o link; o card não mudou.
- **Testes:** `src/shared/lib/demoPassos.test.ts` (Vitest) e `e2e/demo.spec.ts` (reproduzir/pausar, saída da tela, link do modal, 360 e 390 px, movimento reduzido).
- **Não validado:** aparência em celular de verdade e em outros navegadores, leitor de tela, e se o ritmo (2,2 s por passo) agrada; falta o olhar do Marcelo no navegador antes de replicar para painel e automação.
