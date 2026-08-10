import { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { AdminSelect } from '../../components/admin/AdminSelect';
import { ApplicationDrawer } from '../../components/admin/ApplicationDrawer';
import { LiveBadge } from '../../components/admin/LiveBadge';
import { StatusPill } from '../../components/admin/StatusPill';
import { Toast, type ToastState } from '../../components/admin/Toast';
import {
  fetchAdminDepartments,
  fetchAdminJobs,
  fetchApplications,
  type ApplicationDetail,
} from '../../lib/adminApi';
import { subscribeCareerApplicationSignals } from '../../lib/careerRealtime';
import {
  jobDisplayTitle,
  type ApplicationStatus,
  type CareerApplication,
  type CareerDepartment,
  type CareerJob,
} from '../../lib/careers';

type AppRow = CareerApplication & {
  career_jobs?: ApplicationDetail['career_jobs'];
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

const STATUS_OPTIONS: ApplicationStatus[] = [
  'new',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
  'withdrawn',
];

export function AdminApplicationsPage() {
  const [items, setItems] = useState<AppRow[]>([]);
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [departments, setDepartments] = useState<CareerDepartment[]>([]);
  const [jobFilter, setJobFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [deptFilter, setDeptFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [appsRes, jobsRes, deptRes] = await Promise.all([
      fetchApplications({
        job_id: jobFilter || undefined,
        status: statusFilter || undefined,
      }),
      fetchAdminJobs(),
      fetchAdminDepartments(),
    ]);
    setLoading(false);
    if (appsRes.error || jobsRes.error || deptRes.error) {
      setError(appsRes.error || jobsRes.error || deptRes.error);
      return;
    }
    setError(null);
    setItems((appsRes.data as AppRow[]) ?? []);
    setJobs(jobsRes.data ?? []);
    setDepartments(deptRes.data ?? []);
  }, [jobFilter, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setLive(true);
    let refreshTimer: number | undefined;
    const unsubscribe = subscribeCareerApplicationSignals((signal) => {
      if (jobFilter && signal.job_id && signal.job_id !== jobFilter) return;
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        void load().then(() => {
          setJustUpdated(true);
          window.setTimeout(() => setJustUpdated(false), 2500);
        });
      }, 150);
    });
    return () => {
      window.clearTimeout(refreshTimer);
      setLive(false);
      unsubscribe();
    };
  }, [load, jobFilter]);

  const visibleItems = items.filter((item) => {
    if (deptFilter) {
      const match = departments.find((d) => d.id === deptFilter);
      const deptName = item.career_jobs?.career_departments?.name;
      if (!match || deptName !== match.name) return false;
    }
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      item.candidate_name.toLowerCase().includes(q) ||
      item.candidate_email.toLowerCase().includes(q) ||
      (item.career_jobs?.title ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[1.75rem] font-extrabold tracking-tight text-ink">
          Applications
        </h1>
        <LiveBadge live={live} alert={justUpdated} />
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]"
            strokeWidth={1.75}
          />
          <input
            type="search"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#e0e0e0] bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none placeholder:text-[#aaa] focus:border-accent focus:ring-2 focus:ring-accent/25"
          />
        </div>
        <AdminSelect
          aria-label="Filter by job"
          className="w-full lg:w-auto lg:min-w-[11rem]"
          value={jobFilter}
          onChange={setJobFilter}
          options={[
            { value: '', label: 'All Jobs' },
            ...jobs.map((job) => ({ value: job.id, label: jobDisplayTitle(job) })),
          ]}
        />
        <AdminSelect
          aria-label="Filter by status"
          className="w-full lg:w-auto lg:min-w-[11rem]"
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as ApplicationStatus | '')}
          options={[
            { value: '', label: 'All Statuses' },
            ...STATUS_OPTIONS.map((s) => ({
              value: s,
              label: s.charAt(0).toUpperCase() + s.slice(1),
            })),
          ]}
        />
        <AdminSelect
          aria-label="Filter by department"
          className="w-full lg:w-auto lg:min-w-[12rem]"
          value={deptFilter}
          onChange={setDeptFilter}
          options={[
            { value: '', label: 'All Departments' },
            ...departments.map((d) => ({ value: d.id, label: d.name })),
          ]}
        />
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 hidden overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] md:block">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#eee] bg-[#fafafa] text-[11px] font-semibold uppercase tracking-wider text-[#8a8a8a]">
              <th className="px-5 py-3.5 font-semibold">Name</th>
              <th className="px-5 py-3.5 font-semibold">Job</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Date</th>
              <th className="px-5 py-3.5 font-semibold">Duplicate</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[#8a8a8a]">
                  Loading…
                </td>
              </tr>
            ) : visibleItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[#8a8a8a]">
                  No applications yet.
                </td>
              </tr>
            ) : (
              visibleItems.map((item) => {
                const when = new Date(item.created_at);
                return (
                  <tr
                    key={item.id}
                    className="cursor-pointer border-b border-[#f0f0f0] last:border-0 transition-colors hover:bg-[#fafafa]"
                    onClick={() => setSelectedId(item.id)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-[11px] font-bold text-accent">
                          {initials(item.candidate_name) || '?'}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink">{item.candidate_name}</p>
                          <p className="truncate text-xs text-[#8a8a8a]">{item.candidate_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{item.career_jobs?.title ?? '—'}</p>
                      <p className="text-xs text-[#8a8a8a]">
                        {item.career_jobs?.career_departments?.name ?? ''}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={item.status} />
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-ink">
                        {when.toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-[#8a8a8a]">{relativeTime(item.created_at)}</p>
                    </td>
                    <td className="px-5 py-4">
                      {item.is_duplicate ? (
                        <span className="inline-flex rounded-md bg-accent/20 px-2 py-1 text-xs font-semibold text-ink">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex rounded-md bg-[#f0f0f0] px-2 py-1 text-xs font-medium text-[#8a8a8a]">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-[#eee] px-5 py-3 text-xs text-[#8a8a8a]">
          <span>
            Showing {visibleItems.length === 0 ? 0 : 1} to {visibleItems.length} of{' '}
            {visibleItems.length} application{visibleItems.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <ul className="mt-6 grid gap-3 md:hidden">
        {loading ? (
          <li className="text-sm text-[#8a8a8a]">Loading…</li>
        ) : visibleItems.length === 0 ? (
          <li className="rounded-2xl border border-[#e8e8e8] bg-white p-5 text-sm text-[#8a8a8a]">
            No applications yet.
          </li>
        ) : (
          visibleItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setSelectedId(item.id)}
                className="w-full rounded-2xl border border-[#e8e8e8] bg-white p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-[11px] font-bold text-accent">
                    {initials(item.candidate_name) || '?'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-ink">{item.candidate_name}</p>
                      {item.is_duplicate ? (
                        <span className="rounded-md bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold">
                          Dup
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-sm text-[#8a8a8a]">{item.career_jobs?.title ?? '—'}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <StatusPill status={item.status} />
                      <time className="text-xs text-[#8a8a8a]">{relativeTime(item.created_at)}</time>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          ))
        )}
      </ul>

      <ApplicationDrawer
        applicationId={selectedId}
        onClose={() => setSelectedId(null)}
        onChanged={() => void load()}
        onToast={(message, tone) => setToast({ message, tone })}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
