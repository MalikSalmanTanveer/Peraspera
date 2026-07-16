import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ClientWork } from '../data/works-clients';
import { WorkScreenshot } from './WorkScreenshot';
import { AppIcon } from './AppIcon';

interface FeaturedWorksCarouselProps {
  works: ClientWork[];
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  showVisitLink?: boolean;
  /** Show project copy below the screenshot instead of overlaying the image */
  captionBelow?: boolean;
}

function WorkExternalLink({ href, title }: { href: string; title: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${title} live site`}
      className="group/link absolute right-4 top-4 z-10 flex items-center gap-0 overflow-hidden rounded-full border border-white/25 bg-ink/40 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-normal hover:border-accent/70 hover:bg-ink/55 hover:pr-1"
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap pl-0 text-[11px] font-extrabold uppercase tracking-wider text-white opacity-0 transition-all duration-normal group-hover/link:max-w-[72px] group-hover/link:pl-3 group-hover/link:opacity-100">
        Visit
      </span>
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-ink ring-2 ring-white/20 transition-transform duration-normal group-hover/link:scale-105 group-hover/link:ring-accent/40">
        <span
          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/35 to-transparent"
          aria-hidden="true"
        />
        <AppIcon name="ArrowUpRight" className="relative h-[18px] w-[18px]" strokeWidth={2.25} />
      </span>
    </a>
  );
}

export function FeaturedWorksCarousel({
  works,
  priority = false,
  className = '',
  imageClassName = '',
  showVisitLink = false,
  captionBelow = false,
}: FeaturedWorksCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (works.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % works.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [works.length]);

  if (works.length === 0) return null;

  const activeWork = works[activeIndex];

  const imageFrameClass = captionBelow
    ? 'relative h-[280px] overflow-hidden md:h-[360px] lg:h-[420px]'
    : `relative overflow-hidden ${className}`.trim();

  const captionBlock = (
    <>
      {showVisitLink ? (
        <span className="text-2xs font-black uppercase tracking-widest text-accent">
          Featured Project
        </span>
      ) : null}
      <p className={`text-2xs font-black uppercase tracking-widest text-accent ${showVisitLink ? 'mt-3' : ''}`}>
        {activeWork.category}
      </p>
      <p
        className={`mt-1 font-display font-extrabold ${
          captionBelow
            ? 'text-2xl text-ink md:text-3xl'
            : 'text-xl text-white md:text-2xl lg:text-3xl'
        }`}
      >
        {activeWork.title}
      </p>
      {showVisitLink ? (
        <>
          <p
            className={`mt-4 text-sm leading-body md:text-md-plus ${
              captionBelow ? 'text-muted' : 'text-overlay-white-55'
            }`}
          >
            {activeWork.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {activeWork.services.map((service) => (
              <span
                key={service}
                className={
                  captionBelow
                    ? 'rounded-md bg-paper px-2.5 py-1 text-2xs font-bold uppercase tracking-wide text-muted'
                    : 'rounded-pill border border-overlay-white-16 bg-overlay-white-08 px-3 py-1.5 text-xs font-semibold text-white'
                }
              >
                {service}
              </span>
            ))}
          </div>
        </>
      ) : null}
    </>
  );

  return (
    <div className={captionBelow ? className : `relative ${className}`}>
      <div className={captionBelow ? '' : 'relative overflow-hidden'}>
        <div className={imageFrameClass}>
          {works.map((work, index) => (
            <div
              key={work.id}
              className={`transition-opacity duration-700 ${
                index === activeIndex
                  ? 'relative h-full opacity-100'
                  : 'pointer-events-none absolute inset-0 opacity-0'
              }`}
              aria-hidden={index !== activeIndex}
            >
              <WorkScreenshot
                id={work.id}
                url={work.url}
                title={work.title}
                previewSrc={work.previewSrc}
                priority={priority && index === 0}
                className={imageClassName || 'h-full w-full'}
              />
            </div>
          ))}

          {showVisitLink ? <WorkExternalLink href={activeWork.url} title={activeWork.title} /> : null}

          {!captionBelow ? (
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent ${
                showVisitLink ? 'p-8 md:p-10 lg:max-w-[58%]' : 'p-6 md:p-8 lg:p-10'
              }`}
            >
              {captionBlock}
            </div>
          ) : null}

          {works.length > 1 ? (
            <div
              className={`absolute z-10 flex items-center gap-2 ${
                captionBelow ? 'bottom-4 right-4' : 'bottom-4 right-4 md:bottom-6 md:right-6'
              }`}
            >
              {works.map((work, index) => (
                <button
                  key={work.id}
                  type="button"
                  aria-label={`Show ${work.title}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-normal ${
                    index === activeIndex
                      ? 'w-7 bg-accent'
                      : captionBelow
                        ? 'w-2 bg-ink/25 hover:bg-ink/40'
                        : 'w-2 bg-white/35 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {captionBelow && showVisitLink ? (
        <div className="border-t border-border p-8 md:p-10">{captionBlock}</div>
      ) : null}
    </div>
  );
}

export function FeaturedWorksCarouselCompact({
  works,
  priority = false,
}: {
  works: ClientWork[];
  priority?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (works.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % works.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [works.length]);

  if (works.length === 0) return null;

  const activeWork = works[activeIndex];

  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121212]">
      <Link to="/portfolio" className="relative block aspect-[16/11] overflow-hidden" aria-label="View portfolio projects">
        {works.map((work, index) => (
          <div
            key={work.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={index !== activeIndex}
          >
            <WorkScreenshot
              id={work.id}
              url={work.url}
              title={work.title}
              previewSrc={work.previewSrc}
              priority={priority && index === 0}
              className="h-full w-full transition-transform duration-image-slow group-hover:scale-[1.03]"
            />
          </div>
        ))}

        {works.length > 1 ? (
          <div className="absolute bottom-4 right-4 z-[2] flex gap-1.5">
            {works.map((work, index) => (
              <button
                key={work.id}
                type="button"
                aria-label={`Show ${work.title}`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setActiveIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex ? 'w-5 bg-accent' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        ) : null}
      </Link>

      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-2xs font-black uppercase tracking-widest text-accent">{activeWork.category}</p>
        <p className="mt-1 font-display text-xl font-extrabold text-white">{activeWork.title}</p>
      </div>
    </div>
  );
}
