import { useMemo } from "react";
import { vejaMais as t } from "../../../content/textos";

/** A, B, ... Z, AA, AB... */
export function letraDaColuna(i: number): string {
  let n = i;
  let letra = "";
  do {
    letra = String.fromCharCode(65 + (n % 26)) + letra;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return letra;
}

/** Venda fiada: alguma célula é só "fiado" (qualquer caixa, com ou sem pontuação). A legenda "fiado = vermelho" não conta. */
export function linhaFiada(linha: string[]): boolean {
  return linha.some((c) => /^\s*fiado\W*$/i.test(c));
}

type Props = {
  linhas: string[][];
  /** Nome para o leitor de tela (aba ou planilha). */
  nome: string;
  /** Primeira linha é o cabeçalho da tabela (negrito). */
  cabecalho?: boolean;
  /** Mostra só as primeiras linhas, sem rolagem (prévia do card). */
  maxLinhas?: number;
  /** Altura máxima da área rolável (grade completa). Classe Tailwind completa. */
  altura?: string;
};

/**
 * Grade de planilha somente leitura: letras de coluna, números de linha, cabeçalho e coluna de números fixos,
 * rolagem dentro do próprio quadro (a página nunca rola de lado). Vendas fiadas em vermelho-suave; o texto
 * "fiado" já está na linha, então a cor nunca é a única pista.
 */
export function GradePlanilha({ linhas, nome, cabecalho = false, maxLinhas, altura = "max-h-[60dvh]" }: Props) {
  const mostradas = maxLinhas ? linhas.slice(0, maxLinhas) : linhas;
  const colunas = useMemo(() => mostradas.reduce((m, l) => Math.max(m, l.length), 1), [mostradas]);
  const previa = maxLinhas !== undefined;

  return (
    <div
      className={`overflow-auto rounded-pequeno border border-linha bg-superficie ${previa ? "" : altura}`}
      {...(previa ? {} : { tabIndex: 0, role: "region", "aria-label": t.grade.regiao(nome) })}
    >
      <table className="w-max min-w-full border-collapse font-mono text-menor" aria-label={nome}>
        <thead>
          <tr>
            <th scope="col" className="sticky top-0 left-0 z-20 border border-linha bg-realce px-2 py-1">
              <span className="sr-only">Linha</span>
            </th>
            {Array.from({ length: colunas }, (_, i) => (
              <th key={i} scope="col" className="sticky top-0 z-10 border border-linha bg-realce px-2 py-1 text-center font-bold text-texto-suave">
                {letraDaColuna(i)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mostradas.map((linha, r) => {
            const fiado = linhaFiada(linha);
            const titulo = cabecalho && r === 0;
            return (
              <tr key={r} className={fiado ? "bg-fiado text-fiado-texto" : ""} {...(fiado ? { "data-fiado": "1" } : {})}>
                <th scope="row" className="sticky left-0 z-10 border border-linha bg-realce px-2 py-1 text-right font-normal text-texto-suave">
                  {r + 1}
                </th>
                {Array.from({ length: colunas }, (_, c) => (
                  <td key={c} className={`border border-linha px-2 py-1 whitespace-nowrap ${titulo ? "bg-realce font-bold text-texto" : ""}`}>
                    {linha[c] ?? ""}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
