import { Link } from 'react-router-dom';
import { OBSERVATIONS } from '../../data/about-manifesto';

export function AboutObservatory() {
  return (
    <section className="border-y border-white/[0.06] bg-ink px-nav-x py-section-y max-md:px-nav-x-mobile max-md:py-section-y-mobile">
      <div className="mx-auto max-w-[1000px]">
        <p className="text-2xs font-black uppercase tracking-[0.24em] text-accent">Observatory</p>
        <h2 className="mt-6 max-w-[640px] font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-snug text-white">
          We don&apos;t just build technology.
          <br />
          <span className="text-overlay-white-55">We study where it&apos;s going.</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {OBSERVATIONS.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-accent/30 hover:bg-white/[0.06]"
            >
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                Observation // {item.number}
              </span>
              <h3 className="mt-4 font-display text-lg font-extrabold text-white transition-colors group-hover:text-accent">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-body text-overlay-white-55">{item.excerpt}</p>
              <span className="mt-6 inline-block text-xs font-bold uppercase tracking-wider text-overlay-white-46 transition-colors group-hover:text-white">
                Read →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
