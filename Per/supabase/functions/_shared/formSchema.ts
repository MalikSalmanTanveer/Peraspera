// Keep in sync with src/lib/formSchema.ts

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'select'
  | 'checkbox'
  | 'number'
  | 'date'
  | 'multiselect'
  | 'url'
  | 'file';

export type FormSchemaSection = {
  id: string;
  title: string;
  sort_order: number;
};

export type FormSchemaField = {
  id: string;
  field_key: string;
  label: string;
  field_type: FormFieldType;
  options: string[] | { label: string; value: string }[];
  required: boolean;
  sort_order: number;
  section_id: string | null;
};

export type FormSchema = {
  layout: 'flat' | 'sections';
  sections: FormSchemaSection[];
  fields: FormSchemaField[];
};

export function normalizeFormSchema(raw: unknown): FormSchema {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const sectionsRaw = Array.isArray(obj.sections) ? obj.sections : [];
  const fieldsRaw = Array.isArray(obj.fields) ? obj.fields : [];

  const sections: FormSchemaSection[] = sectionsRaw
    .map((item, i) => {
      if (!item || typeof item !== 'object') return null;
      const s = item as Record<string, unknown>;
      const id = String(s.id ?? '').trim();
      if (!id) return null;
      return {
        id,
        title: String(s.title ?? ''),
        sort_order: Number.isFinite(Number(s.sort_order)) ? Number(s.sort_order) : i,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.sort_order - b!.sort_order) as FormSchemaSection[];

  const fields: FormSchemaField[] = fieldsRaw
    .map((item, i) => {
      if (!item || typeof item !== 'object') return null;
      const f = item as Record<string, unknown>;
      const id = String(f.id ?? '').trim();
      const field_key = String(f.field_key ?? '').trim();
      if (!id || !field_key) return null;
      const sectionRaw = f.section_id;
      const section_id =
        sectionRaw == null || String(sectionRaw).trim() === ''
          ? null
          : String(sectionRaw);
      return {
        id,
        field_key,
        label: String(f.label ?? field_key),
        field_type: (String(f.field_type ?? 'text') as FormFieldType),
        options: Array.isArray(f.options) ? (f.options as FormSchemaField['options']) : [],
        required: Boolean(f.required),
        sort_order: Number.isFinite(Number(f.sort_order)) ? Number(f.sort_order) : i,
        section_id,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.sort_order - b!.sort_order) as FormSchemaField[];

  let layout: FormSchema['layout'];
  if (obj.layout === 'sections') {
    layout = 'sections';
  } else if (sections.length > 0 || fields.some((f) => f.section_id != null)) {
    layout = 'sections';
  } else {
    layout = 'flat';
  }

  return {
    layout,
    sections: sections.map((s, i) => ({ ...s, sort_order: i })),
    fields: fields.map((f, i) => ({ ...f, sort_order: i })),
  };
}

export function isSectionMode(schema: FormSchema): boolean {
  return normalizeFormSchema(schema).layout === 'sections';
}

export function validateFormSchema(schema: FormSchema): string | null {
  const normalized = normalizeFormSchema(schema);
  if (!isSectionMode(normalized)) return null;

  for (const section of normalized.sections) {
    if (!section.title.trim()) {
      return 'Every section needs a title before saving.';
    }
  }

  const ids = new Set(normalized.sections.map((s) => s.id));
  for (const field of normalized.fields) {
    if (!field.section_id) {
      return 'Place every field in a section before saving (Unassigned fields remain).';
    }
    if (!ids.has(field.section_id)) {
      return 'Every field must belong to a valid section before saving.';
    }
  }
  return null;
}
