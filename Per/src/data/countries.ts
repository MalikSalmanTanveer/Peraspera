export interface ServedCountry {
  name: string;
  code: string;
}

/** Geographic / market order — not alphabetical */
export const SERVED_COUNTRIES: ServedCountry[] = [
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Chile', code: 'CL' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Ireland', code: 'IE' },
  { name: 'France', code: 'FR' },
  { name: 'Germany', code: 'DE' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Austria', code: 'AT' },
  { name: 'Italy', code: 'IT' },
  { name: 'Spain', code: 'ES' },
  { name: 'Poland', code: 'PL' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Romania', code: 'RO' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Norway', code: 'NO' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Finland', code: 'FI' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'India', code: 'IN' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Vietnam', code: 'VN' },
];

export const GLOBAL_REACH_STATS = [
  { value: '29', label: 'Countries Worldwide' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '8+', label: 'Years of Experience' },
  { value: '200+', label: 'International Clients' },
] as const;

export const GLOBAL_MAP_COUNTRIES = SERVED_COUNTRIES.map((c) => c.name);
