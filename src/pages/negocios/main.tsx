import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/base.css";
import "../../styles/negocios.css";
import { site } from "../../content/site";
import { servicosDa } from "../../content/servicos";
import { negocios as t } from "../../content/textos";
import { vagasPiloto, vagasPilotoTotal } from "../../content/orcamento";
import { Avatar } from "../../shared/components/Avatar";
import { Cabecalho } from "../../shared/components/Cabecalho";
import { Catalogo } from "../../shared/components/Catalogo";
import { Contatos } from "../../shared/components/Contatos";
import { Rodape } from "../../shared/components/Rodape";
import { linkContato } from "../../shared/lib/whatsapp";

function Negocios() {
  return (
    <>
      <Cabecalho area="negocios" temaPadrao="claro" marca={site.nome} links={t.nav} />
      <main id="conteudo">
        <section className="apresentacao">
          <h1 className="apresentacao__titulo">{t.apresentacao.titulo}</h1>
          <div className="apresentacao__lado">
            <p className="apresentacao__texto">{t.apresentacao.texto}</p>
            <p className="apresentacao__acoes">
              <a className="botao botao--cheio" href={linkContato("negocios")} target="_blank" rel="noopener">
                {t.apresentacao.acao}
              </a>
              <a className="apresentacao__link" href="#entregas">
                {t.apresentacao.acaoSecundaria}
              </a>
            </p>
          </div>
        </section>

        <section className="entregas" id="entregas" aria-labelledby="entregas-titulo">
          <h2 id="entregas-titulo">{t.entregas.titulo}</h2>
          <p className="entregas__intro">{t.entregas.intro}</p>
          {vagasPiloto > 0 && <p className="piloto">{t.piloto(vagasPiloto, vagasPilotoTotal)}</p>}
          <Catalogo
            servicos={servicosDa("negocios")}
            origem="negocios"
            textoPedir={t.entregas.pedir}
            textoInclui={t.entregas.inclui}
            textoPrazo={t.entregas.prazo}
          />
        </section>

        <section className="como" id="como-funciona" aria-labelledby="como-titulo">
          <h2 id="como-titulo">{t.comoFunciona.titulo}</h2>
          <ol className="como__passos">
            {t.comoFunciona.passos.map((p) => (
              <li key={p.titulo} className="como__passo">
                <strong>{p.titulo}.</strong> {p.texto}
              </li>
            ))}
          </ol>
          <p className="como__pagamento">{t.comoFunciona.pagamento}</p>
        </section>

        <section className="sobre" id="sobre" aria-labelledby="sobre-titulo">
          <Avatar nome={site.nome} foto={site.foto} />
          <div>
            <h2 id="sobre-titulo">{t.sobre.titulo}</h2>
            {t.sobre.paragrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {site.mostrarMinisterio && <p>{t.sobre.ministerio}</p>}
            {site.mostrarUniser && <p>{t.sobre.uniser}</p>}
          </div>
        </section>

        <section className="contato" id="contato" aria-labelledby="contato-titulo">
          <h2 id="contato-titulo">{t.contato.titulo}</h2>
          <p>{t.contato.intro}</p>
          <Contatos origem="negocios-contato" />
        </section>
      </main>
      <Rodape ponte={{ ...t.ponte, href: "/comunidade/" }} />
    </>
  );
}

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <Negocios />
  </StrictMode>,
);
