import type { AppIconName } from '../components/AppIcon';

export interface MegaLink {
  icon: AppIconName;
  label: string;
  isNew?: boolean;
}

export interface MegaColumn {
  id: string;
  icon: AppIconName;
  iconClass: string;
  title: string;
  links: MegaLink[];
}

export const MEGA_COLUMNS: MegaColumn[] = [
  {
    id: 'ui-ux',
    icon: 'Hexagon',
    iconClass: 'bg-mega-icon-ux',
    title: 'UI / UX Design',
    links: [
      { icon: 'Search', label: 'UX Research' },
      { icon: 'LayoutGrid', label: 'Wireframing & Prototype' },
      { icon: 'Layers', label: 'SaaS UI Design' },
      { icon: 'Smartphone', label: 'App UI Design' },
      { icon: 'Box', label: 'Design Systems' },
    ],
  },
  {
    id: 'brand',
    icon: 'Sparkles',
    iconClass: 'bg-mega-icon-brand',
    title: 'Brand Identity',
    links: [
      { icon: 'PenTool', label: 'Logo Design' },
      { icon: 'Palette', label: 'Graphic Design' },
      { icon: 'Package', label: 'Packaging Design' },
      { icon: 'Briefcase', label: 'Company Profile' },
      { icon: 'Layers', label: 'Brand Guidelines' },
    ],
  },
  {
    id: 'web',
    icon: 'Globe',
    iconClass: 'bg-mega-icon-web',
    title: 'Web Design & Dev',
    links: [
      { icon: 'Building2', label: 'Corporate Websites' },
      { icon: 'ShoppingCart', label: 'Ecommerce Websites' },
      { icon: 'LayoutGrid', label: 'Landing Pages' },
      { icon: 'Server', label: 'CMS Development' },
      { icon: 'MonitorSmartphone', label: 'Custom Web Solutions' },
    ],
  },
  {
    id: 'saas',
    icon: 'Cloud',
    iconClass: 'bg-mega-icon-saas',
    title: 'SaaS Development',
    links: [
      { icon: 'Cloud', label: 'SaaS Platforms' },
      { icon: 'Activity', label: 'Dashboard Systems' },
      { icon: 'Briefcase', label: 'CRM Solutions' },
      { icon: 'Zap', label: 'AI SaaS Products', isNew: true },
      { icon: 'AppWindow', label: 'Web Applications' },
    ],
  },
  {
    id: 'ai',
    icon: 'Zap',
    iconClass: 'bg-mega-icon-ai',
    title: 'AI Automation',
    links: [
      { icon: 'Bot', label: 'AI Chatbots', isNew: true },
      { icon: 'Smartphone', label: 'WhatsApp Automation' },
      { icon: 'Briefcase', label: 'CRM Automation' },
      { icon: 'Megaphone', label: 'Lead Generation Systems' },
      { icon: 'Cpu', label: 'Workflow Automation' },
    ],
  },
  {
    id: 'video',
    icon: 'Video',
    iconClass: 'bg-mega-icon-video',
    title: 'AI Video & Content',
    links: [
      { icon: 'Clapperboard', label: 'AI Video Generation', isNew: true },
      { icon: 'Megaphone', label: 'AI Ad Creatives' },
      { icon: 'Smartphone', label: 'Reels & Shorts' },
      { icon: 'ShoppingBag', label: 'Product Promo Videos' },
      { icon: 'Image', label: 'AI Image Generation' },
    ],
  },
  {
    id: 'motion',
    icon: 'Clapperboard',
    iconClass: 'bg-mega-icon-motion',
    title: 'Motion Design',
    links: [
      { icon: 'Sparkles', label: 'Motion Graphics' },
      { icon: 'Box', label: '3D Animation' },
      { icon: 'PenTool', label: 'Logo Animation' },
      { icon: 'Hexagon', label: 'UI Animation' },
      { icon: 'Video', label: 'Explainer Videos' },
    ],
  },
  {
    id: 'app',
    icon: 'Smartphone',
    iconClass: 'bg-mega-icon-app',
    title: 'App Development',
    links: [
      { icon: 'Smartphone', label: 'iOS App Development' },
      { icon: 'Bot', label: 'Android App Development' },
      { icon: 'MonitorSmartphone', label: 'Cross-Platform Apps' },
      { icon: 'Server', label: 'Admin Panels' },
      { icon: 'Wrench', label: 'API Integration' },
    ],
  },
  {
    id: 'mvp',
    icon: 'Rocket',
    iconClass: 'bg-mega-icon-mvp',
    title: 'MVP Development',
    links: [
      { icon: 'Rocket', label: 'Startup MVP' },
      { icon: 'Cloud', label: 'SaaS MVP' },
      { icon: 'Globe', label: 'Web MVP' },
      { icon: 'Smartphone', label: 'App MVP' },
      { icon: 'ShieldCheck', label: 'Product Validation Systems' },
    ],
  },
];

export const MEGA_PILLS = [
  'UI/UX Design',
  'Brand Identity',
  'AI Automation',
  'SaaS Development',
  'MVP Development',
  'AI Video',
] as const;
