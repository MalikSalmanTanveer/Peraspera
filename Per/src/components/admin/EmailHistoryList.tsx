import type { ApplicationEmail } from '../../lib/adminApi';

type Props = {
  emails: ApplicationEmail[];
};

export function EmailHistoryList({ emails }: Props) {
  if (!emails.length) {
    return <p className="text-sm text-muted">No emails sent yet.</p>;
  }

  return (
    <ul className="grid gap-3">
      {emails.map((email) => (
        <li key={email.id} className="rounded-xl border border-border bg-pill-bg p-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-ink">{email.subject}</p>
            <time className="text-xs text-muted" dateTime={email.sent_at}>
              {new Date(email.sent_at).toLocaleString()}
            </time>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{email.body}</p>
        </li>
      ))}
    </ul>
  );
}
