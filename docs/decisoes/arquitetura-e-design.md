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
- **Seções vazias:** `<section id="entregas">` e `<section id="como-funciona">` saíram de `negocios/main.tsx` (eram vazias e só somavam espaço). O link "Entregas" do menu continuou desligado até a Etapa 4 (ver abaixo), por `site.menuSecoes.entregas: false`; quando a seção existir (Etapa 4 pode preenchê-la com os passos de `comoFunciona`), ela volta ao `main.tsx` e a flag vira `true`.
- **Componentes grandes** (`PainelExemplo.tsx`, `PorQueEsseValor.tsx`, `CenasEstagio.tsx`, `PainelCarrinho.tsx`): ficam como estão. Regra combinada na auditoria: quebrar em partes menores **quando forem mexidos de novo**, não refatorar só por refatorar. Na Etapa 4, o `PainelExemplo.tsx` vai ser mexido (ordem dos títulos): é o momento de separar o gráfico mensal e as regiões em arquivos próprios em `exemplo/`.

## Etapa 4 da auditoria geral: ajustes do FrontEnd (16/11/2026)

- **Escala de texto em tokens:** `text-menor` (14 px), `text-base` (16), `text-medio` (18), `text-grande` (1,35 rem), `text-maior` (1,75 rem) e os `clamp` de título (`text-secao`, `text-pagina`, `text-hero`, `text-preco`), no `@theme` de `tailwind.css`. Os nomes são em português (e não `xs`/`sm`/`lg` como a auditoria sugeria) para não trocar o sentido das classes padrão do Tailwind, que foram desligadas (`--text-*: initial`). Os 18 tamanhos escritos à mão viraram 5: 11 a 14 px viraram `menor`; 15 e 16, `base`; 1,02 a 1,15 rem, `medio`; 1,2 a 1,35, `grande`; 1,5 a 2, `maior`. O `body` passou de 17 para 16 px, que era o que o guia já dizia.
- **Larguras em tokens:** `max-w-leitura` (40 rem) substitui `[36rem]`, `[40rem]`, `[44rem]` e `[60ch]`; `max-w-titulo` (20 ch) para o `h1` das páginas internas.
- **Nada abaixo de 14 px, nem em ilustração:** nos mini exemplos os nomes de arquivo ficaram mais curtos; na cena da planilha a coluna "Responsável" virou "Nome", "Carlos Pereira" virou "Carlos Reis" e a proporção passou de 16:10 para 4:3, para as quatro colunas caberem em 360 px sem cortar. Teste de jornada "12. guia de estilo" mede todas as páginas em 390 e 1440 px.
- **`<Secao>`** (`src/shared/components/Secao.tsx`): largura, respiro, barra, `h2` e intro num lugar só. Usado em Orçamento, exemplo (celular), Entregas, Sobre e Contato. A Comunidade fica com o esqueleto antigo até a revisão da área (decisão do Marcelo: Comunidade vem depois das 5 etapas).
- **Hero:** o `h1` é a promessa e o nome vai acima, como sobretítulo. A frase que era o subtítulo foi dividida em duas (título + subtítulo), sem texto novo além do ponto final; o JSON-LD junta as duas. O título cinético passou a animar por palavra (por letra ficaria lento numa frase). No celular entrou o botão "Chamar no WhatsApp" (origem `negocios-hero`).
- **Entregas preenchida:** a seção `#entregas` voltou com os 5 passos de `negocios.comoFunciona` (título "Do pedido à entrega", para não repetir o "Como funciona" do menu, que é a página das demonstrações). Fica depois do Orçamento e antes do Sobre; o link do menu foi religado em `site.menuSecoes`.
- **Mini exemplos recolhidos no celular:** botão "Ver exemplo" por card (`aria-expanded`); de `md` para cima ficam sempre abertos. Com isso a home em 390 px foi de 10.287 para 9.639 px mesmo com a seção Entregas nova (que ocupa cerca de 900 px), e o Contato subiu de 8.888 para 8.380 px do topo.
- **Ordem dos títulos:** o `PainelExemplo` recebe `nivel` (2 no hero do desktop, 3 dentro da seção do celular) e os gráficos ficam um nível abaixo; "Painel de vendas" virou título de verdade. `h4` ganhou estilo base.
- **Um só corte de desktop:** `lg:` (1024 px) saiu; tudo usa `pc:` (992 px), inclusive o `useDesktop`. Corrige a faixa de 992 a 1023 px, em que o hero tinha duas colunas e a da direita ficava vazia.
- **Card de bot fora do orçamento** e **rodapé curto:** ver `orcamento.md` e `emailjs-e-privacidade.md`.
- **Privacidade:** índice no topo e "Voltar ao topo"; as seções deixaram de herdar o respiro de seção de página (ficavam recuadas).
- **Balão dos destaques do Sobre:** ganhou `pointer-events-none`; ele podia cobrir o destaque da linha de baixo e segurar o mouse.
- **Não entrou:** dividir os componentes grandes (regra da Etapa 3: só quando o componente for refeito) e o link "Termos" no rodapé (a página é da Etapa 5).

