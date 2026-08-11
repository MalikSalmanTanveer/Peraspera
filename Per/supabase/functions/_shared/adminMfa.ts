/** Shared helpers for admin email MFA (service-role edge only). */

export type MfaMethod = 'push' | 'email' | 'recovery';

export const MFA_EMAIL_TTL_MS = 10 * 60 * 1000;
export const MFA_SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h

export async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function sessionKeyFromAccessToken(token: string): Promise<string> {
  return sha256Hex(`mfa-session:${token}`);
}

export function randomEmailCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function isoIn(ms: number): string {
  return new Date(Date.now() + ms).toISOString();
}
