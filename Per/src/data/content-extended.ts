import type { AppIconName } from '../components/AppIcon';

export interface Testimonial {
  quote: string;
  initials: string;
  name: string;
  role: string;
  clientType: string;
  avatarColor: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'They helped us turn scattered brand ideas into a clean identity and professional website.',
    initials: 'SF',
    name: 'Startup Founder',
    role: 'Brand Identity Client',
    clientType: 'Brand Identity Client',
    avatarColor: 'bg-violet-600',
  },
  {
    quote:
      'The UI direction made our product easier to understand and much better for investor demos.',
    initials: 'PT',
    name: 'Product Team',
    role: 'SaaS Design Client',
    clientType: 'SaaS Design Client',
    avatarColor: 'bg-blue-600',
  },
  {
    quote:
      'Fast communication, polished visuals, and a clear process from brief to final delivery.',
    initials: 'AP',
    name: 'Agency Partner',
    role: 'Automation Client',
    clientType: 'Automation Client',
    avatarColor: 'bg-emerald-600',
  },
  {
    quote:
      'Our service page, brochure, and campaign graphics finally feel like one premium brand.',
    initials: 'ML',
    name: 'Marketing Lead',
    role: 'Creative Design Client',
    clientType: 'Creative Design Client',
    avatarColor: 'bg-rose-600',
  },
  {
    quote:
      'The website redesign improved trust and made our services easier for customers to scan.',
    initials: 'BO',
    name: 'Business Owner',
    role: 'Website Design Client',
    clientType: 'Website Design Client',
    avatarColor: 'bg-amber-600',
  },
  {
    quote:
      'A reliable creative partner for monthly design, web updates, and launch assets.',
    initials: 'OT',
    name: 'Operations Team',
    role: 'Monthly Support Client',
    clientType: 'Monthly Support Client',
    avatarColor: 'bg-indigo-600',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What does Peraspera do?',
    answer:
      'Peraspera offers AI & automation, branding & creative, UI/UX design, web design & development, SaaS & product development, and AI creative studio services.',
  },
  {
    question: 'Do you offer monthly retainers?',
    answer:
      'Yes. Peraspera offers monthly retainer plans for teams that need ongoing design, development, AI automation, marketing, finance, and product support.',
  },
  {
    question: 'Can Peraspera handle both design and development?',
    answer:
      'Yes. Peraspera supports design and development for websites, dashboards, SaaS platforms, mobile apps, MVPs, automation systems, and business operations.',
  },
  {
    question: 'Do I own the final files?',
    answer:
      'Yes. Final exports and editable source files can be included based on the agreed project scope and deliverables.',
  },
  {
    question: 'Can I request custom pricing?',
    answer:
      'Yes. Request a custom quote for branding, websites, UI/UX, AI automation, SaaS, apps, or combined packages from the Peraspera team.',
  },
];

export const WHATSAPP_REGIONS = [
  { country: 'Pakistan', flag: '🇵🇰' },
  { country: 'United Kingdom', flag: '🇬🇧' },
  { country: 'USA', flag: '🇺🇸' },
  { country: 'Dubai', flag: '🇦🇪' },
] as const;

export const SERVICE_OPTIONS: { icon: AppIconName; label: string }[] = [
  { icon: 'Bot', label: 'AI & Automation' },
  { icon: 'Sparkles', label: 'Branding & Creative' },
  { icon: 'Hexagon', label: 'UI / UX Design' },
  { icon: 'Globe', label: 'Web Design & Development' },
  { icon: 'Rocket', label: 'SaaS & Product Development' },
  { icon: 'Landmark', label: 'Finance' },
];

export const BUDGET_OPTIONS = [
  '$5K - $10K',
  '$10K - $20K',
  '$20K - $50K',
  '$50K - $100K',
  '$100K and up',
] as const;
