-- Structured job content sections (mockup-faithful rebuild)
-- Adds content_sections JSONB, wipes description, unpublishes empty jobs.

alter table public.career_jobs
  add column if not exists content_sections jsonb not null default '[]'::jsonb;

comment on column public.career_jobs.content_sections is
  'Ordered sections: {id, heading, body_type: paragraph|bullets, html?, bullets?: [{html}]}';

comment on column public.career_jobs.description is
  'Plain-text fallback derived from content_sections on save (SEO); not edited in admin';

-- Wipe existing body copy (admin re-enters sections by hand)
update public.career_jobs
set
  description = '',
  content_sections = '[]'::jsonb;

-- Auto-unpublish any job with zero complete sections
update public.career_jobs
set status = 'draft'
where status = 'published'
  and (
    content_sections is null
    or content_sections = '[]'::jsonb
    or jsonb_array_length(content_sections) = 0
  );
