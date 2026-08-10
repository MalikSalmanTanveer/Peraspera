import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import {
  deleteApplication,
  fetchApplication,
  getSignedResumeUrl,
  updateApplicationStatus,
  type ApplicationDetail,
} from '../../lib/adminApi';
import {
  groupFieldsBySection,
  isSectionMode,
  normalizeFormSchema,
  type ApplicationStatus,
  type FormSchemaField,
} from '../../lib/careers';
import { AdminSelect } from './AdminSelect';
import { ConfirmDialog } from './ConfirmDialog';
import { DuplicateBadge } from './DuplicateBadge';
import { EmailHistoryList } from './EmailHistoryList';
import { SendMailPanel } from './SendMailPanel';
import { APPLICATION_STATUS_OPTIONS, StatusPill, statusLabel } from './StatusPill';

type Props = {
  applicationId: string | null;
  onClose: () => void;
  onChanged: () => void;
  onToast: (message: string, tone: 'success' | 'error') => void;
};

function answerLabel(key: string, fields: FormSchemaField[]): string {
  return fields.find((f) => f.field_key === key)?.label ?? key;
}

function formatAnswer(value: unknown): string {
  if (value == null) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted">{children}</h3>
  );
}

export function ApplicationDrawer({ applicationId, onClose, onChanged, onToast }: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [compose, setCompose] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    if (!applicationId) {
      setDetail(null);
      return;
    }
    setLoading(true);
    const res = await fetchApplication(applicationId);
    setLoading(false);
    if (res.error) {
      onToast(res.error, 'error');
      return;
    }
    setDetail(res.data);
    setCompose(false);
  }, [applicationId]); // onToast omitted — inline parent handler

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!applicationId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [applicationId, onClose]);

  if (!applicationId) return null;

  const answers = detail?.answers ?? {};
  const schema = normalizeFormSchema(detail?.career_jobs?.form_schema);
  const fields = schema.fields;
  const groups = groupFieldsBySection(schema, {
    includeEmptySections: false,
    includeOrphans: true,
  });
  const schemaKeys = new Set(fields.map((f) => f.field_key));
  const otherEntries = Object.entries(answers).filter(
    ([key, v]) => v !== undefined && !schemaKeys.has(key),
  );

  const changeStatus = async (status: ApplicationStatus) => {
    if (!detail) return;
    const res = await updateApplicationStatus(detail.id, status);
    if (res.error) {
      onToast(res.error, 'error');
      return;
    }
    onToast('Status updated', 'success');
    await load();
    onChanged();
  };

  const downloadResume = async () => {
    if (!detail) return;
    const res = await getSignedResumeUrl(detail.id);
    if (res.error || !res.data?.signedUrl) {
      onToast(res.error ?? 'Could not create download link', 'error');
      return;
    }
    window.open(res.data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  const softDelete = async () => {
    if (!detail) return;
    const res = await deleteApplication(detail.id);
    setConfirmDelete(false);
    if (res.error) {
      onToast(res.error, 'error');
      return;
    }
    onToast('Application hidden', 'success');
    onChanged();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-ink/25 backdrop-blur-[1px]"
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-[#e8e8e8] bg-white shadow-[-8px_0_40px_rgba(0,0,0,0.08)] outline-none motion-safe:animate-[slideIn_0.2s_ease-out] md:max-w-[460px]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#eee] px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id={titleId}
                className="truncate font-display text-xl font-extrabold tracking-tight text-ink"
              >
                {detail?.candidate_name ?? 'Application'}
              </h2>
              {detail?.is_duplicate ? <DuplicateBadge /> : null}
              {detail ? <StatusPill status={detail.status} /> : null}
            </div>
            <p className="mt-1 truncate text-sm text-[#6b6b6b]">{detail?.candidate_email ?? '—'}</p>
            <p className="mt-0.5 text-xs text-[#8a8a8a]">{detail?.career_jobs?.title ?? ''}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#8a8a8a] hover:bg-[#f5f5f5] hover:text-ink"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loading || !detail ? (
            <p className="text-sm text-[#8a8a8a]">Loading…</p>
          ) : (
            <div className="grid gap-6">
              <div>
                <SectionHeading>Status</SectionHeading>
                <AdminSelect
                  className="mt-2"
                  aria-label="Application status"
                  value={detail.status}
                  onChange={(v) => void changeStatus(v as ApplicationStatus)}
                  options={APPLICATION_STATUS_OPTIONS.map((s) => ({
                    value: s,
                    label: statusLabel(s),
                  }))}
                />
              </div>

              <div>
                <SectionHeading>Contact</SectionHeading>
                <dl className="mt-2 divide-y divide-[#f0f0f0] rounded-xl border border-[#eee]">
                  <div className="flex justify-between gap-4 px-3 py-2.5 text-sm">
                    <dt className="text-[#8a8a8a]">Email</dt>
                    <dd className="text-right font-medium text-ink">
                      <a href={`mailto:${detail.candidate_email}`} className="hover:text-accent">
                        {detail.candidate_email}
                      </a>
                    </dd>
                  </div>
                  {detail.candidate_phone ? (
                    <div className="flex justify-between gap-4 px-3 py-2.5 text-sm">
                      <dt className="text-[#8a8a8a]">Phone</dt>
                      <dd className="text-right text-ink">{detail.candidate_phone}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-4 px-3 py-2.5 text-sm">
                    <dt className="text-[#8a8a8a]">Applied</dt>
                    <dd className="text-right text-ink">
                      {new Date(detail.created_at).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <SectionHeading>Answers</SectionHeading>
                {Object.keys(answers).length === 0 ? (
                  <p className="mt-2 px-3 py-3 text-sm text-[#8a8a8a]">No custom answers.</p>
                ) : (
                  <>
                    {groups.map((group, gi) => {
                      const entries = group.fields
                        .map((f) => [f.field_key, answers[f.field_key]] as const)
                        .filter(([, v]) => v !== undefined);
                      if (!entries.length) return null;
                      return (
                        <div key={group.section?.id ?? `orphans-${gi}`} className="mt-3">
                          {isSectionMode(schema) ? (
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#8a8a8a]">
                              {group.section?.title ?? 'Unassigned'}
                            </p>
                          ) : null}
                          <dl className="divide-y divide-[#f0f0f0] rounded-xl border border-[#eee]">
                            {entries.map(([key, value]) => (
                              <div key={key} className="grid gap-1 px-3 py-2.5">
                                <dt className="text-xs font-semibold text-[#8a8a8a]">
                                  {answerLabel(key, fields)}
                                </dt>
                                <dd className="whitespace-pre-wrap text-sm text-ink">
                                  {formatAnswer(value)}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      );
                    })}
                    {otherEntries.length > 0 ? (
                      <div key="other" className="mt-3">
                        {isSectionMode(schema) ? (
                          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#8a8a8a]">
                            Other
                          </p>
                        ) : null}
                        <dl className="divide-y divide-[#f0f0f0] rounded-xl border border-[#eee]">
                          {otherEntries.map(([key, value]) => (
                            <div key={key} className="grid gap-1 px-3 py-2.5">
                              <dt className="text-xs font-semibold text-[#8a8a8a]">
                                {answerLabel(key, fields)}
                              </dt>
                              <dd className="whitespace-pre-wrap text-sm text-ink">
                                {formatAnswer(value)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ) : null}
                  </>
                )}
              </div>

              {compose ? (
                <div>
                  <SectionHeading>Send mail</SectionHeading>
                  <div className="mt-2">
                    <SendMailPanel
                      applicationId={detail.id}
                      onCancel={() => setCompose(false)}
                      onSent={() => {
                        setCompose(false);
                        void load();
                      }}
                      onError={(m) => onToast(m, 'error')}
                      onSuccess={(m) => onToast(m, 'success')}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <SectionHeading>Email history</SectionHeading>
                  <div className="mt-2">
                    <EmailHistoryList emails={detail.emails ?? []} />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-left text-sm font-semibold text-red-600 hover:underline"
              >
                Hide application
              </button>
            </div>
          )}
        </div>

        {detail && !compose ? (
          <div className="flex gap-3 border-t border-[#eee] bg-white px-5 py-4">
            <button
              type="button"
              onClick={() => void downloadResume()}
              className="flex-1 rounded-xl border border-[#e0e0e0] px-4 py-3 text-sm font-semibold text-ink transition hover:bg-[#fafafa]"
            >
              Download resume
            </button>
            <button
              type="button"
              onClick={() => setCompose(true)}
              className="flex-1 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-ink transition hover:brightness-95"
            >
              Send mail
            </button>
          </div>
        ) : null}
      </aside>

      <ConfirmDialog
        open={confirmDelete}
        title="Hide application?"
        body="Can keep in database — it will be hidden from the list."
        confirmLabel="Hide"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => void softDelete()}
      />
    </>
  );
}
