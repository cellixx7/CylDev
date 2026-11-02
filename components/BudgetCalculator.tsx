"use client";
import { useState } from "react";
import { COMPLEXITY, SERVICES, URGENCY, brl, estimate } from "@/lib/pricing";
import { waLink } from "@/lib/config";

export default function BudgetCalculator() {
  const [sel, setSel] = useState<string[]>(["dashboard"]);
  const [cx, setCx] = useState(1);
  const [ug, setUg] = useState(0);
  const c = COMPLEXITY[cx], u = URGENCY[ug];
  const r = estimate(sel, c.mult, u.mult);

  const toggle = (id: string) => setSel((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const names = SERVICES.filter((s) => sel.includes(s.id)).map((s) => s.name).join(", ");
  const msg = `Olá! Simulei um orçamento no site da CylDev: ${names || "—"} | Complexidade ${c.label} | Prazo ${u.label} | Estimativa ${brl(r.min)} a ${brl(r.max)} (~${r.hours}h). Podemos conversar?`;

  return (
    <section id="orcamento" className="mx-auto max-w-6xl px-5 py-20">
      <h2 className="text-3xl font-bold">Quanto vai custar?</h2>
      <p className="mt-2 max-w-2xl text-slate-400">
        A estimativa é calculada por mão de obra × tempo gasto. É uma média para você ter uma noção — o valor final sai após entender seu projeto.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6 rounded-2xl border border-line bg-panel p-6">
          <div>
            <h3 className="mb-3 font-semibold">1. O que você precisa?</h3>
            <div className="space-y-2">
              {SERVICES.map((s) => (
                <label key={s.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${sel.includes(s.id) ? "border-brand" : "border-line"}`}>
                  <input type="checkbox" checked={sel.includes(s.id)} onChange={() => toggle(s.id)} className="mt-1" />
                  <span><b>{s.name}</b><br /><span className="text-sm text-slate-400">{s.hint}</span></span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">2. Complexidade</h3>
            <div className="flex gap-2">
              {COMPLEXITY.map((o, i) => (
                <button key={o.id} onClick={() => setCx(i)} className={`flex-1 rounded-lg border px-3 py-2 ${cx === i ? "border-brand text-brand" : "border-line"}`}>{o.label}</button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">3. Prazo</h3>
            <div className="flex flex-wrap gap-2">
              {URGENCY.map((o, i) => (
                <button key={o.id} onClick={() => setUg(i)} className={`flex-1 rounded-lg border px-3 py-2 ${ug === i ? "border-brand text-brand" : "border-line"}`}>{o.label}</button>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-brand/40 bg-panel p-6 lg:sticky lg:top-24">
          <div className="text-sm text-slate-400">Estimativa</div>
          <div className="mt-2 text-3xl font-extrabold text-brand">
            {sel.length ? `${brl(r.min)} – ${brl(r.max)}` : "—"}
          </div>
          <div className="mt-1 text-sm text-slate-400">≈ {r.hours} horas de trabalho</div>
          <a href={sel.length ? waLink(msg) : "#orcamento"} target="_blank" rel="noreferrer"
            className={`mt-6 block rounded-lg px-4 py-3 text-center font-semibold ${sel.length ? "bg-brand text-ink hover:opacity-90" : "bg-line text-slate-500"}`}>
            Enviar pelo WhatsApp
          </a>
        </aside>
      </div>
    </section>
  );
}
