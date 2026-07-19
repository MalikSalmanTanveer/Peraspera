import type { AppIconName } from '../components/AppIcon';

export const LABS_HERO = {
  eyebrow: 'Innovation Arm',
  title: 'Per Aspera Labs',
  tagline: 'Building Tomorrow, Before It\u2019s Needed.',
  summary:
    'Per Aspera Labs is our research and development division, where ideas become intelligent systems. We explore emerging technologies, develop AI driven products, and experiment with new ways to solve real business problems. Every prototype, framework, and automation begins here before evolving into solutions that create measurable impact.',
  homeSummary:
    'Our R&D division builds and stress-tests AI products, automation frameworks, and design systems before they ship to clients — so every Peraspera project starts from proven innovation, not guesswork.',
} as const;

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
