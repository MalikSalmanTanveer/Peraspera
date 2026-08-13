import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getBulkMailJob,
  type BulkMailJob,
  type BulkMailRecipient,
} from '../../lib/adminApi';

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString() : '—';
}

function statusClass(status: BulkMailJob['status']) {
  if (status === 'completed') return 'bg-emerald-50 text-emerald-700';
  if (status === 'failed' || status === 'cancelled') return 'bg-red-50 text-red-700';
  return 'bg-accent/15 text-ink';
}

function recipientStatusClass(status: BulkMailRecipient['status']) {
  if (status === 'sent') return 'bg-emerald-50 text-emerald-700';
  if (status === 'failed') return 'bg-red-50 text-red-700';
  if (status === 'skipped') return 'bg-[#f0f0f0] text-[#666]';
  return 'bg-accent/15 text-ink';
}

function isActiveJobStatus(status: BulkMailJob['status'] | undefined) {
  return !status || status === 'queued' || status === 'processing';
}

export function AdminBulkMailJobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<BulkMailJob | null>(null);
  const [recipients, setRecipients] = useState<BulkMailRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const lastKnownStatusRef = useRef<BulkMailJob['status'] | undefined>(undefined);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      setError('Bulk mail job ID is missing.');
      return;
    }

    let active = true;
    let pollTimer: number | undefined;
    lastKnownStatusRef.current = undefined;

    const schedulePoll = () => {
      pollTimer = window.setTimeout(() => void load(), 2000);
    };

    const load = async () => {
      const result = await getBulkMailJob(jobId, true);
      if (!active) return;
      setLoading(false);

      if (result.error || !result.data?.job) {
        const message = result.error ?? 'Could not load the bulk mail job.';
        if (isActiveJobStatus(lastKnownStatusRef.current)) {
          setPollError(message);
          schedulePoll();
          return;
        }
        setError(message);
        return;
      }

      setError(null);
      setPollError(null);
      lastKnownStatusRef.current = result.data.job.status;
      setJob(result.data.job);
      setRecipients(result.data.recipients ?? []);
      if (isActiveJobStatus(result.data.job.status)) {
        schedulePoll();
      }
    };

    void load();
    return () => {
      active = false;
      if (pollTimer !== undefined) window.clearTimeout(pollTimer);
    };
  }, [jobId]);

  const failedRecipients = useMemo(
    () => recipients.filter((recipient) => recipient.status === 'failed'),
    [recipients],
  );

  const copyEmails = async (list: BulkMailRecipient[], label: string) => {
    try {
      await navigator.clipboard.writeText(list.map((recipient) => recipient.email).join('\n'));
      setCopyMessage(`${label} copied.`);
    } catch {
      setCopyMessage('Could not copy email addresses.');
    }
  };

  const processedCount = job ? job.sent_count + job.failed_count : 0;
  const progressPercent =
    job && job.total_count > 0
      ? Math.min(100, Math.round((processedCount / job.total_count) * 100))
      : 0;

  return (
    <div>
      <Link
        to="/admin/bulk-mail"
        className="text-sm font-semibold text-muted-alt hover:text-ink hover:underline"
      >
        ← Back to Bulk Mail
      </Link>

      {pollError ? (
        <p
          role="status"
          className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          {pollError} Retrying…
        </p>
      ) : null}

      {loading && !job ? (
        <p className="mt-8 text-sm text-muted-alt">Loading bulk mail job…</p>
      ) : error ? (
        <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : job ? (
        <>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="admin-page-title">{job.subject}</h1>
              <p className="admin-page-desc">From {job.from_email}</p>
            </div>
            <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusClass(job.status)}`}>
              {job.status}
            </span>
          </div>

          <section className="admin-panel mt-6 p-5" aria-labelledby="progress-heading">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="progress-heading" className="font-display text-lg font-bold text-ink">
                  Delivery progress
                </h2>
                <p className="mt-1 text-sm text-muted-alt">
                  {processedCount} of {job.total_count} processed
                </p>
              </div>
              <p className="font-display text-2xl font-bold text-ink">{progressPercent}%</p>
            </div>
            <div
              className="mt-4 h-3 overflow-hidden rounded-full bg-[#eeeeee]"
              role="progressbar"
              aria-label="Bulk mail delivery progress"
              aria-valuemin={0}
              aria-valuemax={job.total_count}
              aria-valuenow={processedCount}
              aria-valuetext={`${processedCount} of ${job.total_count} processed`}
            >
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-alt">Total</dt>
                <dd className="mt-1 text-lg font-bold text-ink">{job.total_count}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-alt">Sent</dt>
                <dd className="mt-1 text-lg font-bold text-emerald-700">{job.sent_count}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-alt">Failed</dt>
                <dd className="mt-1 text-lg font-bold text-red-700">{job.failed_count}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-alt">Attachment</dt>
                <dd className="mt-1 truncate text-sm font-semibold text-ink">
                  {job.attachment_name ?? 'None'}
                </dd>
              </div>
            </dl>
            {job.error_summary ? (
              <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {job.error_summary}
              </p>
            ) : null}
          </section>

          <section className="admin-panel mt-6 p-5" aria-labelledby="details-heading">
            <h2 id="details-heading" className="font-display text-lg font-bold text-ink">
              Job details
            </h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="font-semibold text-muted-alt">Created</dt>
                <dd className="mt-1 text-ink">{formatDate(job.created_at)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-muted-alt">Started</dt>
                <dd className="mt-1 text-ink">{formatDate(job.started_at)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-muted-alt">Completed</dt>
                <dd className="mt-1 text-ink">{formatDate(job.completed_at)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-muted-alt">Job ID</dt>
                <dd className="mt-1 break-all font-mono text-xs text-ink">{job.id}</dd>
              </div>
            </dl>
          </section>

          <section className="mt-8" aria-labelledby="recipients-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="recipients-heading" className="font-display text-xl font-bold text-ink">
                  Recipients
                </h2>
                <p className="mt-1 text-sm text-muted-alt">
                  Every address in this job, with delivery status.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={recipients.length === 0}
                  onClick={() => void copyEmails(recipients, 'All recipient emails')}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Copy all emails
                </button>
                <button
                  type="button"
                  disabled={failedRecipients.length === 0}
                  onClick={() => void copyEmails(failedRecipients, 'Failed email addresses')}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Copy failed emails
                </button>
              </div>
            </div>
            {copyMessage ? (
              <p className="mt-3 text-sm text-muted-alt" role="status">{copyMessage}</p>
            ) : null}

            <div className="admin-panel mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border text-[12px] uppercase tracking-wide text-muted-alt">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Sent at</th>
                    <th className="px-4 py-3 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {recipients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-muted-alt">
                        No recipients yet.
                      </td>
                    </tr>
                  ) : (
                    recipients.map((recipient) => (
                      <tr key={recipient.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-medium text-ink">{recipient.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${recipientStatusClass(recipient.status)}`}
                          >
                            {recipient.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-alt">
                          {formatDate(recipient.sent_at)}
                        </td>
                        <td className="px-4 py-3 text-red-700">
                          {recipient.error ?? '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
