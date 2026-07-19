import { Link } from 'react-router-dom';

interface PageBreadcrumbProps {
  current: string;
  light?: boolean;
}

export function PageBreadcrumb({ current, light = false }: PageBreadcrumbProps) {
  return (
    <nav
      className={`mb-6 flex items-center gap-2 text-sm ${light ? 'text-muted' : 'text-overlay-white-48'}`}
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        className={`transition-colors ${light ? 'hover:text-ink' : 'hover:text-white'}`}
      >
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <span className={light ? 'font-semibold text-ink' : 'text-accent'}>{current}</span>
    </nav>
  );
}
