export type WorkCategory =
  | 'Websites'
  | 'Real Estate'
  | 'Education'
  | 'eCommerce'
  | 'Tourism'
  | 'Food & Restaurants';

export interface ClientWork {
  id: string;
  title: string;
  url: string;
  category: WorkCategory;
  services: string[];
  description: string;
  testimonial: {
    quote: string;
    name: string;
    role: string;
  };
  featured?: boolean;
  span?: 'large' | 'standard';
}

export const WORK_CATEGORIES: Array<WorkCategory | 'All'> = [
  'All',
  'Websites',
  'Real Estate',
  'Education',
  'eCommerce',
  'Tourism',
  'Food & Restaurants',
];

export const CLIENT_WORKS: ClientWork[] = [
  {
    id: 'ajl-tours',
    title: 'AJL Tours',
    url: 'https://ajl-tours-frontend.vercel.app/',
    category: 'Tourism',
    services: ['Web Design', 'UI/UX', 'Booking Flow'],
    description:
      'A modern tourism platform with destination showcases, tour packages, and a streamlined booking experience.',
    testimonial: {
      quote:
        'Peraspera delivered a polished travel website that makes our packages easy to browse and book online.',
      name: 'AJL Tours Team',
      role: 'Tourism & Travel',
    },
    featured: true,
    span: 'large',
  },
  {
    id: 'hildes',
    title: 'Hildes',
    url: 'https://www.hildes.io/',
    category: 'Websites',
    services: ['Web Design', 'Branding', 'Development'],
    description:
      'A clean, professional web presence built to communicate services with clarity and credibility.',
    testimonial: {
      quote:
        'The new site feels premium and professional — exactly the impression we wanted to leave with clients.',
      name: 'Hildes',
      role: 'Business Services',
    },
    featured: true,
    span: 'large',
  },
  {
    id: 'karynsuarez',
    title: 'Karyn Suarez',
    url: 'https://karynsuarez.com/',
    category: 'Websites',
    services: ['Personal Brand', 'Web Design', 'UI/UX'],
    description:
      'A personal brand website with strong visual identity, clear positioning, and conversion-focused layout.',
    testimonial: {
      quote:
        'My website finally reflects my brand voice. The design is elegant and the structure is easy to navigate.',
      name: 'Karyn Suarez',
      role: 'Personal Brand Client',
    },
  },
  {
    id: 'bajodigital',
    title: 'Bajo Digital',
    url: 'https://www.bajodigital.com/',
    category: 'Websites',
    services: ['Agency Website', 'Web Design', 'Development'],
    description:
      'A digital agency site designed to showcase services, build trust, and drive inbound project inquiries.',
    testimonial: {
      quote:
        'Our agency site now looks as sharp as the work we deliver. Lead quality improved after launch.',
      name: 'Bajo Digital',
      role: 'Digital Agency',
    },
  },
  {
    id: 'rootsraices',
    title: 'Roots Raíces',
    url: 'https://rootsraices.com/',
    category: 'Real Estate',
    services: ['Real Estate Web', 'Branding', 'Lead Capture'],
    description:
      'A real estate brand site with property positioning, lead forms, and a trustworthy visual system.',
    testimonial: {
      quote:
        'The website gives our brand a premium feel and helps us present listings with much more confidence.',
      name: 'Roots Raíces',
      role: 'Real Estate',
    },
  },
  {
    id: 'manchester',
    title: 'Manchester Properties',
    url: 'https://manchester.us/',
    category: 'Real Estate',
    services: ['Property Website', 'Web Design', 'UI/UX'],
    description:
      'A property-focused website built to highlight listings, services, and regional market expertise.',
    testimonial: {
      quote:
        'Clean design, fast delivery, and a site that finally matches the quality of our property portfolio.',
      name: 'Manchester Team',
      role: 'Real Estate',
    },
  },
  {
    id: 'opal-properties',
    title: 'Opal Properties',
    url: 'https://opal-properties.com/',
    category: 'Real Estate',
    services: ['Real Estate Web', 'Brand Design', 'Development'],
    description:
      'A refined real estate website with strong typography, listing presentation, and contact flows.',
    testimonial: {
      quote:
        'Peraspera understood our market and built a site that feels established and easy for buyers to use.',
      name: 'Opal Properties',
      role: 'Real Estate',
    },
  },
  {
    id: 'viridianre',
    title: 'Viridian Real Estate',
    url: 'https://viridianre.net/',
    category: 'Real Estate',
    services: ['Real Estate Web', 'Web Design', 'SEO'],
    description:
      'A modern real estate platform focused on listings, agent credibility, and inquiry conversion.',
    testimonial: {
      quote:
        'Our online presence looks professional and the layout makes it simple for clients to reach out.',
      name: 'Viridian RE',
      role: 'Real Estate',
    },
  },
  {
    id: 'fiestafood',
    title: 'Fiesta Food',
    url: 'https://fiestafood.vercel.app/',
    category: 'Food & Restaurants',
    services: ['Restaurant Web', 'Menu UX', 'Web Design'],
    description:
      'A vibrant food brand website with menu presentation, brand storytelling, and mobile-first layout.',
    testimonial: {
      quote:
        'The site captures our brand energy perfectly. Customers comment on how easy it is to explore our menu.',
      name: 'Fiesta Food',
      role: 'Restaurant Brand',
    },
  },
  {
    id: 'niksjewel',
    title: "Nik's Jewel",
    url: 'https://niksjewel.com/',
    category: 'eCommerce',
    services: ['eCommerce Web', 'Product UI', 'Brand Design'],
    description:
      'A jewelry eCommerce experience with product-focused visuals, trust elements, and polished shopping flow.',
    testimonial: {
      quote:
        'Our jewelry store looks luxurious online. Product pages and checkout feel smooth on every device.',
      name: "Nik's Jewel",
      role: 'eCommerce Brand',
    },
    featured: true,
    span: 'standard',
  },
];

export const FEATURED_CLIENT_WORKS = CLIENT_WORKS.filter((work) => work.featured);

export const WORKS_PAGE_STATS = [
  { value: '10', label: 'Live Client Projects' },
  { value: '6', label: 'Industries Served' },
  { value: '100%', label: 'Responsive Builds' },
  { value: '48h', label: 'Fast First Delivery' },
] as const;

/** Local screenshot in /public/works, with thum.io fallback */
export function workScreenshotSrc(id: string): string {
  return `/works/${id}.png`;
}

export function workScreenshotFallback(url: string): string {
  const clean = url.replace(/^https?:\/\//, '');
  return `https://image.thum.io/get/width/960/crop/720/noanimate/${clean}`;
}
