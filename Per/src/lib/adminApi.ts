import type {
  ApplicationStatus,
  CareerApplication,
  CareerDepartment,
  CareerJob,
  CareerPageContent,
  ContentSection,
  EmploymentType,
  FormSchema,
  JobStatus,
  WorkplaceType,
} from './careers';
import { getAdminAccessToken } from './adminAuth';

const SESSION_KEY = 'peraspera-admin-session';

export type AdminSession = {
  token: string;
  expiresAt: string;
};

export type OverviewCounts = {
  departments: number;
  jobs: number;
  published_jobs: number;
  applications: number;
  new_applications: number;
  email_templates: number;
};

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ApplicationEmail = {
  id: string;
  application_id: string;
  subject: string;
  body: string;
  sent_at: string;
  created_at: string;
};

export type ApplicationDetail = CareerApplication & {
  career_jobs?: {
    id: string;
    title: string;
    slug: string;
    form_schema?: FormSchema;
    career_departments?: { name: string; slug: string } | null;
  } | null;
  emails?: ApplicationEmail[];
};

export type AdminAction =
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
  /** @deprecated Use getCulture / updateCulture */
  | 'getPageContent'
  | 'upsertPageContent'
  /** @deprecated Schemas replaced by job.form_schema */
  | 'listSchemas'
  | 'upsertSchema'
  | 'deleteSchema'
  | 'listFields'
  | 'upsertField'
  | 'deleteField'
  /** @deprecated Use signedResumeUrl */
  | 'signedFileUrl';

const LEGACY_SCHEMA_ACTIONS = new Set<AdminAction>([
  'listSchemas',
  'upsertSchema',
  'deleteSchema',
  'listFields',
  'upsertField',
  'deleteField',
]);

function getFunctionsBase(): string | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (!url) return null;
  return `${url.replace(/\/$/, '')}/functions/v1`;
}

function getAnonKey(): string | null {
  return (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? null;
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed.token || !parsed.expiresAt) return null;
    if (new Date(parsed.expiresAt).getTime() < Date.now()) {
      clearAdminSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setAdminSession(session: AdminSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminSession());
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<{ error: string | null }> {
  const base = getFunctionsBase();
  const anon = getAnonKey();
  if (!base || !anon) {
    return { error: 'Supabase is not configured.' };
  }

  const res = await fetch(`${base}/admin-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${anon}`,
      apikey: anon,
    },
    body: JSON.stringify({ email, password }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { error: (body as { error?: string }).error ?? 'Login failed' };
  }

  const token = (body as { token?: string }).token;
  const expiresAt = (body as { expiresAt?: string }).expiresAt;
  if (!token || !expiresAt) return { error: 'Invalid login response' };

  setAdminSession({ token, expiresAt });
  return { error: null };
}

export async function adminApi<T = unknown>(
  action: AdminAction,
  payload?: Record<string, unknown>,
): Promise<{ data: T | null; error: string | null }> {
  const base = getFunctionsBase();
  const anon = getAnonKey();
  const accessToken = await getAdminAccessToken();
  if (!base || !anon) return { data: null, error: 'Supabase is not configured.' };
  if (!accessToken) return { data: null, error: 'Not authenticated' };

  if (LEGACY_SCHEMA_ACTIONS.has(action)) {
    return {
      data: null,
      error: 'Legacy schema CMS removed — edit form_schema on each job instead.',
    };
  }

  if (action === 'getPageContent') {
    return adminApi<T>('getCulture', payload);
  }

  if (action === 'upsertPageContent') {
    const mapped = {
      headline: payload?.headline,
      sections: payload?.body
        ? [{ title: 'About', body: String(payload.body) }]
        : payload?.sections,
      empty_cta: {
        label: payload?.cta_label ? String(payload.cta_label) : '',
        href: payload?.cta_href ? String(payload.cta_href) : '',
        message: '',
      },
    };
    return adminApi<T>('updateCulture', mapped);
  }

  if (action === 'signedFileUrl') {
    return adminApi<T>('signedResumeUrl', {
      application_id: payload?.application_id,
      path: payload?.path,
    });
  }

  const res = await fetch(`${base}/admin-api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      apikey: anon,
    },
    body: JSON.stringify({ action, payload }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      clearAdminSession();
      const { signOutAdmin } = await import('./adminAuth');
      await signOutAdmin();
    }
    return { data: null, error: (body as { error?: string }).error ?? 'Request failed' };
  }

  if ('data' in (body as object)) {
    return { data: (body as { data: T }).data, error: null };
  }
  return { data: body as T, error: null };
}

// Convenience wrappers

export async function fetchOverviewCounts() {
  return adminApi<OverviewCounts>('overviewCounts');
}

export async function fetchAdminDepartments(includeDeleted = false) {
  return adminApi<CareerDepartment[]>('listDepartments', { include_deleted: includeDeleted });
}

export async function upsertDepartment(input: {
  id?: string;
  name: string;
  slug?: string;
  sort_order?: number;
}) {
  return adminApi<CareerDepartment>('upsertDepartment', input);
}

export async function deleteDepartment(id: string) {
  return adminApi<{ ok: boolean }>('deleteDepartment', { id });
}

export async function fetchAdminJobs(includeDeleted = false) {
  return adminApi<CareerJob[]>('listJobs', { include_deleted: includeDeleted });
}

export async function fetchAdminJob(id: string) {
  return adminApi<CareerJob>('getJob', { id });
}

export async function upsertJob(input: {
  id?: string;
  department_id: string;
  title: string;
  slug?: string;
  location?: string;
  workplace_type?: WorkplaceType;
  employment_type?: EmploymentType;
  content_sections: ContentSection[];
  status?: JobStatus;
  form_schema?: FormSchema;
}) {
  return adminApi<CareerJob>('upsertJob', input);
}

export async function publishJob(id: string) {
  return adminApi<CareerJob>('publishJob', { id });
}

export async function unpublishJob(id: string) {
  return adminApi<CareerJob>('unpublishJob', { id });
}

export async function deleteJob(id: string) {
  return adminApi<{ ok: boolean }>('deleteJob', { id });
}

export async function updateJobFormSchema(id: string, form_schema: FormSchema) {
  return adminApi<CareerJob>('updateFormSchema', { id, form_schema });
}

export async function fetchCulture() {
  return adminApi<CareerPageContent>('getCulture');
}

export async function updateCulture(input: Partial<CareerPageContent>) {
  return adminApi<CareerPageContent>('updateCulture', input);
}

export async function fetchEmailTemplates(includeDeleted = false) {
  return adminApi<EmailTemplate[]>('listEmailTemplates', { include_deleted: includeDeleted });
}

export async function upsertEmailTemplate(input: {
  id?: string;
  name: string;
  subject: string;
  body: string;
}) {
  return adminApi<EmailTemplate>('upsertEmailTemplate', input);
}

export async function deleteEmailTemplate(id: string) {
  return adminApi<{ ok: boolean }>('deleteEmailTemplate', { id });
}

export async function fetchApplications(filters?: {
  job_id?: string;
  status?: ApplicationStatus;
  include_deleted?: boolean;
}) {
  return adminApi<CareerApplication[]>('listApplications', filters ?? {});
}

export async function fetchApplication(id: string) {
  return adminApi<ApplicationDetail>('getApplication', { id });
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  return adminApi<CareerApplication>('updateApplicationStatus', { id, status });
}

export async function deleteApplication(id: string) {
  return adminApi<{ ok: boolean }>('deleteApplication', { id });
}

export async function getSignedResumeUrl(applicationId: string) {
  return adminApi<{ signedUrl: string }>('signedResumeUrl', { application_id: applicationId });
}

export async function sendApplicationMail(input: {
  application_id: string;
  subject: string;
  body: string;
}) {
  return adminApi<{ email: ApplicationEmail; resend_id?: string }>('sendMail', input);
}

export async function fetchApplicationEmails(applicationId: string) {
  return adminApi<ApplicationEmail[]>('listApplicationEmails', {
    application_id: applicationId,
  });
}

export type AdminUserRow = {
  id: string;
  username: string;
  role: import('./adminRoles').AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  email: string;
};

export async function fetchAdminUsers() {
  return adminApi<AdminUserRow[]>('listUsers');
}

export async function inviteAdminUser(input: {
  email: string;
  username: string;
  role: import('./adminRoles').AdminRole;
}) {
  return adminApi<{ id?: string; email: string; username: string; role: string }>('inviteUser', {
    ...input,
    redirect_to: `${window.location.origin}/admin/set-password`,
  });
}

export async function updateAdminUserRole(
  userId: string,
  role: import('./adminRoles').AdminRole,
) {
  return adminApi<AdminUserRow>('updateUserRole', { user_id: userId, role });
}

export async function setAdminUserActive(userId: string, isActive: boolean) {
  return adminApi<AdminUserRow>('setUserActive', { user_id: userId, is_active: isActive });
}

export async function resendAdminInvite(email: string) {
  return adminApi<{ ok: boolean }>('resendInvite', {
    email,
    redirect_to: `${window.location.origin}/admin/set-password`,
  });
}

export async function fetchAdminBlogPosts() {
  return adminApi<import('./blog').BlogPost[]>('listBlogPosts');
}

export async function fetchAdminBlogPost(id: string) {
  return adminApi<import('./blog').BlogPost>('getBlogPost', { id });
}

export async function upsertAdminBlogPost(input: {
  id?: string;
  title: string;
  slug: string;
  body_html: string;
  excerpt?: string;
  cover_image_url?: string | null;
}) {
  return adminApi<import('./blog').BlogPost>('upsertBlogPost', input);
}

export async function publishAdminBlogPost(id: string) {
  return adminApi<import('./blog').BlogPost>('publishBlogPost', { id });
}

export async function unpublishAdminBlogPost(id: string) {
  return adminApi<import('./blog').BlogPost>('unpublishBlogPost', { id });
}

export async function deleteAdminBlogPost(id: string) {
  return adminApi<{ ok: boolean }>('deleteBlogPost', { id });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      const base64 = result.includes(',') ? result.split(',')[1] ?? '' : result;
      if (!base64) reject(new Error('Could not read file'));
      else resolve(base64);
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadAdminBlogImage(file: File, kind: 'cover' | 'inline') {
  const dataBase64 = await fileToBase64(file);
  return adminApi<{ url: string }>('uploadBlogImage', {
    kind,
    filename: file.name,
    contentType: file.type || 'image/jpeg',
    dataBase64,
  });
}
