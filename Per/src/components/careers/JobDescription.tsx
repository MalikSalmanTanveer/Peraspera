import type { ContentSection } from '../../lib/contentSections';
import { purifyBulletHtml, purifyParagraphHtml } from '../../lib/sanitizeHtml';

type Props = {
  sections: ContentSection[];
  className?: string;
};

export function JobDescription({ sections, className = '' }: Props) {
  if (!sections?.length) {
    return (
      <p className={`text-muted ${className}`}>Details for this role will appear here soon.</p>
    );
  }

  return (
    <div className={`grid gap-12 ${className}`}>
      {sections.map((section) => (
        <section key={section.id}>
          <h2 className="font-display text-[1.375rem] font-extrabold tracking-tight text-ink md:text-2xl">
            {section.heading}
          </h2>
          <div className="mt-4 grid gap-3">
            {section.body_type === 'paragraph' ? (
              <div
                className="job-section-prose font-body text-base leading-[1.8] text-ink/80 [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:decoration-accent/60 [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-bold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{
                  __html: purifyParagraphHtml(section.html ?? ''),
                }}
              />
            ) : (
              <ul className="grid gap-3">
                {(section.bullets ?? []).map((bullet, k) => (
                  <li key={k} className="flex gap-3.5 text-base leading-[1.75] text-ink/80">
                    <span
                      className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    <span
                      className="[&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:decoration-accent/60 [&_a]:underline-offset-2"
                      dangerouslySetInnerHTML={{
                        __html: purifyBulletHtml(bullet.html),
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
