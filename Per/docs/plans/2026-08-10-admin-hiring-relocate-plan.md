# Plan: Hiring Module Relocate

Parent roadmap: [2026-08-10-admin-platform-roadmap-plan.md](./2026-08-10-admin-platform-roadmap-plan.md)  
Depends on: [Platform shell](./2026-08-10-admin-platform-shell-plan.md)

## 1. Plain summary

We keep today’s hiring behavior the same. We move it under a clear **Hiring** area in the new admin. Old URLs redirect to the new ones. Only Super Admin and Hiring Manager can use it. Blog Authors and Sales users cannot. Production stays untouched until `987654321`.

## 2. Goal

Hiring Manager uses the full hub under new paths; old bookmarks still work via redirects; other roles are blocked.

## 3. In scope

- Nest current pages under `/admin/hiring/...` (overview, applications, jobs, culture, departments, templates)
- Redirects from old `/admin/overview`, `/admin/applications`, etc.
- Role gate: `super_admin` + `hiring_manager`
- Nav group labeled Hiring
- Keep existing data, APIs, realtime, email templates behavior
- Update Postman paths/docs notes if needed

## 4. Out of scope

- New hiring features (interview scheduling, offers, analytics depth) — later
- Changing public `/careers` apply flow — stays
- Rewriting FormBuilder / application drawer — only move/wrap unless paths break

## 5. Who this is for

Super Admin, Hiring Manager.

## 6. How it works today

Flat admin nav: Overview, Applications, Jobs, Culture, Departments, Templates under `/admin/*`.

## 7. How it will work after

Same screens under `/admin/hiring/*`. Default hiring home can be applications or overview (keep current default: applications unless we set overview — **keep redirect of `/admin` → hiring applications** for Hiring Manager; Super Admin may land on platform overview). Old URLs redirect.

## 8. Chosen approach

Move routes + layout group; do not duplicate features. Redirects for safety.

## 9. Other options we considered

Duplicate old and new UIs — rejected. Hard cut with no redirects — rejected (worse UX).

## 10. Codebase contact points

| File / area | Change |
|-------------|--------|
| `AdminApp.tsx` | Nested hiring routes + redirects |
| `AdminLayout.tsx` | Hiring section links |
| Existing admin pages | Mostly path/import only |
| `admin-api` | Role check for hiring actions |
| Postman collection | Document new paths |

## 11. Screens and workflow impact

| Before | After | Risk |
|--------|-------|------|
| `/admin/applications` | `/admin/hiring/applications` (+ redirect) | Missed redirect |
| All staff see hiring | Only allowed roles | 403 if mis-tagged role |

## 12. Data and rules

- No schema change required for relocate
- Permission: hiring routes + hiring API actions for `super_admin` and `hiring_manager` only

## 13. Edge cases and decisions

- Full hub for Hiring Manager (all six areas)
- Redirects from old URLs
- Behavior unchanged

## 14. Step-by-step build order

1. Add nested routes under `/admin/hiring/*` pointing at existing pages. Verify: pages render.
2. Add redirects from old paths. Verify: each old URL lands correctly.
3. Restrict layout links by role. Verify: Blog Author sees no Hiring links.
4. Enforce API role checks. Verify: Blog Author token cannot list applications.
5. Adjust default post-login route per role. Verify: Hiring Manager lands in hiring.
6. Commit on branch.

## 15. Impact and risks

Missed API action without role check. Mitigate with a checklist of `admin-api` actions.

## 16. Test checklist

- [ ] All six hiring pages load under new paths
- [ ] All old paths redirect
- [ ] Hiring Manager full access
- [ ] Blog Author blocked in UI and API
- [ ] Public careers still apply normally

## 17. Open questions

None.

## 18. Approval

- [x] Covered by parent roadmap approval
- Date / note: 2026-08-10 — parent roadmap approved in chat
