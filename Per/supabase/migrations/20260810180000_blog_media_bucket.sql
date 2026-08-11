-- Public blog media (covers + inline images)
-- feature/admin-platform blog images

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-media',
  'blog-media',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public can read (CDN / <img src>)
create policy "Public read blog media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'blog-media');

-- No direct client writes — admin-api uses service role
create policy "No public upload blog media"
  on storage.objects for insert
  to anon, authenticated
  with check (false);

create policy "No public update blog media"
  on storage.objects for update
  to anon, authenticated
  using (false)
  with check (false);

create policy "No public delete blog media"
  on storage.objects for delete
  to anon, authenticated
  using (false);
