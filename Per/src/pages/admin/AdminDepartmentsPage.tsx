import { useEffect, useState, type FormEvent } from 'react';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import {
  deleteDepartment,
  fetchAdminDepartments,
  upsertDepartment,
} from '../../lib/adminApi';
import type { CareerDepartment } from '../../lib/careers';

export function AdminDepartmentsPage() {
  const [items, setItems] = useState<CareerDepartment[]>([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<CareerDepartment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetchAdminDepartments();
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setError(null);
    setItems(res.data ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const res = await upsertDepartment({
      id: editing?.id,
      name,
      sort_order: editing?.sort_order ?? items.length,
    });
    if (res.error) {
      setError(res.error);
      return;
    }
    setName('');
    setEditing(null);
    await load();
  };

  return (
    <div>
      <h2 className="admin-page-title">Departments</h2>
      <p className="admin-page-desc">Categories shown as filters on the careers page.</p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Department name"
          required
          className="admin-input flex-1 px-4 py-3"
        />
        <button
          type="submit"
          className="rounded-xl bg-accent px-5 py-3 font-semibold text-ink transition-colors hover:bg-accent-emphasis"
        >
          {editing ? 'Update' : 'Add'}
        </button>
        {editing ? (
          <button
            type="button"
            className="rounded-xl border border-border px-5 py-3 font-semibold text-ink transition-colors hover:bg-paper"
            onClick={() => {
              setEditing(null);
              setName('');
            }}
          >
            Cancel
          </button>
        ) : null}
      </form>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <ul className="admin-panel mt-6 divide-y divide-border">
        {loading ? (
          <li className="p-4 text-muted">Loading…</li>
        ) : items.length === 0 ? (
          <li className="p-4 text-muted">No departments yet.</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="text-xs text-muted">{item.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-accent/40 hover:bg-paper"
                  onClick={() => {
                    setEditing(item);
                    setName(item.name);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                  onClick={() => setDeleteId(item.id)}
                >
                  Hide
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Hide department?"
        body="It will be soft-deleted and hidden from filters."
        confirmLabel="Hide"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;
          void (async () => {
            const res = await deleteDepartment(deleteId);
            setDeleteId(null);
            if (res.error) setError(res.error);
            else await load();
          })();
        }}
      />
    </div>
  );
}
