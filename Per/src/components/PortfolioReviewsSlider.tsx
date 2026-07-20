import { reviewAnchorId, TESTIMONIALS } from '../data/content-extended';
import { testimonialAvatarClassName } from '../utils/testimonialAvatar';
import { Marquee } from './Marquee';

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

function PortfolioReviewCard({ review }: { review: (typeof TESTIMONIALS)[number] }) {
  return (
    <article className="relative z-10 flex h-[400px] w-[min(420px,85vw)] shrink-0 flex-col rounded-6xl border border-border bg-white p-padding-card-lg max-md:h-[380px] md:w-[440px]">
      <Stars />
      <blockquote className="flex-1 overflow-hidden text-md leading-body-lg text-muted">
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <footer className="mt-6 flex shrink-0 items-center gap-3.5 border-t border-border pt-5">
        {review.avatarSrc ? (
          <img
            src={review.avatarSrc}
            alt=""
            className={testimonialAvatarClassName(review, 'sm')}
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
  );
}

export function PortfolioReviewsSlider() {
  return (
    <div className="relative mt-14">
      <div className="pointer-events-none absolute h-0 overflow-hidden" aria-hidden="true">
        {TESTIMONIALS.map((review) => (
          <span key={review.name} id={reviewAnchorId(review.name)} className="block scroll-mt-[148px]" />
        ))}
      </div>

      <div className="mask-marquee">
        <Marquee direction="left-testi" gapClass="gap-gap-testimonial">
          {TESTIMONIALS.map((review) => (
            <PortfolioReviewCard key={review.name} review={review} />
          ))}
        </Marquee>
      </div>
    </div>
  );
}
