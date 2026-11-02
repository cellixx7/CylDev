import { CONTACT, waLink } from "@/lib/config";

export default function Contact() {
  return (
    <section id="contato" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <h2 className="text-3xl font-bold">Vamos conversar?</h2>
        <p className="mx-auto mt-2 max-w-xl text-slate-400">Conte sua ideia ou o problema que quer resolver. Respondo rápido.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={waLink("Olá! Vim pelo site da CylDev.")} target="_blank" rel="noreferrer" className="rounded-lg bg-brand px-6 py-3 font-semibold text-ink">WhatsApp</a>
          <a href={`mailto:${CONTACT.email}`} className="rounded-lg border border-line px-6 py-3 font-semibold hover:border-brand">{CONTACT.email}</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="rounded-lg border border-line px-6 py-3 font-semibold hover:border-brand">LinkedIn</a>
          <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="rounded-lg border border-line px-6 py-3 font-semibold hover:border-brand">Instagram</a>
        </div>
        <p className="mt-16 text-xs text-slate-600">© {new Date().getFullYear()} CylDev</p>
      </div>
    </section>
  );
}
