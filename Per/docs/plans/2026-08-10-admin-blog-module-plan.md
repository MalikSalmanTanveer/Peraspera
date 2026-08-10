# Plan: Blog Module (Admin + Public)

Parent roadmap: [2026-08-10-admin-platform-roadmap-plan.md](./2026-08-10-admin-platform-roadmap-plan.md)  
Depends on: [Platform shell](./2026-08-10-admin-platform-shell-plan.md)

## 1. Plain summary

We add a real blog. Blog Authors (and Super Admin) create, edit, publish, hide, and delete posts. All authors share all posts. Published posts show on the public site at `/blog`. If none are published, the page says “No posts yet.” Built on the feature branch only.

## 2. Goal

A Blog Author can manage posts end-to-end, and visitors can read published posts.

## 3. In scope

- DB table for blog posts (title, slug, body, cover image optional, status, author, timestamps)
- Admin blog list + editor (reuse rich text patterns from careers admin where possible)
- Publish / hide / permanent delete for Blog Author + Super Admin
- Public `/blog` list and `/blog/:slug` detail
- Empty public state: “No posts yet”
- Role gate: `blog_author` + `super_admin`
- RLS / API: public read published only; writes via authenticated admin APIs

## 4. Out of scope

- Comments, likes, newsletter signup
- SEO suite beyond basic title/slug
- Multi-language
- Approval workflow (authors publish themselves)
- Homepage `BlogSection` wiring (optional later; not required for wave 1 unless easy)

## 5. Who this is for

Blog Author, Super Admin; public readers.

## 6. How it works today

`BlogPage` is a static coming-soon placeholder. No posts table. `BlogSection` exists but is unused.

## 7. How it will work after

Author opens Blog in admin → writes draft → publishes → post appears on `/blog` and detail page. Hide removes from public. Delete removes permanently (confirm dialog).

## 8. Chosen approach

In-app CMS on Supabase, same product as the admin platform (not WordPress/Strapi).

## 9. Other options we considered

External CMS — rejected in roadmap. Approval-before-publish — rejected; authors publish themselves.

## 10. Codebase contact points

| File / area | Change |
|-------------|--------|
| New migration `blog_posts` | Storage for posts |
| New admin pages under `/admin/blog` | List + edit |
| `admin-api` or dedicated blog edge actions | CRUD + authz |
| `BlogPage.tsx` | List published |
| New `BlogPostPage.tsx` | Detail by slug |
| `App.tsx` | Route `/blog/:slug` |
| `RichTextEditor.tsx` | Reuse for body |
| Nav / `site.ts` | Already has Blogs link |

## 11. Screens and workflow impact

| Screen | Before → After |
|--------|----------------|
| `/blog` | Coming soon → list or “No posts yet” |
| `/blog/:slug` | None → post detail |
| Admin Blog | None → list + editor |

## 12. Data and rules

- **Fields (plain):** title, slug (unique), body HTML/markdown-safe, status (`draft` \| `published`), author user id, created_at, updated_at, published_at
- **Hide:** set status away from published (draft or `hidden` — implement as unpublish to `draft` unless we need a third state; **decision: unpublish → `draft`**)
- **Delete:** permanent, with confirm
- **Access:** all Blog Authors see all posts
- **Public:** only `published`

## 13. Edge cases and decisions

- Authors publish themselves
- Hide + permanent delete allowed
- Shared access among authors
- Empty = “No posts yet”
- Duplicate slug → show validation error
- Missing post slug publicly → 404-style message

## 14. Step-by-step build order

1. Migration + types for `blog_posts`. Verify: table exists on branch DB.
2. Admin API actions with role checks. Verify: Hiring Manager cannot write posts.
3. Admin list + editor UI. Verify: save draft.
4. Publish / hide / delete. Verify: status changes.
5. Public list + detail. Verify: only published visible.
6. Empty state copy. Verify: no published → “No posts yet”.
7. Commit on branch.

## 15. Impact and risks

XSS in rich HTML — reuse sanitize patterns. Accidental delete — confirm dialog. Invite-only authors without Super Admin seed — need at least one author invited.

## 16. Test checklist

- [ ] Draft not on public site
- [ ] Publish shows on `/blog` and `/blog/:slug`
- [ ] Hide removes from public
- [ ] Delete removes permanently
- [ ] Second Blog Author can edit first author’s post
- [ ] Hiring Manager cannot access blog admin API
- [ ] Empty state text correct

## 17. Open questions

None.

## 18. Approval

- [x] Covered by parent roadmap approval
- Date / note: 2026-08-10 — parent roadmap approved in chat
