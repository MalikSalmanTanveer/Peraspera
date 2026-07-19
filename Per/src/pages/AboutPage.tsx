import { Link } from 'react-router-dom';
import { WHY_STATS } from '../data/content';
import {
  ABOUT_APPROACH,
  ABOUT_BELIEFS,
  ABOUT_MISSION,
  ABOUT_WHO_WE_WORK_WITH,
} from '../data/about';
import { BRAND } from '../data/site';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { CountUp } from '../components/CountUp';
import { Reveal } from '../components/Reveal';
import { PageBreadcrumb } from '../components/PageBreadcrumb';

export function AboutPage() {
  return (
    <div className="bg-paper text-ink">
      <section className="border-b border-border bg-white pt-[72px]">
        <Container className="px-nav-x py-12 md:py-16 max-md:px-nav-x-mobile">
          <Reveal>
            <PageBreadcrumb current="About" light />
            <span className="section-label">About {BRAND.name}</span>
            <h1 className="mt-4 max-w-[780px] font-display text-[clamp(2.35rem,5vw,3.75rem)] font-extrabold leading-[1.06] tracking-tighter">
              A studio for teams who need brand, product, and systems handled together.
            </h1>
            <p className="mt-5 max-w-[620px] text-md-plus leading-body-xl text-muted">
              We&apos;re not a generalist agency with a slide deck. We&apos;re a working team that
              designs, builds, and automates — and stays involved until it&apos;s live.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-border bg-paper py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile">
        <Container>
          <div className="grid grid-cols-1 items-start gap-gap-xl xl:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-snug tracking-snug">
                {ABOUT_MISSION.title}
              </h2>
              {ABOUT_MISSION.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-5 text-muted leading-body-2xl">
                  {paragraph}
                </p>
              ))}
            </Reveal>

            <Reveal delay={0.06}>
              <div className="grid grid-cols-2 gap-4">
                {WHY_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-border bg-white p-5 md:p-6"
                  >
                    <strong className="block font-display text-4xl font-extrabold text-ink md:text-5xl">
                      <CountUp value={stat.value} duration={1600} />
                    </strong>
                    <span className="mt-2 block text-sm text-muted">{stat.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-white py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile">
        <Container>
          <div className="grid grid-cols-1 gap-gap-xl lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <span className="section-label">Who we work with</span>
              <h2 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.35rem)] font-extrabold leading-snug tracking-snug">
                Founders, agencies, and teams with real deadlines.
              </h2>
              <p className="mt-4 max-w-md text-md leading-body-lg text-muted">
                If you need clarity more than buzzwords, we&apos;re probably a good fit.
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <ul className="divide-y divide-border rounded-3xl border border-border bg-paper">
                {ABOUT_WHO_WE_WORK_WITH.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 px-5 py-4 text-md font-semibold text-ink md:px-6 md:py-5"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-paper py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile">
        <Container>
          <Reveal>
            <span className="section-label">How we work</span>
            <h2 className="mt-3 max-w-[640px] font-display text-[clamp(1.75rem,3vw,2.35rem)] font-extrabold leading-snug tracking-snug">
              Same process whether it&apos;s a logo, a site, or a full platform.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 xl:grid-cols-4">
            {ABOUT_APPROACH.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.04}>
                <article className="h-full bg-white p-6 md:p-7">
                  <span className="font-display text-sm font-extrabold text-accent">{step.step}</span>
                  <h3 className="mt-6 font-display text-xl font-extrabold text-ink">{step.title}</h3>
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
            <span className="section-label section-label-light">What we believe</span>
            <h2 className="mt-3 max-w-[640px] font-display text-[clamp(1.75rem,3vw,2.35rem)] font-extrabold leading-snug tracking-snug text-white">
              Three things we don&apos;t compromise on.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {ABOUT_BELIEFS.map((belief, i) => (
              <Reveal key={belief.title} delay={i * 0.05}>
                <article className="h-full border-t-2 border-accent pt-6">
                  <h3 className="font-display text-xl font-extrabold text-white md:text-2xl">
                    {belief.title}
                  </h3>
                  <p className="mt-4 text-sm leading-body-lg text-overlay-white-55 md:text-md">
                    {belief.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-overlay-white-10 pt-10">
              <Button variant="yellow" href="/#contact">
                Start a Project ↗
              </Button>
              <Link
                to="/portfolio"
                className="font-display text-sm-plus font-extrabold text-white transition-colors hover:text-accent"
              >
                See our work →
              </Link>
              <Link
                to="/services"
                className="font-display text-sm-plus font-extrabold text-overlay-white-55 transition-colors hover:text-white"
              >
                Browse services →
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
