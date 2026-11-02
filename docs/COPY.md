# Textos do site para revisão

Todos os textos são rascunhos marcados com `[REVISAR]`. Reescreva na sua voz e passe a versão final para `src/content/textos.ts` (e `servicos.ts` no caso do catálogo). A marca `[REVISAR]` existe só neste arquivo, nunca no site.

## Home

- [REVISAR] Linha principal: "Desenvolvedor em Brasília. Escolha por onde entrar."
- Porta 1, "Para o seu negócio": "Painéis, páginas e automação para quem vende e controla tudo em planilha."
- Porta 2, "Para a sua comunidade ou jogo": "Bots de Discord e ferramentas para quem joga."

## Negócios

### Apresentação
- [REVISAR] Título: "Eu organizo a planilha do seu negócio e monto o painel que você vai abrir todo dia."
- [REVISAR] Texto: "Sou o Marcelo, desenvolvedor em Brasília. Pego a planilha que você já usa para vendas, estoque ou caixa, deixo ela em ordem e entrego um painel com os números que importam para você. Também faço páginas simples para divulgar o seu serviço."
- Botões: "Chamar no WhatsApp", "Ver preços"

### Entregas
- [REVISAR] Título: "O que eu entrego e quanto custa"
- [REVISAR] Intro: "Preço fechado para os pacotes básicos. Quando o trabalho varia, mostro o valor mínimo e confirmo depois de ver o seu caso."
- [REVISAR] Piloto (some quando `vagasPiloto` chega a 0): "Primeiros clientes: 5 de 5 vagas com 10% de desconto. Quando acabarem, este aviso some."

| Pacote | Preço | Resultado [REVISAR] | Inclui [REVISAR] |
| --- | --- | --- | --- |
| Planilha organizada | R$ 250 | Sua planilha de vendas ou estoque passa a ter uma aba por assunto, colunas padronizadas e totais que conferem. | Limpeza dos dados que você já tem; fórmulas de total e resumo; um vídeo curto explicando como usar |
| Painel básico | R$ 700 | Você abre um arquivo e vê quanto vendeu, o que mais sai e como está o mês, sem montar conta. | Excel ou Power BI; uma fonte de dados; até 5 indicadores; filtro por período |
| Automação em Excel | a partir de R$ 800 | A tarefa que você repete toda semana na planilha passa a rodar com um clique. | VBA ou Power Query; teste com os seus arquivos; instruções de uso |
| Landing page básica | R$ 800 | Uma página com o seu serviço, seus preços e um botão que leva o cliente direto para o seu WhatsApp. | Uma página; versão para celular; publicação no ar; botão de WhatsApp |
| Aulas de Excel ou programação | R$ 50/h ou 4 aulas por R$ 180 | Aula individual pelo computador, no seu ritmo, com os arquivos que você usa no trabalho. | Aula online; exercícios com o seu material |
| Sistema sob medida | sob consulta | Quando a planilha já não dá conta e você precisa de um sistema próprio. Começa com uma conversa. | Conversa para entender o caso; proposta por escrito |

Confira: "um vídeo curto explicando como usar" e "teste com os seus arquivos" são promessas. Só mantenha se você for cumprir.

### Como funciona [REVISAR]
1. Conversa de 10 minutos. Pelo WhatsApp ou chamada. Você me mostra a planilha ou conta o que precisa.
2. Proposta. Mando por escrito o que entra, o valor e a data de entrega.
3. Entrada de 50% por Pix. Começo depois da entrada.
4. Entrega por etapas. Você vê o andamento antes do fim e pode corrigir o rumo.
5. Saldo na entrega. Os outros 50% quando você recebe. Uma rodada de revisão já está incluída.

Rodapé da seção: "Pagamento por Pix. Emito recibo."

### Sobre [REVISAR]
- "Estudo Sistemas de Informação na Unieuro e trabalho como desenvolvedor fullstack."
- Se `mostrarMinisterio`: "Faço estágio no Ministério da Defesa. Os trabalhos que pego por aqui ficam fora do horário do estágio." (conferir o termo de estágio antes de publicar)
- Se `mostrarUniser`: "Participo do projeto Uniser." (oculto)

### Contato
- [REVISAR] "Escolha o jeito que for mais fácil para você. Respondo pelo mesmo canal."
- Formulário: "Seu nome", "WhatsApp ou e-mail", "O que você precisa", "Enviar"
- Ponte: "Tem um servidor de Discord ou uma comunidade de jogo? Veja a área CylDev"

## Comunidade

- [REVISAR] Título: "CylDev faz bots e ferramentas para quem joga."
- [REVISAR] Texto: "Aqui ficam os projetos que eu faço para Discord e para jogos. Se você cuida de um servidor e quer um bot do seu jeito, dá para conversar."
- [REVISAR] CylBot: "Meu bot de Discord. O vídeo mostrando o que ele faz chega em breve." (descreva o que ele faz hoje; não encontrei o repositório localmente)
- [REVISAR] CylSense, selo "Em desenvolvimento": "Uma ferramenta de análise de desempenho para quem joga VALORANT. Ainda não está aberta ao público. Quando sair, toda métrica vai mostrar o tamanho da amostra, e o que for hipótese vai aparecer como hipótese."
- Bot de Discord essencial (R$ 350): "Seu servidor ganha tickets, mensagem de boas-vindas e moderação básica."
- Bot com IA e painel web (a partir de R$ 600): "Um bot que responde com IA e um painel no navegador para você ajustar o que ele faz."
- Rodapé fixo: "CYL Sense não é afiliado à Riot Games."
- Ponte: "Quer algo assim para o seu negócio? Veja a área Negócios"

## Comum

- [REVISAR] Privacidade: "Este site não usa cookies de rastreamento nem guarda dados de quem visita. O que você mandar pelo formulário ou pelo WhatsApp serve só para eu responder o seu contato."
- Obrigado: "Mensagem recebida." / "Obrigado pelo contato. Respondo pelo WhatsApp ou e-mail que você deixou."
- 404: "Essa página não existe." / "O link pode estar errado ou a página mudou de lugar."
- Mensagem do WhatsApp: "Oi, Marcelo! Vim pelo site (origem: negocios)." Nos pacotes, a origem vira `negocios-painel`, `comunidade-bot-essencial` etc., seguida de "Quero um orçamento de: Painel básico (R$ 700)."
