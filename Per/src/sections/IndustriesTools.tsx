import { ALL_STACK_TOOLS, splitToolsForMarquee } from '../data/tools-stack';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { ToolsMarquee } from '../components/ToolsMarquee';

const [rowOne, rowTwo] = splitToolsForMarquee(ALL_STACK_TOOLS);

export function ToolsGrid() {
  return (
    <section
      id="tools-stack"
      className="relative overflow-hidden bg-black py-section-y max-md:py-section-y-mobile"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-accent/8 blur-[140px]"
        aria-hidden="true"
      />

      <Container className="relative z-[1] mb-14 px-nav-x max-md:px-nav-x-mobile">
        <Reveal>
          <div className="mx-auto max-w-[820px] text-center">
            <span className="section-label section-label-light">Tools We Use</span>
            <h2 className="section-heading text-white">
              {ALL_STACK_TOOLS.length}+ technologies powering our builds.
            </h2>
            <p className="mt-[18px] text-md-plus leading-body-lg text-overlay-white-55">
              From AI and automation to design, web, mobile, analytics, and eCommerce — the full
              stack behind Peraspera projects.
            </p>
          </div>
        </Reveal>
      </Container>

      <div className="relative z-[1] space-y-10 mask-marquee py-2 pb-8">
        <ToolsMarquee tools={rowOne} direction="left-tools" />
        <ToolsMarquee tools={rowTwo} direction="right-tools" />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
