export interface ServedCountry {
  name: string;
  code: string;
  flag: string;
  /** Equirectangular map position (0–100) */
  mapX: number;
  mapY: number;
}

export const SERVED_COUNTRIES: ServedCountry[] = [
  { name: 'United States', code: 'US', flag: '🇺🇸', mapX: 22, mapY: 38 },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', mapX: 18, mapY: 28 },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', mapX: 47, mapY: 26 },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', mapX: 51, mapY: 28 },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', mapX: 62, mapY: 44 },
  { name: 'Pakistan', code: 'PK', flag: '🇵🇰', mapX: 66, mapY: 40 },
];
