import { motion } from 'framer-motion';
import { HERO_STATS } from '../data/site';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { CountUp } from '../components/CountUp';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { Reveal } from '../components/Reveal';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-end bg-ink text-white overflow-hidden pt-[170px] pb-28 px-nav-x max-md:pt-hero-pt-mobile max-md:pb-20 max-md:min-h-0 max-md:px-nav-x-mobile">
      <div className="hero-grid-bg absolute inset-0" aria-hidden="true" />
      <motion.div
        className="orb absolute rounded-full blur-[120px] w-[700px] h-[700px] bg-accent opacity-[0.18] -right-40 -top-[150px]"
        aria-hidden="true"
        animate={{ scale: [1, 1.08, 1], opacity: [0.16, 0.22, 0.16] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="orb absolute rounded-full blur-[120px] w-[460px] h-[460px] bg-white opacity-[0.055] -left-[90px] -bottom-[120px]"
        aria-hidden="true"
      />

      <Container className="relative z-[2] w-full">
        <div className="grid grid-cols-1 3xl:grid-cols-[1.06fr_0.94fr] gap-gap-xl items-end">
          <Reveal>
            <motion.div
              className="inline-flex gap-2 items-center text-xs font-extrabold uppercase tracking-widest text-overlay-white-48 mb-8 before:content-[''] before:w-2 before:h-2 before:bg-accent before:rounded-full before:animate-pulse"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Peraspera — Design · Web · AI Studio
            </motion.div>

            <h1 className="font-display text-hero font-extrabold leading-hero tracking-tighter max-md:text-hero-mobile">
              Design, websites and AI systems built to help your brand{' '}
              <motion.em
                className="not-italic text-accent inline-block"
                animate={{ textShadow: ['0 0 0px transparent', '0 0 24px rgba(254,163,39,0.35)', '0 0 0px transparent'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                stand apart.
              </motion.em>
            </h1>

            <p className="max-w-[760px] mt-8 text-xl font-light leading-body-xl text-overlay-white-55 max-md:text-md-plus">
              Peraspera partners with teams to deliver brand identity, UI/UX, websites, SaaS
              products, AI automation, mobile apps, MVPs, and ongoing creative support.
            </p>

            <div className="flex gap-gap-xs flex-wrap mt-10 max-sm:flex-col">
              <Button variant="yellow" href="#contact">
                Start a Project ↗
              </Button>
              <Button variant="light" href="#services">
                Explore Services
              </Button>
            </div>

            <dl className="grid grid-cols-2 md:grid-cols-4 gap-gap-md mt-20 pt-12 border-t border-overlay-white-09 max-sm:grid-cols-1">
              {HERO_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <dt className="font-display text-7xl text-white leading-none">
                    <CountUp value={stat.value} />
                  </dt>
                  <dd className="mt-2 text-sm-plus text-overlay-white-43">{stat.label}</dd>
                </motion.div>
              ))}
            </dl>
          </Reveal>

          <div className="relative min-h-[580px] hidden 3xl:block">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <PlaceholderImage
                gradient="from-violet-500/40 via-indigo-600/30 to-ink"
                className="absolute left-0 top-0 w-[54%] h-[300px] rounded-hero-image border border-overlay-white-12 shadow-hero-image object-cover"
                label="Agency workspace preview"
              />
              <PlaceholderImage
                gradient="from-orange-400/35 via-accent/25 to-ink"
                className="absolute right-0 bottom-0 w-[78%] h-[430px] rounded-hero-image border border-overlay-white-12 shadow-hero-image object-cover"
                label="Creative team collaboration"
              />
            </motion.div>
            <motion.div
              className="absolute left-[12%] bottom-[70px] bg-overlay-white-08 backdrop-blur-[18px] border border-overlay-white-12 rounded-floating-card p-5 max-w-[260px]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="inline-flex bg-accent text-ink rounded-pill px-2.5 py-[5px] text-2xs font-black uppercase tracking-wider mb-3">
                Peraspera Retainer
              </span>
              <p className="text-base text-overlay-white-72 leading-loose">
                One studio partner for branding, web, UI/UX, AI, and product design.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
