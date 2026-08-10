import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container } from '../components/Container';
import { PageBreadcrumb } from '../components/PageBreadcrumb';
import { fetchPublishedBlogPostBySlug } from '../lib/blogPublic';
import { purifyParagraphHtml } from '../lib/sanitizeHtml';
import type { BlogPost } from '../lib/blog';

function formatDate(value: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogPostPage() {
  const { slug = '' } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setError(null);
      const result = await fetchPublishedBlogPostBySlug(slug);
      setLoading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (!result.data) {
        setError('not_found');
        return;
      }
      setPost(result.data);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-paper px-nav-x py-24 text-ink max-md:px-nav-x-mobile">
        <Container>
          <p className="text-sm text-muted">Loading article…</p>
        </Container>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-paper px-nav-x py-24 text-ink max-md:px-nav-x-mobile">
        <Container className="mx-auto max-w-[720px] text-center">
          <h1 className="font-display text-3xl font-extrabold">Article not found</h1>
          <p className="mt-3 text-muted">This post is missing or not published.</p>
          <Link
            to="/blog"
            className="mt-8 inline-flex rounded-xl bg-accent px-4 py-3 text-sm font-bold text-ink"
          >
            Back to blog
          </Link>
        </Container>
      </div>
    );
  }

  const safeHtml = purifyParagraphHtml(post.body_html || '');

  return (
    <div className="bg-paper text-ink">
      <section className="border-b border-border bg-ink px-nav-x pt-[72px] text-white max-md:px-nav-x-mobile">
        <Container className="py-10 md:py-14">
          <PageBreadcrumb current={post.title} />
        </Container>
      </section>

      <article className="px-nav-x py-section-y max-md:px-nav-x-mobile max-md:py-section-y-mobile">
        <Container className="mx-auto max-w-[720px]">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {formatDate(post.published_at)}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight tracking-tight">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-5 text-lg leading-relaxed text-muted">{post.excerpt}</p>
          ) : null}
          {post.cover_image_url ? (
            <img
              src={post.cover_image_url}
              alt=""
              className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
            />
          ) : null}

          <div
            className="prose-blog mt-10 text-[1.05rem] leading-relaxed text-ink [&_a]:font-semibold [&_a]:text-accent-dark [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />

          <div className="mt-14 border-t border-border pt-8">
            <Link to="/blog" className="text-sm font-semibold text-ink hover:text-accent-dark">
              ← All posts
            </Link>
          </div>
        </Container>
      </article>
    </div>
  );
}
