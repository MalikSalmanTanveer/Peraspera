import { useEffect, useState, type FormEvent } from 'react';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import {
  deleteEmailTemplate,
  fetchEmailTemplates,
  upsertEmailTemplate,
  type EmailTemplate,
} from '../../lib/adminApi';

export function AdminTemplatesPage() {
  const [items, setItems] = useState<EmailTemplate[]>([]);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetchEmailTemplates();
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

  const reset = () => {
    setEditing(null);
    setName('');
    setSubject('');
    setBody('');
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const res = await upsertEmailTemplate({
      id: editing?.id,
      name: name.trim(),
      subject: subject.trim(),
      body: body.trim(),
    });
    if (res.error) {
      setError(res.error);
      return;
    }
    reset();
    await load();
  };

  return (
    <div>
      <h2 className="admin-page-title">Email templates</h2>
      <p className="admin-page-desc">
        Named templates for manual Send mail on applications.
      </p>

      <form
        onSubmit={onSubmit}
        className="admin-panel mt-6 grid max-w-2xl gap-3 p-4"
      >
        <label className="text-sm font-medium text-ink">
          Name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="admin-input mt-1.5 w-full"
          />
        </label>
        <label className="text-sm font-medium text-ink">
          Subject
          <input
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="admin-input mt-1.5 w-full"
          />
        </label>
        <label className="text-sm font-medium text-ink">
          Body
          <textarea
            required
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="admin-input mt-1.5 w-full"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-ink transition-colors hover:bg-accent-emphasis"
          >
            {editing ? 'Update template' : 'Create template'}
          </button>
          {editing ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-border px-5 py-2.5 font-semibold text-ink transition-colors hover:bg-paper"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <ul className="admin-panel mt-6 divide-y divide-border">
        {loading ? (
          <li className="p-4 text-muted">Loading…</li>
        ) : items.length === 0 ? (
          <li className="p-4 text-muted">No templates yet.</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="mt-1 text-sm text-muted">{item.subject}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-accent/40 hover:bg-paper"
                  onClick={() => {
                    setEditing(item);
                    setName(item.name);
                    setSubject(item.subject);
                    setBody(item.body);
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
        title="Hide template?"
        body="The template will be soft-deleted and hidden from the picker."
        confirmLabel="Hide"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;
          void (async () => {
            const res = await deleteEmailTemplate(deleteId);
            setDeleteId(null);
            if (res.error) setError(res.error);
            else await load();
          })();
        }}
      />
    </div>
  );
}
