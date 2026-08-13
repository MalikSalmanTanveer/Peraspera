# Admin platform auth setup (branch only)

Use on **`feature/admin-platform`** / a **dev** Supabase project.  
Do **not** cut over production until the message includes **`987654321`**.

## 1. Apply migration

```bash
supabase db push
# or run supabase/migrations/20260810120000_admin_platform_profiles.sql in the SQL editor
```

## 2. Seed the first Super Admin

Add to `.env` (never commit real secrets):

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SEED_SUPER_ADMIN_EMAIL=you@example.com
SEED_SUPER_ADMIN_PASSWORD=choose-a-strong-password
SEED_SUPER_ADMIN_USERNAME=superadmin
```

Apply the profiles migration first, then:

```bash
npm run seed
```

This creates/updates the Auth user and upserts `admin_profiles` as `super_admin`.

**Manual alternative:** Dashboard → Authentication → Add user, then SQL upsert (see older notes below).

```sql
insert into public.admin_profiles (id, username, role, is_active)
select id, 'superadmin', 'super_admin', true
from auth.users
where email = 'YOUR_SUPER_ADMIN_EMAIL'
on conflict (id) do update
set username = excluded.username,
    role = 'super_admin',
    is_active = true;
```

## 3. App env

Keep existing:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Edge functions (invite / role-gated admin-api) still need:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY` (if verifying JWTs)

Remove reliance on `ADMIN_EMAIL` / `ADMIN_PASSWORD` once the new login path is live on this branch.

## 4. Auth email templates + redirect URLs (important)

Per and Studio share one Supabase project. **Studio app is paused** (`studio/PAUSED.md`) so it is not the product surface for invites.

If **Site URL** is still Studio, invite links open Studio (“Access pending”) instead of admin set-password.

In Supabase Dashboard → **Authentication** → **URL configuration**:

1. Set **Site URL** to `http://localhost:5173` (or your Per production origin later).
2. Add **Redirect URLs**:
   - `http://localhost:5173/admin/set-password`
   - `http://localhost:5173/admin/reset-password`
   - `http://127.0.0.1:5173/admin/set-password`
   - `http://127.0.0.1:5173/admin/reset-password`

Set edge secret (required for invites):

```bash
npx supabase secrets set ADMIN_INVITE_REDIRECT_URL=http://localhost:5173/admin/set-password --project-ref YOUR_REF
```

Then redeploy `admin-api`.

If someone already clicked a bad invite link, recover them:

```env
RECOVER_ADMIN_EMAIL=them@example.com
RECOVER_ADMIN_PASSWORD=temporary-password
RECOVER_ADMIN_USERNAME=theirname
RECOVER_ADMIN_ROLE=blog_author
```

```bash
npm run recover-admin
```

They sign in at **`/admin/login`**, not Studio.

Enable Auth templates:

- Invite user  
- Reset password  

## 5. Bulk mail

Apply migration `supabase/migrations/20260813120000_bulk_mail.sql` (included in `supabase db push`).

Set Edge secret `BULK_MAIL_FROM_ADDRESSES` to a JSON array of `{ "email", "label" }` objects. The admin UI reads this via `listBulkMailFromOptions`; if unset, `admin-api` falls back to the defaults below.

```bash
npx supabase secrets set BULK_MAIL_FROM_ADDRESSES='[{"email":"contact@peraspera.solutions","label":"Contact"},{"email":"hr@peraspera.solutions","label":"HR"},{"email":"careers@peraspera.solutions","label":"Careers"}]' --project-ref YOUR_REF
```

Each address must be allowed by your verified Resend domain (`peraspera.solutions`). In the [Resend dashboard](https://resend.com/domains), confirm the domain is verified and that `contact@`, `hr@`, and `careers@` are permitted senders before production use.

### Stop bulk mail landing in spam (required)

Code alone cannot fix spam. Complete **all** DNS records Resend shows for `peraspera.solutions`:

1. Open [Resend → Domains](https://resend.com/domains) → `peraspera.solutions`
2. Add/verify **SPF**, **DKIM**, and (recommended) **DMARC** exactly as Resend lists them
3. Wait until the domain status is **Verified** (green)
4. Set production `FROM_EMAIL` to a domain address, **not** `onboarding@resend.dev`:

```bash
npx supabase secrets set FROM_EMAIL='Peraspera <contact@peraspera.solutions>' --project-ref YOUR_REF
```

5. Redeploy `admin-api` after secrets change
6. In Gmail, open a received mail → mark **Not spam** / drag into **Primary** once to train the inbox

Bulk sends use a plain transactional layout (no newsletter card, no `List-Unsubscribe` header) so Gmail is less likely to route them to **Promotions**. Classification is still Gmail’s call; domain reputation and content matter more than any single header.

Then redeploy `admin-api` and the frontend.
