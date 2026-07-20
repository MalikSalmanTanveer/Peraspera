export type MeasuredImpactStatType = 'integer' | 'rating';

export interface MeasuredImpactStat {
  id: string;
  value: number;
  type: MeasuredImpactStatType;
  suffix?: string;
  label: string;
  description: string;
}

export const MEASURED_IMPACT_EYEBROW = 'ESTABLISHED THROUGH EXPERIENCE';

export const MEASURED_IMPACT_COPY = {
  title: 'Measured Impact',
  subtitle:
    'Every number represents years of experience, meaningful collaborations, and intelligent systems engineered across industries.',
} as const;

export const MEASURED_IMPACT_STATS: MeasuredImpactStat[] = [
  {
    id: 'countries',
    value: 29,
    type: 'integer',
    suffix: '+',
    label: 'Countries Served',
    description: 'Helping businesses build smarter systems across the globe.',
  },
  {
    id: 'projects',
    value: 500,
    type: 'integer',
    suffix: '+',
    label: 'Projects Delivered',
    description: 'Years of solving real business challenges through technology.',
  },
  {
    id: 'rating',
    value: 4.9,
    type: 'rating',
    label: 'Average Client Rating',
    description: 'Built on trust, consistency, and long-term partnerships.',
  },
  {
    id: 'businesses',
    value: 200,
    type: 'integer',
    suffix: '+',
    label: 'Businesses Served',
    description: 'From startups to established enterprises.',
  },
];
