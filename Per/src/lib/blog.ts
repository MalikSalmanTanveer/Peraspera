export type BlogPostStatus = 'draft' | 'published';

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  body_html: string;
  excerpt: string;
  cover_image_url: string | null;
  status: BlogPostStatus;
  author_id: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PublicBlogPostCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  published_at: string | null;
};

function slugifyTitle(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export function suggestBlogSlug(title: string): string {
  const base = slugifyTitle(title);
  return base || `post-${Date.now().toString(36)}`;
}
