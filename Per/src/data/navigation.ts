import {
  MEGA_POPULAR_PILLS,
  SERVICE_CATEGORIES,
  offeringIcon,
} from './services';
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

const NEW_OFFERINGS = new Set(['AI Chatbots', 'AI Images', 'AI Videos']);

export const MEGA_COLUMNS: MegaColumn[] = SERVICE_CATEGORIES.map((category) => ({
  id: category.id,
  icon: category.icon,
  iconClass: category.iconClass,
  title: category.title,
  links: category.offerings.map((label, index) => ({
    icon: offeringIcon(index),
    label,
    isNew: NEW_OFFERINGS.has(label),
  })),
}));

export const MEGA_PILLS = MEGA_POPULAR_PILLS;
