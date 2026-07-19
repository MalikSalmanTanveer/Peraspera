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
      className="relative overflow-hidden bg-accent py-14 px-nav-x text-ink max-md:px-nav-x-mobile max-md:py-12"
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
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-pill border border-ink/10 bg-ink/5 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-ink">
                <AppIcon name="FlaskConical" className="h-4 w-4" />
                {LABS_HERO.eyebrow}
              </div>
              <img
                src={labsLogo}
                alt={LABS_HERO.title}
                id="labs-promo-heading"
                className="mb-4 h-auto w-[min(100%,320px)] object-contain"
              />
              <p className="font-display text-xl font-extrabold leading-snug md:text-2xl">
                {LABS_HERO.tagline}
              </p>
              <p className="mt-4 max-w-xl text-md-plus leading-body-lg text-overlay-ink-68">
                {LABS_HERO.homeSummary}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Button variant="dark" href={BRAND.labsUrl}>
                Visit Labs →
              </Button>
              <Link
                to={BRAND.labsUrl}
                className="inline-flex items-center gap-2 self-center font-display text-sm-plus font-extrabold text-ink transition-opacity hover:opacity-75"
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
