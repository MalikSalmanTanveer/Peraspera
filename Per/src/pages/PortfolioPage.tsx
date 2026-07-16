import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CLIENT_WORKS,
  WORK_CATEGORIES,
  WORKS_PAGE_STATS,
  type WorkCategory,
} from '../data/works-clients';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { AppIcon } from '../components/AppIcon';
import { WorkScreenshot } from '../components/WorkScreenshot';

function WorkExternalLink({ href, title }: { href: string; title: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${title} live site`}
      className="group/link absolute right-4 top-4 z-10 flex items-center gap-0 overflow-hidden rounded-full border border-white/25 bg-ink/40 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-normal hover:border-accent/70 hover:bg-ink/55 hover:pr-1"
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap pl-0 text-[11px] font-extrabold uppercase tracking-wider text-white opacity-0 transition-all duration-normal group-hover/link:max-w-[72px] group-hover/link:pl-3 group-hover/link:opacity-100">
        Visit
      </span>
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-ink ring-2 ring-white/20 transition-transform duration-normal group-hover/link:scale-105 group-hover/link:ring-accent/40">
        <span
          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/35 to-transparent"
          aria-hidden="true"
        />
        <AppIcon name="ArrowUpRight" className="relative h-[18px] w-[18px]" strokeWidth={2.25} />
      </span>
    </a>
  );
}

function Stars() {
  return (
    <div className="mb-3 flex gap-[3px]" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-star text-md-plus">
          ★
        </span>
      ))}
    </div>
  );
}

export function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<WorkCategory | 'All'>('All');
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filteredWorks = useMemo(() => {
    if (activeFilter === 'All') return CLIENT_WORKS;
    return CLIENT_WORKS.filter((work) => work.category === activeFilter);
  }, [activeFilter]);

  const featuredWork = CLIENT_WORKS.find((work) => work.featured && work.span === 'large') ?? CLIENT_WORKS[0];

  const scrollToProjects = () => {
    document.getElementById('portfolio-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-ink">
      {/* Hero */}
      <section className="relative overflow-hidden text-white pt-[72px]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,rgba(254,163,39,0.12),transparent_55%)]"
          aria-hidden="true"
        />

        <Container className="relative z-[2] px-nav-x py-12 md:py-16 max-md:px-nav-x-mobile">
          <div className="grid grid-cols-1 items-center gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:gap-14">
            <Reveal>
              <nav
                className="mb-6 flex items-center gap-2 text-sm text-overlay-white-48"
                aria-label="Breadcrumb"
              >
                <Link to="/" className="transition-colors hover:text-white">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-accent">Portfolio</span>
              </nav>

              <span className="section-label section-label-light">Portfolio & Testimonials</span>
              <h1 className="mt-4 max-w-[820px] font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-extrabold leading-[1.04] tracking-tighter">
                Websites and brands we&apos;ve{' '}
                <em className="not-italic text-accent">shipped live.</em>
              </h1>
              <p className="mt-6 max-w-[560px] text-lg font-light leading-body-xl text-overlay-white-55 max-md:text-md-plus">
                Real projects across tourism, real estate, education, eCommerce, and food — with
                client testimonials for every build.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="yellow" href="/#contact">
                  Start a Project ↗
                </Button>
                <button
                  type="button"
                  onClick={scrollToProjects}
                  className="btn-light cursor-pointer border-0 bg-transparent"
                >
                  Browse Projects
                </button>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
                {WORKS_PAGE_STATS.map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display text-3xl font-extrabold text-accent md:text-4xl">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-overlay-white-48">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08} className="hidden xl:block">
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d]">
                <div className="aspect-[16/11] overflow-hidden">
                  <WorkScreenshot
                    id={featuredWork.id}
                    url={featuredWork.url}
                    title={featuredWork.title}
                    priority
                    className="transition-transform duration-image-slow group-hover:scale-[1.03]"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-6">
                  <p className="text-2xs font-black uppercase tracking-widest text-accent">
                    {featuredWork.category}
                  </p>
                  <p className="mt-1 font-display text-xl font-extrabold text-white">
                    {featuredWork.title}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>

        {/* Filter bar */}
        <div
          className={`relative z-[100] border-t border-overlay-white-10 bg-ink/95 backdrop-blur-md ${navScrolled ? 'sticky top-[96px]' : 'sticky top-[72px]'}`}
        >
          <Container className="px-nav-x py-3 max-md:px-nav-x-mobile">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {WORK_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveFilter(category)}
                  className={`shrink-0 rounded-pill px-4 py-2 text-sm font-semibold transition-colors ${
                    activeFilter === category
                      ? 'bg-accent text-ink'
                      : 'border border-overlay-white-16 bg-overlay-white-08 text-overlay-white-55 hover:border-accent hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* Featured spotlight */}
      <section
        id="portfolio-grid"
        className="scroll-mt-[132px] relative z-[1] rounded-t-[2rem] bg-paper py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile md:rounded-t-[2.5rem]"
      >
        <Container>
          <Reveal>
            <div className="relative mb-14 overflow-hidden rounded-8xl border border-border bg-white">
              <div className="relative min-h-[280px] overflow-hidden bg-ink lg:min-h-[420px]">
                <WorkScreenshot
                  id={featuredWork.id}
                  url={featuredWork.url}
                  title={featuredWork.title}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" />
                <WorkExternalLink href={featuredWork.url} title={featuredWork.title} />
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 lg:max-w-[55%]">
                  <span className="text-2xs font-black uppercase tracking-widest text-accent">
                    Featured Project
                  </span>
                  <h2 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.75rem)] font-extrabold leading-tight text-white">
                    {featuredWork.title}
                  </h2>
                  <p className="mt-4 text-md-plus leading-body-lg text-overlay-white-55">
                    {featuredWork.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {featuredWork.services.map((service) => (
                      <span
                        key={service}
                        className="rounded-pill border border-overlay-white-16 bg-overlay-white-08 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredWorks.map((work, index) => (
              <Reveal key={work.id} delay={index * 0.04}>
                <article
                  className={`group overflow-hidden rounded-8xl border border-border bg-white transition-all duration-card hover:-translate-y-1 hover:shadow-card-hover ${
                    work.span === 'large' ? 'xl:col-span-2' : ''
                  }`}
                >
                  <div
                    className={`relative overflow-hidden bg-ink ${work.span === 'large' ? 'h-[320px]' : 'h-[240px]'}`}
                  >
                    <WorkScreenshot id={work.id} url={work.url} title={work.title} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                    <WorkExternalLink href={work.url} title={work.title} />
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <span className="text-2xs font-black uppercase tracking-widest text-accent">
                        {work.category}
                      </span>
                      <h3 className="mt-2 font-display text-2xl font-extrabold text-white md:text-3xl">
                        {work.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm leading-body text-muted md:text-md">{work.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {work.services.map((service) => (
                        <span
                          key={service}
                          className="rounded-md bg-paper px-2.5 py-1 text-2xs font-bold uppercase tracking-wide text-muted"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Client testimonials */}
      <section className="bg-paper py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[820px] text-center">
              <span className="section-label">Client Love</span>
              <h2 className="section-heading">What clients say about working with us.</h2>
              <p className="mt-[18px] text-md-plus leading-body-lg text-muted">
                Testimonials from teams behind the live projects in our portfolio.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {CLIENT_WORKS.map((work, index) => (
              <Reveal key={work.id} delay={index * 0.03}>
                <article className="flex h-full flex-col rounded-6xl border border-border bg-white p-padding-card-lg">
                  <Stars />
                  <blockquote className="flex-1 text-md leading-body-lg text-muted">
                    &ldquo;{work.testimonial.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-6 flex items-center gap-3.5 border-t border-border pt-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 font-display text-sm-plus font-extrabold text-accent-dark">
                      {work.title.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <cite className="font-display text-md font-extrabold not-italic text-ink">
                        {work.testimonial.name}
                      </cite>
                      <p className="mt-0.5 text-sm-plus text-muted">{work.testimonial.role}</p>
                      <a
                        href={work.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-accent-dark hover:text-ink"
                      >
                        View project
                        <AppIcon name="ArrowUpRight" className="h-3.5 w-3.5" strokeWidth={2.25} />
                      </a>
                    </div>
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-ink py-section-y px-nav-x text-white max-md:py-section-y-mobile max-md:px-nav-x-mobile">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-container-cta text-center">
              <span className="section-label section-label-light">Start Your Project</span>
              <h2 className="section-heading text-white">Ready for a website that looks this good?</h2>
              <p className="mx-auto mt-6 max-w-[600px] text-overlay-white-55 leading-body-lg">
                Tell us about your brand, industry, and timeline — we&apos;ll recommend the right
                design and development package.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button variant="yellow" href="/#contact">
                  Start a Project ↗
                </Button>
                <Button variant="light" href="/services">
                  Explore Services
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
