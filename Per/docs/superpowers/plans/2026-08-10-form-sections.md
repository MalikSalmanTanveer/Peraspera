# Application Form Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let admins group job application fields into named sections (`sections[]` + `section_id`), and render those groups on the public apply form and in the admin application drawer.

**Architecture:** Pure helpers in `src/lib/formSchema.ts` (normalize, validate, group, delete-section) mirrored into `supabase/functions/_shared/formSchema.ts` for Edge validation. UI consumes helpers via `FormBuilder`, `DynamicApplicationForm`, and `ApplicationDrawer`. No DB migration — `form_schema` is already JSONB.

**Tech Stack:** React 19, TypeScript, Vite, Supabase Edge (`admin-api`), Vitest for pure helper tests.

**Spec:** `docs/superpowers/specs/2026-08-10-form-sections-design.md` (T-04)

## Global Constraints

- Public look: heading only + fields + light separators (no cards, no section descriptions).
- Every custom field must have a `section_id` once in section mode; orphans block save.
- Legacy flat schemas (`sections` empty and all `section_id` null/missing) keep working until section mode is entered.
- Delete section: move fields to nearest remaining (prefer previous, else next); last section → orphans (`section_id: null`).
- Answers stay keyed by `field_key`.
- Do not commit unless the user explicitly asks (repo rule overrides plan commit steps — skip Step “Commit” or leave staged only).
- Match existing admin light UI tokens (`border-[#e8e8e8]`, accent, rounded-xl).

## File map

| File | Responsibility |
|------|----------------|
| Create: `src/lib/formSchema.ts` | Types helpers used by client (normalize, validate, group, mutate) |
| Create: `src/lib/formSchema.test.ts` | Vitest coverage for helpers |
| Create: `supabase/functions/_shared/formSchema.ts` | Deno copy of normalize + validate (keep in sync) |
| Modify: `src/lib/careers.ts` | Extend `FormSchema` / `FormSchemaField`; re-export helpers; update `getFormFields` |
| Modify: `package.json` | Add `vitest` + `test` script |
| Modify: `src/components/admin/FormBuilder.tsx` | Section canvas, add/delete/reorder, Unassigned, Move to section |
| Modify: `src/pages/admin/AdminJobsPage.tsx` | `EMPTY_SCHEMA` + client validate before upsert / updateFormSchema |
| Modify: `supabase/functions/admin-api/index.ts` | Validate on `upsertJob` + `updateFormSchema` |
| Modify: `src/components/DynamicApplicationForm.tsx` | Grouped public render |
| Modify: `src/components/admin/ApplicationDrawer.tsx` | Grouped answers |
| Update: `docs/dev-priorities.md` | Stage advances as tasks complete |

---

### Task 1: Form schema helpers + Vitest

**Files:**
- Create: `src/lib/formSchema.ts`
- Create: `src/lib/formSchema.test.ts`
- Modify: `package.json` (add vitest, `"test": "vitest run"`)
- Modify: `src/lib/careers.ts` (types + re-exports)

**Interfaces:**
- Produces:
  - `FormSchemaSection`, `FormSchemaField`, `FormSchema`, `FormSectionGroup`
  - `normalizeFormSchema(raw: unknown): FormSchema`
  - `isSectionMode(schema: FormSchema): boolean`
  - `validateFormSchema(schema: FormSchema): string | null`
  - `groupFieldsBySection(schema: FormSchema): FormSectionGroup[]`
  - `deleteFormSection(schema: FormSchema, sectionId: string): FormSchema`

- [ ] **Step 1: Add Vitest**

```bash
npm install -D vitest
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write failing tests** in `src/lib/formSchema.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  deleteFormSection,
  groupFieldsBySection,
  isSectionMode,
  normalizeFormSchema,
  validateFormSchema,
} from './formSchema';

const field = (id: string, section_id: string | null = null) => ({
  id,
  field_key: id,
  label: id,
  field_type: 'text' as const,
  options: [],
  required: false,
  sort_order: 0,
  section_id,
});

describe('formSchema', () => {
  it('treats empty sections + null section_ids as legacy', () => {
    const schema = normalizeFormSchema({ fields: [field('a')] });
    expect(isSectionMode(schema)).toBe(false);
    expect(validateFormSchema(schema)).toBeNull();
  });

  it('rejects orphans in section mode', () => {
    const schema = normalizeFormSchema({
      sections: [{ id: 's1', title: 'Personal', sort_order: 0 }],
      fields: [field('a', null)],
    });
    expect(isSectionMode(schema)).toBe(true);
    expect(validateFormSchema(schema)).toMatch(/unassigned|section/i);
  });

  it('rejects blank section titles in section mode', () => {
    const schema = normalizeFormSchema({
      sections: [{ id: 's1', title: '  ', sort_order: 0 }],
      fields: [field('a', 's1')],
    });
    expect(validateFormSchema(schema)).toMatch(/title/i);
  });

  it('groups fields under sections and skips empty sections for public groups flag', () => {
    const schema = normalizeFormSchema({
      sections: [
        { id: 's1', title: 'Personal', sort_order: 0 },
        { id: 's2', title: 'Empty', sort_order: 1 },
      ],
      fields: [field('a', 's1')],
    });
    const groups = groupFieldsBySection(schema, { includeEmptySections: false });
    expect(groups.map((g) => g.section?.title)).toEqual(['Personal']);
  });

  it('moves fields to previous section when deleting middle section', () => {
    const schema = normalizeFormSchema({
      sections: [
        { id: 's1', title: 'A', sort_order: 0 },
        { id: 's2', title: 'B', sort_order: 1 },
        { id: 's3', title: 'C', sort_order: 2 },
      ],
      fields: [field('x', 's2')],
    });
    const next = deleteFormSection(schema, 's2');
    expect(next.sections.map((s) => s.id)).toEqual(['s1', 's3']);
    expect(next.fields[0].section_id).toBe('s1');
  });

  it('orphans fields when deleting the last section', () => {
    const schema = normalizeFormSchema({
      sections: [{ id: 's1', title: 'Only', sort_order: 0 }],
      fields: [field('x', 's1')],
    });
    const next = deleteFormSection(schema, 's1');
    expect(next.sections).toEqual([]);
    expect(next.fields[0].section_id).toBeNull();
    expect(validateFormSchema(next)).not.toBeNull();
  });
});
```

- [ ] **Step 3: Run tests — expect FAIL**

```bash
npm test -- src/lib/formSchema.test.ts
```

Expected: FAIL (module / exports missing).

- [ ] **Step 4: Implement `src/lib/formSchema.ts`**

```ts
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
  sections: FormSchemaSection[];
  fields: FormSchemaField[];
};

export type FormSectionGroup = {
  section: FormSchemaSection | null; // null = Unassigned (orphans) or single legacy flat group
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

  return {
    sections: sections.map((s, i) => ({ ...s, sort_order: i })),
    fields: fields.map((f, i) => ({ ...f, sort_order: i })),
  };
}

export function isSectionMode(schema: FormSchema): boolean {
  if ((schema.sections ?? []).length > 0) return true;
  return (schema.fields ?? []).some((f) => f.section_id != null);
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

export function groupFieldsBySection(
  schema: FormSchema,
  opts: { includeEmptySections?: boolean; includeOrphans?: boolean } = {},
): FormSectionGroup[] {
  const { includeEmptySections = false, includeOrphans = true } = opts;
  const normalized = normalizeFormSchema(schema);

  if (!isSectionMode(normalized)) {
    return [{ section: null, fields: [...normalized.fields].sort((a, b) => a.sort_order - b.sort_order) }];
  }

  const bySection = new Map<string, FormSchemaField[]>();
  const orphans: FormSchemaField[] = [];
  for (const field of normalized.fields) {
    if (!field.section_id || !normalized.sections.some((s) => s.id === field.section_id)) {
      orphans.push(field);
      continue;
    }
    const list = bySection.get(field.section_id) ?? [];
    list.push(field);
    bySection.set(field.section_id, list);
  }

  const groups: FormSectionGroup[] = [];
  for (const section of [...normalized.sections].sort((a, b) => a.sort_order - b.sort_order)) {
    const fields = (bySection.get(section.id) ?? []).sort((a, b) => a.sort_order - b.sort_order);
    if (!fields.length && !includeEmptySections) continue;
    groups.push({ section, fields });
  }
  if (includeOrphans && orphans.length) {
    groups.push({
      section: null,
      fields: orphans.sort((a, b) => a.sort_order - b.sort_order),
    });
  }
  return groups;
}

export function deleteFormSection(schema: FormSchema, sectionId: string): FormSchema {
  const normalized = normalizeFormSchema(schema);
  const ordered = [...normalized.sections].sort((a, b) => a.sort_order - b.sort_order);
  const idx = ordered.findIndex((s) => s.id === sectionId);
  if (idx < 0) return normalized;

  const nearest = ordered[idx - 1] ?? ordered[idx + 1] ?? null;
  const remaining = ordered.filter((s) => s.id !== sectionId).map((s, i) => ({ ...s, sort_order: i }));
  const fields = normalized.fields.map((f) => {
    if (f.section_id !== sectionId) return f;
    return { ...f, section_id: nearest ? nearest.id : null };
  });
  return normalizeFormSchema({ sections: remaining, fields });
}
```

- [ ] **Step 5: Update `src/lib/careers.ts`**

- Change `FormSchemaField` to include `section_id: string | null` (optional on read via normalize).
- Change `FormSchema` to `{ sections: FormSchemaSection[]; fields: FormSchemaField[] }`.
- Re-export section types / helpers from `./formSchema` **or** define types once in `formSchema.ts` and import them in `careers.ts` to avoid duplication.
- Update `getFormFields` to use `normalizeFormSchema(job.form_schema).fields`.

Preferred: keep canonical types in `formSchema.ts`; in `careers.ts`:

```ts
export type {
  FormSchema,
  FormSchemaField,
  FormSchemaSection,
  FormSectionGroup,
  FormFieldType,
} from './formSchema';
export {
  normalizeFormSchema,
  isSectionMode,
  validateFormSchema,
  groupFieldsBySection,
  deleteFormSection,
} from './formSchema';
```

Remove the old inline `FormSchema` / `FormSchemaField` / `FormFieldType` definitions from `careers.ts` (keep any remaining career-specific types).

- [ ] **Step 6: Run tests — expect PASS**

```bash
npm test -- src/lib/formSchema.test.ts
```

Expected: all tests PASS.

- [ ] **Step 7: Commit** (only if user asked)

```bash
git add package.json package-lock.json src/lib/formSchema.ts src/lib/formSchema.test.ts src/lib/careers.ts
git commit -m "feat(careers): add form schema section helpers"
```

---

### Task 2: Edge shared validate + admin-api

**Files:**
- Create: `supabase/functions/_shared/formSchema.ts` (copy `normalizeFormSchema`, `isSectionMode`, `validateFormSchema` + minimal types — same behavior as client)
- Modify: `supabase/functions/admin-api/index.ts`

**Interfaces:**
- Consumes: same validate contract as Task 1
- Produces: `upsertJob` / `updateFormSchema` return 400 with validation message when section mode is invalid

- [ ] **Step 1: Add `_shared/formSchema.ts`**

Copy the three functions + types from `src/lib/formSchema.ts` (Deno-compatible; no Vitest imports). Keep logic identical. Add a one-line comment at top: `// Keep in sync with src/lib/formSchema.ts`.

- [ ] **Step 2: Wire admin-api**

Near other shared imports:

```ts
import {
  normalizeFormSchema,
  validateFormSchema,
} from '../_shared/formSchema.ts';
```

In `upsertJob`, after reading `form_schema`:

```ts
const formSchema = normalizeFormSchema(payload.form_schema ?? { fields: [] });
const formError = validateFormSchema(formSchema);
if (formError) return json({ error: formError }, 400);
// store formSchema (normalized) on the row
```

In `updateFormSchema`:

```ts
const formSchema = normalizeFormSchema(payload.form_schema);
const formError = validateFormSchema(formSchema);
if (formError) return json({ error: formError }, 400);
// update with formSchema
```

- [ ] **Step 3: Deploy function** (when implementing against prod)

```bash
supabase functions deploy admin-api
```

- [ ] **Step 4: Commit** (only if user asked)

---

### Task 3: FormBuilder sections UI

**Files:**
- Modify: `src/components/admin/FormBuilder.tsx`
- Modify: `src/pages/admin/AdminJobsPage.tsx` (`EMPTY_SCHEMA`, pre-save validate)

**Interfaces:**
- Consumes: `FormSchema`, `normalizeFormSchema`, `groupFieldsBySection`, `deleteFormSection`, `validateFormSchema`, `AdminSelect` for Move to section
- Produces: `onChange(FormSchema)` always normalized with `sections` + `fields`

- [ ] **Step 1: Set `EMPTY_SCHEMA`**

```ts
const EMPTY_SCHEMA: FormSchema = { sections: [], fields: [] };
```

When loading a job: `form_schema: normalizeFormSchema(job.form_schema)`.

Before `upsertJob` / `updateJobFormSchema`, run:

```ts
const schema = normalizeFormSchema(editing.form_schema);
const err = validateFormSchema(schema);
if (err) { setToast({ message: err, tone: 'error' }); return; }
```

Pass normalized schema to the API.

- [ ] **Step 2: Rebuild FormBuilder canvas**

Behavior checklist (implement in `FormBuilder.tsx`):

1. Normalize `value` on each render via `normalizeFormSchema(value)`.
2. State: `selectedFieldId`, `activeSectionId` (last focused section).
3. Header actions: **Add section** → append `{ id: crypto.randomUUID(), title: 'New section', sort_order }`, set `activeSectionId`.
4. If `!isSectionMode(schema)` and fields exist (legacy): render flat list like today + banner “Add a section to group fields. Saving with sections will require every field to be placed.”
5. When user clicks **Add section** on a legacy form with fields: create first section and assign **all existing fields** to it (smooth entry into section mode without immediate orphans). *(This does not contradict “legacy until edit”; adding a section is the edit that enters section mode.)*
6. Section mode canvas: for each section group (`includeEmptySections: true`) show:
   - Title `<input>`
   - ↑↓ section reorder
   - Delete section → `deleteFormSection`
   - Nested field rows with ↑↓ **within that section only** (swap `sort_order` among siblings with same `section_id`)
7. After all sections, if orphans: **Unassigned** block (red-tint hint) listing orphan fields.
8. Field palette `addField(type)`:
   - If no sections: do not add; show inline hint “Add a section first” (or auto-create one empty section then add — prefer **auto-create one “New section”** then add field for fewer clicks).
   - Else add with `section_id: activeSectionId ?? sections[0].id`.
9. Inspector: existing controls + **Move to section** using `AdminSelect` of section ids; setting section_id clears orphan status.
10. `commit()` always `onChange(normalizeFormSchema({ sections, fields }))`.

- [ ] **Step 3: Typecheck**

```bash
npx tsc -b --pretty false
```

Expected: exit 0.

- [ ] **Step 4: Manual smoke in browser**

`npm run dev` → `/admin/jobs` → open form builder → add Personal + Education → add fields → save.

- [ ] **Step 5: Commit** (only if user asked)

---

### Task 4: Public apply form grouping

**Files:**
- Modify: `src/components/DynamicApplicationForm.tsx`

**Interfaces:**
- Consumes: `normalizeFormSchema`, `isSectionMode`, `groupFieldsBySection` from `../lib/formSchema` (or careers re-exports)

- [ ] **Step 1: Replace flat `fields.map` region with grouped render**

```tsx
const schema = normalizeFormSchema(job.form_schema);
const groups = groupFieldsBySection(schema, {
  includeEmptySections: false,
  includeOrphans: false, // public: ignore orphans (shouldn't exist on published jobs)
});

// Inside the form, after name/email/phone (and before or after resume per current layout):
{groups.map((group, gi) => (
  <div key={group.section?.id ?? `legacy-${gi}`} className={gi > 0 ? 'mt-8 border-t border-[#e8e8e8] pt-8' : 'mt-6'}>
    {group.section ? (
      <h3 className="mb-4 font-display text-lg font-bold text-ink">{group.section.title}</h3>
    ) : null}
    <div className="grid gap-5">
      {group.fields.filter((f) => f.field_type !== 'file').map((field) => renderField(field))}
    </div>
  </div>
))}
```

Extract the existing per-field JSX into a `renderField(field)` helper inside the component to avoid duplication.

Keep Name / Email / Phone / Resume placement as today (above custom fields).

- [ ] **Step 2: Typecheck + visual check on a published job with sections**

```bash
npx tsc -b --pretty false
```

- [ ] **Step 3: Commit** (only if user asked)

---

### Task 5: Application drawer grouped answers

**Files:**
- Modify: `src/components/admin/ApplicationDrawer.tsx`

**Interfaces:**
- Consumes: `normalizeFormSchema`, `isSectionMode`, `groupFieldsBySection`

- [ ] **Step 1: Replace flat `Object.entries(answers)` with grouped layout**

```tsx
const schema = normalizeFormSchema(detail.career_jobs?.form_schema);
const groups = groupFieldsBySection(schema, {
  includeEmptySections: false,
  includeOrphans: true,
});

// Render:
{groups.map((group, gi) => {
  const entries = group.fields
    .map((f) => [f.field_key, answers[f.field_key]] as const)
    .filter(([, v]) => v !== undefined);
  // also append answer keys not in schema under a final Unassigned/Other if needed
  if (!entries.length && group.section) return null;
  return (
    <div key={group.section?.id ?? `orphans-${gi}`} className="mt-3">
      {isSectionMode(schema) ? (
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#8a8a8a]">
          {group.section?.title ?? 'Unassigned'}
        </p>
      ) : null}
      <dl className="divide-y divide-[#f0f0f0] rounded-xl border border-[#eee]">
        {entries.map(([key, value]) => (
          <div key={key} className="grid gap-1 px-3 py-2.5">
            <dt className="text-xs font-semibold text-[#8a8a8a]">{answerLabel(key, fields)}</dt>
            <dd className="whitespace-pre-wrap text-sm text-ink">{formatAnswer(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
})}
```

Also render any `answers` keys not present in schema fields in a leftover “Other” group so no data is hidden.

- [ ] **Step 2: Typecheck**

```bash
npx tsc -b --pretty false
```

- [ ] **Step 3: Commit** (only if user asked)

---

### Task 6: Verification + tracking closeout prep

**Files:**
- Modify: `docs/dev-priorities.md` (stage → implemented / ready to deploy)
- Modify: `docs/superpowers/specs/2026-08-10-form-sections-design.md` (status → Implemented)

- [ ] **Step 1: Run full verification**

```bash
npm test
npx tsc -b --pretty false
npm run build
```

Expected: tests pass, tsc 0, build succeeds.

- [ ] **Step 2: Manual acceptance (from spec §10)**

| # | Case | Pass? |
|---|------|-------|
| 1 | Two sections + fields → public headings + separators | |
| 2 | Delete middle section → fields move nearest; save OK | |
| 3 | Delete last section → Unassigned; save blocked | |
| 4 | Legacy untouched job still flat | |
| 5 | Section mode + orphans → clear save error | |
| 6 | Drawer groups answers by section | |

- [ ] **Step 3: Deploy** (when user asks)

```bash
supabase functions deploy admin-api
npx vercel --prod --yes
```

- [ ] **Step 4: Mark T-04 stage in `docs/dev-priorities.md`**

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| `sections` + `section_id` model | 1 |
| Legacy vs section mode + validate | 1, 2, 3 |
| Delete → nearest / last → orphan | 1, 3 |
| Form builder UI | 3 |
| Public heading + separators | 4 |
| Drawer grouped answers | 5 |
| Server validation | 2 |
| Acceptance cases | 6 |

## Placeholder scan

None intentional. Commit steps are present but gated by the global “only if user asked” constraint.
