import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TURNING_POINT } from '../../data/about-manifesto';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function AboutTurningPoint() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.timeline-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
        opacity: 0,
        x: -24,
        duration: 0.7,
        stagger: 0.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="border-y border-white/[0.06] bg-black px-nav-x py-section-y max-md:px-nav-x-mobile max-md:py-section-y-mobile"
    >
      <div className="mx-auto max-w-[820px]">
        <p className="text-2xs font-black uppercase tracking-[0.24em] text-accent">The Turning Point</p>
        <p className="mt-8 font-display text-5xl font-extrabold text-white md:text-6xl">
          {TURNING_POINT.intro}
        </p>

        <ul className="mt-12 space-y-4 border-l border-accent/30 pl-8">
          {TURNING_POINT.lines.map((line) => (
            <li key={line} className="timeline-item text-lg text-overlay-white-55 md:text-xl">
              {line}
            </li>
          ))}
        </ul>

        <p className="timeline-item mt-12 text-md font-semibold uppercase tracking-widest text-overlay-white-46">
          Despite different clients...
        </p>
        <ul className="mt-6 space-y-3">
          {TURNING_POINT.pattern.map((line) => (
            <li key={line} className="timeline-item font-display text-2xl font-extrabold text-white md:text-3xl">
              {line}
            </li>
          ))}
        </ul>

        <div className="timeline-item mt-16 space-y-4 border-t border-white/10 pt-12">
          {TURNING_POINT.reveal.map((line) => (
            <p
              key={line}
              className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold leading-snug text-white"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
