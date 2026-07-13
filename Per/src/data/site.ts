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
  { label: 'Home', href: '#home' },
  { label: 'Service', href: '#services', hasMega: true },
  { label: 'Labs', href: '#peraspera-labs', isLabs: true },
  { label: 'Blog', href: '#blog' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact Us', href: '#contact' },
] as const;

import { SERVICE_CATEGORY_TITLES } from './services';

export const NAV_CATEGORIES = SERVICE_CATEGORY_TITLES;

export const HERO_STATS = [
  { value: '120+', label: 'Creative Deliverables' },
  { value: '48h', label: 'Fast First Delivery' },
  { value: '12', label: 'Service Categories' },
  { value: '100%', label: 'Source File Ownership' },
] as const;

export const TRUST_PILLS = [
  'AI & Automation',
  'Software Engineering',
  'Web & SaaS',
  'UI / UX',
  'Branding',
  'Digital Growth',
  'Strategy',
] as const;
