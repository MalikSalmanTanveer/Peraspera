# Studio paused (shared Auth)

The Studio **app** is paused (`src/App.tsx` shows a pause screen only).

**Why:** Per admin invites and Studio shared one Supabase project. Auth **Site URL** pointed at Studio, so invite emails opened Studio → “Access pending”.

**Kept:** Marketing site homepage creative studio section (`Per` → `CreativeStudio`) — marketing copy only, not this app.

**Not deleted:** Studio source remains in the repo for later; routes/features are not mounted.

## Fix invites (required in Dashboard)

Supabase → **Authentication** → **URL configuration**:

1. Set **Site URL** to `http://localhost:5173` (local admin) or your Per production URL later.
2. Add **Redirect URLs**:
   - `http://localhost:5173/admin/set-password`
   - `http://localhost:5173/admin/reset-password`
3. You may keep Studio URLs listed, but Site URL must **not** be Studio while testing admin invites.

Edge secret (already used by Per `admin-api`):

`ADMIN_INVITE_REDIRECT_URL=http://localhost:5173/admin/set-password`
