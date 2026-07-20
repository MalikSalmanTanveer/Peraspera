import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import aboutConnectedLogo from '../../assets/logos/About-connected-logo.png';
import { CONNECTED_NODES } from '../../data/about-manifesto';

export function AboutConnectedModel() {
  const [active, setActive] = useState<string | null>(null);
  const nodes = useMemo(
    () =>
      CONNECTED_NODES.map((label, index) => {
        const angle = (index / CONNECTED_NODES.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 42;
        return {
          label,
          x: 50 + Math.cos(angle) * radius,
          y: 50 + Math.sin(angle) * radius,
        };
      }),
    [],
  );

  return (
    <section className="relative overflow-hidden bg-black px-nav-x py-section-y max-md:px-nav-x-mobile max-md:py-section-y-mobile">
      <div className="mx-auto max-w-[1000px] text-center">
        <p className="text-2xs font-black uppercase tracking-[0.24em] text-accent">
          The Connected Intelligence Model
        </p>
        <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold tracking-tight text-white">
          Everything Works Together.
        </h2>
        <p className="mx-auto mt-5 max-w-[560px] text-md-plus leading-body-lg text-overlay-white-55">
          Businesses don&apos;t need more tools. They need connected intelligence.
        </p>
      </div>

      <div className="relative mx-auto mt-16 aspect-square max-w-[520px]">
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          {nodes.map((node, index) => (
            <g key={node.label}>
              <motion.line
                x1="50"
                y1="50"
                x2={node.x}
                y2={node.y}
                stroke={
                  active === null || active === node.label
                    ? 'rgba(254,163,39,0.45)'
                    : 'rgba(255,255,255,0.08)'
                }
                strokeWidth="0.15"
                animate={{ opacity: active === null || active === node.label ? 1 : 0.35 }}
              />
              <motion.circle
                cx={(50 + node.x) / 2}
                cy={(50 + node.y) / 2}
                r="0.35"
                fill="#fea327"
                animate={{
                  cx: [50, node.x, 50],
                  cy: [50, node.y, 50],
                  opacity: [0, 0.9, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut',
                }}
              />
            </g>
          ))}
        </svg>

        <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-accent/30 bg-black shadow-[0_0_40px_rgba(254,163,39,0.15)] md:h-32 md:w-32">
          <img
            src={aboutConnectedLogo}
            alt="Per Aspera"
            className="h-[82%] w-[82%] object-contain"
          />
        </div>

        {nodes.map((node) => (
          <button
            key={node.label}
            type="button"
            onMouseEnter={() => setActive(node.label)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(node.label)}
            onBlur={() => setActive(null)}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-accent/10 md:text-2xs"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {node.label}
          </button>
        ))}
      </div>
    </section>
  );
}
