import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/base.css";
import "../../styles/comunidade.css";
import { site } from "../../content/site";
import { servicosDa } from "../../content/servicos";
import { mensalidadeBots, parametros } from "../../content/orcamento";
import { comunidade as t, piloto, pilotoNota } from "../../content/textos";
import { Cabecalho } from "../../shared/components/Cabecalho";
import { Catalogo } from "../../shared/components/Catalogo";
import { Contatos } from "../../shared/components/Contatos";
import { Rodape } from "../../shared/components/Rodape";
import { brl } from "../../shared/lib/formato";
import { descontoPilotoAtual } from "../../shared/lib/orcamento";
import { linkContato } from "../../shared/lib/whatsapp";

const desconto = descontoPilotoAtual();
const pct = (f: number) => Math.round(f * 100);

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
          {/* Vídeo do CylBot: <video preload="none" poster="..."> quando o Marcelo gravar. */}
          {site.repositorioCylBot && (
            <p>
              <a className="botao" href={site.repositorioCylBot} target="_blank" rel="noopener">
                {t.cylbot.repositorio}
              </a>
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
          {desconto && (
            <p className="piloto">
              {piloto(desconto.restam, desconto.percentual, desconto.percentual === 10)}
              <span className="piloto__nota">{pilotoNota}</span>
            </p>
          )}
          <Catalogo
            servicos={servicosDa("comunidade")}
            origem="comunidade"
            textoPedir={t.bots.pedir}
          />
          <p className="entregas__extra">
            {t.bots.mensalidade(
              pct(mensalidadeBots.fracaoDaCriacao),
              mensalidadeBots.mesesPlanoAdiantado,
              mensalidadeBots.descontoPlanoAdiantado === null ? null : pct(mensalidadeBots.descontoPlanoAdiantado),
            )}
          </p>
          <p className="entregas__extra">{t.bots.funcionalidadeNova(brl(parametros.valorHoraAvulsa))}</p>
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
