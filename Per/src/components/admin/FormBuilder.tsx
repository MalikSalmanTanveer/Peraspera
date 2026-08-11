import { useState } from 'react';
import {
  deleteFormSection,
  groupFieldsBySection,
  isSectionMode,
  normalizeFormSchema,
  type FormFieldType,
  type FormSchema,
  type FormSchemaField,
  type FormSchemaSection,
} from '../../lib/careers';
import { AdminSelect } from './AdminSelect';

const FIELD_TYPES: { type: FormFieldType; label: string }[] = [
  { type: 'text', label: 'Short Text' },
  { type: 'textarea', label: 'Long Text' },
  { type: 'email', label: 'Email' },
  { type: 'phone', label: 'Phone' },
  { type: 'select', label: 'Dropdown' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'number', label: 'Number' },
  { type: 'date', label: 'Date' },
  { type: 'multiselect', label: 'Multi-select' },
  { type: 'url', label: 'URL' },
];

const NEEDS_OPTIONS = new Set<FormFieldType>(['select', 'multiselect', 'checkbox']);

function slugify(label: string): string {
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 40) || `field_${Date.now()}`
  );
}

function newField(
  type: FormFieldType,
  sortOrder: number,
  sectionId: string | null = null,
): FormSchemaField {
  const label = FIELD_TYPES.find((f) => f.type === type)?.label ?? type;
  return {
    id: crypto.randomUUID(),
    field_key: `${slugify(label)}_${Math.random().toString(36).slice(2, 6)}`,
    label,
    field_type: type,
    options: NEEDS_OPTIONS.has(type) ? ['Option 1', 'Option 2'] : [],
    required: false,
    sort_order: sortOrder,
    section_id: sectionId,
  };
}

function newSection(sortOrder: number): FormSchemaSection {
  return {
    id: crypto.randomUUID(),
    title: 'New section',
    sort_order: sortOrder,
  };
}

function rebuildFieldsInSectionOrder(
  sections: FormSchemaSection[],
  fields: FormSchemaField[],
  patchSection?: (
    sectionId: string,
    sectionFields: FormSchemaField[],
  ) => FormSchemaField[],
): FormSchemaField[] {
  const orderedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order);
  const sectionIds = new Set(orderedSections.map((s) => s.id));
  const orphans = fields
    .filter((f) => !f.section_id || !sectionIds.has(f.section_id))
    .sort((a, b) => a.sort_order - b.sort_order);

  const rebuilt = [
    ...orderedSections.flatMap((s) => {
      const sectionFields = fields
        .filter((f) => f.section_id === s.id)
        .sort((a, b) => a.sort_order - b.sort_order);
      return patchSection ? patchSection(s.id, sectionFields) : sectionFields;
    }),
    ...orphans,
  ];
  return rebuilt.map((f, i) => ({ ...f, sort_order: i }));
}

type Props = {
  value: FormSchema;
  onChange: (schema: FormSchema) => void;
};

export function FormBuilder({ value, onChange }: Props) {
  const schema = normalizeFormSchema(value);
  const sectionMode = isSectionMode(schema);
  const groups = groupFieldsBySection(schema, {
    includeEmptySections: sectionMode,
    includeOrphans: sectionMode,
  });

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(
    schema.fields[0]?.id ?? null,
  );
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    schema.sections[0]?.id ?? null,
  );

  const selected = schema.fields.find((f) => f.id === selectedFieldId) ?? null;

  const commit = (sections: FormSchemaSection[], fields: FormSchemaField[]) => {
    onChange(
      normalizeFormSchema({
        layout: schema.layout,
        sections,
        fields,
      }),
    );
  };

  const addSection = () => {
    const section = newSection(schema.sections.length);
    let fields = schema.fields;

    if (!sectionMode && fields.length > 0) {
      fields = fields.map((f) => ({ ...f, section_id: section.id }));
    }

    setActiveSectionId(section.id);
    commit([...schema.sections, section], fields);
  };

  const addField = (type: FormFieldType) => {
    let sections = schema.sections;
    let fields = schema.fields;
    let targetSectionId = activeSectionId;

    if (!sections.length) {
      const section = newSection(0);
      sections = [section];
      targetSectionId = section.id;
      setActiveSectionId(section.id);

      if (!sectionMode && fields.length > 0) {
        fields = fields.map((f) => ({ ...f, section_id: section.id }));
      }
    }

    const sectionId = targetSectionId ?? sections[0]?.id ?? null;
    const field = newField(type, 0, sectionId);
    const nextFields =
      sectionMode && sectionId
        ? rebuildFieldsInSectionOrder(sections, fields, (sid, sectionFields) =>
            sid === sectionId ? [...sectionFields, field] : sectionFields,
          )
        : [...fields, { ...field, sort_order: fields.length }];
    setSelectedFieldId(field.id);
    commit(sections, nextFields);
  };

  const updateSelected = (patch: Partial<FormSchemaField>) => {
    if (!selected) return;
    const fields = schema.fields.map((f) =>
      f.id === selected.id ? { ...f, ...patch } : f,
    );
    commit(schema.sections, fields);
  };

  const removeSelected = () => {
    if (!selected) return;
    const next = schema.fields.filter((f) => f.id !== selected.id);
    setSelectedFieldId(next[0]?.id ?? null);
    commit(schema.sections, next);
  };

  const moveFieldInSection = (fieldId: string, dir: -1 | 1) => {
    const field = schema.fields.find((f) => f.id === fieldId);
    if (!field?.section_id) return;

    const sectionId = field.section_id;
    const siblings = schema.fields
      .filter((f) => f.section_id === sectionId)
      .sort((a, b) => a.sort_order - b.sort_order);
    const idx = siblings.findIndex((f) => f.id === fieldId);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= siblings.length) return;

    const reordered = [...siblings];
    const [item] = reordered.splice(idx, 1);
    reordered.splice(target, 0, item);

    const fields = rebuildFieldsInSectionOrder(schema.sections, schema.fields, (sid, sectionFields) =>
      sid === sectionId ? reordered : sectionFields,
    );
    commit(schema.sections, fields);
  };

  const moveFlatField = (fieldId: string, dir: -1 | 1) => {
    const fields = [...schema.fields].sort((a, b) => a.sort_order - b.sort_order);
    const idx = fields.findIndex((f) => f.id === fieldId);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= fields.length) return;
    const next = [...fields];
    const [item] = next.splice(idx, 1);
    next.splice(target, 0, item);
    commit(schema.sections, next.map((f, i) => ({ ...f, sort_order: i })));
  };

  const moveSection = (sectionId: string, dir: -1 | 1) => {
    const sections = [...schema.sections].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sections.findIndex((s) => s.id === sectionId);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= sections.length) return;
    const next = [...sections];
    const [item] = next.splice(idx, 1);
    next.splice(target, 0, item);
    commit(
      next.map((s, i) => ({ ...s, sort_order: i })),
      schema.fields,
    );
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    const sections = schema.sections.map((s) =>
      s.id === sectionId ? { ...s, title } : s,
    );
    commit(sections, schema.fields);
  };

  const removeSection = (sectionId: string) => {
    const next = deleteFormSection(schema, sectionId);
    onChange(next);
    if (activeSectionId === sectionId) {
      setActiveSectionId(next.sections[0]?.id ?? null);
    }
  };

  const renderFieldRow = (
    field: FormSchemaField,
    moveFn: ((id: string, dir: -1 | 1) => void) | null,
  ) => (
    <li key={field.id}>
      <div
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3.5 text-sm transition ${
          selectedFieldId === field.id
            ? 'border-accent bg-accent/10'
            : 'border-[#e8e8e8] hover:border-[#ccc]'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            setSelectedFieldId(field.id);
            if (field.section_id) setActiveSectionId(field.section_id);
          }}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span className="font-semibold text-ink">
            {field.label}
            {field.required ? <span className="ml-1 text-accent">*</span> : null}
          </span>
          <span className="text-xs text-[#8a8a8a]">{field.field_type}</span>
        </button>
        {moveFn ? (
          <span className="flex shrink-0 gap-1">
            <button
              type="button"
              aria-label={`Move ${field.label} up`}
              className="rounded border border-[#e0e0e0] px-1.5 text-xs"
              onClick={() => moveFn(field.id, -1)}
            >
              ↑
            </button>
            <button
              type="button"
              aria-label={`Move ${field.label} down`}
              className="rounded border border-[#e0e0e0] px-1.5 text-xs"
              onClick={() => moveFn(field.id, 1)}
            >
              ↓
            </button>
          </span>
        ) : null}
      </div>
    </li>
  );

  const flatFields = groups[0]?.fields ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-[200px_1fr_260px]">
      <aside className="rounded-2xl border border-[#e8e8e8] bg-white p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a8a8a]">
          Field types
        </p>
        <ul className="mt-3 grid gap-1.5">
          {FIELD_TYPES.map((item) => (
            <li key={item.type}>
              <button
                type="button"
                onClick={() => addField(item.type)}
                className="flex w-full items-center justify-between rounded-xl border border-[#eee] px-3 py-2.5 text-left text-sm font-medium text-ink transition hover:border-accent hover:bg-accent/10"
              >
                {item.label}
                <span className="text-[#bbb]">⋮⋮</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg font-bold text-ink">Application form</p>
            <p className="mt-1 text-sm text-[#6b6b6b]">Add and organize fields for your form.</p>
          </div>
          <button
            type="button"
            onClick={addSection}
            className="rounded-xl border border-[#e0e0e0] px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent hover:bg-accent/10"
          >
            + Add section
          </button>
        </div>

        {!sectionMode && flatFields.length > 0 ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Add a section to group fields. Saving with sections will require every field to be
            placed.
          </p>
        ) : null}

        {sectionMode ? (
          <div className="mt-5 grid gap-4">
            {groups.map((group) => {
              if (group.section) {
                const section = group.section;
                return (
                  <div
                    key={section.id}
                    className="rounded-xl border border-[#e8e8e8] p-4"
                    onFocus={() => setActiveSectionId(section.id)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        value={section.title}
                        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                        onFocus={() => setActiveSectionId(section.id)}
                        placeholder="Section title"
                        className="min-w-0 flex-1 rounded-xl border border-[#e0e0e0] px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-accent"
                      />
                      <span className="flex gap-1">
                        <button
                          type="button"
                          className="rounded border border-[#e0e0e0] px-1.5 text-xs"
                          onClick={() => moveSection(section.id, -1)}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="rounded border border-[#e0e0e0] px-1.5 text-xs"
                          onClick={() => moveSection(section.id, 1)}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="rounded border border-red-200 px-2 py-0.5 text-xs font-semibold text-red-600"
                          onClick={() => removeSection(section.id)}
                        >
                          Delete
                        </button>
                      </span>
                    </div>
                    <ul className="mt-3 grid gap-2">
                      {group.fields.map((field) =>
                        renderFieldRow(field, moveFieldInSection),
                      )}
                      {!group.fields.length ? (
                        <li className="rounded-xl border border-dashed border-[#ddd] px-4 py-6 text-center text-sm text-[#8a8a8a]">
                          Add fields to this section from the palette
                        </li>
                      ) : null}
                    </ul>
                  </div>
                );
              }

              if (!group.fields.length) return null;

              return (
                <div
                  key="unassigned"
                  className="rounded-xl border border-red-200 bg-red-50/50 p-4"
                >
                  <p className="text-sm font-semibold text-red-700">Unassigned</p>
                  <p className="mt-1 text-xs text-red-600">
                    Place these fields in a section before saving.
                  </p>
                  <ul className="mt-3 grid gap-2">
                    {group.fields.map((field) => renderFieldRow(field, null))}
                  </ul>
                </div>
              );
            })}
            {!schema.sections.length && !schema.fields.length ? (
              <p className="rounded-xl border border-dashed border-[#ddd] px-4 py-10 text-center text-sm text-[#8a8a8a]">
                Add a section or fields from the palette
              </p>
            ) : null}
          </div>
        ) : (
          <ul className="mt-5 grid gap-2">
            {flatFields.map((field) => renderFieldRow(field, moveFlatField))}
            {!flatFields.length ? (
              <li className="rounded-xl border border-dashed border-[#ddd] px-4 py-10 text-center text-sm text-[#8a8a8a]">
                Add fields from the left palette
              </li>
            ) : null}
          </ul>
        )}
      </div>

      <aside className="rounded-2xl border border-[#e8e8e8] bg-white p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a8a8a]">
          Field inspector
        </p>
        {selected ? (
          <div className="mt-3 grid gap-3">
            <p className="text-xs text-[#8a8a8a]">
              Type:{' '}
              <span className="font-semibold text-ink">
                {FIELD_TYPES.find((f) => f.type === selected.field_type)?.label}
              </span>
            </p>
            <label className="text-xs font-semibold text-[#6b6b6b]">
              Label
              <input
                value={selected.label}
                onChange={(e) => {
                  const label = e.target.value;
                  updateSelected({
                    label,
                    field_key: slugify(label) || selected.field_key,
                  });
                }}
                className="mt-1 w-full rounded-xl border border-[#e0e0e0] px-3 py-2 text-sm text-ink outline-none focus:border-accent"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={selected.required}
                onChange={(e) => updateSelected({ required: e.target.checked })}
                className="accent-accent"
              />
              Required
            </label>
            {sectionMode && schema.sections.length > 0 ? (
              <label className="text-xs font-semibold text-[#6b6b6b]">
                Move to section
                <AdminSelect
                  className="mt-1"
                  aria-label="Move to section"
                  value={selected.section_id ?? ''}
                  onChange={(v) => updateSelected({ section_id: v || null })}
                  options={schema.sections.map((s) => ({
                    value: s.id,
                    label: s.title.trim() || 'Untitled section',
                  }))}
                />
              </label>
            ) : null}
            {NEEDS_OPTIONS.has(selected.field_type) ? (
              <label className="text-xs font-semibold text-[#6b6b6b]">
                Options (one per line)
                <textarea
                  rows={4}
                  value={(selected.options ?? [])
                    .map((o) => (typeof o === 'string' ? o : o.label))
                    .join('\n')}
                  onChange={(e) =>
                    updateSelected({
                      options: e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#e0e0e0] px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                />
              </label>
            ) : null}
            <p className="rounded-lg bg-[#f5f5f5] px-2 py-1.5 font-mono text-[11px] text-[#6b6b6b]">
              {selected.field_key}
            </p>
            <button
              type="button"
              onClick={removeSelected}
              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
            >
              Remove field
            </button>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[#8a8a8a]">Select a field to edit.</p>
        )}
      </aside>
    </div>
  );
}
