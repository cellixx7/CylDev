# Textos do site: versão 2 (com as suas respostas)

Versão 2, com as respostas de 02/11. Fonte dos textos em `src/content/textos.ts` e `servicos.ts`. O que ainda depende de uma decisão sua aparece como `[PERGUNTA n]`. Nada disso aparece no site.

## Home

- Linha principal: "Desenvolvedor e analista de dados. Atendo online, para todo o Brasil."
- Porta 1, "Para o seu negócio": "Painéis, páginas e automação para quem vende e controla tudo em planilha."
- Porta 2, "Para o seu Discord e jogos": "Bots de Discord e ferramentas para quem joga."

## Negócios

### Apresentação

- Título: "Eu organizo a sua planilha e construo painéis para você ver como o seu negócio está indo."
- Texto: "Meu nome é Marcelo e sou desenvolvedor de sistemas e sites. Pego a planilha que você já usa para vendas, estoque ou caixa, deixo ela em ordem e entrego um painel com os números que importam para você. Também faço páginas para apresentar o seu negócio."
- Botões: "Chamar no WhatsApp", "Ver preços"

### Entregas

- Título: "O que eu entrego e quanto custa"
- Intro: "Os valores abaixo são pela criação. Cada pacote tem um preço-base a partir de um valor; no orçamento você vê a estimativa na hora, e eu confirmo o valor final depois de ver o seu caso. Bots têm mensalidade de hospedagem e manutenção; sites e planilhas não precisam."
- Combo (regra oficial, 12/11/2026), só para planilha, painel, automação e site de uma página: 1 serviço, preço normal; 2 serviços, 10% de desconto; 3 ou mais, 15%. No card: "Desconto a partir de 2 serviços: 10% com 2, 15% com 3 ou mais." (números lidos de `orcamento.ts`); o carrinho, a mensagem do WhatsApp e o e-mail mostram "combo 10%" ou "combo 15%" e o valor abatido. Combo e piloto não se somam: vale o que abate mais reais.
- Aviso de desconto (aparece enquanto houver vaga): "As 5 primeiras vagas têm 10% de desconto. As 5 seguintes, 5%. Restam {vagasRestantes} com {desconto}%. Chame no WhatsApp e garanta a sua." Depois das 10 vagas, o aviso some e valem os preços de tabela. `[PERGUNTA 2]`

| Pacote | Preço (criação) | Resultado | Inclui |
| --- | --- | --- | --- |
| Planilha organizada | R$ 100 | Sua planilha passa a ter uma aba por assunto, colunas padronizadas e totais que conferem. Fica mais fácil de preencher e de confiar nos números. | Limpeza dos dados que você já tem; fórmulas de total e resumo; instruções de uso em uma página |
| Painel básico | R$ 200 | Você abre um arquivo e vê quanto vendeu, o que mais sai e como está o mês, sem montar conta. Dá para controlar estoque e vendas com número, e não no chute. | Excel (padrão) ou Power BI Desktop (arquivo `.pbix` e PDF); uma fonte de dados; até 5 indicadores; filtro por período |
| Automação em Excel | a partir de R$ 300 | A tarefa que você repete toda semana na planilha passa a rodar com um clique. | VBA ou Power Query; instruções de uso |
| Site de uma página | R$ 300 | Uma página com o seu serviço, seus preços e um botão que leva o cliente direto para o seu WhatsApp. | Uma página; versão para celular; publicação no ar, em hospedagem gratuita na sua conta; botão de WhatsApp |
| Automação com Python | a partir de R$ 300 | Um script feito para a sua tarefa: junta planilhas e arquivos, lê PDFs, envia mensagens ou busca dados de sites. | Script em Python; teste com dados de exemplo; instruções para rodar e ajustar |
| Sistema sob medida | sob consulta | Quando a planilha já não dá conta e você precisa de um sistema próprio. Começa com uma conversa. | Conversa para entender o caso; proposta por escrito |

Nota sob o painel: "Compartilhar um painel do Power BI online com a sua equipe exige licença paga do Power BI do lado de vocês. No Excel isso não é preciso. Eu explico as opções na conversa."

Ajustes depois da entrega (planilha, painel e site de uma página): R$ 50 por hora, sem mensalidade. `[PERGUNTA 7]`

Dificuldade (para a calculadora): o preço e as horas dobram nos casos complexos (painel 4 h e R$ 200 no básico; 8 h e R$ 400 no complexo). `[PERGUNTA 4]`

### Como funciona

1. Conversa de 10 minutos. Pelo Google Meet, quando precisar ver tela, ajustar e apresentar com mais calma, ou pelo WhatsApp para uma dúvida rápida. Você me mostra a planilha ou conta o que precisa, e eu te digo o que preciso receber de você.
2. Proposta. Mando por escrito o que entra, o valor e a data de entrega.
3. Entrada de 50% por Pix. Começo depois da entrada.
4. Entrega por etapas. Você vê o andamento antes do fim e pode corrigir o rumo.
5. Saldo antes da entrega final. Os outros 50% antes de eu liberar os arquivos finais ou publicar no seu endereço. Uma rodada de revisão já está incluída.

Rodapé da seção: "Pagamento por Pix. Emito recibo."

### Sobre

- "Estudo Sistemas de Informação na Unieuro e trabalho como desenvolvedor fullstack."
- Se `mostrarMinisterio` (só depois da confirmação do supervisor): "Estagio em TI no Ministério da Defesa, onde faço análise de dados, planilhas, painéis e apresentações usadas em reuniões com oficiais superiores e generais. É a mesma rotina que levo para o seu negócio: pegar dado solto e entregar algo que dá para ler em um minuto. Os trabalhos que pego por aqui ficam fora do horário do estágio."
- Se `mostrarUniser` (texto liberado; imagens só com aprovação do supervisor): "Participo do Uniser, um portal do aluno desenvolvido pela Unieuro em parceria com a Universidade de Brasília. Faço parte da equipe que desenvolve o código do projeto."

### Contato

- "Escolha o jeito que for mais fácil para você. Respondo pelo mesmo canal."
- Formulário (envio por EmailJS): "Seu nome"; "Como prefere que eu responda?" (WhatsApp ou e-mail); depois "Seu WhatsApp (com DDD)" ou "Seu e-mail"; "Assunto" (só quando for e-mail); "O que você precisa" (descrição); botão "Enviar". Se o envio falhar, mostrar o botão do WhatsApp e o e-mail como alternativa.
- Ponte: "Tem um servidor de Discord ou uma comunidade de jogo? Veja a área CylDev."

## Comunidade

- Título: "Eu faço bots e ferramentas para quem joga."
- Texto: "Aqui ficam os projetos que eu faço para Discord e para jogos. Se você cuida de um servidor e quer um bot do seu jeito, dá para conversar."
- CylBot: "Bot de Discord com central de tickets, anúncios por servidor, IA opcional e painel web." Botão: "Ver o código no GitHub" (https://github.com/cellixx7/CylBot). Sem falar de planos nem de pagamento. O vídeo entra quando existir.
- CylSense, selo "Em desenvolvimento": "Uma ferramenta de análise de desempenho para quem joga VALORANT. Ainda não está aberta ao público. Quando sair, toda métrica vai mostrar o tamanho da amostra, e o que for hipótese vai aparecer como hipótese."
- Bot de Discord essencial, R$ 300 pela criação: "Seu servidor ganha tickets, mensagem de boas-vindas e moderação básica."
- Bot com IA e painel web, a partir de R$ 500 pela criação: "Um bot que responde com IA e um painel no navegador para você ajustar o que ele faz. O uso da IA é cobrado pelo provedor, na sua própria conta."
- Mensalidade dos bots (proposta, `[PERGUNTA 3]`): "O bot precisa ficar ligado o tempo todo. A mensalidade cobre o monitoramento e a correção de erros: 10% do preço de criação por mês. A hospedagem é um custo à parte e o uso da IA é cobrado pelo provedor, na conta de quem contrata. No plano de 6 meses pago adiantado, há desconto."
- Rodapé fixo: "CYL Sense não é afiliado à Riot Games."
- Ponte: "Quer algo assim para o seu negócio? Veja a área Negócios."

## Comum

- Privacidade: "Este site não usa ferramentas de rastreamento. O que você mandar pelo formulário ou pelo WhatsApp serve só para eu responder o seu contato. O formulário é enviado pelo serviço EmailJS."
- Obrigado: "Mensagem recebida." / "Obrigado pelo contato. Respondo pelo WhatsApp que você deixou."
- 404: "Essa página não existe." / "O link pode estar errado ou a página mudou de lugar. Se precisar de ajuda, escreva para marcelovaz.contato@gmail.com."
- Mensagem do WhatsApp: "Oi, Marcelo! Vim pelo site (origem: negocios)." Nos pacotes, a origem vira `negocios-painel`, `comunidade-bot-essencial` etc., seguida de "Quero um orçamento de: [nome do pacote] ([preço])." O preço **sai do `servicos.ts`**, nunca escrito à mão no texto.

## Privacidade (12/11/2026)

Fonte dos textos: `privacidade` em `src/content/textos.ts` (página `/privacidade/`) e `carrinho.privacidade` / `comum.privacidadeLink`.

- Carrinho (perto do envio): "Envio o seu nome, o WhatsApp, as respostas do orçamento e as observações, só para responder este pedido. Eles passam pelo EmailJS (envio pelo site) e pelo WhatsApp. Eu confirmo por WhatsApp e combinamos o Pix." + link "Política de privacidade".
- Rodapé de Negócios e Comunidade: o aviso de sempre + link "Política de privacidade".
- Página: o que recebo; para que uso; por onde passa (EmailJS, WhatsApp, Netlify; sem fontes ou rastreadores de terceiros); o que fica no navegador (carrinho em sessionStorage, sem nome, telefone nem observações; tema em localStorage; sem cookies de rastreamento); guarda do e-mail por até 12 meses; como pedir exclusão (e-mail de `site.ts`). Não é parecer jurídico.


## Por que esse valor? (12/11/2026)

Fonte: `orcamento.valor` em `src/content/textos.ts`. Botão "Por que esse valor?" no resumo da aba Orçamento (explica só o serviço aberto) e no carrinho, abaixo do total (explica o pedido inteiro). Abre um diálogo com duas partes. Os números (R$ por hora, combo, piloto) saem de `orcamento.ts`; nada é escrito à mão.

**1. Como o preço é montado** (sempre aparece)
- Cada serviço tem um preço-base. É o "a partir de" que aparece no card.
- Suas respostas podem somar horas extras de trabalho. Cada hora extra custa R$ 50 (`VALOR_HORA_EXTRA`).
- Combo: com 2 serviços combináveis (planilha, painel, automação e site de uma página), 10% de desconto. Com 3 ou mais, 15%.
- Piloto: enquanto houver vaga, há 10% (ou 5%, na segunda faixa) de desconto sobre o preço de criação. Sem vaga: "neste momento não há vaga de desconto de piloto."
- Os descontos nunca se somam: vale o que abate mais reais. O combo só vale para os serviços combináveis. O piloto não vale para a mensalidade nem para o sistema sob consulta. Os bots de Discord são vendidos só na Comunidade.
- Pergunta sem resposta deixa o valor aproximado. O valor final é confirmado na proposta. Hospedagem e o uso de IA dos bots são cobrados à parte.

**2. No seu pedido** (só com serviço): por serviço, uma tabela com o preço-base, cada resposta que somou horas (resposta, horas x R$ por hora, valor) e a soma do serviço; avisos de "sem resposta (ainda não somam)", "horas e prazo: a combinar" (bots) e a mensalidade à parte. Fechamento: soma de tabela, desconto (qual e por quê, inclusive "o piloto abateu mais que o combo", "o combo abateu X; o piloto abateria Y" ou empate: vale o combo) e total estimado. Última linha: "O que mais mudaria este valor: <serviço>: <perguntas que somam horas>."
- Carrinho vazio: "Seu pedido está vazio. Quando você adicionar um serviço, o detalhamento do valor aparece aqui." (só a parte 1)
