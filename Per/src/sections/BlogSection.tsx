import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';

export function BlogSection() {
  return (
    <section
      id="blog"
      className="bg-paper py-section-y px-nav-x max-md:py-section-y-mobile max-md:px-nav-x-mobile"
    >
      <Container>
        <Reveal>
          <SectionHeader
            label="Blog"
            title="Insights, updates, and studio notes."
            description="Articles on design, product, AI automation, and building brands — coming soon."
          />
        </Reveal>
      </Container>
    </section>
  );
}
