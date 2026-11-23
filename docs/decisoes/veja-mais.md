# Veja mais: planilha de exemplo e painel interativo

## Dados locais com `?raw`, sem chamada externa (23/11/2026)

A seção "Veja mais" da home mostra uma loja fictícia em três cards: a planilha como chega (5 abas bagunçadas), a mesma planilha arrumada e um painel interativo calculado a partir dela.

- Os CSV ficam em `src/content/exemplo-planilha/` e entram com `import ... ?raw`, dentro de um módulo (`veja-mais/dados.ts`) que só é carregado por `import()` quando a seção chega a 400 px da tela (ou quando alguém abre um card). O JavaScript inicial da home não engorda com os CSV.
- Não há `fetch`, nenhum domínio novo e nenhuma mudança de CSP. Nada é coletado nem enviado, então Termos e Privacidade não mudam.
- Todo número do painel é calculado a partir do CSV arrumado (`shared/lib/painelPlanilha.ts`, com testes que fixam os totais: 94 vendas, 12 clientes, R$ 7.586, fiado R$ 1.368).
- O texto "O que foi arrumado" só lista o que está de fato no arquivo (datas num formato, nomes padronizados, valores numéricos, uma linha por venda, sem duplicados, fiado em coluna própria, categoria por produto, total = quantidade × valor unitário). O CSV não carrega fórmulas, então não se afirma "totais por fórmula".
- Ponto de extensão: `exemploPlanilha.urlCsvPublicado` (em `src/content/exemploPlanilha.ts`) está `null`. Se um dia apontar para um CSV publicado (por exemplo, "Publicar na web" do Google Sheets), o `fetch` entra em `dados.ts`, e antes é preciso rever a CSP e a Privacidade (haveria uma requisição a um terceiro). Não foi implementado.

## Filtro cruzado (23/11/2026)

Clicar numa barra, fatia ou ponto liga o filtro daquele valor em todos os gráficos e indicadores. Cada gráfico calcula os seus dados sem o filtro da própria dimensão, para que as demais barras apareçam apagadas e a seleção possa ser trocada (como no Power BI). O gráfico diário filtra por dia; o mensal, por mês.
