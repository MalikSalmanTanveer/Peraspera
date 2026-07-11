import { FEATURE_IMAGES } from '../data/feature-images';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';

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
    reverse: false,
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
    reverse: true,
  },
] as const;

export function FeatureBlocks() {
  return (
    <section className="bg-white py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile">
      <Container>
        {FEATURES.map((feature, i) => (
          <Reveal key={feature.title}>
            <div
              className={`grid grid-cols-1 xl:grid-cols-2 gap-gap-xl items-center ${i < FEATURES.length - 1 ? 'mb-gap-split' : ''} ${feature.reverse ? 'xl:[&>*:first-child]:order-2' : ''}`}
            >
              <div className="relative rounded-hero-image overflow-hidden min-h-[500px] max-md:min-h-[340px] bg-ink">
                <img
                  src={feature.image}
                  alt={feature.label}
                  loading="lazy"
                  className="w-full h-full min-h-[500px] max-md:min-h-[340px] object-cover object-right"
                />
              </div>

              <div>
                <span className="section-label">{feature.label}</span>
                <h2 className="section-heading">{feature.title}</h2>
                <p className="text-muted leading-body-2xl mt-5">{feature.description}</p>
                <ul className="check-list">
                  {feature.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Button variant="dark" href="#contact">
                  {feature.cta}
                </Button>
              </div>
            </div>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
