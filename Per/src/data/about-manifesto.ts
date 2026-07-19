export type LabStatus = 'LIVE' | 'BETA' | 'PROTOTYPE' | 'COMING SOON';

export interface LabsConcept {
  id: string;
  title: string;
  status: LabStatus;
  summary: string;
  detail: string;
}

export interface Observation {
  id: string;
  number: string;
  title: string;
  excerpt: string;
  href: string;
}

export const ABOUT_HERO = {
  headline: 'Engineering the Future of Intelligent Business.',
  subtext:
    'Per Aspera exists to rethink how businesses are built by connecting AI, software, automation, finance and creativity into one intelligent ecosystem.',
} as const;

export const PHILOSOPHY_TOOLS = [
  'Website',
  'Marketing',
  'CRM',
  'Finance',
  'Automation',
  'Software',
] as const;

export const TURNING_POINT = {
  intro: '2018+',
  lines: [
    'Hundreds of freelance projects.',
    'Different industries.',
    'Different businesses.',
    'Different technologies.',
  ],
  pattern: [
    'Disconnected systems.',
    'Manual work.',
    'Repeated inefficiencies.',
  ],
  reveal: [
    "The idea wasn't to build another agency.",
    'The idea was to engineer intelligent businesses.',
  ],
} as const;

export const MANIFESTO_BELIEFS = [
  {
    title: 'Technology should simplify.',
    text: 'Complexity is a design failure — not a badge of sophistication.',
  },
  {
    title: 'Automation should become invisible.',
    text: 'The best systems work quietly in the background while teams focus on what matters.',
  },
  {
    title: 'AI should amplify human creativity.',
    text: 'Intelligence should extend capability — not replace judgment.',
  },
  {
    title: 'Design should communicate clarity.',
    text: 'Every interface, asset, and interaction should reduce friction.',
  },
  {
    title: 'Finance should produce insight, not paperwork.',
    text: 'Numbers should guide decisions — not bury teams in admin.',
  },
  {
    title: 'Every business deserves connected systems.',
    text: 'Growth should not require stitching together disconnected vendors.',
  },
] as const;

export const CONNECTED_NODES = [
  'AI',
  'Software',
  'Automation',
  'Finance',
  'Analytics',
  'Branding',
  'Marketing',
  'Design',
  'SaaS',
  'CRM',
  'Web',
  'Mobile',
] as const;

export const DIFFERENCE_ROWS = [
  { traditional: 'Delivers projects', peraspera: 'Builds systems' },
  { traditional: 'Leaves after launch', peraspera: 'Continuous improvement' },
  { traditional: 'Separate vendors', peraspera: 'Everything connected' },
  { traditional: 'Disconnected services', peraspera: 'AI-first workflows' },
  { traditional: 'One-time work', peraspera: 'Long-term partnership' },
] as const;

export const LABS_CONCEPTS: LabsConcept[] = [
  {
    id: 'ai-accountant',
    title: 'AI Accountant',
    status: 'LIVE',
    summary: 'Automated bookkeeping and financial insight for growing teams.',
    detail:
      'An intelligent finance layer that categorizes transactions, surfaces anomalies, and produces actionable reports — reducing manual accounting work while improving visibility.',
  },
  {
    id: 'proposal-ai',
    title: 'Proposal AI',
    status: 'BETA',
    summary: 'Generate scoped proposals from brief conversations.',
    detail:
      'Turns discovery notes into structured proposals with timelines, deliverables, and pricing — accelerating sales cycles without sacrificing precision.',
  },
  {
    id: 'smart-analytics',
    title: 'Smart Analytics',
    status: 'PROTOTYPE',
    summary: 'Unified dashboards across marketing, product, and finance.',
    detail:
      'Connects data sources into one intelligence layer — so teams see performance holistically instead of in siloed reports.',
  },
  {
    id: 'workflow-engine',
    title: 'Workflow Engine',
    status: 'BETA',
    summary: 'Visual automation builder for cross-platform operations.',
    detail:
      'Design, test, and deploy multi-step workflows that connect CRM, finance, marketing, and internal tools without custom code for every integration.',
  },
  {
    id: 'ai-receptionist',
    title: 'AI Receptionist',
    status: 'COMING SOON',
    summary: 'Always-on client intake and scheduling.',
    detail:
      'Handles inbound inquiries, qualifies leads, and books meetings — giving small teams enterprise-grade front-office coverage.',
  },
  {
    id: 'knowledge-hub',
    title: 'Knowledge Hub',
    status: 'LIVE',
    summary: 'Centralized company knowledge with AI retrieval.',
    detail:
      'Stores SOPs, brand guidelines, and project history in a searchable hub — so institutional knowledge stays accessible as teams scale.',
  },
];

export const OBSERVATIONS: Observation[] = [
  {
    id: 'obs-001',
    number: '001',
    title: 'The shift from tools to systems',
    excerpt:
      'Why the next decade belongs to businesses that connect intelligence across departments — not those that collect the most SaaS subscriptions.',
    href: '/blog',
  },
  {
    id: 'obs-002',
    number: '002',
    title: 'Invisible automation as competitive advantage',
    excerpt:
      'Teams that automate intentionally free capacity for strategy. Teams that automate reactively drown in maintenance.',
    href: '/blog',
  },
  {
    id: 'obs-003',
    number: '003',
    title: 'AI-native workflows in creative studios',
    excerpt:
      'How design and engineering studios are restructuring delivery when AI becomes infrastructure — not an add-on.',
    href: '/blog',
  },
];

export const PRINCIPLES = [
  'Think in systems.',
  'Build for longevity.',
  'Automate intentionally.',
  'Design with clarity.',
  'Engineer with purpose.',
  'Question assumptions.',
  'Use AI responsibly.',
] as const;

export const FORWARD = {
  statement:
    "The future won't belong to businesses with the most technology. It will belong to businesses with the best systems.",
  tagline: 'Engineering Intelligent Businesses.',
} as const;

export const STATUS_STYLES: Record<LabStatus, string> = {
  LIVE: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  BETA: 'bg-accent/15 text-accent border-accent/35',
  PROTOTYPE: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
  'COMING SOON': 'bg-white/8 text-overlay-white-55 border-white/15',
};
