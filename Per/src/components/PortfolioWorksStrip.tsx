import type { ClientWork } from '../data/works-clients';
import { Marquee } from './Marquee';
import { WorkScreenshot } from './WorkScreenshot';
import { AppIcon } from './AppIcon';

function PortfolioWorkCard({ work }: { work: ClientWork }) {
  return (
    <article className="group flex h-[520px] w-[340px] shrink-0 flex-col overflow-hidden rounded-8xl border border-overlay-white-12 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] max-md:h-[480px] max-md:w-[300px]">
      <div className="relative h-[220px] shrink-0 overflow-hidden bg-[#111]">
        <WorkScreenshot
          id={work.id}
          url={work.url}
          title={work.title}
          previewSrc={work.previewSrc}
        />
        <a
          href={work.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${work.title} live site`}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-ink shadow-lg transition-transform group-hover:scale-105"
        >
          <AppIcon name="ArrowUpRight" className="h-[18px] w-[18px]" strokeWidth={2.25} />
        </a>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="label-pill-equal self-start bg-paper text-accent">{work.category}</span>
        <h3 className="mt-3 font-display text-2xl font-extrabold leading-snug text-ink">
          {work.title}
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-body text-muted">{work.description}</p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {work.services.slice(0, 3).map((service) => (
            <span key={service} className="label-pill-equal bg-paper text-muted">
              {service}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

interface PortfolioWorksStripProps {
  works: ClientWork[];
}

export function PortfolioWorksStrip({ works }: PortfolioWorksStripProps) {
  return (
    <div className="relative overflow-hidden py-2">
      <Marquee direction="left-slow" gapClass="gap-6 md:gap-8">
        {works.map((work) => (
          <PortfolioWorkCard key={work.id} work={work} />
        ))}
      </Marquee>
    </div>
  );
}
