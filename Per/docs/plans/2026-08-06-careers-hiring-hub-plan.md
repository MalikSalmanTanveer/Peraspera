# Plan: Careers page + Admin hiring hub

## 1. Plain summary

We will build a Careers system for peraspera.solutions from scratch.

Visitors will see a branded Careers page (culture first, then open roles), open a job, and apply with a custom form and a required resume.

Admins will log in at `/admin`, manage culture copy, departments, jobs, form builders, and email templates. They will see every application and every form answer, move people through a hiring pipeline, send emails by hand with templates, and get live updates when new applications arrive.

All data will live in Supabase. Emails will use Resend through Edge Functions (same idea as the quote form). Old careers code and schema will be removed and replaced.

## 2. Goal

“Done” means: a public careers flow that matches the site brand, a working admin hub for jobs/forms/applications/emails, secure one-admin login, resumes stored privately, and no broken quote form or other site pages.

## 3. In scope

- Public `/careers` (culture CMS content + open roles with filters)
- Public `/careers/:slug` (job detail + apply form)
- Required resume upload (PDF / DOC / DOCX, max 10 MB) to private Supabase Storage
- Full form builder per job (drag fields; required/optional; field types listed below)
- Admin at `/admin` (no public navbar/footer shell)
- One admin account via Edge Function secrets + session token
- Jobs CRUD (publish / unpublish); unpublished or closed jobs are hidden (404 on old links)
- Departments + job filters: department, location/remote, employment type
- Culture CMS (headline, sections, values, “how we hire”, empty-state contact CTA copy)
- Applications list + detail with **all form answers**, resume download (signed URL), duplicate flag
- Pipeline statuses: New → Screening → Interview → Offer → Hired / Rejected / Withdrawn
- Soft-delete for applications and jobs (hidden, kept in DB)
- Auto emails on apply: thank-you to candidate + notify admin
- Manual **Send mail** on an application (pick template, edit, send); store subject, time, body
- Named email templates editable in admin
- Live admin updates + badge/sound when tab is open
- Footer Careers link
- Clean wipe of old careers app code + careers DB schema; new migrations
- Setup docs for Supabase secrets, storage, Resend, and deploy

## 4. Out of scope

- Multi-admin users (later: T-02)
- Application notes and hiring analytics (later: T-03)
- Auto emails on every status change (manual Send mail instead)
- Calendar / interview scheduling links
- Candidate login / account portal
- Hosted ATS vendors (Greenhouse, Ashby, etc.)
- Changing the quote inquiry flow (keep it working as-is)

## 5. Who this is for

- **Candidates** — browse culture and roles, apply online
- **Studio admin** (one person for now) — post jobs, review applications, email candidates
- **Site visitors** — see Careers in nav and footer

## 6. How it works today

The marketing site already has a Careers nav link and some unfinished careers/admin files plus Supabase careers migrations from an earlier attempt.

Quote inquiries already use Supabase + a Resend Edge Function. That pattern is the model for career emails.

We will not keep the old careers implementation. We replace it.

## 7. How it will work after

1. Visitor opens `/careers`, reads culture, filters open roles, opens a job, fills the form, uploads resume, submits.
2. System stores the application + answers + resume path, emails the candidate and the admin, and pushes a live update to an open admin dashboard.
3. Admin logs in at `/admin`, opens Applications, reads every answer, downloads the resume, changes status, optionally picks an email template, edits it, and sends. Sent mail is logged on that application.
4. Admin also edits culture copy, departments, jobs, form schemas, and email templates from the same hub.

## 8. Chosen approach

**Custom brand careers page + lightweight Supabase hiring hub.**

Public pages match Peraspera. Admin and data stay in our stack (Vite/React + Supabase + Resend). We copy good ATS *patterns* (board → job → schema form → pipeline), not a third-party ATS product.

## 9. Other options we considered

- **Hosted ATS** — fast ops, weak brand control, fights form builder + `/admin` + Supabase goal
- **Hybrid (brand page + Typeform/external apply)** — splits responses and email across tools

## 10. Codebase contact points

| Area | What we change | Why |
|------|----------------|-----|
| `src/App.tsx` | Rewire `/careers`, `/careers/:slug`, `/admin/*` | Public vs admin shells |
| `src/data/site.ts` | Keep Careers nav; confirm label/href | Nav already points to `/careers` |
| `src/sections/Footer.tsx` | Add Careers link | Agreed for v1 |
| `src/pages/CareersPage.tsx`, `CareerJobPage.tsx` | Replace from scratch | Public UX |
| `src/pages/admin/**` | Replace from scratch | Admin hub |
| `src/components/DynamicApplicationForm.tsx` + related | Replace/rewrite | Form builder + apply |
| `src/lib/careers.ts`, `adminApi.ts`, `careerRealtime.ts` | Replace | API + realtime |
| `src/lib/supabase.ts` | Keep quote helpers; add careers helpers carefully | Shared client |
| `supabase/migrations/*careers*` | Remove/replace with clean schema | Scratch restart |
| `supabase/functions/admin-login`, `admin-api`, career email functions | Replace/rebuild | Auth, CRUD, mail |
| `supabase/functions/send-quote-notification` | Do not break | Existing quote mail |
| `.env.example` | Document new secrets/vars | Setup |
| Old `CAREERS_SETUP.md` / docs | Replace with clear setup | Ops |

## 11. Screens and workflow impact

| Screen / flow | Before | After | Risk |
|---------------|--------|-------|------|
| Nav → Careers | Link exists | Brand + jobs + filters | Must match site look |
| Job apply | Partial old flow | Full builder form + resume | Upload / spam / validation |
| Empty jobs | Unclear | Culture + “no open roles” + contact CTA | Copy must be editable |
| Closed job URL | Unclear | 404 | Bookmarks die (intended) |
| Admin login | Old attempt | Secrets-based login | Never ship password in client |
| Applications | Incomplete | Full list + all answers + resume + mail log | Core success metric |
| Quote form | Works | Unchanged | Regression |
| Footer | No Careers | Careers link | Low |

## 12. Data and rules

**Pipeline statuses (exact):**  
`new` → `screening` → `interview` → `offer` → `hired` | `rejected` | `withdrawn`

**Form field types:**  
short text, long text, email, phone, dropdown, checkbox, number, date, multi-select, URL  
(+ required resume file, separate from custom fields)

**Core tables (plain names; final SQL names in implementation):**

- `departments` — name, slug, sort, soft-delete
- `jobs` — title, slug, department, location, workplace (remote/hybrid/onsite), employment type, description, status (draft/published), form schema JSON, soft-delete
- `culture_content` — CMS blocks for careers page (headline, sections, values, hiring steps, empty-state CTA)
- `email_templates` — name, subject, body
- `applications` — job id, candidate name/email/phone, status, resume storage path, answers JSON, duplicate flag, soft-delete, timestamps
- `application_emails` — application id, subject, body, sent_at
- Admin session — token issued by Edge Function (not a public table of passwords)

**Permissions:**

- Public: read published jobs + culture; submit application (via secure RPC / Edge Function)
- Admin: all write paths only with valid session token
- Resumes: private bucket; admin gets short-lived signed URLs

**Validation:**

- Resume: PDF / DOC / DOCX, max 10 MB; required
- Same email + same job again: allowed; newer row flagged `is_duplicate`
- Failed resume upload: no application row created

**Login credentials (ops, not code):**  
Email `admin@peraspera.solutions` and the agreed password live only in Edge Function secrets.

## 13. Edge cases and decisions

- Culture content: CMS in admin
- Application responses: full list + detail with all answers (must-have)
- Form builder: full builder with field types above
- Duplicates: allow; flag newer in admin
- Closed/unpublished jobs: hidden; old URL → 404
- Status emails: **not** automatic; manual Send mail with templates
- On apply: auto thank-you to candidate + notify admin
- Email templates: named, editable in admin
- Soft-delete only (apps + jobs)
- Old careers code/schema: delete/replace, clean schema
- Resume: PDF+DOC/DOCX, 10 MB
- No open roles: show culture + friendly message + contact CTA
- New apps while admin open: realtime + badge/sound
- Sent mail: log subject, time, body on application
- Job filters: department + location/remote + employment type
- Auth: Edge Function secrets + session token
- Apply failure: no row if resume fails
- Concurrent edits: last write wins
- How we hire: in culture CMS
- Out of scope: multi-admin, notes, analytics, scheduling, candidate portal

## 14. Step-by-step build order

1. **Wipe old careers surface**  
   Remove old careers pages/libs/admin/migrations/functions that we are replacing. Keep quote flow.  
   *Verify:* site builds; `/careers` and `/admin` routes stubbed or intentionally empty without breaking home.

2. **Supabase schema + storage**  
   New migration: tables above, RLS, private `resumes` bucket, indexes for job slug and application list.  
   *Verify:* migration applies cleanly on a fresh project (or wipe careers tables first).

3. **Admin login Edge Function**  
   Check secrets, issue session token, protect admin API.  
   *Verify:* wrong password fails; correct password returns token; token required for writes.

4. **Admin API Edge Function(s)**  
   CRUD for culture, departments, jobs, form schema, templates; list/detail applications; status update; soft-delete; signed resume URL; send mail + log.  
   *Verify:* each action works with token; public cannot call admin writes.

5. **Public read + apply path**  
   Public fetch for culture + published jobs; apply RPC/function (validate, upload resume, insert, duplicate flag, trigger apply emails).  
   *Verify:* apply creates row + file; failure mid-upload leaves no orphan application; closed slug 404.

6. **Public UI**  
   Careers page (culture + filters + empty state) and job page (detail + dynamic form). Match existing site design language. Footer Careers link.  
   *Verify:* desktop + mobile; empty state; filter jobs; submit success message.

7. **Admin UI**  
   Login, dashboard shell, culture editor, departments, jobs + form builder, templates, applications list/detail (answers, resume, status, Send mail, email history), soft-delete, realtime + badge/sound.  
   *Verify:* end-to-end: post job → apply → see answers → email → status change.

8. **Email wiring**  
   Resend for apply notify + thank-you + manual Send mail. Reuse quote patterns; do not break quote.  
   *Verify:* all three email types arrive; mail log stores body.

9. **Hardening + docs**  
   `.env.example`, setup doc, spam basics (rate limit / honeypot if needed), remove secrets from any client files.  
   *Verify:* build + lint clean; setup doc runnable; quote form still works.

10. **Tracking closeout prep**  
    Update `docs/dev-priorities.md` stage as we go; after ship, mark T-01 done and write module release note/docs in a later lifecycle stage.

## 15. Impact and risks

- **Security:** password must never ship in the frontend; resumes must stay private  
- **Email deliverability:** need verified Resend domain for production From address  
- **Wipe:** destroying old careers schema is intentional; confirm before running on any DB that might have real data you care about (decision: wipe)  
- **Scope creep:** form builder + CMS + realtime + templates is a large v1 — stick to the step order  
- **Quote regression:** isolate career functions from quote notification

## 16. Test checklist

- [ ] Careers in nav and footer
- [ ] Culture sections render from CMS
- [ ] No jobs → friendly empty state + contact CTA
- [ ] Filters: department, location/remote, employment type
- [ ] Published job detail + apply with all field types
- [ ] Resume required; reject bad type / over 10 MB
- [ ] Successful apply → candidate email + admin email
- [ ] Failed upload → no application row
- [ ] Second apply same email/job → allowed + duplicate flag
- [ ] Unpublished job → not listed; direct URL 404
- [ ] Admin login success/fail
- [ ] Applications list shows new rows live + badge/sound
- [ ] Application detail shows every answer + resume download
- [ ] Status changes through full pipeline
- [ ] Soft-delete hides from lists
- [ ] Templates CRUD; Send mail editable; history shows subject/time/body
- [ ] Quote form still submits and notifies
- [ ] Mobile public apply works

## 17. Open questions

None.

## 18. Approval

- [x] User approved this plan
- Date / note: 2026-08-06 — “yes plan is good”; UI Design Explore before implementation
