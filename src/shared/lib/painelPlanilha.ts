// Painel da planilha de exemplo (seção "Veja mais"): lê o CSV arrumado e calcula filtros e totais.
// Lógica pura. Todo número mostrado no painel sai daqui, a partir do CSV; nada é escrito à mão.
import { lerCsv } from "./csv";

export type Situacao = "pago" | "fiado";

export type Venda = {
  /** AAAA-MM-DD */
  data: string;
  /** AAAA-MM */
  mes: string;
  cliente: string;
  categoria: string;
  produto: string;
  qtd: number;
  valorUnitario: number;
  valorTotal: number;
  pagamento: string;
  situacao: Situacao;
};

/** Cada dimensão é uma lista de valores aceitos; lista vazia = tudo. */
export type Filtros = {
  meses: string[];
  /** Dia (AAAA-MM-DD): só liga pelo clique num ponto do gráfico diário. */
  dias: string[];
  categorias: string[];
  pagamentos: string[];
  situacoes: string[];
  clientes: string[];
};

export type Dimensao = keyof Filtros;

export const semFiltros: Filtros = { meses: [], dias: [], categorias: [], pagamentos: [], situacoes: [], clientes: [] };

const campoDaDimensao: Record<Dimensao, (v: Venda) => string> = {
  meses: (v) => v.mes,
  dias: (v) => v.data,
  categorias: (v) => v.categoria,
  pagamentos: (v) => v.pagamento,
  situacoes: (v) => v.situacao,
  clientes: (v) => v.cliente,
};

export const colunasEsperadas = ["data", "cliente", "categoria", "produto", "qtd", "valor_unitario", "valor_total", "forma_pagamento", "situacao"];

/** Converte o CSV arrumado em vendas. Lança erro se faltar coluna ou se um número não for número. */
export function vendasDoCsv(texto: string): Venda[] {
  const [cabecalho, ...corpo] = lerCsv(texto, { descartarVazias: true });
  if (!cabecalho || colunasEsperadas.some((c, i) => cabecalho[i]?.trim() !== c)) throw new Error("CSV fora do formato esperado");
  const numero = (s: string, linha: number) => {
    const n = Number(s.replace(",", "."));
    if (!Number.isFinite(n)) throw new Error(`Número inválido na linha ${linha + 2}: ${s}`);
    return n;
  };
  return corpo.map((c, i) => {
    const situacao = c[8].trim().toLowerCase();
    if (situacao !== "pago" && situacao !== "fiado") throw new Error(`Situação inválida na linha ${i + 2}: ${c[8]}`);
    return {
      data: c[0].trim(),
      mes: c[0].trim().slice(0, 7),
      cliente: c[1].trim(),
      categoria: c[2].trim(),
      produto: c[3].trim(),
      qtd: numero(c[4], i),
      valorUnitario: numero(c[5], i),
      valorTotal: numero(c[6], i),
      pagamento: c[7].trim(),
      situacao,
    };
  });
}

/** Aplica os filtros. `ignorar` deixa uma dimensão de fora (o gráfico dela mostra todas as barras, uma em destaque). */
export function filtrar(vendas: Venda[], filtros: Filtros, ignorar?: Dimensao): Venda[] {
  const ativos = (Object.keys(filtros) as Dimensao[]).filter((d) => d !== ignorar && filtros[d].length > 0);
  if (ativos.length === 0) return vendas;
  return vendas.filter((v) => ativos.every((d) => filtros[d].includes(campoDaDimensao[d](v))));
}

export function temFiltro(filtros: Filtros): boolean {
  return (Object.keys(filtros) as Dimensao[]).some((d) => filtros[d].length > 0);
}

/** Liga o valor se estava desligado; desliga se estava ligado. Devolve filtros novos. */
export function alternar(filtros: Filtros, dimensao: Dimensao, valor: string): Filtros {
  const atual = filtros[dimensao];
  return { ...filtros, [dimensao]: atual.includes(valor) ? atual.filter((x) => x !== valor) : [...atual, valor] };
}

export type Indicadores = { faturamento: number; vendas: number; ticketMedio: number; fiadoAReceber: number };

export function indicadores(vendas: Venda[]): Indicadores {
  const faturamento = vendas.reduce((s, v) => s + v.valorTotal, 0);
  const fiadoAReceber = vendas.filter((v) => v.situacao === "fiado").reduce((s, v) => s + v.valorTotal, 0);
  return { faturamento, vendas: vendas.length, ticketMedio: vendas.length ? faturamento / vendas.length : 0, fiadoAReceber };
}

export type Ponto = { chave: string; valor: number; vendas: number };

function somarPor(vendas: Venda[], chave: (v: Venda) => string): Ponto[] {
  const mapa = new Map<string, Ponto>();
  for (const v of vendas) {
    const k = chave(v);
    const p = mapa.get(k) ?? { chave: k, valor: 0, vendas: 0 };
    p.valor += v.valorTotal;
    p.vendas += 1;
    mapa.set(k, p);
  }
  return [...mapa.values()];
}

const porValorDesc = (a: Ponto, b: Ponto) => b.valor - a.valor || a.chave.localeCompare(b.chave, "pt-BR");
const porChaveAsc = (a: Ponto, b: Ponto) => a.chave.localeCompare(b.chave);

function completar(pontos: Ponto[], todas: string[]): Ponto[] {
  const tem = new Set(pontos.map((p) => p.chave));
  return [...pontos, ...todas.filter((c) => !tem.has(c)).map((chave) => ({ chave, valor: 0, vendas: 0 }))];
}

/** Uma barra por mês de `meses` (mesmo os de valor zero), em ordem de calendário. */
export function serieMensal(vendas: Venda[], meses: string[]): Ponto[] {
  const soma = new Map(somarPor(vendas, (v) => v.mes).map((p) => [p.chave, p]));
  return meses.map((m) => soma.get(m) ?? { chave: m, valor: 0, vendas: 0 });
}

/** Só os dias com venda, em ordem de calendário. */
export function serieDiaria(vendas: Venda[]): Ponto[] {
  return somarPor(vendas, (v) => v.data).sort(porChaveAsc);
}

/** Uma barra por categoria de `todas` (mesmo as de valor zero), da maior para a menor. */
export function porCategoria(vendas: Venda[], todas: string[] = []): Ponto[] {
  return completar(somarPor(vendas, (v) => v.categoria), todas).sort(porValorDesc);
}

export function porPagamento(vendas: Venda[], todas: string[] = []): Ponto[] {
  return completar(somarPor(vendas, (v) => v.pagamento), todas).sort(porValorDesc);
}

export function topClientes(vendas: Venda[], limite = 5): Ponto[] {
  return somarPor(vendas, (v) => v.cliente).sort(porValorDesc).slice(0, limite);
}

/** Valores existentes de cada dimensão, em ordem estável (meses por calendário; os demais por nome). */
export function opcoes(vendas: Venda[]): Record<Dimensao, string[]> {
  const unicos = (d: Dimensao) => [...new Set(vendas.map(campoDaDimensao[d]))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  return { meses: unicos("meses"), dias: unicos("dias"), categorias: unicos("categorias"), pagamentos: unicos("pagamentos"), situacoes: ["pago", "fiado"], clientes: unicos("clientes") };
}

export type ColunaTabela = "data" | "cliente" | "produto" | "qtd" | "valorTotal" | "pagamento" | "situacao";
export type Ordem = { coluna: ColunaTabela; decrescente: boolean };

export function ordenar(vendas: Venda[], ordem: Ordem): Venda[] {
  const sinal = ordem.decrescente ? -1 : 1;
  const c = ordem.coluna;
  return [...vendas].sort((a, b) => {
    const x = a[c];
    const y = b[c];
    const r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "pt-BR");
    if (r) return r * sinal;
    return a.data.localeCompare(b.data) || a.cliente.localeCompare(b.cliente, "pt-BR");
  });
}

export function pagina<T>(itens: T[], numero: number, tamanho = 10): { itens: T[]; total: number; atual: number } {
  const total = Math.max(1, Math.ceil(itens.length / tamanho));
  const atual = Math.min(Math.max(1, numero), total);
  return { itens: itens.slice((atual - 1) * tamanho, atual * tamanho), total, atual };
}
