import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AdminBrandMark } from '../../components/admin/AdminBrandMark';
import { defaultHomeForRole } from '../../lib/adminRoles';
import { useAdminAuth } from './AdminAuthContext';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, phase, loading: authLoading, signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!authLoading && isAuthenticated && profile) {
    return <Navigate to={defaultHomeForRole(profile.role)} replace />;
  }
  if (!authLoading && phase === 'needs_mfa') {
    return <Navigate to="/admin/mfa" replace />;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error || !result.profile) {
      const lower = (result.error ?? '').toLowerCase();
      if (lower.includes('disabled')) {
        setError(result.error);
      } else if (
        lower.includes('invalid') ||
        lower.includes('password') ||
        lower.includes('credentials') ||
        lower.includes('email')
      ) {
        setError('Incorrect email or password');
      } else {
        setError(result.error ?? 'Sign in failed');
      }
      return;
    }
    if (result.phase === 'needs_mfa') {
      navigate('/admin/mfa', { replace: true });
      return;
    }
    navigate(defaultHomeForRole(result.profile.role), { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f5] px-4 py-12">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[400px] rounded-2xl border border-black/[0.04] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
      >
        <AdminBrandMark to="/admin/login" size="lg" />

        <h1 className="mt-7 font-display text-[1.65rem] font-bold tracking-tight text-ink">
          Admin sign in
        </h1>

        <label className="mt-8 block text-[13px] font-semibold text-ink">
          Email
          <input
            type="email"
            required
            autoComplete="username"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-[#aaa] focus:border-accent"
          />
        </label>

        <label className="mt-4 block text-[13px] font-semibold text-ink">
          Password
          <div className="relative mt-2">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#e0e0e0] bg-white px-4 py-3 pr-12 text-sm text-ink outline-none placeholder:text-[#aaa] focus:border-accent"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-ink"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || authLoading}
          className="mt-7 w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-ink transition hover:brightness-95 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="mt-5 text-center text-sm text-muted-alt">
          <Link
            to="/admin/forgot-password"
            className="font-semibold text-ink underline-offset-2 hover:underline"
          >
            Forgot password?
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-[#8a8a8a]">Authorized administrators only.</p>
      </form>

      <div className="mt-8 flex flex-col items-center gap-2 text-xs text-[#b0b0b0]">
        <AdminBrandMark to={null} size="md" />
        <span>© {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
