import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AdminBrandMark } from '../../components/admin/AdminBrandMark';
import { sendMfaEmailCode, verifyMfaEmailCode } from '../../lib/adminApi';
import { defaultHomeForRole } from '../../lib/adminRoles';
import { useAdminAuth } from './AdminAuthContext';

/** After password: enter the 6-digit code sent to contact.peraspera@gmail.com */
export function AdminMfaWaitPage() {
  const navigate = useNavigate();
  const { phase, profile, mfa, loading, refreshAuth, signOut } = useAdminAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentHint, setSentHint] = useState<string | null>(null);
  const autoSent = useRef(false);

  useEffect(() => {
    if (phase !== 'needs_mfa' || autoSent.current) return;
    autoSent.current = true;
    void (async () => {
      setBusy(true);
      const sent = await sendMfaEmailCode();
      setBusy(false);
      if (sent.error) {
        setError(sent.error);
        return;
      }
      setSentHint(sent.data?.sent_to ?? mfa?.inbox_hint ?? 'contact.peraspera@gmail.com');
    })();
  }, [phase, mfa?.inbox_hint]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] text-sm text-muted-alt">
        Loading…
      </div>
    );
  }

  if (phase === 'signed_out') return <Navigate to="/admin/login" replace />;
  if (phase === 'ready' && profile) {
    return <Navigate to={defaultHomeForRole(profile.role)} replace />;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const verified = await verifyMfaEmailCode(code.trim());
    setBusy(false);
    if (verified.error) {
      setError(verified.error);
      return;
    }
    await refreshAuth();
    if (profile) navigate(defaultHomeForRole(profile.role), { replace: true });
  };

  const onResend = async () => {
    setBusy(true);
    setError(null);
    const sent = await sendMfaEmailCode();
    setBusy(false);
    if (sent.error) {
      setError(sent.error);
      return;
    }
    setSentHint(sent.data?.sent_to ?? 'contact.peraspera@gmail.com');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f5] px-4 py-12">
      <div className="w-full max-w-[420px] rounded-2xl border border-black/[0.04] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <AdminBrandMark to="/admin/login" size="lg" />
        <h1 className="mt-7 font-display text-[1.65rem] font-bold tracking-tight text-ink">
          Enter email code
        </h1>
        <p className="mt-2 text-sm text-muted-alt">
          We sent a 6-digit code to{' '}
          <span className="font-semibold text-ink">
            {sentHint ?? mfa?.inbox_hint ?? 'contact.peraspera@gmail.com'}
          </span>
          . Enter it below to finish signing in.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-3">
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full rounded-xl border border-[#e0e0e0] px-4 py-3 text-center font-mono text-lg tracking-[0.3em] outline-none focus:border-accent"
          />
          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-ink disabled:opacity-60"
          >
            {busy ? 'Checking…' : 'Verify and continue'}
          </button>
        </form>

        <button
          type="button"
          disabled={busy}
          onClick={() => void onResend()}
          className="mt-5 w-full text-sm font-semibold text-ink underline-offset-2 hover:underline disabled:opacity-60"
        >
          Resend code
        </button>

        <p className="mt-8 text-center text-sm">
          <button
            type="button"
            className="font-semibold text-muted-alt underline-offset-2 hover:underline"
            onClick={() => void signOut().then(() => navigate('/admin/login'))}
          >
            Cancel and sign out
          </button>
        </p>
      </div>
    </div>
  );
}
