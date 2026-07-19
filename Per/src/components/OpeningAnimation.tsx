import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  OPENING_CARDS,
  OPENING_MARKETS,
  OPENING_METRICS,
  OPENING_PROCESS_STEPS,
  OPENING_SERVICE_LINES,
  OPENING_VISION_LINES,
  type OpeningAnimationCard,
  type OpeningCardVariant,
} from '../data/opening-animation';

interface OpeningAnimationProps {
  onComplete: () => void;
}

const CARD_LAYOUT = [
  { y: -136, x: 18, rotateX: 10, rotateY: -14, rotateZ: -5, scale: 0.92, z: -240 },
  { y: -68, x: 10, rotateX: 11, rotateY: -11, rotateZ: -2.5, scale: 0.94, z: -180 },
  { y: 0, x: 0, rotateX: 12, rotateY: -8, rotateZ: 0, scale: 0.96, z: -120 },
  { y: 68, x: -10, rotateX: 13, rotateY: -5, rotateZ: 2.5, scale: 0.98, z: -60 },
  { y: 136, x: -18, rotateX: 14, rotateY: -2, rotateZ: 5, scale: 1, z: 0 },
] as const;

const variantStyles: Record<
  OpeningCardVariant,
  { shell: string; label: string; heading: string; body: string; line: string }
> = {
  ink: {
    shell: 'bg-ink text-white border border-white/10',
    label: 'text-white/45',
    heading: 'text-white',
    body: 'text-white/55',
    line: 'border-white/12',
  },
  paper: {
    shell: 'bg-white text-ink border border-border',
    label: 'text-muted-light',
    heading: 'text-ink',
    body: 'text-muted',
    line: 'border-border',
  },
  accent: {
    shell: 'bg-accent text-ink border border-accent-emphasis',
    label: 'text-ink/55',
    heading: 'text-ink',
    body: 'text-ink/70',
    line: 'border-ink/10',
  },
};

function CardChrome({
  card,
  variant,
}: {
  card: OpeningAnimationCard;
  variant: OpeningCardVariant;
}) {
  const styles = variantStyles[variant];

  return (
    <div className={`flex items-center justify-between border-b px-4 py-2.5 ${styles.line}`}>
      <div className="flex items-center gap-2">
        <span className={`font-display text-[10px] font-extrabold tracking-[0.18em] ${styles.label}`}>
          {card.section}
        </span>
        <span className={`font-display text-[10px] font-extrabold uppercase tracking-[0.22em] ${styles.label}`}>
          {card.title}
        </span>
      </div>
      <div className="flex gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${variant === 'ink' ? 'bg-white/25' : 'bg-ink/15'}`} />
        <span className={`h-1.5 w-1.5 rounded-full ${variant === 'ink' ? 'bg-white/25' : 'bg-ink/15'}`} />
        <span className={`h-1.5 w-1.5 rounded-full ${variant === 'accent' ? 'bg-ink/25' : 'bg-accent'}`} />
      </div>
    </div>
  );
}

function ProcessCardBody({ variant }: { variant: OpeningCardVariant }) {
  const styles = variantStyles[variant];

  return (
    <div className="flex flex-1 flex-col px-4 py-5">
      {OPENING_PROCESS_STEPS.map((step, index) => (
        <div key={step.label} className={`${index > 0 ? `border-t pt-4 mt-4 ${styles.line}` : ''}`}>
          <div className="flex items-end gap-3">
            <span className={`font-display text-sm font-extrabold ${styles.label}`}>{step.number}</span>
            <span className={`font-display text-[clamp(1.35rem,4vw,1.85rem)] font-extrabold leading-none tracking-tight ${styles.heading}`}>
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ServicesCardBody({ variant }: { variant: OpeningCardVariant }) {
  const styles = variantStyles[variant];

  return (
    <div className="grid flex-1 grid-cols-[1fr_0.9fr] gap-3 px-4 py-5">
      <div>
        {OPENING_SERVICE_LINES.map((line, index) => (
          <div key={line.detail} className={`${index > 0 ? `border-t pt-3 mt-3 ${styles.line}` : ''}`}>
            <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${styles.label}`}>{line.label}</p>
            <p className={`mt-1 font-display text-sm font-extrabold leading-snug ${styles.heading}`}>{line.detail}</p>
          </div>
        ))}
      </div>
      <div className={`relative overflow-hidden rounded-2xl ${variant === 'paper' ? 'bg-paper' : 'bg-white/8'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(254,163,39,0.35),transparent_55%)]" />
        <div className="absolute bottom-5 left-5 right-5 top-auto h-16 rounded-xl bg-accent/80" />
        <div className="absolute bottom-8 left-8 h-24 w-10 rounded-md bg-white/90 shadow-lg" />
      </div>
    </div>
  );
}

function MetricsCardBody({ variant }: { variant: OpeningCardVariant }) {
  const styles = variantStyles[variant];

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-5">
      <div className="grid grid-cols-2 gap-3">
        {OPENING_METRICS.map((metric) => (
          <div key={metric.label}>
            <p className={`font-display text-[clamp(1.5rem,4vw,2rem)] font-extrabold leading-none ${styles.heading}`}>
              {metric.value}
            </p>
            <p className={`mt-1 text-[10px] font-bold uppercase tracking-[0.16em] ${styles.label}`}>{metric.label}</p>
          </div>
        ))}
      </div>
      <div className={`border-t pt-4 ${styles.line}`}>
        {OPENING_MARKETS.map((market) => (
          <div key={market.name} className={`flex items-center justify-between py-1.5 ${styles.body}`}>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em]">{market.name}</span>
            <span className="font-display text-sm font-extrabold">{market.share}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandCardBody({ variant }: { variant: OpeningCardVariant }) {
  const styles = variantStyles[variant];

  return (
    <div className="flex flex-1 items-end px-4 pb-5 pt-8">
      <p className={`font-display text-[clamp(2.4rem,8vw,3.4rem)] font-extrabold leading-[0.92] tracking-tighter ${styles.heading}`}>
        peraspera<span className="text-white">.</span>
      </p>
    </div>
  );
}

function VisionCardBody({ variant }: { variant: OpeningCardVariant }) {
  const styles = variantStyles[variant];

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-5">
      {OPENING_VISION_LINES.map((line) => (
        <p
          key={line}
          className={`font-display text-[clamp(1.15rem,3.6vw,1.65rem)] font-extrabold leading-[1.02] tracking-tight ${styles.heading}`}
        >
          {line}
        </p>
      ))}
      <p className={`mt-4 max-w-[18rem] text-xs leading-relaxed ${styles.body}`}>
        AI, software, automation, finance, and brand — connected as one intelligent system.
      </p>
    </div>
  );
}

function OpeningCardContent({ card }: { card: OpeningAnimationCard }) {
  switch (card.id) {
    case 'process':
      return <ProcessCardBody variant={card.variant} />;
    case 'services':
      return <ServicesCardBody variant={card.variant} />;
    case 'metrics':
      return <MetricsCardBody variant={card.variant} />;
    case 'brand':
      return <BrandCardBody variant={card.variant} />;
    case 'vision':
      return <VisionCardBody variant={card.variant} />;
    default:
      return null;
  }
}

export function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    document.body.style.overflow = 'hidden';

    const holdTimer = window.setTimeout(() => setPhase('hold'), 2200);
    const exitTimer = window.setTimeout(() => setPhase('exit'), 3600);
    const completeTimer = window.setTimeout(onComplete, 4700);

    return () => {
      document.body.style.overflow = '';
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100000] flex items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f3f3f3_0%,#ececec_100%)]"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
        <button
          type="button"
          onClick={onComplete}
          className="absolute right-5 top-5 z-[100001] rounded-pill border border-ink/10 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink backdrop-blur-sm transition-colors hover:bg-white"
        >
          Skip
        </button>

        <div className="relative h-[min(720px,92vh)] w-full max-w-[420px] [perspective:1400px] max-md:max-w-[340px]">
          {OPENING_CARDS.map((card, index) => {
            const layout = CARD_LAYOUT[index];
            const isExit = phase === 'exit';

            return (
              <motion.article
                key={card.id}
                className={`absolute left-1/2 top-1/2 flex h-[min(420px,58vh)] w-[min(320px,86vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[1.35rem] shadow-[0_30px_90px_rgba(0,0,0,0.18)] ${variantStyles[card.variant].shell}`}
                initial={{
                  opacity: 0,
                  y: layout.y - 260,
                  x: layout.x,
                  rotateX: 34,
                  rotateY: -24,
                  rotateZ: layout.rotateZ - 8,
                  scale: 0.84,
                  z: layout.z - 180,
                }}
                animate={
                  isExit
                    ? {
                        opacity: 0,
                        y: layout.y - 320,
                        x: layout.x,
                        rotateX: 24,
                        rotateY: -18,
                        rotateZ: layout.rotateZ,
                        scale: 0.88,
                        z: layout.z + 120,
                      }
                    : {
                        opacity: 1,
                        y: layout.y,
                        x: layout.x,
                        rotateX: layout.rotateX,
                        rotateY: layout.rotateY,
                        rotateZ: layout.rotateZ,
                        scale: layout.scale,
                        z: layout.z,
                      }
                }
                transition={{
                  delay: index * 0.11,
                  duration: isExit ? 0.75 : 0.95,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <CardChrome card={card} variant={card.variant} />
                <OpeningCardContent card={card} />
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function shouldShowOpeningAnimation(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return sessionStorage.getItem('peraspera-intro-seen') !== '1';
}

export function markOpeningAnimationSeen(): void {
  sessionStorage.setItem('peraspera-intro-seen', '1');
}
