import { TESTIMONIALS } from '../data/content-extended';
import { Marquee } from '../components/Marquee';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';

function Stars() {
  return (
    <div className="mb-3.5 flex gap-[3px]" aria-label="5 out of 5 stars">
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
  return (
    <article className="flex h-[320px] w-[380px] shrink-0 flex-col rounded-6xl border border-border bg-white p-padding-card-lg max-md:h-[300px] max-md:w-[340px]">
      <Stars />
      <blockquote className="line-clamp-6 flex-1 text-md leading-body-lg text-muted">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <footer className="mt-6 flex items-center gap-3.5 border-t border-border pt-5">
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
}

export function Testimonials() {
  return (
    <section className="overflow-hidden bg-paper pb-padding-testi-b pt-padding-testi-y">
      <Container className="mb-[52px] px-nav-x max-md:px-nav-x-mobile">
        <Reveal>
          <span className="section-label">Client Love</span>
          <h2 className="font-display text-section-alt font-extrabold leading-snug tracking-snug">
            Trusted by founders and teams who need premium design fast.
          </h2>
        </Reveal>
      </Container>

      <Marquee direction="left-testi" gapClass="gap-gap-testimonial">
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </Marquee>
    </section>
  );
}
