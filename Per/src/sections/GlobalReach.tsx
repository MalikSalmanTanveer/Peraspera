import mapImage from '../assets/maps.png';
import { GLOBAL_REACH_STATS } from '../data/countries';
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
          <div className="relative mt-10 overflow-hidden rounded-3xl border border-white/10 bg-black">
            <img
              src={mapImage}
              alt="World map showing countries where Per Aspera serves clients"
              className="w-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {GLOBAL_REACH_STATS.map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <div className="font-display text-3xl font-extrabold text-accent md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-overlay-white-48">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <CountryFlagsMarquee />
      </Container>
    </section>
  );
}
