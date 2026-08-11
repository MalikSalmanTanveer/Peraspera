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

  it('moves fields to next section when deleting first section', () => {
    const schema = normalizeFormSchema({
      sections: [
        { id: 's1', title: 'A', sort_order: 0 },
        { id: 's2', title: 'B', sort_order: 1 },
      ],
      fields: [field('x', 's1')],
    });
    const next = deleteFormSection(schema, 's1');
    expect(next.sections.map((s) => s.id)).toEqual(['s2']);
    expect(next.fields[0].section_id).toBe('s2');
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
