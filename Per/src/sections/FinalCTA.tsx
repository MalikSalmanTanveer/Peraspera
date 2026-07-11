import { BRAND } from '../data/site';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { AppIcon } from '../components/AppIcon';
import { Reveal } from '../components/Reveal';

export function FinalCTA() {
  return (
    <section
      id="contact-cta"
      className="py-padding-final-cta-y px-nav-x bg-accent text-center max-md:py-section-y-mobile max-md:px-nav-x-mobile relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45), transparent 40%), radial-gradient(circle at 80% 80%, rgba(13,13,13,0.12), transparent 35%)',
        }}
      />
      <Container className="max-w-container-cta relative z-[1]">
        <Reveal>
          <span className="section-label section-label-dark">Start Your Project</span>
          <h2 className="section-heading">Ready to build something with Peraspera?</h2>
          <p className="max-w-[650px] mx-auto mt-6 text-lg leading-body-lg text-overlay-ink-68">
            Share what you need and we&apos;ll recommend the right service, retainer, or project
            package for your team.
          </p>
          <div className="flex gap-gap-xs justify-center flex-wrap mt-10 max-sm:flex-col">
            <Button variant="dark" href="#contact">
              Request Quote ↗
            </Button>
            <Button variant="outline" href="#services">
              Explore Services
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function PerasperaLabsBanner() {
  return (
    <section
      id="peraspera-labs"
      className="py-24 px-nav-x bg-ink text-white max-md:py-20 max-md:px-nav-x-mobile border-y border-overlay-footer-border-07"
    >
      <Container className="max-w-container-cta text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-pill border border-overlay-accent-border-42 bg-accent/10 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-accent mb-6">
            <AppIcon name="FlaskConical" className="w-4 h-4" />
            Innovation Arm
          </div>
          <h2 className="font-display text-section font-extrabold leading-snug tracking-snug mb-5">
            {BRAND.labsLabel}
          </h2>
          <p className="text-md text-overlay-white-55 leading-body-xl max-w-[620px] mx-auto mb-8">
            Our lab explores AI products, automation prototypes, and experimental design systems —
            extending Peraspera&apos;s studio work into research and rapid builds.
          </p>
          <span
            className="inline-flex items-center gap-2 font-display text-sm-plus font-extrabold text-accent border-b border-dashed border-accent/60 pb-1 cursor-default"
            aria-label="Peraspera Labs link placeholder"
          >
            perasperalabs.com
            <AppIcon name="Globe" className="w-4 h-4" />
          </span>
        </Reveal>
      </Container>
    </section>
  );
}
