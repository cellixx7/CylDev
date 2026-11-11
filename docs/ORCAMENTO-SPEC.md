# Spec: Orçamento com perguntas, preço por respostas e carrinho

Data: 09/11/2026. Referência visual: design "Orçamento: lista de serviços + painel detalhado" (desktop e celular). Os textos e valores abaixo são a fonte; em caso de dúvida, vale este arquivo.

## 1. Objetivo

Trocar a seção `#orcamento` (src/pages/negocios/Orcamento.tsx) por um fluxo em três partes:

1. Lista de serviços (como uma lista de conversas).
2. Painel do serviço, com perguntas que montam o preço, e uma estimativa que explica como se chegou ao valor.
3. Carrinho: o cliente fecha o pedido pelo site OU fala direto com o Marcelo no WhatsApp. As duas opções têm o mesmo peso visual.

O tamanho do trabalho (Básico, Médio, Complexo) deixa de existir. O preço nasce das respostas.

## 2. Regras de preço

- Constante `VALOR_HORA_EXTRA = 50` (R$ por hora de trabalho extra). Já existe `parametros.valorHoraAvulsa = 50`; reutilize.
- Cada serviço tem `preco` base e `horas` base (de servicos.ts, sem alterar esses valores).
- Cada resposta pode somar horas extras. Cada hora extra soma R$ 50 ao preço e 1 hora ao tempo de trabalho.
- Pergunta de escolha única: a opção marcada soma `h` horas (0 se não houver efeito).
- Pergunta de escolha múltipla: `n` = quantidade marcada. Horas extras = `max(0, n - gratis) * h`. Os primeiros `gratis` itens são inclusos.
- Serviço "a partir de" (automação, bot com IA) continua com o prefixo "a partir de".
- Aulas: o preço depende só do formato (avulsa R$ 50 por hora, pacote de 4 aulas R$ 180). Nenhuma outra pergunta muda o valor.
- Sistema sob medida: sempre "sob consulta".
- Prazo (planilha, painel, automação, landing): `ceil(horasTotais / horasPorDiaUtil) + diasDeRevisao` (parâmetros atuais: 2 h por dia útil, 1 dia de revisão). Texto: "estimado: N dias úteis".
- Bot essencial e bot com IA têm horas provisórias: o prazo é sempre "a combinar" (nunca calculado). O preço varia pelas respostas, mas mostra "estimativa".
- Aulas: "começa quando você quiser". Sistema: "combinado na proposta".
- Mensalidade dos bots: 10% do preço de criação (já com as extras) por mês, mais hospedagem à parte (parâmetro `mensalidadeBots`).

## 3. Descontos e carrinho

- Serviços combináveis: planilha, painel, automação, landing. Aulas, bots e sistema ficam fora do combo.
- Combo: 2 combináveis no carrinho = `COMBO_2`% de desconto; 3 ou mais = `COMBO_3`%. VALORES PROPOSTOS, a confirmar: 10% e 15%. Ficam em src/content/orcamento.ts, marcados como pendentes.
- Piloto: 10% enquanto houver vaga (já existe `descontoPilotoAtual`). Vale só sobre a criação; nunca em aulas nem na mensalidade.
- Combo e piloto não se somam: vale o MAIOR. O resumo diz qual foi aplicado ("combo 15%" ou "piloto 10%").
- Os combináveis no carrinho têm um prazo único: horas somadas, ceil(soma / 2) + 1 dia de revisão (uma só revisão).
- O desconto do combo incide só sobre os combináveis. Bots recebem só piloto. Aulas e sistema, nenhum.
- O carrinho mostra: itens (com "Tirar" e abrir para editar), soma de tabela, desconto, prazo, mensalidade dos bots, total estimado e a nota "estimativa, confirmada na conversa".
- Estado do carrinho: ids de serviços; o preço de cada item é calculado das respostas atuais. Sem persistência obrigatória.
- Botão "Montar combo": coloca planilha, painel e automação no carrinho.

## 4. Serviços e perguntas

Legenda: [U] escolha única, [M] múltipla. `+Nh` = soma N horas (N × R$ 50). `gratis` = itens inclusos na múltipla.
Todas as perguntas têm um botão "O que é isso?" que abre o texto de ajuda. Cada pergunta indica "Muda o valor." ou "Não muda o valor." (e "Marque quantas quiser." quando for múltipla). Opções de escolha única com custo mostram "+ R$ X".

Perguntas reutilizadas:

**Que tipo de negócio é?** [U] sem efeito. Opções: Loja ou varejo; Serviços e atendimento; Alimentação; Oficina ou técnico; Outro.
Ajuda: "Isso me ajuda a escolher o que colocar de começo: estoque e vendas para uma loja, agenda e retornos para quem presta serviço, receitas e custos para alimentação. Não muda o valor."

**Tem dados sensíveis?** [U] sem efeito. Opções: Sim; Não; Não sei.
Ajuda: "Dados sensíveis são informações que podem expor pessoas ou o seu negócio: CPF, endereço e telefone de clientes, dados de saúde, salários, margem de lucro. Você não precisa me mandar nada disso para pedir o orçamento. Se tiver, eu trabalho com uma cópia em que esses campos foram trocados por exemplos, e você cola os dados reais depois, por conta própria. Isso não muda o valor, só o jeito de trabalhar."

**Para que tipo de servidor?** [U] sem efeito. Opções: Comunidade de jogo; Loja ou marca; Estudos ou grupo; Outro.
Ajuda: "Comunidade de jogo, loja, grupo de estudos: cada um pede um jeito de organizar canais e regras. Não muda o valor."

### 01 Planilha organizada (combinável)
Base R$ 100, 2 h. Prazo calculado.
Resumo: "Reúno controles soltos (caderno, mensagens, várias abas) em uma planilha única, com fórmulas que somam e conferem por você. Você abre, preenche e vê o total, sem precisar entender de Excel."
Inclui: Planilha pronta no Excel, com as colunas do seu negócio; Fórmulas e totais automáticos, explicados em uma aba de leitura rápida; Listas de escolha para evitar erro de digitação; Um dia de revisão incluído no prazo.
Notas: "Pacote a partir de R$ 100. Cada hora de trabalho a mais soma R$ 50, e as suas respostas mostram onde isso acontece."; "Ajustes depois da entrega: R$ 50 por hora."
Perguntas:
1. Tipo de negócio.
2. Você já tem uma planilha? [U]: Sim, e está em boa ordem +0; Sim, e precisa de arrumação grande +1h; Só tenho anotações ou papel +1h; Não, começo do zero +0. Ajuda: define a limpeza simples incluída nos R$ 100 (linhas vazias e repetidas, colunas padronizadas) e diz quando a arrumação soma 1 hora (R$ 50).
3. Quais controles a planilha precisa ter? [M] gratis 1, +1h cada extra. Opções: Clientes; Estoque; Vendas; Contas a pagar e receber; Agenda e retornos; Outro. Ajuda: "Controle é uma aba para acompanhar uma coisa, como clientes ou estoque. O primeiro está incluso no pacote. Cada controle a mais soma 1 hora de trabalho (R$ 50)."
4. A planilha vai ter valores em dinheiro? [U]: Sim: preços, vendas ou custos +1h; Não: só cadastros e listas +0. Ajuda: "Com preços, vendas ou custos, cada total e cada fórmula fica visível e explicada, para você conseguir conferir sozinho. Isso soma 1 hora."
5. Dados sensíveis.

### 02 Painel de dados (combinável)
Base R$ 200, 4 h. Prazo calculado.
Resumo: "Transformo os seus números em um painel com poucos gráficos e indicadores, feito para responder as perguntas do seu dia a dia: quanto vendi, quem compra mais, o que está parado."
Inclui: Painel pronto, no formato que você escolher; Indicadores e gráficos ligados à sua planilha; Filtros simples, como período e categoria; Um dia de revisão incluído no prazo.
Notas: "Excel é o padrão e abre em qualquer computador."; "Power BI: entrego o arquivo. Para compartilhar online com a equipe é preciso licença paga (Pro) da Microsoft."
Perguntas:
1. Tipo de negócio.
2. De onde vêm os seus números? [U]: Uma planilha minha +0; Exportação de um sistema +1h; Vários arquivos soltos +2h; Ainda não tenho +2h. Ajuda: "Uma planilha sua é o caminho mais curto. Exportações de sistemas e vários arquivos soltos pedem tempo para juntar e limpar, e isso soma horas. Se ainda não tiver nada organizado, a planilha organizada pode vir antes."
3. O que o painel precisa responder? [M] gratis 2, +1h cada extra. Opções: Quanto eu vendi; Quem compra mais; O que está parado; Quanto sobra de lucro; Outra. Ajuda: "Cada pergunta vira um indicador ou gráfico. As duas primeiras estão incluídas. Cada uma a mais soma 1 hora (R$ 50)."
4. Onde você quer ver o painel? [U]: Excel +0; Power BI (arquivo) +1h; Não sei +0. Ajuda: "Excel é o mais simples e abre em qualquer computador. Power BI é mais visual e soma 1 hora, mas para dividir com outras pessoas pela internet exige licença paga da Microsoft."
5. Dados sensíveis.

### 03 Automação (combinável, "a partir de")
Base R$ 300, 6 h. Prazo calculado.
Resumo: "Pego uma tarefa que você repete todo dia ou toda semana (copiar dados, juntar arquivos, mandar avisos) e faço o computador fazer por você."
Inclui: Rotina automática funcionando no seu computador ou na nuvem; Instruções simples para usar e para parar; Teste com dados de exemplo antes de entregar; Um dia de revisão incluído no prazo.
Nota: "O valor parte de R$ 300 e muda conforme as suas respostas."
Perguntas:
1. O que você quer automatizar? [M] gratis 1, +2h cada extra. Opções: Planilha que se preenche sozinha; Avisos e mensagens; Juntar dados de vários lugares; Ainda não sei. Ajuda: "Pense no que você refaz sempre do mesmo jeito. A primeira tarefa está inclusa. Cada tarefa a mais soma 2 horas (R$ 100). Se não souber descrever, conte pelo WhatsApp e eu ajudo."
2. Onde isso acontece hoje? [U]: No Excel +0; Em um sistema +2h; No WhatsApp ou e-mail +2h; Em vários lugares +3h. Ajuda: "Dentro do Excel é o mais simples. Quando a tarefa envolve um sistema, o WhatsApp ou vários lugares, é preciso ligar as peças, e isso soma horas."
3. Dados sensíveis.

### 04 Landing page (combinável)
Base R$ 300, 5 h. Prazo calculado.
Resumo: "Uma página simples e rápida que apresenta o seu negócio e leva a pessoa a chamar você, de preferência pelo WhatsApp."
Inclui: Página responsiva, pensada primeiro para o celular; Botão direto para o seu WhatsApp; Textos organizados com você na conversa; Um dia de revisão incluído no prazo.
Nota: "Domínio (o endereço da página) e hospedagem podem ter custo próprio. Eu explico as opções antes de você decidir."
Perguntas:
1. Tipo de negócio.
2. O que a página precisa fazer? [M] gratis 2, +1h cada extra. Opções: Receber contatos no WhatsApp; Mostrar serviços e preços; Mostrar fotos e trabalhos; Receber agendamentos. Ajuda: "A página funciona melhor com poucos objetivos. Os dois primeiros estão incluídos. Cada um a mais soma 1 hora (R$ 50)."
3. Você já tem logo e fotos? [U]: Logo e fotos +0; Só o logo +0; Ainda não tenho +1h. Ajuda: "Fotos reais do seu trabalho convencem mais do que imagem de banco. Sem material nenhum, eu preciso montar um visual simples com você, e isso soma 1 hora."
4. Quantas páginas? [U]: Uma página só +0; Até 3 páginas +3h. Ajuda: "Uma página só rola de cima para baixo, com tudo. Até 3 páginas separa, por exemplo, serviços e contato, e soma 3 horas."

### 05 Aulas de Excel e Power BI (fora do combo)
Preço por formato. Prazo: começa quando você quiser.
Resumo: "Aulas individuais por videochamada, com os seus próprios exemplos. Você aprende o que precisa para o seu trabalho, sem curso longo."
Inclui: Aula ao vivo por videochamada; Exercícios com os seus dados, quando você quiser; Resumo do que foi visto, por escrito; Horário combinado conforme a sua agenda.
Nota: "Aula avulsa: R$ 50 por hora. Pacote de 4 aulas: R$ 180."
Perguntas:
1. Como prefere pagar? [U] (muda o valor): Aula avulsa; Pacote de 4 aulas. Ajuda: "A aula avulsa custa R$ 50 por hora. O pacote de 4 aulas sai por R$ 180 e serve bem para quem quer acompanhamento."
2. Qual é o seu nível? [U] sem efeito: Nunca usei; Uso o básico; Quero avançar. Ajuda: "Sem pressão: o nível só me diz onde começar. Não muda o valor."
3. Qual o foco? [M] sem efeito: Excel; Power BI; Fórmulas e tabelas; Gráficos. Ajuda: "Pode marcar mais de um. Se estiver em dúvida, comece pelo Excel, que é a base para o Power BI. Não muda o valor."

### 06 Bot de Discord essencial (fora do combo, horas provisórias)
Base R$ 300, mensalidade. Prazo: a combinar.
Resumo: "Um bot de Discord com o essencial para o seu servidor: boas-vindas, regras, anúncios e atendimento por tickets."
Inclui: Bot configurado no seu servidor; Boas-vindas, anúncios e atendimento por tickets; Instruções para a sua equipe usar; Suporte para ajustes pequenos no primeiro mês.
Notas: "Mensalidade de 10% do valor de criação mais a hospedagem, cobrada à parte."; "O desconto de piloto vale só sobre a criação."
Perguntas:
1. Servidor.
2. O que o bot precisa fazer? [M] gratis 2, +1h cada extra. Opções: Boas-vindas e regras; Tickets de suporte; Anúncios; Cargos por reação. Ajuda: "Ticket é um canal privado que o bot abre para atender uma pessoa. Cargo por reação é quando a pessoa ganha um cargo ao clicar em um emoji. As duas primeiras funções estão incluídas. Cada uma a mais soma 1 hora (R$ 50)."
3. Quem hospeda o bot? [U] sem efeito: O Marcelo hospeda; Eu mesmo hospedo; Não sei. Ajuda: "Hospedar é manter o bot ligado o tempo todo em um servidor. Eu posso cuidar disso (por isso a mensalidade) ou você hospeda por conta própria. Não muda o valor de criação."

### 07 Bot de Discord com IA (fora do combo, "a partir de", horas provisórias)
Base R$ 500, mensalidade. Prazo: a combinar.
Resumo: "Tudo do bot essencial, mais respostas automáticas feitas por inteligência artificial, com regras que você define."
Inclui: Tudo do bot essencial; Respostas com IA, nos canais que você escolher; Limites e regras para o que a IA pode ou não responder; Instruções para acompanhar o uso.
Notas: "O uso da IA é cobrado direto na sua conta do provedor, não por mim."; "Mensalidade de 10% do valor de criação mais a hospedagem."
Perguntas:
1. Servidor.
2. O que a IA deve responder? [M] gratis 1, +2h cada extra. Opções: Dúvidas frequentes; Conversa livre; Ajuda com regras; Ainda não sei. Ajuda: "A IA responde melhor quando o assunto é delimitado. O primeiro papel está incluso. Cada um a mais soma 2 horas (R$ 100)."
3. Você já tem conta em algum provedor de IA? [U]: Sim +0; Não, preciso de ajuda +1h; Não sei o que é +1h. Ajuda: "Provedor de IA é a empresa que fornece o modelo (por exemplo, OpenAI ou Anthropic). Você abre uma conta, e o uso aparece na sua fatura. Se nunca fez isso, eu explico o caminho, e isso soma 1 hora."

### 08 Sistema sob medida (fora do combo)
Sob consulta. Prazo combinado na proposta.
Resumo: "Quando a necessidade é maior: um sistema pensado para o seu processo. Começamos por uma conversa, e eu devolvo uma proposta com escopo, prazo e valor."
Inclui: Conversa inicial para entender o processo; Proposta por escrito antes de começar; Entrega em etapas, para você acompanhar; Valor combinado de acordo com o tamanho.
Nota: "Projetos grandes entram em fila e dependem da minha agenda."
Perguntas (sem efeito no valor):
1. O que você precisa resolver? [M]: Clientes e pedidos; Agenda e reservas; Área do cliente; Outra. Ajuda: "Descreva o problema, não a solução. Pode marcar mais de um. O melhor jeito costuma aparecer na conversa, e o valor sai na proposta."
2. Para quando você precisa? [U]: Sem pressa; Em um mês; Com urgência. Ajuda: "Isso não é promessa. Serve para eu saber se consigo encaixar o trabalho."

## 5. Comportamento da interface

- Estilo: cobalto sobre off-white frio (claro) e azul-noite (escuro, padrão), um só acento. Space Grotesk (títulos e texto) e Space Mono (preços, horas, prazos). Sem degradê, vidro, blur, emoji ou cartões com sombra. Linhas finas e cantos quase retos. Barra de acento 3px x 48px. Animações revela, revela-titulo e revela-barra existentes; respeite `prefers-reduced-motion`.
- Desktop (a partir de 1024 px): três áreas lado a lado: lista de serviços (320 a 380 px), painel do serviço (perguntas e estimativa) e carrinho (cerca de 340 a 420 px). Ao quebrar linha, o carrinho desce.
- Celular (mobile primeiro): uma tela por vez. Lista, serviço e carrinho. Cabeçalho com "← Serviços" e botão "Carrinho (n)". Na tela do serviço, barra fixa embaixo com o preço e "Adicionar" ou "Tirar".
- Lista: número em mono, nome, resumo curto e preço curto. Item selecionado com fundo "realce" e faixa de 3px de acento à esquerda. Itens no carrinho mostram "no carrinho". Card "Precisa de mais de uma coisa?" com o botão "Montar combo".
- Perguntas: escolha única = radios nativos; múltipla = checkboxes nativos. Escondidos visualmente, com estados via `has-checked` e `has-focus-visible`. Alvo de toque mínimo (`min-h-alvo`). "O que é isso?" é um botão com `aria-expanded`.
- Estimativa do serviço: linhas "Base do pacote" e "+ R$ X" por resposta que somou; preço grande em mono; com piloto, o preço de tabela riscado e o novo na cor de destaque, com a nota do piloto; horas, prazo e mensalidade em lista de definição. Preço dentro de `aria-live="polite"`. Botão cheio "Adicionar ao carrinho" ou "No carrinho (tirar)".
- Carrinho: título, itens, soma, desconto, prazo, mensalidade, total. Depois "Como você prefere fechar?" com: (a) formulário "Fechar o pedido pelo site" (nome, WhatsApp, botão); (b) link "Chamar o Marcelo no WhatsApp" com o carrinho na mensagem. Carrinho vazio: o botão de fechar fica desabilitado (`aria-disabled`) e o WhatsApp abre com mensagem genérica.
- Privacidade: "Seu nome e WhatsApp são usados só para responder este pedido. Eu confirmo por WhatsApp e combinamos o Pix."

## 6. Integração

- "Fechar pedido pelo site" usa `enviarContato` (EmailJS), origem `negocios-carrinho`, com preferência WhatsApp. Mantenha isca e tempo mínimo. Parâmetros enviados além dos atuais: `pedido` (lista de serviços com as respostas principais e o valor de cada) e `estimativa` (total). Se o envio falhar ou o EmailJS não estiver configurado, mostre o plano B (WhatsApp e e-mail) como hoje.
- Link do WhatsApp: `https://wa.me/<site.whatsapp>?text=<mensagem codificada>`; a mensagem lista os serviços, os valores e o total estimado.
- Template do EmailJS precisa de linhas novas: `Pedido: {{pedido}}` e `Total estimado: {{estimativa}}` (o Marcelo ajusta no painel).

## 7. Pendências de decisão do Marcelo (registrar em docs/DECISOES.md)

- [ ] Horas extras por resposta (valores acima são PROPOSTAS).
- [ ] Combo: 10% com 2 serviços e 15% com 3 ou mais.
- [ ] Combo e piloto: regra do "maior" (não somam).
- [ ] Horas base dos bots (hoje provisórias): preço por respostas já varia, prazo fica "a combinar".
- [ ] "Ainda não tenho" no painel soma 2 h: manter ou sugerir a planilha antes.
- [ ] Desconto do plano de 6 meses dos bots.

## 8. Testes

Cubra em Vitest: preço base sem respostas; escolha única com horas; múltipla com `gratis`; aulas por formato; prazo calculado versus "a combinar" nos bots; carrinho (soma, combo com 2 e 3 combináveis, piloto versus combo, itens fora do combo, mensalidade); texto da mensagem do WhatsApp; vazio.
