const brandModules = import.meta.glob('../assets/brands/*.{png,jpg,jpeg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const BRAND_NAMES: Record<number, string> = {
  1: 'Association Daystar',
  2: 'TFF Community',
  3: 'The Chocolate World',
  4: 'The Axbergs',
  5: 'Fiverr',
  6: 'Amplemarket',
  7: 'Meta',
  8: 'Porsche',
  9: 'NVIDIA',
  10: 'Antrosys',
  11: 'DevMach',
  12: 'Opal Properties',
  13: 'Roots Raíces',
  14: 'Manchester',
  15: 'Nik\'s Jewel',
  16: 'AJL Tours',
  17: 'Hildes',
  18: 'Bajo Digital',
  19: 'Fiesta Food',
  20: 'Viridian RE',
  21: 'Karyn Suarez',
  22: 'Pilates Splendor',
  23: 'YouTriedIt',
  24: 'PrestoBILINGUA',
};

function brandSortKey(path: string): number {
  const match = path.match(/(\d+)\.(png|jpe?g)$/i);
  return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

export interface BrandItem {
  src: string;
  name: string;
}

export const BRANDS: BrandItem[] = Object.entries(brandModules)
  .sort(([a], [b]) => brandSortKey(a) - brandSortKey(b))
  .map(([path, src]) => {
    const match = path.match(/(\d+)\.(png|jpe?g)$/i);
    const index = match ? parseInt(match[1], 10) : 0;
    return {
      src,
      name: BRAND_NAMES[index] ?? `Partner ${index || ''}`.trim(),
    };
  });

export const BRAND_ROW_ONE = BRANDS.slice(0, Math.ceil(BRANDS.length / 2));
export const BRAND_ROW_TWO = BRANDS.slice(Math.ceil(BRANDS.length / 2));
