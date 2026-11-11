import { demoPlanilha as t } from "../../content/demoPlanilha";
import { cabecalhoDoPasso, linhasDoPasso, totalDoPasso, ultimoPasso } from "../../shared/lib/demoPassos";
import { celulaDemo as celula, DemoMoldura } from "./DemoMoldura";

function Tabela({ passo, legenda }: { passo: number; legenda: string }) {
  const linhas = linhasDoPasso(passo);
  const cab = cabecalhoDoPasso(passo);
  const separado = passo >= 4;
  return (
    <table className="w-full table-fixed border-collapse text-[0.875rem]" aria-label={legenda}>
      <thead>
        <tr>
          {cab.map((c, i) => (
            <th key={`${c}-${separado}`} className={`${celula} demo-entra bg-realce`} colSpan={!separado && i === 1 ? 3 : 1}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {linhas.map((l) => (
          <tr key={l.id}>
            <td className={celula}>
              <span key={l.data} className="demo-entra block min-h-[1.25rem]">
                {l.data}
              </span>
            </td>
            {l.colunas ? (
              l.colunas.map((c, i) => (
                <td className={celula} key={i}>
                  <span className="demo-entra block">{c}</span>
                </td>
              ))
            ) : (
              <td className={celula} colSpan={3}>
                <span key={l.nota} className="demo-entra block min-h-[1.25rem]">
                  {l.nota}
                </span>
              </td>
            )}
          </tr>
        ))}
        <tr className="font-bold">
          <td className={celula} colSpan={4}>
            <span key={totalDoPasso(passo)} className="demo-entra block">
              {totalDoPasso(passo)}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

const estatico = (
  <div className="grid gap-4 sm:grid-cols-2">
    <div>
      <p className="mb-2 text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave">{t.antes}</p>
      <Tabela passo={0} legenda={t.tabelaAntes} />
    </div>
    <div>
      <p className="mb-2 text-[0.875rem] uppercase tracking-[0.06em] text-texto-suave">{t.depois}</p>
      <Tabela passo={ultimoPasso} legenda={t.tabelaDepois} />
    </div>
  </div>
);

export function DemoPlanilha() {
  return <DemoMoldura id="planilha" t={t} visual={(passo) => <Tabela passo={passo} legenda={t.tabelaAtual} />} estatico={estatico} />;
}
