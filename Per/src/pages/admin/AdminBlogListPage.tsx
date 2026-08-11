import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminBlogPosts } from '../../lib/adminApi';
import type { BlogPost } from '../../lib/blog';
import { Toast, type ToastState } from '../../components/admin/Toast';

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function AdminBlogListPage() {
  const [rows, setRows] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const result = await fetchAdminBlogPosts();
      setLoading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      setRows(result.data ?? []);
    })();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Blog posts</h1>
          <p className="mt-1 text-sm text-muted-alt">Draft, publish, hide, and delete studio notes.</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-ink transition hover:brightness-95"
        >
          New post
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-alt">Loading posts…</p>
      ) : error ? (
        <p className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : rows.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[#e8e8e8] bg-white px-6 py-10 text-center">
          <p className="text-sm text-muted-alt">No posts yet. Write your first article.</p>
          <Link
            to="/admin/blog/new"
            className="mt-4 inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-ink"
          >
            New post
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[#e8e8e8] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#e8e8e8] text-[12px] uppercase tracking-wide text-[#8a8a8a]">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-[#f0f0f0] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink">{row.title || 'Untitled'}</p>
                    <p className="text-xs text-muted-alt">/{row.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        row.status === 'published'
                          ? 'bg-accent/15 text-ink'
                          : 'bg-[#f0f0f0] text-muted-alt'
                      }`}
                    >
                      {row.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-alt">{formatDate(row.updated_at)}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/blog/${row.id}`}
                      className="rounded-lg border border-[#e0e0e0] px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-[#f7f7f7]"
                      onClick={() => setToast(null)}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
