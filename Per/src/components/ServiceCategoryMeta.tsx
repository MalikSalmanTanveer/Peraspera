import type { ServiceCategory } from '../data/services';
import { AppIcon } from './AppIcon';

interface ServiceCategoryMetaProps {
  category: ServiceCategory;
  size?: 'md' | 'sm';
}

export function ServiceCategoryMeta({ category, size = 'md' }: ServiceCategoryMetaProps) {
  const { badgeTone } = category;
  const iconBoxClass =
    size === 'sm'
      ? 'h-9 w-9 rounded-lg'
      : 'h-11 w-11 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)]';
  const iconClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const pillClass =
    size === 'sm'
      ? 'min-h-[28px] px-3 py-1 text-[10px] tracking-wider'
      : 'min-h-[32px] px-4 py-1.5 text-2xs tracking-wide';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        className={`flex shrink-0 items-center justify-center ${iconBoxClass} ${badgeTone.iconWrap}`}
      >
        <AppIcon name={category.icon} className={`${iconClass} ${badgeTone.iconColor}`} />
      </div>
      <span
        className={`inline-flex items-center rounded-pill font-extrabold uppercase shadow-sm ${pillClass} ${badgeTone.pill}`}
      >
        {category.shortCategory}
      </span>
    </div>
  );
}

export function ServiceCategoryBannerBadge({ category }: { category: ServiceCategory }) {
  const { badgeTone } = category;

  return (
    <div className="absolute bottom-5 left-5 z-10 flex items-center gap-2.5 md:bottom-6 md:left-6">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.28)] md:h-11 md:w-11 ${badgeTone.iconWrap}`}
      >
        <AppIcon name={category.icon} className={`h-4 w-4 md:h-5 md:w-5 ${badgeTone.iconColor}`} />
      </div>
      <span
        className={`inline-flex min-h-[32px] items-center rounded-pill px-3.5 py-1.5 text-2xs font-extrabold uppercase tracking-wide shadow-[0_8px_24px_rgba(0,0,0,0.22)] md:px-4 ${badgeTone.pill}`}
      >
        {category.shortCategory}
      </span>
    </div>
  );
}
