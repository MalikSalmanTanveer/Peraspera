# Blog Cover + Inline Images Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Cover upload + inline body images for admin blog, public render.

**Spec:** `docs/superpowers/specs/2026-08-10-blog-images-design.md`

**Branch:** `feature/admin-platform`

## File map

| File | Change |
|------|--------|
| `supabase/migrations/20260810180000_blog_media_bucket.sql` | Create public `blog-media` bucket + policies |
| `supabase/functions/admin-api/index.ts` | Add `uploadBlogImage` action |
| `src/lib/adminApi.ts` | `uploadAdminBlogImage` + pass `cover_image_url` on upsert |
| `src/lib/sanitizeHtml.ts` | Allow `img` / `src` / `alt` in paragraph mode |
| `src/components/admin/RichTextEditor.tsx` | TipTap Image + Image toolbar (paragraph) |
| `src/pages/admin/AdminBlogEditorPage.tsx` | Cover UI + save wiring |
| `src/pages/BlogPage.tsx` | Cover on cards |
| `src/pages/BlogPostPage.tsx` | Cover + img prose styles |
| `package.json` | Add `@tiptap/extension-image` |

## Tasks

### Task 1: Bucket migration
Create migration; `npx supabase db push` (or apply) to linked project.

### Task 2: admin-api uploadBlogImage
Validate MIME/size; upload; return public URL; add to BLOG_ACTIONS; redeploy function.

### Task 3: Client upload + cover editor
`uploadAdminBlogImage`; cover state/UI; upsert includes `cover_image_url`.

### Task 4: Inline images + sanitizer + public
Install TipTap Image; toolbar upload; purify allow img; render covers/public imgs.

### Task 5: Smoke
Manual: upload cover, insert body image, publish, check `/blog` and `/blog/:slug`.
