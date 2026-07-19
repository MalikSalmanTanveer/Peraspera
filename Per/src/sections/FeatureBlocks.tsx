import { FEATURE_IMAGES } from '../data/feature-images';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';

const FEATURES = [
  {
    index: '01',
    label: 'Premium Brand Design',
    title: 'Make your business look trusted before the first conversation.',
    description:
      'Your brand visuals shape how people judge your company. We create identity systems, marketing assets, and websites that make your business feel serious, clean, and premium.',
    items: [
      'Logo, brand identity, and visual guidelines',
      'Company profile, pitch deck, and business brochure',
      'Social media, ads, packaging, and marketing assets',
      'Editable source files and export-ready deliverables',
    ],
    cta: 'Start Branding Project ↗',
    image: FEATURE_IMAGES.brandTrusted,
    reverse: false,
  },
  {
    index: '02',
    label: 'Web, Product & AI',
    title: 'Build websites, SaaS products, and AI systems with one team.',
    description:
      'We support both visual design and technical implementation, helping you move from idea to website, dashboard, CRM, app, or automated workflow.',
    items: [
      'Corporate websites, landing pages, and ecommerce',
      'SaaS dashboards, CRM systems, and web applications',
      'AI chatbots, WhatsApp automation, and workflow systems',
      'Mobile apps, MVPs, admin panels, and API integrations',
    ],
    cta: 'Explore Full Services ↗',
    image: FEATURE_IMAGES.webProductAi,
    reverse: true,
  },
] as const;

export function FeatureBlocks() {
  return (
    <section className="bg-white py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile">
      <Container>
        <Reveal>
          <SectionHeader
            label="What We Deliver"
            title="Brand clarity and technical execution — unified in one studio."
          />
        </Reveal>

        <div className="flex flex-col gap-20 md:gap-28">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.06}>
              <article
                className={`grid grid-cols-1 items-center gap-10 xl:grid-cols-2 xl:gap-16 ${
                  feature.reverse ? 'xl:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="relative">
                  <span
                    className="pointer-events-none absolute -left-1 -top-6 z-[1] font-display text-[clamp(4rem,8vw,6.5rem)] font-extrabold leading-none tracking-tighter text-accent/15 max-md:-top-4"
                    aria-hidden="true"
                  >
                    {feature.index}
                  </span>
                  <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-ink shadow-[0_28px_90px_rgba(0,0,0,0.1)]">
                    <img
                      src={feature.image}
                      alt={feature.label}
                      loading="lazy"
                      className="aspect-[5/4] w-full object-cover object-center transition-transform duration-image hover:scale-[1.02] md:aspect-[4/3]"
                    />
                  </div>
                </div>

                <div className="xl:py-4">
                  <div className="rounded-[1.5rem] border border-border bg-paper p-8 md:p-10">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="font-display text-sm font-extrabold tracking-widest text-accent">
                        ({feature.index})
                      </span>
                      <span className="h-px flex-1 bg-border" aria-hidden="true" />
                      <span className="label-pill-equal bg-white text-accent-gold">
                        {feature.label}
                      </span>
                    </div>

                    <h3 className="font-display text-[clamp(1.65rem,2.8vw,2.35rem)] font-extrabold leading-snug tracking-snug text-ink">
                      {feature.title}
                    </h3>
                    <p className="mt-5 text-muted leading-body-2xl">{feature.description}</p>

                    <ul className="check-list mt-6 mb-8">
                      {feature.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <Button variant="dark" href="#contact">
                      {feature.cta}
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
