# Plan: Admin Platform Roadmap (Multi-Role System)

## 1. Plain summary

Today the admin is a careers hiring hub with one shared login. We will grow it into a multi-role admin platform on a **new git branch**, while **production stays unchanged** until you explicitly allow cutover with code **`987654321`**.

First we build the **platform shell** (users, roles, Supabase Auth, role dashboards). Then we **move hiring** under a Hiring module (old URLs redirect). Then we add **Blogs**: Blog Authors write/publish, and posts show on public `/blog`.

Later modules (Sales, Content, Analytics, HR, Settings extras) stay short in this roadmap. Each gets its own detailed plan when we start it.

## 2. Goal

“Done” for this roadmap means: we have a clear map of the full system, deep build plans for Platform + Hiring relocate + Blog, and a safe way to build on a branch in small commits without touching production.

## 3. In scope

- Full module roadmap (names + short descriptions + links)
- Deep plans for:
  - Platform shell (auth, roles, users, nav)
  - Hiring relocate (+ redirects)
  - Blog module (admin + public)
- New branch work only; small tasks and commits
- Roles: Super Admin, Hiring Manager, Blog Author, Sales/Leads
- Supabase Auth + invite-link onboarding + Forgot password
- Production freeze until message contains `987654321`

## 4. Out of scope

- Production deploy / merge-to-prod without `987654321` — you forbade it
- Deep build of Sales, Website Content CMS, Analytics, HR-after-hire in wave 1 — later plans
- External CMS (Strapi/WordPress) — we build in-app
- Parallel old+new admin in production — one cutover later, only when you say so
- Keeping shared `ADMIN_EMAIL` / `ADMIN_PASSWORD` login in the new system — removed

## 5. Who this is for

- **Super Admin** — everything; creates users; assigns roles
- **Hiring Manager** — full hiring hub
- **Blog Author** — blogs only (all posts shared among authors)
- **Sales / Leads** — quote inquiries only (module later)
- **Public visitors** — see published blog posts on `/blog`

## 6. How it works today

- Public site + `/admin` with one env-based password
- Admin pages: overview, applications, jobs, culture, departments, templates
- `/blog` is “coming soon” with no database
- Contact form saves quote inquiries; no admin inbox UI
- No real user table or roles

## 7. How it will work after

- Login with Supabase Auth (email + password)
- After login, each role sees only their nav and home
- Hiring lives under `/admin/hiring/...`; old paths redirect
- Blog Authors manage posts; published posts appear on `/blog`
- Super Admin manages users (invite link email)
- More modules appear over time without rebuilding the shell

## 8. Chosen approach

**Option 1 + Blog early:** platform shell first, relocate hiring, then Blog as first new feature module.

Why: safe growth, one permission model, matches “huge system” without breaking production.

## 9. Other options we considered

- **Blog-first thin roles** — faster blogs, messy auth rewrite later
- **External CMS for blogs** — two logins, weaker one-system feel
- **Big-bang full redesign** — too risky; conflicts with branch/production rule

## 10. Codebase contact points

| Area | What we change | Why |
|------|----------------|-----|
| `src/pages/admin/*` | Shell, nav by role, hiring paths, blog pages | New platform UI |
| `src/App.tsx` | Public blog routes; admin split stays | Routing |
| `src/lib/adminApi.ts` + `admin-login` / `admin-api` | Replace shared secret auth; role checks | Security |
| Supabase migrations | `admin_users`/profiles, roles, `blog_posts` | Data |
| `src/pages/BlogPage.tsx` | Real posts list + detail | Public blog |
| `quote_inquiries` | Later Sales module | Already in DB |
| Postman / tests | Update for new auth | QA |
| Detailed plans | See links below | Build guides |

**Deep plans (wave 1):**

- [Platform shell](./2026-08-10-admin-platform-shell-plan.md)
- [Hiring relocate](./2026-08-10-admin-hiring-relocate-plan.md)
- [Blog module](./2026-08-10-admin-blog-module-plan.md)

**Later detailed plans (placeholders — write when we start):**

- `docs/plans/YYYY-MM-DD-admin-sales-leads-plan.md`
- `docs/plans/YYYY-MM-DD-admin-website-content-plan.md`
- `docs/plans/YYYY-MM-DD-admin-analytics-plan.md`
- `docs/plans/YYYY-MM-DD-admin-hr-after-hire-plan.md`
- `docs/plans/YYYY-MM-DD-admin-settings-ops-plan.md`

## 11. Screens and workflow impact

| Flow | Before | After | Risk |
|------|--------|-------|------|
| Production admin | Shared login hiring hub | Unchanged until `987654321` | Accidental deploy |
| Login | Env email/password | Supabase Auth users | Seed / invite misconfig |
| Hiring | Flat `/admin/*` | `/admin/hiring/*` + redirects | Bookmark confusion (mitigated by redirects) |
| Blog public | Coming soon | List + post pages; empty = “No posts yet” | Empty looks unfinished (accepted) |
| Blog admin | None | Author dashboard | Wrong role seeing hiring (mitigated by RBAC) |
| Users | None | Super Admin Users page | Invite email delivery |

## 12. Data and rules

**Roles (exact names):**

- `super_admin` — all modules + user management
- `hiring_manager` — full hiring hub only
- `blog_author` — blog create/edit/publish/hide/delete; sees all posts
- `sales_leads` — quote inquiries only (later module)

**Auth:**

- Supabase Auth
- Super Admin creates user: email + username + role → invite email with link to set password
- Login page includes Forgot password
- Shared env admin login removed in new system
- First Super Admin: seeded once

**Blog (wave 1):**

- Statuses: `draft`, `published` (hide = back to draft or `hidden` — detail in blog plan)
- Author can publish, hide, permanently delete
- Public shows published only

**Hiring:**

- Same data/behavior as today; new URL home + role gate

## 13. Edge cases and decisions

- Roles — Super Admin, Hiring Manager, Blog Author, Sales/Leads
- Blog publish — Blog Author publishes themselves
- Hiring move — new paths + redirects from old URLs
- Cutover — never to production until message contains `987654321`
- Old login — removed in new system
- Plan depth — main roadmap + deep Platform/Hiring/Blog; others high-level
- User management — Super Admin only
- Blog hide — yes; permanent delete — yes
- Multi-author — all posts shared
- First Super Admin — seeded
- Empty blog — “No posts yet”
- Hiring Manager — full hub
- Wave 1 — Platform + Hiring + Blog only
- Auth — Supabase Auth
- Invite — link to set password (not plaintext password email)
- Forgot password — yes on login

## 14. Step-by-step build order

1. **Create branch** `feature/admin-platform` from current safe mainline. Verify: `git status` / branch name only; no prod deploy.
2. **Approve UI plans** via `ui-design-explore` for shell + hiring nav + blog (after this product plan is approved). Verify: UI docs approved.
3. **Execute Platform shell plan** (users, roles, auth, layout). Verify: login as seeded Super Admin; create invited user.
4. **Execute Hiring relocate plan**. Verify: Hiring Manager sees full hub under new paths; old URLs redirect; Blog Author cannot open hiring APIs.
5. **Execute Blog module plan**. Verify: author CRUD + public list/detail; empty state text.
6. **Small commits** after each logical step on the branch.
7. **Later modules** — write their detailed plans only when starting them; do not expand wave 1.
8. **Production cutover** — only after you message **`987654321`**.

## 15. Impact and risks

- Auth rewrite can lock people out if seed/invite fails — reduce by seed + test invites on branch
- Role leaks if UI hides but API does not — enforce on server
- Blog delete is permanent — confirm dialog in UI
- Scope creep into HR/Sales — refuse until their plans exist
- Accidental production push — hard gate `987654321`

## 16. Test checklist

- [ ] Seeded Super Admin can log in
- [ ] Forgot password sends reset mail (test env)
- [ ] Super Admin invites Hiring Manager / Blog Author; invite link sets password
- [ ] Hiring Manager: full hiring only; no Users, no Blog admin (unless also Super Admin)
- [ ] Blog Author: blog only; hiring API returns forbidden
- [ ] Publish → appears on `/blog`; hide → disappears; delete → gone
- [ ] Empty `/blog` shows “No posts yet”
- [ ] Old `/admin/applications` redirects to new hiring path
- [ ] Production branch/main untouched; no deploy without `987654321`

## 17. Open questions

None for wave 1 product rules.

## 18. Approval

- [x] User approved this plan
- Date / note: 2026-08-10 — approved in chat

---

## Appendix A — Full module roadmap (short)

| Module | Who | What it does | Detail plan |
|--------|-----|--------------|-------------|
| **Platform shell** | All roles | Login, roles, nav, users (Super Admin) | [shell plan](./2026-08-10-admin-platform-shell-plan.md) |
| **Hiring** | Super Admin, Hiring Manager | Current careers admin, new URLs | [hiring plan](./2026-08-10-admin-hiring-relocate-plan.md) |
| **Blog** | Super Admin, Blog Author | Posts admin + public blog | [blog plan](./2026-08-10-admin-blog-module-plan.md) |
| **Sales / Leads** | Super Admin, Sales/Leads | Inbox for quote inquiries | Later detailed plan |
| **Website / Content** | Super Admin (+ later editor role if needed) | Edit selected marketing pages | Later detailed plan |
| **Analytics** | Super Admin (+ maybe Hiring) | Counts and simple charts across modules | Later detailed plan |
| **HR after hire** | Super Admin (+ HR role later) | Light employee/onboarding records | Later detailed plan |
| **Settings / Ops** | Super Admin | App settings, email config, audit basics | Later detailed plan |

## Appendix B — How we make a “huge system” safely

1. One **shell** (auth + roles + nav).
2. Many **modules** plugged into that shell.
3. Each module gets its **own plan** before coding.
4. Build on **`feature/admin-platform`** with small commits.
5. Ship to production **only** when you send **`987654321`**.
