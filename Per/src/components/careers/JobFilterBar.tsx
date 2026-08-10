import type { CareerDepartment, CareerJob, EmploymentType, WorkplaceType } from '../../lib/careers';
import { formatEmploymentType, formatWorkplaceType } from '../../lib/careers';
import { AdminSelect } from '../admin/AdminSelect';

export type JobFilterState = {
  departmentId: string | null;
  workplaceType: WorkplaceType | null;
  employmentType: EmploymentType | null;
  location: string | null;
};

type Props = {
  departments: CareerDepartment[];
  jobs?: CareerJob[];
  value: JobFilterState;
  onChange: (next: JobFilterState) => void;
};

const EMPLOYMENT: (EmploymentType | null)[] = [
  null,
  'full_time',
  'part_time',
  'contract',
  'internship',
];

export function JobFilterBar({ departments, jobs = [], value, onChange }: Props) {
  const locations = Array.from(
    new Set(jobs.map((j) => j.location?.trim()).filter(Boolean) as string[]),
  ).sort();

  const locationValue =
    value.workplaceType === 'remote'
      ? '__remote__'
      : value.location
        ? `loc:${value.location}`
        : '';

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:flex-wrap lg:items-end lg:gap-x-10 lg:gap-y-5">
      <label className="block min-w-[12rem] text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
        Department
        <AdminSelect
          className="mt-2"
          aria-label="Department"
          value={value.departmentId ?? ''}
          onChange={(v) => onChange({ ...value, departmentId: v || null })}
          options={[
            { value: '', label: 'All departments' },
            ...departments.map((d) => ({ value: d.id, label: d.name })),
          ]}
        />
      </label>

      <label className="block min-w-[14rem] text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
        Location
        <AdminSelect
          className="mt-2"
          aria-label="Location"
          value={locationValue}
          onChange={(v) => {
            if (!v) {
              onChange({ ...value, location: null, workplaceType: null });
            } else if (v === '__remote__') {
              onChange({ ...value, workplaceType: 'remote', location: null });
            } else {
              onChange({
                ...value,
                location: v.replace(/^loc:/, ''),
                workplaceType: null,
              });
            }
          }}
          options={[
            { value: '', label: 'All locations / Remote' },
            { value: '__remote__', label: 'Remote' },
            ...locations.map((loc) => ({ value: `loc:${loc}`, label: loc })),
          ]}
        />
      </label>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b6b6b]">
          Employment type
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {EMPLOYMENT.map((type) => {
            const active = value.employmentType === type;
            const label = type ? formatEmploymentType(type) : 'All types';
            return (
              <button
                key={label}
                type="button"
                onClick={() => onChange({ ...value, employmentType: type })}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-accent text-white shadow-[0_2px_8px_rgba(254,163,39,0.3)]'
                    : 'border border-[#ddd] bg-white text-ink hover:border-ink/30'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="block min-w-[12rem] text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b6b6b] lg:sr-only">
        Workplace
        <AdminSelect
          className="mt-2 lg:hidden"
          aria-label="Workplace"
          value={value.workplaceType && value.workplaceType !== 'remote' ? value.workplaceType : ''}
          onChange={(v) =>
            onChange({
              ...value,
              workplaceType: (v || null) as WorkplaceType | null,
            })
          }
          options={[
            { value: '', label: 'All workplaces' },
            { value: 'hybrid', label: formatWorkplaceType('hybrid') },
            { value: 'onsite', label: formatWorkplaceType('onsite') },
          ]}
        />
      </label>
    </div>
  );
}
