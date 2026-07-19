import { HOME_SERVICES } from '../data/content';
import { FEATURE_IMAGES } from '../data/feature-images';
import { Button } from '../components/Button';
import { Reveal } from '../components/Reveal';

const PREMIUM_STATEMENT =
  'Brand clarity and technical execution — unified in one studio.';

export function FeatureBlocks() {
  return (
    <section id="what-we-deliver" className="bg-white" aria-labelledby="what-we-deliver-heading">
      <div className="px-nav-x pb-10 pt-section-y text-center max-md:px-nav-x-mobile max-md:pb-8 max-md:pt-section-y-mobile">
        <Reveal className="mx-auto flex max-w-[880px] flex-col items-center">
          <span className="section-label section-label-dark mb-4 antialiased md:mb-5">
            What We Deliver
          </span>

          <h2
            id="what-we-deliver-heading"
            className="font-display text-[clamp(1.55rem,3.8vw,2.75rem)] font-extrabold leading-[1.08] tracking-tight text-ink antialiased"
          >
            {PREMIUM_STATEMENT}
          </h2>

          <ul
            className="mt-8 flex flex-wrap items-center justify-center gap-2 md:mt-9 md:gap-2.5"
            aria-label="Services we deliver"
          >
            {HOME_SERVICES.map((service) => (
              <li key={service.title}>
                <span className="inline-flex min-h-[34px] items-center rounded-full border border-ink/10 bg-ink/[0.035] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/70 antialiased backdrop-blur-sm md:px-5 md:text-2xs">
                  {service.title}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 md:mt-10">
            <Button variant="dark" href="#contact">
              Start Your Project ↗
            </Button>
          </div>
        </Reveal>
      </div>

      <div className="w-full">
        <img
          src={FEATURE_IMAGES.whatWeDeliver}
          alt="Peraspera studio — standing out with clarity and precision"
          loading="lazy"
          className="block h-auto w-full select-none"
        />
      </div>
    </section>
  );
}
