import { useEffect, useState, type FormEvent } from 'react';
import { AdminSelect } from '../../components/admin/AdminSelect';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { FormBuilder } from '../../components/admin/FormBuilder';
import { JobSectionEditor } from '../../components/admin/JobSectionEditor';
import { Toast, type ToastState } from '../../components/admin/Toast';
import {
  deleteJob,
  fetchAdminDepartments,
  fetchAdminJob,
  fetchAdminJobs,
  publishJob,
  unpublishJob,
  upsertJob,
  updateJobFormSchema,
} from '../../lib/adminApi';
import {
  formatEmploymentType,
  formatWorkplaceType,
  jobDisplayTitle,
  type CareerDepartment,
  type CareerJob,
  type ContentSection,
  type EmploymentType,
  normalizeFormSchema,
  validateFormSchema,
  type FormSchema,
  type WorkplaceType,
} from '../../lib/careers';
import { validateContentSections } from '../../lib/contentSections';

const EMPTY_SCHEMA: FormSchema = { layout: 'flat', sections: [], fields: [] };

type EditorState = {
  id?: string;
  department_id: string;
  title: string;
  slug: string;
  location: string;
  workplace_type: WorkplaceType;
  employment_type: EmploymentType;
  content_sections: ContentSection[];
  status: 'draft' | 'published';
  form_schema: FormSchema;
};

function blankEditor(departmentId = ''): EditorState {
  return {
    department_id: departmentId,
    title: '',
    slug: '',
    location: '',
    workplace_type: 'onsite',
    employment_type: 'full_time',
    content_sections: [],
    status: 'draft',
    form_schema: EMPTY_SCHEMA,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function AdminJobsPage() {
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [departments, setDepartments] = useState<CareerDepartment[]>([]);
  const [editing, setEditing] = useState<EditorState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const load = async () => {
    setLoading(true);
    const [jobsRes, deptRes] = await Promise.all([
      fetchAdminJobs(),
      fetchAdminDepartments(),
    ]);
    setLoading(false);
    if (jobsRes.error || deptRes.error) {
      setError(jobsRes.error || deptRes.error);
      return;
    }
    setError(null);
    setJobs(jobsRes.data ?? []);
    setDepartments(deptRes.data ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const openCreate = () => {
    setEditing(blankEditor(departments[0]?.id ?? ''));
  };

  const openEdit = async (id: string) => {
    const res = await fetchAdminJob(id);
    if (res.error || !res.data) {
      setError(res.error ?? 'Could not load job');
      return;
    }
    const job = res.data;
    setEditing({
      id: job.id,
      department_id: job.department_id,
      title: job.title,
      slug: job.slug,
      location: job.location ?? '',
      workplace_type: job.workplace_type,
      employment_type: job.employment_type,
      content_sections: job.content_sections ?? [],
      status: job.status,
      form_schema: normalizeFormSchema(job.form_schema ?? EMPTY_SCHEMA),
    });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    if (!editing.department_id || !editing.title.trim()) {
      setError('Department and title are required.');
      return;
    }
    const sectionsError = validateContentSections(editing.content_sections);
    if (sectionsError) {
      setError(sectionsError);
      return;
    }
    const schema = normalizeFormSchema(editing.form_schema);
    const formSchemaError = validateFormSchema(schema);
    if (formSchemaError) {
      setToast({ message: formSchemaError, tone: 'error' });
      return;
    }
    setSaving(true);
    const res = await upsertJob({
      id: editing.id,
      department_id: editing.department_id,
      title: editing.title.trim(),
      slug: editing.slug.trim() || slugify(editing.title),
      location: editing.location,
      workplace_type: editing.workplace_type,
      employment_type: editing.employment_type,
      content_sections: editing.content_sections,
      status: editing.status,
      form_schema: schema,
    });
    if (res.error || !res.data) {
      setSaving(false);
      setError(res.error ?? 'Save failed');
      return;
    }

    if (editing.id) {
      const schemaRes = await updateJobFormSchema(res.data.id, schema);
      if (schemaRes.error) {
        setSaving(false);
        setError(schemaRes.error);
        return;
      }
    }

    setSaving(false);
    setToast({ message: 'Job saved', tone: 'success' });
    setEditing(null);
    await load();
  };

  const togglePublish = async (job: CareerJob) => {
    const res =
      job.status === 'published' ? await unpublishJob(job.id) : await publishJob(job.id);
    if (res.error) {
      setError(res.error);
      return;
    }
    await load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[1.75rem] font-extrabold tracking-tight text-ink">
            Jobs
          </h1>
          <p className="mt-1 text-sm text-[#6b6b6b]">Manage roles, forms, and publish status.</p>
        </div>
        {!editing ? (
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-ink transition hover:brightness-95"
          >
            + Create job
          </button>
        ) : null}
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {editing ? (
        <form onSubmit={onSubmit} className="mt-6 grid gap-5">
          <div className="grid gap-4 rounded-2xl border border-border p-4 md:grid-cols-2">
            <label className="text-sm font-medium text-ink">
              Title
              <input
                required
                value={editing.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setEditing((prev) =>
                    prev
                      ? {
                          ...prev,
                          title,
                          slug: prev.id ? prev.slug : slugify(title),
                        }
                      : prev,
                  );
                }}
                className="mt-1.5 w-full rounded-xl border border-border bg-paper px-3 py-2.5 outline-none focus:border-accent"
              />
            </label>
            <label className="text-sm font-medium text-ink">
              Slug
              <input
                value={editing.slug}
                onChange={(e) =>
                  setEditing((prev) => (prev ? { ...prev, slug: e.target.value } : prev))
                }
                className="mt-1.5 w-full rounded-xl border border-border bg-paper px-3 py-2.5 outline-none focus:border-accent"
              />
            </label>
            <label className="text-sm font-medium text-ink">
              Department
              <AdminSelect
                className="mt-1.5"
                aria-label="Department"
                value={editing.department_id}
                onChange={(v) =>
                  setEditing((prev) => (prev ? { ...prev, department_id: v } : prev))
                }
                options={[
                  { value: '', label: 'Select…' },
                  ...departments.map((d) => ({ value: d.id, label: d.name })),
                ]}
              />
            </label>
            <label className="text-sm font-medium text-ink">
              Location
              <input
                value={editing.location}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, location: e.target.value } : prev,
                  )
                }
                className="admin-input mt-1.5 w-full"
              />
            </label>
            <label className="text-sm font-medium text-ink">
              Workplace
              <AdminSelect
                className="mt-1.5"
                aria-label="Workplace"
                value={editing.workplace_type}
                onChange={(v) =>
                  setEditing((prev) =>
                    prev ? { ...prev, workplace_type: v as WorkplaceType } : prev,
                  )
                }
                options={(['remote', 'hybrid', 'onsite'] as WorkplaceType[]).map((w) => ({
                  value: w,
                  label: formatWorkplaceType(w),
                }))}
              />
            </label>
            <label className="text-sm font-medium text-ink">
              Employment type
              <AdminSelect
                className="mt-1.5"
                aria-label="Employment type"
                value={editing.employment_type}
                onChange={(v) =>
                  setEditing((prev) =>
                    prev ? { ...prev, employment_type: v as EmploymentType } : prev,
                  )
                }
                options={(
                  [
                    'full_time',
                    'part_time',
                    'contract',
                    'internship',
                    'temporary',
                  ] as EmploymentType[]
                ).map((t) => ({
                  value: t,
                  label: formatEmploymentType(t),
                }))}
              />
            </label>
            <div className="md:col-span-2">
              <JobSectionEditor
                value={editing.content_sections}
                onChange={(content_sections) =>
                  setEditing((prev) => (prev ? { ...prev, content_sections } : prev))
                }
              />
            </div>
            <label className="text-sm font-medium text-ink">
              Status
              <AdminSelect
                className="mt-1.5"
                aria-label="Job status"
                value={editing.status}
                onChange={(v) =>
                  setEditing((prev) =>
                    prev ? { ...prev, status: v as 'draft' | 'published' } : prev,
                  )
                }
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'published', label: 'Published' },
                ]}
              />
            </label>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold text-ink">Application form</h3>
            <p className="mt-1 text-sm text-muted">
              Resume upload is always required separately from these fields.
            </p>
            <div className="mt-4">
              <FormBuilder
                value={editing.form_schema}
                onChange={(form_schema) =>
                  setEditing((prev) => (prev ? { ...prev, form_schema } : prev))
                }
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-pill bg-accent px-5 py-3 font-semibold text-ink disabled:opacity-60"
            >
              {saving ? 'Saving…' : editing.id ? 'Update job' : 'Create job'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-pill border border-border px-5 py-3 font-semibold text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="admin-panel mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="admin-table-head">
              <tr>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-muted">
                    Loading…
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-muted">
                    No jobs yet. Create your first role.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-accent/[0.03]"
                  >
                    <td className="px-5 py-3.5 font-semibold text-ink">
                      {jobDisplayTitle(job)}
                      <p className="text-xs font-normal text-muted">/careers/{job.slug}</p>
                    </td>
                    <td className="px-5 py-3.5 text-muted">
                      {job.career_departments?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 text-muted">{job.location || '—'}</td>
                    <td className="px-5 py-3.5 text-muted">
                      {formatWorkplaceType(job.workplace_type)} ·{' '}
                      {formatEmploymentType(job.employment_type)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-pill border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                          job.status === 'published'
                            ? 'border-ink bg-ink text-accent'
                            : 'border-border bg-pill-bg text-muted'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          className="rounded-xl border border-border px-2.5 py-1 text-xs font-semibold text-ink transition-colors hover:border-accent/40 hover:bg-paper"
                          onClick={() => void openEdit(job.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-xl border border-border px-2.5 py-1 text-xs font-semibold text-ink transition-colors hover:border-accent/40 hover:bg-paper"
                          onClick={() => void togglePublish(job)}
                        >
                          {job.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          type="button"
                          className="rounded-xl border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                          onClick={() => setDeleteId(job.id)}
                        >
                          Hide
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Hide job?"
        body="The job will be unpublished and hidden from lists. Data stays in the database."
        confirmLabel="Hide"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;
          void (async () => {
            const res = await deleteJob(deleteId);
            setDeleteId(null);
            if (res.error) setError(res.error);
            else await load();
          })();
        }}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
