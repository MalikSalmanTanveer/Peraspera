-- Blog module: posts for public /blog + admin CMS
-- feature/admin-platform wave 1

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null default '' check (char_length(title) <= 200),
  slug text not null check (slug <> ''),
  body_html text not null default '',
  excerpt text not null default '' check (char_length(excerpt) <= 500),
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid not null references public.admin_profiles (id) on delete restrict,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_slug_unique unique (slug)
);

create index blog_posts_status_published_at_idx
  on public.blog_posts (status, published_at desc nulls last);

create index blog_posts_author_id_idx on public.blog_posts (author_id);

create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row
  execute function public.set_blog_posts_updated_at();

alter table public.blog_posts enable row level security;

-- Public (anon + authenticated) can read published posts only.
create policy blog_posts_public_read_published
  on public.blog_posts
  for select
  to anon, authenticated
  using (status = 'published');

-- Writes go through service-role edge functions (no client write policies).

comment on table public.blog_posts is
  'Peraspera blog posts. Drafts are admin-only via edge API; published rows are publicly readable.';
