# Changelog

O que muda em cada versão publicada na `main` (cada merge na `main` gera um deploy de produção). A mais nova fica em cima. Detalhes de cada decisão em `docs/decisoes/`; o que falta em `docs/PENDENCIAS.md`.

Formato: `## AAAA-MM-DD: título curto (PR #n)` e, embaixo, só o que o visitante ou quem mexe no código percebe.

## Não publicado

### Assistente do chat (Negócios)

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
