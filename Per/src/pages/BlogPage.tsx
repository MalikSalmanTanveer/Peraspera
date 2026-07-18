import { Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { Button } from '../components/Button';

const PLACEHOLDER_POSTS = [
  {
    title: 'How AI automation fits into a modern design studio',
    category: 'AI & Automation',
    date: 'Coming soon',
  },
  {
    title: 'Building SaaS products with design systems from day one',
    category: 'Product',
    date: 'Coming soon',
  },
  {
    title: 'What makes a high-converting service website in 2026',
    category: 'Web Design',
    date: 'Coming soon',
  },
] as const;

const TICKER_ITEMS = [
  'Coming Soon',
  'Studio Notes Loading',
  'New Articles In Progress',
  'Insights Publishing Shortly',
  'Blog Launching Soon',
];

function ComingSoonTicker() {
  const sequence = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-overlay-white-10 bg-accent/10 py-3">
      <div className="coming-soon-track flex w-max items-center gap-10">
        {sequence.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center gap-3 whitespace-nowrap text-sm font-extrabold uppercase tracking-[0.28em] text-accent md:text-base"
          >
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BlogPage() {
  return (
    <div className="bg-ink text-white">
      <section className="relative overflow-hidden pt-[72px]">
        <div className="hero-grid-bg absolute inset-0 opacity-45" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,rgba(254,163,39,0.12),transparent_55%)]"
          aria-hidden="true"
        />
        <Container className="relative z-[1] px-nav-x py-12 md:py-16 max-md:px-nav-x-mobile">
          <Reveal>
            <PageBreadcrumb current="Blogs" />
            <span className="section-label section-label-light">Blog</span>
            <h1 className="mx-auto mt-4 max-w-[820px] text-center font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-extrabold leading-[1.04] tracking-tighter">
              Insights, updates, and{' '}
              <em className="not-italic text-accent">studio notes.</em>
            </h1>
            <p className="mx-auto mt-6 max-w-[560px] text-center text-lg font-light leading-body-xl text-overlay-white-55">
              Articles on design, product, AI automation, and building brands — published from the
              Peraspera team.
            </p>
          </Reveal>
        </Container>
        <ComingSoonTicker />
      </section>

      <section className="relative rounded-t-[2rem] bg-paper py-section-y px-nav-x text-ink max-md:px-nav-x-mobile max-md:py-section-y-mobile md:rounded-t-[2.5rem]">
        <div className="hero-grid-bg pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true" />
        <Container className="relative z-[1]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {PLACEHOLDER_POSTS.map((post, index) => (
              <Reveal key={post.title} delay={index * 0.05}>
                <article className="group flex h-full min-h-[280px] flex-col rounded-6xl border border-border bg-white p-8 transition-transform duration-card hover:-translate-y-1 hover:shadow-card-hover">
                  <span className="label-pill-equal self-start bg-accent/10 text-accent-dark">
                    {post.category}
                  </span>
                  <h2 className="mt-4 flex-1 font-display text-2xl font-extrabold leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
                    <span className="coming-soon-dot h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                    {post.date}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="mx-auto mt-14 max-w-[620px] rounded-6xl border border-border bg-white p-10 text-center">
              <h2 className="font-display text-2xl font-extrabold">More articles on the way</h2>
              <p className="mt-4 text-md leading-body-lg text-muted">
                We&apos;re preparing studio insights on AI workflows, product design, and client
                project learnings.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button variant="dark" href="/#contact">
                  Get Notified ↗
                </Button>
                <Link
                  to="/services"
                  className="font-body text-sm-plus font-semibold text-muted transition-colors hover:text-ink"
                >
                  Explore Services →
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
