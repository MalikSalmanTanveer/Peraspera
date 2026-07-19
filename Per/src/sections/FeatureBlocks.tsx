import { FEATURE_IMAGES } from '../data/feature-images';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';

const MERGED_FEATURE = {
  label: 'Brand & Product Studio',
  title: 'Premium brand identity and technical execution — unified in one studio.',
  description:
    'We combine brand clarity with technical delivery so your business looks trusted and runs on solid systems. From logos, guidelines, and marketing assets to websites, SaaS products, AI automation, and apps — one team handles the full journey from first impression to live product.',
  items: [
    'Logo, brand identity, visual guidelines, and marketing assets',
    'Corporate websites, landing pages, and ecommerce experiences',
    'SaaS dashboards, CRM systems, web apps, and MVPs',
    'AI chatbots, WhatsApp automation, and workflow systems',
  ],
  cta: 'Start Your Project ↗',
  image: FEATURE_IMAGES.brandTrusted,
} as const;

export function FeatureBlocks() {
  return (
    <section className="bg-white py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile">
      <Container>
        <Reveal>
          <SectionHeader label="What We Deliver" title={MERGED_FEATURE.title} />
        </Reveal>

        <Reveal delay={0.06}>
          <article className="grid grid-cols-1 items-center gap-10 xl:grid-cols-2 xl:gap-16">
            <div className="relative">
              <span
                className="pointer-events-none absolute -left-1 -top-6 z-[1] font-display text-[clamp(4rem,8vw,6.5rem)] font-extrabold leading-none tracking-tighter text-accent/15 max-md:-top-4"
                aria-hidden="true"
              >
                01
              </span>
              <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-ink shadow-[0_28px_90px_rgba(0,0,0,0.1)]">
                <img
                  src={MERGED_FEATURE.image}
                  alt={MERGED_FEATURE.label}
                  loading="lazy"
                  className="aspect-[5/4] w-full object-cover object-center transition-transform duration-image hover:scale-[1.02] md:aspect-[4/3]"
                />
              </div>
            </div>

            <div className="xl:py-4">
              <div className="rounded-[1.5rem] border border-border bg-paper p-8 md:p-10">
                <div className="mb-5 flex items-center gap-3">
                  <span className="font-display text-sm font-extrabold tracking-widest text-accent">
                    (01)
                  </span>
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                  <span className="label-pill-equal bg-white text-accent-gold">
                    {MERGED_FEATURE.label}
                  </span>
                </div>

                <p className="text-muted leading-body-2xl">{MERGED_FEATURE.description}</p>

                <ul className="check-list mt-6 mb-8">
                  {MERGED_FEATURE.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <Button variant="dark" href="#contact">
                  {MERGED_FEATURE.cta}
                </Button>
              </div>
            </div>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
