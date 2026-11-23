# Jurídico: Termos, privacidade (LGPD) e identificação

Páginas e textos que protegem quem compra e quem vende. Seções em ordem de data; a mais nova fica no fim.

> Nada aqui é parecer jurídico. Os textos foram redigidos a partir das regras que o site já mostrava e do que a auditoria de 16/11/2026 pediu, e devem passar pela revisão de um advogado (e a parte de CNPJ e nota, de um contador) antes de serem tratados como definitivos.

## Etapa 5 da auditoria geral: páginas jurídicas e de apoio (16/11/2026)

**O que entrou**

- **`/termos/` (Termos de contratação):** 18 seções com âncora estável (`#prestador`, `#site`, `#contratacao`, `#pagamento`, `#prazos`, `#revisoes`, `#arrependimento`, `#cancelamento`, `#garantia`, `#propriedade`, `#portfolio`, `#dados`, `#sigilo`, `#bots`, `#responsabilidade`, `#alteracoes`, `#foro`, `#contato`). A política de pagamento, cancelamento e reembolso é parte dos Termos, com âncoras próprias, como a auditoria sugeriu. O acordo de tratamento de dados (você como operador, LGPD art. 39) é a seção `#dados`.
- **`/privacidade/` revisada:** ganhou responsável e canal, base legal por finalidade (art. 7º), lista de direitos do art. 18, transferência internacional (art. 33), ANPD, prazo de resposta, guarda de documentos de contrato, dados de terceiros (liga aos Termos) e regra de alteração. O que já existia (EmailJS, WhatsApp, Netlify, navegador, 12 meses) foi mantido.
- **Identificação do prestador no rodapé** de todas as páginas com rodapé (home, Como funciona, Comunidade e as quatro páginas de leitura): "Serviço prestado por" + nome, CPF ou CNPJ, cidade/UF e e-mail. Os dados ficam em `site.prestador`; a linha é montada por `shared/lib/prestador.ts`.
- **Aceite no checkout:** frase com links para os Termos e a privacidade ao lado do envio do pedido, sem caixinha (o pedido ainda não é contrato). O registro vai no e-mail do pedido, no parâmetro novo `aceite`, com a data da versão de cada texto (`src/content/textos/versoes.ts`).
- **`/perguntas/` (perguntas frequentes)** em quatro grupos; o grupo `#arquivos` é o "como enviar seus arquivos com segurança" da auditoria.
- **`/acessibilidade/`:** o que o site faz, o que ainda falta e como avisar de problema.
- **Formulário de contato:** linha dizendo para que servem os dados, com link para a política (antes só o carrinho tinha).
- **`docs/MODELO-PROPOSTA.md`:** modelo da proposta por escrito, que amarra os Termos.

**Decisões**

- **Nenhum dado pessoal inventado.** `site.prestador.documento` e `cidadeUf` começam `null`. Enquanto estiverem assim, o rodapé mostra só nome e e-mail, os Termos dizem "CPF ou CNPJ: informado na proposta por escrito, antes de qualquer pagamento" e o foro dos casos sem consumidor fica "o foro do domicílio do prestador". Ao preencher `site.ts`, tudo passa a mostrar o dado sozinho. O Decreto 7.962/2013 pede nome, CPF ou CNPJ e endereço em local visível, então **a identificação só fica completa quando o Marcelo preencher** (pendência).
- **Respostas do Marcelo (16/11/2026):** cidade/UF é Brasília/DF (já em `site.prestador.cidadeUf`); o comprovante é recibo; o e-mail do site serve para pedidos de privacidade; e, por enquanto, CPF e CNPJ não são publicados: vale a frase de que o documento vai na proposta por escrito. Nenhum número foi informado, então nenhum foi escrito.
- **Recibo ou nota:** `site.prestador.comprovante` (`"recibo"` hoje, que é o que o site já prometia). Trocar para `"nota"` muda os Termos e a resposta da FAQ.
- **Prazos novos são propostas, num lugar só.** O site não tinha regra escrita para: prazo para pedir a revisão (7 dias), projeto sem resposta do cliente (30 dias), devolução de valores (10 dias), exclusão dos arquivos do cliente (30 dias) e aviso de incidente (2 dias úteis). Ficam em `prazosDosTermos` (`termos.ts`), o texto sai deles e um teste confere. Na privacidade, `prazosDaPrivacidade`: 12 meses de guarda (já decidido em 12/11) e 15 dias para responder ao titular (LGPD, art. 19). Todos estão em `PENDENCIAS.md` para o Marcelo confirmar.
- **Arrependimento (CDC art. 49):** devolução do valor pago em 7 dias corridos do aceite. Se uma etapa já foi entregue nesse prazo e o cliente quiser ficar com ela, o valor dessa parte é combinado por escrito; se não quiser, a devolução é integral. Escolhi essa redação, e não o "reembolso proporcional" direto que a auditoria citava, porque reter parte do valor dentro dos 7 dias é ponto discutível para consumidor. É o primeiro item para o advogado olhar.
- **Limitação de responsabilidade** ao valor pago só vale para quem não é consumidor; o texto diz que nada tira direito do CDC.
- **Encarregado (DPO):** a política diz que o canal é o e-mail e que não há encarregado nomeado à parte. A dispensa para agente de pequeno porte (Resolução CD/ANPD nº 2/2022) precisa ser confirmada pelo advogado.
- **Sem política de cookies e sem banner:** o site não usa cookies nem análise (a auditoria classificou como desnecessário). A privacidade diz isso e diz que o texto muda antes se um dia entrar estatística.
- **Página de leitura única:** `PaginaTexto.tsx` renderiza as quatro páginas a partir do formato `PaginaDeTexto` (`textos/tipos.ts`): título, versão, índice, seções com âncora, listas, blocos (perguntas) e rodapé. Links no conteúdo no formato `[rótulo](endereço)`, montados por `TextoRico` (só endereços do site, `https:`, `mailto:` e `tel:`). As âncoras da privacidade deixaram de ser `#secao-N` e passaram a ter nome.
- **Textos longos fora do JavaScript da home:** os quatro textos não são reexportados por `content/textos/index.ts`; cada página importa o seu arquivo. A data das versões fica em `versoes.ts`, que é o que o pedido usa. Sem isso, o arquivo compartilhado da home crescia de 29 KB para 52 KB.
- **Legível sem JavaScript:** o build põe o texto inteiro de cada página de leitura num `<noscript>` (`noscriptPaginaTexto` em `shared/lib/seo.ts`, plugin `seo` do `vite.config.ts`), com a identificação e os links. Texto jurídico não pode depender de script para ser lido, e os buscadores passam a ver o conteúdo. O `<noscript>` da home também ganhou a identificação e os links.
- **Sem dependência nova** e sem mexer nas regras de spam do EmailJS, em `orcamento.ts`, `servicos.ts` ou `perguntas.ts`.

**O que não entrou, de propósito**

- **Casos reais (`/trabalhos/`):** só com trabalho real e autorização (regra de honestidade). Não há caso autorizado no repositório.
- **Uma página por serviço (`/servicos/...`):** prioridade média na auditoria; pede texto próprio por serviço, que é decisão de conteúdo do Marcelo. Fica para depois da entrega de 26/11.
- **`/obrigado/` e 404** continuam sem rodapé (são páginas de aviso, com `noindex`), então não levam a linha de identificação.
- **Comunidade:** termos e privacidade do CylBot, termos de bot sob medida, regras de conduta, FAQ dos bots e aviso de não afiliação completo ficam para a fase de comunidade (lista na auditoria). Os Termos de Negócios trazem só o básico da mensalidade (`#bots`), sem inventar o que acontece com a hospedagem.
- **Etapa 1 (segurança):** adiada por decisão do Marcelo; nada dela foi feito aqui.

## CPF publicado mascarado (19/11/2026)

- **Decisão do Marcelo:** publicar o CPF mascarado (`095*****199`) no rodapé e nos Termos, em vez de não publicar nada. O número completo vai só na proposta por escrito, antes de qualquer pagamento, o que continua obrigatório.
- **Por quê:** CPF completo no HTML público é dado que bots raspam e golpistas usam. O mascarado atende em parte o Decreto 7.962/2013 (identificação visível) sem expor o número inteiro. Não é cumprimento pleno do decreto; o risco prático para serviço vendido sob proposta é baixo (fiscalização costuma vir de reclamação no Procon).
- **MEI:** descartado por ora (custo mensal do DAS e dúvida se a atividade de software cabe nas ocupações permitidas). Reavaliar se o faturamento crescer; com CNPJ, trocar `documento` e `comprovante` em `site.ts`.
- **Texto:** a linha "Quem presta o serviço" dos Termos avisa que o número é parcial e que o completo vai na proposta. Data dos Termos trocada para 19/11/2026 em `versoes.ts`.

## Auditoria de conformidade (23/11/2026)

Relatório completo em [`../auditorias/conformidade-legal.md`](../auditorias/conformidade-legal.md). Nada aqui é parecer jurídico; os textos novos são **propostas a revisar por advogado**.

**Mudanças**

- **Privacidade (versão de 23/11/2026, `versoes.ts`):** acrescentados o aviso dos campos livres (sem senha, dado de saúde ou dado de terceiros), o que o e-mail do pedido leva além dos dados do formulário (versões do aceite e o código fixo da página de origem, sem IP nem dados do aparelho), os links de saída e o Assistente Cyl (assistente automático, conversa só na memória da aba). Âncoras mantidas.
- **Checkout:** a frase de aceite ganhou o link "desistência em 7 dias" para `/termos/#arrependimento`. As regras dos Termos não mudaram (`termos.ts` intacto).
- **Campos livres:** aviso de não enviar dado sensível ou de terceiros nas observações do carrinho e na mensagem do contato.
- **Links que abrem outra aba** avisam o leitor de tela (`AvisoNovaAba`). Ficaram sem o aviso os links montados dinamicamente do Assistente, do Sobre e do modal do Sobre.
- **`og:image:alt`** nas páginas de Negócios e Comunidade, sem repetir "Preços fechados." (ver pendência).

**Decisões e regras**

- **Sem política de cookies e sem banner:** medido em 9 páginas (celular e desktop): zero cookies e zero requisições de terceiros. Só `sessionStorage` do carrinho (sem dado pessoal) e `localStorage` do tema depois da escolha. Banner só se um dia entrar cookie não essencial ou analytics, com aprovação do Marcelo.
- **Aceite sem caixinha mantido** (base: art. 7º, V). Pergunta registrada para o advogado.
- **Embeds de terceiros:** vídeo (por exemplo o do CylBot) só hospedado no próprio site ou atrás de "clique para carregar"; nada que carregue terceiro sem a pessoa pedir. Todo `target="_blank"` leva `rel="noopener"`.
- **Não feito de propósito:** analytics, dependências, CSP, CPF completo, mudança de regra dos Termos.
