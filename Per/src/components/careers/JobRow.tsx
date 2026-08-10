import { Link } from 'react-router-dom';
import {
  formatEmploymentType,
  formatWorkplaceType,
  jobDisplayTitle,
  type CareerJob,
} from '../../lib/careers';

type Props = {
  job: CareerJob;
};

export function JobRow({ job }: Props) {
  const locationLabel =
    job.workplace_type === 'remote'
      ? 'Remote'
      : job.location || formatWorkplaceType(job.workplace_type);

  return (
    <Link
      to={`/careers/${job.slug}`}
      className="group grid grid-cols-1 items-center gap-2 border-b border-[#e8e8e8] bg-white px-5 py-5 transition hover:bg-[#fafafa] md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto] md:gap-4 md:px-6 md:py-5 first:rounded-t-xl last:rounded-b-xl last:border-b-0"
    >
      <h3 className="font-display text-base font-bold tracking-tight text-ink md:text-[1.05rem]">
        {jobDisplayTitle(job)}
      </h3>
      <p className="text-sm text-[#6b6b6b]">{job.career_departments?.name ?? 'General'}</p>
      <p className="text-sm text-[#6b6b6b]">{locationLabel}</p>
      <span className="inline-flex w-fit rounded-full bg-[#f0f0f0] px-3 py-1 text-xs font-semibold text-[#444]">
        {formatEmploymentType(job.employment_type)}
      </span>
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition group-hover:gap-2">
        View role <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
