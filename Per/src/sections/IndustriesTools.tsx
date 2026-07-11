import { INDUSTRIES, TOOLS } from '../data/content';
import { AppIcon } from '../components/AppIcon';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';

export function IndustriesGrid() {
  return (
    <section className="py-section-y pb-28 px-nav-x max-md:py-section-y-mobile max-md:pb-20 max-md:px-nav-x-mobile">
      <Container>
        <Reveal>
          <SectionHeader
            label="Industries We Serve"
            title="Creative support for different types of businesses."
          />
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-2">
          {INDUSTRIES.map((industry) => (
            <div
              key={industry.label}
              className="bg-white border border-border rounded-2xl py-5 px-5 font-display font-extrabold flex items-center gap-3 hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-medium"
            >
              <span className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <AppIcon name={industry.icon} className="w-4 h-4 text-accent-dark" />
              </span>
              {industry.label}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ToolsGrid() {
  return (
    <section className="bg-white py-section-y pb-32 px-nav-x max-md:py-section-y-mobile max-md:pb-24 max-md:px-nav-x-mobile">
      <Container>
        <Reveal>
          <SectionHeader
            label="Tools We Use"
            title="Professional tools for design, web, motion, and automation."
          />
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-2">
          {TOOLS.map((tool) => (
            <div
              key={tool}
              className="bg-white border border-border rounded-2xl py-5 px-5 font-display font-extrabold text-sm-plus"
            >
              {tool}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
