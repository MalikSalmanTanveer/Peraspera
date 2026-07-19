import { useEffect, useMemo, useState } from 'react';

import { Link, useLocation } from 'react-router-dom';

import {

  CLIENT_WORKS,

  FEATURED_CLIENT_WORKS,

  WORK_CATEGORIES,

  type WorkCategory,

} from '../data/works-clients';

import { Button } from '../components/Button';

import { Container } from '../components/Container';

import { Reveal } from '../components/Reveal';

import { AppIcon } from '../components/AppIcon';

import { WorkScreenshot } from '../components/WorkScreenshot';

import {

  FeaturedWorksCarousel,

  FeaturedWorksCarouselCompact,

} from '../components/FeaturedWorksCarousel';

import { PortfolioReviewsSlider } from '../components/PortfolioReviewsSlider';

import { SectionGridDark } from '../components/SectionGridDark';

import { scrollToHashElement } from '../utils/scrollToHash';

import {

  PORTFOLIO_REVIEWS_SECTION_ID,

  resolvePortfolioReviewScrollTarget,

  type PortfolioReviewNavState,

} from '../utils/portfolioReviewNav';



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



export function PortfolioPage() {

  const location = useLocation();

  const [activeFilter, setActiveFilter] = useState<WorkCategory | 'All'>('All');

  const [navScrolled, setNavScrolled] = useState(false);



  useEffect(() => {

    const navState = location.state as PortfolioReviewNavState | null;

    if (!location.hash && !navState?.focusReview) return;



    const targetId = resolvePortfolioReviewScrollTarget(location.hash, navState);

    scrollToHashElement(targetId);

  }, [location.hash, location.state]);



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



      {/* Featured spotlight + project grid */}

      <SectionGridDark

        id="portfolio-grid"

        className="scroll-mt-[132px] rounded-t-[2rem] py-section-y px-nav-x max-md:px-nav-x-mobile max-md:py-section-y-mobile md:rounded-t-[2.5rem]"

      >

        <Container>

          <Reveal>

            <div className="relative mb-14 overflow-hidden rounded-8xl border-2 border-ink/10 bg-white">

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



          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredWorks.map((work, index) => (

              <Reveal key={work.id} delay={index * 0.04}>

                <article className="group flex h-full flex-col overflow-hidden rounded-8xl border-2 border-ink/10 bg-white transition-all duration-card hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_24px_80px_rgba(0,0,0,0.28)]">

                  <div className="relative h-[240px] shrink-0 overflow-hidden bg-[#111] md:h-[260px]">

                    <WorkScreenshot

                      id={work.id}

                      url={work.url}

                      title={work.title}

                      previewSrc={work.previewSrc}

                    />

                    <WorkExternalLink href={work.url} title={work.title} />

                  </div>



                  <div className="flex flex-1 flex-col p-6">

                    <span className="text-2xs font-black uppercase tracking-widest text-accent">

                      {work.category}

                    </span>

                    <h3 className="mt-2 font-display text-2xl font-extrabold text-ink md:text-[1.65rem]">

                      {work.title}

                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-body text-muted md:text-md">

                      {work.description}

                    </p>

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

      </SectionGridDark>



      {/* Client testimonials slider */}

      <section

        id={PORTFOLIO_REVIEWS_SECTION_ID}

        className="relative scroll-mt-[148px] overflow-hidden bg-paper py-section-y px-nav-x max-md:px-nav-x-mobile max-md:py-section-y-mobile"

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


