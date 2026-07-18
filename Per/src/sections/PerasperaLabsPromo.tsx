import { Link } from 'react-router-dom';
import labsLogo from '../assets/logos/PERASPERALAB.png';
import { BRAND } from '../data/site';
import { LABS_HERO } from '../data/labs';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { AppIcon } from '../components/AppIcon';
import { SectionGridDark } from '../components/SectionGridDark';

export function PerasperaLabsPromo() {
  return (
    <SectionGridDark
      id="peraspera-labs-promo"
      className="border-y border-overlay-white-08 py-16 px-nav-x max-md:px-nav-x-mobile max-md:py-14"
      aria-labelledby="labs-promo-heading"
    >
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-pill border border-overlay-accent-border-42 bg-accent/10 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-accent">
                <AppIcon name="FlaskConical" className="h-4 w-4" />
                {LABS_HERO.eyebrow}
              </div>
              <img
                src={labsLogo}
                alt={LABS_HERO.title}
                id="labs-promo-heading"
                className="mb-4 h-auto w-[min(100%,320px)] object-contain"
              />
              <p className="font-display text-xl font-extrabold text-accent md:text-2xl">
                {LABS_HERO.tagline}
              </p>
              <p className="mt-4 max-w-xl text-md-plus leading-body-lg text-overlay-white-55">
                {LABS_HERO.homeSummary}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Button variant="yellow" href={BRAND.labsUrl}>
                Visit Labs →
              </Button>
              <Link
                to={BRAND.labsUrl}
                className="inline-flex items-center gap-2 self-center font-display text-sm-plus font-extrabold text-white transition-opacity hover:text-accent"
              >
                See live experiments
                <AppIcon name="ArrowUpRight" className="h-4 w-4" strokeWidth={2.25} />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </SectionGridDark>
  );
}
