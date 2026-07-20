import { HOME_SERVICES } from '../data/content';
import { SERVICE_CATEGORIES } from '../data/services';
import { SERVICE_IMAGE_BY_TITLE } from '../data/service-images';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';

export function ServicesGrid() {
  return (
    <section
      id="services"
      className="bg-ink py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile"
    >
      <Container>
        <Reveal>
          <SectionHeader
            label="Services"
            title="Everything your business needs to look professional and grow online."
            description="Six focused service categories across AI, branding, design, web, product, and finance."
            light
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-gap-service md:grid-cols-2 3xl:grid-cols-3">
          {HOME_SERVICES.map((service, i) => {
            const image = SERVICE_IMAGE_BY_TITLE[service.title];
            const category = SERVICE_CATEGORIES.find((item) => item.title === service.title);

            return (
              <Reveal key={service.title} delay={i * 0.05}>
                <a
                  href={category ? `/services#${category.id}` : '/services'}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black bg-white transition-[box-shadow] duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
                >
                  {image ? (
                    <div className="h-[280px] w-full shrink-0 overflow-hidden bg-[#111]">
                      <img
                        src={image}
                        alt={`${service.title} preview`}
                        loading="lazy"
                        className="h-full w-full object-cover object-right"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-padding-card">
                    <h3 className="font-display text-[clamp(1.35rem,2.2vw,1.75rem)] font-extrabold leading-tight tracking-tight text-ink antialiased">
                      {service.title}
                    </h3>
                    <p className="mb-[18px] mt-3 line-clamp-4 flex-1 text-sm leading-body text-muted antialiased">
                      {service.description}
                    </p>
                    <span className="text-sm-plus font-bold text-ink antialiased">{service.linkLabel} ↗</span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
