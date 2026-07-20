import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { InkParticleBackground } from '../components/InkParticleBackground';
import { PerasperaLabsBanner } from '../sections/FinalCTA';

export function LabsPage() {
  return (
    <div className="bg-ink text-white">
      <section className="relative overflow-hidden pt-[72px]">
        <InkParticleBackground />

        <Container className="relative z-[3] px-nav-x py-12 max-md:px-nav-x-mobile md:py-16">
          <Reveal>
            <PageBreadcrumb current="Labs" />
          </Reveal>
        </Container>

        <div className="relative z-[2]">
          <PerasperaLabsBanner />
        </div>
      </section>
    </div>
  );
}
