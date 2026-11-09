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
