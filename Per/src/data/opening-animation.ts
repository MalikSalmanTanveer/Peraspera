import { HERO_STATS } from './site';
import { SERVICE_CATEGORIES } from './services';
import { SERVED_COUNTRIES } from './countries';

export type OpeningCardVariant = 'ink' | 'paper' | 'accent';

export interface OpeningAnimationCard {
  id: string;
  variant: OpeningCardVariant;
  section: string;
  title: string;
}

export const OPENING_PROCESS_STEPS = [
  { number: '1', label: 'DISCOVER' },
  { number: '2', label: 'DIRECTION' },
  { number: '3', label: 'DESIGN' },
] as const;

export const OPENING_SERVICE_LINES = SERVICE_CATEGORIES.slice(0, 5).map((category) => ({
  label: category.shortCategory.toUpperCase(),
  detail: category.title,
}));

export const OPENING_METRICS = HERO_STATS.map((stat) => ({
  value: stat.value,
  label: stat.label.toUpperCase(),
}));

export const OPENING_MARKETS = SERVED_COUNTRIES.slice(0, 6).map((country, index) => ({
  name: country.name.toUpperCase(),
  share: `${Math.max(12, 34 - index * 4)}%`,
}));

export const OPENING_CARDS: OpeningAnimationCard[] = [
  { id: 'process', variant: 'ink', section: '2.4', title: 'PROCESS' },
  { id: 'services', variant: 'paper', section: '2.2', title: 'SERVICES' },
  { id: 'metrics', variant: 'ink', section: '4.1', title: 'METRICS' },
  { id: 'brand', variant: 'accent', section: '1.0', title: 'BRAND' },
  { id: 'vision', variant: 'paper', section: '1.2', title: 'VISION' },
];

export const OPENING_VISION_LINES = [
  'INTELLIGENT SYSTEMS',
  'FOR THE BUSINESSES',
  'OF TOMORROW.',
] as const;
