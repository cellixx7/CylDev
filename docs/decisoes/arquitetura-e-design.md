# Arquitetura, design e acessibilidade

Stack, páginas, tema, fontes, visual, responsividade e acessibilidade. Seções em ordem de data; a mais nova fica no fim.

## V1 (02/11/2026)

- **Stack:** Vite multi-page + React + TypeScript + Tailwind v4 (`@tailwindcss/vite`), com tokens nos temas em `src/styles/`. Produção depende só de `react` e `react-dom`. Classes repetidas ficam em `src/shared/estilos.ts`, como strings literais completas.
- **Páginas:** `index.html` (Negócios na raiz), `como-funciona/`, `comunidade/`, `obrigado/`, `404.html`, declaradas em `vite.config.ts`.
- **Open Graph:** o build troca `__URL__` nos HTML pela variável `URL` da Netlify (ou `site.urlPadrao`). Imagens em `public/og-*-v1.png`; ao trocar a imagem, mude o sufixo (`-v2`) por causa do cache do WhatsApp.
- **Tema:** `data-theme` no `<html>`, claro por padrão em Negócios (e nas páginas compartilhadas: /como-funciona/, /obrigado/, /privacidade/, 404, que usam a chave `tema-negocios`) e escuro por padrão na Comunidade, sem seguir `prefers-color-scheme`; um script inline aplica a escolha salva antes da pintura. Chave por área (`tema-negocios`, `tema-comunidade`), leitura e escrita em `try/catch`.
- **Botão de tema:** no celular e no tablet (abaixo de `pc`) fica dentro da barra do cabeçalho, ao lado do menu, para não cobrir o texto. No desktop continua flutuando no canto inferior esquerdo (e sobe junto com a barra do carrinho).
- **Formulário:** ver V1.1 (EmailJS), logo abaixo.
- **Fontes:** locais, em `public/fonts/` (`font-display: swap`): Space Grotesk nos títulos e no texto e Space Mono nos preços e números (Negócios).
- **Visual:** Negócios usa cobalto sobre off-white frio (claro) e azul-noite (escuro), com um só acento (`src/styles/tema-negocios.css`); a Comunidade tem tema próprio em `src/styles/tema-comunidade.css`. Sem degradê, vidro ou blur e sem emoji como ícone. (A paleta grafite com terracota das primeiras versões foi substituída.)
- **Catálogo por área:** pacotes de Discord aparecem em `/comunidade/`; os demais na raiz `/`. Campo `area` em `servicos.ts`.
- **Prazo calculado:** `ceil(horas / horasPorDiaUtil) + diasDeRevisao`.
- **Demos:** as demonstrações animadas de planilha, painel e automação já existem em Como funciona (ver Blocos 6 e 6b em `demonstracoes.md`). Todo dado delas é rotulado como exemplo fictício.

## V1.1 (02/11/2026): mudanças de escopo

- **Formulário por EmailJS** (`src/shared/lib/emailjs.ts`, API REST via `fetch`, sem dependência). `serviceId`, `templateId` e `publicKey` ficam em `site.emailjs` (são públicos); nenhuma chave privada no repositório. Proteção: campo isca + tempo mínimo de 3 s (spam finge sucesso) + limites de tamanho. No painel do EmailJS, restringir as origens permitidas ao domínio do site. Se o envio falhar (ou faltar configuração), o formulário mostra WhatsApp e e-mail. O template do EmailJS deve usar: `nome`, `preferencia`, `contato`, `assunto`, `mensagem`, `origem`, `pacote`, `tamanho`, `estimativa` (os três últimos vão como "—" quando o pedido não vem da calculadora).
- **Netlify Forms removido** (gêmeo estático apagado de `index.html`).
- **Descontos de piloto:** `vagasPiloto10` e `vagasPiloto5` em `src/content/orcamento.ts`; o aviso aparece em Negócios e Comunidade e some com os dois em 0. Desconto só sobre a criação.
- **Mensalidade dos bots:** 10% do preço de criação por mês + hospedagem (`mensalidadeBots`); funcionalidade nova a R$ 50/h. Landing, painel e planilha sem mensalidade; ajustes a R$ 50/h.
- **Calculadora (V2):** `estimar()` em `src/shared/lib/orcamento.ts` multiplica horas e preço pela complexidade (`complexidades`).
- **Preços e horas:** planilha R$ 100 / 2 h (prazo 2 dias úteis), painel R$ 200 / 4 h, landing R$ 300 / 5 h, bot essencial R$ 300, automação a partir de R$ 300, bot com IA a partir de R$ 500.
- **Textos:** COPY v2 aplicada (`docs/COPY.md`). Uniser visível só com texto. Promessas de "vídeo curto" e "teste com os seus arquivos" removidas.

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

## Tema claro como padrão em Negócios (2026-11-12)

- **Regra:** sem escolha salva, Negócios abre em claro mesmo com o sistema em modo escuro. Escolha salva em `tema-negocios` é mantida; o botão de alternar continua. Comunidade segue escura por padrão. O padrão está em três lugares que precisam andar juntos: `data-theme` e `meta theme-color` (`#f2f4f8`) de cada HTML e `temaPadrao` em `CabecalhoNegocios.tsx`.
- **Páginas compartilhadas:** /como-funciona/, /obrigado/, /privacidade/ e 404 usam a chave `tema-negocios`; sem escolha salva, claro. Não há rastreio de "área de origem" além da escolha salva.
- **CSP:** o script inline não mudou (lê só a escolha salva) e a política usa `'unsafe-inline'`, sem hash; `netlify.toml` ficou como estava. Conferi no build: hash do script de Negócios `I7j5xP3oeM2+PeDUHqJxAW3nPCMfDUS6gkkJRkQmAJI=`, igual em todas as páginas.
- **Contraste (claro):** tokens passam AA (texto 16,9:1; texto suave 7,0:1; destaque 6,7:1; botão 7,4:1). Auditoria automática do texto renderizado (home, como funciona, privacidade, obrigado, 404 e modal, em 360 e 1280 px, nos dois temas): nenhuma falha, nada foi alterado na paleta. Não cobri o painel do carrinho com itens.
- **Testes:** `src/shared/tema.test.ts` e `e2e/tema.spec.ts` (claro mesmo com o sistema escuro, Comunidade escura, escolha salva mantida).

## Etapa 3 da auditoria geral: home sem JavaScript, dados estruturados e componentes (16/11/2026)

- **`<noscript>` na home:** o hero é React, então sem JavaScript (ou para robôs que não executam JS) a página vinha vazia. Agora o `index.html` do build leva um `<noscript>` com o nome, a frase principal, o preço de partida e os contatos (WhatsApp, e-mail e link de Como funciona). O conteúdo sai de `src/content/` (textos em `negocios.semJs` de `textos/negocios.ts`, preço de `servicos.ts`, contatos de `site.ts`) e é montado por `src/shared/lib/seo.ts`, chamado pelo plugin `seo` do `vite.config.ts`. O `index.html` da raiz não muda: a injeção acontece no build e no `npm run dev`. Classes do Tailwind no `<noscript>` só as que o site já usa, porque o Tailwind não lê o `seo.ts` como HTML.
- **JSON-LD `ProfessionalService`:** no `<head>` da home, com nome, descrição, URL, imagem OG, telefone, e-mail, área atendida (Brasil) e os pacotes de Negócios disponíveis. Preço só o de tabela: fixo vira `price`, "a partir de" vira `minPrice`, sob consulta vai sem preço. Nenhum dado novo: tudo já estava visível no site. O `<` do JSON é escapado para não fechar a tag. Não é afetado pela CSP (dados, não script executável).
- **Preço de partida num lugar só:** `precoDePartida()` saiu de `negocios/main.tsx` para `seo.ts`; o hero e o `<noscript>` usam a mesma função.
- **`sitemap.xml` com `lastmod`:** a data do último commit (`git log -1 --format=%cs`), igual para as 4 páginas; sem git, vale a data do build. A Netlify clona com histórico, então a data é a do commit publicado.
- **Seções vazias:** `<section id="entregas">` e `<section id="como-funciona">` saíram de `negocios/main.tsx` (eram vazias e só somavam espaço). O link "Entregas" do menu continua desligado por `site.menuSecoes.entregas: false`; quando a seção existir (Etapa 4 pode preenchê-la com os passos de `comoFunciona`), ela volta ao `main.tsx` e a flag vira `true`.
- **Componentes grandes** (`PainelExemplo.tsx`, `PorQueEsseValor.tsx`, `CenasEstagio.tsx`, `PainelCarrinho.tsx`): ficam como estão. Regra combinada na auditoria: quebrar em partes menores **quando forem mexidos de novo**, não refatorar só por refatorar. Na Etapa 4, o `PainelExemplo.tsx` vai ser mexido (ordem dos títulos): é o momento de separar o gráfico mensal e as regiões em arquivos próprios em `exemplo/`.

