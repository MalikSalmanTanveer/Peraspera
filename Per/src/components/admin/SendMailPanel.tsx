import { useEffect, useState } from 'react';
import {
  fetchEmailTemplates,
  sendApplicationMail,
  type EmailTemplate,
} from '../../lib/adminApi';
import { AdminSelect } from './AdminSelect';

type Props = {
  applicationId: string;
  onSent: () => void;
  onCancel: () => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

export function SendMailPanel({
  applicationId,
  onSent,
  onCancel,
  onError,
  onSuccess,
}: Props) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [templateId, setTemplateId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetchEmailTemplates();
      if (res.error) {
        onError(res.error);
        return;
      }
      setTemplates(res.data ?? []);
    })();
    // onError intentionally omitted — parent passes inline handler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const tpl = templates.find((t) => t.id === id);
    if (!tpl) return;
    setSubject(tpl.subject);
    setBody(tpl.body);
  };

  const send = async () => {
    if (!subject.trim() || !body.trim()) {
      onError('Subject and body are required.');
      return;
    }
    setSending(true);
    const res = await sendApplicationMail({
      application_id: applicationId,
      subject: subject.trim(),
      body: body.trim(),
    });
    setSending(false);
    if (res.error) {
      onError(res.error);
      return;
    }
    onSuccess('Email sent.');
    onSent();
  };

  return (
    <div className="rounded-xl border border-border bg-paper/60 p-4">
      <h4 className="font-display text-base font-bold text-ink">Send mail</h4>
      <label className="mt-3 block text-[11px] font-bold uppercase tracking-widest text-muted">
        Template
        <AdminSelect
          className="mt-1.5"
          aria-label="Email template"
          value={templateId}
          onChange={applyTemplate}
          options={[
            { value: '', label: 'Blank' },
            ...templates.map((t) => ({ value: t.id, label: t.name })),
          ]}
        />
      </label>
      <label className="mt-3 block text-[11px] font-bold uppercase tracking-widest text-muted">
        Subject
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="admin-input mt-1.5 w-full"
        />
      </label>
      <label className="mt-3 block text-[11px] font-bold uppercase tracking-widest text-muted">
        Body
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="admin-input mt-1.5 w-full"
        />
      </label>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={sending}
          onClick={() => void send()}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-accent-emphasis disabled:opacity-60"
        >
          {sending ? 'Sending…' : 'Send mail'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
