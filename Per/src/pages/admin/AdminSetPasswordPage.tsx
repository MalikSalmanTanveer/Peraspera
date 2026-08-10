import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { fetchOwnAdminProfile, updateAdminPassword } from '../../lib/adminAuth';
import { defaultHomeForRole } from '../../lib/adminRoles';

export function AdminSetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isReset = location.pathname.includes('reset-password');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setInvalidLink(true);
      setReady(true);
      return;
    }

    let cancelled = false;

    const markReadyWithSession = (session: { user?: { email?: string | null } } | null) => {
      if (cancelled) return;
      if (session?.user) {
        setEmail(session.user.email ?? null);
        setInvalidLink(false);
        setReady(true);
        return true;
      }
      return false;
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      // Invite / recovery links establish a session — stay on this page to set password.
      if (
        event === 'PASSWORD_RECOVERY' ||
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED' ||
        event === 'INITIAL_SESSION'
      ) {
        if (markReadyWithSession(session)) return;
      }
      if (event === 'INITIAL_SESSION' && !session) {
        window.setTimeout(() => {
          if (cancelled || !supabase) return;
          void supabase.auth.getSession().then(({ data }) => {
            if (cancelled) return;
            if (!markReadyWithSession(data.session)) {
              setInvalidLink(true);
              setReady(true);
            }
          });
        }, 900);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    const result = await updateAdminPassword(password);
    if (result.error) {
      setLoading(false);
      setError(result.error);
      return;
    }

    const profile = await fetchOwnAdminProfile();
    setLoading(false);
    if (profile) {
      navigate(defaultHomeForRole(profile.role), { replace: true });
      return;
    }
    navigate('/admin/login', { replace: true });
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] text-sm text-muted-alt">
        Checking link…
      </div>
    );
  }

  if (invalidLink) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f5] px-4 py-12">
        <div className="w-full max-w-[400px] rounded-2xl border border-black/[0.04] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <h1 className="font-display text-[1.65rem] font-bold tracking-tight text-ink">
            Link expired or invalid
          </h1>
          <p className="mt-3 text-sm text-muted-alt">
            Request a new reset email, or ask a Super Admin to resend your invite.
          </p>
          <Link
            to="/admin/forgot-password"
            className="mt-6 inline-flex rounded-xl bg-accent px-4 py-3 text-sm font-bold text-ink"
          >
            Forgot password
          </Link>
          <Link
            to="/admin/login"
            className="mt-3 block text-center text-sm font-semibold text-ink underline-offset-2 hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f5] px-4 py-12">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[400px] rounded-2xl border border-black/[0.04] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-display text-lg font-extrabold text-ink">
            P
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">
            Peraspera
          </span>
        </div>

        <h1 className="mt-7 font-display text-[1.65rem] font-bold tracking-tight text-ink">
          {isReset ? 'Reset your password' : 'Set your password'}
        </h1>
        {email ? (
          <p className="mt-2 text-sm text-muted-alt">
            For <span className="font-semibold text-ink">{email}</span>
          </p>
        ) : null}

        <label className="mt-8 block text-[13px] font-semibold text-ink">
          New password
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent"
          />
        </label>

        <label className="mt-4 block text-[13px] font-semibold text-ink">
          Confirm password
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent"
          />
        </label>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-accent px-4 py-3 text-sm font-bold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Saving…' : isReset ? 'Update password' : 'Create password and continue'}
        </button>
      </form>
    </div>
  );
}
