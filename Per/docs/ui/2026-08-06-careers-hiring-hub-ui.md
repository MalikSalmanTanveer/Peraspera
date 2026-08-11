# UI Plan: Careers page + Admin hiring hub

## 1. Plain summary

This UI work covers how Careers looks and clicks on the Peraspera site, and how the quieter light admin hub at `/admin` works for jobs, forms, applications, and email.

Public Careers uses the full site language (dark culture hero → light jobs/apply). Admin reuses the same design tokens but stays calm and practical.

## 2. Links

- Product / master plan: `docs/plans/2026-08-06-careers-hiring-hub-plan.md`
- Tracking: `docs/dev-priorities.md` (T-01)
- Mockups folder: `docs/ui/mockups/`
- Related decisions: Direction 1 (Studio Split + Light Tool); all mockups UI-01–UI-14 kept

## 3. Goal

“Good UI” means: public Careers feels like Peraspera (not a generic job board); admin is clear for reading answers, changing status, and sending mail; every major state has a defined look; tokens stay consistent.

## 4. In scope (screens & surfaces)

**Public**
- Careers landing — dark culture hero
- Careers landing — light jobs + filters
- Careers empty (no open roles + contact CTA)
- Job detail + apply form
- Apply success / apply error / loading
- Closed/unpublished job → 404 page (site style)
- Footer Careers link (existing footer pattern)

**Admin**
- Login
- Shell (sidebar + main)
- Overview (lightweight counts; not full analytics)
- Applications list (desktop table / mobile cards) + live badge/sound cue
- Application right drawer (answers, resume, status, duplicate flag)
- Send mail compose (template pick + edit)
- Email history on application
- Jobs list + job create/edit
- Form builder (palette / canvas / inspector)
- Culture CMS editor
- Departments manager
- Email templates manager
- Soft-delete confirmations
- Empty / loading / error states for each admin list

## 5. Out of scope

- Redesigning Home, About, Services, Portfolio, Blog, Labs, quote form
- Multi-admin UI, notes UI, analytics charts
- Kanban board (pipeline is status select + pills, not drag columns)
- Full site visual redesign
- Dark admin theme (research picked light)

## 6. Current app UI snapshot

| Topic | Tokens / patterns |
|-------|-------------------|
| Color | Ink `#0d0d0d`, paper `#f7f7f7`, accent `#fea327`, muted greys |
| Type | Display: Plus Jakarta Sans; Body: DM Sans |
| Buttons | Pill `.btn-yellow`, outline, dark |
| Forms (public) | Underline fields (contact pattern) |
| Layout | Floating nav + footer on public; Container ~1200px |
| Motion | Framer reveals on public; reduced-motion respected |
| Tone | Studio / product site — expressive public, not bland SaaS |

## 7. Research collage

| Ref | URL | Steal | Fit |
|-----|-----|-------|-----|
| Careers filterable listings | https://www.shadcnblocks.com/block/careers8 | Dept filters + role rows | High (public jobs) |
| Careers CTA split | https://www.shadcn.io/blocks/about-careers-cta | Culture + roles pairing | Medium |
| Greenhouse candidate profile | https://www.greenhouse.com/blog/why-we-redesigned-the-candidate-profile-in-greenhouse | Side panel + stay in context | High (drawer) |
| ATS drawer case | https://www.shuai.design/application-tracking-system | Drawer over modal | High |
| Form builder 3-column | https://formspring.io/docs/forms/form-builder | Palette / canvas / inspector | High |
| Light vs dark admin | ACM ETRA / BootstrapDash / Pixel Show | Light for clear reading, intermittent use | High → light admin |

Repeated themes: sticky/see-roles CTA, filter chips, status pills, drawer detail, schema form builder. Avoid purple glassmorphism ATS demos.

## 8. Chosen direction

**Direction 1 — Studio Split + Light Tool**

Public = Peraspera storytelling (dark → light). Admin = light paper tool with accent actions. Same tokens/fonts; quieter density and chrome in admin.

## 9. Directions we did not pick

- **Direction 2 Dark Continuity** — harder to scan long answers; fights “practical quiet”
- **Direction 3 Soft SaaS ATS** — generic AI look; weak Peraspera identity

## 10. Visual mockup index

All stored in `docs/ui/mockups/`. Status: **keep all**.

| Label | File | Shows |
|-------|------|-------|
| UI-01 | `UI-01-careers-hero-dark.png` | Dark culture hero |
| UI-02 | `UI-02-careers-jobs-light.png` | Light jobs + filters |
| UI-03 | `UI-03-careers-empty.png` | Empty roles + CTA |
| UI-04 | `UI-04-job-apply-light.png` | Job + apply form |
| UI-05 | `UI-05-admin-login-light.png` | Admin login |
| UI-06 | `UI-06-admin-apps-table.png` | Applications table |
| UI-07 | `UI-07-admin-app-drawer.png` | Application drawer |
| UI-08 | `UI-08-admin-send-mail.png` | Send mail |
| UI-09 | `UI-09-admin-form-builder.png` | Form builder |
| UI-10 | `UI-10-admin-culture-cms.png` | Culture CMS |
| UI-11 | `UI-11-careers-mobile.png` | Careers mobile |
| UI-12 | `UI-12-admin-apps-mobile-cards.png` | Apps mobile cards |
| UI-13 | `UI-13-admin-jobs-list.png` | Jobs list |
| UI-14 | `UI-14-admin-email-history.png` | Email history |

States not illustrated as separate images (specify in build): loading skeletons, form validation errors, 404 closed job, send-mail failure toast.

## 11. Design tokens

Use existing `design-system/*` — do not invent a second palette.

**Colors**
- `ink` `#0d0d0d` — public dark sections, admin text
- `paper` `#f7f7f7` — public jobs/apply, admin background
- `white` `#ffffff` — admin surfaces, form panels
- `accent` `#fea327` — CTAs, active nav, focus
- `muted` / `muted-light` — secondary text
- `border` `#e0e0e0` — admin dividers, table lines
- Status: New = muted border; Screening = ink outline; Interview = accent tint; Offer = accent; Hired = dark success-like ink+accent; Rejected/Withdrawn = muted

**Typography**
- Headings: `font-display` (Plus Jakarta Sans), extrabold
- Body/UI: `font-body` (DM Sans)
- Admin table: base/md sizes; public section headings use `text-section` clamp

**Spacing**
- Public sections: `section-y` / mobile `section-y-mobile`
- Admin: medium density — row padding ~12–16px; page padding 24–32px

**Radius / shadows**
- Pills for primary CTAs (`rounded-pill`)
- Admin panels: `rounded-xl`–`rounded-2xl`, light border, minimal shadow (no mega glow)

**Breakpoints**
- Existing Tailwind screens; table ≥ `md`; cards < `md`

**Motion**
- Public: subtle Framer reveals (2–3 intentional)
- Admin: short drawer slide + toast; live badge pulse once on new app
- Honor `prefers-reduced-motion`

## 12. Layout system

**Public**
- Standard site shell: Navbar + Footer + WhatsApp/BackToTop
- Careers: full-bleed dark hero → paper jobs band → (job page) paper apply
- Max content width ~1200px (`Container`)

**Admin**
- No public nav/footer
- Left sidebar (~240px) + main content
- Application detail: right drawer (~420–480px) over list
- Form builder: 3 columns on desktop; stacked on mobile (palette collapse)

## 13. Component inventory

| Name | Purpose | States | New vs reuse |
|------|---------|--------|--------------|
| `Button` yellow/outline/dark | CTAs | default hover disabled loading | Reuse |
| `Container` / `PageBreadcrumb` | Public page chrome | — | Reuse |
| `SectionLabel` / section heading | Public section titles | — | Reuse patterns |
| `JobFilterBar` | Dept / location / type filters | empty active | New |
| `JobRow` / `JobCard` | Role listing | hover | New |
| `ApplyForm` | Dynamic fields + resume | validation submitting success error | New |
| `ResumeDropzone` | File upload | empty dragging error too-large | New |
| `AdminShell` | Sidebar + main | — | New (replace old) |
| `AdminNavLink` | Sidebar items | active | New |
| `DataTable` | Applications/jobs desktop | loading empty | New |
| `AppCard` | Applications mobile | — | New |
| `StatusPill` | Pipeline status | each status | New |
| `DuplicateBadge` | Flag re-apply | — | New |
| `ApplicationDrawer` | Detail panel | open closing loading | New |
| `SendMailPanel` | Compose | sending error success | New |
| `EmailHistoryList` | Sent mail log | empty | New |
| `FormBuilder` | Palette canvas inspector | dragging selected | New |
| `CultureEditor` | CMS fields | saving | New |
| `ConfirmDialog` | Soft-delete | open | New |
| `LiveBadge` | New application cue | idle alert | New |
| `EmptyState` | Lists / no jobs | — | New |
| `Toast` | Feedback | success error | New |

## 14. Screen-by-screen spec

### 14.1 Careers landing — dark hero (UI-01)
- **Purpose:** Brand + “why join” first impression
- **Who:** Visitors / candidates
- **Layout:** Full-bleed ink; breadcrumb optional; display headline; short support; accent “See open roles” scrolls to jobs; culture blocks (values / how we hire) may continue in dark or transition
- **Controls:** Primary CTA; CMS-driven text
- **Mobile (UI-11):** Stacked, same hierarchy
- **Mockup:** UI-01, UI-11

### 14.2 Careers landing — jobs band (UI-02)
- **Purpose:** Find and open roles
- **Layout:** Paper bg; “Open roles” heading; filter bar; list of published jobs
- **Filters:** Department, location/remote, employment type
- **Empty (UI-03):** Message + contact CTA (CMS copy)
- **Mockup:** UI-02, UI-03

### 14.3 Job detail + apply (UI-04)
- **Purpose:** Understand role and submit
- **Layout:** Light; title + badges; description; form with dynamic fields; required resume dropzone; Submit
- **States:** Loading job; validation errors; submitting; success (“Application received”); network error
- **Closed job:** 404 (no apply)
- **Mockup:** UI-04

### 14.4 Admin login (UI-05)
- **Purpose:** Sign in one admin
- **Layout:** Centered light panel; email; password; Sign in
- **States:** Invalid credentials error; loading
- **Mockup:** UI-05

### 14.5 Admin applications list (UI-06 / UI-12)
- **Purpose:** See all responses
- **Desktop:** Table — Name, Job, Status, Date, Duplicate
- **Mobile:** Cards
- **Live:** Badge/sound when new row while tab open
- **Click row:** Opens drawer
- **Mockup:** UI-06, UI-12

### 14.6 Application drawer (UI-07, UI-14)
- **Purpose:** Read answers, resume, status, mail
- **Layout:** Header (name, job, duplicate); status select; answers list; resume download; Send mail; email history
- **Actions:** Change status (no auto email); soft-delete; close drawer
- **Mockup:** UI-07, UI-14

### 14.7 Send mail (UI-08)
- **Purpose:** Manual candidate email
- **Layout:** Template select → fills subject/body → edit → Send / Cancel
- **States:** Sending; failure toast; success adds history item
- **Mockup:** UI-08

### 14.8 Form builder (UI-09)
- **Purpose:** Build per-job application schema
- **Layout:** Left palette (all field types); center ordered fields (drag); right inspector (label, required, options)
- **Mockup:** UI-09

### 14.9 Culture CMS (UI-10)
- **Purpose:** Edit public culture + empty CTA copy
- **Fields:** Headline, sections/values, how we hire steps, empty-state message/CTA
- **Mockup:** UI-10

### 14.10 Jobs list (UI-13)
- **Purpose:** Manage roles
- **Columns:** Title, department, location, type, Published/Draft, actions
- **Actions:** Create, edit (includes form builder entry), publish/unpublish, soft-delete
- **Mockup:** UI-13

### 14.11 Departments & email templates
- Simple light list + create/edit forms (same admin chrome; no dedicated mockup — match UI-13 density)

### 14.12 Overview
- Small count tiles: open jobs, new applications, need review — not charts (analytics out of scope)

## 15. User flows (UI steps)

**Apply**
1. `/careers` → read culture → See open roles  
2. Filter → open job  
3. Fill form + resume → Submit  
4. Success message; admin list updates live if open  

**Review + email**
1. `/admin` login  
2. Applications → click row → drawer  
3. Read answers → download resume → set status  
4. Send mail → pick template → edit → send → see history  

**Post a job**
1. Jobs → Create → details + form builder → Publish  
2. Appears on public careers  

## 16. Accessibility

- Focus rings on accent-visible controls
- Drawer: focus trap + Escape closes
- Form errors linked to fields (`aria-describedby`)
- Status not color-only (text labels on pills)
- Resume input keyboard operable
- Contrast: ink on paper; accent buttons use ink text on accent
- Reduced motion: no drawer thrash / badge pulse

## 17. Content & microcopy

| Place | Copy |
|-------|------|
| Hero CTA | See open roles |
| Empty jobs | No open roles right now — check back soon |
| Empty CTA | Contact us (or CMS) |
| Apply submit | Submit application |
| Apply success | Application received — we’ll be in touch |
| Resume help | PDF or DOC/DOCX, max 10 MB |
| Duplicate badge | Duplicate |
| Send mail | Send mail |
| Soft-delete | Hide application? (can keep in database) |
| Login error | Incorrect email or password |
| 404 job | This role is not available |

## 18. Build order (UI only)

1. Tokens + `AdminShell` light layout  
2. Public Careers hero + jobs band + empty (match UI-01–03)  
3. Job apply form UI (UI-04)  
4. Admin login (UI-05)  
5. Applications table/cards + drawer (UI-06–07, UI-12)  
6. Send mail + history (UI-08, UI-14)  
7. Jobs list + form builder (UI-13, UI-09)  
8. Culture CMS + departments + templates (UI-10)  
9. Live badge/sound + empty/loading/error polish  
10. Footer Careers link + mobile pass  

*Verify each step against mockups in `docs/ui/mockups/`.*

## 19. Impact on existing screens

| Screen | Change |
|--------|--------|
| Navbar | Careers link already present — keep |
| Footer | Add Careers link |
| About/Services/etc. | No redesign |
| Quote/contact form | Unchanged; apply form may echo underline style |
| Old admin/careers UI | Replaced |

## 20. Open questions

None.

## 21. Approval

- [x] User approved this UI plan
- Date / note: 2026-08-06 — “Yes approved”
