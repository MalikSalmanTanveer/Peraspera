import { FEATURE_IMAGES } from '../data/feature-images';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { SectionGridDark } from '../components/SectionGridDark';

const FEATURES = [
  {
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
  },
  {
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
  },
] as const;

export function FeatureBlocks() {
  return (
    <SectionGridDark className="py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile">
      <Container>
        <Reveal>
          <div className="mx-auto mb-12 max-w-[760px] text-center md:mb-14">
            <span className="section-label section-label-light">What We Deliver</span>
            <h2 className="mt-4 font-display text-section font-extrabold leading-snug tracking-snug text-white">
              Brand clarity and technical execution — unified in one studio.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="overflow-hidden rounded-[2rem] border border-overlay-white-12 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
            <div className="grid grid-cols-1 xl:grid-cols-2">
              {FEATURES.map((feature, index) => (
                <article
                  key={feature.title}
                  className={`flex flex-col ${index === 0 ? 'border-b border-border xl:border-b-0 xl:border-r' : ''}`}
                >
                  <div className="relative h-[260px] overflow-hidden bg-ink md:h-[320px]">
                    <img
                      src={feature.image}
                      alt={feature.label}
                      loading="lazy"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-8 md:p-10">
                    <span className="label-pill-equal self-start bg-paper text-accent-gold">
                      {feature.label}
                    </span>
                    <h3 className="mt-4 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold leading-snug text-ink">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-muted leading-body-2xl">{feature.description}</p>
                    <ul className="check-list mt-6 flex-1">
                      {feature.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Button variant="dark" href="#contact">
                        {feature.cta}
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </SectionGridDark>
  );
}
