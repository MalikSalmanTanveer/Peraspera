import { forwardRef, useImperativeHandle, useRef } from 'react';
import { motion } from 'framer-motion';
import type { MeasuredImpactStat } from '../../data/measured-impact';

export interface MeasuredImpactCardHandle {
  counterEl: HTMLSpanElement | null;
  suffixEl: HTMLSpanElement | null;
  ratingStarEl: HTMLSpanElement | null;
}

interface MeasuredImpactCardProps {
  stat: MeasuredImpactStat;
  index: number;
  reducedMotion: boolean;
  finalDisplay: string;
}

export const MeasuredImpactCard = forwardRef<MeasuredImpactCardHandle, MeasuredImpactCardProps>(
  function MeasuredImpactCard({ stat, index, reducedMotion, finalDisplay }, ref) {
    const counterRef = useRef<HTMLSpanElement>(null);
    const suffixRef = useRef<HTMLSpanElement>(null);
    const ratingStarRef = useRef<HTMLSpanElement>(null);

    useImperativeHandle(ref, () => ({
      counterEl: counterRef.current,
      suffixEl: suffixRef.current,
      ratingStarEl: ratingStarRef.current,
    }));

    return (
      <motion.article
        initial={reducedMotion ? false : { opacity: 0, y: 40, scale: 0.96 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.75,
          delay: 0.15 + index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="group relative rounded-[20px] border border-white/10 bg-[#111111] p-6 transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out hover:-translate-y-2 hover:border-[#FFA94D]/35 hover:bg-[#161616] hover:shadow-[0_0_36px_rgba(255,169,77,0.12)] md:rounded-[22px] md:p-8"
      >
        <div className="relative mb-6 md:mb-7">
          <div
            className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(255,169,77,0.18),transparent_72%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />
          <span
            className="relative inline-block text-[1.65rem] leading-none transition-transform duration-300 group-hover:rotate-[3deg] md:text-[1.85rem]"
            aria-hidden="true"
          >
            {stat.icon}
          </span>
        </div>

        <div className="counter-wrap font-display text-[clamp(2rem,3.6vw,2.65rem)] font-extrabold leading-none tracking-tight text-white transition-transform duration-300 group-hover:scale-105">
          <span ref={counterRef}>{reducedMotion ? finalDisplay : stat.type === 'rating' ? '0.0' : '0'}</span>
          {stat.type === 'rating' ? (
            <>
              <span
                ref={ratingStarRef}
                className={`ml-0.5 text-[#FFA94D] transition-opacity duration-300 ${reducedMotion ? 'opacity-100' : 'opacity-0'}`}
              >
                ★
              </span>
              <span className="ml-2 text-[clamp(1.1rem,2vw,1.35rem)] font-bold text-white/55">/ 5</span>
            </>
          ) : (
            <span
              ref={suffixRef}
              className={`text-[#FFA94D] transition-opacity duration-300 ${reducedMotion ? 'opacity-100' : 'opacity-0'}`}
            >
              {stat.suffix}
            </span>
          )}
        </div>

        <h3 className="mt-4 font-display text-lg font-extrabold tracking-tight text-white md:text-xl">
          {stat.label}
        </h3>
        <p className="mt-2.5 text-sm leading-body text-overlay-white-46 md:text-sm-plus">{stat.description}</p>
      </motion.article>
    );
  },
);
