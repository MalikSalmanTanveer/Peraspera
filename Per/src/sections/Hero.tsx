import { motion } from 'framer-motion';
import { HERO_COPY, HERO_STATS } from '../data/site';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { CountUp } from '../components/CountUp';
import { Reveal } from '../components/Reveal';

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-ink px-nav-x pb-24 pt-[132px] text-white max-md:min-h-0 max-md:px-nav-x-mobile max-md:pb-20 max-md:pt-[120px]"
    >
      <div className="hero-grid-bg absolute inset-0 opacity-55" aria-hidden="true" />
      <motion.div
        className="orb absolute -right-32 -top-24 h-[560px] w-[560px] rounded-full bg-accent opacity-[0.14] blur-[120px]"
        aria-hidden="true"
        animate={{ scale: [1, 1.07, 1], opacity: [0.12, 0.18, 0.12] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="orb absolute -bottom-24 -left-20 h-[380px] w-[380px] rounded-full bg-white opacity-[0.04] blur-[100px]"
        aria-hidden="true"
      />

      <Container className="relative z-[2] w-full">
        <Reveal className="mx-auto flex max-w-[920px] flex-col items-center text-center">
          <h1 className="font-display text-[clamp(2.75rem,6.5vw,5.5rem)] font-extrabold leading-[1.02] tracking-tighter max-md:text-hero-mobile">
            {HERO_COPY.headline}{' '}
            <motion.em
              className="inline-block not-italic text-accent"
              animate={{
                textShadow: [
                  '0 0 0px transparent',
                  '0 0 28px rgba(254,163,39,0.4)',
                  '0 0 0px transparent',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {HERO_COPY.headlineAccent}
            </motion.em>
            <br className="hidden sm:block" />
            <span className="text-white"> {HERO_COPY.headlineEnd}</span>
          </h1>

          <p className="mt-8 max-w-[680px] text-lg font-light leading-body-xl text-overlay-white-55 max-md:text-md-plus">
            {HERO_COPY.subheading}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-gap-xs max-sm:flex-col max-sm:items-stretch">
            <Button variant="yellow" href={HERO_COPY.primaryCta.href}>
              {HERO_COPY.primaryCta.label} ↗
            </Button>
            <Button variant="light" href={HERO_COPY.secondaryCta.href}>
              {HERO_COPY.secondaryCta.label}
            </Button>
          </div>

          <dl className="mt-16 grid w-full max-w-[820px] grid-cols-2 gap-gap-md border-t border-overlay-white-09 pt-12 md:grid-cols-4 max-sm:grid-cols-1">
            {HERO_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <dt className="font-display text-5xl leading-none text-white md:text-6xl">
                  <CountUp value={stat.value} />
                </dt>
                <dd className="mt-2 text-sm-plus text-overlay-white-43">{stat.label}</dd>
              </motion.div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
