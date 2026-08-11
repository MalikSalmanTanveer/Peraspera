# Plan: Careers + Admin mockup-fidelity rebuild

## 1. Plain summary

The Careers hiring hub already works (jobs, apply, admin, emails). The look does **not** match the finalized mockups, and job copy is still one text blob instead of clear sections.

This plan rebuilds the **UI** to match `docs/ui/mockups/` (UI-01–UI-14) using existing Peraspera brand tokens, and changes job body storage to **structured `content_sections`** that admin edits section by section. Product behavior (pipeline, forms, resume, mail) stays the same.

Parent product plan (still valid for behavior): `docs/plans/2026-08-06-careers-hiring-hub-plan.md`.

## 2. Goal

“Done” means: local Careers + Admin look like the mockups; jobs use section JSON; public job page shows heading + paragraph or bullets per section; admin can add/reorder/remove sections with rich text where agreed; Supabase has `content_sections` on prod early; **frontend stays local until you say deploy**.

## 3. In scope

- Add `content_sections` JSON on jobs; derive plain `description` on save for SEO
- Wipe existing job body text (no migrate-from-markdown); unpublish jobs with zero complete sections
- Admin section editor (add / remove / reorder; blank until you add)
- Public job page renders sections like UI-04 left column
- Full UI rebuild of public Careers + Admin to match UI-01–14 (layout, type, color, spacing, chrome)
- TipTap (or equivalent) rich text for paragraph sections; light inline marks for bullets
- Sanitize HTML on save and when rendering
- Update types, admin-api upsert, public read paths
- Apply DB migration to Supabase **prod early**; keep Vercel/frontend local until approved
- Update setup / careers docs as needed

## 4. Out of scope

- Changing pipeline, form field types, resume rules, email behavior, auth model
- Multi-admin, notes, analytics, scheduling (still T-02 / T-03)
- Redesigning Home / About / Services / Portfolio / Blog / Labs / quote form
- Auto-migrating old markdown descriptions into sections
- Shipping frontend to www until you explicitly ask
- Unrestricted raw HTML paste

## 5. Who this is for

- **Candidates** — clearer, mockup-faithful job pages
- **Studio admin** — section-by-section job writing + admin UI that matches the tool mockups
- **You** — local preview until visual sign-off

## 6. How it works today

- Jobs store `description` (text / markdown-ish); `JobDescription` parses `##` / `-` for display
- Admin job form is mostly a large textarea
- Public + admin UI exist but drift from finalized mockups
- Careers already live on prod from T-01 deploy

## 7. How it will work after

1. Admin opens a job → adds sections (heading + paragraph **or** bullets) → edits with rich text rules below → saves
2. On save: validate ≥1 complete section; store `content_sections`; auto-write plain `description` from sections; never show `description` as an editable field
3. Public job page reads `content_sections` and renders the left column like UI-04
4. Careers landing + all admin screens match mockup layout/tokens
5. Prod DB gets the column early; live site keeps old frontend until you deploy UI

## 8. Chosen approach

**Option 1 — Mockup-faithful rebuild + structured `content_sections` JSON**, with existing brand tokens (ink / paper / accent, Plus Jakarta Sans + DM Sans). No new UI kit.

## 9. Other options we considered

- Polish-only + keep markdown — rejected (already failed fidelity)
- New SaaS UI kit for admin — rejected (generic; fights brand + mockups)
- Migrate old description → sections — rejected (you chose wipe + rewrite)
- Dual-write markdown + sections — rejected

## 10. Codebase contact points

| Area | Change |
|------|--------|
| `supabase/migrations/*` | Add `content_sections jsonb`; wipe `description`; unpublish empty |
| `supabase/functions/admin-api` | Upsert accepts sections; validates; derives `description` |
| `src/lib/careers.ts` | Types + public fetch fields |
| `src/lib/adminApi.ts` | Job payload shape |
| `src/components/careers/JobDescription.tsx` | Render sections (not markdown parse) |
| `src/pages/CareerJobPage.tsx` | Wire sections |
| `src/pages/admin/AdminJobsPage.tsx` | Section editor; remove description textarea |
| New: section editor + TipTap helpers + HTML sanitize util | Admin + safe public render |
| `src/pages/CareersPage.tsx` + careers components | Match UI-01–03, UI-11 |
| `src/pages/admin/**` + `src/components/admin/**` | Match UI-05–14 |
| Design tokens / global CSS | Align to mockups; no second palette |
| `docs/ui/2026-08-06-careers-hiring-hub-ui.md` | Superseded for visuals by new UI master doc |
| Quote / `send-quote-notification` | Do not touch |

## 11. Screens and workflow impact

| Screen | Impact |
|--------|--------|
| Careers landing | Visual rebuild to UI-01–03 / UI-11 |
| Job + apply | Sections left; form right (UI-04) |
| Admin jobs edit | Section editor replaces description box |
| Admin shell / apps / culture / templates / form builder | Visual rebuild to mockups |
| Live prod careers (until frontend deploy) | After DB migrate: empty/unpublished roles until rewritten + UI shipped |
| Quote / rest of site | Unchanged |

## 12. Data and rules

**`content_sections` shape (conceptual):**

```json
[
  {
    "id": "uuid",
    "heading": "Responsibilities",
    "body_type": "paragraph" | "bullets",
    "html": "<p>...</p>",
    "bullets": [{ "html": "..." }]
  }
]
```

- Exactly one of `html` (paragraph) or `bullets` used per section, based on `body_type`
- Empty sections (no heading or empty body) dropped on save
- **Complete section** = non-empty heading + (non-empty sanitized paragraph HTML **or** ≥1 non-empty bullet)
- **Every save** (draft or published) requires ≥1 complete section
- On migration: set `content_sections = []`, set `description = ''`, **unpublish** any job with zero complete sections
- On each save: regenerate plain-text `description` from headings + stripped body text (SEO / future JobPosting); admin never edits `description`

**Rich text allowlist**

| Body | Allowed |
|------|---------|
| Paragraph section | TipTap: bold, italic, links, lists, line breaks, headings, blockquote → sanitized HTML |
| Bullet line | bold, italic, link only (no nested headings/blockquote) |

**Permissions / security:** sanitize HTML server-side on upsert and safely render on public (no raw unrestricted HTML).

## 13. Edge cases and decisions (locked)

| # | Decision |
|---|----------|
| Storage | Structured JSON `content_sections` on the job |
| Old description | Wipe; re-enter sections by hand (no migrate) |
| Section shape | Heading + either paragraph **or** bullets |
| Editor UX | Add/remove/reorder; blank list; no starter template |
| Publish/save | Block save unless ≥1 complete section (drafts included) |
| `description` column | Keep; auto-fill from sections; not editable in admin |
| Mockup fidelity | Full UI-01–14 intentional match |
| Ship | DB to Supabase prod early; frontend local until you say |
| Live empty jobs | Auto-unpublish zero-section jobs |
| Paragraph rich text | Allowlist including headings + blockquote |
| Bullet rich text | Light marks only (bold/italic/link) |

## 14. Step-by-step build order

1. **Schema migration** — add `content_sections`, wipe descriptions, unpublish empties; apply to **Supabase prod** when you approve implementation start.  
   *Verify:* column exists; published jobs with empty sections are unpublished.

2. **API + types** — admin upsert + careers types; validation + sanitize + derive `description`.  
   *Verify:* save rejects incomplete; derived description updates.

3. **Section editor + public renderer** — admin UI for sections; public `JobDescription` from JSON.  
   *Verify:* paragraph + bullets render; XSS payloads stripped.

4. **Public Careers UI rebuild** — UI-01–04, UI-11 against mockups.  
   *Verify:* side-by-side mockup check on desktop + mobile.

5. **Admin UI rebuild** — UI-05–14 shell, apps, drawer, mail, jobs, form builder, culture, templates.  
   *Verify:* side-by-side mockup check.

6. **Local E2E** — rewrite one job with sections → apply → admin sees app.  
   *Verify:* checklist below.

7. **Frontend deploy** — only when you explicitly ask (Vercel).  
   *Verify:* prod matches local; quote still works.

## 15. Impact and risks

- **Prod careers empty** after DB migrate until you rewrite sections and ship UI — intentional
- **Rich text XSS** — must sanitize; never `dangerouslySetInnerHTML` unsanitized
- **TipTap dependency** — new admin dependency; keep allowlist tight
- **Scope** — visual rebuild is large; stick to mockups, don’t invent screens
- **Old frontend on prod** still expects `description` — after wipe, job pages look empty/404 until new UI deploys (mitigated by unpublish)

## 16. Test checklist

- [ ] Migration adds `content_sections`; descriptions wiped; empty jobs unpublished
- [ ] Cannot save job without ≥1 complete section
- [ ] Paragraph section: headings/blockquote/bold/italic/link/lists work; scripts stripped
- [ ] Bullet section: bold/italic/link only
- [ ] Reorder / add / remove sections persists
- [ ] Derived `description` updates on save; not shown as editable
- [ ] Public job left column matches UI-04 structure
- [ ] Careers landing matches UI-01–03 / UI-11
- [ ] Admin screens match UI-05–14 chrome (spot-check each)
- [ ] Apply + pipeline + Send mail still work
- [ ] Quote form unchanged
- [ ] Frontend not deployed until explicit go-ahead

## 17. Open questions

None.

## 18. Approval

- [x] User approves this master plan
- Date / note: 2026-08-06 — “aproved”
