import { Link } from 'react-router-dom';
import primaryOnLight from '../../assets/logos/Primary-on-light.png';

type Props = {
  /** Link target. Pass `null` for a non-clickable mark. */
  to?: string | null;
  size?: 'md' | 'lg';
  className?: string;
};

/**
 * Full horizontal Primary wordmark for light admin surfaces.
 * Uses transparent PNG with dark letters + orange filament (readable on white).
 */
const SIZE_CLASS = {
  md: 'h-9 w-auto max-w-[200px] sm:h-10 sm:max-w-[220px]',
  lg: 'h-11 w-auto max-w-[260px] sm:h-12 sm:max-w-[300px]',
} as const;

export function AdminBrandMark({ to = '/admin', size = 'lg', className = '' }: Props) {
  const mark = (
    <img
      src={primaryOnLight}
      alt="Peraspera"
      className={`block object-contain object-left ${SIZE_CLASS[size]} ${className}`}
    />
  );

  if (to === null) return mark;

  return (
    <Link to={to} className="inline-flex items-center" aria-label="Peraspera">
      {mark}
    </Link>
  );
}
