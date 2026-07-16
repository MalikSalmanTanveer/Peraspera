import { WHY_STATS } from '../data/content';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { CountUp } from '../components/CountUp';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { Reveal } from '../components/Reveal';
import { PageBreadcrumb } from '../components/PageBreadcrumb';

export function AboutPage() {
  return (
    <div className="bg-ink text-white">
      <section className="relative overflow-hidden pt-[72px]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,rgba(254,163,39,0.12),transparent_55%)]"
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
              <span className="section-label">Why Peraspera</span>
              <h2 className="section-heading">
                Premium creative execution across design, web, product, and AI.
              </h2>
              <p className="mt-6 text-muted leading-body-2xl">
                We unite brand identity, UI/UX, web, SaaS, AI automation, and campaign content in one
                connected studio workflow — for launches, redesigns, marketing systems, and ongoing
                design needs.
              </p>
              <div className="mt-8">
                <Button variant="dark" href="/services">
                  Explore Services ↗
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="grid grid-cols-2 gap-5">
                {WHY_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-5xl border border-border bg-white p-6 transition-all duration-card hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <strong className="block font-display text-5xl text-accent-gold md:text-6xl">
                      <CountUp value={stat.value} duration={1600} />
                    </strong>
                    <span className="mt-2 block text-sm-plus text-muted">{stat.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
            <PlaceholderImage
              gradient="from-violet-500/40 to-ink"
              className="h-[280px] rounded-5xl md:col-span-2"
              label="Studio work preview"
            />
            <PlaceholderImage
              gradient="from-orange-400/40 to-ink"
              className="h-[280px] rounded-5xl"
              label="Brand design preview"
            />
          </div>
        </Container>
      </section>
    </div>
  );
}
