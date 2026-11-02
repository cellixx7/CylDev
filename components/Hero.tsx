export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-brand2/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5 py-24 text-center md:py-36">
        <p className="mb-4 inline-block rounded-full border border-line px-3 py-1 text-xs text-brand">
          Dados · Automação · Software
        </p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Transforme dados em <span className="bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">decisões</span>
          <br /> e ideias em produtos
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Dashboards, landing pages, cursos de Excel e Power BI e desenvolvimento de SaaS.
          Mexa nas demos abaixo e descubra, em minutos, quanto custa o seu projeto.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#entregas" className="rounded-lg bg-brand px-6 py-3 font-semibold text-ink hover:opacity-90">Ver o que entrego</a>
          <a href="#orcamento" className="rounded-lg border border-line px-6 py-3 font-semibold hover:border-brand">Simular orçamento</a>
        </div>
      </div>
    </section>
  );
}
