import {
  createEmptySection,
  type ContentSection,
} from '../../lib/contentSections';
import { RichTextEditor } from './RichTextEditor';

type Props = {
  value: ContentSection[];
  onChange: (sections: ContentSection[]) => void;
};

export function JobSectionEditor({ value, onChange }: Props) {
  const updateAt = (index: number, patch: Partial<ContentSection>) => {
    onChange(value.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= value.length) return;
    const copy = [...value];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item);
    onChange(copy);
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const setBodyType = (index: number, body_type: ContentSection['body_type']) => {
    const section = value[index];
    if (!section) return;
    if (body_type === 'paragraph') {
      updateAt(index, {
        body_type,
        html: section.html ?? '',
        bullets: undefined,
      });
    } else {
      updateAt(index, {
        body_type,
        html: undefined,
        bullets: section.bullets?.length ? section.bullets : [{ html: '' }],
      });
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">Content sections</h3>
          <p className="mt-1 text-sm text-muted">
            Add sections with a heading and either a paragraph or a bullet list.
          </p>
        </div>
        <button
          type="button"
          className="rounded-pill border border-border bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink"
          onClick={() => onChange([...value, createEmptySection('paragraph')])}
        >
          Add section
        </button>
      </div>

      {!value.length ? (
        <div className="rounded-2xl border border-dashed border-border bg-paper/50 px-5 py-8 text-center">
          <p className="text-sm text-muted">Add a section to describe this role</p>
        </div>
      ) : null}

      {value.map((section, index) => (
        <div
          key={section.id}
          className="grid gap-3 rounded-2xl border border-border bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              Section {index + 1}
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg border border-border px-2 py-1 text-xs font-semibold disabled:opacity-40"
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                Up
              </button>
              <button
                type="button"
                className="rounded-lg border border-border px-2 py-1 text-xs font-semibold disabled:opacity-40"
                disabled={index === value.length - 1}
                onClick={() => move(index, 1)}
              >
                Down
              </button>
              <button
                type="button"
                className="rounded-lg border border-border px-2 py-1 text-xs font-semibold text-red-700"
                onClick={() => removeAt(index)}
              >
                Remove
              </button>
            </div>
          </div>

          <label className="grid gap-1.5 text-sm font-medium text-ink">
            Heading
            <input
              className="rounded-xl border border-border px-3 py-2 text-sm font-normal outline-none focus:border-accent"
              value={section.heading}
              onChange={(e) => updateAt(index, { heading: e.target.value })}
              placeholder="e.g. Responsibilities"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`rounded-pill px-3 py-1.5 text-xs font-semibold ${
                section.body_type === 'paragraph'
                  ? 'bg-ink text-white'
                  : 'border border-border bg-white text-ink'
              }`}
              onClick={() => setBodyType(index, 'paragraph')}
            >
              Paragraph
            </button>
            <button
              type="button"
              className={`rounded-pill px-3 py-1.5 text-xs font-semibold ${
                section.body_type === 'bullets'
                  ? 'bg-ink text-white'
                  : 'border border-border bg-white text-ink'
              }`}
              onClick={() => setBodyType(index, 'bullets')}
            >
              Bullets
            </button>
          </div>

          {section.body_type === 'paragraph' ? (
            <RichTextEditor
              mode="paragraph"
              value={section.html ?? ''}
              onChange={(html) => updateAt(index, { html })}
              placeholder="Write the section body…"
            />
          ) : (
            <div className="grid gap-2">
              {(section.bullets ?? []).map((bullet, bi) => (
                <div key={bi} className="flex gap-2">
                  <div className="min-w-0 flex-1">
                    <RichTextEditor
                      mode="bullet"
                      value={bullet.html}
                      onChange={(html) => {
                        const bullets = [...(section.bullets ?? [])];
                        bullets[bi] = { html };
                        updateAt(index, { bullets });
                      }}
                      placeholder="Bullet line"
                    />
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-lg border border-border px-2 text-xs font-semibold"
                    onClick={() => {
                      const bullets = (section.bullets ?? []).filter((_, i) => i !== bi);
                      updateAt(index, {
                        bullets: bullets.length ? bullets : [{ html: '' }],
                      });
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="justify-self-start rounded-lg border border-border px-3 py-1.5 text-xs font-semibold"
                onClick={() =>
                  updateAt(index, {
                    bullets: [...(section.bullets ?? []), { html: '' }],
                  })
                }
              >
                Add bullet
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
