# Design: Application form sections

**Task:** T-04  
**Date:** 2026-08-10  
**Status:** Implemented locally — deploy pending (admin-api + frontend)

## 1. Plain summary

Admins can group custom application-form fields into named sections (e.g. Personal Info, Education). The public apply form shows each section as a heading with its fields underneath and light separators. Built-in Name / Email / Phone / Resume stay above the custom sections.

## 2. Goals

- Admins can add, rename, reorder, and delete named sections in the job form builder.
- Every custom field belongs to a section once the form is in “section mode.”
- Public apply and admin application drawer respect the same grouping.
- Existing flat forms keep working until the admin edits/saves under the new rules.

## 3. Non-goals

- Multi-page / wizard apply flows
- Optional section descriptions
- Collapse/expand section UI
- Full drag-and-drop polish beyond simple move controls
- Changing how answers are stored (still keyed by `field_key`)

## 4. Locked decisions

| Topic | Decision |
|-------|----------|
| Public look | **A** — Heading only + fields + light separators |
| Field placement | **A** — Every custom field must sit inside a named section |
| Legacy jobs | **B** — Flat forms keep working until edit; then sections required on save |
| Delete section (others remain) | **C** — Move fields into nearest remaining section |
| Delete last section | **B** — Fields become orphaned; cannot save until placed |
| Storage shape | **2** — `sections[]` + `section_id` on each field |

## 5. Data model

`job.form_schema` (JSONB) shape:

```ts
type FormSchemaSection = {
  id: string;
  title: string;
  sort_order: number;
};

type FormSchemaField = {
  id: string;
  field_key: string;
  label: string;
  field_type: FormFieldType;
  options: string[] | { label: string; value: string }[];
  required: boolean;
  sort_order: number;
  section_id: string | null; // null = orphan or legacy-untouched field
};

type FormSchema = {
  layout: 'flat' | 'sections'; // sticky; survives deleting the last section
  sections: FormSchemaSection[]; // may be [] for legacy
  fields: FormSchemaField[];
};
```

### Modes

- **Legacy (`layout: 'flat'`):** `sections` empty/missing and no field has a non-null `section_id` (inferred on normalize if `layout` absent). Render and save as today’s flat list.
- **Section mode (`layout: 'sections'`):** set when any section exists or any field has a `section_id`, and **kept** after deleting the last section so orphans still block save. Save requires:
  - Every field has a non-null `section_id` that matches an existing section id
  - Every section has a non-blank trimmed `title`
  - Orphan fields (`section_id: null`) block save

No Postgres column migration — schema is already JSONB on `career_jobs.form_schema`.

Submitted answers remain `Record<field_key, value>`; section metadata is display-only.

## 6. Admin form builder

- Canvas shows sections as groups: editable title, light divider, fields in that section.
- **Add section** creates an empty section (default title e.g. “New section”).
- Field-type sidebar adds into the currently selected/focused section. If no sections exist, require adding a section first (disable or prompt).
- Reorder fields up/down within a section; reorder sections as whole groups.
- Field inspector includes **Move to section…** to change `section_id`.
- **Delete section:** reassign its fields to the nearest remaining section (prefer previous, else next). If none remain, set those fields’ `section_id` to `null` and show an **Unassigned** group; save blocked until reassigned.
- Legacy open: editable as flat until section mode is entered; once section mode, save enforces rules above.
- Clear validation errors for orphans and blank section titles.

## 7. Public apply form

- Built-in Name / Email / Phone / Resume unchanged at top.
- Section mode: for each section in `sort_order`, render heading → fields (field `sort_order` within section) → light separator before next section.
- Legacy: flat field list as today.
- Empty sections (no fields) are skipped on the public form (or not shown).

## 8. Admin application drawer

- If the job schema is in section mode, group answers under the same section headings (fields without a matching section fall under Unassigned for display only).
- Legacy: flat answer list as today.

## 9. API / validation

- Job upsert / form-schema save path validates section-mode rules server-side (mirror client).
- Legacy schemas continue to accept.
- Career apply endpoint unchanged for answer shape; still validates required fields by `field_key`.

## 10. Testing (acceptance)

- Add two sections, add fields to each, save, publish → public form shows headings + grouped fields + separators.
- Delete a middle section → fields move to nearest; save succeeds.
- Delete last section → Unassigned orphans; save fails until fields placed in a new section.
- Untouched legacy job still applies and displays flat.
- Editing a legacy form into section mode then saving with orphans fails with a clear error.
- Application drawer groups answers by section for section-mode jobs.

## 11. Impact (brief)

| Area | Change |
|------|--------|
| `src/lib/careers.ts` | Types + helpers (normalize, group, validate) |
| `FormBuilder.tsx` | Section UI + orphan handling |
| `DynamicApplicationForm.tsx` | Grouped render |
| `ApplicationDrawer.tsx` | Grouped answers |
| `admin-api` job upsert | Server validation |
| Shared helpers | Prefer shared validate/normalize if Edge + client both need it |

## 12. Open questions

None — all product decisions locked above.
