/**
 * Generates the email trigger SQL with secrets from .env,
 * then prints instructions to run it in Supabase SQL Editor.
 *
 * Usage: node scripts/setup-supabase-email.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnv() {
  const envPath = resolve(root, '.env');
  try {
    const raw = readFileSync(envPath, 'utf8');
    const env = {};
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}

const env = loadEnv();
const resendKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;

if (!resendKey) {
  console.error('Missing RESEND_API_KEY in .env');
  process.exit(1);
}

const templatePath = resolve(root, 'supabase/migrations/20260320120100_quote_inquiry_email.sql');
const template = readFileSync(templatePath, 'utf8');
const sql = template.replace('RE_RESEND_API_KEY', resendKey);

const outputPath = resolve(root, 'supabase/.generated-setup-email.sql');
writeFileSync(outputPath, sql, 'utf8');

console.log('Generated:', outputPath);
console.log('');
console.log('Next: open Supabase → SQL Editor → paste the file contents → Run');
console.log('(Or copy from supabase/.generated-setup-email.sql)');
