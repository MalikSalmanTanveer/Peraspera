import { supabase, isSupabaseConfigured } from './supabase';
import {
  normalizeFormSchema,
  type FormFieldType,
  type FormSchema,
  type FormSchemaField,
} from './formSchema';

/** @deprecated Use FormFieldType */
export type CareerFieldType = FormFieldType;

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

/** @deprecated Use FormSchemaField */
export type CareerSchemaField = FormSchemaField;

/** @deprecated Schemas are embedded in job.form_schema */
export type CareerSchema = {
  id: string;
  name: string;
  kind: 'job' | 'application';
  created_at: string;
};

export type WorkplaceType = 'remote' | 'hybrid' | 'onsite';
export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship'
  | 'temporary';

export type JobStatus = 'draft' | 'published';

export type ApplicationStatus =
  | 'new'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export type CareerDepartment = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  deleted_at: string | null;
  created_at: string;
};

export type ContentBodyType = 'paragraph' | 'bullets';

export type ContentBullet = {
  html: string;
};

export type ContentSection = {
  id: string;
  heading: string;
  body_type: ContentBodyType;
  html?: string;
  bullets?: ContentBullet[];
};

export type CareerJob = {
  id: string;
  department_id: string;
  title: string;
  slug: string;
  location: string;
  workplace_type: WorkplaceType;
  employment_type: EmploymentType;
  /** Plain-text derived from content_sections (SEO); not edited in admin */
  description: string;
  content_sections: ContentSection[];
  status: JobStatus;
  form_schema: FormSchema;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  career_departments?: Pick<CareerDepartment, 'id' | 'name' | 'slug'> | null;
  /** @deprecated Legacy CMS shape — use title */
  job_schema_id?: string;
  /** @deprecated Legacy CMS shape — use form_schema */
  application_schema_id?: string;
  /** @deprecated Legacy CMS shape — use title/description fields */
  field_values?: Record<string, unknown>;
};

export type CultureSection = {
  title: string;
  body: string;
};

export type CultureValue = {
  title: string;
  description: string;
};

export type HiringStep = {
  title: string;
  description: string;
};

export type EmptyCta = {
  message: string;
  label: string;
  href: string;
};

export type CareerPageContent = {
  id: number;
  headline: string;
  sections: CultureSection[];
  values: CultureValue[];
  hiring_steps: HiringStep[];
  empty_cta: EmptyCta;
  updated_at: string;
  /** @deprecated Mapped from sections[0].body for legacy pages */
  body?: string;
  /** @deprecated Mapped from empty_cta.label */
  cta_label?: string | null;
  /** @deprecated Mapped from empty_cta.href */
  cta_href?: string | null;
};

export type CareerApplication = {
  id: string;
  job_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string | null;
  status: ApplicationStatus;
  answers: Record<string, unknown>;
  resume_path: string;
  is_duplicate: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CareerApplyInput = {
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  answers: Record<string, unknown>;
  resume: File;
};

export type CareerApplyResult = {
  id: string;
  created_at: string;
  is_duplicate: boolean;
};

export type JobFilters = {
  departmentId?: string | null;
  workplaceType?: WorkplaceType | null;
  employmentType?: EmploymentType | null;
  location?: string | null;
};

function notConfiguredError() {
  return 'Careers is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
}

function getFunctionsBase(): string | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (!url) return null;
  return `${url.replace(/\/$/, '')}/functions/v1`;
}

function getAnonKey(): string | null {
  return (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? null;
}

export async function fetchCareerPageContent(): Promise<{
  data: CareerPageContent | null;
  error: string | null;
}> {
  if (!supabase) return { data: null, error: notConfiguredError() };
  const { data, error } = await supabase
    .from('career_page_content')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  const content = data as CareerPageContent | null;
  if (!content) return { data: null, error: null };
  return {
    data: {
      ...content,
      body: content.sections?.[0]?.body ?? '',
      cta_label: content.empty_cta?.label ?? null,
      cta_href: content.empty_cta?.href ?? null,
    },
    error: null,
  };
}

export async function fetchCareerDepartments(): Promise<{
  data: CareerDepartment[];
  error: string | null;
}> {
  if (!supabase) return { data: [], error: notConfiguredError() };
  const { data, error } = await supabase
    .from('career_departments')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });
  if (error) return { data: [], error: error.message };
  return { data: (data as CareerDepartment[]) ?? [], error: null };
}

export function jobDisplayTitle(job: CareerJob): string {
  return job.title?.trim() || job.slug;
}

/** @deprecated Use getFormFields(job) — schema id is no longer separate */
export async function fetchSchemaFields(schemaId?: string | null): Promise<{
  data: CareerSchemaField[];
  error: string | null;
}> {
  if (!schemaId) return { data: [], error: null };
  return { data: [], error: null };
}

export async function fetchPublishedJobs(
  filtersOrDepartmentId?: JobFilters | string | null,
): Promise<{
  data: CareerJob[];
  error: string | null;
}> {
  if (!supabase) return { data: [], error: notConfiguredError() };

  const filters: JobFilters =
    typeof filtersOrDepartmentId === 'string'
      ? { departmentId: filtersOrDepartmentId }
      : filtersOrDepartmentId ?? {};

  let query = supabase
    .from('career_jobs')
    .select('*, career_departments(id, name, slug)')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });

  if (filters.departmentId) query = query.eq('department_id', filters.departmentId);
  if (filters.workplaceType) query = query.eq('workplace_type', filters.workplaceType);
  if (filters.employmentType) query = query.eq('employment_type', filters.employmentType);
  if (filters.location) query = query.ilike('location', `%${filters.location}%`);

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };
  return { data: (data as CareerJob[]) ?? [], error: null };
}

export async function fetchPublishedJobBySlug(slug: string): Promise<{
  data: CareerJob | null;
  error: string | null;
}> {
  if (!supabase) return { data: null, error: notConfiguredError() };
  const { data, error } = await supabase
    .from('career_jobs')
    .select('*, career_departments(id, name, slug)')
    .eq('status', 'published')
    .is('deleted_at', null)
    .eq('slug', slug)
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data: data as CareerJob | null, error: null };
}

export function getFormFields(job: CareerJob): FormSchemaField[] {
  return normalizeFormSchema(job.form_schema).fields;
}

const MAX_RESUME_BYTES = 10 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_RESUME_EXT = /\.(pdf|doc|docx)$/i;

export function validateResumeFile(file: File): string | null {
  if (file.size > MAX_RESUME_BYTES) return 'Resume must be 10 MB or smaller.';
  const extOk = ALLOWED_RESUME_EXT.test(file.name);
  const mimeOk = file.type ? ALLOWED_RESUME_TYPES.has(file.type) : extOk;
  if (!extOk && !mimeOk) return 'Resume must be PDF, DOC, or DOCX.';
  return null;
}

/** @deprecated Resume uploads go through career-apply Edge Function */
export async function uploadCareerApplicationFile(
  _jobId: string,
  _fieldKey: string,
  _file: File,
): Promise<{ path: string | null; error: string | null }> {
  return {
    path: null,
    error: 'Use submitCareerApplication with a resume File — direct storage upload is disabled.',
  };
}

export async function submitCareerApplication(
  inputOrJobId: CareerApplyInput | string,
  legacyAnswers?: Record<string, unknown>,
): Promise<
  | { data: CareerApplyResult | null; error: string | null }
  | { error: string | null }
> {
  if (typeof inputOrJobId === 'string') {
    void legacyAnswers;
    return {
      error:
        'Legacy apply removed — use submitCareerApplication({ jobId, candidateName, candidateEmail, answers, resume })',
    };
  }

  const input = inputOrJobId;
  const base = getFunctionsBase();
  const anon = getAnonKey();
  if (!base || !anon) return { data: null, error: notConfiguredError() };

  const resumeError = validateResumeFile(input.resume);
  if (resumeError) return { data: null, error: resumeError };

  const form = new FormData();
  form.set('job_id', input.jobId);
  form.set('candidate_name', input.candidateName);
  form.set('candidate_email', input.candidateEmail);
  if (input.candidatePhone) form.set('candidate_phone', input.candidatePhone);
  form.set('answers', JSON.stringify(input.answers ?? {}));
  form.set('resume', input.resume);

  const res = await fetch(`${base}/career-apply`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${anon}`,
      apikey: anon,
    },
    body: form,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { data: null, error: (body as { error?: string }).error ?? 'Application failed' };
  }

  return {
    data: {
      id: (body as { id: string }).id,
      created_at: (body as { created_at: string }).created_at,
      is_duplicate: Boolean((body as { is_duplicate?: boolean }).is_duplicate),
    },
    error: null,
  };
}


export function formatWorkplaceType(value: WorkplaceType): string {
  switch (value) {
    case 'remote':
      return 'Remote';
    case 'hybrid':
      return 'Hybrid';
    case 'onsite':
      return 'On-site';
    default:
      return value;
  }
}

export function formatEmploymentType(value: EmploymentType): string {
  switch (value) {
    case 'full_time':
      return 'Full-time';
    case 'part_time':
      return 'Part-time';
    case 'contract':
      return 'Contract';
    case 'internship':
      return 'Internship';
    case 'temporary':
      return 'Temporary';
    default:
      return value;
  }
}

export { isSupabaseConfigured };
