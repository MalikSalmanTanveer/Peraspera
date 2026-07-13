import type { AppIconName } from '../components/AppIcon';
import { SERVICE_CATEGORIES, formatOfferings } from './services';

export interface ServiceItem {
  category: string;
  title: string;
  description: string;
  linkLabel: string;
  gradient: string;
}

export const SERVICES: ServiceItem[] = SERVICE_CATEGORIES.map((category) => ({
  category: category.shortCategory,
  title: category.title,
  description: formatOfferings(category.offerings),
  linkLabel: category.linkLabel,
  gradient: category.gradient,
}));

export interface PortfolioItem {
  title: string;
  category: string;
  span: string;
  gradient: string;
  imageIndex?: number;
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    title: 'Premium Product Brand',
    category: 'Brand Identity',
    span: 'col-span-7 row-span-2',
    gradient: 'from-amber-600/80 via-orange-700/60 to-ink/90',
    imageIndex: 0,
  },
  {
    title: 'Mobile App Interface',
    category: 'UI/UX',
    span: 'col-span-5',
    gradient: 'from-violet-600/80 via-purple-700/60 to-ink/90',
    imageIndex: 1,
  },
  {
    title: 'Analytics Product UI',
    category: 'SaaS Dashboard',
    span: 'col-span-5',
    gradient: 'from-emerald-600/80 via-teal-700/60 to-ink/90',
    imageIndex: 2,
  },
  {
    title: 'Peraspera Landing Page',
    category: 'Website',
    span: 'col-span-4',
    gradient: 'from-blue-600/80 via-sky-700/60 to-ink/90',
    imageIndex: 3,
  },
  {
    title: 'Campaign Visuals',
    category: 'Marketing',
    span: 'col-span-4',
    gradient: 'from-rose-600/80 via-pink-700/60 to-ink/90',
    imageIndex: 0,
  },
  {
    title: 'Video & Social Assets',
    category: 'Motion',
    span: 'col-span-4',
    gradient: 'from-orange-600/80 via-amber-700/60 to-ink/90',
    imageIndex: 1,
  },
];

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discovery',
    description:
      'We learn your brand, audience, goals, service needs, and project requirements.',
  },
  {
    number: '02',
    title: 'Direction',
    description:
      'We define creative style, structure, deliverables, timeline, and technical scope.',
  },
  {
    number: '03',
    title: 'Design',
    description:
      'Our team creates polished visuals, UI, website sections, or marketing assets.',
  },
  {
    number: '04',
    title: 'Build',
    description:
      'For web, apps, SaaS, and AI systems, we develop, connect, and test the solution.',
  },
  {
    number: '05',
    title: 'Launch',
    description:
      'We deliver exports, source files, live pages, code, or automation workflows.',
  },
] as const;

export const WHY_STATS = [
  { value: '3x', label: 'Faster creative execution' },
  { value: '120+', label: 'Service deliverables' },
  { value: '24/7', label: 'AI automation support' },
  { value: '1', label: 'Unified creative team' },
] as const;

export const INDUSTRIES: { icon: AppIconName; label: string }[] = [
  { icon: 'HeartPulse', label: 'Healthcare & Medical' },
  { icon: 'Building2', label: 'Construction' },
  { icon: 'Building2', label: 'Real Estate' },
  { icon: 'ShoppingBag', label: 'eCommerce' },
  { icon: 'GraduationCap', label: 'Education' },
  { icon: 'Truck', label: 'Logistics' },
  { icon: 'UtensilsCrossed', label: 'Food & Restaurants' },
  { icon: 'Briefcase', label: 'Corporate Services' },
  { icon: 'Cpu', label: 'SaaS & Technology' },
  { icon: 'Sparkles', label: 'Beauty & Fashion' },
  { icon: 'Activity', label: 'Fitness & Wellness' },
  { icon: 'Scale', label: 'Legal & Consulting' },
];

export const TOOLS = [
  'Adobe Illustrator',
  'Adobe Photoshop',
  'Figma',
  'Adobe InDesign',
  'After Effects',
  'Premiere Pro',
  'WordPress',
  'Shopify',
  'Webflow',
  'Framer',
  'AI Visual Tools',
  'Automation APIs',
] as const;
