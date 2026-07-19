import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { PRINCIPLES } from '../../data/about-manifesto';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function AboutPrinciples() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 22 });
  const parallaxX = useTransform(springX, [-1, 1], [-12, 12]);
  const parallaxY = useTransform(springY, [-1, 1], [-8, 8]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const onMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
      mouseY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    section.addEventListener('mousemove', onMove);
    return () => section.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY, reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black px-nav-x py-section-y max-md:px-nav-x-mobile max-md:py-section-y-mobile"
    >
      <div className="mx-auto max-w-[1000px]">
        <p className="text-2xs font-black uppercase tracking-[0.24em] text-accent">Our Principles</p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {PRINCIPLES.map((principle, index) => (
            <motion.div
              key={principle}
              style={
                reduced
                  ? undefined
                  : {
                      x: index % 2 === 0 ? parallaxX : parallaxY,
                      y: index % 2 === 0 ? parallaxY : parallaxX,
                    }
              }
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 backdrop-blur-sm"
            >
              <span className="font-display text-base font-extrabold text-white md:text-lg">
                {principle}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
