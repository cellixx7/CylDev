import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/base.css";
import "../../styles/comunidade.css";
import { site } from "../../content/site";
import { servicosDa } from "../../content/servicos";
import { comunidade as t, negocios } from "../../content/textos";
import { Cabecalho } from "../../shared/components/Cabecalho";
import { Catalogo } from "../../shared/components/Catalogo";
import { Contatos } from "../../shared/components/Contatos";
import { Rodape } from "../../shared/components/Rodape";
import { linkContato } from "../../shared/lib/whatsapp";

function Comunidade() {
  return (
    <>
      <Cabecalho area="comunidade" temaPadrao="escuro" marca={site.marcaComunidade} links={t.nav} />
      <main id="conteudo">
        <section className="apresentacao apresentacao--comunidade">
          <h1 className="apresentacao__titulo">{t.apresentacao.titulo}</h1>
          <div className="apresentacao__lado">
            <p className="apresentacao__texto">{t.apresentacao.texto}</p>
            <p className="apresentacao__acoes">
              <a className="botao botao--cheio" href={linkContato("comunidade")} target="_blank" rel="noopener">
                {t.apresentacao.acao}
              </a>
            </p>
          </div>
        </section>

        <section className="projeto" id="cylbot" aria-labelledby="cylbot-titulo">
          <h2 id="cylbot-titulo">{t.cylbot.titulo}</h2>
          <p>{t.cylbot.texto}</p>
          {/* Espaço do vídeo: <video preload="none" poster="..."> quando o Marcelo gravar. */}
          <div className="projeto__video-pendente">{t.cylbot.videoPendente}</div>
          {site.repositorioCylBot && (
            <p>
              <a href={site.repositorioCylBot}>Código no GitHub</a>
            </p>
          )}
        </section>

        <section className="projeto projeto--cylsense" id="cylsense" aria-labelledby="cylsense-titulo">
          <h2 id="cylsense-titulo">
            {t.cylsense.titulo} <span className="selo-status">{t.cylsense.status}</span>
          </h2>
          <p>{t.cylsense.texto}</p>
        </section>

        <section className="entregas" id="bots" aria-labelledby="bots-titulo">
          <h2 id="bots-titulo">{t.bots.titulo}</h2>
          <Catalogo
            servicos={servicosDa("comunidade")}
            origem="comunidade"
            textoPedir={t.bots.pedir}
            textoInclui={negocios.entregas.inclui}
            textoPrazo={negocios.entregas.prazo}
          />
        </section>

        <section className="contato" id="contato" aria-labelledby="contato-titulo">
          <h2 id="contato-titulo">{t.contato.titulo}</h2>
          <p>{t.contato.intro}</p>
          <Contatos origem="comunidade-contato" comFormulario={false} />
        </section>
      </main>
      <Rodape ponte={{ ...t.ponte, href: "/negocios/" }}>
        <p className="rodape__aviso">{t.avisoRiot}</p>
      </Rodape>
    </>
  );
}

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <Comunidade />
  </StrictMode>,
);
