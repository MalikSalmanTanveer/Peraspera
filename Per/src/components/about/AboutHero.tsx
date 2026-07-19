import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ABOUT_HERO } from '../../data/about-manifesto';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const NODES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: 8 + ((i * 37) % 84),
  y: 12 + ((i * 23) % 76),
  r: 1.2 + (i % 3) * 0.6,
}));

const EDGES: [number, number][] = [
  [0, 3], [3, 7], [7, 12], [12, 16], [16, 20], [20, 23],
  [1, 5], [5, 9], [9, 14], [14, 18], [2, 6], [6, 11],
  [11, 15], [15, 19], [4, 8], [8, 13], [13, 17], [17, 21],
  [0, 10], [10, 22], [3, 13], [7, 17],
];

export function AboutHero() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const parallaxX = useTransform(springX, [-1, 1], [-18, 18]);
  const parallaxY = useTransform(springY, [-1, 1], [-12, 12]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const onMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    section.addEventListener('mousemove', onMove);
    return () => section.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY, reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink px-nav-x pt-[96px] pb-24 max-md:px-nav-x-mobile"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={reduced ? undefined : { x: parallaxX, y: parallaxY }}
        aria-hidden="true"
      >
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          {EDGES.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke="rgba(254,163,39,0.22)"
              strokeWidth="0.12"
            />
          ))}
          {NODES.map((node) => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill="rgba(254,163,39,0.55)"
              className={reduced ? '' : 'animate-pulse'}
            />
          ))}
        </svg>
      </motion.div>

      <div className="relative z-[2] mx-auto max-w-[920px] text-center">
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(2.35rem,6vw,4.75rem)] font-extrabold leading-[1.02] tracking-tighter text-white"
        >
          {ABOUT_HERO.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-[640px] text-lg font-light leading-body-xl text-overlay-white-55 max-md:text-md-plus"
        >
          {ABOUT_HERO.subtext}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 text-overlay-white-46"
        aria-hidden="true"
      >
        <span className="text-2xs font-bold uppercase tracking-[0.2em]">Scroll</span>
        <span className="block h-10 w-px bg-gradient-to-b from-accent/80 to-transparent" />
      </motion.div>
    </section>
  );
}
