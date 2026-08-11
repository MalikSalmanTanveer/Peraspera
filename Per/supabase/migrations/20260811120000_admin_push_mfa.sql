-- Admin Google-like push MFA (PWA + Web Push)
-- Feature branch only. Do not apply to production until cutover code 987654321.

create table public.admin_mfa_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.admin_profiles (id) on delete cascade,
  name text not null default 'Phone',
  push_endpoint text not null,
  push_p256dh text not null,
  push_auth text not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at timestamptz,
  constraint admin_mfa_devices_name_nonempty check (trim(name) <> ''),
  constraint admin_mfa_devices_endpoint_unique unique (push_endpoint)
);

create index admin_mfa_devices_user_active_idx
  on public.admin_mfa_devices (user_id)
  where revoked_at is null;

create table public.admin_mfa_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.admin_profiles (id) on delete cascade,
  session_key text not null,
  display_number smallint not null,
  number_options jsonb not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'denied', 'expired')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint admin_mfa_challenges_display_number_range
    check (display_number >= 10 and display_number <= 99)
);

create index admin_mfa_challenges_user_created_idx
  on public.admin_mfa_challenges (user_id, created_at desc);

create index admin_mfa_challenges_session_pending_idx
  on public.admin_mfa_challenges (session_key, status)
  where status = 'pending';

create table public.admin_mfa_email_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.admin_profiles (id) on delete cascade,
  session_key text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index admin_mfa_email_codes_user_created_idx
  on public.admin_mfa_email_codes (user_id, created_at desc);

create table public.admin_mfa_recovery_codes (
  user_id uuid primary key references public.admin_profiles (id) on delete cascade,
  code_hash text not null,
  created_at timestamptz not null default now(),
  consumed_at timestamptz
);

create table public.admin_mfa_sessions (
  session_key text primary key,
  user_id uuid not null references public.admin_profiles (id) on delete cascade,
  verified_at timestamptz not null default now(),
  expires_at timestamptz not null,
  method text not null
    check (method in ('push', 'email', 'recovery'))
);

create index admin_mfa_sessions_user_idx
  on public.admin_mfa_sessions (user_id);

alter table public.admin_mfa_devices enable row level security;
alter table public.admin_mfa_challenges enable row level security;
alter table public.admin_mfa_email_codes enable row level security;
alter table public.admin_mfa_recovery_codes enable row level security;
alter table public.admin_mfa_sessions enable row level security;

-- Client reads own active devices (enroll UI). Writes go through service-role edge functions.
create policy admin_mfa_devices_select_own
  on public.admin_mfa_devices
  for select
  to authenticated
  using (auth.uid() = user_id and revoked_at is null);

comment on table public.admin_mfa_devices is
  'Trusted phones for admin push MFA (Web Push subscriptions).';
comment on table public.admin_mfa_challenges is
  'Pending Google-like number-match login challenges.';
comment on table public.admin_mfa_email_codes is
  'Hashed email backup codes for MFA (after a device exists).';
comment on table public.admin_mfa_recovery_codes is
  'One hashed one-time recovery code per Super Admin.';
comment on table public.admin_mfa_sessions is
  'Marks a Supabase Auth access-token fingerprint as MFA-verified.';
