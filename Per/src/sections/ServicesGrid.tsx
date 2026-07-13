import { SERVICES } from '../data/content';
import { SERVICE_IMAGE_BY_TITLE } from '../data/service-images';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';

export function ServicesGrid() {
  return (
    <section
      id="services"
      className="py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile"
    >
      <Container>
        <Reveal>
          <SectionHeader
            label="What We Do"
            title="Everything your business needs to look professional and grow online."
            description="Twelve connected service categories across AI, engineering, design, growth, finance, intelligence, and strategy."
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-gap-service">
          {SERVICES.map((service, i) => {
            const image = SERVICE_IMAGE_BY_TITLE[service.title];

            return (
              <Reveal key={service.title} delay={i * 0.05}>
                <article className="bg-white border border-border rounded-8xl overflow-hidden transition-all duration-card hover:-translate-y-[7px] hover:shadow-card-hover group">
                  {image ? (
                    <div className="h-[280px] w-full overflow-hidden bg-ink">
                      <img
                        src={image}
                        alt={`${service.title} preview`}
                        loading="lazy"
                        className="h-full w-full object-cover object-right transition-transform duration-image group-hover:scale-[1.04]"
                      />
                    </div>
                  ) : null}
                  <div className="p-padding-card">
                    <span className="text-xs font-black uppercase tracking-widest text-accent-gold">
                      {service.category}
                    </span>
                    <h3 className="font-display text-[clamp(1.35rem,2.2vw,1.75rem)] font-extrabold my-3 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted leading-body mb-[18px] line-clamp-4">{service.description}</p>
                    <strong className="text-sm-plus font-bold">{service.linkLabel} ↗</strong>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
