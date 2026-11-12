# Template do EmailJS

O site manda só texto simples; a aparência do e-mail fica no template, dentro do painel do EmailJS. Nenhum HTML é montado no código.

## Parâmetros enviados (`template_params`)

| Parâmetro | Conteúdo | Sem dado |
| --- | --- | --- |
| `nome` | Nome do cliente | (obrigatório) |
| `preferencia` | "WhatsApp" ou "E-mail" | (obrigatório) |
| `contato` | WhatsApp (só dígitos, com 55) ou e-mail | (obrigatório) |
| `assunto` | No carrinho: "Pedido: A + B", com os nomes dos serviços | "Contato pelo site" |
| `mensagem` | Texto livre. **Vai vazia quando há `itens`** (o pedido já vai separado em `itens`, `total` e `observacoes`, sem repetir); sem itens (Comunidade, contato simples), é o conteúdo da mensagem. O WhatsApp continua com o pedido completo | vazio |
| `origem` | De onde veio (ex.: `negocios-carrinho`) | (obrigatório) |
| `pacote` | Nomes dos serviços, separados por vírgula | "—" |
| `tamanho` | Legado da calculadora antiga | "—" |
| `estimativa` | Total por extenso (desconto, mensalidade, sob consulta) | "—" |
| `itens` | Lista, um objeto por serviço do carrinho (abaixo) | lista vazia |
| `total` | Total como o carrinho mostra (ex.: "estimativa a partir de R$ 900") | "—" |
| `observacoes` | Texto livre do cliente | "—" |

Cada objeto de `itens`:

- `titulo`: nome do serviço.
- `valor`: preço como o carrinho mostra, com " (estimativa)" quando há pergunta sem resposta.
- `respostas`: uma linha por pergunta ("Pergunta? resposta"), separadas por quebra de linha; pergunta sem resposta sai como "não respondeu". Serviço sem perguntas: "—".

## Sugestão de template

A confirmar no painel do EmailJS: a sintaxe de lista (`{{#itens}} ... {{/itens}}`) é a dos templates dinâmicos do EmailJS, e não foi testada com uma conta real (o `templateId` e a `publicKey` ainda não existem em `site.ts`). Atenção: como `mensagem` não repete mais o pedido, se a lista não renderizar o e-mail do carrinho chega sem os itens; teste um envio real antes de divulgar. (O `templateId` e a `publicKey` já estão em `site.ts`; o que falta é o teste real.)

Assunto do e-mail: `{{assunto}}`

Corpo (HTML):

```html
<p><strong>{{nome}}</strong> · {{preferencia}}: {{contato}}</p>

{{#itens}}
<h3>{{titulo}}</h3>
<p><strong>{{valor}}</strong></p>
<p style="white-space: pre-line">{{respostas}}</p>
{{/itens}}

<p><strong>Total:</strong> {{total}}</p>
<p><strong>Observações:</strong></p>
<p style="white-space: pre-line">{{observacoes}}</p>

<hr />
<p style="white-space: pre-line">{{mensagem}}</p>
<p>Origem: {{origem}}</p>
```

`white-space: pre-line` mantém as quebras de linha de `respostas`, `observacoes` e `mensagem`. Use chaves duplas (`{{ }}`), que escapam o que o cliente digitou; não use chaves triplas nesses campos.
