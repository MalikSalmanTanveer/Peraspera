import { useState } from 'react';

import type { ClientWork } from '../data/works-clients';
import { workLogoSrc } from '../data/works-clients';
import { WorkScreenshot } from './WorkScreenshot';

interface PortfolioWorkShowcaseProps {
  work: ClientWork;
  index: number;
  priority?: boolean;
}

function PortfolioBrandLogo({ work }: { work: ClientWork }) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="flex min-h-[56px] items-center justify-center border-b border-ink/8 bg-white px-5 py-3.5 md:min-h-[64px] md:px-6 md:py-4">
      {!logoFailed ? (
        <img
          src={workLogoSrc(work.id)}
          alt={`${work.title} logo`}
          loading="lazy"
          decoding="async"
          className="max-h-9 w-auto max-w-[min(100%,180px)] object-contain md:max-h-10 md:max-w-[220px]"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <span className="text-center font-display text-sm font-extrabold leading-tight text-ink md:text-base">
          {work.title}
        </span>
      )}
    </div>
  );
}

export function PortfolioWorkShowcase({ work, index, priority = false }: PortfolioWorkShowcaseProps) {
  const reversed = index % 2 === 1;

  return (
    <article className="border-b border-overlay-white-10 py-14 last:border-b-0 md:py-20">
      <div
        className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 ${
          reversed ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-overlay-white-10 bg-[#111] lg:col-span-7">
          <PortfolioBrandLogo work={work} />
          <div className="aspect-[16/10]">
            <WorkScreenshot
              id={work.id}
              url={work.url}
              title={work.title}
              previewSrc={work.previewSrc}
              priority={priority}
            />
          </div>
        </div>

        <div className={`flex flex-col lg:col-span-5 ${reversed ? 'lg:items-end lg:text-right' : ''}`}>
          {work.featured ? (
            <span className="text-2xs font-black uppercase tracking-[0.2em] text-accent">Featured</span>
          ) : null}
          <span
            className={`text-2xs font-black uppercase tracking-[0.2em] text-overlay-white-55 ${work.featured ? 'mt-2' : ''}`}
          >
            {work.category}
          </span>
          <h3 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-tight tracking-tight text-white">
            {work.title}
          </h3>
          <p className="mt-4 text-md leading-body-lg text-overlay-white-55">{work.description}</p>
          <p className="mt-4 text-2xs font-semibold uppercase tracking-[0.14em] text-overlay-white-40">
            {work.services.join(' · ')}
          </p>
          <a
            href={work.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group mt-8 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-accent ${
              reversed ? 'flex-row-reverse' : ''
            }`}
          >
            Visit Live Site
            <span
              className={`text-accent transition-transform duration-normal group-hover:translate-x-1 ${
                reversed ? 'group-hover:-translate-x-1' : ''
              }`}
              aria-hidden="true"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
