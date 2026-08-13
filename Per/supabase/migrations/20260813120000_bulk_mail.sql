-- Bulk mail: jobs, recipients, and private attachment storage

create table if not exists public.bulk_mail_jobs (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null,
  from_email text not null,
  subject text not null,
  body text not null,
  attachment_path text,
  attachment_name text,
  attachment_content_type text,
  status text not null check (status in ('draft', 'queued', 'processing', 'completed', 'failed', 'cancelled')),
  total_count int not null default 0,
  sent_count int not null default 0,
  failed_count int not null default 0,
  error_summary text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz
);

create table if not exists public.bulk_mail_recipients (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.bulk_mail_jobs (id) on delete cascade,
  email text not null,
  status text not null check (status in ('pending', 'sent', 'failed', 'skipped')),
  resend_id text,
  error text,
  sent_at timestamptz,
  unique (job_id, email)
);

create index if not exists bulk_mail_recipients_job_status_idx
  on public.bulk_mail_recipients (job_id, status);

alter table public.bulk_mail_jobs enable row level security;
alter table public.bulk_mail_recipients enable row level security;

create policy "No public access bulk_mail_jobs"
  on public.bulk_mail_jobs for all to anon, authenticated
  using (false) with check (false);

create policy "No public access bulk_mail_recipients"
  on public.bulk_mail_recipients for all to anon, authenticated
  using (false) with check (false);

-- ---------------------------------------------------------------------------
-- Storage: private attachment bucket (uploads via Edge Function service role)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit)
values ('bulk-mail-attachments', 'bulk-mail-attachments', false, 10485760)
on conflict (id) do update set file_size_limit = excluded.file_size_limit;

drop policy if exists "No public read bulk-mail attachments" on storage.objects;
create policy "No public read bulk-mail attachments"
  on storage.objects for select to anon, authenticated
  using (false);

drop policy if exists "No public upload bulk-mail attachments" on storage.objects;
create policy "No public upload bulk-mail attachments"
  on storage.objects for insert to anon, authenticated
  with check (false);
