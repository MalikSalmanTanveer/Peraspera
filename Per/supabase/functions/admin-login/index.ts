import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const adminEmail = Deno.env.get('ADMIN_EMAIL');
  const adminPassword = Deno.env.get('ADMIN_PASSWORD');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!adminEmail || !adminPassword) {
    return json({ error: 'Admin credentials not configured' }, 500);
  }
  if (!supabaseUrl || !serviceKey) {
    return json({ error: 'Server misconfigured' }, 500);
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const password = body.password ?? '';

  if (email !== adminEmail.trim().toLowerCase() || password !== adminPassword) {
    return json({ error: 'Invalid email or password' }, 401);
  }

  const token = crypto.randomUUID() + crypto.randomUUID().replaceAll('-', '');
  const tokenHash = await sha256Hex(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString();

  const supabase = createClient(supabaseUrl, serviceKey);
  const { error } = await supabase.from('admin_sessions').insert({
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (error) {
    return json({ error: error.message }, 500);
  }

  await supabase.from('admin_sessions').delete().lt('expires_at', new Date().toISOString());

  return json({ token, expiresAt });
});
