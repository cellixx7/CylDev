const items = [
  { icon: "📊", title: "Dashboards", text: "Painéis em Power BI e Excel com KPIs, filtros e atualização automática.", href: "#dashboards" },
  { icon: "🖥️", title: "Landing pages", text: "Páginas rápidas, bonitas e focadas em converter visitantes em clientes.", href: "#landing" },
  { icon: "🎓", title: "Cursos", text: "Excel e Power BI do zero ao avançado, com prática e projetos reais.", href: "#contato" },
  { icon: "⚙️", title: "SaaS sob medida", text: "Do MVP ao produto: login, banco de dados, painel e cobrança.", href: "#orcamento" },
];

export default function Deliverables() {
  return (
    <section id="entregas" className="mx-auto max-w-6xl px-5 py-20">
      <h2 className="text-3xl font-bold">O que será entregue</h2>
      <p className="mt-2 max-w-2xl text-slate-400">
        Tudo aqui é interativo — os exemplos abaixo são sistemas reais e ajustáveis, para você sentir o resultado antes de contratar.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((i) => (
          <a key={i.title} href={i.href} className="rounded-2xl border border-line bg-panel p-6 transition hover:-translate-y-1 hover:border-brand">
            <div className="text-3xl">{i.icon}</div>
            <h3 className="mt-4 font-semibold">{i.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{i.text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
