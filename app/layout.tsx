import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CylDev — Dashboards, Landing Pages, Cursos e SaaS",
  description:
    "Painéis em Power BI e Excel, landing pages, cursos e desenvolvimento de SaaS. Veja demos interativas e simule seu orçamento.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
