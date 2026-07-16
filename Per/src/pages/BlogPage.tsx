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

export function BlogPage() {
  return (
    <div className="bg-ink text-white">
      <section className="relative overflow-hidden pt-[72px]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,rgba(254,163,39,0.12),transparent_55%)]"
          aria-hidden="true"
        />
        <Container className="relative z-[1] px-nav-x py-12 md:py-16 max-md:px-nav-x-mobile">
          <Reveal>
            <PageBreadcrumb current="Blogs" />
            <span className="section-label section-label-light">Blog</span>
            <h1 className="mt-4 max-w-[820px] font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-extrabold leading-[1.04] tracking-tighter">
              Insights, updates, and{' '}
              <em className="not-italic text-accent">studio notes.</em>
            </h1>
            <p className="mt-6 max-w-[560px] text-lg font-light leading-body-xl text-overlay-white-55">
              Articles on design, product, AI automation, and building brands — published from the
              Peraspera team.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="rounded-t-[2rem] bg-paper py-section-y px-nav-x text-ink max-md:py-section-y-mobile max-md:px-nav-x-mobile md:rounded-t-[2.5rem]">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {PLACEHOLDER_POSTS.map((post, index) => (
              <Reveal key={post.title} delay={index * 0.05}>
                <article className="flex h-full flex-col rounded-6xl border border-border bg-white p-8">
                  <span className="text-2xs font-black uppercase tracking-widest text-accent-dark">
                    {post.category}
                  </span>
                  <h2 className="mt-4 flex-1 font-display text-2xl font-extrabold leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted">
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
