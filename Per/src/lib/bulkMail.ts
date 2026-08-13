export const BULK_MAIL_MAX_RECIPIENTS = 500;
export const BULK_MAIL_MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseRecipientEmails(raw: string): {
  valid: string[];
  invalid: string[];
  duplicatesRemoved: number;
} {
  const tokens = raw
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const invalid: string[] = [];
  const seen = new Set<string>();
  const valid: string[] = [];
  let duplicatesRemoved = 0;

  for (const token of tokens) {
    const email = token.toLowerCase();
    if (!EMAIL_RE.test(email)) {
      invalid.push(token);
      continue;
    }
    if (seen.has(email)) {
      duplicatesRemoved += 1;
      continue;
    }
    seen.add(email);
    valid.push(email);
  }

  return { valid, invalid, duplicatesRemoved };
}

export function assertBulkMailLimits(
  validCount: number,
  attachmentBytes?: number,
): string | null {
  if (validCount <= 0) return 'At least one valid email is required.';
  if (validCount > BULK_MAIL_MAX_RECIPIENTS) {
    return `At most ${BULK_MAIL_MAX_RECIPIENTS} recipients allowed.`;
  }
  if (
    attachmentBytes != null &&
    attachmentBytes > BULK_MAIL_MAX_ATTACHMENT_BYTES
  ) {
    return 'Attachment must be 10 MB or smaller.';
  }
  return null;
}
