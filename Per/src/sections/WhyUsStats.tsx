import { WHY_STATS } from '../data/content';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { CountUp } from '../components/CountUp';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { Reveal } from '../components/Reveal';

export function WhyUsStats() {
  return (
    <section
      id="about"
      className="py-section-y pb-28 px-nav-x max-md:py-section-y-mobile max-md:pb-20 max-md:px-nav-x-mobile"
    >
      <Container>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-gap-xl items-center">
          <Reveal>
            <div>
              <span className="section-label">Why Peraspera</span>
              <h2 className="section-heading">
                One studio for design, websites, product, and automation.
              </h2>
              <p className="text-muted leading-body-2xl mt-6 mb-2">
                Peraspera brings brand, UI/UX, development, and AI automation together under one
                team — so your product, marketing, and technology stay aligned from day one.
              </p>
              <div className="grid grid-cols-2 gap-5 mt-10">
                {WHY_STATS.map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 0.08}>
                    <div className="bg-paper border border-border rounded-5xl p-6 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-card">
                      <strong className="block font-display text-6xl text-accent-gold">
                        <CountUp value={stat.value} duration={1600} />
                      </strong>
                      <span className="text-sm-plus text-muted mt-2 block">{stat.label}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-5">
              <PlaceholderImage
                gradient="from-violet-500/40 to-ink"
                className="col-span-2 h-[320px] max-md:h-[260px] rounded-5xl"
                label="Studio work preview"
              />
              <PlaceholderImage
                gradient="from-orange-400/40 to-ink"
                className="h-[260px] rounded-5xl"
                label="Brand design preview"
              />
              <PlaceholderImage
                gradient="from-emerald-500/40 to-ink"
                className="h-[260px] rounded-5xl"
                label="Product UI preview"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export function CreativeStudio() {
  const images = [
    { size: 'short', gradient: 'from-rose-500/40 to-dark-card' },
    { size: 'tall', gradient: 'from-violet-500/40 to-dark-card' },
    { size: 'short', gradient: 'from-orange-400/40 to-dark-card' },
    { size: 'tall', gradient: 'from-blue-500/40 to-dark-card' },
    { size: 'short', gradient: 'from-emerald-500/40 to-dark-card' },
    { size: 'tall', gradient: 'from-pink-500/40 to-dark-card' },
  ] as const;

  return (
    <section id="about" className="bg-ink pt-padding-innov-y pb-16 overflow-hidden">
      <Container wide className="px-nav-x max-md:px-nav-x-mobile">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-gap-innov items-center mb-16 max-lg:px-6">
          <h2 className="font-display text-innov font-extrabold leading-tight tracking-tight text-white">
            Premium creative execution across design, web, product, and AI.
          </h2>
          <div>
            <p className="text-md text-overlay-white-55 leading-body-2xl mb-4">
              Peraspera unites brand identity, UI/UX, web, SaaS, AI automation, and campaign
              content in one connected studio workflow.
            </p>
            <p className="text-md text-overlay-white-55 leading-body-2xl mb-6">
              Use this studio support for launches, redesigns, marketing systems, and ongoing design
              needs.
            </p>
            <Button variant="yellow" href="#services" className="text-sm-plus py-3 px-6">
              Explore Services →
            </Button>
          </div>
        </div>
      </Container>

      <div className="overflow-hidden pb-14 max-lg:pb-10">
        <div className="flex items-center gap-4 w-max animate-scroll-left-innov pl-nav-x max-lg:pl-6 hover:[animation-play-state:paused]">
          {[...images, ...images].map((img, i) => (
            <PlaceholderImage
              key={i}
              gradient={img.gradient}
              className={`rounded-3xl shrink-0 overflow-hidden ${img.size === 'short' ? 'w-[200px] h-[200px] max-lg:w-40 max-lg:h-40' : 'w-[220px] h-[380px] max-lg:w-[180px] max-lg:h-[300px]'}`}
              label="Creative studio work"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
