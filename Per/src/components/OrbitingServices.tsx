import { SERVICE_CATEGORIES } from '../data/services';
import { Logo } from './Logo';

const ORBIT_SERVICES = SERVICE_CATEGORIES.map((category) => category.title);

interface OrbitingServicesProps {
  className?: string;
}

export function OrbitingServices({ className = '' }: OrbitingServicesProps) {
  const count = ORBIT_SERVICES.length;
  const duration = '42s';

  return (
    <div
      className={`relative mx-auto flex items-center justify-center w-full max-w-[min(92vw,620px)] aspect-square ${className}`}
      aria-label="Peraspera services"
    >
      <div
        className="absolute w-40 h-40 md:w-52 md:h-52 rounded-full bg-accent/20 blur-[90px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-[10%] md:inset-[8%] rounded-full border border-dashed border-overlay-white-12"
        aria-hidden="true"
      />
      <div
        className="absolute inset-[22%] md:inset-[20%] rounded-full border border-overlay-white-08"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 animate-orbit-slow motion-reduce:animate-none"
        style={{ animationDuration: duration }}
      >
        {ORBIT_SERVICES.map((label, index) => {
          const angle = (360 / count) * index;
          return (
            <div
              key={label}
              className="absolute left-1/2 top-1/2 w-0 h-0"
              style={{ transform: `rotate(${angle}deg) translateY(calc(-1 * min(38vw, 220px)))` }}
            >
              <div
                className="animate-orbit-reverse-slow motion-reduce:animate-none"
                style={{ animationDuration: duration }}
              >
                <a
                  href="#services"
                  className="block -translate-x-1/2 whitespace-nowrap rounded-pill border border-overlay-white-12 bg-overlay-white-08 px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-overlay-white-72 backdrop-blur-md transition-colors duration-medium hover:border-accent hover:bg-accent hover:text-ink md:px-4 md:py-2.5 md:text-sm"
                >
                  {label}
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-overlay-white-12 bg-overlay-ink-92 shadow-[0_0_80px_rgba(254,163,39,0.18)] md:h-36 md:w-36">
        <span className="relative flex h-20 w-[min(52vw,160px)] items-center justify-center overflow-hidden md:h-24">
          <Logo
            variant="primary"
            inverted
            className="absolute h-[180px] w-auto max-w-none"
          />
        </span>
      </div>
    </div>
  );
}
