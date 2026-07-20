export type MeasuredImpactStatType = 'integer' | 'rating';

export interface MeasuredImpactStat {
  id: string;
  icon: string;
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
    icon: '🌍',
    value: 18,
    type: 'integer',
    suffix: '+',
    label: 'Countries Served',
    description: 'Helping businesses build smarter systems across the globe.',
  },
  {
    id: 'projects',
    icon: '🚀',
    value: 500,
    type: 'integer',
    suffix: '+',
    label: 'Projects Delivered',
    description: 'Years of solving real business challenges through technology.',
  },
  {
    id: 'rating',
    icon: '⭐',
    value: 4.9,
    type: 'rating',
    label: 'Average Client Rating',
    description: 'Built on trust, consistency, and long-term partnerships.',
  },
  {
    id: 'experience',
    icon: '💼',
    value: 7,
    type: 'integer',
    suffix: '+',
    label: 'Years of Experience',
    description: 'A journey shaped by hundreds of successful collaborations.',
  },
  {
    id: 'businesses',
    icon: '🏢',
    value: 200,
    type: 'integer',
    suffix: '+',
    label: 'Businesses Served',
    description: 'From startups to established enterprises.',
  },
  {
    id: 'industries',
    icon: '🏭',
    value: 35,
    type: 'integer',
    suffix: '+',
    label: 'Industries',
    description: 'Delivering solutions across diverse business sectors.',
  },
  {
    id: 'technologies',
    icon: '⚡',
    value: 25,
    type: 'integer',
    suffix: '+',
    label: 'Core Technologies',
    description: 'Modern technologies powering scalable digital ecosystems.',
  },
  {
    id: 'systems',
    icon: '🧠',
    value: 120,
    type: 'integer',
    suffix: '+',
    label: 'Business Systems Engineered',
    description: 'Connecting software, automation, AI, finance and operations.',
  },
];
