"use client";
import { useMemo, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const REGIONS = ["Sul", "Sudeste", "Nordeste"] as const;
const BASE: Record<(typeof REGIONS)[number], number[]> = {
  Sul: [42,45,51,48,55,60,58,64,67,71,75,82],
  Sudeste: [80,84,90,95,92,101,108,112,118,121,130,142],
  Nordeste: [30,33,31,38,41,44,47,50,52,58,61,66],
};
const fmt = (n: number) => `R$ ${n.toLocaleString("pt-BR")} mil`;

export default function DashboardDemo() {
  const [regions, setRegions] = useState<string[]>([...REGIONS]);
  const [period, setPeriod] = useState(12);
  const [growth, setGrowth] = useState(0);
  const [mode, setMode] = useState<"bar" | "line">("bar");

  const data = useMemo(
    () =>
      MONTHS.slice(0, period).map((m, i) => {
        const row: Record<string, number | string> = { m };
        let total = 0;
        REGIONS.forEach((r) => {
          const v = regions.includes(r) ? Math.round(BASE[r][i] * (1 + growth / 100)) : 0;
          row[r] = v; total += v;
        });
        row.total = total;
        return row;
      }),
    [regions, period, growth]
  );

  const total = data.reduce((a, r) => a + (r.total as number), 0);
  const avg = Math.round(total / period);
  const last = data[data.length - 1].total as number;
  const first = data[0].total as number;
  const trend = first ? Math.round(((last - first) / first) * 100) : 0;

  const toggle = (r: string) =>
    setRegions((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));

  const colors = { Sul: "#22d3ee", Sudeste: "#8b5cf6", Nordeste: "#f59e0b" };

  return (
    <section id="dashboards" className="mx-auto max-w-6xl px-5 py-20">
      <h2 className="text-3xl font-bold">Dashboard de vendas — demo interativa</h2>
      <p className="mt-2 text-slate-400">Filtre regiões, mude o período e simule crescimento. É assim que seus números podem ficar.</p>

      <div className="mt-8 rounded-2xl border border-line bg-panel p-5">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex gap-2">
            {REGIONS.map((r) => (
              <button key={r} onClick={() => toggle(r)}
                className={`rounded-full border px-3 py-1 ${regions.includes(r) ? "border-transparent text-ink" : "border-line text-slate-400"}`}
                style={regions.includes(r) ? { background: colors[r] } : undefined}>
                {r}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-slate-300">
            Período
            <select value={period} onChange={(e) => setPeriod(+e.target.value)} className="rounded bg-ink px-2 py-1 border border-line">
              <option value={3}>3 meses</option><option value={6}>6 meses</option><option value={12}>12 meses</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-slate-300">
            Crescimento simulado: <b className="w-10 text-brand">{growth}%</b>
            <input type="range" min={-20} max={50} value={growth} onChange={(e) => setGrowth(+e.target.value)} />
          </label>
          <button onClick={() => setMode(mode === "bar" ? "line" : "bar")} className="ml-auto rounded border border-line px-3 py-1 hover:border-brand">
            Ver como {mode === "bar" ? "linha" : "barras"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["Faturamento", fmt(total)],
            ["Média mensal", fmt(avg)],
            ["Tendência", `${trend >= 0 ? "▲" : "▼"} ${Math.abs(trend)}%`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-line bg-ink p-4">
              <div className="text-xs text-slate-400">{k}</div>
              <div className="mt-1 text-2xl font-bold">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            {mode === "bar" ? (
              <BarChart data={data}>
                <CartesianGrid stroke="#232836" vertical={false} />
                <XAxis dataKey="m" stroke="#64748b" /><YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: "#12151c", border: "1px solid #232836" }} />
                {REGIONS.map((r) => <Bar key={r} dataKey={r} stackId="a" fill={colors[r]} />)}
              </BarChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid stroke="#232836" vertical={false} />
                <XAxis dataKey="m" stroke="#64748b" /><YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: "#12151c", border: "1px solid #232836" }} />
                {REGIONS.map((r) => <Line key={r} dataKey={r} stroke={colors[r]} strokeWidth={2} dot={false} />)}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
