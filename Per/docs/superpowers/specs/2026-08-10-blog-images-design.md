# Design: Blog cover + inline images

**Date:** 2026-08-10  
**Status:** Implemented — `blog-media` migrated + `admin-api` deployed on linked project  
**Branch:** `feature/admin-platform`  
**Production gate:** still requires message code `987654321` before any production cutover

## 1. Plain summary

Blog authors can upload a **cover image** for a post and **insert images into the body**. Files live in a public Supabase Storage bucket; uploads go through `admin-api` (service role). Public list and article pages show the cover; body `<img>` tags render after sanitizer allowlisting.

## 2. Goals

- Cover: pick / preview / replace / clear in the admin blog editor; persists via existing `blog_posts.cover_image_url`.
- Body: Image control in paragraph-mode rich text; uploaded image inserted as `<img src="…" alt="">`.
- Public `/blog` cards and `/blog/:slug` show cover when set; body images display with sensible max-width styling.
- Only `blog_author` and `super_admin` can upload (same gate as blog write).

## 3. Non-goals

- Image crop / focal-point UI
- Multi-image galleries or carousels
- Deleting orphaned Storage objects when cover changes or post is deleted
- Pasting arbitrary remote URLs as the primary path (upload only for Wave-1)
- Homepage `BlogSection` live feed / images
- Changing careers resume upload

## 4. Locked decisions

| Topic | Decision |
|-------|----------|
| Scope | Cover **and** inline body images |
| Upload path | Service-role via `admin-api` (not open client Storage inserts) |
| Bucket | Public `blog-media` |
| MIME | `image/jpeg`, `image/png`, `image/webp`, `image/gif` |
| Max size | 5 MB |
| Cover column | Existing `cover_image_url` — no new migration for the column |
| Inline editor | TipTap Image extension in paragraph mode only |
| Sanitizer | Allow `img` + `src`, `alt` in paragraph purify (not bullet mode) |
| Public render | Cover on list + detail; body images via existing HTML purify |

## 5. Data / storage

### Bucket migration

Create `blog-media`:

- `public: true`
- `file_size_limit`: 5_242_880 (5 MB)
- `allowed_mime_types`: jpeg, png, webp, gif
- Policies: **public `select`** on `storage.objects` for this bucket; **deny** anon/authenticated `insert`/`update`/`delete` (service role only for writes)

### Object paths

- Covers: `covers/{authorId}/{uuid}.{ext}`
- Inline: `inline/{authorId}/{uuid}.{ext}`

### Post row

No schema change. `cover_image_url` already nullable text on `blog_posts`.

## 6. API

### New action: `uploadBlogImage`

- Auth: JWT + role in (`blog_author`, `super_admin`) — same as other blog writes
- Input (JSON): `{ filename: string, contentType: string, dataBase64: string, kind: 'cover' | 'inline' }`
- Validate MIME + decoded size ≤ 5 MB
- Upload to `blog-media` under path above
- Return `{ url: string }` (public URL from `getPublicUrl`)
- Errors: 400 validation, 403 role, 500 storage

### Existing `upsertBlogPost`

Already accepts `cover_image_url`. Editor must send it on save (including `null` on clear).

## 7. Client

### `adminApi.ts`

- `uploadAdminBlogImage(file, kind)` — read file as base64, call `uploadBlogImage`, return URL

### `AdminBlogEditorPage`

- State: `coverImageUrl: string | null`
- Aside: file input + preview + Clear; on file select → upload → set URL
- `saveDraft` / load include `cover_image_url`

### `RichTextEditor` (paragraph mode)

- Add `@tiptap/extension-image`
- Toolbar Image button → file pick → `uploadAdminBlogImage(..., 'inline')` → `setImage({ src, alt: '' })`
- Bullet mode unchanged (no images)

### `sanitizeHtml.ts`

- Paragraph config: add tag `img`; attrs `src`, `alt`
- Prefer restricting `src` to http(s) only (DOMPurify default URI rules); optional later: prefix-allowlist Supabase public URL

### Public pages

- `BlogPage`: show cover thumbnail when `cover_image_url` present
- `BlogPostPage`: show cover under/above title; ensure prose styles for `img` (`max-w-full`, rounded)

## 8. Impact analysis

| Area | Impact |
|------|--------|
| DB column | None (already exists) |
| Storage | New bucket + policies migration |
| admin-api | New action + deploy |
| Admin blog editor | Cover UI + save wiring |
| RichTextEditor | Shared component — paragraph mode only; careers job sections unaffected if they use bullet or don't use Image toolbar |
| sanitizeHtml | Paragraph purify allows img — any consumer of `purifyParagraphHtml` can keep imgs (blog public + admin preview) |
| Public blog | List + detail UI |
| Tests | Add/adjust if blog sanitize or API tests exist; otherwise manual verify |

## 9. Acceptance criteria

1. Author uploads a cover → preview in editor → save draft → reload shows cover URL.
2. Publish → `/blog` card and `/blog/:slug` show the cover.
3. Clear cover → save → public pages show no cover.
4. Insert body image via toolbar → appears in editor → published article shows image.
5. Non-image file or >5 MB rejected with clear error.
6. User without blog role cannot upload (403).
7. Careers resume flow and bullet editors unchanged.

## 10. Implementation order

1. Migration `blog-media` + apply to linked project  
2. `uploadBlogImage` in admin-api + redeploy  
3. Client upload helper + cover UI + upsert wiring  
4. TipTap Image + sanitizer + public render  
5. Manual smoke on local admin + `/blog`
