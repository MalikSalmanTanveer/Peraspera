# UI Plan: Admin Platform Wave 1 (Shell + Hiring Nav + Blog)

## 1. Plain summary

This UI work covers the multi-role admin platform shell, auth screens, Users + invite flows, Hiring nav relocate (not a hiring visual redesign), Blog admin, and the public hybrid blog. Mockup layouts are **kept for structure**. Implementation must use **real Peraspera design-system tokens** — mockup colors drifted and are **reference layout only**, not the color source of truth.

## 2. Links

- Product / master plan: `docs/plans/2026-08-10-admin-platform-roadmap-plan.md`
- Deep plans: `docs/plans/2026-08-10-admin-platform-shell-plan.md`, `...-hiring-relocate-plan.md`, `...-blog-module-plan.md`
- Prior admin UI (hiring hub): `docs/ui/2026-08-06-careers-hiring-hub-ui.md`
- Mockups folder: `docs/ui/mockups/2026-08-10-admin-platform/`
- Related chat: Direction 2 Platform Shell Refresh; theme correction required

## 3. Goal

“Good UI” means: role-clear navigation, calm light admin that still feels like Peraspera (ink + accent `#fea327` + Plus Jakarta / DM Sans), hybrid public blog that matches Careers Studio Split, and every wave-1 state has a defined look — **without inventing a second palette**.

## 4. In scope (screens & surfaces)

**Auth**
- Login (email + password)
- Forgot password
- Invite / set password
- Disabled account error
- Wrong credentials error

**Platform shell**
- Role-filtered collapsible sidebar (Hiring / Blog / Platform)
- User footer: username + role + logout
- Permission denied page
- Clearer motion (sidebar groups, toasts, key transitions)

**Users (Super Admin)**
- Users list (roles, active/disabled, pending invite)
- Invite user **separate page**

**Hiring**
- Same six hiring screens under Hiring group / new paths
- No visual redesign of applications/jobs/culture/etc. beyond nav grouping

**Blog admin**
- Posts list (draft/published pills)
- Split editor (left content / right settings)
- Publish / hide / delete + delete confirm

**Public blog**
- Index: dark hero + cards
- Article: light reading column
- Empty: “No posts yet”

## 5. Out of scope

- Sales inbox, Website CMS, Analytics, HR, Settings ops UIs
- Full redesign of existing hiring page interiors
- Dark admin theme
- Generic shadcn purple SaaS look
- Production cutover UI (branch only until `987654321`)

## 6. Current app UI snapshot

| Topic | Today |
|-------|--------|
| Color | ink `#0d0d0d`, paper `#f7f7f7`, accent `#fea327`, border `#e0e0e0`, admin bg often `#f5f5f5` |
| Type | Plus Jakarta Sans (display), DM Sans (body) |
| Admin | Light sidebar, accent active tint, quiet tool |
| Public blog | Dark coming-soon (to be replaced by hybrid live blog) |
| Tone | Expressive public / calm light admin |

## 7. Research collage

| Ref | URL | Steal | Fit |
|-----|-----|-------|-----|
| Role-filtered sidebar | eastondev / shadcn sidebar RBAC articles | Config nav + groups | High |
| Blog CMS list/editor | thefrontkit blog CMS / shadcn CRUD blog | Status pills + split editor | High |
| Invite + set password | AdminForth / Kotauth invite docs | Invite page + set-password card | High |
| Hybrid dark/light content | Wildcore + careers Studio Split | Dark index / light article | High |
| Prior Peraspera admin | `2026-08-06-careers-hiring-hub-ui.md` | Tokens, density, ConfirmDialog | Highest |

## 8. Chosen direction

**Direction 2 — Platform Shell Refresh**

Light Peraspera admin with module groups, stronger user identity, clearer auth pages, split blog editor, hybrid public blog. Hiring interiors stay as built.

## 9. Directions we did not pick

- Direction 1 Extend-only — too weak for “platform”
- Direction 3 Dark admin — scanning/hiring conflict
- Direction 4 Soft SaaS kit — generic AI look

## 10. Visual mockup index

All saved under `docs/ui/mockups/2026-08-10-admin-platform/`.

**Status: KEEP ALL for layout/IA reference. DO NOT copy mockup colors literally — re-theme to design-system tokens when building.**

| Label | File | Shows | Note |
|-------|------|-------|------|
| UI-01 | `UI-01-admin-login.png` | Login | Keep layout; use accent `#fea327` |
| UI-02 | `UI-02-forgot-password.png` | Forgot password | Keep |
| UI-03 | `UI-03-set-password-invite.png` | Set password | Keep |
| UI-04 | `UI-04-super-admin-shell-users.png` | Super Admin shell | Keep groups |
| UI-05 | `UI-05-invite-user-page.png` | Invite page | Keep |
| UI-06 | `UI-06-hiring-manager-shell.png` | Hiring Manager nav | Keep |
| UI-07 | `UI-07-blog-author-list.png` | Blog list | Keep |
| UI-08 | `UI-08-blog-editor-split.png` | Split editor | Keep |
| UI-09 | `UI-09-public-blog-index.png` | Public index dark | Keep hybrid idea |
| UI-10 | `UI-10-public-blog-article.png` | Light article | Keep |
| UI-11 | `UI-11-public-blog-empty.png` | Empty “No posts yet” | Keep |
| UI-12 | `UI-12-login-disabled-error.png` | Disabled error | Keep |
| UI-13 | `UI-13-permission-denied.png` | No access | Keep |
| UI-14 | `UI-14-users-list-filled.png` | Users table | Keep density |
| UI-15 | `UI-15-delete-post-confirm.png` | Delete confirm | Keep |

## 11. Design tokens

**Source of truth:** `design-system/*` + existing admin patterns. **Mockups are not the palette.**

### Colors (name + value + where)

- `ink` `#0d0d0d` — text, dark public heroes
- `paper` `#f7f7f7` — admin page background, light article page
- `white` `#ffffff` — cards, sidebar, panels
- `accent` `#fea327` — primary CTAs, active nav tint, focus rings
- `accent-dark` `#e08a1a` — CTA hover
- `muted` `#626262` / `muted-alt` `#6b6b6b` / `muted-light` `#999999` — secondary text
- `border` `#e0e0e0` — inputs, table rules, sidebar borders
- Admin shell bg may use `#f5f5f5` (matches current `AdminLayout`) or `paper` — pick one and stay consistent (prefer match current admin: `#f5f5f5` shell + white sidebar)
- Status pills: Draft = muted border; Published = accent tint on ink text; Disabled user = muted
- Danger delete: restrained dark/red text button — reuse ConfirmDialog pattern from hiring admin
- **Forbidden:** purple gradients, neon glow, random blue primary, off-brand greens as primary

### Typography

- Display / headings: Plus Jakarta Sans (`font-display`), extrabold where brand shows
- Body / UI: DM Sans (`font-body`)
- Admin lists: ~13–14px rows (match Applications)

### Spacing

- Admin page padding ~24–32px
- Row density match Applications (~12–16px vertical)
- Sidebar ~220px desktop

### Radius / borders / shadows

- Inputs/cards: `rounded-xl` / `rounded-2xl`
- Light border `border-black/[0.04]` or `border`
- Soft shadow only on auth cards (like current login) — no mega glow

### Breakpoints

- Desktop-first
- Sidebar → horizontal scroll / sheet on small screens (usable, not redesigned)

### Motion

- Clearer: collapsible group expand/collapse ~150–250ms
- Toast in/out
- Confirm dialog fade
- Honor `prefers-reduced-motion`

## 12. Layout system

- Public shell: existing Navbar/Footer for blog pages
- Admin shell: sidebar + main; no public nav
- Auth pages: centered card, no sidebar
- Blog editor: ~65% main / ~35% settings sidebar (≥ `lg`); stack settings below on smaller widths
- Content width: admin full useful width; public article narrow readable column (~680–720px)

## 13. Component inventory

| Name | Purpose | States | New vs reuse |
|------|---------|--------|--------------|
| AdminLoginForm | Sign in | default, loading, error, disabled-account | Extend existing |
| ForgotPasswordForm | Request reset | default, loading, success, error | New |
| SetPasswordForm | Invite accept | default, invalid link, loading, success | New |
| AdminShell / Layout | Role nav + footer | role variants | Extend `AdminLayout` |
| NavGroup | Collapsible module | open/closed/active child | New |
| UserFooter | Username, role, logout | — | Extend |
| UsersTable | List users | empty, loading, filled | New |
| InviteUserPage | Create invite | validation, sending, success | New |
| RolePill | Show role | four roles | New |
| StatusPill | Draft/Published | — | Reuse/adapt hiring StatusPill |
| BlogPostsTable | Admin posts | empty, loading, filled | New |
| BlogEditorSplit | Edit post | dirty, saving, publishing | New + RichTextEditor reuse |
| ConfirmDialog | Delete confirm | open/close | Reuse |
| Toast | Feedback | success/error | Reuse |
| PermissionDenied | Wrong role | — | New |
| PublicBlogHero | Dark index header | — | New (public tokens) |
| PublicBlogCard | Post teaser | — | New |
| PublicArticle | Light post body | — | New |
| EmptyBlog | “No posts yet” | — | New |

## 14. Screen-by-screen spec

### A. Login — `/admin/login`
- Purpose: sign in
- Layout: centered white card on `#f5f5f5`
- Controls: Email, Password (+ show/hide), Sign in, Forgot password link
- Copy: heading **Admin sign in**
- Errors: Incorrect email or password; This account is disabled. Contact a Super Admin.
- Mockup: UI-01, UI-12

### B. Forgot password
- Fields: Email; Send reset link; Back to sign in
- Success: Check your email for a reset link.
- Mockup: UI-02

### C. Set password (invite link)
- Shows invited email read-only; New password; Confirm; Create password and continue
- Invalid/expired: Invite expired or invalid + ask Super Admin to resend
- Mockup: UI-03

### D. Super Admin shell
- Groups: Platform (Users), Hiring (6 links), Blog (Posts)
- Footer: username + Super Admin
- Default home: overview or Users-capable home (prefer `/admin/hiring/overview` or platform home — **decision: `/admin/hiring/overview` for Super Admin** to keep hiring pulse; Users via nav)
- Mockup: UI-04

### E. Users list — `/admin/users`
- Columns: Username, Email, Role, Status, Actions (disable / change role / resend invite)
- CTA: Invite user → `/admin/users/invite`
- Empty: No users yet. Invite your first teammate.
- Mockup: UI-14

### F. Invite user — `/admin/users/invite`
- Fields: Email, Username, Role select
- CTA: Send invite
- Helper: They will receive an email link to set their password.
- Mockup: UI-05

### G. Hiring Manager shell
- Only Hiring group links (full hub)
- Live badge on Applications stays
- Mockup: UI-06
- Hiring page bodies: unchanged from careers UI doc

### H. Blog Author shell + list — `/admin/blog`
- Only Blog → Posts
- Table: Title, Status, Updated, actions
- CTA: New post
- Mockup: UI-07

### I. Blog editor — `/admin/blog/:id` or `/new`
- Left: title + rich text
- Right: status, slug, Publish, Hide, Delete
- Top: Save draft
- Delete → ConfirmDialog
- Mockup: UI-08, UI-15

### J. Public `/blog`
- Dark hero + cards when posts exist
- Empty: **No posts yet**
- Mockup: UI-09, UI-11

### K. Public `/blog/:slug`
- Light article reading layout
- 404-style if missing/unpublished
- Mockup: UI-10

### L. Permission denied
- Message: You do not have access to this page.
- CTA back to role home
- Mockup: UI-13

## 15. User flows (UI steps)

1. **Invite Hiring Manager:** Super Admin → Users → Invite user → fill → Send invite → email → Set password → lands in Hiring.
2. **Publish blog:** Blog Author → New post → Save draft → Publish → appears on `/blog`.
3. **Hide post:** Editor → Hide → removed from public.
4. **Delete post:** Delete → confirm → gone.
5. **Wrong role URL:** Blog Author opens hiring URL → Permission denied.

## 16. Accessibility

- Visible focus rings (accent)
- Labels on all inputs
- Errors announced with text (not color alone)
- Dialog focus trap on ConfirmDialog
- Keyboard: nav groups operable
- Contrast: ink on paper/white; accent buttons with ink text (current pattern)

## 17. Content & microcopy

- Admin sign in
- Forgot password?
- Send reset link / Back to sign in
- Set your password / Create password and continue
- Invite user / Send invite
- They will receive an email link to set their password.
- This account is disabled. Contact a Super Admin.
- You do not have access to this page.
- No posts yet
- Delete this post permanently? This cannot be undone.
- Save draft / Publish / Hide / Delete

## 18. Build order (UI only)

1. Token-locked auth pages (login, forgot, set password) — match current login card DNA with `#fea327`.
2. Shell: collapsible groups + user footer by role.
3. Users list + invite page.
4. Hiring route nesting (visual = nav only).
5. Blog list + split editor + confirm.
6. Public hybrid blog pages.
7. Permission denied + empty states.
8. Motion polish last.

Verify each step visually against **live admin Applications/Login**, not against mockup hex drift.

## 19. Impact on existing screens

- Hiring interiors: unchanged
- Public coming-soon blog: replaced by hybrid live blog
- Admin login: extended (forgot password, no hardcoded default email in UI)
- AdminLayout: becomes platform shell

## 20. Open questions

None for wave-1 UI rules. Theme correction is mandatory (closed).

## 21. Approval

- [x] User approved this UI plan
- Date / note: 2026-08-10 — approved in chat (“yes go for it”)

---

## Theme correction (hard rule)

Mockups may show off-brand blues/purples/soft UI chrome. **Ignore those colors.** When designing and implementing:

1. Use `design-system/colors.json` and existing admin classes.
2. Primary action = `accent` `#fea327` with `ink` text.
3. Match current `AdminLoginPage` / `AdminLayout` surfaces.
4. Public blog dark sections = `ink` / `dark-elevated`, accent sparingly — like Careers hero.
