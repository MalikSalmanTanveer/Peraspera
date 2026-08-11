import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import {
  MFA_EMAIL_TTL_MS,
  MFA_SESSION_TTL_MS,
  isoIn,
  randomEmailCode,
  sha256Hex,
  type MfaMethod,
} from '../_shared/adminMfa.ts';

/** Shared inbox for every admin login OTP (override with ADMIN_MFA_EMAIL secret). */
const DEFAULT_MFA_INBOX = 'contact.peraspera@gmail.com';

export type MfaAction = 'mfaStatus' | 'mfaSendEmailCode' | 'mfaVerifyEmailCode';

export const MFA_ACTIONS = new Set<string>([
  'mfaStatus',
  'mfaSendEmailCode',
  'mfaVerifyEmailCode',
]);

/** Actions allowed before MFA is verified (password session only). */
export const MFA_PRE_VERIFY_ACTIONS = new Set<string>([
  'mfaStatus',
  'mfaSendEmailCode',
  'mfaVerifyEmailCode',
]);

type JsonFn = (body: unknown, status?: number) => Response;

type SendEmailFn = (params: {
  to: string[];
  subject: string;
  html: string;
}) => Promise<{ ok: boolean; id?: string; error?: string }>;

type Actor = { userId: string; role: string };

function mfaInbox(): string {
  return (Deno.env.get('ADMIN_MFA_EMAIL') ?? DEFAULT_MFA_INBOX).trim().toLowerCase();
}

export async function isMfaSessionVerified(
  supabase: SupabaseClient,
  userId: string,
  sessionKey: string,
): Promise<boolean> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('admin_mfa_sessions')
    .select('session_key')
    .eq('session_key', sessionKey)
    .eq('user_id', userId)
    .gt('expires_at', now)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

async function markMfaVerified(
  supabase: SupabaseClient,
  userId: string,
  sessionKey: string,
  method: MfaMethod,
): Promise<void> {
  const { error } = await supabase.from('admin_mfa_sessions').upsert(
    {
      session_key: sessionKey,
      user_id: userId,
      verified_at: new Date().toISOString(),
      expires_at: isoIn(MFA_SESSION_TTL_MS),
      method,
    },
    { onConflict: 'session_key' },
  );
  if (error) throw error;
}

export async function handleMfaAction(params: {
  action: string;
  payload: Record<string, unknown>;
  supabase: SupabaseClient;
  actor: Actor;
  sessionKey: string;
  userEmail: string | null;
  mfaVerified: boolean;
  json: JsonFn;
  sendResendEmail: SendEmailFn;
}): Promise<Response> {
  const {
    action,
    payload,
    supabase,
    actor,
    sessionKey,
    userEmail,
    json,
    sendResendEmail,
  } = params;

  switch (action as MfaAction) {
    case 'mfaStatus': {
      const verified = await isMfaSessionVerified(supabase, actor.userId, sessionKey);
      return json({
        data: {
          mfa_verified: verified,
          needs_enroll: false,
          can_use_email: true,
          inbox_hint: mfaInbox(),
        },
      });
    }

    case 'mfaSendEmailCode': {
      const to = mfaInbox();
      if (!to) return json({ error: 'Admin MFA inbox is not configured' }, 500);

      const code = randomEmailCode();
      const codeHash = await sha256Hex(code);
      const { error } = await supabase.from('admin_mfa_email_codes').insert({
        user_id: actor.userId,
        session_key: sessionKey,
        code_hash: codeHash,
        expires_at: isoIn(MFA_EMAIL_TTL_MS),
      });
      if (error) throw error;

      const who = userEmail ?? actor.userId;
      const mail = await sendResendEmail({
        to: [to],
        subject: 'Peraspera Admin sign-in code',
        html: `<p>Sign-in code for <strong>${who}</strong>:</p>
<p style="font-size:28px;letter-spacing:4px;font-weight:700">${code}</p>
<p>This code expires in 10 minutes. If you did not try to sign in, ignore this email.</p>`,
      });
      if (!mail.ok) {
        return json({ error: mail.error ?? 'Failed to send email' }, 502);
      }
      return json({ data: { ok: true, expires_in_seconds: 600, sent_to: to } });
    }

    case 'mfaVerifyEmailCode': {
      const code = String(payload.code ?? '').trim();
      if (!/^\d{6}$/.test(code)) {
        return json({ error: 'Enter the 6-digit email code' }, 400);
      }

      // Bound to this admin user + this login session — another user's code never matches
      const codeHash = await sha256Hex(code);
      const { data: row, error } = await supabase
        .from('admin_mfa_email_codes')
        .select('*')
        .eq('user_id', actor.userId)
        .eq('session_key', sessionKey)
        .is('consumed_at', null)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (!row || row.code_hash !== codeHash) {
        return json({ error: 'Incorrect or expired code' }, 400);
      }
      await supabase
        .from('admin_mfa_email_codes')
        .update({ consumed_at: new Date().toISOString() })
        .eq('id', row.id);
      await markMfaVerified(supabase, actor.userId, sessionKey, 'email');
      return json({ data: { mfa_verified: true } });
    }

    default:
      return json({ error: `Unknown MFA action: ${action}` }, 400);
  }
}
