import mapImage from '../assets/maps.png';
import mapImage2x from '../assets/maps-2x.png';
import mapImageWebp from '../assets/maps.webp';
import mapImage2xWebp from '../assets/maps-2x.webp';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { CountryFlagsMarquee } from '../components/CountryFlagsMarquee';

export function GlobalReach() {
  return (
    <section
      id="global-reach"
      className="bg-ink text-white py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile"
    >
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[920px] text-center">
            <span className="section-label section-label-light">Global Dominance</span>
            <h2 className="section-heading text-white">
              A worldwide footprint built on trust and delivery.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <picture>
            <source
              type="image/webp"
              srcSet={`${mapImageWebp} 1x, ${mapImage2xWebp} 2x`}
            />
            <img
              src={mapImage}
              srcSet={`${mapImage} 1x, ${mapImage2x} 2x`}
              sizes="(min-width: 1280px) 1120px, 100vw"
              alt="World map showing countries where Per Aspera serves clients"
              className="mt-10 w-full object-contain object-center"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </Reveal>

        <CountryFlagsMarquee />
      </Container>
    </section>
  );
}
