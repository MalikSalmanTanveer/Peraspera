import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { PerasperaLabsBanner } from '../sections/FinalCTA';

export function LabsPage() {
  return (
    <div className="bg-paper text-ink">
      <section className="relative overflow-hidden pt-[72px] px-nav-x max-md:px-nav-x-mobile">
        <div className="hero-grid-bg pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true" />
        <Container className="relative z-[1] py-12 md:py-16">
          <Reveal>
            <PageBreadcrumb current="Labs" />
          </Reveal>
        </Container>
      </section>

      <PerasperaLabsBanner />
    </div>
  );
}
