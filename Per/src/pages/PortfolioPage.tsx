import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CLIENT_WORKS,
  FEATURED_CLIENT_WORKS,
  WORK_CATEGORIES,
  WORKS_PAGE_STATS,
  type WorkCategory,
} from '../data/works-clients';
import { TESTIMONIALS } from '../data/content-extended';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import {
  FeaturedWorksCarousel,
  FeaturedWorksCarouselCompact,
} from '../components/FeaturedWorksCarousel';
import { PortfolioWorksStrip } from '../components/PortfolioWorksStrip';
import { SectionGridDark } from '../components/SectionGridDark';

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

  const featuredWorks = FEATURED_CLIENT_WORKS;

  const scrollToProjects = () => {
    document.getElementById('portfolio-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-ink">
      {/* Hero */}
      <section className="relative overflow-hidden text-white pt-[72px]">
        <div className="hero-grid-bg absolute inset-0 opacity-45" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,rgba(254,163,39,0.12),transparent_55%)]"
          aria-hidden="true"
        />

        <Container className="relative z-[2] px-nav-x py-12 md:py-16 max-md:px-nav-x-mobile">
          <div className="mx-auto max-w-[920px] text-center">
            <Reveal>
              <nav
                className="mb-6 flex items-center justify-center gap-2 text-sm text-overlay-white-48"
                aria-label="Breadcrumb"
              >
                <Link to="/" className="transition-colors hover:text-white">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-accent">Portfolio</span>
              </nav>

              <span className="section-label section-label-light">Portfolio & Testimonials</span>
              <h1 className="mt-4 font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-extrabold leading-[1.04] tracking-tighter">
                Websites and brands we&apos;ve{' '}
                <em className="not-italic text-accent">shipped live.</em>
              </h1>
              <p className="mx-auto mt-6 max-w-[560px] text-lg font-light leading-body-xl text-overlay-white-55 max-md:text-md-plus">
                Real projects across tourism, real estate, education, eCommerce, and food — with
                client testimonials for every build.
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

              <div className="mx-auto mt-12 grid max-w-[820px] grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
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
          </div>

          <Reveal delay={0.08} className="mt-12 hidden xl:block">
            <FeaturedWorksCarouselCompact works={featuredWorks} priority />
          </Reveal>
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

      {/* Featured spotlight + animated project strip */}
      <SectionGridDark
        id="portfolio-grid"
        className="scroll-mt-[132px] rounded-t-[2rem] py-section-y px-nav-x max-md:px-nav-x-mobile max-md:py-section-y-mobile md:rounded-t-[2.5rem]"
      >
        <Container>
          <Reveal>
            <div className="relative mb-14 overflow-hidden rounded-8xl border border-overlay-white-12 bg-white">
              <div className="relative overflow-hidden bg-[#f4f4f4]">
                <FeaturedWorksCarousel
                  works={featuredWorks}
                  priority
                  showVisitLink
                  captionBelow
                />
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-8 text-center">
              <span className="section-label section-label-light">All Projects</span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-white md:text-4xl">
                {activeFilter === 'All' ? 'Every live build in one scroll.' : `${activeFilter} projects.`}
              </h2>
            </div>
          </Reveal>

          <PortfolioWorksStrip works={filteredWorks} />
        </Container>
      </SectionGridDark>

      {/* Client testimonials */}
      <section className="relative overflow-hidden bg-paper py-section-y px-nav-x max-md:px-nav-x-mobile max-md:py-section-y-mobile">
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

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {TESTIMONIALS.map((review, index) => (
              <Reveal key={review.name} delay={index * 0.03}>
                <article className="flex h-full min-h-[320px] flex-col rounded-6xl border border-border bg-white p-padding-card-lg">
                  <Stars />
                  <blockquote className="line-clamp-8 flex-1 text-md leading-body-lg text-muted">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-6 flex items-center gap-3.5 border-t border-border pt-5">
                    {review.avatarSrc ? (
                      <img
                        src={review.avatarSrc}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-full object-cover object-top ring-2 ring-border"
                      />
                    ) : (
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm-plus font-extrabold text-white ${review.avatarColor}`}
                      >
                        {review.initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <cite className="block truncate font-display text-md font-extrabold not-italic text-ink">
                        {review.name}
                      </cite>
                      <p className="mt-0.5 truncate text-sm font-semibold text-ink/80">{review.title}</p>
                      <p className="truncate text-sm-plus text-muted">{review.role}</p>
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
