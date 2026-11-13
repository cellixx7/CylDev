/** Ícones do orçamento: traços simples, herdam a cor do texto. */
type Props = { className?: string };

export function IconeCheck({ className = "size-4" }: Props) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="M3 8.5l3.2 3.2L13 5" />
    </svg>
  );
}

export function IconeSeta({ className = "size-4" }: Props) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

export function IconeFechar({ className = "size-5" }: Props) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  );
}

/** "Abrir mais": quadrado com seta para fora. Marca os trechos do texto que abrem um modal. */
export function IconeAbrir({ className = "size-4" }: Props) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      <path d="M7 3H3v10h10V9M9.5 2.5H13.5V6.5M13 3L7.5 8.5" />
    </svg>
  );
}
