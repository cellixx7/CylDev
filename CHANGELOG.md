# Changelog

O que muda em cada versão publicada na `main` (cada merge na `main` gera um deploy de produção). A mais nova fica em cima. Detalhes de cada decisão em `docs/decisoes/`; o que falta em `docs/PENDENCIAS.md`.

Formato: `## AAAA-MM-DD: título curto (PR #n)` e, embaixo, só o que o visitante ou quem mexe no código percebe.

## Não publicado

### Assistente Cyl: entende melhor e envia o pedido pelo chat

- Lembra o serviço que a pessoa acabou de dizer, entende "pros dois", "a gente acabou de falar" e "site grande"/"site com curso" (projeto sob medida, sem preço inventado).
- Orçamento de vários serviços na mesma conversa, com o desconto do combo no resumo.
- Botão "Enviar pedido ao Marcelo": pede nome e WhatsApp, mostra o aviso de Termos e Privacidade e envia o pedido sem passar pelo carrinho (mesmo envio do carrinho; se falhar, mostra WhatsApp e e-mail).

### SEO: o site passa a se apresentar como CylDev

- Título e descrição da home agora dizem "CylDev" e o que é feito (ajuste de planilha, painel, site ou landing page). Antes só o nome "Marcelo Vaz" aparecia, e quem busca "cyldev" não encontrava a marca no título.
- Páginas internas trocam o sufixo "| Marcelo Vaz" por "| CylDev"; Entregas ganhou título e descrição com as palavras que as pessoas procuram.
- Dados estruturados: novo `WebSite` (nome do site "CylDev") e o `ProfessionalService` ganha `alternateName`, `sameAs` (perfis de `site.perfis`) e `knowsAbout`.
- `<noscript>` da home cita a marca e o texto de apresentação.
- Passos manuais (Search Console, perfis): `docs/decisoes/seo.md`.

### Cyl animado no header e rosto dele no chat

- O ícone de controle de videogame do header virou o mascote Cyl, que acena ao carregar a página, a cada 60 s e ao passar o mouse ou focar (sem acenar de novo antes de acabar o ciclo). Sem tooltip: o nome fica no `aria-label` e no `title` do link, e o clique continua levando à Comunidade. O enquadramento vai da cabeça à cintura. O joystick, a nuvem e a dica (com o botão "Ir para o CylDev" do toque) saíram; o header ficou 5 px mais baixo.
- No chat do assistente, a letra "C" do avatar deu lugar ao rosto do Cyl (parado), no cabeçalho do painel e em cada resposta.
- Com "reduzir movimento" ligado no sistema, o Cyl fica parado; com a aba oculta, a animação pausa.

### Assistente Cyl: conversa guardada no navegador

- A conversa não se perde mais ao recarregar a página nem ao fechar só o painel: volta igual, com o contexto ("e o painel?", "sim"). Fica no `localStorage`, só neste aparelho, sem rede.
- Botão "Conversas anteriores": "Nova conversa" guarda a atual na lista (até 30), que dá para reler. Só some quando a pessoa limpa os dados do site.
- Aviso do chat, resposta "você é uma IA?" e seção do navegador na privacidade atualizados (antes diziam que a conversa não era guardada).
- Temporário: botão "Copiar conversa (temporário)", a remover antes da entrega final.

### Assistente Cyl: mais variedade e convite no ícone

- Cada pergunta (77 assuntos e as intenções de preço, prazo, orçamento etc.) ganhou pelo menos 15 formas de resposta, sem mudar nenhum preço ou prazo.
- Convite "Está com dúvidas? Fale com a nossa assistente Cyl" no ícone do chat: aparece ao carregar, dura 5 s, volta a cada 30 s e tem botão de fechar.

### Assistente Cyl: saber geral, memória curta e respostas mais naturais

- Responde cerca de 60 assuntos que clientes costumam perguntar: fórmulas e atalhos do Excel, planilha organizada, tabela dinâmica, gráficos, macro e Python, PDF, site de uma página, domínio, Google, sistemas e bots, e também como o Marcelo trabalha (atendimento à distância, proposta, sigilo, mensalidade, o que não está no catálogo). Cada resposta oferece o serviço relacionado, com o preço de partida vindo de `servicos.ts`.
- Lembra o que acabou de dizer: "sim" e "pode ser" executam a oferta, "agora não" dispensa, "explica melhor" e "me dá um exemplo" aprofundam, "e o painel?" repete a pergunta com outro serviço. Nada disso sai da aba.
- Entende mais gírias, letra esticada e erro de digitação, inclusive dentro de frases ("tabela dinamca no exel"), e alterna a versão das respostas ao longo da conversa.
- Diz com franqueza que é um assistente de regras (não uma IA), que não escreve código nem resolve exercícios e quando não tem a resposta, em vez de explicar o serviço fora de hora. "O Marcelo é bom nisso?" e "o que ele já fez?" abrem o guia de confiança.
- Por dentro: `content/textos/assistenteSaber.ts`, `shared/lib/assistente/variar.ts`, mais testes em `assistenteSaber.test.ts` e `e2e/assistente.spec.ts`; decisões em `docs/decisoes/assistente.md`.

### Assistente Cyl: respostas mais úteis e cara de chat (PR 22)

- O assistente agora se chama **Assistente Cyl** e responde de forma expansiva: resposta direta, explicação em linguagem simples, dica ou próximo passo e uma pergunta para seguir a conversa. Voz amigável, com poucos emojis, tratamento "o senhor" ou "a senhora" só quando a pessoa deixa claro, e formas neutras na dúvida.
- Guias novos: como funciona, o que preparar antes de pedir, como pagar, como receber o projeto, como saber se é confiável, o que acontece depois da entrega (revisão, garantia, ajustes e mensalidade-base dos bots), para quem é o serviço e sugestões por tipo de negócio. Todos repetem só o que já está publicado (Entregas, Sobre, Perguntas, Termos); preço, prazo e desconto continuam vindo de `servicos.ts` e `orcamento.ts`, e o validador de números continua valendo.
- Entende gírias, abreviações e erros de digitação ("sisteminha", "nn", "tu", "prra", "botzão"). Mensagem vaga ou confusa não recebe "não encontrei": o chat acolhe, explica em poucas linhas com um exemplo do dia a dia e oferece opções clicáveis.
- Fala com franqueza quando o serviço não é o indicado (empresa que já tem sistema grande), nunca chama o valor de caro ou barato (só "valor justo"), não dá opinião jurídica (remete a Termos e Privacidade) e encaminha o que não sabe para o formulário ou o WhatsApp, com "costuma responder em até 2 horas, sem garantia".
- Interface em balões (usuário à direita, Assistente Cyl à esquerda com avatar, hora discreta). Cada resposta vem depois de 2 a 5 segundos com "Digitando…" e três pontinhos animados, e o texto aparece digitado (dá para pular). Respeita `prefers-reduced-motion`. "Limpar a conversa" virou o ícone "Nova conversa".
- "Bom dia", "Boa tarde" e "Oi" recebem o mesmo cumprimento e "Como posso ajudar?", sem repetir a apresentação; o aviso "Só posso responder coisas relacionadas ao CylDev" só aparece em pergunta fora do assunto.
- O botão "Tirar dúvidas" virou uma bolinha redonda com ícone de chat, no estilo do botão de tema, com o nome "Assistente Cyl" em um balão ao passar o mouse ou focar pelo teclado. O chat continua sendo carregado só na primeira abertura (o painel ficou com cerca de 19 kB gzip).
- Por dentro: `textos/assistenteGuias.ts` (guias), `shared/lib/assistente/ritmo.ts` (espera e digitação), `girias` em `content/assistente.ts`; testes novos em `assistenteCyl.test.ts` e `e2e/assistente.spec.ts`; decisões em `docs/decisoes/assistente.md`.

### Assistente do chat (Negócios), primeira versão

- Botão "Tirar dúvidas" no canto da home de Negócios abre um assistente que responde só com o conteúdo do site: serviços, o que inclui, preço de partida, prazo, desconto, pagamento, nota, desistência, contato. "Preço", "valor" e "quanto custa" são a mesma pergunta (rede de sinônimos, com tolerância a erro de digitação).
- Monta o orçamento na conversa, uma pergunta por vez, com as mesmas perguntas e o mesmo cálculo do orçamento do site, e leva ao carrinho (com as respostas) ou ao WhatsApp. Tem o guia "não sei qual escolher".
- Recusa assunto fora do site e pedidos para ignorar as regras; pedido maior ou que não sabe vai para o formulário do orçamento ou o WhatsApp, sem inventar preço nem prazo.
- Roda no navegador, sem rede: a conversa não é enviada nem guardada e some ao recarregar. Carregado só quando abre (cerca de 11 kB gzip). Segue o tema claro/escuro; tela cheia no celular.
- Por dentro: `src/shared/lib/assistente/` (lógica testada), `src/pages/negocios/assistente/` (interface), `src/content/assistente.ts` (vocabulário), `docs/decisoes/assistente.md`. Modelo de linguagem (WebLLM) fica para uma segunda etapa.

### Identificação do prestador e carrossel

- Rodapé e Termos mostram o nome completo e o CPF mascarado (`095*****199`); o número inteiro vai só na proposta por escrito.
- Cards de serviços em carrossel (`Carrossel.tsx`) e `PaginaTexto` reorganizada.

### Transições de página e de seção

- Troca de página animada (fade curto, cabeçalho e botão de tema parados) também no `npm run dev`: a regra `@view-transition` agora vai no `<head>` de todo HTML pelo plugin `transicao-de-pagina` do `vite.config.ts`.
- Links do cabeçalho até uma seção (`#orcamento`, `#sobre`...) rolam suave, só com movimento permitido.
- Carrinho: ao tirar um item, ele some com fade e os de baixo deslizam (`<ViewTransition>` do React). Modal do serviço: fade curto ao trocar de aba.
- Por dentro: `src/pages/negocios/transicao.ts` (`comTransicao`, tipo `local`) e a skill `vercel-react-view-transitions` usada como guia.

### Etapa 5 da auditoria: páginas jurídicas e de apoio

- Página nova **Termos de contratação** (`/termos/`): como o pedido vira contrato, pagamento, prazos, revisões, desistência em 7 dias, cancelamento, garantia de 90 dias, de quem é o que é entregue, portfólio, dados que o cliente passa (LGPD), sigilo, mensalidade dos bots, limites de responsabilidade e foro.
- **Política de privacidade** completada para a LGPD: responsável e canal, base legal de cada uso, dados fora do Brasil, direitos do titular, prazo de resposta, ANPD e regra de alteração. As âncoras passaram a ter nome (`#direitos`, `#pedir`...).
- Páginas novas **Perguntas frequentes** (`/perguntas/`, com "como mando a minha planilha com segurança?") e **Acessibilidade** (`/acessibilidade/`).
- Rodapé de todas as páginas: linha "Serviço prestado por" com a identificação de quem vende e os links Termos, Privacidade, Perguntas, Acessibilidade e Contato. As páginas de leitura ganharam rodapé.
- Carrinho: frase de aceite dos Termos e da privacidade ao lado do envio; o e-mail do pedido registra o aceite com a versão dos textos (parâmetro `aceite`; falta pôr no template do EmailJS).
- Formulário de contato: aviso de para que servem os dados, com link para a política.
- Seção "Do pedido à entrega": links para os Termos e as perguntas frequentes.
- As quatro páginas de leitura podem ser lidas sem JavaScript (o texto inteiro vai no HTML).
- Por dentro: `site.prestador` (CPF ou CNPJ, cidade/UF, recibo ou nota; vazio até o Marcelo informar), componente `PaginaTexto`, `docs/decisoes/juridico.md` e `docs/MODELO-PROPOSTA.md`. Os textos jurídicos não vão no JavaScript da home.
- Falta (Marcelo): informar CPF ou CNPJ e cidade/UF, confirmar os prazos propostos e passar os textos por um advogado. Ver `docs/PENDENCIAS.md`.

### Etapa 4 da auditoria: ajustes do FrontEnd

- Home: o título principal passa a ser a promessa ("Transformo a sua planilha bagunçada em um painel."), com o nome acima; no celular entra o botão "Chamar no WhatsApp" no topo.
- Seção nova "Do pedido à entrega" (`#entregas`), com os 5 passos que já estavam escritos, e o link "Entregas" no menu.
- Nenhum texto abaixo de 14 px: mini exemplos dos cards, cena da planilha, legendas do UniSER e avisos subiram para 14 px (os desenhos foram simplificados para caber).
- Celular: os mini exemplos dos cards vêm recolhidos atrás de "Ver exemplo".
- O card "Quer um bot para o seu servidor de Discord?" saiu do orçamento (o atalho da Comunidade continua no cabeçalho e no rodapé).
- Rodapé curto: "Site sem rastreadores." e os links Privacidade e Contato, no lugar do parágrafo de privacidade.
- Privacidade: índice no topo e "Voltar ao topo".
- Textos: "dados de mentira" virou "dados fictícios"; "Estagio em TI" virou "Sou estagiário de TI" (parecia erro de digitação).
- Entre 992 e 1023 px de largura o painel de exemplo passa a aparecer ao lado do título (antes a coluna ficava vazia).
- Por dentro: escala de texto e larguras em tokens (`tailwind.css`), componente `<Secao>`, títulos sem pular nível e `docs/DESIGN.md` completo. Teste novo confere, em todas as páginas, o mínimo de 14 px e a ordem dos títulos.

### Etapa 3 da auditoria: FrontEnd e BackEnd qualitativo

- Verificação automática no GitHub (`.github/workflows/ci.yml`): typecheck, testes, build e jornadas no navegador em todo PR. Falta ligar no GitHub a proteção da `main` que exige o check `verificar`.
- Home sem JavaScript: `<noscript>` com a frase principal, o preço de partida e os contatos.
- Dados estruturados (JSON-LD `ProfessionalService`) na home e `lastmod` no `sitemap.xml`.
- Seções vazias `#entregas` e `#como-funciona` removidas da home (nenhuma mudança visível além de menos espaço em branco antes do Contato).
- E-mail do pedido leva o aviso "Valor estimado pelo site. O valor final vai na proposta por escrito." (parâmetro `aviso_valor`; falta pôr no template do EmailJS).
- Teste de jornada instável ("ida a Como funciona e volta, depois recarregar") corrigido.

## 2026-11-16: Etapa 2 da auditoria, pastas e documentação (PR #16)

- Textos das páginas divididos por área em `src/content/textos/` (os imports de `content/textos` continuam iguais).
- `src/pages/negocios/` organizada em `orcamento/`, `sobre/` e `exemplo/`.
- `docs/DECISOES.md` dividido em `docs/decisoes/` (um arquivo por tema) e `docs/PENDENCIAS.md` (só o que falta, com dono e data).
- `docs/DESIGN.md`: primeira versão do guia de estilo (estado atual; a escala de tipografia entra na Etapa 4).
- Página 404 usa o e-mail de `site.ts`; textos sem uso removidos.
- React num arquivo próprio do build (`vendor-react-*.js`).
- Mockups antigos removidos de `docs/mockups/` (continuam no histórico do git); `.gitignore` sem sobras de Next.js.
- `CLAUDE.md`: graphify marcado como opcional, com instalação; estrutura nova descrita.
- Nenhuma mudança visível no site.

## Até 16/11/2026 (PR #15, commit `1402f21`)

Versão no ar antes da auditoria geral: Negócios com orçamento em cards, carrinho e checkout por EmailJS, seção Sobre com destaques e cenas, Como funciona com demonstrações, Comunidade, privacidade, obrigado e 404. Histórico anterior: `docs/decisoes/` e `git log`.
