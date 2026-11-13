# Decisões técnicas e pendências

## V1 (02/11/2026)

- **Stack:** Vite multi-page + React + TypeScript + Tailwind v4 (`@tailwindcss/vite`), com tokens nos temas em `src/styles/`. Produção depende só de `react` e `react-dom`. Classes repetidas ficam em `src/shared/estilos.ts`, como strings literais completas.
- **Páginas:** `index.html` (Negócios na raiz), `como-funciona/`, `comunidade/`, `obrigado/`, `404.html`, declaradas em `vite.config.ts`.
- **Open Graph:** o build troca `__URL__` nos HTML pela variável `URL` da Netlify (ou `site.urlPadrao`). Imagens em `public/og-*-v1.png`; ao trocar a imagem, mude o sufixo (`-v2`) por causa do cache do WhatsApp.
- **Tema:** `data-theme` no `<html>`, claro por padrão em Negócios (e nas páginas compartilhadas: /como-funciona/, /obrigado/, /privacidade/, 404, que usam a chave `tema-negocios`) e escuro por padrão na Comunidade, sem seguir `prefers-color-scheme`; um script inline aplica a escolha salva antes da pintura. Chave por área (`tema-negocios`, `tema-comunidade`), leitura e escrita em `try/catch`.
- **Formulário:** ver V1.1 (EmailJS).
- **Fontes:** locais, em `public/fonts/` (`font-display: swap`): Space Grotesk nos títulos e no texto e Space Mono nos preços e números (Negócios).
- **Visual:** Negócios usa cobalto sobre off-white frio (claro) e azul-noite (escuro), com um só acento (`src/styles/tema-negocios.css`); a Comunidade tem tema próprio em `src/styles/tema-comunidade.css`. Sem degradê, vidro ou blur e sem emoji como ícone. (A paleta grafite com terracota das primeiras versões foi substituída.)
- **Catálogo por área:** pacotes de Discord aparecem em `/comunidade/`; os demais na raiz `/`. Campo `area` em `servicos.ts`.
- **Prazo calculado:** `ceil(horas / horasPorDiaUtil) + diasDeRevisao`.
- **Demos:** as demonstrações animadas de planilha, painel e automação já existem em Como funciona (ver Blocos 6 e 6b). Todo dado delas é rotulado como exemplo fictício.

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

- **EmailJS (atualizado em 11/11/2026):** `serviceId`, `templateId` e `publicKey` estão preenchidos em `site.emailjs`, então o envio pelo site está ativo. Falta só conferir no painel do EmailJS o template e as origens permitidas (ver Pendências do Marcelo). O texto original desta linha falava em ids vazios e no serviceId antigo.
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
- [x] Combo: `COMBO_2` = 10% (2 combináveis) e `COMBO_3` = 15% (3 ou mais), em `src/content/orcamento.ts`. **Confirmado pelo Marcelo em 12/11/2026.**
- [x] Combo e piloto: regra do "maior" (acima). Mantida em 12/11/2026: não contradiz a regra do combo (o cliente nunca recebe menos que o combo).
- [ ] Horas base dos bots (provisórias): o prazo fica "a combinar".
- [ ] "Ainda não tenho" no painel soma 2 h: manter ou sugerir a planilha antes.
- [ ] Desconto do plano de 6 meses dos bots.

## Pendências do Marcelo

- [x] Termo de estágio: texto do Ministério liberado em 13/11/2026 (`mostrarMinisterio: true` em `src/content/site.ts`). Sem siglas nem nomes internos de órgãos, programas ou sistemas.
- [x] `serviceId`, `templateId` e `publicKey` preenchidos em `site.emailjs` (11/11/2026). Falta conferir no painel do EmailJS que o template tem os campos de `docs/emailjs-template.md` (`itens`, `total`, `observacoes`) e que as origens permitidas são só o domínio do site.
- [ ] Horas base do bot essencial e do bot com IA (hoje provisórias: 4 h e 8 h). Ao confirmar, remover `horasProvisorias` em `servicos.ts`.
- [ ] Desconto do plano de 6 meses dos bots (`mensalidadeBots.descontoPlanoAdiantado`).
- [ ] Confirmar que o desconto de piloto vale só sobre a criação.
- [ ] Escolher o nome do site na Netlify e atualizar `site.urlPadrao`.
- [ ] Foto (opcional): colocar em `public/` e apontar `site.foto`.
- [x] Imagens reais do Uniser (13/11/2026): ver "UniSER corrigida, Simbionte e imagens reais".
- [ ] Vídeo do CylBot (talvez Uniser e CylSense). Nenhum vídeo para a planilha.

## Orçamento compacto (09/11/2026)

- **Interface:** a seção virou um fluxo único em 3 passos (1 escolha o serviço, 2 responda, 3 seu pedido), sem as três telas do celular. Serviços em grade de botões (nome e preço); perguntas com opções em botões lado a lado; "O que está incluso" e "Como chegamos a esse valor" recolhidos; no desktop o passo 3 (estimativa e carrinho) fica fixo ao lado. Lógica, preços e perguntas não mudaram.

## Orçamento: refatoração de UX (etapas, pedido estruturado)

- **Etapas:** Serviços → Configuração → Meu pedido (`Orcamento.tsx`). No desktop, serviços e configuração dividem a tela, com lateral compacta (estimativa do serviço e resumo do pedido); no celular, uma etapa por vez, com barra fixa (quantidade, total e uma ação). Sem rolagem interna: a lateral só fica sticky em janelas com altura de 60rem ou mais.
- **Pedido estruturado:** `src/shared/lib/pedido.ts` (novo) monta o pedido (respostas, acréscimos, preço-base, prazo, mensalidade, desconto, sob consulta, observações) a partir de `calcularCarrinho()` e alimenta tela de revisão, WhatsApp e EmailJS. `orcamento.ts` não foi alterado; `textoPedido()` dele (sem respostas) ficou sem uso na interface.
- **Perguntas não são obrigatórias:** o spec não define obrigatoriedade. O progresso ("3 de 5") informa, não bloqueia. Estados da estimativa: preço inicial, em configuração, configurada, sob consulta.
- **Pedido vazio:** sem formulário nem WhatsApp; a revisão mostra o caminho de volta aos serviços.
- **Pendências comerciais inalteradas:** horas extras e piloto continuam como propostas a confirmar. (Combos: confirmados em 12/11/2026, ver o fim deste arquivo.)

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

- **P0-01 EmailJS sem configuração:** `templateId` e `publicKey` seguem vazios em `site.ts` (o Marcelo fornece). Sem os três valores, o carrinho não mostra formulário nem "Enviar pelo site": só "Chamar no WhatsApp" e "Enviar por e-mail" (mailto com o pedido, `linkEmailPedido` em `pedido.ts`). Com configuração válida, o comportamento anterior continua. `Contatos` também só mostra o formulário com EmailJS configurado. **Superado:** os três ids foram preenchidos depois (ver EmailJS acima); o comportamento sem configuração continua como fallback.
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
- **Pendente:** a sintaxe de lista do template não foi testada com envio real (os ids já estão configurados; os testes e2e interceptam a API).

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


## Estado atual e ajustes finais antes do merge (11/11/2026)

- **Resumo do que vale hoje:** Negócios vende 6 serviços (planilha, painel básico, automação em Excel, site de uma página, automação com Python, sistema sob medida); **bots só na Comunidade** (`/comunidade/#bots`), com mensalidade explicada lá. EmailJS ativo. Carrinho em `sessionStorage`. Demonstrações de planilha, painel e automação em Como funciona. Testes: Vitest (`npm test`) e jornadas no navegador com Playwright (`npm run test:e2e`, fora do build).
- **Nome unificado:** o assunto de Como funciona que era "Página para o seu negócio" agora se chama **"Site de uma página"**, igual ao card. O id interno (`landing`) e a âncora `#landing-page` não mudaram.
- **`Formulario.tsx` está dormente.** `Contatos` só o renderiza com `comFormulario=true` (e o EmailJS configurado), e a Comunidade usa `comFormulario={false}`; hoje nenhuma página o mostra. Ele ainda não tem o botão desabilitado por 3 s do checkout (`CheckoutPedido.tsx`): se o usuário envia antes disso, vai para `/obrigado/` sem envio nenhum (falso sucesso). **Antes de ligá-lo**, aplicar o mesmo `liberado` e o aviso "Um instante…". As regras de spam (isca e 3 s) não mudam.
- **Revisão do comentário do carrinho em `Orcamento.tsx`:** conferido, está atual (estado em `Orcamento`, sessionStorage, limpeza após envio, regra de um dialog por vez).

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

## Bloco 6b: demonstrações do painel e da automação (11/11/2026)

- **Comum extraído, planilha igual:** `shared/lib/demoMaquina.ts` (máquina de passos), `content/demos.ts` (textos comuns e o mapa `servicosComDemo`) e `pages/como-funciona/DemoMoldura.tsx` (controles, relógio, pausa por aba/tela, versão sem movimento, lista de passos). A planilha passou a usar a moldura; os testes dela seguem os mesmos (só o import de `servicosComDemo` mudou de lugar). Novo `demo-<id>` no `data-testid` de cada uma.
- **Ids:** sem ids novos. `#paineis` e `#automacao` já existiam em Como funciona; as demonstrações entram dentro deles, abaixo do exemplo estático, que ficou.
- **Painel (`demoPainel.ts`, `DemoPainel.tsx`):** tabela de vendas por produto (Out, Nov, Dez, em R$ mil) alimenta o total, o produto que mais vende, o que menos sai e as barras. O filtro por mês (botões nativos) refaz tudo; no último passo (e na versão sem movimento) a pessoa usa o filtro sozinha. Coerência com o painel da home: os totais de Out, Nov e Dez (20, 20, 30) são os de `negocios.apresentacao.painel.meses`, conferido por teste. Não reaproveitei os dados anuais da home (não há quebra por produto e mês); a home segue sem mudança. Em novembro o líder muda (Bonés) para mostrar o efeito do filtro. Os números são fictícios e rotulados.
- **Automação (`demoAutomacao.ts`, `DemoAutomacao.tsx`):** três arquivos de vendas fictícios são juntados, filtrados (canceladas saem) e somados (R$ 175); no último passo o botão "Atualizar relatório" chega ao mesmo resultado. O botão é só ilustração (`aria-hidden`, legenda diz que não é clicável). Sem tempo, economia ou percentual (teste confere) e com o aviso de que nem toda tarefa dá para automatizar.
- **Modal:** `servicosComDemo` agora liga planilha, painel e automação ao link "Ver como funciona". Os cards seguem com 3 botões (teste confere).
- **Testes:** `demoPainel.test.ts`, `demoAutomacao.test.ts`; `e2e/demo.spec.ts` virou uma bateria por demonstração (controles, pausa fora da tela, link do modal, 360 e 390 px, movimento reduzido) mais cenários do filtro do painel e do clique da automação.
- **Não validado:** celular de verdade, Safari/Firefox, leitor de tela, o ritmo de 2,2 s nas duas novas. Conferi só por captura em 390 px (escuro no painel, claro na automação).

## Combo oficial, A-03 e e-mail sem duplicação (12/11/2026)

- **Combo oficial:** 1 serviço, preço normal (com o piloto, se houver vaga); 2 combináveis, 10%; 3 ou mais, 15%. O rótulo "pendente" saiu de `orcamento.ts`. Teste novo: 1 combinável, e combinável + aula/sistema, não formam combo.
- **Piloto x combo (como já era):** não se somam nem se multiplicam; o código calcula os dois sobre a soma de tabela e aplica só o que abate mais reais (empate: combo). O combo incide só nos combináveis; o piloto, em toda a criação (inclui bots) e nunca em aulas, sistema nem mensalidade. Não há desconto embutido no preço-base. Ordem mantida: só seria preciso mudar se o piloto desse ao cliente menos que o combo, o que não acontece.
- **A-03:** "Preços fechados" saiu da descrição e do `og:description` de `index.html`: agora "Orçamento na hora, com preço a partir de R$ 100." (não há `twitter:description`).
- **E-mail:** `enviarContato` manda `mensagem` vazia quando há `itens`; sem itens, vai como veio. O WhatsApp segue com a mensagem completa. `docs/emailjs-template.md` atualizado (precisa de teste real do template).

## Segunda rodada de correções da auditoria (12/11/2026)

- **Card do combo:** "Desconto a partir de 2 serviços: 10% com 2, 15% com 3 ou mais." Os números saem de `COMBO_2`/`COMBO_3` (`textos.ts` importa `orcamento.ts`); o teste exige esses mesmos valores.
- **"Preço fechado":** saiu da intro do catálogo (`textos.ts` e `COPY.md`): "preço-base a partir de um valor; estimativa na hora, valor final confirmado depois". `notaEstimativa` ("o valor e a data ficam fechados na proposta") continua, pois fala da proposta, não do site.
- **A-06:** o e-mail do aviso de falha usa `linkEmailPedido` (assunto e corpo com o pedido); e2e confere o `body=`.
- **A-09:** `.gitignore` cobre `AGENTS.md`, `docs/AUDITORIA-*.md`, `docs/Auditoria_*.pdf`, `docs/PROMPT-*.md` e `docs/auditoria-capturas/`.
- **A-05:** `robots.txt` e `sitemap.xml` (3 páginas) são gerados no build por um plugin de `vite.config.ts`, com a mesma URL do `__URL__` (`URL` da Netlify, senão `site.urlPadrao`). Canonical nas três páginas públicas. `/obrigado/` e `404` já tinham `noindex`. Observação: em deploy preview, a Netlify injeta a URL do site principal, então o canonical aponta para a produção.
- **A-04 (parcial):** `netlify.toml` com `nosniff`, `Referrer-Policy`, `Permissions-Policy` e CSP só em `Report-Only` (nada é bloqueado). Testei a mesma política como bloqueante no build servido (Chromium): fontes, script inline de tema e estilos sem violação em `/`, `/como-funciona/`, `/comunidade/` e `/obrigado/`. Não testei o envio real ao EmailJS sob CSP (o `connect-src` libera `https://api.emailjs.com`, o endereço de `emailjs.ts`). Fica `'unsafe-inline'` em script e estilo; `frame-ancestors` não funciona em Report-Only. Depois de um deploy preview sem avisos no console, trocar para `Content-Security-Policy` (com hash do script inline, como em A-04).
- **A-08, A-10, A-12, A-17:** cache longo de `/fonts/*` e `/og-*`; README atualizado; `/obrigado/` fala só do WhatsApp; 3 fontes sem uso removidas de `public/fonts/`.
- **Ficou para depois:** A-11 (privacidade/LGPD: texto jurídico, decisão do Marcelo), A-15 (confirmar entrada de 50%), A-13 (Formulario dormente), A-14 (e2e da contingência sem EmailJS), A-16 (painel "Ano de 2026"), A-18 (WhatsApp longo), A-07 (alerta de cota no painel do EmailJS), teste real do template do EmailJS.

## Privacidade e A-15 (12/11/2026)

- **A-15:** entrada de 50% por Pix e saldo de 50% antes da entrega final ficam como estão (`textos.ts`, `como-funciona/main.tsx`, `COPY.md`). Confirmado pelo Marcelo em 12/11/2026. Nenhum outro texto contradiz (conferi "Pix", "entrada", "pagamento").
- **A-11:** linha de privacidade no painel do carrinho (o que é enviado, para quê, por onde passa) e página `/privacidade/` (entrada no `vite.config.ts`, canonical, sitemap, link no rodapé de Negócios e Comunidade; `/obrigado/` e a 404 não têm rodapé). Texto em `textos.ts`/`COPY.md`.
- **Prazo de guarda:** e-mails de pedidos por até 12 meses (escolha do Marcelo). É uma promessa a cumprir: apagar a cada 12 meses, e o registro do envio no painel do EmailJS, se houver. A conversa no WhatsApp: "enquanto precisar para atendimento e entrega", sem número.
- **Limites:** não é parecer jurídico; não verifiquei a política interna de retenção do EmailJS nem os logs da Netlify (a página só diz que podem existir). A linha do carrinho aparece só com o EmailJS ativo (é o formulário que a contém).


## Tema claro como padrão em Negócios (2026-11-12)

- **Regra:** sem escolha salva, Negócios abre em claro mesmo com o sistema em modo escuro. Escolha salva em `tema-negocios` é mantida; o botão de alternar continua. Comunidade segue escura por padrão. O padrão está em três lugares que precisam andar juntos: `data-theme` e `meta theme-color` (`#f2f4f8`) de cada HTML e `temaPadrao` em `CabecalhoNegocios.tsx`.
- **Páginas compartilhadas:** /como-funciona/, /obrigado/, /privacidade/ e 404 usam a chave `tema-negocios`; sem escolha salva, claro. Não há rastreio de "área de origem" além da escolha salva.
- **CSP:** o script inline não mudou (lê só a escolha salva) e a política usa `'unsafe-inline'`, sem hash; `netlify.toml` ficou como estava. Conferi no build: hash do script de Negócios `I7j5xP3oeM2+PeDUHqJxAW3nPCMfDUS6gkkJRkQmAJI=`, igual em todas as páginas.
- **Contraste (claro):** tokens passam AA (texto 16,9:1; texto suave 7,0:1; destaque 6,7:1; botão 7,4:1). Auditoria automática do texto renderizado (home, como funciona, privacidade, obrigado, 404 e modal, em 360 e 1280 px, nos dois temas): nenhuma falha, nada foi alterado na paleta. Não cobri o painel do carrinho com itens.
- **Testes:** `src/shared/tema.test.ts` e `e2e/tema.spec.ts` (claro mesmo com o sistema escuro, Comunidade escura, escolha salva mantida).

## Painel de exemplo da home: roteiro com foco (12/11/2026)

- **Entrada uma vez, roteiro em loop:** o painel entra animado só na primeira vez que aparece na tela (no carregamento, no desktop; ao rolar até ele, no celular). Depois, a cada ~3,8 s, um item ganha o foco (ao fim das três etapas há 5 s de descanso, sem nenhum filtro, e o roteiro recomeça): Dezembro (mês que mais vendeu), Camisetas (categoria) e Sudeste (região). O gráfico do item fica inteiro com ele em destaque; os outros dois e o indicador "Vendas no ano" passam a mostrar só as vendas dele ("só Dez", "só Camisetas"...). Os outros três indicadores esmaecem, pois não existem por mês, categoria ou região.
- **Números de exemplo novos:** para os recortes baterem, `textos.ts` ganhou a matriz mês x categoria (`vendasMesCategoria`, R$ mil) e um peso categoria x região (`afinidadeRegiao`); `src/shared/lib/painelVendas.ts` ajusta o cruzamento categoria x região para fechar com os totais já mostrados. Tudo continua rotulado como exemplo, e `painelVendas.test.ts` confere que meses, categorias e regiões fecham com o ano (214 mil). Out a Dez usam os mesmos produtos da demonstração de Como funciona (por isso "Outros" é zero nesses meses).
- **Movimento reduzido:** sem entrada animada e sem roteiro; o painel fica parado com os números do ano.

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

## Seção Sobre (13/11/2026)

- **Onde:** `Sobre.tsx` em `#sobre` (depois do Orçamento e do exemplo de painel no celular, antes de Entregas e Contato). A lógica testável fica em `sobreLogica.ts` (parágrafos por flag, galeria, destino do botão); o nome não é `sobre.ts` porque o Windows não distingue de `Sobre.tsx`.
- **Ministério:** liberado em 13/11/2026, só com o texto de `negocios.sobre.ministerio`. Sem siglas nem nomes internos de órgãos, programas ou sistemas; um teste barra palavras só em maiúsculas nesse texto.
- **Imagens do Uniser:** eram SVGs de exemplo; foram trocadas pelas telas reais (ver a seção "UniSER corrigida, Simbionte e imagens reais").
- **Botão "Falar comigo":** vai para `#contato` quando `menuSecoes.contato` for `true`; enquanto a seção Contato não existe, abre o WhatsApp (`linkContato("negocios-sobre")`). Passa para a âncora sozinho quando a flag for ligada.
- **Menu:** `menuSecoes.sobre: true`; `scroll-mt-24` deixa o título livre do cabeçalho fixo.
- **Foto:** `site.foto` continua `null` (iniciais) até haver arquivo em `public/`.

## Destaques com "Saiba mais" na seção Sobre (13/11/2026)

- **Texto como dados:** cada parágrafo de `negocios.sobre` é uma lista de partes `{ texto, destaque? }` (`faculdade`, `estagio`, `uniser`); nada de achar trecho com `indexOf`. O texto dos parágrafos não mudou. Os modais ficam em `negocios.sobre.modais` (título, dica, texto, seções, fecho). O destaque do Estágio e o do Uniser somem com `mostrarMinisterio` e `mostrarUniser` desligadas (`sobreLogica.ts`).
- **`<span role="button">` em vez de `<button>`:** botão é caixa atômica no Chromium e não quebra de linha como texto (testado: um único retângulo). O span quebra, tem `tabindex="0"`, Enter e Espaço abrem. O alvo de 44 px vem do padding vertical do span inline, que não empurra as linhas.
- **Dica:** a lógica do balão saiu de `Dica.tsx` para o hook `useBalao`, usado pelo "i" e pelos destaques (mesma posição dentro da tela, uma dica por vez). No toque não há balão: o toque abre o modal.
- **Modal:** `ModalSobre.tsx`, `<dialog>` nativo como o `ModalServico`; o pai (`Sobre.tsx`) devolve o foco ao destaque ao fechar. "Falar comigo" segue `destinoFalarComigo`; para `#contato`, fecha o modal e só depois rola (a rolagem da página estava travada).
- **Galeria:** `GaleriaUniser.tsx` serve à seção (carrossel/3 colunas) e ao modal (uma abaixo da outra, maiores). Hoje com as telas reais, sem rótulo.
- **PENDENTE (Marcelo):** conferir os textos dos modais.

## UniSER corrigida, Simbionte e imagens reais (13/11/2026)

- **Descrição corrigida:** o projeto é a UniSER, Universidade do Envelhecer da UnB; a plataforma é desenvolvida por estudantes da Unieuro com orientação de professores da Unieuro. Não é "portal do aluno" nem "cursos para idosos", e não é "parceria com a UnB". Um teste barra essas frases em `negocios.sobre`. No destaque do parágrafo continua o nome curto "Uniser".
- **Modal do Uniser:** título, o que o sistema faz, "O que isso tem a ver com o seu projeto" (login seguro, cada pessoa vê só o que é dela, registro e testes) e tecnologias (inclui Node.js com Express).
- **Simbionte:** parágrafo novo no modal da faculdade, em "Iniciação científica" (campo `mais` da seção, para o segundo parágrafo), sem link para o repositório.
- **Imagens reais trocadas por esquemas em HTML e CSS (decisão posterior, mesmo dia):** as capturas viraram desenhos "esqueleto" (barras, cartões e menu verde) em `GaleriaUniser.tsx`, sem imagem, sem dado de pessoa e sem os editais de teste. São seis telas: Editais, Login, Grade curricular, Meus dados, Frequência e Meu semestre, em grade de 3 colunas (2 no celular, dentro do modal; carrossel no celular, na seção). Nome e descrição de cada tela ficam em `site.telasUniser`; a legenda "Esquemas ilustrativos das telas, sem dados reais." fica em `negocios.sobre.legendaTelas`. Isso também tira a dúvida sobre a foto de pessoas e o logo do login. Os WebP e `site.imagensUniser` foram removidos.
- **Originais fora do git:** `src/pages/uniser/` está no `.gitignore`; servem só de referência para os esquemas e não são versionados. SVGs de exemplo apagados.

## Cenas animadas no modal do Estágio (13/11/2026)

- **O que é:** duas cenas ilustrativas em HTML, CSS e SVG, sem imagem, em `CenasEstagio.tsx`; textos e dados em `src/content/cenasEstagio.ts` (dados fictícios, rotulados: "Cenas ilustrativas, com dados fictícios.").
- **Planilha ao painel:** planilha com colunas e linhas fora do lugar e textos sem padrão (4 passos: solto, colunas e linhas no lugar, palavras e valores padronizados, painel). O painel (total, lançamentos, valor por setor) é calculado das mesmas linhas (`resumoPlanilha` em `cenasLogica.ts`), então bate com a planilha.
- **Apresentação:** auditório visto de trás, com plateia fardada da Marinha, do Exército e da Aeronáutica (só cores e quepes genéricos, sem insígnia), e um telão com dois slides que se alternam (painel do mês, fluxo do processo). O nome (`site.nome`) fica ao lado, fixo nos dois slides.
- **Acessibilidade:** cada cena é `role="img"` com descrição própria; botão "Pausar animação" (aria-pressed) serve às duas; com `prefers-reduced-motion` nada anima, aparece o resultado final e o botão some. Os temporizadores só existem com o modal do Estágio aberto.

## Cenas ao lado do texto da seção Sobre (13/11/2026)

- **Disposição:** a seção virou uma grade: avatar, texto e, em tela larga (a partir de `lg`), uma coluna lateral de 22 rem (`<aside>`); abaixo disso a coluna vai para baixo do texto. Antes a galeria ficava abaixo do parágrafo do Uniser.
- **Coluna lateral:** em cima, a cena animada da planilha que vira painel (com pausa própria; aparece com `mostrarMinisterio`, pois é o assunto do estágio); embaixo, só 2 telas do Uniser (Editais e Login, marcadas com `naSecao` em `site.telasUniser`). As 6 telas continuam no modal do Uniser; o modal do Estágio mantém as duas cenas.
- **Pausa por cena:** cada animação tem o seu botão pequeno, só com o ícone de pausa/continuar (rótulo acessível "Pausar animação: <cena>", alvo de toque de 44 px), ao lado da legenda.

