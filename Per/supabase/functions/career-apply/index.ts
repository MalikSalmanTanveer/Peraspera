import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const RESUME_BUCKET = 'career-resumes';
const MAX_RESUME_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_EXT = new Set(['pdf', 'doc', 'docx']);

type ApplyPayload = {
  job_id?: string;
  candidate_name?: string;
  candidate_email?: string;
  candidate_phone?: string;
  answers?: Record<string, unknown>;
  resume_base64?: string;
  resume_filename?: string;
  resume_mime?: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function extensionOf(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

function decodeBase64(data: string): Uint8Array {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sendResendEmail(params: {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
  from?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const from =
    params.from?.trim() ||
    Deno.env.get('CAREERS_FROM_EMAIL')?.trim() ||
    Deno.env.get('FROM_EMAIL')?.trim();
  if (!apiKey || !from) {
    return { ok: false, error: 'Email service not configured' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: params.to,
      reply_to: params.replyTo,
      subject: params.subject,
      html: params.html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: text };
  }
  return { ok: true };
}

function buildCandidateThankYouHtml(candidateName: string, jobTitle: string): string {
  const name = escapeHtml(candidateName);
  const role = escapeHtml(jobTitle);
  const site = 'https://www.peraspera.solutions';
  const careers = `${site}/careers`;
  const logoUrl = `${site}/email-logo-white.png`;
  const font =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

  // Dark transactional layout (Azure-style structure) with Per Aspera tokens.
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <title>Application Received</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;color:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0a;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#161616;border:1px solid #2a2a2a;">

          <!-- Header -->
          <tr>
            <td style="padding:20px 24px;border-bottom:1px solid #2a2a2a;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle" bgcolor="#161616" style="font-family:${font};background:#161616;">
                    <a href="${site}" style="text-decoration:none;color:#ffffff;background:transparent;">
                      <img src="${logoUrl}" width="200" height="48" alt="Per Aspera" style="display:block;border:0;outline:none;width:200px;height:auto;max-width:200px;object-fit:contain;background:transparent;" />
                    </a>
                  </td>
                  <td align="right" valign="middle">
                    <a href="${site}" style="font-family:${font};font-size:13px;font-weight:600;color:#fea327;text-decoration:none;border:1px solid #fea327;padding:8px 14px;display:inline-block;">
                      Visit site&nbsp;&rsaquo;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent notice bar -->
          <tr>
            <td style="background:#2a1f0a;padding:12px 24px;font-family:${font};font-size:13px;line-height:1.45;color:#f7f7f5;border-bottom:1px solid #3d2e10;">
              <span style="display:inline-block;width:16px;height:16px;line-height:16px;text-align:center;border-radius:50%;background:#fea327;color:#0d0d0d;font-size:11px;font-weight:700;margin-right:8px;">i</span>
              Application received for <strong style="color:#fea327;">${role}</strong>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 24px 28px;font-family:${font};background:#161616;">
              <h1 style="margin:0 0 20px;font-family:${font};font-size:28px;line-height:1.2;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">
                Application received
              </h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#e8e8e8;">
                Hi ${name},
              </p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#e8e8e8;">
                Thank you for your interest in joining Per Aspera.
              </p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#e8e8e8;">
                We've successfully received your application for the <strong style="color:#ffffff;">${role}</strong> role.
                Our team will review your application and evaluate your profile based on the requirements of the role.
              </p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#e8e8e8;">
                If your profile is shortlisted, we'll reach out with the next steps, which may include a short conversation or further assessment.
              </p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.65;color:#e8e8e8;">
                We appreciate the time you took to apply and look forward to learning more about you.
              </p>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" bgcolor="#fea327" style="background:#fea327;">
                    <a href="${site}" style="font-family:${font};display:inline-block;padding:12px 22px;font-size:14px;font-weight:700;color:#0d0d0d;text-decoration:none;letter-spacing:0.01em;">
                      Visit site&nbsp;&rsaquo;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:12px;line-height:1.55;color:#9a9a9a;">
                This message was sent because you applied on
                <a href="${careers}" style="color:#fea327;text-decoration:underline;">peraspera.solutions/careers</a>.
                If you did not apply, you can ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px;background:#101010;border-top:1px solid #2a2a2a;font-family:${font};">
              <p style="margin:0 0 12px;font-size:12px;line-height:1.5;">
                <a href="${site}" style="color:#c8c8c8;text-decoration:underline;margin-right:14px;">Website</a>
                <a href="${careers}" style="color:#c8c8c8;text-decoration:underline;margin-right:14px;">Careers</a>
                <a href="https://www.linkedin.com/company/peraspera.solutions/" style="color:#c8c8c8;text-decoration:underline;">LinkedIn</a>
              </p>
              <p style="margin:0 0 4px;font-size:12px;line-height:1.5;color:#8a8a8a;">
                Per Aspera &mdash; Engineering Intelligent Businesses.
              </p>
              <p style="margin:0 0 18px;font-size:12px;line-height:1.5;color:#6b6b6b;font-style:italic;">
                Through hardships to the stars.
              </p>
              <a href="${site}" style="text-decoration:none;background:transparent;">
                <img src="${logoUrl}" width="120" height="29" alt="Per Aspera" style="display:block;border:0;outline:none;width:120px;height:auto;max-width:120px;object-fit:contain;background:transparent;" />
              </a>
              <p style="margin:14px 0 0;font-size:11px;line-height:1.45;color:#5a5a5a;">
                careers@peraspera.solutions
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) {
    return json({ error: 'Server misconfigured' }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  let jobId = '';
  let candidateName = '';
  let candidateEmail = '';
  let candidatePhone: string | null = null;
  let answers: Record<string, unknown> = {};
  let resumeBytes: Uint8Array | null = null;
  let resumeFilename = 'resume.pdf';
  let resumeMime = 'application/pdf';

  const contentType = req.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    jobId = String(form.get('job_id') ?? '').trim();
    candidateName = String(form.get('candidate_name') ?? '').trim();
    candidateEmail = String(form.get('candidate_email') ?? '').trim().toLowerCase();
    const phone = String(form.get('candidate_phone') ?? '').trim();
    candidatePhone = phone || null;

    const answersRaw = String(form.get('answers') ?? '{}');
    try {
      answers = JSON.parse(answersRaw) as Record<string, unknown>;
    } catch {
      return json({ error: 'Invalid answers JSON' }, 400);
    }

    const file = form.get('resume');
    if (!(file instanceof File)) {
      return json({ error: 'Resume file required' }, 400);
    }
    if (file.size > MAX_RESUME_BYTES) {
      return json({ error: 'Resume must be 10 MB or smaller' }, 400);
    }
    resumeFilename = file.name || resumeFilename;
    resumeMime = file.type || resumeMime;
    resumeBytes = new Uint8Array(await file.arrayBuffer());
  } else {
    let body: ApplyPayload;
    try {
      body = await req.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }

    jobId = String(body.job_id ?? '').trim();
    candidateName = String(body.candidate_name ?? '').trim();
    candidateEmail = String(body.candidate_email ?? '').trim().toLowerCase();
    const phone = String(body.candidate_phone ?? '').trim();
    candidatePhone = phone || null;
    answers = body.answers ?? {};

    if (!body.resume_base64) {
      return json({ error: 'Resume required' }, 400);
    }
    resumeFilename = String(body.resume_filename ?? 'resume.pdf');
    resumeMime = String(body.resume_mime ?? 'application/pdf');
    resumeBytes = decodeBase64(body.resume_base64);
    if (resumeBytes.byteLength > MAX_RESUME_BYTES) {
      return json({ error: 'Resume must be 10 MB or smaller' }, 400);
    }
  }

  if (!jobId || !candidateName || !candidateEmail) {
    return json({ error: 'job_id, candidate_name, and candidate_email are required' }, 400);
  }
  if (!resumeBytes || resumeBytes.byteLength === 0) {
    return json({ error: 'Resume file required' }, 400);
  }

  const ext = extensionOf(resumeFilename);
  if (!ALLOWED_EXT.has(ext) && !ALLOWED_MIME.has(resumeMime)) {
    return json({ error: 'Resume must be PDF, DOC, or DOCX' }, 400);
  }

  const { data: job, error: jobError } = await supabase
    .from('career_jobs')
    .select('id, title, slug, status, deleted_at')
    .eq('id', jobId)
    .maybeSingle();

  if (jobError || !job) {
    return json({ error: 'Job not found' }, 404);
  }
  if (job.status !== 'published' || job.deleted_at) {
    return json({ error: 'Job is not open for applications' }, 404);
  }

  const safeName = resumeFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const resumePath = `${jobId}/${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(resumePath, resumeBytes, {
      contentType: resumeMime,
      upsert: false,
    });

  if (uploadError) {
    return json({ error: `Resume upload failed: ${uploadError.message}` }, 500);
  }

  const { data: existing } = await supabase
    .from('career_applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('candidate_email', candidateEmail)
    .is('deleted_at', null)
    .limit(1);

  const isDuplicate = (existing?.length ?? 0) > 0;

  const { data: application, error: insertError } = await supabase
    .from('career_applications')
    .insert({
      job_id: jobId,
      candidate_name: candidateName,
      candidate_email: candidateEmail,
      candidate_phone: candidatePhone,
      answers,
      resume_path: resumePath,
      is_duplicate: isDuplicate,
      status: 'new',
    })
    .select('id, created_at')
    .single();

  if (insertError || !application) {
    await supabase.storage.from(RESUME_BUCKET).remove([resumePath]);
    return json({ error: insertError?.message ?? 'Failed to save application' }, 500);
  }

  const notifyEmail = Deno.env.get('NOTIFY_EMAIL') ?? Deno.env.get('ADMIN_EMAIL');
  const jobTitle = job.title ?? job.slug;
  const careersFrom =
    Deno.env.get('CAREERS_FROM_EMAIL')?.trim() ||
    'Per Aspera Careers <careers@peraspera.solutions>';

  const candidateSubject = `Application Received | ${jobTitle} | Per Aspera`;
  const candidateHtml = buildCandidateThankYouHtml(candidateName, jobTitle);

  const adminHtml = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;color:#111;">
      <h2 style="margin:0 0 16px;">New career application</h2>
      <p><strong>Role:</strong> ${escapeHtml(jobTitle)}</p>
      <p><strong>Name:</strong> ${escapeHtml(candidateName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(candidateEmail)}</p>
      ${candidatePhone ? `<p><strong>Phone:</strong> ${escapeHtml(candidatePhone)}</p>` : ''}
      ${isDuplicate ? '<p><strong>Duplicate:</strong> same email already applied to this job</p>' : ''}
      <p style="margin:24px 0 0;font-size:13px;color:#666;">Review in the admin hiring hub.</p>
    </div>
  `;

  const candidateMail = await sendResendEmail({
    to: [candidateEmail],
    subject: candidateSubject,
    html: candidateHtml,
    from: careersFrom,
    replyTo: notifyEmail,
  });

  if (candidateMail.ok) {
    await supabase.from('career_application_emails').insert({
      application_id: application.id,
      subject: candidateSubject,
      body: candidateHtml,
    });
  }

  let adminMail: { ok: boolean; error?: string } = { ok: true };
  if (notifyEmail) {
    adminMail = await sendResendEmail({
      to: [notifyEmail],
      subject: `New application: ${jobTitle} — ${candidateName}`,
      html: adminHtml,
      replyTo: candidateEmail,
    });
  }

  return json({
    id: application.id,
    created_at: application.created_at,
    is_duplicate: isDuplicate,
    emails: {
      candidate: candidateMail.ok,
      admin: adminMail.ok,
    },
    email_errors: {
      candidate: candidateMail.error,
      admin: adminMail.error,
    },
  });
});
