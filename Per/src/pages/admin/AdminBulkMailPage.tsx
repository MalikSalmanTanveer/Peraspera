import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminSelect } from '../../components/admin/AdminSelect';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import {
  createBulkMailJob,
  fetchEmailTemplates,
  listBulkMailFromOptions,
  listBulkMailJobs,
  startBulkMailJob,
  type BulkMailFromOption,
  type BulkMailJob,
  type EmailTemplate,
} from '../../lib/adminApi';
import {
  assertBulkMailLimits,
  BULK_MAIL_MAX_ATTACHMENT_BYTES,
  parseRecipientEmails,
} from '../../lib/bulkMail';

const fieldLabelClass = 'text-sm font-medium text-ink';

/** Built-in starters: professional 1:1 tone without promo/marketing phrasing. */
const PERSONAL_STARTERS = [
  {
    id: 'personal-growth-associate',
    label: 'Personal note · Growth Associate',
    subject: 'Growth Associate role — Per Aspera',
    body: `<p>Dear colleague,</p>
<p>I hope this message finds you well.</p>
<p>I am writing from Per Aspera regarding a Growth Associate opening for students and recent graduates based in Lahore. The position involves lead generation, outreach, and client communication, with remote and flexible working arrangements.</p>
<p>I have attached a brief overview of the role for your reference. For more details, please read the attached PDF. Candidates may also review the details and apply here:</p>
<p><a href="https://www.peraspera.solutions/careers/growth-associate">www.peraspera.solutions/careers/growth-associate</a></p>
<p>If this may be relevant to students or graduates in your network, I would be grateful if you could share it with them. I am happy to provide any further information.</p>
<p>Kind regards,<br>Salman Tanveer<br>Per Aspera<br><a href="mailto:hr@peraspera.solutions">hr@peraspera.solutions</a></p>`,
  },
] as const;

function isEmptyHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim().length === 0;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function statusClass(status: BulkMailJob['status']) {
  if (status === 'completed') return 'bg-emerald-50 text-emerald-700';
  if (status === 'failed' || status === 'cancelled') return 'bg-red-50 text-red-700';
  return 'bg-accent/15 text-ink';
}

export function AdminBulkMailPage() {
  const navigate = useNavigate();
  const [fromOptions, setFromOptions] = useState<BulkMailFromOption[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [jobs, setJobs] = useState<BulkMailJob[]>([]);
  const [fromEmail, setFromEmail] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipientsRaw, setRecipientsRaw] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedRecipients = useMemo(
    () => parseRecipientEmails(recipientsRaw),
    [recipientsRaw],
  );

  useEffect(() => {
    let active = true;
    void (async () => {
      const [fromResult, templatesResult, jobsResult] = await Promise.all([
        listBulkMailFromOptions(),
        fetchEmailTemplates(),
        listBulkMailJobs(),
      ]);
      if (!active) return;

      setLoading(false);
      const loadError = fromResult.error ?? templatesResult.error ?? jobsResult.error;
      if (loadError) setError(loadError);

      const options = fromResult.data ?? [];
      setFromOptions(options);
      setFromEmail((current) => current || options[0]?.email || '');
      setTemplates(templatesResult.data ?? []);
      setJobs(jobsResult.data ?? []);
    })();
    return () => {
      active = false;
    };
  }, []);

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    if (!id) {
      setSubject('');
      setBody('');
      return;
    }
    const starter = PERSONAL_STARTERS.find((item) => item.id === id);
    if (starter) {
      setSubject(starter.subject);
      setBody(starter.body);
      return;
    }
    const template = templates.find((item) => item.id === id);
    if (!template) return;
    setSubject(template.subject);
    setBody(template.body);
  };

  const selectAttachment = (file: File | null) => {
    if (file && file.size > BULK_MAIL_MAX_ATTACHMENT_BYTES) {
      setAttachment(null);
      setError('Attachment must be 10 MB or smaller.');
      return;
    }
    setError(null);
    setAttachment(file);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!fromEmail) {
      setError('Select a From address.');
      return;
    }
    if (!subject.trim() || isEmptyHtml(body)) {
      setError('Subject and body are required.');
      return;
    }

    const limitError = assertBulkMailLimits(
      parsedRecipients.valid.length,
      attachment?.size,
    );
    if (limitError) {
      setError(limitError);
      return;
    }

    const selectedFrom =
      fromOptions.find((option) => option.email === fromEmail)?.label ?? fromEmail;
    if (
      !window.confirm(
        `Send to ${parsedRecipients.valid.length} addresses from ${selectedFrom} (${fromEmail})?`,
      )
    ) {
      return;
    }

    setSubmitting(true);
    const contentType = attachment?.type || 'application/octet-stream';
    const createResult = await createBulkMailJob({
      from_email: fromEmail,
      subject: subject.trim(),
      body: body.trim(),
      recipients: parsedRecipients.valid,
      has_attachment: Boolean(attachment),
      attachment_name: attachment?.name,
      attachment_content_type: attachment ? contentType : undefined,
    });

    if (createResult.error || !createResult.data?.job) {
      setSubmitting(false);
      setError(createResult.error ?? 'Could not create the bulk mail job.');
      return;
    }

    const { job, upload } = createResult.data;
    if (attachment) {
      if (!upload?.signedUrl) {
        setSubmitting(false);
        setError('The attachment upload URL was not returned.');
        return;
      }
      try {
        const uploadResponse = await fetch(upload.signedUrl, {
          method: 'PUT',
          body: attachment,
          headers: { 'Content-Type': contentType },
        });
        if (!uploadResponse.ok) {
          throw new Error(`Attachment upload failed (${uploadResponse.status}).`);
        }
      } catch (uploadError) {
        setSubmitting(false);
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : 'Could not upload the attachment.',
        );
        return;
      }
    }

    const startResult = await startBulkMailJob({
      job_id: job.id,
      attachment_path: upload?.path,
      attachment_name: attachment?.name,
      attachment_content_type: attachment ? contentType : undefined,
    });
    setSubmitting(false);
    if (startResult.error) {
      setError(startResult.error);
      return;
    }
    navigate(`/admin/bulk-mail/${job.id}`);
  };

  return (
    <div>
      <h1 className="admin-page-title">Bulk Mail</h1>
      <p className="admin-page-desc">
        Write it like a normal personal email — short subject, conversational body, your name at the end.
        Avoid words like “opportunity”, “benefits”, “stipend”, or long feature lists; those push Gmail to Promotions.
      </p>

      <form onSubmit={submit} className="admin-panel mt-6 grid max-w-3xl gap-4 p-4">
        <label className={fieldLabelClass}>
          From
          <AdminSelect
            className="mt-1.5"
            aria-label="From address"
            value={fromEmail}
            disabled={loading || fromOptions.length === 0}
            onChange={setFromEmail}
            options={fromOptions.map((option) => ({
              value: option.email,
              label: `${option.label} (${option.email})`,
            }))}
          />
        </label>

        <label className={fieldLabelClass}>
          Template
          <AdminSelect
            className="mt-1.5"
            aria-label="Email template"
            value={templateId}
            disabled={loading}
            onChange={applyTemplate}
            options={[
              { value: '', label: 'Blank' },
              ...PERSONAL_STARTERS.map((starter) => ({
                value: starter.id,
                label: starter.label,
              })),
              ...templates.map((template) => ({
                value: template.id,
                label: template.name,
              })),
            ]}
          />
        </label>

        <label className={fieldLabelClass}>
          Subject
          <input
            required
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="admin-input mt-1.5 w-full"
          />
        </label>

        <div>
          <p className={fieldLabelClass}>Body</p>
          <div className="mt-1.5">
            <RichTextEditor
              mode="paragraph"
              value={body}
              onChange={setBody}
              placeholder="Hi,… write like you’d email one person. Skip marketing lists and ‘opportunity’ language."
              className="min-h-[220px]"
            />
          </div>
        </div>

        <label className={fieldLabelClass}>
          Recipients
          <textarea
            required
            rows={7}
            value={recipientsRaw}
            onChange={(event) => setRecipientsRaw(event.target.value)}
            placeholder="name@example.com, another@example.com"
            className="admin-input mt-1.5 w-full"
            aria-describedby="recipient-counts"
          />
        </label>
        <p id="recipient-counts" className="-mt-2 text-xs text-muted-alt" aria-live="polite">
          {parsedRecipients.valid.length} valid · {parsedRecipients.invalid.length} invalid
          {parsedRecipients.duplicatesRemoved > 0
            ? ` · ${parsedRecipients.duplicatesRemoved} duplicates removed`
            : ''}
        </p>

        <label className={fieldLabelClass}>
          Attachment <span className="font-normal text-muted-alt">(optional, max 10 MB)</span>
          <input
            type="file"
            onChange={(event) => {
              selectAttachment(event.target.files?.[0] ?? null);
              if (
                event.target.files?.[0] &&
                event.target.files[0].size > BULK_MAIL_MAX_ATTACHMENT_BYTES
              ) {
                event.target.value = '';
              }
            }}
            className="admin-input mt-1.5 block w-full text-sm"
          />
        </label>
        {attachment ? (
          <p className="-mt-2 text-xs text-muted-alt">
            {attachment.name} · {formatFileSize(attachment.size)}
          </p>
        ) : null}

        {error ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <div>
          <button
            type="submit"
            disabled={submitting || loading || fromOptions.length === 0}
            className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-ink transition-colors hover:bg-accent-emphasis disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating job…' : 'Send bulk mail'}
          </button>
        </div>
      </form>

      <section className="mt-10" aria-labelledby="recent-jobs-heading">
        <h2 id="recent-jobs-heading" className="font-display text-xl font-bold text-ink">
          Recent jobs
        </h2>
        <div className="admin-panel mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border text-[12px] uppercase tracking-wide text-muted-alt">
              <tr>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">From</th>
                <th className="px-4 py-3 font-semibold">Subject</th>
                <th className="px-4 py-3 font-semibold">Delivery</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-muted-alt">Loading jobs…</td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-muted-alt">No bulk mail jobs yet.</td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b border-border last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-alt">
                      {formatDate(job.created_at)}
                    </td>
                    <td className="px-4 py-3 text-muted-alt">{job.from_email}</td>
                    <td className="max-w-xs px-4 py-3">
                      <Link
                        to={`/admin/bulk-mail/${job.id}`}
                        className="font-semibold text-ink hover:underline"
                      >
                        {job.subject}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-alt">
                      {job.sent_count} sent · {job.failed_count} failed · {job.total_count} total
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
