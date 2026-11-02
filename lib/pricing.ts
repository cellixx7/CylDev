// Orçamento = horas base × multiplicadores × valor/hora.
export type Service = { id: string; name: string; baseHours: number; hint: string };

export const SERVICES: Service[] = [
  { id: "dashboard", name: "Dashboard / Painel (Power BI ou Excel)", baseHours: 24, hint: "Modelagem de dados, medidas e visuais" },
  { id: "landing", name: "Landing page", baseHours: 16, hint: "Design, textos, formulário e publicação" },
  { id: "automacao", name: "Automação em Excel (VBA / Power Query)", baseHours: 20, hint: "Planilhas que trabalham por você" },
  { id: "curso", name: "Curso / treinamento (Excel ou Power BI)", baseHours: 12, hint: "Por turma ou treinamento in company" },
  { id: "saas", name: "SaaS / sistema sob medida", baseHours: 120, hint: "MVP com login, banco e painel" },
];

export const COMPLEXITY = [
  { id: "simples", label: "Simples", mult: 1 },
  { id: "media", label: "Média", mult: 1.6 },
  { id: "alta", label: "Alta", mult: 2.5 },
];

export const URGENCY = [
  { id: "normal", label: "Normal", mult: 1 },
  { id: "rapido", label: "Rápido (-30% prazo)", mult: 1.2 },
  { id: "urgente", label: "Urgente", mult: 1.5 },
];

export const HOURLY_RATE = 90; // R$/hora — ajuste ao seu valor

export function estimate(
  serviceIds: string[],
  complexity: number,
  urgency: number,
  rate = HOURLY_RATE
) {
  const hours = SERVICES.filter((s) => serviceIds.includes(s.id)).reduce(
    (a, s) => a + s.baseHours,
    0
  ) * complexity;
  const adj = hours * urgency;
  const mid = adj * rate;
  return { hours: Math.round(adj), min: Math.round(mid * 0.85), max: Math.round(mid * 1.25) };
}

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
