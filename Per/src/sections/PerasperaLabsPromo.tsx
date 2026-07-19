import { Link } from 'react-router-dom';
import labsLogo from '../assets/logos/PERASPERALAB.png';
import { BRAND } from '../data/site';
import {
  LABS_HERO,
  LABS_HOME_EXPERIMENTS,
  LABS_HOME_STATS,
  LABS_PILLARS,
} from '../data/labs';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { AppIcon } from '../components/AppIcon';

export function PerasperaLabsPromo() {
  return (
    <section
      id="peraspera-labs-promo"
      className="bg-paper py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile"
      aria-labelledby="labs-promo-heading"
    >
      <Container>
        <Reveal>
          <article className="relative overflow-hidden rounded-[1.75rem] border border-border bg-ink text-white shadow-[0_32px_100px_rgba(0,0,0,0.18)] md:rounded-[2rem]">
            <div className="hero-grid-bg absolute inset-0 opacity-35" aria-hidden="true" />
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-[100px]"
              aria-hidden="true"
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="border-b border-overlay-white-10 p-8 md:p-10 lg:border-b-0 lg:border-r">
                <div className="mb-5 inline-flex items-center gap-2 rounded-pill border border-overlay-white-12 bg-overlay-white-08 px-4 py-2 text-2xs font-extrabold uppercase tracking-widest text-accent">
                  <AppIcon name="FlaskConical" className="h-4 w-4" />
                  {LABS_HERO.eyebrow}
                </div>

                <div className="mb-6 inline-flex rounded-2xl border border-overlay-white-12 bg-white/95 px-5 py-4">
                  <img
                    src={labsLogo}
                    alt={LABS_HERO.title}
                    className="h-auto w-[min(100%,220px)] object-contain"
                  />
                </div>

                <h2
                  id="labs-promo-heading"
                  className="font-display text-[clamp(1.85rem,3.5vw,2.75rem)] font-extrabold leading-[1.05] tracking-tight"
                >
                  {LABS_HERO.title}
                </h2>
                <p className="mt-3 font-display text-lg font-extrabold text-accent md:text-xl">
                  {LABS_HERO.tagline}
                </p>
                <p className="mt-4 max-w-xl text-sm leading-body-lg text-overlay-white-55 md:text-md-plus">
                  {LABS_HERO.homeSummary}
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-overlay-white-10 pt-6">
                  {LABS_HOME_STATS.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-display text-2xl font-extrabold text-accent md:text-3xl">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-overlay-white-48">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button variant="yellow" href={BRAND.labsUrl}>
                    Explore Labs ↗
                  </Button>
                  <Link
                    to={BRAND.labsUrl}
                    className="inline-flex items-center gap-2 font-display text-sm-plus font-extrabold text-white transition-colors hover:text-accent"
                  >
                    View experiments
                    <AppIcon name="ArrowUpRight" className="h-4 w-4" strokeWidth={2.25} />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2">
                {LABS_PILLARS.map((pillar, index) => (
                  <div
                    key={pillar.title}
                    className={`flex flex-col bg-overlay-white-08 p-6 md:p-7 ${
                      index % 2 === 0 ? 'border-overlay-white-10 sm:border-r' : ''
                    } ${index < 2 ? 'border-b border-overlay-white-10' : ''}`}
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
                      <AppIcon name={pillar.icon} className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-display text-lg font-extrabold leading-snug">{pillar.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-body text-overlay-white-55">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative border-t border-overlay-white-10 px-6 py-4 md:px-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-2xs font-black uppercase tracking-widest text-overlay-white-48">
                  Active experiments
                </p>
                <div className="flex flex-wrap gap-2">
                  {LABS_HOME_EXPERIMENTS.map((experiment) => (
                    <span
                      key={experiment}
                      className="rounded-pill border border-overlay-white-12 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      {experiment}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
