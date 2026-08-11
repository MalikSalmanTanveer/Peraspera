import type { ApplicationStatus } from '../../lib/careers';

const LABELS: Record<ApplicationStatus, string> = {
  new: 'New',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

const STYLES: Record<ApplicationStatus, { wrap: string; dot: string }> = {
  new: { wrap: 'border border-border bg-pill-bg text-muted', dot: 'bg-muted-light' },
  screening: { wrap: 'border border-ink bg-white text-ink', dot: 'bg-ink' },
  interview: { wrap: 'border border-accent/35 bg-accent/10 text-ink', dot: 'bg-accent' },
  offer: { wrap: 'border border-accent bg-accent/15 text-ink', dot: 'bg-accent' },
  hired: { wrap: 'border border-ink bg-ink text-accent', dot: 'bg-accent' },
  rejected: { wrap: 'border border-border bg-paper text-muted', dot: 'bg-muted-light' },
  withdrawn: { wrap: 'border border-border bg-paper text-muted', dot: 'bg-muted-light' },
};

export function StatusPill({ status }: { status: ApplicationStatus }) {
  const style = STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold tracking-wide ${style.wrap}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {LABELS[status]}
    </span>
  );
}

export const APPLICATION_STATUS_OPTIONS: ApplicationStatus[] = [
  'new',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
  'withdrawn',
];

export function statusLabel(status: ApplicationStatus): string {
  return LABELS[status];
}
