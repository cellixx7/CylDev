import { demoAutomacao as t } from "../../content/demoAutomacao";
import { visaoDoPasso } from "../../shared/lib/demoAutomacao";
import { celulaDemo as celula, DemoMoldura } from "./DemoMoldura";

const ultimo = t.passos.length;

function Botao({ clicado }: { clicado: boolean }) {
  return (
    <div className="mb-3">
      <p
        className={`m-0 inline-block rounded-pequeno border px-4 py-2 font-semibold ${
          clicado ? "border-destaque bg-destaque text-destaque-texto" : "border-texto text-texto"
        }`}
        aria-hidden="true"
      >
        {t.botao.rotulo}
        {clicado ? ` (${t.botao.clicado})` : ""}
      </p>
      <p className="mt-1 mb-0 text-[0.875rem] text-texto-suave">{t.botao.legenda}</p>
    </div>
  );
}

function Cabecalho({ comArquivo }: { comArquivo: boolean }) {
  return (
    <thead>
      <tr>
        {comArquivo && <th className={`${celula} bg-realce`}>{t.cabecalho.arquivo}</th>}
        <th className={`${celula} bg-realce`}>{t.cabecalho.item}</th>
        <th className={`${celula} bg-realce text-right`}>{t.cabecalho.valor}</th>
        <th className={`${celula} bg-realce`}>{t.cabecalho.situacao}</th>
      </tr>
    </thead>
  );
}

function Arquivos() {
  return (
    <div className="grid gap-3">
      {t.arquivos.map((a) => (
        <table key={a.id} className="w-full table-fixed border-collapse text-[0.875rem]" aria-label={t.tabelaArquivo(a.nome)}>
          <caption className="mb-1 text-left font-mono text-[0.875rem] text-texto-suave">{a.nome}</caption>
          <Cabecalho comArquivo={false} />
          <tbody>
            {a.linhas.map((l) => (
              <tr key={l.item + l.valor}>
                <td className={celula}>{l.item}</td>
                <td className={`${celula} text-right font-mono`}>{l.valor}</td>
                <td className={celula}>{t.situacao[l.situacao]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}

function Relatorio({ passo, legenda }: { passo: number; legenda: string }) {
  const v = visaoDoPasso(passo);
  return (
    <table className="w-full table-fixed border-collapse text-[0.875rem]" aria-label={legenda}>
      <Cabecalho comArquivo />
      <tbody>
        {v.linhas.map((l) => (
          <tr key={l.arquivo + l.item + l.valor}>
            <td className={`${celula} font-mono`}>
              <span className="demo-entra block">{l.arquivo.replace("vendas-", "")}</span>
            </td>
            <td className={celula}>{l.item}</td>
            <td className={`${celula} text-right font-mono`}>{l.valor}</td>
            <td className={celula}>{t.situacao[l.situacao]}</td>
          </tr>
        ))}
        {v.total !== null && (
          <tr className="font-bold">
            <td className={celula} colSpan={4}>
              <span className="demo-entra block">
                {t.totalRotulo}: {t.totalConferido(v.total, v.linhas.length)}
              </span>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function Visual({ passo }: { passo: number }) {
  const v = visaoDoPasso(passo);
  return (
    <div>
      <Botao clicado={v.botaoClicado} />
      {v.separados ? <Arquivos /> : <Relatorio passo={passo} legenda={t.tabelaJunta} />}
    </div>
  );
}

const estatico = (
  <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
    <div>
      <p className="mb-2 text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave">{t.antes}</p>
      <Arquivos />
    </div>
    <div>
      <p className="mb-2 text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave">{t.depois}</p>
      <Botao clicado />
      <Relatorio passo={ultimo} legenda={t.tabelaDepois} />
    </div>
  </div>
);

export function DemoAutomacao() {
  return (
    <>
      <DemoMoldura id="automacao" t={t} visual={(passo) => <Visual passo={passo} />} estatico={estatico} />
      <p className="mt-4 mb-0 max-w-[60ch] text-texto-suave">{t.aviso}</p>
    </>
  );
}
