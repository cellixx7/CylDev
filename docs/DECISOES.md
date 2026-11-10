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
- [ ] Preencher `templateId` e `publicKey` em `site.emailjs` **antes do merge** e criar o template com os campos acima (o `serviceId` já está preenchido).
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
