# Careers hiring hub setup

Public careers pages and the `/admin` hiring hub use Supabase tables, a private resume bucket, and three Edge Functions.

## Prerequisites

- Supabase project linked to this repo
- [Resend](https://resend.com) API key with a verified `FROM_EMAIL` domain (production)
- Quote inquiry flow unchanged (`quote_inquiries` + `send-quote-notification`)

## 1. Run the migration

Apply the careers hub migration, then the content-sections migration:

```bash
cd Per
supabase db push
```

Migrations:

| File | Notes |
|------|--------|
| `20260806120000_careers_hiring_hub.sql` | Core tables, storage, realtime |
| `20260806180000_job_content_sections.sql` | `content_sections` JSONB; wipes `description`; unpublishes empty jobs |

`career_jobs.content_sections` stores ordered sections (`heading` + `paragraph` HTML or `bullets`). `description` is auto-derived plain text for SEO and is not edited in admin.

**Warning:** The hub migration drops legacy `career_*` tables and the old `career-applications` bucket. The sections migration clears job body text and unpublishes jobs with no sections.

## 2. Set Edge Function secrets

Required secrets (set all before deploying):

```bash
supabase secrets set \
  ADMIN_EMAIL=admin@peraspera.solutions \
  ADMIN_PASSWORD='your-secure-password' \
  RESEND_API_KEY=re_xxxx \
  FROM_EMAIL='Peraspera <onboarding@resend.dev>' \
  NOTIFY_EMAIL=contact.peraspera@gmail.com
```

| Secret | Used by | Required |
|--------|---------|----------|
| `ADMIN_EMAIL` | `admin-login`, `career-apply`, `admin-api` | Yes |
| `ADMIN_PASSWORD` | `admin-login` | Yes |
| `RESEND_API_KEY` | `career-apply`, `admin-api` | Yes (for emails) |
| `FROM_EMAIL` | `career-apply`, `admin-api` | Yes (for emails) |
| `NOTIFY_EMAIL` | `career-apply`, `admin-api` | Recommended (admin apply alerts) |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.

**Never** put `ADMIN_PASSWORD` in frontend code or `.env` — only Supabase secrets.

## 3. Deploy Edge Functions

```bash
supabase functions deploy admin-login
supabase functions deploy admin-api
supabase functions deploy career-apply
```

`supabase/config.toml` sets `verify_jwt = false` for `admin-api` and `career-apply` (custom session token + multipart apply). `admin-login` uses the anon JWT.

Do **not** redeploy or modify `send-quote-notification` unless fixing quote mail.

## 4. Frontend environment

Copy `.env.example` to `.env` and set:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

These are required for public careers reads and calling Edge Functions from the browser.

## 5. Smoke test

1. **Admin login** — `/admin` with secrets credentials → receive session token
2. **Culture** — edit headline/sections in admin (after UI is built) or via API
3. **Department + job** — create department, create job, publish
4. **Public apply** — `/careers/:slug` → submit with resume (after UI is built) or call `career-apply` directly
5. **Emails** — candidate thank-you + admin notify on apply
6. **Admin applications** — list/detail, status change, signed resume URL, Send mail + email log
7. **Realtime** — open admin applications; submit apply → live broadcast on `career-applications`
8. **Quote form** — submit quote inquiry → `send-quote-notification` still works

## API surface (for UI agents)

| Client module | Purpose |
|---------------|---------|
| `src/lib/careers.ts` | Public reads + `submitCareerApplication` |
| `src/lib/adminApi.ts` | Admin session + all admin-api actions |
| `src/lib/careerRealtime.ts` | Subscribe to new application signals |

### Pipeline statuses

`new` → `screening` → `interview` → `offer` → `hired` | `rejected` | `withdrawn`

### Form field types (`form_schema.fields`)

`text`, `textarea`, `email`, `phone`, `select`, `checkbox`, `number`, `date`, `multiselect`, `url` (+ required resume upload separate from schema)

## Security notes

- Resumes: private bucket; only service role uploads; admin gets 10-minute signed URLs
- Public cannot insert applications directly (RLS deny); apply goes through `career-apply`
- Unpublished or soft-deleted jobs return 404 on public reads
- Duplicate applications (same email + job) are allowed; newer row has `is_duplicate = true`
