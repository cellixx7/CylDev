# SEO e aparecer no Google

## 25/11/2026: o site não aparece ao buscar "cyldev"

**Diagnóstico (lendo o código; o site no ar não pôde ser aberto daqui):** o técnico já estava bem feito: `lang="pt-BR"`, `canonical` e Open Graph em todas as páginas públicas, `robots.txt` e `sitemap.xml` gerados no build (com `lastmod`), `noindex` só em `obrigado` e `404`, um só `h1`, JSON-LD `ProfessionalService`, conteúdo legível sem JavaScript. Nenhum bloqueio de indexação.

**O que faltava:**

1. A palavra "CylDev" quase não aparecia na home (título, descrição e `h1` falavam só de "Marcelo Vaz"). Corrigido: título, descrição, `alternateName` e `WebSite`.
2. Ninguém avisou o Google que o site existe: não há cadastro no Search Console, e o endereço `*.netlify.app` quase não tem links de fora. Isso é o principal motivo, e só o Marcelo resolve (lista abaixo).
3. Poucas palavras de busca no texto de apresentação ("ajustar planilha", "site", "landing page"). Título e descrição agora usam as três; o corpo da página não foi reescrito.

**Expectativa honesta:** depois de pedir a indexação, a home costuma entrar em dias ou poucas semanas. Aparecer em "cyldev" é realista; termos como "criar site", "landing page" e "saas" têm milhares de concorrentes grandes e, com um endereço `netlify.app` novo, não vão ranquear no curto prazo. "SaaS" não é oferecido hoje em `servicos.ts` (o mais próximo é "Sistema sob medida"), então não foi colocado nos textos.

**Passos manuais (só o Marcelo):**

1. Entrar em <https://search.google.com/search-console>, "Adicionar propriedade", tipo "Prefixo do URL", `https://cyldev.netlify.app/`. Verificar pela tag HTML: copie o `<meta name="google-site-verification" content="...">` e mande para o Claude colocar no `index.html` (ou coloque você mesmo), publique e clique em "Verificar".
2. Em "Sitemaps", enviar `sitemap.xml`.
3. Em "Inspeção de URL", colar `https://cyldev.netlify.app/` e clicar em "Solicitar indexação". Repetir para `/como-funciona/` e `/comunidade/`.
4. Perfil do GitHub (`github.com/cellixx7`): colocar o site no campo "Website" e na bio; no repositório `cyldev`, preencher "About" com o endereço e tópicos. É o link gratuito mais fácil.
5. LinkedIn: colocar o site em "Informações de contato" e uma publicação de apresentação com o link.
6. Google Business Profile: só vale se atender clientes de uma área (Brasília/DF); precisa de verificação. Pode ser feito como negócio "de área de atendimento", sem mostrar endereço.
7. Repositórios `CylBot` e `CylSense` (e o Discord): colocar o link do site no README e na descrição. Links de repositórios próprios ajudam o Google a achar o site.
8. Quando houver perfis novos, acrescentar o endereço em `site.perfis` (`src/content/site.ts`); eles entram no JSON-LD sozinhos.
9. Depois de 1 a 2 semanas, conferir em Search Console > Páginas se a home está "Indexada". Para testar já: buscar `site:cyldev.netlify.app` no Google.
10. Domínio próprio (ex.: `cyldev.com.br`, cerca de R$ 40 por ano) fica para depois; ao trocar, mudar `urlPadrao` em `site.ts` e a variável de URL da Netlify, e reenviar o sitemap.

**Versão em inglês:** não existe. Se vier, precisa de `hreflang` e de URLs separadas (ex.: `/en/`); nada disso foi preparado agora.
