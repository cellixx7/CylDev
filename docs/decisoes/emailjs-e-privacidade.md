# EmailJS, e-mail do pedido e privacidade

Envio do formulário e do pedido pelo EmailJS e a política de privacidade. Seções em ordem de data; a mais nova fica no fim.

## EmailJS e prazo provisório (09/11/2026)

- **EmailJS (atualizado em 11/11/2026):** `serviceId`, `templateId` e `publicKey` estão preenchidos em `site.emailjs`, então o envio pelo site está ativo. Falta só conferir no painel do EmailJS o template e as origens permitidas (ver `docs/PENDENCIAS.md`). O texto original desta linha falava em ids vazios e no serviceId antigo.
- **Prazo provisório:** o campo `horasProvisorias: true` em `servicos.ts` marca pacotes com horas ainda não confirmadas (hoje: bot essencial e bot com IA). Neles o site mostra "prazo a combinar" no catálogo (`textoPrazo`), na calculadora e no `resumoOrcamento` (WhatsApp e e-mail). Os demais seguem com dias úteis calculados. Quando o Marcelo confirmar as horas, remover a marca. As horas provisórias (4 h e 8 h) ainda aparecem na calculadora e no resumo.

## E-mail do pedido com os dados por serviço (11/11/2026)

- **O que mudou:** o envio pelo site (EmailJS) passa a levar, além dos parâmetros de sempre, `itens` (array de objetos `{ titulo, valor, respostas }`, um por serviço do carrinho), `total` e `observacoes`. `mensagem` continua com o pedido inteiro em texto, como reserva. Sem dado, `total` e `observacoes` vão como "—" e `itens` como lista vazia. Formato completo e sugestão de template em `docs/emailjs-template.md`.
- **Formato:** `titulo` = nome do serviço; `valor` = o mesmo texto do carrinho (`resumoPrecoItem`), com " (estimativa)" quando `ItemPedido.estimativa` (tem valor e há pergunta sem resposta; "sob consulta" não ganha o aviso, como no carrinho); `respostas` = uma linha por pergunta, "não respondeu" quando faltar; `assunto` = "Pedido: A + B"; `total` = `totalCurto`, o mesmo texto do rodapé do carrinho (a função saiu de `BarraCarrinho.tsx` para `pedido.ts`, sem mudar).
- **Linha da resposta:** as perguntas terminam em "?", então a linha sai "Pergunta? resposta"; os dois-pontos ("Pergunta: resposta") só entram quando a pergunta não termina em pontuação. Decisão minha, para não escrever "?:".
- **Texto simples:** nenhum HTML é montado no código; o template do EmailJS decide a aparência. Regras de spam (isca e 3 s) e lógica de preço intactas.
- **Pendente:** a sintaxe de lista do template não foi testada com envio real (os ids já estão configurados; os testes e2e interceptam a API).

## Privacidade e A-15 (12/11/2026)

- **A-15:** entrada de 50% por Pix e saldo de 50% antes da entrega final ficam como estão (`textos.ts`, `como-funciona/main.tsx`, `COPY.md`). Confirmado pelo Marcelo em 12/11/2026. Nenhum outro texto contradiz (conferi "Pix", "entrada", "pagamento").
- **A-11:** linha de privacidade no painel do carrinho (o que é enviado, para quê, por onde passa) e página `/privacidade/` (entrada no `vite.config.ts`, canonical, sitemap, link no rodapé de Negócios e Comunidade; `/obrigado/` e a 404 não têm rodapé). Texto em `textos.ts`/`COPY.md`.
- **Prazo de guarda:** e-mails de pedidos por até 12 meses (escolha do Marcelo). É uma promessa a cumprir: apagar a cada 12 meses, e o registro do envio no painel do EmailJS, se houver. A conversa no WhatsApp: "enquanto precisar para atendimento e entrega", sem número.
- **Limites:** não é parecer jurídico; não verifiquei a política interna de retenção do EmailJS nem os logs da Netlify (a página só diz que podem existir). A linha do carrinho aparece só com o EmailJS ativo (é o formulário que a contém).

## Etapa 3 da auditoria geral: e-mail do pedido e riscos do "backend" (16/11/2026)

- **Sem backend próprio, de propósito:** o "backend" continua sendo Netlify (hospedagem e cabeçalhos) + EmailJS (envio) + WhatsApp (conversa). Custo zero e nada para invadir.
- **Valor estimado no e-mail:** o pedido do carrinho passa a levar `aviso_valor` ("Valor estimado pelo site. O valor final vai na proposta por escrito.", em `textos/orcamento.ts`). Motivo: o preço é calculado só no navegador e pode ser alterado por quem mexer nele; a proposta por escrito é o que vale. O site já dizia isso no orçamento e o WhatsApp já fecha com "(Estimativa, confirmada na conversa.)"; faltava no e-mail. Contato simples (sem carrinho) manda "—". O template do painel precisa ganhar `{{aviso_valor}}` (ver `docs/emailjs-template.md`). O mesmo aviso tem de entrar nos Termos (Etapa 5).
- **Pedido perdido sem aviso:** se o EmailJS cair ou a cota acabar, o cliente vê o erro com WhatsApp e e-mail, mas o Marcelo não fica sabendo. Mitigação sem código nova: filtro no Gmail que nunca manda para spam e marca os e-mails do EmailJS, e conferência mensal da cota no painel do EmailJS (em `PENDENCIAS.md`).
- **Futuro, só com ok do Marcelo:** se o volume crescer, uma Netlify Function para receber o pedido, recalcular o preço no servidor e guardar uma cópia (ex.: planilha Google). Peça nova, fora desta etapa.

