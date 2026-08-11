import DOMPurify from 'isomorphic-dompurify';
import { sanitizeBlogImageClass, sanitizeBlogImageStyle } from './blogImage';

const PARAGRAPH_CONFIG = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'a',
    'ul',
    'ol',
    'li',
    'h2',
    'h3',
    'h4',
    'blockquote',
    'img',
  ],
  ALLOWED_ATTR: ['href', 'rel', 'target', 'src', 'alt', 'class', 'title', 'style'],
};

const BULLET_CONFIG = {
  ALLOWED_TAGS: ['strong', 'b', 'em', 'i', 'a', 'br'],
  ALLOWED_ATTR: ['href', 'rel', 'target'],
};

let hooksInstalled = false;

function ensureSanitizeHooks() {
  if (hooksInstalled) return;
  hooksInstalled = true;
  DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
    if (node.nodeName !== 'IMG') return;
    if (data.attrName === 'class') {
      data.attrValue = sanitizeBlogImageClass(data.attrValue);
    }
    if (data.attrName === 'style') {
      data.attrValue = sanitizeBlogImageStyle(data.attrValue);
      if (!data.attrValue) data.keepAttr = false;
    }
  });
}

export function purifyParagraphHtml(html: string): string {
  ensureSanitizeHooks();
  return DOMPurify.sanitize(html ?? '', PARAGRAPH_CONFIG);
}

export function purifyBulletHtml(html: string): string {
  return DOMPurify.sanitize(html ?? '', BULLET_CONFIG);
}
