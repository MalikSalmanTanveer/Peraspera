import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { PerasperaLabsBanner } from '../sections/FinalCTA';

export function LabsPage() {
  return (
    <div className="bg-ink text-white">
      <section className="relative overflow-hidden pt-[72px]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,rgba(254,163,39,0.12),transparent_55%)]"
          aria-hidden="true"
        />
        <Container className="relative z-[1] px-nav-x pb-4 pt-12 md:pb-6 md:pt-16 max-md:px-nav-x-mobile">
          <Reveal>
            <PageBreadcrumb current="Labs" />
          </Reveal>
        </Container>
      </section>

      <PerasperaLabsBanner />
    </div>
  );
}
