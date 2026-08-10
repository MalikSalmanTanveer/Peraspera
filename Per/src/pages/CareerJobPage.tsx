import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Building2, MapPin } from 'lucide-react';
import { Container } from '../components/Container';
import { DynamicApplicationForm } from '../components/DynamicApplicationForm';
import { JobDescription } from '../components/careers/JobDescription';
import { Reveal } from '../components/Reveal';
import {
  fetchPublishedJobBySlug,
  formatEmploymentType,
  formatWorkplaceType,
  jobDisplayTitle,
  type CareerJob,
} from '../lib/careers';

export function CareerJobPage() {
  const { slug = '' } = useParams();
  const [job, setJob] = useState<CareerJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const jobRes = await fetchPublishedJobBySlug(slug);
      if (cancelled) return;
      if (jobRes.error || !jobRes.data) {
        setError(jobRes.error ?? 'This role is not available');
        setJob(null);
        setLoading(false);
        return;
      }
      setJob(jobRes.data);
      setError(null);
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#f7f7f5] px-nav-x py-32 text-ink max-md:px-nav-x-mobile">
        <Container>
          <p className="text-[#6b6b6b]">Loading role…</p>
        </Container>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-[#f7f7f5] px-nav-x pb-24 pt-[120px] text-ink max-md:px-nav-x-mobile">
        <Container>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            This role is not available
          </h1>
          <p className="mt-3 max-w-lg text-[#6b6b6b]">
            It may be closed or unpublished. Browse open roles instead.
          </p>
          <Link to="/careers" className="btn-yellow mt-8 inline-flex">
            Back to careers
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] text-ink">
      <section className="px-nav-x pb-section-y pt-[120px] max-md:px-nav-x-mobile max-md:pb-section-y-mobile max-md:pt-[108px]">
        <Container>
          <Link
            to="/careers#open-roles"
            className="inline-flex items-center gap-2 rounded-full border border-[#e0e0e0] bg-white px-3.5 py-2 text-sm font-semibold text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:border-ink/20 hover:bg-[#fafafa]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            Back to all openings
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
            <Reveal>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight">
                {jobDisplayTitle(job)}
              </h1>
              <div className="mt-5 flex flex-wrap gap-2">
                {job.location ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ddd] bg-white px-3.5 py-1.5 text-xs font-semibold text-ink">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                    {job.location}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ddd] bg-white px-3.5 py-1.5 text-xs font-semibold text-ink">
                  <Briefcase className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  {formatEmploymentType(job.employment_type)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ddd] bg-white px-3.5 py-1.5 text-xs font-semibold text-ink">
                  <Building2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  {formatWorkplaceType(job.workplace_type)}
                </span>
              </div>

              <div className="mt-12 border-t border-[#e5e5e5] pt-10">
                <JobDescription sections={job.content_sections ?? []} />
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="lg:sticky lg:top-28">
                <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] md:p-8">
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    Apply for this position
                  </h2>
                  <p className="mt-2 text-sm text-[#6b6b6b]">
                    Please fill in the form below. Fields marked with * are required.
                  </p>
                  <div className="mt-8">
                    <DynamicApplicationForm job={job} />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
}
