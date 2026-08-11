import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOverviewCounts, type OverviewCounts } from '../../lib/adminApi';

export function AdminDashboardPage() {
  const [counts, setCounts] = useState<OverviewCounts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetchOverviewCounts();
      if (res.error) {
        setError(res.error);
        return;
      }
      setCounts(res.data);
    })();
  }, []);

  const tiles = [
    { label: 'Open jobs', value: counts?.published_jobs ?? '—', to: '/admin/jobs' },
    {
      label: 'New applications',
      value: counts?.new_applications ?? '—',
      to: '/admin/applications',
    },
    {
      label: 'Total applications',
      value: counts?.applications ?? '—',
      to: '/admin/applications',
    },
    {
      label: 'Email templates',
      value: counts?.email_templates ?? '—',
      to: '/admin/templates',
    },
  ] as const;

  return (
    <div>
      <h1 className="font-display text-[1.75rem] font-extrabold tracking-tight text-ink">
        Overview
      </h1>
      <p className="mt-2 max-w-xl text-sm text-[#6b6b6b]">
        Start with applications — open a count to jump into that section.
      </p>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            to={tile.to}
            className="rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition hover:border-accent/50"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a8a8a]">
              {tile.label}
            </p>
            <p className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink">
              {tile.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link
          to="/admin/applications"
          className="inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-bold text-ink transition hover:brightness-95"
        >
          Open applications →
        </Link>
      </div>
    </div>
  );
}
