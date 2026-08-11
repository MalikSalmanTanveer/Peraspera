import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { inviteAdminUser } from '../../lib/adminApi';
import { ADMIN_ROLE_LABELS, type AdminRole } from '../../lib/adminRoles';
import { AdminSelect } from '../../components/admin/AdminSelect';

const ROLE_OPTIONS = (Object.keys(ADMIN_ROLE_LABELS) as AdminRole[]).map((value) => ({
  value,
  label: ADMIN_ROLE_LABELS[value],
}));

export function AdminInviteUserPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<AdminRole>('hiring_manager');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await inviteAdminUser({ email, username, role });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    window.setTimeout(() => navigate('/admin/users', { replace: true }), 1200);
  };

  return (
    <div className="mx-auto max-w-xl">
      <Link
        to="/admin/users"
        className="text-sm font-semibold text-muted-alt underline-offset-2 hover:text-ink hover:underline"
      >
        ← Back to users
      </Link>

      <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">
        Invite user
      </h1>
      <p className="mt-2 text-sm text-muted-alt">
        They will receive an email link to set their password.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-[#e8e8e8] bg-white p-6"
      >
        <label className="block text-[13px] font-semibold text-ink">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#e0e0e0] px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="block text-[13px] font-semibold text-ink">
          Username
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#e0e0e0] px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </label>

        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink">Role</p>
          <AdminSelect
            value={role}
            onChange={(value) => setRole(value as AdminRole)}
            options={ROLE_OPTIONS}
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-ink">
            Invite sent. Redirecting…
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-ink transition hover:brightness-95 disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Send invite'}
        </button>
      </form>
    </div>
  );
}
