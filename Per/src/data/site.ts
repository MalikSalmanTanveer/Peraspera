export const BRAND = {
  name: 'Peraspera',
  legalName: 'Peraspera Labs',
  tagline:
    'A design and product studio building brands, websites, SaaS platforms, and AI systems — with clarity through every challenge.',
  labsLabel: 'Peraspera Labs',
  labsUrl: '#peraspera-labs',
  contact: {
    name: 'Peraspera Studio',
    role: 'Partnerships & Project Lead',
  },
  email: 'hello@peraspera.com',
} as const;

export const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Peraspera Labs', href: '#peraspera-labs', isLabs: true },
  { label: 'FAQ', href: '#faq' },
] as const;

export const NAV_CATEGORIES = [
  'UI/UX Design',
  'Brand Identity',
  'Web Design & Dev',
  'SaaS Development',
  'AI Automation',
  'AI Video',
  'Motion Design',
  'App Development',
  'MVP Development',
] as const;

export const HERO_STATS = [
  { value: '55+', label: 'Creative Deliverables' },
  { value: '48h', label: 'Fast First Delivery' },
  { value: '20+', label: 'Service Types' },
  { value: '100%', label: 'Source File Ownership' },
] as const;

export const TRUST_PILLS = [
  'Brand Identity',
  'UI/UX',
  'Websites',
  'AI Automation',
  'SaaS',
  'Apps',
  'MVPs',
] as const;
