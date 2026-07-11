const brandModules = import.meta.glob('../assets/brands/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

export const BRAND_IMAGES = Object.values(brandModules);

export const BRAND_ROW_ONE = BRAND_IMAGES.slice(0, Math.ceil(BRAND_IMAGES.length / 2));
export const BRAND_ROW_TWO = BRAND_IMAGES.slice(Math.ceil(BRAND_IMAGES.length / 2));
