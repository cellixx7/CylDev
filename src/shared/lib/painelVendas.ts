import { negocios } from "../../content/textos";

// Números do painel de exemplo da home quando um item está em foco (um mês, uma categoria ou uma região):
// os outros gráficos mostram só as vendas desse item. Tudo sai da matriz mês x categoria de `textos.ts`
// e dos totais por região, ajustados para fechar com os totais já mostrados (dado de exemplo).

const p = negocios.apresentacao.painel;

export type TipoFoco = "mes" | "categoria" | "regiao";
export type Foco = { tipo: TipoFoco; nome: string };
export type Item = { nome: string; valor: number };
export type Visao = { meses: Item[]; categorias: Item[]; regioes: Item[]; total: number };

const porMesECat = p.vendasMesCategoria;
const totalCat = p.categorias.map((_, c) => porMesECat.reduce((s, linha) => s + linha[c], 0));
const totalReg = p.regioes.map((r) => r.valor);

/** Categoria x região em R$ mil: ajuste proporcional (IPF) da afinidade aos totais por categoria e por região. */
function ajustarCategoriaRegiao(): number[][] {
  const n = p.afinidadeRegiao.map((linha) => [...linha]);
  for (let volta = 0; volta < 200; volta++) {
    n.forEach((linha, c) => {
      const soma = linha.reduce((s, v) => s + v, 0);
      linha.forEach((_, r) => (linha[r] = (linha[r] * totalCat[c]) / soma));
    });
    totalReg.forEach((alvo, r) => {
      const soma = n.reduce((s, linha) => s + linha[r], 0);
      n.forEach((linha) => (linha[r] = (linha[r] * alvo) / soma));
    });
  }
  return n;
}
const catReg = ajustarCategoriaRegiao();

/** Vendas (R$ mil) de um mês, categoria e região. */
const cubo = (m: number, c: number, r: number) => (porMesECat[m][c] * catReg[c][r]) / totalCat[c];

const soma = (n: number, f: (i: number) => number) => Array.from({ length: n }, (_, i) => f(i)).reduce((s, v) => s + v, 0);
const nM = p.meses.length;
const nC = p.categorias.length;
const nR = p.regioes.length;

/** Séries dos três gráficos. Sem foco, são os números do ano; com foco, o gráfico do próprio item continua inteiro. */
export function visaoDoFoco(foco: Foco | null): Visao {
  const m = foco?.tipo === "mes" ? p.meses.findIndex((x) => x.nome === foco.nome) : -1;
  const c = foco?.tipo === "categoria" ? p.categorias.findIndex((x) => x.nome === foco.nome) : -1;
  const r = foco?.tipo === "regiao" ? p.regioes.findIndex((x) => x.nome === foco.nome) : -1;
  const todosM = Array.from({ length: nM }, (_, k) => k);
  const todosC = Array.from({ length: nC }, (_, k) => k);
  const todosR = Array.from({ length: nR }, (_, k) => k);
  const listaM = m >= 0 ? [m] : todosM;
  const listaC = c >= 0 ? [c] : todosC;
  const listaR = r >= 0 ? [r] : todosR;
  const vendas = (mm: number[], cc: number[], rr: number[]) => soma(mm.length, (a) => soma(cc.length, (b) => soma(rr.length, (d) => cubo(mm[a], cc[b], rr[d]))));

  // O gráfico do item em foco mostra tudo (para ver o item entre os outros); os demais, só o que é do item.
  const meses = p.meses.map((x, i) => ({ nome: x.nome, valor: vendas([i], listaC, listaR) }));
  const categorias = p.categorias.map((x, i) => ({ nome: x.nome, valor: vendas(listaM, [i], listaR) }));
  const regioes = p.regioes.map((x, i) => ({ nome: x.nome, valor: vendas(listaM, listaC, [i]) }));
  return { meses, categorias, regioes, total: vendas(listaM, listaC, listaR) };
}

/** Item de maior valor de uma série. */
export const maior = (itens: Item[]) => itens.reduce((a, b) => (b.valor > a.valor ? b : a));
