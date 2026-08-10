-- Admin platform: multi-role profiles (Supabase Auth)
-- Wave 1 foundation for feature/admin-platform. Do not apply to production
-- until cutover is explicitly approved (code 987654321).

create type public.admin_role as enum (
  'super_admin',
  'hiring_manager',
  'blog_author',
  'sales_leads'
);

create table public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  role public.admin_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_profiles_username_nonempty check (username <> ''),
  constraint admin_profiles_username_unique unique (username)
);

create index admin_profiles_role_idx on public.admin_profiles (role);
create index admin_profiles_is_active_idx on public.admin_profiles (is_active);

create or replace function public.set_admin_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger admin_profiles_set_updated_at
  before update on public.admin_profiles
  for each row
  execute function public.set_admin_profiles_updated_at();

-- Keep profile username/role in sync when invite metadata is present on signup.
create or replace function public.handle_admin_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_username text;
  meta_role text;
  resolved_role public.admin_role;
begin
  meta_username := nullif(trim(coalesce(new.raw_user_meta_data ->> 'username', '')), '');
  meta_role := nullif(trim(coalesce(new.raw_user_meta_data ->> 'role', '')), '');

  if meta_username is null then
    meta_username := split_part(new.email, '@', 1);
  end if;

  begin
    resolved_role := meta_role::public.admin_role;
  exception
    when others then
      resolved_role := 'hiring_manager'::public.admin_role;
  end;

  insert into public.admin_profiles (id, username, role, is_active)
  values (new.id, meta_username, resolved_role, true)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_admin_profile on auth.users;
create trigger on_auth_user_created_admin_profile
  after insert on auth.users
  for each row
  execute function public.handle_admin_user_created();

alter table public.admin_profiles enable row level security;

-- Authenticated users can read their own profile (for role-aware UI).
-- Writes go through service-role edge functions only (no client write policies).
create policy admin_profiles_select_own
  on public.admin_profiles
  for select
  to authenticated
  using (auth.uid() = id);

comment on table public.admin_profiles is
  'Peraspera admin platform profiles. Roles gate Hiring, Blog, Sales, and Users.';

comment on column public.admin_profiles.is_active is
  'When false, login must be rejected even if Auth credentials are valid.';
