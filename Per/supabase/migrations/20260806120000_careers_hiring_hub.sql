-- Careers hiring hub: clean schema (replaces prior career_* migrations)

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Drop legacy careers objects (safe re-run)
-- ---------------------------------------------------------------------------

drop trigger if exists career_applications_notify_insert on public.career_applications;
drop function if exists public.notify_career_application_insert();
drop function if exists public.submit_career_application(uuid, jsonb);
drop trigger if exists career_jobs_set_updated_at on public.career_jobs;
drop function if exists public.set_career_jobs_updated_at();

drop table if exists public.career_application_emails cascade;
drop table if exists public.career_applications cascade;
drop table if exists public.career_jobs cascade;
drop table if exists public.career_schema_fields cascade;
drop table if exists public.career_schemas cascade;
drop table if exists public.career_email_templates cascade;
drop table if exists public.career_departments cascade;
drop table if exists public.career_page_content cascade;
drop table if exists public.admin_sessions cascade;

-- Legacy storage bucket policies (do not DELETE storage.objects — Storage API only)
drop policy if exists "Anyone can upload career application files" on storage.objects;
drop policy if exists "No public read career application files" on storage.objects;
-- Leave legacy `career-applications` bucket if present; new bucket is `career-resumes`.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.career_departments (
  id uuid primary key default gen_random_uuid(),
  name text not null check (name <> ''),
  slug text not null check (slug <> ''),
  sort_order int not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (slug)
);

create table public.career_jobs (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.career_departments(id) on delete restrict,
  title text not null check (title <> ''),
  slug text not null check (slug <> ''),
  location text not null default '',
  workplace_type text not null default 'onsite'
    check (workplace_type in ('remote', 'hybrid', 'onsite')),
  employment_type text not null default 'full_time'
    check (employment_type in ('full_time', 'part_time', 'contract', 'internship', 'temporary')),
  description text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  form_schema jsonb not null default '{"fields":[]}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug)
);

create table public.career_page_content (
  id int primary key default 1 check (id = 1),
  headline text not null default 'Why join Peraspera',
  sections jsonb not null default '[]'::jsonb,
  values jsonb not null default '[]'::jsonb,
  hiring_steps jsonb not null default '[]'::jsonb,
  empty_cta jsonb not null default '{"message":"","label":"","href":""}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.career_email_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null check (name <> ''),
  subject text not null default '',
  body text not null default '',
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.career_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.career_jobs(id) on delete restrict,
  candidate_name text not null check (candidate_name <> ''),
  candidate_email text not null check (candidate_email <> ''),
  candidate_phone text,
  status text not null default 'new'
    check (status in ('new', 'screening', 'interview', 'offer', 'hired', 'rejected', 'withdrawn')),
  answers jsonb not null default '{}'::jsonb,
  resume_path text not null check (resume_path <> ''),
  is_duplicate boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.career_application_emails (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.career_applications(id) on delete cascade,
  subject text not null,
  body text not null,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index career_departments_sort_idx on public.career_departments (sort_order)
  where deleted_at is null;

create index career_jobs_status_idx on public.career_jobs (status)
  where deleted_at is null;
create index career_jobs_department_id_idx on public.career_jobs (department_id)
  where deleted_at is null;
create index career_jobs_slug_idx on public.career_jobs (slug)
  where deleted_at is null;

create index career_applications_job_id_idx on public.career_applications (job_id, created_at desc)
  where deleted_at is null;
create index career_applications_status_idx on public.career_applications (status)
  where deleted_at is null;
create index career_applications_email_job_idx on public.career_applications (candidate_email, job_id);

create index career_application_emails_app_idx on public.career_application_emails (application_id, sent_at desc);

create index admin_sessions_expires_at_idx on public.admin_sessions (expires_at);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create or replace function public.set_career_row_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger career_jobs_set_updated_at
  before update on public.career_jobs
  for each row
  execute function public.set_career_row_updated_at();

create trigger career_applications_set_updated_at
  before update on public.career_applications
  for each row
  execute function public.set_career_row_updated_at();

create trigger career_email_templates_set_updated_at
  before update on public.career_email_templates
  for each row
  execute function public.set_career_row_updated_at();

create or replace function public.notify_career_application_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform realtime.send(
    jsonb_build_object(
      'id', new.id,
      'job_id', new.job_id,
      'candidate_name', new.candidate_name,
      'is_duplicate', new.is_duplicate,
      'created_at', new.created_at
    ),
    'new',
    'career-applications',
    false
  );
  return new;
end;
$$;

create trigger career_applications_notify_insert
  after insert on public.career_applications
  for each row
  execute function public.notify_career_application_insert();

-- ---------------------------------------------------------------------------
-- Seed culture content
-- ---------------------------------------------------------------------------

insert into public.career_page_content (id)
values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.career_departments enable row level security;
alter table public.career_jobs enable row level security;
alter table public.career_page_content enable row level security;
alter table public.career_email_templates enable row level security;
alter table public.career_applications enable row level security;
alter table public.career_application_emails enable row level security;
alter table public.admin_sessions enable row level security;

drop policy if exists "Public read active career departments" on public.career_departments;
create policy "Public read active career departments"
  on public.career_departments for select to anon, authenticated
  using (deleted_at is null);

drop policy if exists "Public read career page content" on public.career_page_content;
create policy "Public read career page content"
  on public.career_page_content for select to anon, authenticated
  using (true);

drop policy if exists "Public read published career jobs" on public.career_jobs;
create policy "Public read published career jobs"
  on public.career_jobs for select to anon, authenticated
  using (status = 'published' and deleted_at is null);

drop policy if exists "No public read career applications" on public.career_applications;
create policy "No public read career applications"
  on public.career_applications for select to anon, authenticated
  using (false);

drop policy if exists "No public write career applications" on public.career_applications;
create policy "No public write career applications"
  on public.career_applications for insert to anon, authenticated
  with check (false);

drop policy if exists "No public access career email templates" on public.career_email_templates;
create policy "No public access career email templates"
  on public.career_email_templates for all to anon, authenticated
  using (false)
  with check (false);

drop policy if exists "No public access career application emails" on public.career_application_emails;
create policy "No public access career application emails"
  on public.career_application_emails for all to anon, authenticated
  using (false)
  with check (false);

drop policy if exists "No public access admin sessions" on public.admin_sessions;
create policy "No public access admin sessions"
  on public.admin_sessions for all to anon, authenticated
  using (false)
  with check (false);

-- ---------------------------------------------------------------------------
-- Storage: private resume bucket (uploads via Edge Function service role)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'career-resumes',
  'career-resumes',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "No public read career resumes" on storage.objects;
create policy "No public read career resumes"
  on storage.objects for select to anon, authenticated
  using (false);

drop policy if exists "No public upload career resumes" on storage.objects;
create policy "No public upload career resumes"
  on storage.objects for insert to anon, authenticated
  with check (false);

comment on table public.career_jobs is 'Job postings with embedded form_schema JSON';
comment on table public.career_applications is 'Candidate applications; inserts via career-apply Edge Function';
comment on table public.career_page_content is 'Singleton CMS content for /careers culture sections';
