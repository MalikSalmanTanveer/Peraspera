import { describe, expect, it } from 'vitest';
import {
  findEducationFields,
  isCurrentYearField,
  isExpectedGraduationField,
  isGraduateStatus,
  isPastDate,
  todayIsoDate,
} from './educationFieldRules';

describe('educationFieldRules', () => {
  it('detects current year and expected graduation by label', () => {
    expect(isCurrentYearField({ label: 'Current Year' })).toBe(true);
    expect(isExpectedGraduationField({ label: 'Expected Graduation Year' })).toBe(true);
    const found = findEducationFields([
      {
        id: '1',
        field_key: 'current_year',
        label: 'Current Year',
        field_type: 'select',
        options: [],
        required: true,
        sort_order: 0,
        section_id: null,
      },
      {
        id: '2',
        field_key: 'expected_graduation_year',
        label: 'Expected Graduation Year',
        field_type: 'date',
        options: [],
        required: true,
        sort_order: 1,
        section_id: null,
      },
    ]);
    expect(found.currentYear?.field_key).toBe('current_year');
    expect(found.expectedGraduation?.field_key).toBe('expected_graduation_year');
  });

  it('treats Graduate as graduate status', () => {
    expect(isGraduateStatus('Graduate')).toBe(true);
    expect(isGraduateStatus('Final Year')).toBe(false);
  });

  it('flags past dates against today', () => {
    const now = new Date('2026-08-10T12:00:00');
    expect(todayIsoDate(now)).toBe('2026-08-10');
    expect(isPastDate('2026-08-09', now)).toBe(true);
    expect(isPastDate('2026-08-10', now)).toBe(false);
    expect(isPastDate('2026-08-11', now)).toBe(false);
  });
});
