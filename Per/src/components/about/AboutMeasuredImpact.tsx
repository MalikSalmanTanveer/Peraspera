import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import {
  MEASURED_IMPACT_COPY,
  MEASURED_IMPACT_EYEBROW,
  MEASURED_IMPACT_STATS,
} from '../../data/measured-impact';
import { Container } from '../Container';
import { MeasuredImpactCard, type MeasuredImpactCardHandle } from './MeasuredImpactCard';
import { MeasuredImpactNetwork } from './MeasuredImpactNetwork';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

function formatCounterValue(value: number, type: 'integer' | 'rating') {
  if (type === 'rating') return value.toFixed(1);
  return String(Math.round(value));
}

function finalDisplayForStat(value: number, type: 'integer' | 'rating') {
  return formatCounterValue(value, type);
}

export function AboutMeasuredImpact() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(MeasuredImpactCardHandle | null)[]>([]);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          MEASURED_IMPACT_STATS.forEach((stat, index) => {
            const handles = cardRefs.current[index];
            const counterEl = handles?.counterEl;
            if (!counterEl) return;

            const obj = { val: 0 };

            gsap.to(obj, {
              val: stat.value,
              duration: 1.8,
              ease: 'expo.out',
              delay: index * 0.1,
              onUpdate: () => {
                counterEl.textContent = formatCounterValue(obj.val, stat.type);
              },
              onComplete: () => {
                if (stat.type === 'rating') {
                  handles?.ratingStarEl?.classList.remove('opacity-0');
                  handles?.ratingStarEl?.classList.add('opacity-100');
                } else {
                  handles?.suffixEl?.classList.remove('opacity-0');
                  handles?.suffixEl?.classList.add('opacity-100');
                }
              },
            });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="measured-impact"
      className="relative overflow-hidden bg-ink px-nav-x py-section-y max-md:px-nav-x-mobile max-md:py-section-y-mobile"
      aria-labelledby="measured-impact-heading"
    >
      <MeasuredImpactNetwork disabled={reduced} />

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(255,169,77,0.06),transparent_60%)]"
        aria-hidden="true"
      />

      <Container className="relative z-[2]">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-14 max-w-[820px] text-center md:mb-16"
        >
          <p className="font-display text-[10px] font-extrabold uppercase tracking-[0.32em] text-[#FFA94D] md:text-2xs">
            {MEASURED_IMPACT_EYEBROW}
          </p>
          <h2
            id="measured-impact-heading"
            className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.06] tracking-tight text-white"
          >
            {MEASURED_IMPACT_COPY.title}
          </h2>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-5 max-w-[680px] text-base leading-body-lg text-overlay-white-55 md:text-md-plus"
          >
            {MEASURED_IMPACT_COPY.subtitle}
          </motion.p>
        </motion.div>

        <div className="mx-auto grid max-w-[1040px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {MEASURED_IMPACT_STATS.map((stat, index) => (
            <MeasuredImpactCard
              key={stat.id}
              ref={(instance) => {
                cardRefs.current[index] = instance;
              }}
              stat={stat}
              index={index}
              reducedMotion={reduced}
              finalDisplay={finalDisplayForStat(stat.value, stat.type)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
