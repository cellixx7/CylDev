import { prazoACombinar, type Preco, type Servico } from "../../content/servicos";
import { catalogo as t } from "../../content/textos";
import { brl } from "../lib/formato";
import { mensalidadeDe } from "../lib/orcamento";
import { formatarPrazo, prazoEmDias } from "../lib/prazo";
import { linkContato } from "../lib/whatsapp";

type Props = {
  servicos: Servico[];
  origem: string;
  textoPedir: string;
};

export function textoPreco(preco: Preco): string {
  switch (preco.tipo) {
    case "fixo":
      return brl(preco.valor);
    case "aPartirDe":
      return `a partir de ${brl(preco.valor)}`;
    case "sobConsulta":
      return "sob consulta";
  }
}

export function textoPrazo(s: Servico): string | null {
  if (s.horasProvisorias) return prazoACombinar;
  if (s.horasBase) return formatarPrazo(prazoEmDias(s.horasBase));
  return s.prazoTexto ?? null;
}

export function textoMensalidade(s: Servico): string | null {
  if (!s.mensalidade || (s.preco.tipo !== "fixo" && s.preco.tipo !== "aPartirDe")) return null;
  return t.valorMensalidade(brl(mensalidadeDe(s.preco.valor)), s.preco.tipo === "aPartirDe");
}

export function Catalogo({ servicos, origem, textoPedir }: Props) {
  return (
    <ol className="mt-6 list-none p-0 border-t-2 border-texto xl:grid xl:grid-cols-2 xl:gap-x-14">
      {servicos.map((s) => {
        const prazo = textoPrazo(s);
        const mensalidade = textoMensalidade(s);
        const mensagem = `Quero um orçamento de: ${s.nome} (${textoPreco(s.preco)}).`;
        const consulta = s.preco.tipo === "sobConsulta";
        const precoQuebra = s.preco.tipo === "aPartirDe";
        return (
          <li
            key={s.id}
            className={
              consulta
                ? "mt-3 bg-realce p-4 xl:col-span-full"
                : "border-b border-linha py-6 tab:grid tab:grid-cols-[5fr_4fr] tab:gap-x-9"
            }
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 tab:col-span-full">
              <h3 className="m-0 text-[1.35rem]">{s.nome}</h3>
              <p className={`m-0 font-mono text-[1.05rem] font-bold ${precoQuebra ? "whitespace-normal" : "whitespace-nowrap"}`}>
                {textoPreco(s.preco)}
              </p>
            </div>
            <p className="mt-2 mb-3 tab:col-start-1">{s.resultado}</p>
            <dl className="mb-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[1rem] text-texto-suave tab:col-start-2 tab:row-[2/span_2] tab:mt-2">
              <dt className="font-semibold text-texto">{t.inclui}</dt>
              <dd className="m-0">
                <ul className="m-0 list-disc pl-[1.1em]">
                  {s.inclui.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </dd>
              {prazo && (
                <>
                  <dt className="font-semibold text-texto">{t.prazo}</dt>
                  <dd className="m-0">{prazo}</dd>
                </>
              )}
              {mensalidade && (
                <>
                  <dt className="font-semibold text-texto">{t.mensalidade}</dt>
                  <dd className="m-0">{mensalidade}</dd>
                </>
              )}
            </dl>
            {s.nota && <p className="my-3 text-[1rem] text-texto-suave tab:col-start-1">{s.nota}</p>}
            <a
              className="inline-flex min-h-alvo items-center font-semibold text-destaque tab:col-start-1"
              href={linkContato(`${origem}-${s.id}`, mensagem)}
              target="_blank"
              rel="noopener"
            >
              {textoPedir}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
