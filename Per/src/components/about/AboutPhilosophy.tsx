import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PHILOSOPHY_TOOLS } from '../../data/about-manifesto';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function AboutPhilosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.philosophy-tool', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'center center',
          scrub: 0.6,
        },
        opacity: 0,
        y: 40,
        stagger: 0.08,
      });

      gsap.from('.philosophy-line', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 55%',
          end: 'bottom 40%',
          scrub: 0.8,
        },
        scaleX: 0,
        transformOrigin: 'left center',
        stagger: 0.05,
      });

      gsap.from('.philosophy-reveal', {
        scrollTrigger: {
          trigger: '.philosophy-reveal',
          start: 'top 85%',
        },
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink px-nav-x py-section-y max-md:px-nav-x-mobile max-md:py-section-y-mobile"
    >
      <div className="mx-auto max-w-[920px]">
        <p className="text-2xs font-black uppercase tracking-[0.24em] text-accent">Our Philosophy</p>
        <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-tight text-white">
          Most businesses don&apos;t have a people problem.
          <br />
          <span className="text-overlay-white-55">They have a systems problem.</span>
        </h2>
        <p className="mt-8 max-w-[640px] text-md-plus leading-body-xl text-overlay-white-55">
          Companies often purchase disconnected solutions — each powerful on its own, none designed
          to work as one. The result: more time managing tools than building the future.
        </p>

        <div className="relative mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
          {PHILOSOPHY_TOOLS.map((tool) => (
            <div
              key={tool}
              className="philosophy-tool rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-6 text-center backdrop-blur-sm"
            >
              <span className="font-display text-lg font-extrabold text-white md:text-xl">{tool}</span>
            </div>
          ))}
        </div>

        <div className="relative mt-10 hidden md:block" aria-hidden="true">
          <div className="philosophy-line absolute left-[16%] top-4 h-px w-[68%] bg-accent/40" />
          <div className="philosophy-line absolute left-[10%] top-12 h-px w-[80%] bg-accent/25" />
        </div>

        <div className="philosophy-reveal mt-20 text-center">
          <p className="font-display text-sm font-extrabold uppercase tracking-[0.35em] text-accent">
            Per Aspera
          </p>
          <p className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight text-white">
            Everything Connected.
          </p>
        </div>
      </div>
    </section>
  );
}
