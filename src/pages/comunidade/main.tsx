import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/tailwind.css";
import "../../styles/tema-comunidade.css";
import { site } from "../../content/site";
import { servicosDa } from "../../content/servicos";
import { mensalidadeBots, parametros } from "../../content/orcamento";
import { comunidade as t, piloto, pilotoNota } from "../../content/textos";
import { Cabecalho } from "../../shared/components/Cabecalho";
import { Catalogo } from "../../shared/components/Catalogo";
import { Contatos } from "../../shared/components/Contatos";
import { Rodape } from "../../shared/components/Rodape";
import { botao, botaoCheio } from "../../shared/estilos";
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
        <section className="pt-14 pb-20 tab:grid tab:grid-cols-[7fr_4fr] tab:items-end tab:gap-14 tab:pt-20">
          <h1 className="max-w-[20ch] font-mono text-[clamp(2rem,7.5vw,3.6rem)] tracking-[-0.02em]">{t.apresentacao.titulo}</h1>
          <div className="tab:pb-2">
            <p className="text-[1.1rem] text-texto-suave">{t.apresentacao.texto}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a className={botaoCheio} href={linkContato("comunidade")} target="_blank" rel="noopener">
                {t.apresentacao.acao}
              </a>
            </p>
          </div>
        </section>

        <section id="cylbot" aria-labelledby="cylbot-titulo">
          <h2 className="flex flex-wrap items-baseline gap-3" id="cylbot-titulo">{t.cylbot.titulo}</h2>
          <p>{t.cylbot.texto}</p>
          {/* Vídeo do CylBot: <video preload="none" poster="..."> quando o Marcelo gravar. */}
          {site.repositorioCylBot && (
            <p>
              <a className={botao} href={site.repositorioCylBot} target="_blank" rel="noopener">
                {t.cylbot.repositorio}
              </a>
            </p>
          )}
        </section>

        <section className="border-t border-linha" id="cylsense" aria-labelledby="cylsense-titulo">
          <h2 className="flex flex-wrap items-baseline gap-3" id="cylsense-titulo">
            {t.cylsense.titulo} <span className="border border-destaque px-2 font-mono text-[0.85rem] font-normal text-destaque">{t.cylsense.status}</span>
          </h2>
          <p>{t.cylsense.texto}</p>
        </section>

        <section id="bots" aria-labelledby="bots-titulo">
          <h2 id="bots-titulo">{t.bots.titulo}</h2>
          {desconto && (
            <p className="mt-2 mb-6 inline-block border-l-[3px] border-destaque bg-realce px-3 py-2 font-semibold">
              {piloto(desconto.restam, desconto.percentual, desconto.percentual === 10)}
              <span className="block text-[0.9rem] font-normal">{pilotoNota}</span>
            </p>
          )}
          <Catalogo
            servicos={servicosDa("comunidade")}
            origem="comunidade"
            textoPedir={t.bots.pedir}
          />
          <p className="mt-6 text-texto-suave">
            {t.bots.mensalidade(
              pct(mensalidadeBots.fracaoDaCriacao),
              mensalidadeBots.mesesPlanoAdiantado,
              mensalidadeBots.descontoPlanoAdiantado === null ? null : pct(mensalidadeBots.descontoPlanoAdiantado),
            )}
          </p>
          <p className="mt-6 text-texto-suave">{t.bots.funcionalidadeNova(brl(parametros.valorHoraAvulsa))}</p>
        </section>

        <section className="pb-20" id="contato" aria-labelledby="contato-titulo">
          <h2 id="contato-titulo">{t.contato.titulo}</h2>
          <p>{t.contato.intro}</p>
          <Contatos origem="comunidade-contato" comFormulario={false} />
        </section>
      </main>
      <Rodape ponte={{ ...t.ponte, href: "/negocios/" }}>
        <p className="font-mono text-[0.85rem]">{t.avisoRiot}</p>
      </Rodape>
    </>
  );
}

createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <Comunidade />
  </StrictMode>,
);
