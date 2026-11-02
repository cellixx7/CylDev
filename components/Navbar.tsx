const links = [
  ["#entregas", "Entregas"],
  ["#dashboards", "Dashboards"],
  ["#landing", "Landing pages"],
  ["#orcamento", "Orçamento"],
  ["#contato", "Contato"],
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#" className="text-lg font-bold tracking-tight">
          Cyl<span className="text-brand">Dev</span>
        </a>
        <ul className="hidden gap-6 text-sm text-slate-300 md:flex">
          {links.map(([href, label]) => (
            <li key={href}><a className="hover:text-brand" href={href}>{label}</a></li>
          ))}
        </ul>
        <a href="#orcamento" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-ink hover:opacity-90">
          Simular orçamento
        </a>
      </nav>
    </header>
  );
}
