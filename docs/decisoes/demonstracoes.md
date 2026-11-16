# Demonstrações e painel de exemplo

Demos animadas de Como funciona e o painel de exemplo da home. Seções em ordem de data; a mais nova fica no fim.

## Bloco 6: demonstração animada da planilha (piloto, 11/11/2026)

- **Onde:** dentro do bloco `#planilhas` de Como funciona (id que já existia), abaixo do "antes e depois" estático, que ficou como estava. Componente em `src/pages/como-funciona/DemoPlanilha.tsx`; texto e dados fictícios em `src/content/demoPlanilha.ts`; máquina de passos pura em `src/shared/lib/demoPassos.ts` (testada). Só React e CSS, sem dependência nova.
- **História:** tabela bagunçada → padroniza datas → padroniza nomes → remove repetida e vazia → separa em colunas → confere o total. Rótulo fixo "Exemplo com dados fictícios". Os totais (R$ 185 com a linha repetida, R$ 145 no final) são só a soma dos dados fictícios, não resultado de cliente.
- **Controles:** "Reproduzir" vira "Pausar" enquanto toca; "Ver resultado" e "Recomeçar". Botões nativos de 44 px. "Ver resultado" no final usa `aria-disabled` (não perde o foco). Começa parada: o visitante decide tocar. Sem loop: ao chegar ao fim, para; "Reproduzir" no final recomeça.
- **Pausa automática:** o relógio só anda com a aba em primeiro plano e a seção na tela (`visibilitychange` + `IntersectionObserver`); ao voltar, continua do mesmo passo.
- **Movimento reduzido:** `prefers-reduced-motion: reduce` troca a animação por antes e depois lado a lado (empilhados no celular) e a lista dos passos, sem controles. A troca acompanha a preferência do sistema em tempo real.
- **Acessibilidade:** cada passo aparece em texto visível e na lista de passos (`aria-current="step"`). Não há região `aria-live` que fale a cada passo; só a frase de resultado tem `role="status"`, uma vez, ao chegar ao fim.
- **Animação:** só `opacity` e `transform` (`@keyframes demo-entra` em `tema-negocios.css`, também restrito a `no-preference`). As linhas removidas somem de uma vez (animar a altura exigiria layout).
- **Modal:** a aba Detalhes do serviço `planilha` ganhou o link "Ver como funciona" para `/como-funciona/#planilhas`. O mapa `servicosComDemo` em `demoPlanilha.ts` controla quais serviços têm o link; o card não mudou.
- **Testes:** `src/shared/lib/demoPassos.test.ts` (Vitest) e `e2e/demo.spec.ts` (reproduzir/pausar, saída da tela, link do modal, 360 e 390 px, movimento reduzido).
- **Não validado:** aparência em celular de verdade e em outros navegadores, leitor de tela, e se o ritmo (2,2 s por passo) agrada; falta o olhar do Marcelo no navegador antes de replicar para painel e automação.

## Bloco 6b: demonstrações do painel e da automação (11/11/2026)

- **Comum extraído, planilha igual:** `shared/lib/demoMaquina.ts` (máquina de passos), `content/demos.ts` (textos comuns e o mapa `servicosComDemo`) e `pages/como-funciona/DemoMoldura.tsx` (controles, relógio, pausa por aba/tela, versão sem movimento, lista de passos). A planilha passou a usar a moldura; os testes dela seguem os mesmos (só o import de `servicosComDemo` mudou de lugar). Novo `demo-<id>` no `data-testid` de cada uma.
- **Ids:** sem ids novos. `#paineis` e `#automacao` já existiam em Como funciona; as demonstrações entram dentro deles, abaixo do exemplo estático, que ficou.
- **Painel (`demoPainel.ts`, `DemoPainel.tsx`):** tabela de vendas por produto (Out, Nov, Dez, em R$ mil) alimenta o total, o produto que mais vende, o que menos sai e as barras. O filtro por mês (botões nativos) refaz tudo; no último passo (e na versão sem movimento) a pessoa usa o filtro sozinha. Coerência com o painel da home: os totais de Out, Nov e Dez (20, 20, 30) são os de `negocios.apresentacao.painel.meses`, conferido por teste. Não reaproveitei os dados anuais da home (não há quebra por produto e mês); a home segue sem mudança. Em novembro o líder muda (Bonés) para mostrar o efeito do filtro. Os números são fictícios e rotulados.
- **Automação (`demoAutomacao.ts`, `DemoAutomacao.tsx`):** três arquivos de vendas fictícios são juntados, filtrados (canceladas saem) e somados (R$ 175); no último passo o botão "Atualizar relatório" chega ao mesmo resultado. O botão é só ilustração (`aria-hidden`, legenda diz que não é clicável). Sem tempo, economia ou percentual (teste confere) e com o aviso de que nem toda tarefa dá para automatizar.
- **Modal:** `servicosComDemo` agora liga planilha, painel e automação ao link "Ver como funciona". Os cards seguem com 3 botões (teste confere).
- **Testes:** `demoPainel.test.ts`, `demoAutomacao.test.ts`; `e2e/demo.spec.ts` virou uma bateria por demonstração (controles, pausa fora da tela, link do modal, 360 e 390 px, movimento reduzido) mais cenários do filtro do painel e do clique da automação.
- **Não validado:** celular de verdade, Safari/Firefox, leitor de tela, o ritmo de 2,2 s nas duas novas. Conferi só por captura em 390 px (escuro no painel, claro na automação).

## Painel de exemplo da home: roteiro com foco (12/11/2026)

- **Entrada uma vez, roteiro em loop:** o painel entra animado só na primeira vez que aparece na tela (no carregamento, no desktop; ao rolar até ele, no celular). Depois, a cada ~3,8 s, um item ganha o foco (ao fim das três etapas há 5 s de descanso, sem nenhum filtro, e o roteiro recomeça): Dezembro (mês que mais vendeu), Camisetas (categoria) e Sudeste (região). O gráfico do item fica inteiro com ele em destaque; os outros dois e o indicador "Vendas no ano" passam a mostrar só as vendas dele ("só Dez", "só Camisetas"...). Os outros três indicadores esmaecem, pois não existem por mês, categoria ou região.
- **Números de exemplo novos:** para os recortes baterem, `textos.ts` ganhou a matriz mês x categoria (`vendasMesCategoria`, R$ mil) e um peso categoria x região (`afinidadeRegiao`); `src/shared/lib/painelVendas.ts` ajusta o cruzamento categoria x região para fechar com os totais já mostrados. Tudo continua rotulado como exemplo, e `painelVendas.test.ts` confere que meses, categorias e regiões fecham com o ano (214 mil). Out a Dez usam os mesmos produtos da demonstração de Como funciona (por isso "Outros" é zero nesses meses).
- **Movimento reduzido:** sem entrada animada e sem roteiro; o painel fica parado com os números do ano.
