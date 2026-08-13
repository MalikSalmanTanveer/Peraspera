import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import {
  deriveDescriptionFromSections,
  normalizeContentSections,
  validateContentSections,
} from '../_shared/contentSections.ts';
import {
  normalizeFormSchema,
  validateFormSchema,
} from '../_shared/formSchema.ts';
import { sessionKeyFromAccessToken } from '../_shared/adminMfa.ts';
import {
  MFA_ACTIONS,
  MFA_PRE_VERIFY_ACTIONS,
  handleMfaAction,
  isMfaSessionVerified,
} from './mfaActions.ts';

declare const EdgeRuntime: { waitUntil: (promise: Promise<unknown>) => void } | undefined;

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const RESUME_BUCKET = 'career-resumes';
const BLOG_MEDIA_BUCKET = 'blog-media';
const BULK_MAIL_ATTACHMENTS_BUCKET = 'bulk-mail-attachments';
const BULK_MAIL_BATCH_SIZE = 25;
const BULK_MAIL_MAX_RECIPIENTS = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BLOG_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const BLOG_IMAGE_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const APPLICATION_STATUSES = [
  'new',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
  'withdrawn',
] as const;

type Action =
  | 'overviewCounts'
  | 'listDepartments'
  | 'upsertDepartment'
  | 'deleteDepartment'
  | 'listJobs'
  | 'getJob'
  | 'upsertJob'
  | 'publishJob'
  | 'unpublishJob'
  | 'deleteJob'
  | 'updateFormSchema'
  | 'getCulture'
  | 'updateCulture'
  | 'listEmailTemplates'
  | 'upsertEmailTemplate'
  | 'deleteEmailTemplate'
  | 'listApplications'
  | 'getApplication'
  | 'updateApplicationStatus'
  | 'deleteApplication'
  | 'signedResumeUrl'
  | 'sendMail'
  | 'listBulkMailFromOptions'
  | 'createBulkMailJob'
  | 'startBulkMailJob'
  | 'listBulkMailJobs'
  | 'getBulkMailJob'
  | 'processBulkMailJob'
  | 'listApplicationEmails'
  | 'listUsers'
  | 'inviteUser'
  | 'updateUserRole'
  | 'setUserActive'
  | 'resendInvite'
  | 'listBlogPosts'
  | 'getBlogPost'
  | 'upsertBlogPost'
  | 'publishBlogPost'
  | 'unpublishBlogPost'
  | 'deleteBlogPost'
  | 'uploadBlogImage'
  | 'mfaStatus'
  | 'mfaSendEmailCode'
  | 'mfaVerifyEmailCode';

const USER_ACTIONS = new Set<Action>([
  'listUsers',
  'inviteUser',
  'updateUserRole',
  'setUserActive',
  'resendInvite',
]);

const BLOG_ACTIONS = new Set<Action>([
  'listBlogPosts',
  'getBlogPost',
  'upsertBlogPost',
  'publishBlogPost',
  'unpublishBlogPost',
  'deleteBlogPost',
  'uploadBlogImage',
]);

const BULK_MAIL_ACTIONS = new Set<Action>([
  'listBulkMailFromOptions',
  'createBulkMailJob',
  'startBulkMailJob',
  'listBulkMailJobs',
  'getBulkMailJob',
  'processBulkMailJob',
]);

interface RequestBody {
  action: Action;
  payload?: Record<string, unknown>;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'item';
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

type AdminRole = 'super_admin' | 'hiring_manager' | 'blog_author' | 'sales_leads';

type AdminActor = {
  userId: string;
  role: AdminRole;
  authKind: 'jwt' | 'legacy';
  sessionKey: string;
  email: string | null;
  accessToken: string;
};

type AdminAuthResult =
  | { ok: true; actor: AdminActor }
  | { ok: false; response: Response };

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Auth for admin-api:
 * 1) Supabase Auth JWT + admin_profiles (new platform)
 * 2) Legacy admin-login session token in admin_sessions (live site)
 */
async function requireAdmin(req: Request, supabase: SupabaseClient): Promise<AdminAuthResult> {
  const auth = req.headers.get('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) {
    return { ok: false, response: json({ error: 'Not authenticated' }, 401) };
  }

  // New platform: Supabase access token
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (!userError && userData.user) {
    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('id, role, is_active')
      .eq('id', userData.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return { ok: false, response: json({ error: 'Not authenticated' }, 401) };
    }
    if (!profile.is_active) {
      return {
        ok: false,
        response: json({ error: 'This account is disabled. Contact a Super Admin.' }, 403),
      };
    }

    const sessionKey = await sessionKeyFromAccessToken(token);
    return {
      ok: true,
      actor: {
        userId: profile.id as string,
        role: profile.role as AdminRole,
        authKind: 'jwt',
        sessionKey,
        email: userData.user.email ?? null,
        accessToken: token,
      },
    };
  }

  // Live site: opaque token from admin-login → admin_sessions
  const tokenHash = await sha256Hex(token);
  const nowIso = new Date().toISOString();
  const { data: session, error: sessionError } = await supabase
    .from('admin_sessions')
    .select('id')
    .eq('token_hash', tokenHash)
    .gt('expires_at', nowIso)
    .maybeSingle();

  if (sessionError || !session) {
    return { ok: false, response: json({ error: 'Not authenticated' }, 401) };
  }

  // Shared env admin has full hiring access (matches pre-platform live behavior).
  return {
    ok: true,
    actor: {
      userId: 'legacy-shared-admin',
      role: 'super_admin',
      authKind: 'legacy',
      sessionKey: tokenHash,
      email: null,
      accessToken: token,
    },
  };
}

function requireHiringAccess(actor: AdminActor): Response | null {
  if (actor.role === 'super_admin' || actor.role === 'hiring_manager') return null;
  return json({ error: 'Forbidden' }, 403);
}

function requireSuperAdmin(actor: AdminActor): Response | null {
  if (actor.role === 'super_admin') return null;
  return json({ error: 'Forbidden' }, 403);
}

function requireBlogAccess(actor: AdminActor): Response | null {
  if (actor.role === 'super_admin' || actor.role === 'blog_author') return null;
  return json({ error: 'Forbidden' }, 403);
}

function slugifyBlog(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function parseFromEmailEnv(raw: string | undefined): { email: string; label: string } | null {
  if (!raw?.trim()) return null;
  const angled = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (angled) {
    const email = angled[2].toLowerCase().trim();
    const label = angled[1].trim() || email;
    if (!EMAIL_RE.test(email)) return null;
    return { email, label };
  }
  const email = raw.toLowerCase().trim();
  if (!EMAIL_RE.test(email)) return null;
  return { email, label: 'Default (FROM_EMAIL)' };
}

function getBulkMailFromOptions(): { email: string; label: string }[] {
  const defaults = [
    { email: 'contact@peraspera.solutions', label: 'Contact' },
    { email: 'hr@peraspera.solutions', label: 'HR' },
    { email: 'careers@peraspera.solutions', label: 'Careers' },
  ];

  let options = defaults;
  const raw = Deno.env.get('BULK_MAIL_FROM_ADDRESSES');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const configured = parsed
          .map((item) => {
            const value = item && typeof item === 'object'
              ? item as Record<string, unknown>
              : {};
            const email = String(value.email ?? '').toLowerCase().trim();
            return {
              email,
              label: String(value.label ?? email).trim(),
            };
          })
          .filter((option) => EMAIL_RE.test(option.email));
        if (configured.length > 0) options = configured;
      }
    } catch {
      // Fall back to defaults below.
    }
  }

  const fromEnv = parseFromEmailEnv(Deno.env.get('FROM_EMAIL'));
  if (fromEnv && !options.some((option) => option.email === fromEnv.email)) {
    options = [
      { email: fromEnv.email, label: `${fromEnv.label} (verified sender)` },
      ...options,
    ];
  }

  return options;
}

function formatBulkMailFrom(email: string): string {
  const option = getBulkMailFromOptions().find((item) => item.email === email.toLowerCase().trim());
  const label = option?.label?.replace(/\s*\(verified sender\)\s*$/i, '').trim() || 'Peraspera';
  return `${label} <${email.toLowerCase().trim()}>`;
}

function isAllowedBulkMailFrom(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  return getBulkMailFromOptions().some((option) => option.email === normalized);
}

function safeBulkMailFilename(filename: string): string {
  const withoutControlCharacters = Array.from(filename)
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join('');
  return withoutControlCharacters
    .replace(/[\\/]+/g, '-')
    .trim()
    .slice(0, 120) || 'attachment';
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

function keepAlive(promise: Promise<unknown>): void {
  try {
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime?.waitUntil) {
      EdgeRuntime.waitUntil(promise);
      return;
    }
  } catch {
    // Fall back when the runtime API is unavailable.
  }
  void promise;
}

function invokeBulkMailProcessor(params: {
  supabaseUrl: string;
  serviceKey: string;
  accessToken: string;
  jobId: string;
}): void {
  keepAlive(
    fetch(`${params.supabaseUrl}/functions/v1/admin-api`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
        apikey: params.serviceKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'processBulkMailJob',
        payload: { job_id: params.jobId },
      }),
    }).catch((error) => {
      console.error('Failed to invoke bulk mail processor', params.jobId, error);
    }),
  );
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Pass through compose HTML like career sendMail — no campaign wrapper/footer. */
function wrapBulkMailHtml(bodyHtml: string, _fromEmail: string): string {
  return bodyHtml;
}

async function sendResendEmail(params: {
  to: string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
  headers?: Record<string, string>;
  attachments?: { filename: string; content: string }[];
  idempotencyKey?: string;
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const from = params.from ?? Deno.env.get('FROM_EMAIL');
  if (!apiKey || !from) {
    return { ok: false, error: 'Email service not configured' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(params.idempotencyKey ? { 'Idempotency-Key': params.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from,
      to: params.to,
      reply_to: params.replyTo,
      subject: params.subject,
      html: params.html,
      ...(params.text ? { text: params.text } : {}),
      ...(params.headers ? { headers: params.headers } : {}),
      ...(params.attachments ? { attachments: params.attachments } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: text };
  }

  const result = await res.json();
  return { ok: true, id: result.id };
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

  const authResult = await requireAdmin(req, supabase);
  if (!authResult.ok) return authResult.response;

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const action = body.action;
  const payload = body.payload ?? {};
  const includeDeleted = Boolean(payload.include_deleted);

  // MFA actions (JWT platform only)
  if (MFA_ACTIONS.has(action)) {
    if (authResult.actor.authKind !== 'jwt') {
      return json({ error: 'MFA is only available for platform admin accounts' }, 400);
    }
    try {
      const mfaVerified = await isMfaSessionVerified(
        supabase,
        authResult.actor.userId,
        authResult.actor.sessionKey,
      );
      if (!MFA_PRE_VERIFY_ACTIONS.has(action) && !mfaVerified) {
        return json({ error: 'MFA required' }, 403);
      }
      return await handleMfaAction({
        action,
        payload,
        supabase,
        actor: {
          userId: authResult.actor.userId,
          role: authResult.actor.role,
        },
        sessionKey: authResult.actor.sessionKey,
        userEmail: authResult.actor.email,
        json,
        sendResendEmail,
        mfaVerified,
      });
    } catch (error) {
      console.error('admin-api MFA error', action, error);
      return json({ error: error instanceof Error ? error.message : 'Server error' }, 500);
    }
  }

  // JWT platform: require MFA verification for all data actions
  if (authResult.actor.authKind === 'jwt') {
    const mfaVerified = await isMfaSessionVerified(
      supabase,
      authResult.actor.userId,
      authResult.actor.sessionKey,
    );
    if (!mfaVerified) {
      return json({ error: 'MFA required' }, 403);
    }
  }

  if (USER_ACTIONS.has(action) || BULK_MAIL_ACTIONS.has(action)) {
    const denied = requireSuperAdmin(authResult.actor);
    if (denied) return denied;
  } else if (BLOG_ACTIONS.has(action)) {
    const denied = requireBlogAccess(authResult.actor);
    if (denied) return denied;
  } else {
    const denied = requireHiringAccess(authResult.actor);
    if (denied) return denied;
  }

  try {
    switch (action) {
      case 'overviewCounts': {
        const [jobs, apps, templates, departments] = await Promise.all([
          supabase
            .from('career_jobs')
            .select('id', { count: 'exact', head: true })
            .is('deleted_at', null),
          supabase
            .from('career_applications')
            .select('id', { count: 'exact', head: true })
            .is('deleted_at', null),
          supabase
            .from('career_email_templates')
            .select('id', { count: 'exact', head: true })
            .is('deleted_at', null),
          supabase
            .from('career_departments')
            .select('id', { count: 'exact', head: true })
            .is('deleted_at', null),
        ]);

        const { count: publishedJobs } = await supabase
          .from('career_jobs')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'published')
          .is('deleted_at', null);

        const { count: newApps } = await supabase
          .from('career_applications')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new')
          .is('deleted_at', null);

        if (jobs.error || apps.error || templates.error || departments.error) {
          throw jobs.error ?? apps.error ?? templates.error ?? departments.error;
        }

        return json({
          data: {
            departments: departments.count ?? 0,
            jobs: jobs.count ?? 0,
            published_jobs: publishedJobs ?? 0,
            applications: apps.count ?? 0,
            new_applications: newApps ?? 0,
            email_templates: templates.count ?? 0,
          },
        });
      }

      case 'listDepartments': {
        let query = supabase
          .from('career_departments')
          .select('*')
          .order('sort_order', { ascending: true });
        if (!includeDeleted) query = query.is('deleted_at', null);
        const { data, error } = await query;
        if (error) throw error;
        return json({ data });
      }

      case 'upsertDepartment': {
        const id = payload.id as string | undefined;
        const name = String(payload.name ?? '').trim();
        if (!name) return json({ error: 'Name required' }, 400);
        const slug = String(payload.slug ?? slugify(name));
        const sort_order = Number(payload.sort_order ?? 0);
        const row = { name, slug, sort_order, deleted_at: null };
        const query = id
          ? supabase.from('career_departments').update(row).eq('id', id).select().single()
          : supabase.from('career_departments').insert(row).select().single();
        const { data, error } = await query;
        if (error) throw error;
        return json({ data });
      }

      case 'deleteDepartment': {
        const id = String(payload.id ?? '');
        const { error } = await supabase
          .from('career_departments')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;
        return json({ ok: true });
      }

      case 'listJobs': {
        let query = supabase
          .from('career_jobs')
          .select('*, career_departments(id, name, slug)')
          .order('updated_at', { ascending: false });
        if (!includeDeleted) query = query.is('deleted_at', null);
        const { data, error } = await query;
        if (error) throw error;
        return json({ data });
      }

      case 'getJob': {
        const id = String(payload.id ?? '');
        const slug = payload.slug ? String(payload.slug) : null;
        let query = supabase
          .from('career_jobs')
          .select('*, career_departments(id, name, slug)');
        if (id) query = query.eq('id', id);
        else if (slug) query = query.eq('slug', slug);
        else return json({ error: 'id or slug required' }, 400);
        const { data, error } = await query.maybeSingle();
        if (error) throw error;
        return json({ data });
      }

      case 'upsertJob': {
        const id = payload.id as string | undefined;
        const department_id = String(payload.department_id ?? '');
        const title = String(payload.title ?? '').trim();
        const location = String(payload.location ?? '');
        const workplace_type = String(payload.workplace_type ?? 'onsite');
        const employment_type = String(payload.employment_type ?? 'full_time');
        const status = String(payload.status ?? 'draft');
        let slug = String(payload.slug ?? '').trim();
        if (!slug && title) slug = slugify(title);

        if (!department_id || !title || !slug) {
          return json({ error: 'department_id, title, and slug are required' }, 400);
        }
        if (status !== 'draft' && status !== 'published') {
          return json({ error: 'invalid status' }, 400);
        }

        const formSchema = normalizeFormSchema(payload.form_schema ?? { fields: [] });
        const formError = validateFormSchema(formSchema);
        if (formError) return json({ error: formError }, 400);

        const content_sections = normalizeContentSections(payload.content_sections);
        const sectionsError = validateContentSections(content_sections);
        if (sectionsError) return json({ error: sectionsError }, 400);
        const description = deriveDescriptionFromSections(content_sections);

        const row = {
          department_id,
          title,
          slug,
          location,
          workplace_type,
          employment_type,
          description,
          content_sections,
          status,
          form_schema: formSchema,
          deleted_at: null,
        };

        const query = id
          ? supabase.from('career_jobs').update(row).eq('id', id).select().single()
          : supabase.from('career_jobs').insert(row).select().single();
        const { data, error } = await query;
        if (error) throw error;
        return json({ data });
      }

      case 'publishJob': {
        const id = String(payload.id ?? '');
        const { data: existing, error: loadError } = await supabase
          .from('career_jobs')
          .select('content_sections')
          .eq('id', id)
          .is('deleted_at', null)
          .maybeSingle();
        if (loadError) throw loadError;
        if (!existing) return json({ error: 'Job not found' }, 404);
        const sections = normalizeContentSections(existing.content_sections);
        const sectionsError = validateContentSections(sections);
        if (sectionsError) return json({ error: sectionsError }, 400);

        const { data, error } = await supabase
          .from('career_jobs')
          .update({ status: 'published' })
          .eq('id', id)
          .is('deleted_at', null)
          .select()
          .single();
        if (error) throw error;
        return json({ data });
      }

      case 'unpublishJob': {
        const id = String(payload.id ?? '');
        const { data, error } = await supabase
          .from('career_jobs')
          .update({ status: 'draft' })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return json({ data });
      }

      case 'deleteJob': {
        const id = String(payload.id ?? '');
        const { error } = await supabase
          .from('career_jobs')
          .update({ deleted_at: new Date().toISOString(), status: 'draft' })
          .eq('id', id);
        if (error) throw error;
        return json({ ok: true });
      }

      case 'updateFormSchema': {
        const id = String(payload.id ?? '');
        const form_schema = payload.form_schema;
        if (!form_schema) return json({ error: 'form_schema required' }, 400);
        const formSchema = normalizeFormSchema(form_schema);
        const formError = validateFormSchema(formSchema);
        if (formError) return json({ error: formError }, 400);
        const { data, error } = await supabase
          .from('career_jobs')
          .update({ form_schema: formSchema })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return json({ data });
      }

      case 'getCulture': {
        const { data, error } = await supabase
          .from('career_page_content')
          .select('*')
          .eq('id', 1)
          .single();
        if (error) throw error;
        return json({ data });
      }

      case 'updateCulture': {
        const row = {
          id: 1,
          headline: String(payload.headline ?? ''),
          sections: payload.sections ?? [],
          values: payload.values ?? [],
          hiring_steps: payload.hiring_steps ?? [],
          empty_cta: payload.empty_cta ?? { message: '', label: '', href: '' },
          updated_at: new Date().toISOString(),
        };
        const { data, error } = await supabase
          .from('career_page_content')
          .upsert(row)
          .select()
          .single();
        if (error) throw error;
        return json({ data });
      }

      case 'listEmailTemplates': {
        let query = supabase
          .from('career_email_templates')
          .select('*')
          .order('updated_at', { ascending: false });
        if (!includeDeleted) query = query.is('deleted_at', null);
        const { data, error } = await query;
        if (error) throw error;
        return json({ data });
      }

      case 'upsertEmailTemplate': {
        const id = payload.id as string | undefined;
        const name = String(payload.name ?? '').trim();
        const subject = String(payload.subject ?? '');
        const bodyText = String(payload.body ?? '');
        if (!name) return json({ error: 'name required' }, 400);
        const row = { name, subject, body: bodyText, deleted_at: null };
        const query = id
          ? supabase.from('career_email_templates').update(row).eq('id', id).select().single()
          : supabase.from('career_email_templates').insert(row).select().single();
        const { data, error } = await query;
        if (error) throw error;
        return json({ data });
      }

      case 'deleteEmailTemplate': {
        const id = String(payload.id ?? '');
        const { error } = await supabase
          .from('career_email_templates')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;
        return json({ ok: true });
      }

      case 'listApplications': {
        const job_id = payload.job_id ? String(payload.job_id) : null;
        const status = payload.status ? String(payload.status) : null;
        let query = supabase
          .from('career_applications')
          .select(
            '*, career_jobs(id, title, slug, department_id, career_departments(name, slug))',
          )
          .order('created_at', { ascending: false });
        if (!includeDeleted) query = query.is('deleted_at', null);
        if (job_id) query = query.eq('job_id', job_id);
        if (status) query = query.eq('status', status);
        const { data, error } = await query;
        if (error) throw error;
        return json({ data });
      }

      case 'getApplication': {
        const id = String(payload.id ?? '');
        const { data, error } = await supabase
          .from('career_applications')
          .select(
            '*, career_jobs(id, title, slug, form_schema, career_departments(name, slug))',
          )
          .eq('id', id)
          .maybeSingle();
        if (error) throw error;

        const emails = await supabase
          .from('career_application_emails')
          .select('*')
          .eq('application_id', id)
          .order('sent_at', { ascending: false });

        if (emails.error) throw emails.error;

        return json({ data: { ...data, emails: emails.data ?? [] } });
      }

      case 'updateApplicationStatus': {
        const id = String(payload.id ?? '');
        const status = String(payload.status ?? '');
        if (!APPLICATION_STATUSES.includes(status as typeof APPLICATION_STATUSES[number])) {
          return json({ error: 'invalid status' }, 400);
        }
        const { data, error } = await supabase
          .from('career_applications')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return json({ data });
      }

      case 'deleteApplication': {
        const id = String(payload.id ?? '');
        const { error } = await supabase
          .from('career_applications')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;
        return json({ ok: true });
      }

      case 'signedResumeUrl': {
        const application_id = String(payload.application_id ?? '');
        const pathOverride = payload.path ? String(payload.path) : null;

        let path = pathOverride;
        if (!path) {
          const { data: app, error: appError } = await supabase
            .from('career_applications')
            .select('resume_path')
            .eq('id', application_id)
            .single();
          if (appError || !app) return json({ error: 'Application not found' }, 404);
          path = app.resume_path;
        }

        const { data, error } = await supabase.storage
          .from(RESUME_BUCKET)
          .createSignedUrl(path!, 60 * 10);
        if (error) throw error;
        return json({ data });
      }

      case 'listApplicationEmails': {
        const application_id = String(payload.application_id ?? '');
        const { data, error } = await supabase
          .from('career_application_emails')
          .select('*')
          .eq('application_id', application_id)
          .order('sent_at', { ascending: false });
        if (error) throw error;
        return json({ data });
      }

      case 'sendMail': {
        const application_id = String(payload.application_id ?? '');
        const subject = String(payload.subject ?? '').trim();
        const bodyHtml = String(payload.body ?? '');
        if (!application_id || !subject || !bodyHtml) {
          return json({ error: 'application_id, subject, and body required' }, 400);
        }

        const { data: app, error: appError } = await supabase
          .from('career_applications')
          .select('id, candidate_email, candidate_name, deleted_at')
          .eq('id', application_id)
          .single();
        if (appError || !app || app.deleted_at) {
          return json({ error: 'Application not found' }, 404);
        }

        const mail = await sendResendEmail({
          to: [app.candidate_email],
          subject,
          html: bodyHtml,
          replyTo: Deno.env.get('NOTIFY_EMAIL') ?? Deno.env.get('ADMIN_EMAIL'),
        });

        if (!mail.ok) {
          return json({ error: mail.error ?? 'Failed to send email' }, 502);
        }

        const { data: logged, error: logError } = await supabase
          .from('career_application_emails')
          .insert({
            application_id,
            subject,
            body: bodyHtml,
            sent_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (logError) throw logError;
        return json({ data: { email: logged, resend_id: mail.id } });
      }

      case 'listBulkMailFromOptions': {
        return json({ data: getBulkMailFromOptions() });
      }

      case 'createBulkMailJob': {
        const fromEmail = String(payload.from_email ?? '').toLowerCase().trim();
        const subject = String(payload.subject ?? '').trim();
        const bodyHtml = String(payload.body ?? '');
        if (!isAllowedBulkMailFrom(fromEmail)) {
          return json({ error: 'From address is not allowed' }, 400);
        }
        if (!subject || !bodyHtml.trim()) {
          return json({ error: 'from_email, subject, and body are required' }, 400);
        }
        if (!Array.isArray(payload.recipients)) {
          return json({ error: 'recipients must be an array' }, 400);
        }

        const recipients = Array.from(
          new Set(
            payload.recipients
              .map((recipient) => String(recipient).toLowerCase().trim())
              .filter((recipient) => EMAIL_RE.test(recipient)),
          ),
        );
        if (recipients.length === 0) {
          return json({ error: 'At least one valid recipient is required' }, 400);
        }
        if (recipients.length > BULK_MAIL_MAX_RECIPIENTS) {
          return json(
            { error: `A maximum of ${BULK_MAIL_MAX_RECIPIENTS} recipients is allowed` },
            400,
          );
        }

        const hasAttachment = payload.has_attachment === true;
        const attachmentName = hasAttachment
          ? safeBulkMailFilename(String(payload.attachment_name ?? 'attachment'))
          : null;

        // Stable UUID reserved for jobs created through the legacy shared-admin session.
        const createdBy = authResult.actor.userId === 'legacy-shared-admin'
          ? '00000000-0000-4000-8000-0000000000b1'
          : authResult.actor.userId;
        const { data: job, error: jobError } = await supabase
          .from('bulk_mail_jobs')
          .insert({
            created_by: createdBy,
            from_email: fromEmail,
            subject,
            body: bodyHtml,
            status: 'draft',
            total_count: recipients.length,
          })
          .select()
          .single();
        if (jobError) throw jobError;

        const { error: recipientsError } = await supabase
          .from('bulk_mail_recipients')
          .insert(
            recipients.map((email) => ({
              job_id: job.id,
              email,
              status: 'pending',
            })),
          );
        if (recipientsError) {
          await supabase.from('bulk_mail_jobs').delete().eq('id', job.id);
          throw recipientsError;
        }

        if (!hasAttachment) return json({ data: { job } });

        const path = `${job.id}/${attachmentName}`;
        const { data: upload, error: uploadError } = await supabase.storage
          .from(BULK_MAIL_ATTACHMENTS_BUCKET)
          .createSignedUploadUrl(path, { upsert: true });
        if (uploadError) {
          await supabase.from('bulk_mail_jobs').delete().eq('id', job.id);
          throw uploadError;
        }

        return json({
          data: {
            job,
            upload: {
              path,
              token: upload.token,
              signedUrl: upload.signedUrl,
            },
          },
        });
      }

      case 'startBulkMailJob': {
        const jobId = String(payload.job_id ?? '');
        if (!jobId) return json({ error: 'job_id is required' }, 400);

        const { data: existing, error: loadError } = await supabase
          .from('bulk_mail_jobs')
          .select('*')
          .eq('id', jobId)
          .maybeSingle();
        if (loadError) throw loadError;
        if (!existing) return json({ error: 'Bulk mail job not found' }, 404);
        if (existing.status !== 'draft' && existing.status !== 'queued') {
          return json({ error: 'Only draft or queued jobs can be started' }, 409);
        }

        const attachmentPath = payload.attachment_path
          ? String(payload.attachment_path)
          : null;
        const attachmentName = payload.attachment_name
          ? safeBulkMailFilename(String(payload.attachment_name))
          : null;
        const attachmentContentType = payload.attachment_content_type
          ? String(payload.attachment_content_type).trim()
          : null;
        if (attachmentPath || attachmentName || attachmentContentType) {
          if (!attachmentPath || !attachmentName || !attachmentContentType) {
            return json(
              {
                error:
                  'attachment_path, attachment_name, and attachment_content_type are all required',
              },
              400,
            );
          }
          const attachmentStorageName = attachmentPath.slice(jobId.length + 1);
          if (
            !attachmentPath.startsWith(`${jobId}/`) ||
            !attachmentStorageName ||
            attachmentStorageName.includes('/') ||
            attachmentStorageName.includes('\\')
          ) {
            return json({ error: 'Invalid attachment path' }, 400);
          }
          const { data: attachment, error: attachmentError } = await supabase.storage
            .from(BULK_MAIL_ATTACHMENTS_BUCKET)
            .download(attachmentPath);
          if (attachmentError || !attachment) {
            return json({ error: 'Attachment upload was not found' }, 400);
          }
        }

        const now = new Date().toISOString();
        const { data: job, error } = await supabase
          .from('bulk_mail_jobs')
          .update({
            status: 'queued',
            started_at: existing.started_at ?? now,
            attachment_path: attachmentPath ?? existing.attachment_path,
            attachment_name: attachmentName ?? existing.attachment_name,
            attachment_content_type:
              attachmentContentType ?? existing.attachment_content_type,
          })
          .eq('id', jobId)
          .select()
          .single();
        if (error) throw error;

        invokeBulkMailProcessor({
          supabaseUrl,
          serviceKey,
          accessToken: authResult.actor.accessToken,
          jobId,
        });
        return json({ data: { job } });
      }

      case 'listBulkMailJobs': {
        const { data, error } = await supabase
          .from('bulk_mail_jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        if (error) throw error;
        return json({ data: data ?? [] });
      }

      case 'getBulkMailJob': {
        const jobId = String(payload.job_id ?? '');
        if (!jobId) return json({ error: 'job_id is required' }, 400);

        const { data: job, error: jobError } = await supabase
          .from('bulk_mail_jobs')
          .select('*')
          .eq('id', jobId)
          .maybeSingle();
        if (jobError) throw jobError;
        if (!job) return json({ error: 'Bulk mail job not found' }, 404);

        let recipientsQuery = supabase
          .from('bulk_mail_recipients')
          .select('*')
          .eq('job_id', jobId)
          .order('email', { ascending: true });
        if (payload.include_all !== true) {
          recipientsQuery = recipientsQuery.eq('status', 'failed');
        }
        const { data: recipients, error: recipientsError } = await recipientsQuery;
        if (recipientsError) throw recipientsError;
        return json({ data: { job, recipients: recipients ?? [] } });
      }

      case 'processBulkMailJob': {
        const jobId = String(payload.job_id ?? '');
        if (!jobId) return json({ error: 'job_id is required' }, 400);

        const { data: existing, error: loadError } = await supabase
          .from('bulk_mail_jobs')
          .select('*')
          .eq('id', jobId)
          .maybeSingle();
        if (loadError) throw loadError;
        if (!existing) return json({ error: 'Bulk mail job not found' }, 404);
        if (['completed', 'failed', 'cancelled'].includes(existing.status)) {
          return json({ data: { job: existing } });
        }
        if (existing.status === 'processing') {
          return json({ data: { job: existing } });
        }
        if (existing.status !== 'queued') {
          return json({ error: 'Bulk mail job is not queued' }, 409);
        }

        const { data: claimed, error: claimError } = await supabase
          .from('bulk_mail_jobs')
          .update({ status: 'processing' })
          .eq('id', jobId)
          .eq('status', 'queued')
          .select()
          .maybeSingle();
        if (claimError) throw claimError;
        if (!claimed) {
          return json({ data: { job: existing } });
        }

        // Repair counters if a prior tick updated a recipient but failed before
        // persisting that recipient's counter increment.
        const [sentCountResult, failedCountResult] = await Promise.all([
          supabase
            .from('bulk_mail_recipients')
            .select('id', { count: 'exact', head: true })
            .eq('job_id', jobId)
            .eq('status', 'sent'),
          supabase
            .from('bulk_mail_recipients')
            .select('id', { count: 'exact', head: true })
            .eq('job_id', jobId)
            .eq('status', 'failed'),
        ]);
        if (sentCountResult.error) throw sentCountResult.error;
        if (failedCountResult.error) throw failedCountResult.error;
        const { error: reconcileError } = await supabase
          .from('bulk_mail_jobs')
          .update({
            sent_count: sentCountResult.count ?? 0,
            failed_count: failedCountResult.count ?? 0,
          })
          .eq('id', jobId)
          .eq('status', 'processing');
        if (reconcileError) throw reconcileError;

        let attachments: { filename: string; content: string }[] | undefined;
        if (claimed.attachment_path) {
          const { data: file, error: fileError } = await supabase.storage
            .from(BULK_MAIL_ATTACHMENTS_BUCKET)
            .download(claimed.attachment_path);
          if (fileError || !file) {
            const message = fileError?.message ?? 'Attachment could not be downloaded';
            const { data: failedJob } = await supabase
              .from('bulk_mail_jobs')
              .update({
                status: 'failed',
                error_summary: message,
                completed_at: new Date().toISOString(),
              })
              .eq('id', jobId)
              .select()
              .single();
            return json({ error: message, data: { job: failedJob } }, 500);
          }
          attachments = [{
            filename: claimed.attachment_name ?? 'attachment',
            content: arrayBufferToBase64(await file.arrayBuffer()),
          }];
        }

        const { data: pending, error: pendingError } = await supabase
          .from('bulk_mail_recipients')
          .select('id, email')
          .eq('job_id', jobId)
          .eq('status', 'pending')
          .order('id', { ascending: true })
          .limit(BULK_MAIL_BATCH_SIZE);
        if (pendingError) throw pendingError;

        for (const recipient of pending ?? []) {
          let mail: { ok: boolean; error?: string; id?: string };
          try {
            const fromFormatted = formatBulkMailFrom(claimed.from_email);
            const replyTo = Deno.env.get('NOTIFY_EMAIL') ?? claimed.from_email;
            const wrappedHtml = wrapBulkMailHtml(claimed.body, claimed.from_email);
            const plainText = htmlToPlainText(claimed.body);
            mail = await sendResendEmail({
              from: fromFormatted,
              to: [recipient.email],
              subject: claimed.subject,
              html: wrappedHtml,
              text: plainText,
              replyTo,
              attachments,
              idempotencyKey: `bulk-mail-${recipient.id}`,
            });
          } catch (error) {
            mail = {
              ok: false,
              error: error instanceof Error ? error.message : 'Email request failed',
            };
          }

          const recipientUpdate = mail.ok
            ? {
              status: 'sent',
              resend_id: mail.id ?? null,
              error: null,
              sent_at: new Date().toISOString(),
            }
            : {
              status: 'failed',
              error: (mail.error ?? 'Failed to send email').slice(0, 2000),
              sent_at: null,
            };
          let recipientUpdateError: unknown = null;
          const recipientUpdateAttempts = mail.ok ? 3 : 1;
          for (let attempt = 0; attempt < recipientUpdateAttempts; attempt += 1) {
            const { data: updatedRecipient, error: updateError } = await supabase
              .from('bulk_mail_recipients')
              .update(recipientUpdate)
              .eq('id', recipient.id)
              .eq('status', 'pending')
              .select('id')
              .maybeSingle();
            recipientUpdateError = updateError ??
              (updatedRecipient ? null : new Error('Recipient was not updated'));
            if (!recipientUpdateError) break;
          }
          if (recipientUpdateError) throw recipientUpdateError;

          const counterColumn = mail.ok ? 'sent_count' : 'failed_count';
          let counterUpdateError: unknown = null;
          for (let attempt = 0; attempt < 3; attempt += 1) {
            const { data: counts, error: countsError } = await supabase
              .from('bulk_mail_jobs')
              .select('sent_count, failed_count')
              .eq('id', jobId)
              .eq('status', 'processing')
              .maybeSingle();
            if (countsError || !counts) {
              counterUpdateError = countsError ?? new Error('Bulk mail job is not processing');
              continue;
            }
            const { data: updatedJob, error: updateCounterError } = await supabase
              .from('bulk_mail_jobs')
              .update({ [counterColumn]: Number(counts[counterColumn] ?? 0) + 1 })
              .eq('id', jobId)
              .eq('status', 'processing')
              .select('id')
              .maybeSingle();
            counterUpdateError = updateCounterError ??
              (updatedJob ? null : new Error('Bulk mail counter was not updated'));
            if (!counterUpdateError) break;
          }
          if (counterUpdateError) throw counterUpdateError;
        }

        const { count: pendingCount, error: countError } = await supabase
          .from('bulk_mail_recipients')
          .select('id', { count: 'exact', head: true })
          .eq('job_id', jobId)
          .eq('status', 'pending');
        if (countError) throw countError;

        const hasPending = (pendingCount ?? 0) > 0;
        const { data: job, error: finishError } = await supabase
          .from('bulk_mail_jobs')
          .update({
            status: hasPending ? 'queued' : 'completed',
            completed_at: hasPending ? null : new Date().toISOString(),
          })
          .eq('id', jobId)
          .select()
          .single();
        if (finishError) throw finishError;

        if (hasPending) {
          // An optional cron can call processBulkMailJob for stalled queued jobs.
          invokeBulkMailProcessor({
            supabaseUrl,
            serviceKey,
            accessToken: authResult.actor.accessToken,
            jobId,
          });
        }
        return json({ data: { job, processed: (pending ?? []).length } });
      }

      case 'listUsers': {
        const { data: profiles, error } = await supabase
          .from('admin_profiles')
          .select('id, username, role, is_active, created_at, updated_at')
          .order('created_at', { ascending: true });
        if (error) throw error;

        const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
          perPage: 1000,
        });
        if (authError) throw authError;

        const emailById = new Map(
          (authData.users ?? []).map((u) => [u.id, u.email ?? ''] as const),
        );

        const rows = (profiles ?? []).map((p) => ({
          ...p,
          email: emailById.get(p.id) ?? '',
        }));
        return json({ data: rows });
      }

      case 'inviteUser': {
        const email = String(payload.email ?? '').trim().toLowerCase();
        const username = String(payload.username ?? '').trim();
        const role = String(payload.role ?? '').trim() as AdminRole;
        const allowed: AdminRole[] = [
          'super_admin',
          'hiring_manager',
          'blog_author',
          'sales_leads',
        ];
        if (!email || !username) {
          return json({ error: 'Email and username are required' }, 400);
        }
        if (!allowed.includes(role)) {
          return json({ error: 'Invalid role' }, 400);
        }

        const { data: existingUsername } = await supabase
          .from('admin_profiles')
          .select('id')
          .eq('username', username)
          .maybeSingle();
        if (existingUsername) {
          return json({ error: 'Username already taken' }, 409);
        }

        const redirectTo = String(
          payload.redirect_to ?? Deno.env.get('ADMIN_INVITE_REDIRECT_URL') ?? '',
        ).trim();
        if (!redirectTo) {
          return json(
            {
              error:
                'Invite redirect URL is not configured. Set ADMIN_INVITE_REDIRECT_URL or pass redirect_to (e.g. http://localhost:5173/admin/set-password).',
            },
            500,
          );
        }

        const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
          email,
          {
            data: { username, role },
            redirectTo,
          },
        );
        if (inviteError) {
          return json({ error: inviteError.message }, 400);
        }

        if (invited.user) {
          await supabase.from('admin_profiles').upsert({
            id: invited.user.id,
            username,
            role,
            is_active: true,
          });
        }

        return json({
          data: {
            id: invited.user?.id,
            email,
            username,
            role,
          },
        });
      }

      case 'updateUserRole': {
        const userId = String(payload.user_id ?? '');
        const role = String(payload.role ?? '').trim() as AdminRole;
        const allowed: AdminRole[] = [
          'super_admin',
          'hiring_manager',
          'blog_author',
          'sales_leads',
        ];
        if (!userId || !allowed.includes(role)) {
          return json({ error: 'user_id and valid role are required' }, 400);
        }

        if (userId === authResult.actor.userId && role !== 'super_admin') {
          return json({ error: 'You cannot remove your own Super Admin role' }, 400);
        }

        if (role !== 'super_admin') {
          const { count } = await supabase
            .from('admin_profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'super_admin')
            .eq('is_active', true);
          const { data: target } = await supabase
            .from('admin_profiles')
            .select('role')
            .eq('id', userId)
            .maybeSingle();
          if (target?.role === 'super_admin' && (count ?? 0) <= 1) {
            return json({ error: 'Cannot demote the last Super Admin' }, 400);
          }
        }

        const { data, error } = await supabase
          .from('admin_profiles')
          .update({ role })
          .eq('id', userId)
          .select('id, username, role, is_active, created_at, updated_at')
          .single();
        if (error) throw error;
        return json({ data });
      }

      case 'setUserActive': {
        const userId = String(payload.user_id ?? '');
        const isActive = Boolean(payload.is_active);
        if (!userId) return json({ error: 'user_id is required' }, 400);
        if (userId === authResult.actor.userId && !isActive) {
          return json({ error: 'You cannot disable your own account' }, 400);
        }

        if (!isActive) {
          const { data: target } = await supabase
            .from('admin_profiles')
            .select('role')
            .eq('id', userId)
            .maybeSingle();
          if (target?.role === 'super_admin') {
            const { count } = await supabase
              .from('admin_profiles')
              .select('id', { count: 'exact', head: true })
              .eq('role', 'super_admin')
              .eq('is_active', true);
            if ((count ?? 0) <= 1) {
              return json({ error: 'Cannot disable the last Super Admin' }, 400);
            }
          }
        }

        const { data, error } = await supabase
          .from('admin_profiles')
          .update({ is_active: isActive })
          .eq('id', userId)
          .select('id, username, role, is_active, created_at, updated_at')
          .single();
        if (error) throw error;

        if (!isActive) {
          await supabase.auth.admin.signOut(userId, 'global').catch(() => undefined);
        }

        return json({ data });
      }

      case 'resendInvite': {
        const email = String(payload.email ?? '').trim().toLowerCase();
        if (!email) return json({ error: 'email is required' }, 400);
        const redirectTo = String(
          payload.redirect_to ?? Deno.env.get('ADMIN_INVITE_REDIRECT_URL') ?? '',
        ).trim();
        if (!redirectTo) {
          return json(
            {
              error:
                'Invite redirect URL is not configured. Set ADMIN_INVITE_REDIRECT_URL or pass redirect_to.',
            },
            500,
          );
        }
        const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
          redirectTo,
        });
        if (error) return json({ error: error.message }, 400);
        return json({ data: { ok: true } });
      }

      case 'listBlogPosts': {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(
            'id, title, slug, body_html, excerpt, cover_image_url, status, author_id, published_at, created_at, updated_at',
          )
          .order('updated_at', { ascending: false });
        if (error) throw error;
        return json({ data: data ?? [] });
      }

      case 'getBlogPost': {
        const id = String(payload.id ?? '');
        if (!id) return json({ error: 'id is required' }, 400);
        const { data, error } = await supabase
          .from('blog_posts')
          .select(
            'id, title, slug, body_html, excerpt, cover_image_url, status, author_id, published_at, created_at, updated_at',
          )
          .eq('id', id)
          .maybeSingle();
        if (error) throw error;
        if (!data) return json({ error: 'Post not found' }, 404);
        return json({ data });
      }

      case 'upsertBlogPost': {
        const id = payload.id ? String(payload.id) : null;
        const title = String(payload.title ?? '').trim();
        let slug = String(payload.slug ?? '').trim().toLowerCase();
        const bodyHtml = String(payload.body_html ?? '');
        const excerpt = String(payload.excerpt ?? '').trim().slice(0, 500);
        const cover =
          payload.cover_image_url === null || payload.cover_image_url === undefined
            ? null
            : String(payload.cover_image_url).trim() || null;

        if (!title) return json({ error: 'Title is required' }, 400);
        if (!slug) slug = slugifyBlog(title) || `post-${crypto.randomUUID().slice(0, 8)}`;
        else slug = slugifyBlog(slug) || slug;

        if (id) {
          const { data, error } = await supabase
            .from('blog_posts')
            .update({
              title,
              slug,
              body_html: bodyHtml,
              excerpt,
              cover_image_url: cover,
            })
            .eq('id', id)
            .select(
              'id, title, slug, body_html, excerpt, cover_image_url, status, author_id, published_at, created_at, updated_at',
            )
            .single();
          if (error) {
            if (error.code === '23505') {
              return json({ error: 'Slug already exists' }, 409);
            }
            throw error;
          }
          return json({ data });
        }

        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            title,
            slug,
            body_html: bodyHtml,
            excerpt,
            cover_image_url: cover,
            status: 'draft',
            author_id: authResult.actor.userId,
          })
          .select(
            'id, title, slug, body_html, excerpt, cover_image_url, status, author_id, published_at, created_at, updated_at',
          )
          .single();
        if (error) {
          if (error.code === '23505') {
            return json({ error: 'Slug already exists' }, 409);
          }
          throw error;
        }
        return json({ data });
      }

      case 'publishBlogPost': {
        const id = String(payload.id ?? '');
        if (!id) return json({ error: 'id is required' }, 400);
        const { data: existing, error: getError } = await supabase
          .from('blog_posts')
          .select('id, title, body_html')
          .eq('id', id)
          .maybeSingle();
        if (getError) throw getError;
        if (!existing) return json({ error: 'Post not found' }, 404);
        if (!String(existing.title ?? '').trim()) {
          return json({ error: 'Add a title before publishing' }, 400);
        }
        if (!String(existing.body_html ?? '').replace(/<[^>]+>/g, '').trim()) {
          return json({ error: 'Add body content before publishing' }, 400);
        }

        const { data, error } = await supabase
          .from('blog_posts')
          .update({
            status: 'published',
            published_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select(
            'id, title, slug, body_html, excerpt, cover_image_url, status, author_id, published_at, created_at, updated_at',
          )
          .single();
        if (error) throw error;
        return json({ data });
      }

      case 'unpublishBlogPost': {
        const id = String(payload.id ?? '');
        if (!id) return json({ error: 'id is required' }, 400);
        const { data, error } = await supabase
          .from('blog_posts')
          .update({
            status: 'draft',
            published_at: null,
          })
          .eq('id', id)
          .select(
            'id, title, slug, body_html, excerpt, cover_image_url, status, author_id, published_at, created_at, updated_at',
          )
          .single();
        if (error) throw error;
        return json({ data });
      }

      case 'deleteBlogPost': {
        const id = String(payload.id ?? '');
        if (!id) return json({ error: 'id is required' }, 400);
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) throw error;
        return json({ data: { ok: true } });
      }

      case 'uploadBlogImage': {
        const kind = String(payload.kind ?? '').trim();
        if (kind !== 'cover' && kind !== 'inline') {
          return json({ error: 'kind must be cover or inline' }, 400);
        }
        const contentType = String(payload.contentType ?? '').trim().toLowerCase();
        if (!BLOG_IMAGE_MIME.has(contentType)) {
          return json(
            { error: 'Only JPEG, PNG, WebP, and GIF images are allowed' },
            400,
          );
        }
        const filename = String(payload.filename ?? 'image').trim() || 'image';
        const dataBase64 = String(payload.dataBase64 ?? '').trim();
        if (!dataBase64) return json({ error: 'dataBase64 is required' }, 400);

        let bytes: Uint8Array;
        try {
          const binary = atob(dataBase64.includes(',') ? dataBase64.split(',').pop()! : dataBase64);
          bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        } catch {
          return json({ error: 'Invalid image data' }, 400);
        }
        if (bytes.byteLength === 0) return json({ error: 'Empty image' }, 400);
        if (bytes.byteLength > BLOG_IMAGE_MAX_BYTES) {
          return json({ error: 'Image must be 5 MB or smaller' }, 400);
        }

        const ext =
          contentType === 'image/png'
            ? 'png'
            : contentType === 'image/webp'
              ? 'webp'
              : contentType === 'image/gif'
                ? 'gif'
                : 'jpg';
        const safeName = filename
          .toLowerCase()
          .replace(/[^a-z0-9._-]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 40);
        const path = `${kind === 'cover' ? 'covers' : 'inline'}/${authResult.actor.userId}/${crypto.randomUUID()}-${safeName || 'image'}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(BLOG_MEDIA_BUCKET)
          .upload(path, bytes, {
            contentType,
            upsert: false,
          });
        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from(BLOG_MEDIA_BUCKET).getPublicUrl(path);
        return json({ data: { url: publicData.publicUrl } });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Request failed';
    if (action === 'processBulkMailJob' && payload.job_id) {
      await supabase
        .from('bulk_mail_jobs')
        .update({ status: 'queued', error_summary: message.slice(0, 2000) })
        .eq('id', String(payload.job_id))
        .eq('status', 'processing');
    }
    return json({ error: message }, 500);
  }
});
