import type { Preco, Servico } from "../../content/servicos";
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
    case "aula":
      return `${brl(preco.porHora)} por hora, ou ${preco.pacote.aulas} aulas por ${brl(preco.pacote.valor)}`;
    case "sobConsulta":
      return "sob consulta";
  }
}

export function textoPrazo(s: Servico): string | null {
  if (s.horasBase) return formatarPrazo(prazoEmDias(s.horasBase));
  return s.prazoTexto ?? null;
}

export function textoMensalidade(s: Servico): string | null {
  if (!s.mensalidade || (s.preco.tipo !== "fixo" && s.preco.tipo !== "aPartirDe")) return null;
  return t.valorMensalidade(brl(mensalidadeDe(s.preco.valor)), s.preco.tipo === "aPartirDe");
}

export function Catalogo({ servicos, origem, textoPedir }: Props) {
  return (
    <ol className="catalogo">
      {servicos.map((s) => {
        const prazo = textoPrazo(s);
        const mensalidade = textoMensalidade(s);
        const mensagem = `Quero um orçamento de: ${s.nome} (${textoPreco(s.preco)}).`;
        return (
          <li key={s.id} className={`catalogo__item catalogo__item--${s.preco.tipo}`}>
            <div className="catalogo__cabeca">
              <h3 className="catalogo__nome">{s.nome}</h3>
              <p className="catalogo__preco">{textoPreco(s.preco)}</p>
            </div>
            <p className="catalogo__resultado">{s.resultado}</p>
            <dl className="catalogo__detalhes">
              <dt>{t.inclui}</dt>
              <dd>
                <ul className="catalogo__inclui">
                  {s.inclui.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </dd>
              {prazo && (
                <>
                  <dt>{t.prazo}</dt>
                  <dd>{prazo}</dd>
                </>
              )}
              {mensalidade && (
                <>
                  <dt>{t.mensalidade}</dt>
                  <dd>{mensalidade}</dd>
                </>
              )}
            </dl>
            {s.nota && <p className="catalogo__nota">{s.nota}</p>}
            <a
              className="catalogo__pedir"
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
