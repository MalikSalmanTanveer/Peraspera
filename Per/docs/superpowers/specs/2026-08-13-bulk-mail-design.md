# Design: Admin bulk mailing

**Task:** T-05  
**Date:** 2026-08-13  
**Status:** Implemented locally — deploy pending (admin-api + frontend)  

## 1. Plain summary

`super_admin` gets a Bulk Mail screen: paste up to ~500 emails, optionally load a saved template, edit subject/body, choose a verified **From** address, attach **one** shared file (≤ ~10 MB), and send. Sends run as a **queued job** in batches via Resend so the request does not time out. The UI shows progress and per-address success/fail.

## 2. Goals

- Paste/dedupe recipient list (max 500 valid emails per job).
- Compose subject + HTML/text body; optional load from existing `career_email_templates`.
- Select **From** from a fixed allowlist of verified domain addresses.
- Attach one file that is sent to every recipient.
- Reliable delivery for ~500 recipients via batched worker (not one long HTTP request).
- Audit: who sent, when, from, subject, counts, per-recipient status.
- Restrict to `super_admin` only.

## 3. Non-goals (v1)

- Marketing newsletter product (segments, drip, A/B).
- Unsubscribe / preference center / CAN-SPAM automation beyond a fixed footer line if we add one later.
- Per-recipient personalization (`{{name}}`) or per-recipient attachments.
- Scheduled / recurring campaigns.
- Access for `hiring_manager`, `blog_author`, or `sales_leads`.
- Free-typed From addresses (only allowlisted, Resend-verified).
- Multiple attachments.

## 4. Locked decisions

| Topic | Decision |
|-------|----------|
| Approach | **B** — create job + process in batches |
| Max recipients | **500** per job |
| Attachments | **1** shared file, max **10 MB** |
| Who can send | **`super_admin` only** |
| From | Fixed allowlist (verified in Resend), e.g. `contact@`, `hr@`, `careers@` `@peraspera.solutions` |
| Templates | Reuse `career_email_templates` as optional starters; body editable before send |
| Provider | Existing **Resend** integration |
| Progress UX | Poll job status from admin UI |

## 5. UX / admin surface

### Nav

- New item under a top-level or Tools group: **Bulk Mail** → `/admin/bulk-mail`
- Visible only when `role === 'super_admin'` (same gate as Users).

### Compose (`/admin/bulk-mail`)

1. **From** — `AdminSelect` of allowlisted addresses (display name + email).
2. **Template** — optional; Blank or existing career templates; applying fills subject/body.
3. **Subject** / **Body** — required; body can stay as HTML string consistent with current send-mail.
4. **Recipients** — large textarea; accept comma / newline / semicolon separated; show live count of valid vs invalid after parse.
5. **Attachment** — single file picker; show name + size; reject > 10 MB client-side and server-side.
6. **Send** — confirms summary (“Send to N addresses from X?”) then creates job.
7. Redirect or inline panel to **job detail** with progress.

### Job detail / history

- List recent bulk jobs (date, from, subject, total/sent/failed, status).
- Detail: progress bar; table or downloadable CSV of failed addresses + error reason.
- No “edit and resend whole job” in v1; admin can copy failed list into a new compose.

## 6. Data model

### Config (env or small config table)

Allowlist of From addresses, e.g.:

```ts
type BulkMailFromOption = {
  email: string; // must match Resend-verified domain
  label: string; // e.g. "Careers"
};
```

v1: hardcode in Edge Function + expose via `listBulkMailFromOptions` (or env JSON `BULK_MAIL_FROM_ADDRESSES`). Prefer **env JSON** so production can add addresses without a code deploy when possible; UI reads via API.

### Tables

```sql
-- bulk_mail_jobs
id uuid pk
created_by uuid not null  -- admin_profiles.id / auth user
from_email text not null
subject text not null
body text not null
attachment_path text null      -- storage path
attachment_name text null
attachment_content_type text null
status text not null           -- queued | processing | completed | failed | cancelled
total_count int not null
sent_count int not null default 0
failed_count int not null default 0
error_summary text null
created_at timestamptz
started_at timestamptz null
completed_at timestamptz null

-- bulk_mail_recipients
id uuid pk
job_id uuid references bulk_mail_jobs on delete cascade
email text not null
status text not null           -- pending | sent | failed | skipped
resend_id text null
error text null
sent_at timestamptz null
unique (job_id, email)
```

### Storage

- Private bucket e.g. `bulk-mail-attachments` (service role only).
- Path: `{job_id}/{safe_filename}`.
- Retention: keep for audit (v1 no auto-delete); optional cleanup later.

## 7. API (admin-api actions)

All require authenticated admin + `super_admin` role check.

| Action | Purpose |
|--------|---------|
| `listBulkMailFromOptions` | Return allowlisted From addresses |
| `createBulkMailJob` | Parse recipients, validate From/subject/body/file, insert job + recipients, store attachment, status=`queued` |
| `listBulkMailJobs` | Recent jobs for history |
| `getBulkMailJob` | Job + counts + optional recipient page / failed-only |
| `processBulkMailJob` | Worker entry: claim job, send next batch, update counts (callable by cron or self-continue) |

### Create payload (sketch)

- `from_email`, `subject`, `body`
- `recipients_raw` string **or** `recipients: string[]`
- `attachment` — base64 + filename + content_type **or** multipart upload via signed URL (prefer: upload to storage with signed URL after job id reserved, to avoid huge JSON)

**Attachment upload preference:** create job shell → return signed upload URL → client uploads → `startBulkMailJob` → queued. Simpler v1 alternative: base64 in `createBulkMailJob` if under Edge payload limits; if too large, use signed URL flow. Spec locks **signed URL upload** for reliability at 10 MB.

### Send mechanics

- Extend Resend helper to accept `from` override + `attachments: [{ filename, content: base64 }]`.
- Batch size: **25** emails per worker tick (tunable).
- Rate: small delay between sends if needed to respect Resend limits.
- On worker tick: select pending recipients, send individually (so one failure does not fail the batch identity), mark sent/failed, bump counters.
- Job `completed` when no pending left; `failed` only if job cannot start (e.g. missing attachment).

### Triggering the worker

- Option 1: Supabase cron every minute calling `processBulkMailJob` for queued/processing jobs.
- Option 2: after create, fire-and-forget invoke of processor; processor re-invokes itself while work remains.

**Lock:** Option 2 with self-continue + optional cron safety net so a dropped invoke does not stall forever.

## 8. Security & compliance

- Role gate: `super_admin` only on every bulk action.
- From must be in allowlist; reject others server-side.
- Cap 500 recipients; normalize lowercase; dedupe.
- Reject obviously invalid emails; count them as skipped with reason, or block create if valid count is 0.
- Do not log full attachment bytes in application logs.
- RLS: no anon/authenticated client access to job tables; service role via Edge only (same pattern as careers admin tables).
- Abuse note: this is intentional admin tooling; still keep allowlist + role + caps to protect Resend domain reputation.

## 9. Frontend files (expected)

- `src/pages/admin/AdminBulkMailPage.tsx` — compose
- `src/pages/admin/AdminBulkMailJobPage.tsx` — progress/history detail (or combined)
- `src/lib/adminApi.ts` — new actions
- `src/lib/adminRoles.ts` — `canAccessBulkMail(role)` → super_admin
- `AdminLayout` / `AdminApp` routes + nav

## 10. Impact analysis (initial)

| Area | Impact |
|------|--------|
| `admin-api` | New actions; Resend helper gains `from` + attachments |
| DB | New migration: jobs + recipients tables; storage bucket |
| Admin UI | New routes/nav; no change to hiring SendMailPanel |
| Existing `sendMail` | Unchanged (still uses env `FROM_EMAIL`) |
| Templates | Read-only reuse of `career_email_templates` |
| Resend | Domain must verify `contact@`, `hr@`, `careers@` (and any added) before production use |

## 11. Acceptance criteria

- [ ] Super admin sees Bulk Mail; other roles do not.
- [ ] Can select From from allowlist only.
- [ ] Paste 500 emails → job created; invalid/dupes handled predictably.
- [ ] One attachment ≤ 10 MB included to each successful send.
- [ ] Progress updates until completed; failed rows visible with reason.
- [ ] Hiring single-mail flow unchanged.
- [ ] Unverified / non-allowlisted From rejected by API.

## 12. Open items (resolve before or during implement)

1. Exact From allowlist strings + display labels for production.
2. Confirm Resend account has those addresses/domain verified.
3. Body format: keep current HTML textarea vs rich editor (v1: same as SendMailPanel).
4. Whether to add a one-line legal footer on every bulk body (recommended later; not blocking v1).
