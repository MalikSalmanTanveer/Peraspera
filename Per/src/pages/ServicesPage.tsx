import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SERVICE_CATEGORIES, SERVICES_PAGE_STATS } from '../data/services';
import { SERVICE_IMAGE_BY_TITLE } from '../data/service-images';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { AppIcon } from '../components/AppIcon';
import { offeringIcon } from '../data/services';

function scrollToCategory(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 132;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export function ServicesPage() {
  const location = useLocation();
  const [activeId, setActiveId] = useState(SERVICE_CATEGORIES[0].id);
  const [navScrolled, setNavScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      requestAnimationFrame(() => scrollToCategory(hash));
    }
  }, [location.hash]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    SERVICE_CATEGORIES.forEach((category) => {
      const el = document.getElementById(category.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="bg-ink">
      <section className="relative overflow-hidden text-white pt-[72px] pb-0 px-nav-x max-md:px-nav-x-mobile">
        <div className="hero-grid-bg absolute inset-0" aria-hidden="true" />
        <motion.div
          className="orb absolute rounded-full blur-[120px] w-[600px] h-[600px] bg-accent opacity-[0.16] -right-32 -top-24"
          aria-hidden="true"
          animate={{ scale: [1, 1.06, 1], opacity: [0.14, 0.2, 0.14] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <Container className="relative z-[2] py-12 md:py-16">
          <Reveal>
            <nav className="mb-8 flex items-center gap-2 text-sm text-overlay-white-48" aria-label="Breadcrumb">
              <Link to="/" className="transition-colors hover:text-white">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-accent">Services</span>
            </nav>

            <span className="section-label section-label-light">Our Services</span>
            <h1 className="mt-4 max-w-[900px] font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-extrabold leading-[1.02] tracking-tighter">
              Seven categories.{' '}
              <em className="not-italic text-accent">Thirty-five specialized offerings.</em>
            </h1>
            <p className="mt-6 max-w-[680px] text-lg font-light leading-body-xl text-overlay-white-55">
              A structured look at everything Peraspera delivers — from AI automation and branding to
              UI/UX, web, SaaS products, finance, and AI creative production.
            </p>

            <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {SERVICES_PAGE_STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-3xl font-extrabold text-accent md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-overlay-white-48">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>

        <div
          className={`sticky z-[100] border-t border-overlay-white-10 bg-ink/95 backdrop-blur-md ${navScrolled ? 'top-[96px]' : 'top-[72px]'}`}
        >
          <Container className="py-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none md:justify-center">
              {SERVICE_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => scrollToCategory(category.id)}
                  className={`shrink-0 rounded-pill px-4 py-2 text-sm font-semibold transition-colors ${
                    activeId === category.id
                      ? 'bg-accent text-ink'
                      : 'border border-overlay-white-16 bg-overlay-white-08 text-overlay-white-55 hover:border-accent hover:text-white'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </Container>
        </div>
      </section>

      <section className="relative z-[1] rounded-t-[2rem] bg-paper py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile md:rounded-t-[2.5rem]">
        <Container>
          <div className="grid grid-cols-1 gap-gap-xl xl:grid-cols-[240px_1fr]">
            <aside className="hidden xl:block">
              <nav
                className={`sticky space-y-1 ${navScrolled ? 'top-[156px]' : 'top-[132px]'}`}
                aria-label="Service categories"
              >
                <p className="mb-4 text-2xs font-black uppercase tracking-widest text-muted-light">
                  Categories
                </p>
                {SERVICE_CATEGORIES.map((category, index) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => scrollToCategory(category.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                      activeId === category.id
                        ? 'bg-white shadow-card-hover border border-border'
                        : 'hover:bg-white/70'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${category.iconClass}`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-bold leading-snug text-ink">{category.title}</span>
                  </button>
                ))}
                <div className="mt-6 rounded-2xl border border-border bg-white p-4">
                  <p className="text-sm font-bold text-ink">Need help choosing?</p>
                  <p className="mt-2 text-sm leading-body text-muted">
                    Tell us your goals and we&apos;ll recommend the right service mix.
                  </p>
                  <Link
                    to="/#contact"
                    className="mt-4 inline-flex text-sm font-bold text-accent-dark hover:text-ink"
                  >
                    Get in touch →
                  </Link>
                </div>
              </nav>
            </aside>

            <div className="space-y-20 md:space-y-28">
              {SERVICE_CATEGORIES.map((category, categoryIndex) => {
                const image = SERVICE_IMAGE_BY_TITLE[category.title];

                return (
                  <article
                    key={category.id}
                    id={category.id}
                    className="scroll-mt-[148px]"
                  >
                    <Reveal delay={categoryIndex * 0.03}>
                      <div className="overflow-hidden rounded-8xl border border-border bg-white">
                        {image ? (
                          <div className="relative h-[220px] overflow-hidden bg-ink md:h-[280px]">
                            <img
                              src={image}
                              alt=""
                              className="h-full w-full object-cover object-right"
                            />
                            <div
                              className="pointer-events-none absolute inset-y-0 left-0 w-[min(100%,520px)] bg-gradient-to-r from-ink/85 via-ink/45 to-transparent"
                              aria-hidden="true"
                            />
                            <div className="absolute bottom-0 left-0 p-6 md:p-8">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${category.iconClass}`}
                                >
                                  <AppIcon name={category.icon} className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-accent">
                                  {category.shortCategory}
                                </span>
                              </div>
                              <h2 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-tight text-white">
                                {category.title}
                              </h2>
                              <p className="mt-2 max-w-xl text-sm text-overlay-white-55 md:text-base">
                                {category.tagline}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="border-b border-border p-6 md:p-8">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${category.iconClass}`}
                              >
                                <AppIcon name={category.icon} className="h-5 w-5 text-ink" />
                              </div>
                              <span className="text-xs font-black uppercase tracking-widest text-accent-gold">
                                {category.shortCategory}
                              </span>
                            </div>
                            <h2 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-tight">
                              {category.title}
                            </h2>
                            <p className="mt-2 max-w-xl text-muted">{category.tagline}</p>
                          </div>
                        )}

                        <div className="p-6 md:p-8">
                          <p className="max-w-3xl text-md-plus leading-body-lg text-muted">
                            {category.overview}
                          </p>

                          <div className="mt-8 border-t border-border pt-8">
                            <h3 className="text-2xs font-black uppercase tracking-widest text-muted-light">
                              Offerings
                            </h3>

                            <div className="mt-6 space-y-4">
                              {category.offerings.map((offering, offeringIndex) => {
                                const detail = category.offeringDetails[offeringIndex];
                                const icon = offeringIcon(offeringIndex);

                                return (
                                  <div
                                    key={offering}
                                    className="rounded-3xl border border-border bg-paper p-5 transition-shadow hover:shadow-card md:p-6"
                                  >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-border">
                                        <AppIcon name={icon} className="h-4 w-4 text-accent-dark" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                          <h4 className="font-display text-lg font-extrabold text-ink md:text-xl">
                                            {offering}
                                          </h4>
                                          <span className="rounded-md bg-white px-2 py-0.5 text-2xs font-bold uppercase tracking-wide text-muted-light border border-border">
                                            {category.shortCategory} · {String(offeringIndex + 1).padStart(2, '0')}
                                          </span>
                                        </div>
                                        <p className="mt-2 text-sm leading-body text-muted md:text-md">
                                          {detail.description}
                                        </p>
                                        <ul className="mt-4 flex flex-wrap gap-2">
                                          {detail.deliverables.map((item) => (
                                            <li
                                              key={item}
                                              className="rounded-pill border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink"
                                            >
                                              {item}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  </article>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ink py-section-y px-nav-x text-white max-md:py-section-y-mobile max-md:px-nav-x-mobile">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-container-cta text-center">
              <span className="section-label section-label-light">How We Work</span>
              <h2 className="section-heading text-white">
                Every service follows the same disciplined process.
              </h2>
              <p className="mx-auto mt-6 max-w-[600px] text-overlay-white-55 leading-body-lg">
                Discovery, direction, design, build, and launch — whether you need a logo, a website,
                or a full SaaS platform.
              </p>

              <ol className="mt-12 grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-5">
                {['Discovery', 'Direction', 'Design', 'Build', 'Launch'].map((step, index) => (
                  <li
                    key={step}
                    className="rounded-3xl border border-overlay-white-12 bg-overlay-white-08 p-5"
                  >
                    <span className="font-display text-2xl font-extrabold text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-extrabold">{step}</h3>
                  </li>
                ))}
              </ol>

              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <Button variant="yellow" href="/#contact">
                  Start a Project ↗
                </Button>
                <Button variant="light" href="/">
                  Back to Home
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
