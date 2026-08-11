# Plan: Admin Platform Shell (Users, Roles, Auth)

Parent roadmap: [2026-08-10-admin-platform-roadmap-plan.md](./2026-08-10-admin-platform-roadmap-plan.md)

## 1. Plain summary

We replace the one shared admin password with real people who log in through Supabase Auth. Each person has a role. The admin layout only shows the menus they are allowed to use. Super Admin can invite new users by email. This is the base of the whole multi-role system. Work stays on branch `feature/admin-platform`. No production cutover without code `987654321`.

## 2. Goal

A Super Admin can log in, invite other users, and each role lands on a safe home screen with the right nav.

## 3. In scope

- Supabase Auth for admin users
- Profile row with username + role
- Roles: `super_admin`, `hiring_manager`, `blog_author`, `sales_leads`
- Seed first Super Admin
- Invite email with link to set password
- Forgot password on login
- Role-aware `AdminLayout` + route guards
- Users management page (Super Admin only)
- Remove shared `ADMIN_EMAIL` / `ADMIN_PASSWORD` login from the new system
- Server-side permission checks on admin APIs

## 4. Out of scope

- Building Blog or Hiring features (separate plans) — only hooks/nav slots
- Sales inbox UI — later
- Custom role builder / per-permission matrix UI — fixed four roles first
- SSO / Google login — later if needed

## 5. Who this is for

Super Admin (setup), then all future role users who need to log in.

## 6. How it works today

`admin-login` checks env email/password, writes `admin_sessions`, client stores token in `sessionStorage`. `admin-api` checks that session. No user list.

## 7. How it will work after

User signs in with Supabase Auth. App loads profile + role. Layout filters links. APIs check role. Super Admin opens Users, creates invite (email, username, role). New user gets email, sets password, logs in.

## 8. Chosen approach

Supabase Auth + `admin_profiles` (or similar) table for username/role. Keep edge functions where needed, but authorize with Auth JWT + role, not shared secret.

## 9. Other options we considered

Custom multi-user `admin_sessions` only — more code, weaker long-term. Rejected per roadmap.

## 10. Codebase contact points

| File / area | Change |
|-------------|--------|
| `supabase/functions/admin-login` | Replace or retire shared-secret login |
| `supabase/functions/admin-api` | Require Auth + role |
| New migration | profiles, roles enum, RLS policies |
| `src/lib/adminApi.ts` | Session via Supabase client |
| `AdminLoginPage.tsx` | Auth login + forgot password |
| `AdminApp.tsx` / `AdminLayout.tsx` | Guards + role nav |
| New `AdminUsersPage.tsx` | Invite / disable / role change |
| Seed script or migration seed | First Super Admin |

## 11. Screens and workflow impact

| Screen | Before → After |
|--------|----------------|
| Login | Shared password → Supabase email/password + Forgot password |
| Layout | Same links for everyone → links by role |
| Users | None → Super Admin CRUD/invite |
| Home | `/admin` → applications → role default home (Super Admin overview or module home) |

## 12. Data and rules

- **Fields:** email (Auth), username (unique display handle), role, active/disabled flag, created_at
- **Create user:** Super Admin only; sends invite link (no password typed by admin for final secret)
- **Disable user:** Super Admin; disabled cannot log in
- **Cannot delete last Super Admin**
- **Permissions:** enforce in API; UI hide is not enough

## 13. Edge cases and decisions

- Invite link, not plaintext password email
- Forgot password included
- Seeded first Super Admin
- Shared env login removed
- Sales role exists in enum even before Sales UI (nav hidden / empty placeholder ok)

## 14. Step-by-step build order

1. Add migration for profiles + role enum. Verify: migrate on branch/dev DB.
2. Seed Super Admin Auth user + profile. Verify: can sign in locally.
3. Wire client login + session + RequireAuth. Verify: unauthenticated redirected to login.
4. Role-aware layout links (Hiring/Blog slots; Sales later). Verify: each role sees correct links.
5. Users page: list, invite, disable, change role. Verify: invite email arrives in test.
6. Update `admin-api` (and related) to Auth + role. Verify: wrong role gets 403.
7. Remove shared-secret login path. Verify: old env password no longer works on branch.
8. Commit on `feature/admin-platform`.

## 15. Impact and risks

Invite email config (SMTP/Supabase) must work in dev. Role bugs = data leaks — test every role against hiring APIs.

## 16. Test checklist

- [ ] Seed login works
- [ ] Forgot password flow
- [ ] Invite sets password and logs in
- [ ] Disabled user blocked
- [ ] Non–Super Admin cannot open Users API
- [ ] Nav matches role

## 17. Open questions

None.

## 18. Approval

- [x] Covered by approval of parent roadmap (or approve this file too)
- Date / note: 2026-08-10 — parent roadmap approved in chat
