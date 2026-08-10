type Props = {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/40 p-4" role="presentation">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-lg"
      >
        <h2 id="confirm-title" className="font-display text-xl font-extrabold text-ink">
          {title}
        </h2>
        <p id="confirm-body" className="mt-2 text-sm text-muted">
          {body}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-pill border border-border px-4 py-2 text-sm font-semibold text-ink hover:bg-paper"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-pill bg-ink px-4 py-2 text-sm font-semibold text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
