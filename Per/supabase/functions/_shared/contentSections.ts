/** Shared content_sections helpers for Edge Functions (Deno). */

export type ContentBodyType = 'paragraph' | 'bullets';

export type ContentBullet = { html: string };

export type ContentSection = {
  id: string;
  heading: string;
  body_type: ContentBodyType;
  html?: string;
  bullets?: ContentBullet[];
};

const PARAGRAPH_TAGS = new Set([
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
]);

const BULLET_TAGS = new Set(['strong', 'b', 'em', 'i', 'a', 'br']);

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function isEmptyHtml(html: string): boolean {
  return !stripTags(html);
}

export function sanitizeHtml(input: string, mode: 'paragraph' | 'bullet'): string {
  const allowed = mode === 'paragraph' ? PARAGRAPH_TAGS : BULLET_TAGS;
  let html = String(input ?? '');
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  html = html.replace(
    /<\/?(script|style|iframe|object|embed|form|input|button|textarea|select|meta|link)[^>]*>/gi,
    '',
  );
  html = html.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  html = html.replace(/\shref\s*=\s*(['"])\s*javascript:[^'"]*\1/gi, ' href="#"');
  html = html.replace(/<\/?([a-z0-9]+)(\s[^>]*)?>/gi, (full, rawName: string, attrs = '') => {
    const name = rawName.toLowerCase();
    const closing = full.startsWith('</');
    if (!allowed.has(name)) return '';
    if (closing) return `</${name}>`;
    if (name === 'br') return '<br>';
    if (name === 'a') {
      const hrefMatch = attrs.match(/\shref\s*=\s*(['"])(.*?)\1/i);
      let href = hrefMatch?.[2]?.trim() ?? '';
      if (!/^(https?:|mailto:)/i.test(href)) href = '#';
      return `<a href="${href.replace(/"/g, '')}" rel="noopener noreferrer" target="_blank">`;
    }
    return `<${name}>`;
  });
  return html.trim();
}

function newSectionId(): string {
  return crypto.randomUUID();
}

export function isSectionComplete(section: ContentSection): boolean {
  if (!section.heading?.trim()) return false;
  if (section.body_type === 'paragraph') return !isEmptyHtml(section.html ?? '');
  return (section.bullets ?? []).some((b) => !isEmptyHtml(b.html ?? ''));
}

function sanitizeSection(raw: unknown): ContentSection | null {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw as Record<string, unknown>;
  const heading = String(s.heading ?? '').trim();
  const body_type: ContentBodyType = s.body_type === 'bullets' ? 'bullets' : 'paragraph';
  const id = String(s.id ?? '').trim() || newSectionId();

  if (body_type === 'paragraph') {
    const html = sanitizeHtml(String(s.html ?? ''), 'paragraph');
    if (!heading && isEmptyHtml(html)) return null;
    return { id, heading, body_type: 'paragraph', html };
  }

  const bulletsRaw = Array.isArray(s.bullets) ? s.bullets : [];
  const bullets = bulletsRaw
    .map((b) => {
      const html =
        typeof b === 'string'
          ? sanitizeHtml(b, 'bullet')
          : sanitizeHtml(String((b as ContentBullet)?.html ?? ''), 'bullet');
      return { html };
    })
    .filter((b) => !isEmptyHtml(b.html));

  if (!heading && !bullets.length) return null;
  return { id, heading, body_type: 'bullets', bullets };
}

export function normalizeContentSections(input: unknown): ContentSection[] {
  if (!Array.isArray(input)) return [];
  const out: ContentSection[] = [];
  for (const item of input) {
    const section = sanitizeSection(item);
    if (!section || !isSectionComplete(section)) continue;
    out.push(section);
  }
  return out;
}

export function validateContentSections(sections: ContentSection[]): string | null {
  if (!sections.length || !sections.some(isSectionComplete)) {
    return 'Add at least one complete section (heading and body) before saving';
  }
  return null;
}

export function deriveDescriptionFromSections(sections: ContentSection[]): string {
  const parts: string[] = [];
  for (const section of sections) {
    if (section.heading.trim()) parts.push(section.heading.trim());
    if (section.body_type === 'paragraph') {
      const text = stripTags(section.html ?? '');
      if (text) parts.push(text);
    } else {
      for (const b of section.bullets ?? []) {
        const text = stripTags(b.html);
        if (text) parts.push(`- ${text}`);
      }
    }
    parts.push('');
  }
  return parts.join('\n').trim();
}
