import { useEffect, useRef } from 'react';
import { reviewAnchorId, TESTIMONIALS } from '../data/content-extended';

function Stars() {
  return (
    <div className="mb-3 flex gap-[3px]" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-star text-md-plus">
          ★
        </span>
      ))}
    </div>
  );
}

export function PortfolioReviewsSlider() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    let paused = false;

    const onEnter = () => {
      paused = true;
    };
    const onLeave = () => {
      paused = false;
    };

    track.addEventListener('mouseenter', onEnter);
    track.addEventListener('mouseleave', onLeave);
    track.addEventListener('touchstart', onEnter, { passive: true });
    track.addEventListener('touchend', onLeave, { passive: true });

    const tick = () => {
      if (!paused && track.scrollWidth > track.clientWidth) {
        track.scrollLeft += 0.45;
        if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 1) {
          track.scrollLeft = 0;
        }
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      track.removeEventListener('mouseenter', onEnter);
      track.removeEventListener('mouseleave', onLeave);
      track.removeEventListener('touchstart', onEnter);
      track.removeEventListener('touchend', onLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="relative mt-14">
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
      >
        {TESTIMONIALS.map((review) => (
          <article
            key={review.name}
            id={reviewAnchorId(review.name)}
            className="scroll-mt-[148px] flex w-[min(420px,85vw)] shrink-0 snap-start flex-col rounded-6xl border border-border bg-white p-padding-card-lg md:w-[440px]"
          >
            <Stars />
            <blockquote className="flex-1 text-md leading-body-lg text-muted">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <footer className="mt-6 flex items-center gap-3.5 border-t border-border pt-5">
              {review.avatarSrc ? (
                <img
                  src={review.avatarSrc}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-full object-cover object-top ring-2 ring-border"
                />
              ) : (
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm-plus font-extrabold text-white ${review.avatarColor}`}
                >
                  {review.initials}
                </div>
              )}
              <div className="min-w-0">
                <cite className="block truncate font-display text-md font-extrabold not-italic text-ink">
                  {review.name}
                </cite>
                <p className="mt-0.5 truncate text-sm font-semibold text-ink/80">{review.title}</p>
                <p className="truncate text-sm-plus text-muted">{review.role}</p>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
