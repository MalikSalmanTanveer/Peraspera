import { useEffect, useMemo, useState } from 'react';

import { useLocation } from 'react-router-dom';

import {
  CLIENT_WORKS,
  WORK_CATEGORIES,
  type WorkCategory,
} from '../data/works-clients';

import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { PortfolioWorkShowcase } from '../components/PortfolioWorkShowcase';
import { PortfolioReviewsSlider } from '../components/PortfolioReviewsSlider';
import { InkParticleBackground } from '../components/InkParticleBackground';

import { scrollToHashElement } from '../utils/scrollToHash';

import {
  PORTFOLIO_REVIEWS_SECTION_ID,
  resolvePortfolioReviewScrollTarget,
  type PortfolioReviewNavState,
} from '../utils/portfolioReviewNav';

const INITIAL_VISIBLE = 3;
const LOAD_MORE_STEP = 3;

export function PortfolioPage() {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState<WorkCategory | 'All'>('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    const navState = location.state as PortfolioReviewNavState | null;
    if (!location.hash && !navState?.focusReview) return;

    const targetId = resolvePortfolioReviewScrollTarget(location.hash, navState);
    scrollToHashElement(targetId);
  }, [location.hash, location.state]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [activeFilter]);

  const filteredWorks = useMemo(() => {
    const works =
      activeFilter === 'All'
        ? [...CLIENT_WORKS]
        : CLIENT_WORKS.filter((work) => work.category === activeFilter);

    if (activeFilter === 'All') {
      works.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    }

    return works;
  }, [activeFilter]);

  const visibleWorks = filteredWorks.slice(0, visibleCount);
  const hasMore = visibleCount < filteredWorks.length;

  const scrollToProjects = () => {
    document.getElementById('portfolio-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-ink">
      <section className="relative overflow-hidden text-white pt-[72px] px-nav-x max-md:px-nav-x-mobile">
        <div className="hero-grid-bg absolute inset-0 opacity-45" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,rgba(254,163,39,0.12),transparent_55%)]"
          aria-hidden="true"
        />

        <Container className="relative z-[2] py-12 md:py-16">
          <Reveal>
            <PageBreadcrumb current="Portfolio" />
            <div className="mx-auto max-w-[820px] text-center">
              <span className="section-label section-label-light">Portfolio</span>
              <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold leading-[1.06] tracking-tighter">
                Live work across tourism, real estate, education, and{' '}
                <em className="not-italic text-accent">eCommerce.</em>
              </h1>
              <p className="mx-auto mt-5 max-w-[520px] text-md-plus font-light leading-body-xl text-overlay-white-55">
                Selected client projects — each built for clarity, performance, and conversion.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
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
            </div>
          </Reveal>
        </Container>
      </section>

      <section
        id="portfolio-grid"
        className="relative scroll-mt-[72px] overflow-hidden bg-ink py-section-y text-white px-nav-x max-md:px-nav-x-mobile max-md:py-section-y-mobile"
      >
        <InkParticleBackground />

        <Container className="relative z-[2]">
          <Reveal>
            <div className="mx-auto mb-10 max-w-[640px] text-center md:mb-14">
              <span className="section-label section-label-light">Featured Work</span>
              <h2 className="section-heading text-white">Where design clarity meets live performance.</h2>
              <p className="mt-[18px] text-md-plus leading-body-lg text-overlay-white-55">
                Real websites and brands we&apos;ve shipped — with testimonials for every build below.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.04}>
            <div className="mb-12 flex flex-wrap justify-center gap-x-1 gap-y-2 border-b border-overlay-white-10 pb-4">
              {WORK_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveFilter(category)}
                  className={`rounded-pill px-4 py-2 text-sm font-semibold transition-colors ${
                    activeFilter === category
                      ? 'bg-accent text-ink'
                      : 'text-overlay-white-55 hover:bg-overlay-white-08 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Reveal>

          <div>
            {visibleWorks.map((work, index) => (
              <Reveal key={work.id} delay={index * 0.05}>
                <PortfolioWorkShowcase work={work} index={index} priority={index === 0} />
              </Reveal>
            ))}
          </div>

          {filteredWorks.length === 0 ? (
            <p className="py-16 text-center text-overlay-white-55">No projects in this category yet.</p>
          ) : null}

          {hasMore ? (
            <Reveal className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}
                className="inline-flex items-center gap-2 rounded-pill border border-overlay-white-16 bg-overlay-white-08 px-8 py-3.5 text-sm font-bold text-white transition-all duration-normal hover:border-accent hover:text-accent"
              >
                Load More Projects
                <span aria-hidden="true">→</span>
              </button>
            </Reveal>
          ) : null}
        </Container>
      </section>

      <section
        id={PORTFOLIO_REVIEWS_SECTION_ID}
        className="relative scroll-mt-[148px] overflow-hidden border-t border-border bg-paper py-section-y px-nav-x max-md:px-nav-x-mobile max-md:py-section-y-mobile"
      >
        <div className="hero-grid-bg pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true" />
        <Container className="relative z-[1]">
          <Reveal>
            <div className="mx-auto max-w-[820px] text-center">
              <span className="section-label">Client Love</span>
              <h2 className="section-heading">What clients say about working with us.</h2>
              <p className="mt-[18px] text-md-plus leading-body-lg text-muted">
                Testimonials from teams behind the live projects in our portfolio.
              </p>
            </div>
          </Reveal>

          <PortfolioReviewsSlider />
        </Container>
      </section>

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
