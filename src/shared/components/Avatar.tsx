type Props = { nome: string; foto?: string | null };

export function Avatar({ nome, foto }: Props) {
  if (foto) {
    return (
      <img
        className="size-24 shrink-0 rounded-full object-cover"
        src={foto}
        alt={nome}
        width={96}
        height={96}
        loading="lazy"
      />
    );
  }
  const iniciais = nome
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className="inline-grid size-24 shrink-0 place-items-center rounded-full bg-destaque font-titulo text-[2rem] font-bold text-destaque-texto"
      aria-hidden="true"
    >
      {iniciais}
    </span>
  );
}
