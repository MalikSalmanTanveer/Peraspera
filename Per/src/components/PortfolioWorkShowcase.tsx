import { useState } from 'react';

import type { ClientWork } from '../data/works-clients';
import { workLogoSrc } from '../data/works-clients';
import { WorkScreenshot } from './WorkScreenshot';

interface PortfolioWorkShowcaseProps {
  work: ClientWork;
  index: number;
  priority?: boolean;
}

function PortfolioBrandLogoCard({ work }: { work: ClientWork }) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="animate-portfolio-logo-morph group/logo flex h-full w-full items-center justify-center rounded-xl border border-ink/12 bg-white p-3.5 shadow-[0_10px_28px_rgba(0,0,0,0.07)] transition-[border-color,box-shadow] duration-normal hover:border-accent/35 hover:shadow-[0_14px_36px_rgba(254,163,39,0.12)] md:p-4">
      {!logoFailed ? (
        <img
          src={workLogoSrc(work.id)}
          alt={`${work.title} logo`}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain transition-transform duration-normal group-hover/logo:scale-[1.04]"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <span className="text-center font-display text-base font-extrabold leading-tight text-ink md:text-lg">
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
        <div className="relative lg:col-span-7">
          <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-[#111]">
            <WorkScreenshot
              id={work.id}
              url={work.url}
              title={work.title}
              previewSrc={work.previewSrc}
              priority={priority}
            />
          </div>
          <div
            className={`absolute -bottom-4 hidden aspect-square w-[28%] max-w-[160px] md:block ${
              reversed ? 'left-0' : 'right-0'
            }`}
          >
            <PortfolioBrandLogoCard work={work} />
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
