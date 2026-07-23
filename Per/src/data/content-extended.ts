import type { AppIconName } from '../components/AppIcon';

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  role: string;
  avatarSrc?: string;
  initials: string;
  avatarColor: string;
  avatarFit?: 'cover' | 'contain';
  avatarShape?: 'circle' | 'square';
}

export const PORTFOLIO_REVIEWS_URL = '/portfolio#client-reviews';

/** Short quotes (Brandon, Karyn) fit fully; longer ones get a preview + read more link */
export const HOMEPAGE_REVIEW_CHAR_LIMIT = 150;

export function isHomeReviewPreview(quote: string): boolean {
  return quote.length > HOMEPAGE_REVIEW_CHAR_LIMIT;
}

export function getPortfolioReviewUrl(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `/portfolio#review-${slug}`;
}

export function reviewAnchorId(name: string): string {
  return getPortfolioReviewUrl(name).split('#')[1] ?? 'client-reviews';
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "It's always a pleasure working with Peraspera. They always deliver on time and provide me with exactly what I need to keep my business running.",
    name: 'Brandon Ruetsch',
    title: 'Sr. Solutions Engineer',
    role: 'Customer Success Manager at Amplemarket',
    avatarSrc: '/reviews/brandon-ruetsch.png',
    initials: 'BR',
    avatarColor: 'bg-slate-700',
  },
  {
    quote:
      "Excellent. It's the second time I've worked with them, and I will continue my collaboration for a long time. Professional and excellent work.",
    name: 'Karyn Suarez',
    title: 'International Keynote Speaker',
    role: 'Executive Communication & Public Speaking Coach',
    avatarSrc: '/reviews/karyn-suarez.png',
    initials: 'KS',
    avatarColor: 'bg-emerald-700',
  },
  {
    quote:
      "I'm really impressed with your work. You paid attention to every detail, delivered fast, and the graphics look premium and exactly on-brand. Thank you for the effort and great communication throughout the project. I'll definitely work with you again!",
    name: 'Kamila Glowa',
    title: 'Medical Performance Marketing Strategist @ Meta',
    role: 'Beauty & Cosmetics',
    avatarSrc: '/reviews/kamila-glowa.png',
    initials: 'KG',
    avatarColor: 'bg-rose-700',
  },
  {
    quote:
      'Peraspera consistently goes above and beyond, delivering excellence on every project. He is highly attuned to client needs and dependable, whether the task is large or small. His genuine commitment to using his talent ensures high-quality results every time I work with him.',
    name: 'Shereen Reynolds',
    title: 'Founder, YouTriedIt.co',
    role: 'Mental Health Advocate | Human Services Counseling',
    avatarSrc: '/reviews/shereen-reynolds.png',
    initials: 'SR',
    avatarColor: 'bg-violet-700',
  },
  {
    quote:
      'Peraspera delivered exceptional work with strategic business planning and professional execution that exceeded my expectations! Working with them was a pleasure. Their cooperation and deep understanding truly stood out.',
    name: 'Leticia Huber',
    title: 'Spanish Teacher',
    role: 'Founder of PrestoBILINGUA',
    avatarSrc: '/reviews/leticia-huber.png',
    initials: 'LH',
    avatarColor: 'bg-indigo-700',
  },
  {
    quote:
      'Working with Peraspera was another great experience! The professionalism, data interpretation, and presentation exceeded expectations, while their deep understanding and quick responsiveness made collaboration a breeze. HIGHLY recommend!',
    name: 'Alexandra Isobel',
    title: 'Writer',
    role: 'Romantic Fusion Writer and Poet',
    avatarSrc: '/reviews/alexandra-isobel.png',
    initials: 'AI',
    avatarColor: 'bg-amber-700',
  },
  {
    quote:
      'Working with Peraspera was a wonderful experience. My project was intensive and needed to align perfectly with my brand, all within a short timeframe. They delivered exactly what I needed, combining creativity, strong visual appeal, and quick responsiveness. The final result exceeded my expectations. I absolutely plan to work with them again in the future.',
    name: 'violalaura',
    title: 'Coordinator',
    role: 'School Coordinator and Event Manager',
    initials: 'VL',
    avatarColor: 'bg-teal-700',
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
      'Peraspera offers AI & automation, branding & creative, UI/UX design, web design & development, SaaS & product development, finance, and AI creative studio services.',
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

import { BRAND } from './site';

const WHATSAPP_PREFILL = encodeURIComponent(
  'Hi Peraspera — I would like to discuss a project with your team.',
);

const whatsappLink = `${BRAND.whatsapp.href}?text=${WHATSAPP_PREFILL}`;

export const WHATSAPP_REGIONS = [
  { country: 'Pakistan', flag: '🇵🇰', href: whatsappLink },
  { country: 'United Kingdom', flag: '🇬🇧', href: whatsappLink },
  { country: 'USA', flag: '🇺🇸', href: whatsappLink },
  { country: 'Dubai', flag: '🇦🇪', href: whatsappLink },
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
