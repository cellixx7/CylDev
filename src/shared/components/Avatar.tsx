type Props = { nome: string; foto?: string | null };

export function Avatar({ nome, foto }: Props) {
  if (foto) {
    return <img className="avatar" src={foto} alt={nome} width={96} height={96} loading="lazy" />;
  }
  const iniciais = nome
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="avatar avatar--iniciais" aria-hidden="true">
      {iniciais}
    </span>
  );
}
