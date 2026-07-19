import { HOME_SERVICES } from '../data/content';
import { FEATURE_IMAGES } from '../data/feature-images';
import { Button } from '../components/Button';
import { Reveal } from '../components/Reveal';

const PREMIUM_STATEMENT =
  "Creating brands that aren't made to fit in, they're built to be remembered.";

export function FeatureBlocks() {
  return (
    <section id="what-we-deliver" className="bg-white" aria-labelledby="what-we-deliver-heading">
      <div className="px-nav-x pb-0 pt-section-y text-center max-md:px-nav-x-mobile max-md:pt-section-y-mobile">
        <Reveal className="mx-auto flex w-full max-w-[1120px] flex-col items-center">
          <span className="section-label section-label-dark mb-3 antialiased md:mb-4">
            What we offer
          </span>

          <h2
            id="what-we-deliver-heading"
            className="max-w-[920px] font-display text-[clamp(1.35rem,3.2vw,2.65rem)] font-extrabold leading-[1.12] tracking-tight text-ink antialiased"
          >
            {PREMIUM_STATEMENT}
          </h2>

          <ul
            className="mt-5 flex w-full max-w-full flex-nowrap items-center justify-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:mt-6 md:gap-2.5 [&::-webkit-scrollbar]:hidden"
            aria-label="Services we deliver"
          >
            {HOME_SERVICES.map((service) => (
              <li key={service.title} className="shrink-0">
                <span className="inline-flex min-h-[32px] items-center rounded-full bg-ink/[0.04] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/70 antialiased md:px-4 md:text-2xs">
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

      <div className="w-full overflow-hidden">
        <div className="relative aspect-[128/33] w-full max-md:aspect-[128/36]">
          <picture>
            <source
              type="image/webp"
              srcSet={`${FEATURE_IMAGES.whatWeDeliverWebp} 1x, ${FEATURE_IMAGES.whatWeDeliver2xWebp} 2x`}
            />
            <img
              src={FEATURE_IMAGES.whatWeDeliver}
              srcSet={`${FEATURE_IMAGES.whatWeDeliver} 1x, ${FEATURE_IMAGES.whatWeDeliver2x} 2x`}
              sizes="100vw"
              alt="Peraspera — brands built to be remembered"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
