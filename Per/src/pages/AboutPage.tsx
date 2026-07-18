import { motion } from 'framer-motion';
import { WHY_STATS } from '../data/content';
import { ABOUT_APPROACH, ABOUT_MISSION, ABOUT_VALUES } from '../data/about';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { CountUp } from '../components/CountUp';
import { Reveal } from '../components/Reveal';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { AppIcon } from '../components/AppIcon';

export function AboutPage() {
  return (
    <div className="bg-ink text-white">
      <section className="relative overflow-hidden pt-[72px]">
        <div className="hero-grid-bg absolute inset-0 opacity-40" aria-hidden="true" />
        <motion.div
          className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-accent/15 blur-[120px]"
          animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
        <Container className="relative z-[1] px-nav-x py-12 md:py-16 max-md:px-nav-x-mobile">
          <Reveal>
            <PageBreadcrumb current="About" />
            <span className="section-label section-label-light">About Peraspera</span>
            <h1 className="mt-4 max-w-[820px] font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-extrabold leading-[1.04] tracking-tighter">
              One studio for design, web, product, and{' '}
              <em className="not-italic text-accent">automation.</em>
            </h1>
            <p className="mt-6 max-w-[620px] text-lg font-light leading-body-xl text-overlay-white-55">
              Peraspera brings brand, UI/UX, development, and AI automation together under one team
              — so your product, marketing, and technology stay aligned from day one.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="rounded-t-[2rem] bg-paper py-section-y px-nav-x text-ink max-md:py-section-y-mobile max-md:px-nav-x-mobile md:rounded-t-[2.5rem]">
        <Container>
          <div className="grid grid-cols-1 items-center gap-gap-xl xl:grid-cols-2">
            <Reveal>
              <span className="section-label">Our Story</span>
              <h2 className="section-heading">{ABOUT_MISSION.title}</h2>
              {ABOUT_MISSION.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="mt-5 text-muted leading-body-2xl">
                  {paragraph}
                </p>
              ))}
              <div className="mt-8">
                <Button variant="dark" href="/services">
                  Explore Services ↗
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="grid grid-cols-2 gap-5">
                {WHY_STATS.map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 0.08}>
                    <div className="rounded-5xl border border-border bg-white p-6 transition-all duration-card hover:-translate-y-1 hover:shadow-card-hover">
                    <strong className="block font-display text-5xl text-accent-gold md:text-6xl">
                      <CountUp value={stat.value} duration={1600} />
                    </strong>
                    <span className="mt-2 block text-sm-plus text-muted">{stat.label}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile">
        <Container>
          <Reveal>
            <span className="section-label">Our Approach</span>
            <h2 className="section-heading max-w-[720px]">
              A clear path from idea to launch — and beyond.
            </h2>
            <p className="mt-5 max-w-[640px] text-md-plus leading-body-lg text-muted">
              Every engagement follows the same disciplined workflow, whether you need a logo, a
              website, a SaaS MVP, or a full automation system.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {ABOUT_APPROACH.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.06}>
                <article className="group h-full rounded-6xl border border-border bg-white p-6 transition-all duration-card hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover">
                <span className="font-display text-3xl font-extrabold text-accent">{step.step}</span>
                <h3 className="mt-4 font-display text-xl font-extrabold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-body text-muted md:text-md">{step.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-section-y px-nav-x text-white max-md:py-section-y-mobile max-md:px-nav-x-mobile">
        <Container>
          <Reveal>
            <span className="section-label section-label-light">What We Stand For</span>
            <h2 className="section-heading text-white max-w-[760px]">
              Furthermore — the principles behind every Peraspera project.
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {ABOUT_VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.06}>
                <article className="h-full rounded-6xl border border-overlay-white-12 bg-overlay-white-08 p-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
                  <AppIcon name="Sparkles" className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-display text-2xl font-extrabold">{value.title}</h3>
                <p className="mt-4 text-sm leading-body-lg text-overlay-white-55 md:text-md">
                  {value.description}
                </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-16 flex flex-wrap gap-4">
              <Button variant="yellow" href="/#contact">
                Start a Project ↗
              </Button>
              <Button variant="light" href="/portfolio">
                View Portfolio
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
