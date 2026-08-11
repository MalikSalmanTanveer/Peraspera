import type { FormSchemaField } from './formSchema';

function normalizeLabel(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function isCurrentYearField(field: Pick<FormSchemaField, 'label'>): boolean {
  return normalizeLabel(field.label).includes('current year');
}

export function isExpectedGraduationField(field: Pick<FormSchemaField, 'label'>): boolean {
  const n = normalizeLabel(field.label);
  return n.includes('expected graduation');
}

export function isGraduateStatus(value: unknown): boolean {
  return String(value ?? '')
    .trim()
    .toLowerCase() === 'graduate';
}

/** Local calendar date as YYYY-MM-DD */
export function todayIsoDate(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** True when value is a YYYY-MM-DD date strictly before today (local). */
export function isPastDate(iso: string, now = new Date()): boolean {
  const v = iso.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  return v < todayIsoDate(now);
}

export function findEducationFields(fields: FormSchemaField[]): {
  currentYear: FormSchemaField | null;
  expectedGraduation: FormSchemaField | null;
} {
  return {
    currentYear: fields.find(isCurrentYearField) ?? null,
    expectedGraduation: fields.find(isExpectedGraduationField) ?? null,
  };
}
