import { Link } from 'react-router-dom';
import { isHomeReviewPreview, TESTIMONIALS } from '../data/content-extended';
import { getPortfolioReviewLink } from '../utils/portfolioReviewNav';
import { Marquee } from '../components/Marquee';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';

function Stars() {
  return (
    <div className="mb-3.5 flex shrink-0 gap-[3px]" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-star text-md-plus">
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  title,
  role,
  avatarSrc,
  initials,
  avatarColor,
}: (typeof TESTIMONIALS)[number]) {
  const showReadMore = isHomeReviewPreview(quote);

  const card = (
    <article
      className={`relative z-10 flex h-[400px] w-[380px] shrink-0 flex-col rounded-6xl border border-border bg-white p-padding-card-lg max-md:h-[380px] max-md:w-[340px] ${
        showReadMore
          ? 'cursor-pointer transition-all duration-card hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover'
          : ''
      }`}
    >
      <Stars />

      <div className="relative mt-1 min-h-0 flex-1 overflow-hidden">
        <blockquote className="line-clamp-[7] text-md leading-body-lg text-muted">
          &ldquo;{quote}&rdquo;
        </blockquote>
        {showReadMore ? (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/95 to-transparent"
              aria-hidden="true"
            />
            <span className="absolute bottom-0 left-0 font-display text-2xl font-extrabold leading-none text-accent">
              ...
            </span>
          </>
        ) : null}
      </div>

      <footer className="mt-5 flex shrink-0 items-center gap-3.5 border-t border-border pt-5">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt=""
            className="h-12 w-12 shrink-0 rounded-full object-cover object-top ring-2 ring-border"
          />
        ) : (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-sm-plus font-extrabold text-white ${avatarColor}`}
            aria-hidden="true"
          >
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <cite className="block truncate font-display text-md font-extrabold not-italic text-ink">
            {name}
          </cite>
          <p className="mt-0.5 truncate text-sm font-semibold text-ink/80">{title}</p>
          <p className="truncate text-sm-plus text-muted">{role}</p>
        </div>
      </footer>
    </article>
  );

  if (!showReadMore) {
    return card;
  }

  return (
    <Link
      to={getPortfolioReviewLink(name)}
      className="relative z-10 block shrink-0 pointer-events-auto no-underline text-inherit"
      aria-label={`Read full review from ${name} on portfolio`}
      onClick={(event) => event.stopPropagation()}
    >
      {card}
    </Link>
  );
}

export function Testimonials() {
  return (
    <section
      id="home-client-reviews"
      className="overflow-hidden bg-paper pb-padding-testi-b pt-padding-testi-y"
    >
      <Container className="mb-[52px] px-nav-x max-md:px-nav-x-mobile">
        <Reveal>
          <span className="section-label">Client Love</span>
          <h2 className="font-display text-section-alt font-extrabold leading-snug tracking-snug">
            Trusted by founders and teams who need premium design fast.
          </h2>
        </Reveal>
      </Container>

      <div className="relative z-[1]">
        <Marquee direction="left-testi" gapClass="gap-gap-testimonial">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
