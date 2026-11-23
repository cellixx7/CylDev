# Planilha de exemplo (dados fictícios)

- `planilha-bagunçada.xlsx`: o "antes". Loja fictícia (camisetas, bonés, canecas, casacos), 94 vendas em 3 meses, 12 clientes.
- `planilha-arrumada.csv`: o "depois", já limpo. Colunas: data, cliente, categoria, produto, qtd, valor_unitario, valor_total, forma_pagamento, situacao. Total real: R$ 7.586 (jan 2.704, fev 2.647, mar 2.235); 17 vendas fiadas.

## Bagunças colocadas de propósito (para você arrumar no vídeo/demonstração)

| Onde | O que está errado |
|---|---|
| `Planilha1` (janeiro) | título mesclado em amarelo; cabeçalho na linha 3; data em 6 formatos (data real, "05/01", "5/1/26", "05-01-2026", "5 jan"), coluna estreita mostrando `###`; mesmo cliente escrito de 4 jeitos; produto livre ("camisa preta p", "CAMISETA PRETA P"); quantidade "2un", "dois", "3"; valor como texto ("R$ 45,00", "45,00", "84 (2x42)"); linha "TOTAL ATÉ AGORA" no meio com valor digitado; linhas em branco; fiado só pela cor vermelha e por "FIADO"/"fiado!!" na Obs; SOMA no fim que não cobre tudo; fontes e cores misturadas |
| `Fev` | outra ordem de colunas; Total é fórmula, mas em algumas linhas foi digitado por cima; uma célula com `#REF!`; "Pagou?" com "sim", "SIM", "s", "ok", "pix"; soma que perde as últimas linhas |
| `Fev (2)` | cópia parcial de `Fev` (linhas duplicadas) com bilhete "nao apagar" |
| `MARÇO NOVO` | tabela começa na coluna B, cabeçalho na linha 5; "Dia" ora número, ora "dd/mm"; subtotais soltos no meio; recados nas laterais ("cobrar a Igreja"); comentário de célula; situação com ✔/ok/PAGO |
| `Contas` | estoque e gastos soltos, com "?" e "uns 20", valores como texto |

Honestidade: todos os nomes, valores e vendas são inventados. No site, o exemplo deve levar o rótulo "dados fictícios".
