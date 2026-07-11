import { TESTIMONIALS } from '../data/content-extended';
import { Marquee } from '../components/Marquee';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';

function Stars() {
  return (
    <div className="flex gap-[3px] mb-3.5" aria-label="5 out of 5 stars">
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
  initials,
  name,
  role,
  avatarColor,
}: (typeof TESTIMONIALS)[number]) {
  return (
    <article className="bg-white border border-border rounded-6xl p-padding-card-lg w-[360px] shrink-0">
      <Stars />
      <blockquote className="text-md leading-body-lg text-muted">&ldquo;{quote}&rdquo;</blockquote>
      <footer className="flex items-center gap-3.5 mt-6">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center font-display text-sm-plus font-extrabold text-white shrink-0 ${avatarColor}`}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <cite className="font-display text-md font-extrabold not-italic">{name}</cite>
          <p className="text-sm-plus text-muted mt-0.5">{role}</p>
        </div>
      </footer>
    </article>
  );
}

export function Testimonials() {
  return (
    <section className="bg-paper pt-padding-testi-y pb-padding-testi-b overflow-hidden">
      <Container className="px-nav-x mb-[52px] max-md:px-nav-x-mobile">
        <Reveal>
          <span className="section-label">Client Love</span>
          <h2 className="font-display text-section-alt font-extrabold leading-snug tracking-snug">
            Trusted by founders and teams who need premium design fast.
          </h2>
        </Reveal>
      </Container>

      <Marquee direction="left-testi" gapClass="gap-gap-testimonial">
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.initials + t.quote.slice(0, 20)} {...t} />
        ))}
      </Marquee>
    </section>
  );
}
