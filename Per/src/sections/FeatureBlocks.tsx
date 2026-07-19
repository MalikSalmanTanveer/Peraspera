import { HOME_SERVICES } from '../data/content';
import { FEATURE_IMAGES } from '../data/feature-images';
import { Button } from '../components/Button';
import { Reveal } from '../components/Reveal';

const PREMIUM_STATEMENT =
  'Brand clarity and technical execution unified in one studio.';

export function FeatureBlocks() {
  return (
    <section id="what-we-deliver" className="bg-white" aria-labelledby="what-we-deliver-heading">
      <div className="px-nav-x pb-4 pt-section-y text-center max-md:px-nav-x-mobile max-md:pb-3 max-md:pt-section-y-mobile">
        <Reveal className="mx-auto flex w-full max-w-[1120px] flex-col items-center">
          <span className="section-label section-label-dark mb-3 antialiased md:mb-4">
            Stand Out Creatively
          </span>

          <div className="max-w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <h2
              id="what-we-deliver-heading"
              className="whitespace-nowrap font-display text-[clamp(0.92rem,2.35vw,2.65rem)] font-extrabold leading-none tracking-tight text-ink antialiased"
            >
              {PREMIUM_STATEMENT}
            </h2>
          </div>

          <ul
            className="mt-5 flex w-full max-w-full flex-nowrap items-center justify-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:mt-6 md:gap-2.5 [&::-webkit-scrollbar]:hidden"
            aria-label="Services we deliver"
          >
            {HOME_SERVICES.map((service) => (
              <li key={service.title} className="shrink-0">
                <span className="inline-flex min-h-[32px] items-center rounded-full border border-ink/10 bg-ink/[0.035] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/70 antialiased backdrop-blur-sm md:px-4 md:text-2xs">
                  {service.category}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 md:mt-6">
            <Button variant="dark" href="#contact">
              Start Your Project ↗
            </Button>
          </div>
        </Reveal>
      </div>

      <div className="w-full">
        <img
          src={FEATURE_IMAGES.whatWeDeliver}
          alt="Peraspera — creative work built to stand out in the crowd"
          loading="lazy"
          className="block h-auto w-full select-none"
        />
      </div>
    </section>
  );
}
