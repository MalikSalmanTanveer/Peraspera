import { supabase, isSupabaseConfigured } from './supabase';
import type { BlogPost, PublicBlogPostCard } from './blog';

export async function fetchPublishedBlogPosts(): Promise<{
  data: PublicBlogPostCard[];
  error: string | null;
}> {
  if (!supabase || !isSupabaseConfigured) {
    return { data: [], error: 'Supabase is not configured.' };
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image_url, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as PublicBlogPostCard[], error: null };
}

export async function fetchPublishedBlogPostBySlug(slug: string): Promise<{
  data: BlogPost | null;
  error: string | null;
}> {
  if (!supabase || !isSupabaseConfigured) {
    return { data: null, error: 'Supabase is not configured.' };
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      'id, title, slug, body_html, excerpt, cover_image_url, status, author_id, published_at, created_at, updated_at',
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  return { data: (data as BlogPost | null) ?? null, error: null };
}
