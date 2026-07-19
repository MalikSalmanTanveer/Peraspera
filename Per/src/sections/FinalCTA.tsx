import labsLogo from '../assets/logos/PERASPERALAB.png';
import { LABS_HERO, LABS_PILLARS } from '../data/labs';
import { LABS_PROJECTS } from '../data/tools-stack';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { AppIcon } from '../components/AppIcon';
import { Reveal } from '../components/Reveal';
import { SectionGridDark } from '../components/SectionGridDark';

export function FinalCTA() {
  return (
    <section
      id="contact-cta"
      className="relative overflow-hidden bg-accent py-padding-final-cta-y px-nav-x text-center max-md:px-nav-x-mobile max-md:py-section-y-mobile"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45), transparent 40%), radial-gradient(circle at 80% 80%, rgba(13,13,13,0.12), transparent 35%)',
        }}
      />
      <Container className="relative z-[1] max-w-container-cta">
        <Reveal>
          <span className="section-label section-label-dark">Start Your Project</span>
          <h2 className="section-heading">Ready to build something with Peraspera?</h2>
          <p className="mx-auto mt-6 max-w-[650px] text-lg leading-body-lg text-overlay-ink-68">
            Share what you need and we&apos;ll recommend the right service, retainer, or project
            package for your team.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-gap-xs max-sm:flex-col">
            <Button variant="dark" href="#contact">
              Request Quote ↗
            </Button>
            <Button variant="outline" href="/services">
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
    <SectionGridDark id="peraspera-labs" className="py-20 px-nav-x max-md:px-nav-x-mobile md:py-24">
      <Container className="max-w-container">
        <Reveal>
          <div className="mx-auto max-w-[860px] text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-pill border border-overlay-accent-border-42 bg-accent/10 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-accent">
              <AppIcon name="FlaskConical" className="h-4 w-4" />
              {LABS_HERO.eyebrow}
            </div>
            <img
              src={labsLogo}
              alt={LABS_HERO.title}
              className="mx-auto h-auto w-[min(100%,560px)] max-w-none object-contain drop-shadow-[0_8px_32px_rgba(254,163,39,0.18)] md:w-[min(100%,640px)]"
            />
            <p className="mt-5 font-display text-[clamp(1.35rem,2.8vw,2rem)] font-extrabold leading-snug text-accent">
              {LABS_HERO.tagline}
            </p>
            <p className="mx-auto mt-6 max-w-[720px] text-md leading-body-xl text-overlay-white-55 md:text-lg">
              {LABS_HERO.summary}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {LABS_PILLARS.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 0.05}>
              <article className="flex h-full flex-col rounded-3xl border border-overlay-white-12 bg-overlay-white-08 p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
                  <AppIcon name={pillar.icon} className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-display text-lg font-extrabold leading-snug text-white md:text-xl">
                  {pillar.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-body text-overlay-white-55 md:text-md">
                  {pillar.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {LABS_PROJECTS.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.06}>
              <article className="flex h-full flex-col rounded-3xl border border-overlay-white-12 bg-overlay-white-08 p-6 md:p-8">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15">
                    <AppIcon name="Brain" className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-display text-xl font-extrabold leading-snug text-white md:text-2xl">
                    {project.title}
                  </h3>
                </div>
                <p className="flex-1 text-sm leading-body text-overlay-white-55 md:text-md">
                  {project.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="label-pill-equal border border-overlay-white-12 bg-black/30 text-accent">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-5">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-display text-sm-plus font-extrabold text-accent transition-colors hover:text-white"
                    >
                      Live Demo
                      <AppIcon name="ArrowUpRight" className="h-4 w-4" strokeWidth={2.25} />
                    </a>
                  ) : null}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-display text-sm-plus font-extrabold text-white transition-colors hover:text-accent"
                  >
                    View on GitHub
                    <AppIcon name="ArrowUpRight" className="h-4 w-4" strokeWidth={2.25} />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </SectionGridDark>
  );
}
