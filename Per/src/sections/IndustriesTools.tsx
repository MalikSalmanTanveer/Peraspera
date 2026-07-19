import { ALL_STACK_TOOLS, splitToolsForMarquee } from '../data/tools-stack';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { ToolsMarquee } from '../components/ToolsMarquee';

const [rowOne, rowTwo] = splitToolsForMarquee(ALL_STACK_TOOLS);

export function ToolsGrid() {
  return (
    <section
      id="tools-stack"
      className="relative overflow-hidden border-t border-white/[0.06] bg-black py-section-y max-md:py-section-y-mobile"
    >
      <Container className="relative z-[1] mb-12 px-nav-x max-md:mb-10 max-md:px-nav-x-mobile">
        <Reveal>
          <div className="mx-auto max-w-[820px] text-center">
            <span className="section-label section-label-light">Tools We Use</span>
            <h2 className="section-heading text-white">
              A curated stack for modern product delivery.
            </h2>
            <p className="mt-[18px] text-md-plus leading-body-lg text-overlay-white-55">
              Official logos from the platforms we use daily — AI, automation, design, web,
              product, and analytics.
            </p>
          </div>
        </Reveal>
      </Container>

      <div className="relative z-[1] space-y-6 mask-marquee px-2 pt-8 pb-6 md:space-y-8 md:pt-10">
        <ToolsMarquee tools={rowOne} direction="left-tools" />
        <ToolsMarquee tools={rowTwo} direction="right-tools" />
      </div>
    </section>
  );
}
