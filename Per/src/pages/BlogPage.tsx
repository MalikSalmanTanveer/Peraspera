import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/Container';
import { Reveal } from '../components/Reveal';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { fetchPublishedBlogPosts } from '../lib/blogPublic';
import type { PublicBlogPostCard } from '../lib/blog';

function formatDate(value: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function BlogPage() {
  const [posts, setPosts] = useState<PublicBlogPostCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const result = await fetchPublishedBlogPosts();
      setLoading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      setPosts(result.data);
    })();
  }, []);

  return (
    <div className="bg-ink text-white">
      <section className="relative overflow-hidden pt-[72px] px-nav-x max-md:px-nav-x-mobile">
        <div className="hero-grid-bg absolute inset-0 opacity-45" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,rgba(254,163,39,0.12),transparent_55%)]"
          aria-hidden="true"
        />
        <Container className="relative z-[1] py-12 md:py-16">
          <Reveal>
            <PageBreadcrumb current="Blogs" />
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
      </section>

      <section className="relative rounded-t-[2rem] bg-paper py-section-y px-nav-x text-ink max-md:px-nav-x-mobile max-md:py-section-y-mobile md:rounded-t-[2.5rem]">
        <div className="hero-grid-bg pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true" />
        <Container className="relative z-[1]">
          {loading ? (
            <p className="text-center text-sm text-muted">Loading posts…</p>
          ) : error ? (
            <p className="text-center text-sm text-red-700">{error}</p>
          ) : posts.length === 0 ? (
            <Reveal>
              <div className="mx-auto max-w-[560px] rounded-6xl border border-border bg-white px-8 py-14 text-center">
                <h2 className="font-display text-3xl font-extrabold text-ink">No posts yet</h2>
                <p className="mt-4 text-md leading-body-lg text-muted">
                  Check back soon for studio insights and updates.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.id} delay={index * 0.05}>
                  <Link to={`/blog/${post.slug}`} className="block h-full">
                    <article className="group flex h-full min-h-[280px] flex-col overflow-hidden rounded-6xl border border-border bg-white transition-transform duration-card hover:-translate-y-1 hover:shadow-card-hover">
                      {post.cover_image_url ? (
                        <img
                          src={post.cover_image_url}
                          alt=""
                          className="aspect-[16/10] w-full object-cover"
                        />
                      ) : null}
                      <div className="flex flex-1 flex-col p-8">
                        <span className="label-pill-equal self-start bg-accent/10 text-accent-dark">
                          {formatDate(post.published_at) || 'Article'}
                        </span>
                        <h2 className="mt-4 flex-1 font-display text-2xl font-extrabold leading-snug text-ink">
                          {post.title}
                        </h2>
                        {post.excerpt ? (
                          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                            {post.excerpt}
                          </p>
                        ) : null}
                        <p className="mt-4 text-sm font-semibold text-ink group-hover:text-accent-dark">
                          Read article →
                        </p>
                      </div>
                    </article>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
