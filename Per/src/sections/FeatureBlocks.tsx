import { FEATURE_IMAGES } from '../data/feature-images';
import { Button } from '../components/Button';
import { Reveal } from '../components/Reveal';

export function FeatureBlocks() {
  return (
    <section
      id="what-we-deliver"
      className="relative w-full overflow-hidden bg-white"
      aria-labelledby="what-we-deliver-heading"
    >
      <img
        src={FEATURE_IMAGES.whatWeDeliver}
        alt=""
        loading="lazy"
        className="block h-auto w-full select-none"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 top-0 flex h-[44%] min-h-[148px] flex-col items-center justify-center px-nav-x text-center max-md:h-[40%] max-md:min-h-[128px] max-md:px-nav-x-mobile">
        <Reveal className="mx-auto flex max-w-[820px] flex-col items-center">
          <span className="section-label section-label-dark mb-3 antialiased md:mb-4">
            What We Deliver
          </span>
          <h2
            id="what-we-deliver-heading"
            className="font-display text-[clamp(1.45rem,3.6vw,2.65rem)] font-extrabold leading-[1.08] tracking-tight text-ink antialiased"
          >
            Brand clarity and technical execution — unified in one studio.
          </h2>
          <div className="mt-5 md:mt-7">
            <Button variant="dark" href="#contact">
              Start Your Project ↗
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
