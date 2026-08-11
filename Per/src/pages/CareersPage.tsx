import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { InkParticleBackground } from '../components/InkParticleBackground';
import { Reveal } from '../components/Reveal';
import { JobFilterBar, type JobFilterState } from '../components/careers/JobFilterBar';
import { JobRow } from '../components/careers/JobRow';
import {
  fetchCareerDepartments,
  fetchCareerPageContent,
  fetchPublishedJobs,
  type CareerDepartment,
  type CareerJob,
  type CareerPageContent,
} from '../lib/careers';

const DEFAULT_FILTERS: JobFilterState = {
  departmentId: null,
  workplaceType: null,
  employmentType: null,
  location: null,
};

/** Render headline with optional accent on a middle word (mockup: "matters.") */
function HeroHeadline({ text }: { text: string }) {
  const trimmed = text.trim() || 'Build what matters. Together.';
  // Prefer "word." pattern for accent (e.g. matters.)
  const accentMatch = trimmed.match(/^(.*?)\b(\w+\.)(\s+.*)?$/);
  if (accentMatch && accentMatch[1].trim() && accentMatch[2]) {
    return (
      <>
        <span className="text-white">{accentMatch[1]}</span>
        <span className="text-accent">{accentMatch[2]}</span>
        {accentMatch[3] ? <span className="text-white">{accentMatch[3]}</span> : null}
      </>
    );
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 3) {
    const mid = Math.floor(parts.length / 2);
    return (
      <>
        <span className="text-white">{parts.slice(0, mid).join(' ')} </span>
        <span className="text-accent">{parts[mid]}</span>
        <span className="text-white"> {parts.slice(mid + 1).join(' ')}</span>
      </>
    );
  }
  return <span className="text-white">{trimmed}</span>;
}

export function CareersPage() {
  const [content, setContent] = useState<CareerPageContent | null>(null);
  const [departments, setDepartments] = useState<CareerDepartment[]>([]);
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [filters, setFilters] = useState<JobFilterState>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadContent() {
      const [pageRes, deptRes] = await Promise.all([
        fetchCareerPageContent(),
        fetchCareerDepartments(),
      ]);
      if (cancelled) return;
      if (pageRes.error || deptRes.error) {
        setError(pageRes.error || deptRes.error);
      }
      setContent(pageRes.data);
      setDepartments(deptRes.data);
    }
    void loadContent();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadJobs() {
      setLoading(true);
      const jobsRes = await fetchPublishedJobs({
        departmentId: filters.departmentId,
        workplaceType: filters.workplaceType,
        employmentType: filters.employmentType,
        location: filters.location,
      });
      if (cancelled) return;
      if (jobsRes.error) setError(jobsRes.error);
      else setError(null);
      setJobs(jobsRes.data);
      setLoading(false);
    }
    void loadJobs();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const sections = content?.sections ?? [];
  const values = content?.values ?? [];
  const hiringSteps = content?.hiring_steps ?? [];
  const emptyCta = content?.empty_cta;
  const headline =
    !content?.headline || content.headline === 'Why join Peraspera'
      ? 'Build what matters. Together.'
      : content.headline;
  const supportCopy =
    sections[0]?.body ||
    'Join Peraspera and shape meaningful work with a talented, ambitious team.';

  return (
    <div className="bg-ink text-white">
      {/* UI-01 — dark culture hero */}
      <section className="relative min-h-[85svh] overflow-hidden px-nav-x pt-[120px] pb-24 max-md:px-nav-x-mobile max-md:pb-16">
        <InkParticleBackground className="opacity-70" />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_bottom_right,rgba(254,163,39,0.22)_0%,transparent_55%)]"
          aria-hidden="true"
        />
        <Container className="relative z-[1] flex min-h-[calc(85svh-8rem)] flex-col justify-center">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="text-[0.6875rem] font-extrabold uppercase tracking-[0.22em] text-accent">
                Careers
              </span>
              <span className="h-px max-w-[10rem] flex-1 bg-accent/70" aria-hidden="true" />
            </div>
            <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(2.75rem,7vw,5.25rem)] font-extrabold leading-[0.98] tracking-tighter">
              <HeroHeadline text={headline} />
            </h1>
            <p className="mt-6 max-w-xl text-base leading-[1.7] text-white/68 md:text-lg">
              {supportCopy}
            </p>
            <div className="mt-10">
              <Button href="#open-roles" variant="yellow" className="!px-10 !py-4">
                See open roles ↗
              </Button>
            </div>
          </Reveal>

          {(values.length > 0 || hiringSteps.length > 0 || sections.length > 1) && (
            <div className="mt-20 grid gap-14 border-t border-white/10 pt-16 lg:grid-cols-2">
              {values.length ? (
                <Reveal delay={0.06}>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
                    Values
                  </p>
                  <ul className="mt-6 grid gap-6">
                    {values.map((value, i) => (
                      <li key={`${value.title}-${i}`}>
                        <h2 className="font-display text-xl font-bold">{value.title}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                          {value.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}
              {hiringSteps.length ? (
                <Reveal delay={0.1}>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
                    How we hire
                  </p>
                  <ol className="mt-6 grid gap-5">
                    {hiringSteps.map((step, i) => (
                      <li key={`${step.title}-${i}`} className="flex gap-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/40 text-xs font-bold text-accent">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h2 className="font-display text-lg font-bold">{step.title}</h2>
                          <p className="mt-1 text-sm text-white/65">{step.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Reveal>
              ) : null}
              {!values.length && !hiringSteps.length && sections.length > 1
                ? sections.slice(1).map((section, i) => (
                    <div key={`${section.title}-${i}`}>
                      <h2 className="font-display text-xl font-bold">{section.title}</h2>
                      <p className="mt-3 whitespace-pre-wrap text-sm text-white/65">
                        {section.body}
                      </p>
                    </div>
                  ))
                : null}
            </div>
          )}
        </Container>
      </section>

      {/* UI-02 — light jobs band */}
      <section
        id="open-roles"
        className="scroll-mt-24 bg-white px-nav-x py-section-y text-ink max-md:px-nav-x-mobile max-md:py-section-y-mobile"
      >
        <Container>
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight text-ink">
              Open roles
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#6b6b6b] md:text-lg">
              We’re always looking for thoughtful builders, creative problem-solvers, and kind
              collaborators.
            </p>
          </div>

          <div className="mt-10">
            <JobFilterBar departments={departments} jobs={jobs} value={filters} onChange={setFilters} />
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="overflow-hidden rounded-xl border border-[#e8e8e8]" aria-busy="true">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-[4.5rem] animate-pulse border-b border-[#e8e8e8] bg-[#fafafa] last:border-0" />
                ))}
              </div>
            ) : error ? (
              <p className="rounded-xl border border-[#e8e8e8] bg-white p-6 text-sm text-[#6b6b6b]">{error}</p>
            ) : jobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#ddd] bg-[#fafafa] px-8 py-16 text-center md:px-12">
                <h3 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-tight text-ink">
                  No open roles right now — check back soon
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#6b6b6b] md:text-base">
                  {emptyCta?.message ||
                    'We are not hiring at the moment. Reach out if you think you are a fit.'}
                </p>
                <Link to={emptyCta?.href || '/#contact'} className="btn-yellow mt-8 inline-flex">
                  {emptyCta?.label || 'Contact us'} ↗
                </Link>
              </div>
            ) : (
              <ul className="overflow-hidden rounded-xl border border-[#e8e8e8]">
                {jobs.map((job) => (
                  <li key={job.id}>
                    <JobRow job={job} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
