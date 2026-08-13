import { describe, expect, it } from 'vitest';
import {
  assertBulkMailLimits,
  BULK_MAIL_MAX_ATTACHMENT_BYTES,
  parseRecipientEmails,
} from './bulkMail';

describe('parseRecipientEmails', () => {
  it('splits on comma, newline, semicolon and lowercases', () => {
    const r = parseRecipientEmails('A@X.com; b@y.com\nc@z.com, b@y.com');
    expect(r.valid).toEqual(['a@x.com', 'b@y.com', 'c@z.com']);
    expect(r.duplicatesRemoved).toBe(1);
    expect(r.invalid).toEqual([]);
  });

  it('collects invalid tokens', () => {
    const r = parseRecipientEmails('ok@peraspera.solutions, not-an-email, ');
    expect(r.valid).toEqual(['ok@peraspera.solutions']);
    expect(r.invalid).toContain('not-an-email');
  });
});

describe('assertBulkMailLimits', () => {
  it('rejects over 500', () => {
    expect(assertBulkMailLimits(501)).toMatch(/500/);
  });
  it('rejects oversize attachment', () => {
    expect(assertBulkMailLimits(1, BULK_MAIL_MAX_ATTACHMENT_BYTES + 1)).toMatch(/10/);
  });
  it('allows empty attachment', () => {
    expect(assertBulkMailLimits(1)).toBeNull();
  });
});
