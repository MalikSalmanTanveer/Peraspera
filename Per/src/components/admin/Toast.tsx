import { useEffect } from 'react';

export type ToastState = {
  message: string;
  tone: 'success' | 'error';
} | null;

type Props = {
  toast: ToastState;
  onDismiss: () => void;
};

export function Toast({ toast, onDismiss }: Props) {
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(onDismiss, 3200);
    return () => window.clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-[90] max-w-sm rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
        toast.tone === 'success'
          ? 'border-emerald-200 bg-white text-emerald-800'
          : 'border-red-200 bg-white text-red-700'
      }`}
    >
      {toast.message}
    </div>
  );
}
