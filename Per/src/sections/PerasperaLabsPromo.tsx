import { Link } from 'react-router-dom';
import labsLogo from '../assets/logos/PERASPERALAB.png';
import { BRAND } from '../data/site';
import { LABS_HERO } from '../data/labs';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { AppIcon } from '../components/AppIcon';

export function PerasperaLabsPromo() {
  return (
    <section
      id="peraspera-labs-promo"
      className="relative overflow-hidden bg-accent px-nav-x py-8 text-ink max-md:px-nav-x-mobile max-md:py-7"
      aria-labelledby="labs-promo-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.55), transparent 42%), radial-gradient(circle at 85% 80%, rgba(13,13,13,0.08), transparent 38%)',
        }}
      />

      <Container className="relative z-[1]">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-pill border border-ink/10 bg-ink/5 px-3.5 py-1.5 text-2xs font-extrabold uppercase tracking-widest text-ink">
                <AppIcon name="FlaskConical" className="h-3.5 w-3.5" />
                {LABS_HERO.eyebrow}
              </div>
              <img
                src={labsLogo}
                alt={LABS_HERO.title}
                id="labs-promo-heading"
                className="mb-2 h-auto w-[min(100%,240px)] object-contain max-md:w-[min(100%,200px)]"
              />
              <p className="font-display text-lg font-extrabold leading-snug md:text-xl">
                {LABS_HERO.tagline}
              </p>
              <p className="mt-2 max-w-xl text-sm leading-body-lg text-overlay-ink-68 md:text-md">
                {LABS_HERO.homeSummary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Button variant="dark" href={BRAND.labsUrl} className="text-sm-plus py-3 px-6">
                Visit Labs →
              </Button>
              <Link
                to={BRAND.labsUrl}
                className="inline-flex items-center gap-2 font-display text-sm font-extrabold text-ink transition-opacity hover:opacity-75"
              >
                See live experiments
                <AppIcon name="ArrowUpRight" className="h-4 w-4" strokeWidth={2.25} />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
