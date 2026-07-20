import { motion } from 'framer-motion';
import { FORWARD } from '../../data/about-manifesto';
import { Button } from '../Button';
import { Container } from '../Container';
import { InkParticleBackground } from '../InkParticleBackground';
import { PageBreadcrumb } from '../PageBreadcrumb';

export function AboutForward() {
  return (
    <section className="relative overflow-hidden bg-ink pt-[72px] text-white px-nav-x max-md:px-nav-x-mobile">
      <InkParticleBackground />

      <Container className="relative z-[3] py-12 md:py-16">
        <PageBreadcrumb current="About" />
      </Container>

      <div className="relative z-[2] flex min-h-[calc(90svh-10rem)] items-center justify-center pb-section-y max-md:pb-section-y-mobile">
        <div className="mx-auto max-w-[880px] text-center">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
            className="font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-snug tracking-tight text-white"
          >
            {FORWARD.statement}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16"
          >
            <p className="font-display text-sm font-extrabold uppercase tracking-[0.35em] text-accent">
              Per Aspera
            </p>
            <p className="mt-4 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold text-white">
              {FORWARD.tagline}
            </p>
            <div className="mt-10">
              <Button variant="yellow" href="/#contact">
                Start Building With Us ↗
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
