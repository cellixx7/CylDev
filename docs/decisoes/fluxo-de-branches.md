# Fluxo de branches e créditos da Netlify

Decisão de 23/11/2026. Os créditos do plano acabaram no ciclo; cada build da Netlify (produção, deploy preview e branch deploy) gasta crédito. O GitHub Actions não gasta.

## Fluxo

```
commit_HH-MM_DD-MM_VXN  --PR-->  develop  --PR, em lote, versão fechada-->  main
```

- PRs de trabalho apontam para `develop`.
- `develop` só vai para a `main` quando a versão estiver fechada (uma vez por entrega, não por PR). Esse merge é o único que gera build na Netlify.
- O CI (`verificar`: typecheck, testes, build e e2e) roda em todo PR para `develop` ou `main` e em todo push nelas. Não gasta crédito da Netlify.

## O que o repositório faz

`netlify.toml` tem `ignore = '[ "$CONTEXT" != "production" ]'`: fora do contexto de produção o comando sai com 0 e a Netlify pula o build. Deploy preview e branch deploy ficam sem build, mesmo que estejam ligados no painel. Obs.: o commit status da Netlify nos PRs aparece como "skipped".

Para ver a página de um PR, rode `npm run build && npm run preview` (ou `npm run dev`); o e2e do CI já exercita o build.

## O que depende do Marcelo (painel da Netlify, não feito pelo repositório)

1. Site settings > Build & deploy > Continuous deployment > Branches and deploy contexts: Production branch = `main`; Deploy previews = "Any pull request..." trocar para **None**; Branch deploys = **None**.
2. Conferir em Billing a data em que o ciclo renova e quanto resta dos 30 créditos operacionais.
3. Retomar os deploys de produção (pausados) só quando a versão estiver fechada, para gastar um build.
4. No GitHub: criar a proteção de `develop` (exigir o check `verificar`), como a da `main`. Não foi alterada por este PR.

## Aviso

Uma build é pulada só se o `ignore` estiver na branch que a Netlify lê. PRs e branches antigos (ex.: `commit_*` já abertos) que ainda não têm esta mudança continuam com preview até receberem `develop` atualizada ou terem o preview desligado no painel (passo 1).
