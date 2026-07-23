export const BRAND = {
  name: 'Peraspera',
  legalName: 'Peraspera Labs',
  tagline:
    'A design and product studio building brands, websites, SaaS platforms, and AI systems — with clarity through every challenge.',
  labsLabel: 'Peraspera Labs',
  labsUrl: '/labs',
  contact: {
    name: 'Peraspera Studio',
    role: 'Partnerships & Project Lead',
  },
  email: 'contact.peraspera@gmail.com',
  whatsapp: {
    phoneE164: '+923191413128',
    display: '+92 319 1413128',
    href: 'https://wa.me/923191413128',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/peraspera.solutions/',
    instagram: 'https://www.instagram.com/peraspera.official/',
  },
} as const;

export const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    icon: 'linkedin',
    href: BRAND.social.linkedin,
  },
  {
    label: 'Instagram',
    icon: 'instagram',
    href: BRAND.social.instagram,
  },
] as const;

export const HERO_COPY = {
  eyebrow: 'AI · Software · Automation · Finance · Brand',
  headline: 'Building',
  headlineAccent: 'Intelligent Systems',
  headlineEnd: 'for the Businesses of Tomorrow.',
  subheading:
    'Per Aspera designs connected ecosystems where AI, software, automation, finance, and branding work together as one intelligent system.',
  primaryCta: { label: 'Explore Solutions', href: '/services' },
  secondaryCta: { label: 'See Our Vision', href: '/about' },
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blogs', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Labs', href: '/labs', isLabs: true },
] as const;

export const HERO_STATS = [
  { value: '30+', label: 'Creative Deliverables' },
  { value: '48h', label: 'Fast First Delivery' },
  { value: '6', label: 'Service Categories' },
  { value: '100%', label: 'Source File Ownership' },
] as const;
