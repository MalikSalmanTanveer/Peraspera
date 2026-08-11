import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AdminBrandMark } from '../../components/admin/AdminBrandMark';
import { requestAdminPasswordReset } from '../../lib/adminAuth';

export function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const result = await requestAdminPasswordReset(email);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f5] px-4 py-12">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[400px] rounded-2xl border border-black/[0.04] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
      >
        <AdminBrandMark to="/admin/login" size="lg" />

        <h1 className="mt-7 font-display text-[1.65rem] font-bold tracking-tight text-ink">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-muted-alt">
          Enter your email and we will send a reset link.
        </p>

        {success ? (
          <p className="mt-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-ink">
            Check your email for a reset link.
          </p>
        ) : (
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
        )}

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        {!success ? (
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-accent px-4 py-3 text-sm font-bold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        ) : null}

        <p className="mt-5 text-center text-sm text-muted-alt">
          <Link to="/admin/login" className="font-semibold text-ink underline-offset-2 hover:underline">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
