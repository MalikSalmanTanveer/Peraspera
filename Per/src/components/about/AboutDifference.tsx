import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DIFFERENCE_ROWS } from '../../data/about-manifesto';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function AboutDifference() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.diff-row', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="border-y border-white/[0.06] bg-ink px-nav-x py-section-y max-md:px-nav-x-mobile max-md:py-section-y-mobile"
    >
      <div className="mx-auto max-w-[920px]">
        <p className="text-2xs font-black uppercase tracking-[0.24em] text-accent">The Difference</p>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="font-display text-xl font-extrabold text-overlay-white-46">
              Traditional Agency
            </h3>
            <ul className="mt-6 space-y-4">
              {DIFFERENCE_ROWS.map((row) => (
                <li
                  key={row.traditional}
                  className="diff-row rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-overlay-white-55"
                >
                  {row.traditional}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-xl font-extrabold text-accent">Per Aspera</h3>
            <ul className="mt-6 space-y-4">
              {DIFFERENCE_ROWS.map((row) => (
                <li
                  key={row.peraspera}
                  className="diff-row rounded-2xl border border-accent/25 bg-accent/[0.08] px-5 py-4 font-semibold text-white"
                >
                  {row.peraspera}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
