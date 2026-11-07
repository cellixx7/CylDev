# Decisões técnicas e pendências

## V1 (02/11/2026)

- **Stack:** Vite multi-page + React + TypeScript, CSS puro com BEM. Produção depende só de `react` e `react-dom`.
- **Páginas:** `index.html`, `negocios/`, `comunidade/`, `obrigado/`, `404.html`, declaradas em `vite.config.ts`.
- **Open Graph:** o build troca `__URL__` nos HTML pela variável `URL` da Netlify (ou `site.urlPadrao`). Imagens em `public/og-*-v1.png`; ao trocar a imagem, mude o sufixo (`-v2`) por causa do cache do WhatsApp.
- **Tema:** `data-theme` no `<html>`, escuro por padrão em todas as áreas; um script inline aplica a escolha salva antes da pintura. Chave por área (`tema-negocios`, `tema-comunidade`, `tema-home`), leitura e escrita em `try/catch`.
- **Formulário:** ver V1.1 (EmailJS).
- **Fontes:** a V1 usa pilhas de fontes do sistema (serifada nos títulos, sans no texto, mono nos preços). As fontes definitivas entram com a identidade visual (V4), carregadas localmente com `font-display: swap`.
- **Catálogo por área:** pacotes de Discord aparecem em `/comunidade/`; os demais em `/negocios/`. Campo `area` em `servicos.ts`.
- **Prazo calculado:** `ceil(horas / horasPorDiaUtil) + diasDeRevisao`.
- **Demos:** ficam para a V2 (sem demo, não há dado fictício exposto na V1).

## V1.1 (02/11/2026): mudanças de escopo

- **Formulário por EmailJS** (`src/shared/lib/emailjs.ts`, API REST via `fetch`, sem dependência). `serviceId`, `templateId` e `publicKey` ficam em `site.emailjs` (são públicos); nenhuma chave privada no repositório. Proteção: campo isca + tempo mínimo de 3 s (spam finge sucesso) + limites de tamanho. No painel do EmailJS, restringir as origens permitidas ao domínio do site. Se o envio falhar (ou faltar configuração), o formulário mostra WhatsApp e e-mail. O template do EmailJS deve usar: `nome`, `preferencia`, `contato`, `assunto`, `mensagem`, `origem`.
- **Netlify Forms removido** (gêmeo estático apagado de `negocios/index.html`).
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

## Pendências do Marcelo

- [ ] Conferir o termo de estágio com o supervisor **antes do merge na main** (`mostrarMinisterio: true` em `src/content/site.ts`).
- [ ] Preencher `site.emailjs` (serviceId, templateId, publicKey) **antes do merge** e criar o template com os campos acima.
- [ ] Horas base do bot essencial e do bot com IA (hoje provisórias: 4 h e 8 h).
- [ ] Desconto do plano de 6 meses dos bots (`mensalidadeBots.descontoPlanoAdiantado`).
- [ ] Confirmar que o desconto de piloto vale só sobre a criação.
- [ ] Escolher o nome do site na Netlify e atualizar `site.urlPadrao`.
- [ ] Foto (opcional): colocar em `public/` e apontar `site.foto`.
- [ ] Vídeo do CylBot (talvez Uniser e CylSense). Nenhum vídeo para a planilha.
