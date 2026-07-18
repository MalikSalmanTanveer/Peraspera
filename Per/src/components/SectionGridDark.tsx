import type { ReactNode } from 'react';

interface SectionGridDarkProps {
  id?: string;
  children: ReactNode;
  className?: string;
  gridOpacity?: 'subtle' | 'default' | 'strong';
}

const gridOpacityClass = {
  subtle: 'opacity-35',
  default: 'opacity-50',
  strong: 'opacity-65',
} as const;

export function SectionGridDark({
  id,
  children,
  className = '',
  gridOpacity = 'default',
}: SectionGridDarkProps) {
  return (
    <section id={id} className={`relative overflow-hidden bg-ink text-white ${className}`}>
      <div
        className={`hero-grid-bg pointer-events-none absolute inset-0 ${gridOpacityClass[gridOpacity]}`}
        aria-hidden="true"
      />
      <div className="relative z-[1]">{children}</div>
    </section>
  );
}
