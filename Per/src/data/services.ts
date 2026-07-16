import type { AppIconName } from '../components/AppIcon';

export interface ServiceOfferingDetail {
  description: string;
  deliverables: string[];
}

export interface ServiceCategory {
  id: string;
  title: string;
  shortCategory: string;
  icon: AppIconName;
  iconClass: string;
  offerings: string[];
  offeringDetails: ServiceOfferingDetail[];
  linkLabel: string;
  gradient: string;
  tagline: string;
  overview: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    shortCategory: 'AI',
    icon: 'Bot',
    iconClass: 'bg-mega-icon-ai',
    tagline: 'Intelligent systems that save time and scale operations.',
    overview:
      'We design and deploy AI-powered workflows that connect your tools, automate repetitive tasks, and keep your team focused on high-value work — from chatbots to full CRM automation.',
    offerings: [
      'AI Chatbots',
      'Workflow Automation',
      'CRM Automation',
      'WhatsApp Automation',
      'Lead Generation',
    ],
    offeringDetails: [
      {
        description:
          'Custom AI assistants trained on your business context — handling support, FAQs, and lead qualification around the clock.',
        deliverables: ['Conversation flows', 'Knowledge base setup', 'Multi-channel deployment'],
      },
      {
        description:
          'End-to-end automation pipelines that connect apps, trigger actions, and eliminate manual handoffs between teams.',
        deliverables: ['Process mapping', 'Zapier/Make workflows', 'Monitoring & alerts'],
      },
      {
        description:
          'CRM integrations that auto-tag leads, assign tasks, send follow-ups, and keep your pipeline moving without manual entry.',
        deliverables: ['CRM setup', 'Auto-assignment rules', 'Email & task triggers'],
      },
      {
        description:
          'WhatsApp Business automation for order updates, appointment reminders, support replies, and broadcast campaigns.',
        deliverables: ['Message templates', 'Auto-replies', 'Broadcast sequences'],
      },
      {
        description:
          'AI-assisted lead capture systems that qualify prospects, enrich contact data, and route hot leads to your sales team.',
        deliverables: ['Lead forms', 'Scoring logic', 'CRM sync'],
      },
    ],
    linkLabel: 'Explore AI',
    gradient: 'from-red-400/20 via-rose-300/15 to-orange-200/25',
  },
  {
    id: 'branding',
    title: 'Branding & Creative',
    shortCategory: 'Branding',
    icon: 'Sparkles',
    iconClass: 'bg-mega-icon-brand',
    tagline: 'Visual identity that makes your brand impossible to ignore.',
    overview:
      'From first impression to every touchpoint, we craft cohesive brand systems — logos, guidelines, packaging, and marketing assets that communicate who you are with clarity and confidence.',
    offerings: [
      'Brand Identity',
      'Logo Design',
      'Brand Guidelines',
      'Packaging Design',
      'Marketing Assets',
    ],
    offeringDetails: [
      {
        description:
          'A complete visual foundation — color palette, typography, imagery style, and voice — built to scale across every channel.',
        deliverables: ['Mood boards', 'Color & type systems', 'Brand architecture'],
      },
      {
        description:
          'Distinctive logo marks and wordmarks designed for versatility across digital, print, and merchandise applications.',
        deliverables: ['Primary & secondary logos', 'Icon variants', 'Export files (SVG, PNG)'],
      },
      {
        description:
          'A living document that keeps your team and partners aligned on how to use your brand correctly and consistently.',
        deliverables: ['Usage rules', 'Do/don\'t examples', 'Asset library'],
      },
      {
        description:
          'Shelf-ready packaging that tells your product story and stands out in competitive retail and eCommerce environments.',
        deliverables: ['Structural concepts', 'Print-ready artwork', 'Mockup renders'],
      },
      {
        description:
          'Campaign-ready creatives — social posts, banners, pitch decks, and ad sets — designed to match your brand system.',
        deliverables: ['Social templates', 'Ad creatives', 'Presentation decks'],
      },
    ],
    linkLabel: 'Explore Branding',
    gradient: 'from-amber-400/30 via-orange-300/20 to-yellow-200/30',
  },
  {
    id: 'ui-ux',
    title: 'UI / UX Design',
    shortCategory: 'Design',
    icon: 'Hexagon',
    iconClass: 'bg-mega-icon-ux',
    tagline: 'Interfaces people understand — and actually enjoy using.',
    overview:
      'We research how users think, map clear journeys, and design polished interfaces that reduce friction and increase conversion across web and mobile products.',
    offerings: ['UX Research', 'Wireframing', 'UI Design', 'Design Systems', 'UX Audits'],
    offeringDetails: [
      {
        description:
          'User interviews, journey mapping, and competitive analysis to uncover what your audience needs before a single pixel is placed.',
        deliverables: ['User personas', 'Journey maps', 'Research report'],
      },
      {
        description:
          'Low-fidelity layouts that validate structure, navigation, and content hierarchy before investing in visual design.',
        deliverables: ['Screen flows', 'Clickable prototypes', 'Feedback rounds'],
      },
      {
        description:
          'High-fidelity interface design with attention to typography, spacing, states, and responsive behavior across devices.',
        deliverables: ['Figma UI files', 'Component specs', 'Dev handoff'],
      },
      {
        description:
          'Reusable component libraries and token systems that keep your product visually consistent as it grows.',
        deliverables: ['Component library', 'Design tokens', 'Documentation'],
      },
      {
        description:
          'Expert review of your existing product to identify usability issues, accessibility gaps, and conversion blockers.',
        deliverables: ['Heuristic review', 'Priority fixes', 'Action plan'],
      },
    ],
    linkLabel: 'Explore UI/UX',
    gradient: 'from-violet-400/30 via-purple-300/20 to-indigo-200/30',
  },
  {
    id: 'web',
    title: 'Web Design & Development',
    shortCategory: 'Web',
    icon: 'Globe',
    iconClass: 'bg-mega-icon-web',
    tagline: 'Websites that look premium and perform under pressure.',
    overview:
      'We design and build fast, responsive websites — from corporate sites and landing pages to full eCommerce stores — optimized for SEO, conversion, and long-term maintainability.',
    offerings: [
      'Corporate Websites',
      'Landing Pages',
      'E-commerce Stores',
      'CMS Development',
      'SEO Optimization',
    ],
    offeringDetails: [
      {
        description:
          'Multi-page company websites with clear service positioning, team pages, case studies, and contact flows built for credibility.',
        deliverables: ['Custom design', 'Responsive build', 'CMS integration'],
      },
      {
        description:
          'High-converting single-page experiences for product launches, campaigns, and lead capture with focused messaging.',
        deliverables: ['Hero & CTA design', 'A/B-ready layout', 'Analytics setup'],
      },
      {
        description:
          'Full online stores on Shopify, WooCommerce, or custom stacks — product pages, checkout, and inventory-ready structure.',
        deliverables: ['Store setup', 'Payment integration', 'Product templates'],
      },
      {
        description:
          'Content management systems that let your team update pages, blogs, and media without touching code.',
        deliverables: ['Admin dashboard', 'Content models', 'Editor training'],
      },
      {
        description:
          'Technical and on-page SEO — meta structure, schema markup, Core Web Vitals, and content recommendations for ranking.',
        deliverables: ['SEO audit', 'On-page fixes', 'Performance report'],
      },
    ],
    linkLabel: 'Explore Web',
    gradient: 'from-blue-400/30 via-sky-300/20 to-cyan-200/30',
  },
  {
    id: 'saas-product',
    title: 'SaaS & Product Development',
    shortCategory: 'Product',
    icon: 'Rocket',
    iconClass: 'bg-mega-icon-mvp',
    tagline: 'From MVP to production — products built to ship and scale.',
    overview:
      'We help founders and product teams go from idea to live software — MVPs, dashboards, admin panels, and full web applications with clear architecture and room to grow.',
    offerings: [
      'SaaS MVP',
      'Dashboard Systems',
      'Admin Panels',
      'Web Applications',
      'Product Strategy',
    ],
    offeringDetails: [
      {
        description:
          'Lean first versions with core features only — designed to validate your idea fast and attract early users or investors.',
        deliverables: ['Feature scoping', 'MVP build', 'Launch support'],
      },
      {
        description:
          'Data-rich interfaces with charts, filters, real-time updates, and role-based views for analytics and operations teams.',
        deliverables: ['Dashboard UI', 'API integration', 'Role permissions'],
      },
      {
        description:
          'Back-office tools for managing users, content, orders, and settings — built for non-technical team members.',
        deliverables: ['Admin UI', 'CRUD operations', 'Audit logs'],
      },
      {
        description:
          'Full-stack web applications with authentication, databases, APIs, and deployment pipelines ready for production.',
        deliverables: ['Frontend & backend', 'Database schema', 'Deployment config'],
      },
      {
        description:
          'Roadmap planning, feature prioritization, and technical architecture guidance before development begins.',
        deliverables: ['Product brief', 'Tech stack recommendation', 'Sprint plan'],
      },
    ],
    linkLabel: 'Explore SaaS',
    gradient: 'from-teal-400/30 via-cyan-300/20 to-sky-200/30',
  },
  {
    id: 'finance',
    title: 'Finance',
    shortCategory: 'Finance',
    icon: 'Landmark',
    iconClass: 'bg-mega-icon-finance',
    tagline: 'Financial systems that keep your business organized and audit-ready.',
    overview:
      'We set up bookkeeping workflows, invoicing systems, and finance dashboards — connecting QuickBooks, Xero, and your business tools so numbers stay accurate and decisions stay clear.',
    offerings: [
      'Bookkeeping & Accounting',
      'Financial Reporting',
      'Invoicing & Billing',
      'Tax Preparation Support',
      'Finance Dashboards',
    ],
    offeringDetails: [
      {
        description:
          'Structured bookkeeping with chart of accounts, reconciliations, and monthly close processes tailored to your business model.',
        deliverables: ['Chart of accounts', 'Monthly reconciliations', 'Expense categorization'],
      },
      {
        description:
          'P&L statements, balance sheets, and cash-flow reports formatted for owners, investors, and stakeholders.',
        deliverables: ['Monthly reports', 'KPI summaries', 'Export-ready statements'],
      },
      {
        description:
          'Automated invoicing, payment tracking, and billing workflows integrated with your CRM or project tools.',
        deliverables: ['Invoice templates', 'Payment reminders', 'Receivables tracking'],
      },
      {
        description:
          'Organized records and documentation support to simplify tax season and compliance reviews.',
        deliverables: ['Document organization', 'Deduction tracking', 'Year-end prep'],
      },
      {
        description:
          'Custom finance dashboards that surface revenue, expenses, and runway in one clear view.',
        deliverables: ['Dashboard design', 'Tool integrations', 'Automated data sync'],
      },
    ],
    linkLabel: 'Explore Finance',
    gradient: 'from-emerald-400/25 via-green-300/15 to-lime-200/25',
  },
  {
    id: 'ai-creative',
    title: 'AI Creative Studio',
    shortCategory: 'Creative',
    icon: 'Clapperboard',
    iconClass: 'bg-mega-icon-video',
    tagline: 'AI-powered visuals and video content at studio quality.',
    overview:
      'Our creative studio combines AI tools with human art direction to produce images, videos, motion graphics, and social content — faster than traditional production without sacrificing polish.',
    offerings: ['AI Images', 'AI Videos', 'Motion Graphics', 'Reels & Shorts', 'Product Videos'],
    offeringDetails: [
      {
        description:
          'Custom AI-generated imagery for campaigns, product shots, social content, and brand storytelling with consistent style.',
        deliverables: ['Prompt libraries', 'Styled image sets', 'High-res exports'],
      },
      {
        description:
          'AI-assisted video production for explainers, ads, and brand films — scripted, storyboarded, and edited to brief.',
        deliverables: ['Storyboard', 'Edited video', 'Multiple formats'],
      },
      {
        description:
          'Animated logos, lower thirds, transitions, and UI motion that bring your brand and product interfaces to life.',
        deliverables: ['After Effects files', 'Lottie exports', 'Brand motion kit'],
      },
      {
        description:
          'Vertical-first content optimized for Instagram Reels, TikTok, YouTube Shorts, and paid social campaigns.',
        deliverables: ['Script & hooks', '9:16 edits', 'Caption variants'],
      },
      {
        description:
          'Studio-style product showcases with lighting, angles, and motion designed to drive eCommerce conversions.',
        deliverables: ['Product shots', '360° views', 'Ad-ready cuts'],
      },
    ],
    linkLabel: 'Explore Creative',
    gradient: 'from-pink-400/25 via-fuchsia-300/15 to-purple-200/25',
  },
];

export const SERVICE_CATEGORY_TITLES = SERVICE_CATEGORIES.map((category) => category.title);

export function formatOfferings(offerings: string[]): string {
  return `${offerings.join(', ')}.`;
}

const LINK_ICONS: AppIconName[] = [
  'Zap',
  'Bot',
  'Cpu',
  'Layers',
  'Search',
  'LayoutGrid',
  'Globe',
  'Smartphone',
  'Cloud',
  'Palette',
  'PenTool',
  'Megaphone',
  'Image',
  'Video',
  'Clapperboard',
  'Server',
  'Rocket',
  'Sparkles',
  'Hexagon',
];

export function offeringIcon(index: number): AppIconName {
  return LINK_ICONS[index % LINK_ICONS.length];
}

export const MEGA_POPULAR_PILLS = [
  'AI & Automation',
  'Branding & Creative',
  'UI / UX Design',
  'Web Design & Development',
  'SaaS & Product Development',
  'Finance',
] as const;

export const SERVICES_PAGE_STATS = [
  { value: '7', label: 'Service Categories' },
  { value: '35', label: 'Specialized Offerings' },
  { value: '48h', label: 'First Delivery' },
  { value: '100%', label: 'Source File Ownership' },
] as const;
