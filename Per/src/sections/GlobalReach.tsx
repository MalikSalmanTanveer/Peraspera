import mapImage from '../assets/maps.png';
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
          <img
            src={mapImage}
            alt="World map showing countries where Per Aspera serves clients"
            className="mt-10 w-full object-contain object-center"
            loading="lazy"
          />
        </Reveal>

        <CountryFlagsMarquee />
      </Container>
    </section>
  );
}
