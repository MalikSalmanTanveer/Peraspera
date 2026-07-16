import { Link } from 'react-router-dom';

interface PageBreadcrumbProps {
  current: string;
}

export function PageBreadcrumb({ current }: PageBreadcrumbProps) {
  return (
    <nav
      className="mb-6 flex items-center gap-2 text-sm text-overlay-white-48"
      aria-label="Breadcrumb"
    >
      <Link to="/" className="transition-colors hover:text-white">
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-accent">{current}</span>
    </nav>
  );
}
