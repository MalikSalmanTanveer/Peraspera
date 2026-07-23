import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const NOTIFY_EMAIL = Deno.env.get('NOTIFY_EMAIL') ?? 'contact.peraspera@gmail.com';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'onboarding@resend.dev';

interface QuoteInquiryRecord {
  id: string;
  full_name: string | null;
  company: string | null;
  email: string;
  service: string;
  details: string;
  created_at: string;
}

interface DatabaseWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: QuoteInquiryRecord;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildEmailHtml(record: QuoteInquiryRecord): string {
  const rows = [
    ['Name', record.full_name || '—'],
    ['Company', record.company || '—'],
    ['Email', record.email],
    ['Service', record.service],
    ['Submitted', new Date(record.created_at).toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC'],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #eee;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;color:#111;">
      <h2 style="margin:0 0 16px;">New quote inquiry</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${tableRows}</table>
      <h3 style="margin:0 0 8px;">Project details</h3>
      <p style="white-space:pre-wrap;line-height:1.5;margin:0;">${escapeHtml(record.details)}</p>
      <p style="margin:24px 0 0;font-size:13px;color:#666;">Reply directly to ${escapeHtml(record.email)} to follow up.</p>
    </div>
  `;
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return new Response(JSON.stringify({ error: 'Email service not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let payload: DatabaseWebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (payload.type !== 'INSERT' || payload.table !== 'quote_inquiries') {
    return new Response(JSON.stringify({ ok: true, skipped: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const record = payload.record;
  const subject = `New quote inquiry: ${record.service}${record.company ? ` — ${record.company}` : ''}`;

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      reply_to: record.email,
      subject,
      html: buildEmailHtml(record),
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    console.error('Resend error:', errorText);
    return new Response(JSON.stringify({ error: 'Failed to send email', details: errorText }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await resendResponse.json();
  return new Response(JSON.stringify({ ok: true, id: result.id }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
