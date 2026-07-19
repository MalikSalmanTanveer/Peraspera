import type { AppIconName } from '../components/AppIcon';

export const LABS_HERO = {
  eyebrow: 'AI Innovation Lab',
  title: 'Per Aspera Labs',
  tagline: 'Where we prototype the systems clients ship tomorrow.',
  summary:
    'Per Aspera Labs is our research and development division, where ideas become intelligent systems. We explore emerging technologies, develop AI driven products, and experiment with new ways to solve real business problems. Every prototype, framework, and automation begins here before evolving into solutions that create measurable impact.',
  homeSummary:
    'Before a product reaches your roadmap, it gets built, broken, and refined inside Labs — so what we deliver is already proven under real constraints.',
} as const;

export const LABS_HOME_STATS = [
  { value: '4+', label: 'Live AI experiments' },
  { value: 'R&D', label: 'First, studio second' },
  { value: '48h', label: 'Prototype cadence' },
] as const;

export const LABS_HOME_EXPERIMENTS = [
  'Sketch-to-Face AI',
  'SecureScan AI',
  'Medical Imaging AI',
  'Low-Light Vision',
] as const;

export interface LabsPillar {
  title: string;
  description: string;
  icon: AppIconName;
}

export const LABS_PILLARS: LabsPillar[] = [
  {
    title: 'AI Research',
    description:
      'Advancing intelligent systems through continuous exploration and experimentation.',
    icon: 'Brain',
  },
  {
    title: 'Product Innovation',
    description: 'Designing and validating software concepts that solve meaningful problems.',
    icon: 'Rocket',
  },
  {
    title: 'Rapid Prototyping',
    description: 'Turning promising ideas into functional products with speed and precision.',
    icon: 'Zap',
  },
  {
    title: 'Automation Engineering',
    description: 'Creating AI powered workflows that improve efficiency and scale operations.',
    icon: 'Bot',
  },
];
