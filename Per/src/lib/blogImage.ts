/** Blog body image layout — float classes + width percent. */

export type BlogImageFloat = 'left' | 'right' | 'center';

const FLOAT_CLASS: Record<BlogImageFloat, string> = {
  left: 'blog-img--left',
  right: 'blog-img--right',
  center: 'blog-img--center',
};

const ALLOWED_FLOAT = new Set(Object.values(FLOAT_CLASS));

export const BLOG_IMG_MIN_PCT = 15;
export const BLOG_IMG_MAX_PCT = 100;

export function buildBlogImageClass(float: BlogImageFloat): string {
  return ['blog-img', FLOAT_CLASS[float]].join(' ');
}

export function parseBlogImageFloat(className: string | null | undefined): BlogImageFloat {
  const parts = String(className ?? '').split(/\s+/);
  if (parts.includes('blog-img--left')) return 'left';
  if (parts.includes('blog-img--right')) return 'right';
  return 'center';
}

/** Read width % from style, legacy width classes, or default 60. */
export function parseBlogImageWidthPct(element: {
  getAttribute: (name: string) => string | null;
}): number {
  const style = element.getAttribute('style') ?? '';
  const styleMatch = style.match(/width:\s*(\d{1,3})\s*%/i);
  if (styleMatch) return clampWidthPct(Number(styleMatch[1]));

  const className = element.getAttribute('class') ?? '';
  if (className.includes('blog-img--w25')) return 25;
  if (className.includes('blog-img--w40')) return 40;
  if (className.includes('blog-img--w60')) return 60;
  if (className.includes('blog-img--w100')) return 100;
  return 60;
}

export function clampWidthPct(value: number): number {
  if (!Number.isFinite(value)) return 60;
  return Math.min(BLOG_IMG_MAX_PCT, Math.max(BLOG_IMG_MIN_PCT, Math.round(value)));
}

/** Keep only known float tokens on img class. */
export function sanitizeBlogImageClass(className: string | null | undefined): string {
  const parts = String(className ?? '')
    .split(/\s+/)
    .filter((p) => p === 'blog-img' || ALLOWED_FLOAT.has(p));
  if (!parts.includes('blog-img')) parts.unshift('blog-img');
  const float = parseBlogImageFloat(parts.join(' '));
  return buildBlogImageClass(float);
}

/** Only allow width: N% on img style. */
export function sanitizeBlogImageStyle(style: string | null | undefined): string {
  const match = String(style ?? '').match(/width:\s*(\d{1,3})\s*%/i);
  if (!match) return '';
  return `width: ${clampWidthPct(Number(match[1]))}%`;
}
