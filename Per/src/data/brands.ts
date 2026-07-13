const brandModules = import.meta.glob('../assets/brands/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function brandSortKey(path: string): number {
  const match = path.match(/(\d+)\.(png|jpe?g)$/i);
  return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

export const BRAND_IMAGES = Object.entries(brandModules)
  .sort(([a], [b]) => brandSortKey(a) - brandSortKey(b))
  .map(([, src]) => src);

export const BRAND_ROW_ONE = BRAND_IMAGES.slice(0, Math.ceil(BRAND_IMAGES.length / 2));
export const BRAND_ROW_TWO = BRAND_IMAGES.slice(Math.ceil(BRAND_IMAGES.length / 2));
