/**
 * Seed the first Super Admin for feature/admin-platform (dev only).
 *
 * Requires in .env (or environment):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (Project Settings → API → service_role)
 *   SEED_SUPER_ADMIN_EMAIL
 *   SEED_SUPER_ADMIN_PASSWORD
 *   SEED_SUPER_ADMIN_USERNAME   (optional, default: superadmin)
 *
 * Usage: npm run seed
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
const email = (process.env.SEED_SUPER_ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.SEED_SUPER_ADMIN_PASSWORD || '';
const username = (process.env.SEED_SUPER_ADMIN_USERNAME || 'superadmin').trim();

if (!url || !serviceKey) {
  console.error(
    'Missing VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.',
  );
  process.exit(1);
}

if (!email || !password) {
  console.error(
    'Missing SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_PASSWORD in .env',
  );
  process.exit(1);
}

if (password.length < 8) {
  console.error('SEED_SUPER_ADMIN_PASSWORD must be at least 8 characters.');
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
  console.log(`Seeding Super Admin: ${email} (username: ${username})`);

  let user = await findUserByEmail(email);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username, role: 'super_admin' },
    });
    if (error) throw error;
    user = data.user;
    console.log('Created Auth user:', user.id);
  } else {
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: {
        ...(user.user_metadata ?? {}),
        username,
        role: 'super_admin',
      },
    });
    if (error) throw error;
    console.log('Updated existing Auth user:', user.id);
  }

  const { error: profileError } = await supabase.from('admin_profiles').upsert(
    {
      id: user.id,
      username,
      role: 'super_admin',
      is_active: true,
    },
    { onConflict: 'id' },
  );

  if (profileError) {
    console.error(
      'Profile upsert failed. Did you apply migration 20260810120000_admin_platform_profiles.sql?',
    );
    throw profileError;
  }

  console.log('admin_profiles row ready (super_admin, active).');
  console.log('Done. Sign in at /admin/login with the seed email/password.');
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
