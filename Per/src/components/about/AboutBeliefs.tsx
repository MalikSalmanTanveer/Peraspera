import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MANIFESTO_BELIEFS } from '../../data/about-manifesto';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function AboutBeliefs() {
  const sectionRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${MANIFESTO_BELIEFS.length * 100}%`,
        pin: true,
        scrub: 0.35,
        onUpdate: (self) => {
          const nextProgress = self.progress;
          setProgress(nextProgress);

          const index = Math.min(
            MANIFESTO_BELIEFS.length - 1,
            Math.floor(nextProgress * MANIFESTO_BELIEFS.length),
          );
          setActive(index);

          if (fillRef.current) {
            fillRef.current.style.transform = `scaleX(${nextProgress})`;
          }
          if (thumbRef.current) {
            thumbRef.current.style.left = `calc(${nextProgress * 100}% - 8px)`;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <section className="bg-ink px-nav-x py-section-y max-md:px-nav-x-mobile max-md:py-section-y-mobile">
        <div className="mx-auto max-w-[920px]">
          <p className="text-2xs font-black uppercase tracking-[0.24em] text-accent">What We Believe</p>
          <div className="mt-12 space-y-16">
            {MANIFESTO_BELIEFS.map((belief) => (
              <article key={belief.title}>
                <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
                  {belief.title}
                </h2>
                <p className="mt-4 max-w-[560px] text-lg text-overlay-white-55">{belief.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const belief = MANIFESTO_BELIEFS[active];
  const slideLabel = String(active + 1).padStart(2, '0');
  const totalLabel = String(MANIFESTO_BELIEFS.length).padStart(2, '0');

  return (
    <section ref={sectionRef} className="relative bg-ink">
      <div className="flex min-h-[100svh] items-center px-nav-x max-md:px-nav-x-mobile">
        <div className="mx-auto w-full max-w-[920px]">
          <p className="text-2xs font-black uppercase tracking-[0.24em] text-accent">What We Believe</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={belief.title}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="mt-8 font-display text-[clamp(2.25rem,5vw,4rem)] font-extrabold leading-[1.06] tracking-tight text-white">
                {belief.title}
              </h2>
              <p className="mt-8 max-w-[560px] text-lg leading-body-xl text-overlay-white-55">
                {belief.text}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-14">
            <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-overlay-white-46">
              <span>{slideLabel}</span>
              <span>{totalLabel}</span>
            </div>
            <div
              className="relative h-1.5 w-full rounded-full bg-white/12"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-label="Belief progress"
            >
              <div
                ref={fillRef}
                className="absolute inset-0 origin-left rounded-full bg-accent will-change-transform"
                style={{ transform: `scaleX(${progress})` }}
              />
              <div
                ref={thumbRef}
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-ink bg-accent shadow-[0_0_18px_rgba(254,163,39,0.55)] will-change-[left]"
                style={{ left: `calc(${progress * 100}% - 8px)` }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
