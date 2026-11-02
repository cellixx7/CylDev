# Decisões técnicas e pendências

## V1 (02/11/2026)

- **Stack:** Vite multi-page + React + TypeScript, CSS puro com BEM. Produção depende só de `react` e `react-dom`.
- **Páginas:** `index.html`, `negocios/`, `comunidade/`, `obrigado/`, `404.html`, declaradas em `vite.config.ts`.
- **Open Graph:** o build troca `__URL__` nos HTML pela variável `URL` da Netlify (ou `site.urlPadrao`). Imagens em `public/og-*-v1.png`; ao trocar a imagem, mude o sufixo (`-v2`) por causa do cache do WhatsApp.
- **Tema:** `data-theme` no `<html>`, um script inline aplica a escolha salva antes da pintura. Chave por área (`tema-negocios`, `tema-comunidade`, `tema-home`), leitura e escrita em `try/catch`.
- **Formulário:** Netlify Forms. A versão React posta para `/obrigado/`; um gêmeo estático escondido em `negocios/index.html` existe para a Netlify detectar o formulário no deploy.
- **Fontes:** a V1 usa pilhas de fontes do sistema (serifada nos títulos, sans no texto, mono nos preços). As fontes definitivas entram com a identidade visual (V4), carregadas localmente com `font-display: swap`.
- **Catálogo por área:** pacotes de Discord aparecem em `/comunidade/`; os demais em `/negocios/`. Campo `area` em `servicos.ts`.
- **Prazo calculado:** `ceil(horas / horasPorDiaUtil) + diasDeRevisao`. Pela fórmula, a "Planilha organizada" (2,5 h) dá **3 dias úteis**, não os 2 da tabela do briefing. Confirmar com o Marcelo: mudar as horas para 2 ou aceitar 3 dias.
- **Demos:** ficam para a V2 (sem demo, não há dado fictício exposto na V1).

## Pendências do Marcelo

- [ ] Conferir o termo de estágio com o supervisor **antes do merge na main** (`mostrarMinisterio: true` em `src/content/site.ts`).
- [ ] Uniser segue oculto (`mostrarUniser: false`).
- [ ] Confirmar preços e horas em `src/content/servicos.ts` e `src/content/orcamento.ts`.
- [ ] Escolher o nome do site na Netlify e atualizar `site.urlPadrao`.
- [ ] Revisar `docs/COPY.md`.
- [ ] Foto (opcional): colocar em `public/` e apontar `site.foto`.
- [ ] Vídeo do CylBot e link do repositório (`site.repositorioCylBot`).
