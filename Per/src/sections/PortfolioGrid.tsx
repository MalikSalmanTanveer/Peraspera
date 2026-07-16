import { Link } from 'react-router-dom';
import { PORTFOLIO } from '../data/content';
import { WORK_IMAGES } from '../data/works';
import { Container } from '../components/Container';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { Button } from '../components/Button';

const PORTFOLIO_SPANS: Record<string, string> = {
  'col-span-7 row-span-2': 'xl:col-span-7 xl:row-span-2',
  'col-span-5': 'xl:col-span-5',
  'col-span-4': 'xl:col-span-4',
};

export function PortfolioGrid() {
  return (
    <section
      id="work"
      className="bg-paper py-section-y pb-32 px-nav-x max-md:py-section-y-mobile max-md:pb-24 max-md:px-nav-x-mobile"
    >
      <Container>
        <Reveal>
          <SectionHeader
            label="Selected Work"
            title="Sample projects across branding, websites, UI/UX, and campaigns."
            description="A selection of Peraspera studio work — brand systems, product UI, landing pages, and campaign visuals."
          />
          <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
            <Button variant="dark" href="/portfolio">
              View All Client Projects ↗
            </Button>
            <Link
              to="/portfolio"
              className="font-body text-sm-plus font-semibold text-muted transition-colors hover:text-ink"
            >
              11 live websites →
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 xl:grid-cols-12 auto-rows-[300px] xl:auto-rows-[280px] gap-5 xl:gap-gap-portfolio mt-4">
          {PORTFOLIO.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <Link
                to="/portfolio"
                className={`relative block rounded-8xl overflow-hidden bg-dark-elevated text-white transition-transform duration-card hover:-translate-y-2 group h-full min-h-[280px] ${PORTFOLIO_SPANS[item.span] ?? ''}`}
              >
                {item.imageIndex !== undefined ? (
                  <img
                    src={WORK_IMAGES[item.imageIndex % WORK_IMAGES.length]}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-image-slow group-hover:scale-[1.06]"
                  />
                ) : (
                  <PlaceholderImage
                    gradient={item.gradient}
                    className="w-full h-full transition-transform duration-image-slow group-hover:scale-[1.06]"
                    label={item.title}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-overlay-ink-92 via-overlay-ink-40/20 to-transparent flex flex-col justify-end p-8">
                  <span className="text-2xs font-black uppercase tracking-widest text-accent">
                    {item.category}
                  </span>
                  <h3 className="font-display text-4xl md:text-5xl font-extrabold mt-3">{item.title}</h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
