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
        className="pointer-events-none absolute inset-0 opacity-35"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 12% 50%, rgba(255,255,255,0.45), transparent 40%), radial-gradient(circle at 88% 50%, rgba(13,13,13,0.06), transparent 36%)',
        }}
      />

      <Container className="relative z-[1]">
        <Reveal>
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <img
                src={labsLogo}
                alt={LABS_HERO.title}
                className="h-auto w-[min(100%,168px)] shrink-0 object-contain max-md:w-[140px]"
              />

              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-pill border border-ink/10 bg-ink/5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-ink">
                  <AppIcon name="FlaskConical" className="h-3.5 w-3.5" />
                  {LABS_HERO.eyebrow}
                </div>
                <h2
                  id="labs-promo-heading"
                  className="font-display text-[clamp(1.25rem,2.4vw,1.65rem)] font-extrabold leading-tight tracking-tight"
                >
                  {LABS_HERO.tagline}
                </h2>
                <p className="mt-1.5 max-w-xl text-sm leading-body text-overlay-ink-68 md:text-md">
                  {LABS_HERO.homeSummary}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <Button variant="dark" href={BRAND.labsUrl} className="text-sm-plus py-3 px-6">
                Visit Labs ↗
              </Button>
              <Link
                to={BRAND.labsUrl}
                className="inline-flex items-center gap-1.5 font-display text-sm font-extrabold text-ink transition-opacity hover:opacity-70"
              >
                See experiments
                <AppIcon name="ArrowUpRight" className="h-4 w-4" strokeWidth={2.25} />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
