"use client";
import { useState } from "react";

const THEMES = {
  Oceano: { bg: "#0e7490", btn: "#fde047", text: "#ffffff" },
  Violeta: { bg: "#6d28d9", btn: "#34d399", text: "#ffffff" },
  Solar: { bg: "#fff7ed", btn: "#ea580c", text: "#1c1917" },
} as const;

export default function LandingDemo() {
  const [theme, setTheme] = useState<keyof typeof THEMES>("Oceano");
  const [headline, setHeadline] = useState("Venda mais com uma página que converte");
  const [cta, setCta] = useState("Quero começar");
  const [layout, setLayout] = useState<"center" | "split">("center");
  const t = THEMES[theme];

  return (
    <section id="landing" className="mx-auto max-w-6xl px-5 py-20">
      <h2 className="text-3xl font-bold">Landing page — edite ao vivo</h2>
      <p className="mt-2 text-slate-400">Troque cores, texto e layout e veja a página mudar na hora.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4 rounded-2xl border border-line bg-panel p-5 text-sm">
          <label className="block">Título
            <input value={headline} onChange={(e) => setHeadline(e.target.value)} className="mt-1 w-full rounded border border-line bg-ink px-2 py-1" />
          </label>
          <label className="block">Botão
            <input value={cta} onChange={(e) => setCta(e.target.value)} className="mt-1 w-full rounded border border-line bg-ink px-2 py-1" />
          </label>
          <div>Tema
            <div className="mt-1 flex gap-2">
              {(Object.keys(THEMES) as (keyof typeof THEMES)[]).map((k) => (
                <button key={k} onClick={() => setTheme(k)} className={`rounded border px-2 py-1 ${theme === k ? "border-brand text-brand" : "border-line"}`}>{k}</button>
              ))}
            </div>
          </div>
          <div>Layout
            <div className="mt-1 flex gap-2">
              {(["center", "split"] as const).map((k) => (
                <button key={k} onClick={() => setLayout(k)} className={`rounded border px-2 py-1 ${layout === k ? "border-brand text-brand" : "border-line"}`}>{k === "center" ? "Centralizado" : "Dividido"}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line">
          <div className="flex items-center gap-1.5 bg-panel px-3 py-2">
            <i className="h-2.5 w-2.5 rounded-full bg-red-400" /><i className="h-2.5 w-2.5 rounded-full bg-yellow-400" /><i className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div style={{ background: t.bg, color: t.text }} className="px-8 py-16 transition-colors">
            <div className={layout === "center" ? "mx-auto max-w-xl text-center" : "grid items-center gap-8 md:grid-cols-2"}>
              <div>
                <h3 className="text-3xl font-extrabold leading-tight">{headline}</h3>
                <p className="mt-3 opacity-80">Texto de apoio que explica o benefício principal em uma frase.</p>
                <button style={{ background: t.btn, color: "#111" }} className="mt-6 rounded-lg px-6 py-3 font-bold">{cta}</button>
              </div>
              {layout === "split" && (
                <div className="grid h-40 place-items-center rounded-xl bg-black/20 text-5xl">📈</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
