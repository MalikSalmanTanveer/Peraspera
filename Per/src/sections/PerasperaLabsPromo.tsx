import { Link } from 'react-router-dom';
import { BRAND } from '../data/site';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { AppIcon } from '../components/AppIcon';

export function PerasperaLabsPromo() {
  return (
    <section
      id="peraspera-labs-promo"
      className="relative overflow-hidden bg-accent py-14 px-nav-x text-ink max-md:py-12 max-md:px-nav-x-mobile"
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
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-pill border border-ink/10 bg-ink/5 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-ink">
                <AppIcon name="FlaskConical" className="h-4 w-4" />
                Innovation Arm
              </div>
              <h2
                id="labs-promo-heading"
                className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold leading-tight tracking-tight"
              >
                Explore {BRAND.labsLabel}
              </h2>
              <p className="mt-4 max-w-xl text-md-plus leading-body-lg text-overlay-ink-68">
                Our lab builds AI prototypes, automation experiments, and research projects — the
                innovation layer behind Peraspera&apos;s studio work.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
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
