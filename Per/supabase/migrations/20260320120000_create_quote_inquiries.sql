-- Quote inquiry submissions from the contact form
create table if not exists public.quote_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  company text,
  email text not null check (email <> ''),
  service text not null check (service <> ''),
  details text not null check (details <> ''),
  created_at timestamptz not null default now()
);

alter table public.quote_inquiries enable row level security;

drop policy if exists "Anyone can submit quote inquiries" on public.quote_inquiries;
create policy "Anyone can submit quote inquiries"
  on public.quote_inquiries
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "No public reads on quote inquiries" on public.quote_inquiries;
create policy "No public reads on quote inquiries"
  on public.quote_inquiries
  for select
  to anon
  using (false);

comment on table public.quote_inquiries is 'Contact / quote form submissions from the Peraspera website';
