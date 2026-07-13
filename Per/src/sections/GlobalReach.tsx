import { SERVED_COUNTRIES } from '../data/countries';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { WorldMap } from '../components/WorldMap';

export function GlobalReach() {
  return (
    <section
      id="global-reach"
      className="bg-ink text-white py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile"
    >
      <Container>
        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-gap-xl items-center">
          <Reveal>
            <span className="section-label section-label-light">Global Reach</span>
            <h2 className="section-heading text-white">
              Serving clients across six countries worldwide.
            </h2>
            <p className="text-overlay-white-55 leading-body-2xl mt-6 max-w-[480px]">
              Peraspera works with teams in the United States, Canada, United Kingdom, Germany,
              UAE, and Pakistan — delivering design, web, and AI projects remotely and on-site.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              {SERVED_COUNTRIES.map((country) => (
                <div
                  key={country.code}
                  title={country.name}
                  className="flex items-center justify-center w-14 h-14 rounded-2xl bg-overlay-white-08 border border-overlay-white-12 text-3xl hover:border-accent/50 hover:bg-accent/10 transition-colors duration-normal"
                  aria-label={country.name}
                >
                  <span role="img" aria-hidden="true">
                    {country.flag}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <WorldMap />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
