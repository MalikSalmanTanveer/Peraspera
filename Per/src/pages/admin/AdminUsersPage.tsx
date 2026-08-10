import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAdminUsers,
  resendAdminInvite,
  setAdminUserActive,
  updateAdminUserRole,
  type AdminUserRow,
} from '../../lib/adminApi';
import { ADMIN_ROLE_LABELS, type AdminRole } from '../../lib/adminRoles';
import { AdminSelect } from '../../components/admin/AdminSelect';
import { Toast, type ToastState } from '../../components/admin/Toast';

const ROLE_OPTIONS = (Object.keys(ADMIN_ROLE_LABELS) as AdminRole[]).map((value) => ({
  value,
  label: ADMIN_ROLE_LABELS[value],
}));

export function AdminUsersPage() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAdminUsers();
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setRows(result.data ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const onRoleChange = async (userId: string, role: AdminRole) => {
    const result = await updateAdminUserRole(userId, role);
    if (result.error) {
      setToast({ message: result.error, tone: 'error' });
      return;
    }
    setToast({ message: 'Role updated', tone: 'success' });
    void load();
  };

  const onToggleActive = async (row: AdminUserRow) => {
    const result = await setAdminUserActive(row.id, !row.is_active);
    if (result.error) {
      setToast({ message: result.error, tone: 'error' });
      return;
    }
    setToast({
      message: row.is_active ? 'User disabled' : 'User enabled',
      tone: 'success',
    });
    void load();
  };

  const onResend = async (email: string) => {
    const result = await resendAdminInvite(email);
    if (result.error) {
      setToast({ message: result.error, tone: 'error' });
      return;
    }
    setToast({ message: 'Invite resent', tone: 'success' });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Users</h1>
          <p className="mt-1 text-sm text-muted-alt">Invite teammates and manage roles.</p>
        </div>
        <Link
          to="/admin/users/invite"
          className="inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-ink transition hover:brightness-95"
        >
          Invite user
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-alt">Loading users…</p>
      ) : error ? (
        <p className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : rows.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[#e8e8e8] bg-white px-6 py-10 text-center">
          <p className="text-sm text-muted-alt">No users yet. Invite your first teammate.</p>
          <Link
            to="/admin/users/invite"
            className="mt-4 inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-ink"
          >
            Invite user
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[#e8e8e8] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#e8e8e8] text-[12px] uppercase tracking-wide text-[#8a8a8a]">
              <tr>
                <th className="px-4 py-3 font-semibold">Username</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-[#f0f0f0] last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.username}</td>
                  <td className="px-4 py-3 text-muted-alt">{row.email || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="min-w-[180px]">
                      <AdminSelect
                        value={row.role}
                        onChange={(value) => void onRoleChange(row.id, value as AdminRole)}
                        options={ROLE_OPTIONS}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        row.is_active
                          ? 'bg-accent/15 text-ink'
                          : 'bg-[#f0f0f0] text-muted-alt'
                      }`}
                    >
                      {row.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void onToggleActive(row)}
                        className="rounded-lg border border-[#e0e0e0] px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-[#f7f7f7]"
                      >
                        {row.is_active ? 'Disable' : 'Enable'}
                      </button>
                      {row.email ? (
                        <button
                          type="button"
                          onClick={() => void onResend(row.email)}
                          className="rounded-lg border border-[#e0e0e0] px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-[#f7f7f7]"
                        >
                          Resend invite
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast ? <Toast toast={toast} onDismiss={() => setToast(null)} /> : null}
    </div>
  );
}
