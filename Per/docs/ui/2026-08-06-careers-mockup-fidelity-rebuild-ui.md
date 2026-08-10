# UI Plan: Careers + Admin mockup-fidelity rebuild

## 1. Plain summary

Rebuild public Careers and the `/admin` hiring hub so every major screen matches the finalized mockups (UI-01–UI-14): layout, type, color, spacing, and chrome. Job detail left column uses structured sections (heading + paragraph or bullets), not one markdown blob.

Product behavior stays as in `docs/plans/2026-08-06-careers-hiring-hub-plan.md`. This rebuild’s product deltas are in `docs/plans/2026-08-06-careers-mockup-fidelity-rebuild-plan.md`.

## 2. Links

- Rebuild master plan: `docs/plans/2026-08-06-careers-mockup-fidelity-rebuild-plan.md`
- Original product plan: `docs/plans/2026-08-06-careers-hiring-hub-plan.md`
- Prior UI plan (Direction 1 still applies; visuals superseded here): `docs/ui/2026-08-06-careers-hiring-hub-ui.md`
- Mockups: `docs/ui/mockups/` (UI-01 … UI-14)
- Tracking: `docs/dev-priorities.md` (T-01)

## 3. Goal

“Good UI” means: side-by-side with mockups, public Careers feels like Peraspera; admin is the light tool in the mocks; job sections read like UI-04’s left column; no invented layouts or second palette.

## 4. In scope (screens)

Same list as prior UI plan — all of:

**Public:** hero, jobs band, empty, job+apply, success/error/loading, closed→404, footer Careers  
**Admin:** login, shell, overview, applications table/cards, drawer, send mail, email history, jobs list + section editor, form builder, culture CMS, departments, templates, soft-delete confirms, empty/loading/error

**New UI surface:** Job **content sections** editor on job create/edit (replaces description textarea).

## 5. Out of scope

- Redesigning non-careers site pages
- Dark admin theme
- Kanban pipeline board
- Unrestricted HTML / inventing new visual directions

## 6. Current app UI snapshot

| Topic | Today | Target |
|-------|--------|--------|
| Tokens | ink / paper / accent exist | Same tokens; use them consistently like mockups |
| Job body | Markdown textarea + parser | Section cards + TipTap / bullet lines |
| Public | Partial mockup drift | Match UI-01–04, UI-11 |
| Admin | Functional light tool, chrome drift | Match UI-05–14 |

## 7. Research collage (carried forward)

Prior collage still holds: filterable careers lists, Greenhouse-style drawer, 3-column form builder, light admin for scanability. No purple glassmorphism ATS look.

## 8. Chosen direction

**Direction 1 — Studio Split + Light Tool** (unchanged)  
**Fidelity bar — Option A:** layout, type, color, spacing, chrome as close as practical to UI-01–14.

## 9. Directions we did not pick

- Public-only fidelity; leave admin as-is
- Vibe/tokens only without layout match
- New shadcn/SaaS kit

## 10. Visual mockup index

| Label | File | Shows |
|-------|------|-------|
| UI-01 | `UI-01-careers-hero-dark.png` | Dark culture hero |
| UI-02 | `UI-02-careers-jobs-light.png` | Light jobs + filters |
| UI-03 | `UI-03-careers-empty.png` | Empty roles + CTA |
| UI-04 | `UI-04-job-apply-light.png` | Job sections + apply |
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

If mockup PNGs are missing from the repo, restore them before implementation QA (they remain the visual source of truth).

## 11. Design tokens

Reuse `design-system/*` — do not invent a second palette.

- **Colors:** ink `#0d0d0d`, paper `#f7f7f7`, white, accent `#fea327`, muted, border `#e0e0e0`, status pills as prior UI plan
- **Type:** display Plus Jakarta Sans; body DM Sans
- **Public:** section clamps, pill CTAs, Framer reveals (2–3), reduced-motion
- **Admin:** medium density, light panels, rounded-xl/2xl, minimal shadow, accent actions

## 12. Layout system

**Public:** site shell; full-bleed dark hero → paper jobs; job page two-column on desktop (sections | apply) per UI-04; stack on mobile.

**Admin:** no public nav; ~240px sidebar + main; application drawer ~420–480px; form builder 3-col desktop.

## 13. Component inventory (delta)

| Name | Purpose | New vs change |
|------|---------|---------------|
| `JobContentSections` (public) | Render section heading + paragraph HTML or bullets | Replace markdown `JobDescription` behavior |
| `JobSectionEditor` (admin) | Add/remove/reorder; body type toggle; TipTap / bullet rows | New |
| `RichTextEditor` | TipTap allowlist for paragraph bodies | New |
| `BulletLineEditor` | Per-bullet light marks | New |
| Existing careers/admin components | Restyle to mockups | Change |

Sanitize helper shared for save + render.

## 14. Screen-by-screen spec (delta highlights)

### 14.1–14.2 Careers landing (UI-01–03, UI-11)
Match mockups exactly in hierarchy: brand/culture first; jobs band with filters; empty CTA from CMS.

### 14.3 Job detail + apply (UI-04)
- **Left:** ordered `content_sections` — section heading (display weight) then paragraph (sanitized HTML) **or** bullet list
- **Right:** dynamic form + resume + submit (existing behavior, mockup chrome)
- No single “description” blob

### 14.4–14.12 Admin
Match prior screen specs + mockups. **Jobs edit:** replace Role description textarea with **Content sections** editor:

- Empty state: “Add a section” (no starter template)
- Each section: heading field; body type = Paragraph | Bullets; TipTap or bullet list; move up/down; remove
- Save blocked with clear error if &lt;1 complete section
- Derived description not shown

## 15. User flows (UI)

**Post job with sections**
1. Jobs → Create → fill meta  
2. Add sections → edit bodies → Save (requires ≥1 complete)  
3. Publish when ready → appears on Careers after frontend is live  

**Candidate**
1. Careers → job → read sections → apply (unchanged flow)

## 16. Accessibility

Carry prior UI plan §16. Extra:

- TipTap toolbar keyboard operable; visible focus
- Sanitized content: don’t rely on color alone in rich text
- Section reorder controls labeled

## 17. Content & microcopy (additions)

| Place | Copy |
|-------|------|
| Sections empty | Add a section to describe this role |
| Save blocked | Add at least one complete section (heading and body) before saving |
| Body type | Paragraph / Bullets |
| Add section | Add section |

## 18. Build order (UI)

1. Tokens/chrome alignment pass  
2. `JobSectionEditor` + public section renderer  
3. Public Careers + job page (UI-01–04, UI-11)  
4. Admin shell + login  
5. Applications + drawer + mail + history  
6. Jobs list + form builder + culture + departments + templates  
7. Mobile pass vs UI-11 / UI-12  
8. Visual QA checklist against each mockup PNG  

## 19. Impact on existing screens

| Screen | Change |
|--------|--------|
| Careers / Admin careers surfaces | Visual + section structure rebuild |
| Rest of site | None |
| Prod until frontend deploy | May show no open roles after DB unpublish |

## 20. Open questions

None.

## 21. Approval

- [x] User approves this UI master doc
- Date / note: 2026-08-06 — “aproved”
