/**
 * Recover an invited admin who landed on Studio "Access pending"
 * (shared Supabase project Site URL often points at Studio).
 *
 * Sets a password + ensures admin_profiles so they can use /admin/login.
 *
 * Env:
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   RECOVER_ADMIN_EMAIL
 *   RECOVER_ADMIN_PASSWORD
 *   RECOVER_ADMIN_USERNAME (optional)
 *   RECOVER_ADMIN_ROLE (optional, default hiring_manager)
 *
 * Usage: npm run recover-admin
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(resolve(process.cwd(), '.env'));
loadEnvFile(resolve(process.cwd(), '.env.local'));

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.env.RECOVER_ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.RECOVER_ADMIN_PASSWORD || '';
const username = (process.env.RECOVER_ADMIN_USERNAME || email.split('@')[0] || 'user').trim();
const role = (process.env.RECOVER_ADMIN_ROLE || 'hiring_manager').trim();

const allowed = new Set(['super_admin', 'hiring_manager', 'blog_author', 'sales_leads']);

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!email || !password || password.length < 8) {
  console.error('Set RECOVER_ADMIN_EMAIL and RECOVER_ADMIN_PASSWORD (8+ chars) in .env');
  process.exit(1);
}
if (!allowed.has(role)) {
  console.error('RECOVER_ADMIN_ROLE must be one of', [...allowed].join(', '));
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(targetEmail) {
  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users ?? [];
    const found = users.find((u) => (u.email || '').toLowerCase() === targetEmail);
    if (found) return found;
    if (users.length < perPage) return null;
    page += 1;
  }
}

async function main() {
  const user = await findUserByEmail(email);
  if (!user) {
    console.error('No Auth user found for', email);
    process.exit(1);
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password,
    email_confirm: true,
    user_metadata: {
      ...(user.user_metadata ?? {}),
      username,
      role,
    },
  });
  if (updateError) throw updateError;

  const { error: profileError } = await supabase.from('admin_profiles').upsert(
    {
      id: user.id,
      username,
      role,
      is_active: true,
    },
    { onConflict: 'id' },
  );
  if (profileError) throw profileError;

  console.log('Recovered admin user:', email);
  console.log('Role:', role, '| username:', username);
  console.log('Sign in at http://localhost:5173/admin/login (not Studio).');
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
