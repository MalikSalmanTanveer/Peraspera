import { useState, type FormEvent } from 'react';
import {
  groupFieldsBySection,
  normalizeFormSchema,
  submitCareerApplication,
  type CareerJob,
  type FormSchemaField,
} from '../lib/careers';
import {
  findEducationFields,
  isExpectedGraduationField,
  isGraduateStatus,
  isPastDate,
  todayIsoDate,
} from '../lib/educationFieldRules';
import { AdminSelect } from './admin/AdminSelect';
import { ResumeDropzone } from './careers/ResumeDropzone';

type Props = {
  job: CareerJob;
};

function selectOptions(field: FormSchemaField): { label: string; value: string }[] {
  const raw = field.options ?? [];
  return raw.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : { label: opt.label, value: opt.value },
  );
}

function isConsentSectionTitle(title: string | null | undefined): boolean {
  return Boolean(title && /\bconsent\b/i.test(title.trim()));
}

/** Options labeled/valued All or None are exclusive with every other choice. */
function isExclusiveChoice(label: string, value: string): boolean {
  const tokens = [label, value].map((s) => s.trim().toLowerCase());
  return tokens.some((t) => t === 'all' || t === 'none');
}

function toggleExclusiveOptions(
  selected: string[],
  opt: { label: string; value: string },
  allOptions: { label: string; value: string }[],
  currentlyChecked: boolean,
): string[] {
  if (currentlyChecked) {
    return selected.filter((v) => v !== opt.value);
  }
  if (isExclusiveChoice(opt.label, opt.value)) {
    return [opt.value];
  }
  const exclusiveValues = new Set(
    allOptions.filter((o) => isExclusiveChoice(o.label, o.value)).map((o) => o.value),
  );
  return [...selected.filter((v) => !exclusiveValues.has(v)), opt.value];
}

function fieldNeedsAnswer(field: FormSchemaField, inConsentSection: boolean): boolean {
  return field.required || inConsentSection;
}

function validateFieldValue(
  field: FormSchemaField,
  v: string | string[] | boolean | undefined,
): string | null {
  const opts = selectOptions(field);
  if (field.field_type === 'checkbox' && opts.length === 0) {
    if (v !== true) return `${field.label} must be checked to continue.`;
    return null;
  }
  if (
    field.field_type === 'multiselect' ||
    (field.field_type === 'checkbox' && opts.length > 0)
  ) {
    if (!Array.isArray(v) || v.length === 0) {
      return `${field.label} is required.`;
    }
    return null;
  }
  if (v == null || String(v).trim() === '') {
    return `${field.label} is required.`;
  }
  return null;
}

const fieldClass = 'field-underline';

export function DynamicApplicationForm({ job }: Props) {
  const schema = normalizeFormSchema(job.form_schema);
  const groups = groupFieldsBySection(schema, {
    includeEmptySections: false,
    includeOrphans: false,
  });
  const consentByFieldId = new Map<string, boolean>();
  for (const group of groups) {
    const consent = isConsentSectionTitle(group.section?.title);
    for (const field of group.fields) {
      consentByFieldId.set(field.id, consent);
    }
  }
  const fields = groups
    .flatMap((g) => g.fields)
    .filter((f) => f.field_type !== 'file');
  const { currentYear: currentYearField, expectedGraduation: expectedGradField } =
    findEducationFields(fields);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [values, setValues] = useState<Record<string, string | string[] | boolean>>({});
  const [resume, setResume] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const currentYearValue = currentYearField
    ? String(values[currentYearField.field_key] ?? '')
    : '';
  const isGraduate = isGraduateStatus(currentYearValue);

  const setValue = (key: string, value: string | string[] | boolean) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (
        currentYearField &&
        expectedGradField &&
        key === currentYearField.field_key &&
        isGraduateStatus(value)
      ) {
        next[expectedGradField.field_key] = '';
      }
      return next;
    });
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      if (
        currentYearField &&
        expectedGradField &&
        key === currentYearField.field_key &&
        isGraduateStatus(value)
      ) {
        delete next[expectedGradField.field_key];
      }
      return next;
    });
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Name is required.';
    if (!email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email.';
    }
    if (!resume) next.resume = 'Resume is required.';

    const graduateNow = currentYearField
      ? isGraduateStatus(values[currentYearField.field_key])
      : false;

    for (const field of fields) {
      const inConsent = consentByFieldId.get(field.id) === true;
      const isExpectedGrad = isExpectedGraduationField(field);

      if (isExpectedGrad && graduateNow) continue;

      if (!fieldNeedsAnswer(field, inConsent)) continue;

      if (isExpectedGrad) {
        const raw = String(values[field.field_key] ?? '').trim();
        if (!raw) {
          next[field.field_key] = `${field.label} is required.`;
          continue;
        }
        if (isPastDate(raw)) {
          next[field.field_key] = `${field.label} cannot be in the past.`;
          continue;
        }
        continue;
      }

      const msg = validateFieldValue(field, values[field.field_key]);
      if (msg) next[field.field_key] = msg;
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!validate() || !resume) return;

    setSubmitting(true);
    try {
      const answers: Record<string, unknown> = {};
      for (const field of fields) {
        if (isExpectedGraduationField(field) && isGraduate) {
          answers[field.field_key] = '';
          continue;
        }
        answers[field.field_key] = values[field.field_key] ?? '';
      }

      const result = await submitCareerApplication({
        jobId: job.id,
        candidateName: name.trim(),
        candidateEmail: email.trim(),
        candidatePhone: phone.trim() || undefined,
        answers,
        resume,
      });

      if ('error' in result && result.error) throw new Error(result.error);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormSchemaField) => {
    const id = `apply-${field.field_key}`;
    const err = fieldErrors[field.field_key];
    const inConsent = consentByFieldId.get(field.id) === true;
    const isExpectedGrad = isExpectedGraduationField(field);
    const expectedGradDisabled = isExpectedGrad && isGraduate;
    const showRequired =
      fieldNeedsAnswer(field, inConsent) && !(isExpectedGrad && isGraduate);
    const label = (
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
        {field.label}
        {showRequired ? ' *' : ''}
      </label>
    );

    if (field.field_type === 'textarea') {
      return (
        <div key={field.id}>
          {label}
          <textarea
            id={id}
            rows={2}
            value={String(values[field.field_key] ?? '')}
            onChange={(e) => setValue(field.field_key, e.target.value)}
            aria-invalid={Boolean(err)}
            aria-describedby={err ? `${id}-error` : undefined}
            className={`${fieldClass} min-h-0 resize-y`}
          />
          {err ? (
            <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
              {err}
            </p>
          ) : null}
        </div>
      );
    }

    if (field.field_type === 'select') {
      return (
        <div key={field.id}>
          {label}
          <AdminSelect
            id={id}
            variant="underline"
            aria-label={field.label}
            aria-invalid={Boolean(err)}
            aria-describedby={err ? `${id}-error` : undefined}
            value={String(values[field.field_key] ?? '')}
            onChange={(v) => setValue(field.field_key, v)}
            placeholder="Select…"
            options={[
              { value: '', label: 'Select…' },
              ...selectOptions(field),
            ]}
          />
          {err ? (
            <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
              {err}
            </p>
          ) : null}
        </div>
      );
    }

    if (
      field.field_type === 'multiselect' ||
      (field.field_type === 'checkbox' && selectOptions(field).length > 0)
    ) {
      const opts = selectOptions(field);
      const selected = Array.isArray(values[field.field_key])
        ? (values[field.field_key] as string[])
        : [];
      return (
        <fieldset key={field.id} className="min-w-0">
          <legend className="mb-1.5 text-xs font-bold uppercase tracking-[0.12em] text-muted">
            {field.label}
            {showRequired ? ' *' : ''}
          </legend>
          <div className="grid gap-2">
            {opts.map((opt) => {
              const checked = selected.includes(opt.value);
              return (
                <label key={opt.value} className="ui-check-row">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setValue(
                        field.field_key,
                        toggleExclusiveOptions(selected, opt, opts, checked),
                      );
                    }}
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
          {err ? (
            <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
              {err}
            </p>
          ) : null}
        </fieldset>
      );
    }

    if (field.field_type === 'checkbox') {
      return (
        <div key={field.id}>
          <label htmlFor={id} className="ui-check-row">
            <input
              id={id}
              type="checkbox"
              checked={values[field.field_key] === true}
              onChange={(e) => setValue(field.field_key, e.target.checked)}
              aria-invalid={Boolean(err)}
              aria-describedby={err ? `${id}-error` : undefined}
            />
            <span>
              {field.label}
              {showRequired ? ' *' : ''}
            </span>
          </label>
          {err ? (
            <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
              {err}
            </p>
          ) : null}
        </div>
      );
    }

    const inputType =
      field.field_type === 'email'
        ? 'email'
        : field.field_type === 'url'
          ? 'url'
          : field.field_type === 'number'
            ? 'number'
            : field.field_type === 'phone'
              ? 'tel'
              : field.field_type === 'date'
                ? 'date'
                : 'text';

    return (
      <div key={field.id}>
        {label}
        <input
          id={id}
          type={inputType}
          value={String(values[field.field_key] ?? '')}
          onChange={(e) => setValue(field.field_key, e.target.value)}
          disabled={expectedGradDisabled}
          min={
            field.field_type === 'date' && isExpectedGrad && !isGraduate
              ? todayIsoDate()
              : undefined
          }
          aria-invalid={Boolean(err)}
          aria-describedby={err ? `${id}-error` : undefined}
          className={`${fieldClass}${expectedGradDisabled ? ' cursor-not-allowed opacity-50' : ''}`}
        />
        {expectedGradDisabled ? (
          <p className="mt-1 text-xs text-[#8a8a8a]">
            Not required if you have already graduated.
          </p>
        ) : null}
        {err ? (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {err}
          </p>
        ) : null}
      </div>
    );
  };

  if (done) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-xl font-bold text-accent">
          ✓
        </div>
        <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-ink">
          Application received — we&apos;ll be in touch
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Thanks for applying. Our team will review your submission soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-0" noValidate>
      <div className="grid gap-4">
        <div>
          <label htmlFor="apply-name" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Full name *
          </label>
          <input
            id="apply-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'apply-name-error' : undefined}
            className={fieldClass}
          />
          {fieldErrors.name ? (
            <p id="apply-name-error" className="mt-1 text-sm text-red-600" role="alert">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="apply-email" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Email *
          </label>
          <input
            id="apply-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'apply-email-error' : undefined}
            className={fieldClass}
          />
          {fieldErrors.email ? (
            <p id="apply-email-error" className="mt-1 text-sm text-red-600" role="alert">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="apply-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Phone
          </label>
          <input
            id="apply-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
          />
        </div>

        {groups.map((group, gi) => (
          <div
            key={group.section?.id ?? `legacy-${gi}`}
            className={gi > 0 ? 'mt-3' : ''}
          >
            {group.section ? (
              <h3 className="mb-2 font-display text-base font-bold text-ink">{group.section.title}</h3>
            ) : null}
            <div className="grid gap-4">
              {group.fields
                .filter((f) => f.field_type !== 'file')
                .map((field) => renderField(field))}
            </div>
          </div>
        ))}

        <ResumeDropzone
          file={resume}
          onChange={setResume}
          error={fieldErrors.resume}
        />
      </div>

      {error ? (
        <p className="mt-4 text-sm font-semibold text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="btn-yellow mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit application'}
      </button>
    </form>
  );
}
