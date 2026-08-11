import { useEffect, useState, type FormEvent } from 'react';
import { Toast, type ToastState } from '../../components/admin/Toast';
import { fetchCulture, updateCulture } from '../../lib/adminApi';
import type {
  CultureSection,
  CultureValue,
  EmptyCta,
  HiringStep,
} from '../../lib/careers';

function emptySection(): CultureSection {
  return { title: '', body: '' };
}
function emptyValue(): CultureValue {
  return { title: '', description: '' };
}
function emptyStep(): HiringStep {
  return { title: '', description: '' };
}

export function AdminCulturePage() {
  const [headline, setHeadline] = useState('');
  const [sections, setSections] = useState<CultureSection[]>([emptySection()]);
  const [values, setValues] = useState<CultureValue[]>([emptyValue()]);
  const [hiringSteps, setHiringSteps] = useState<HiringStep[]>([emptyStep()]);
  const [emptyCta, setEmptyCta] = useState<EmptyCta>({
    message: 'No open roles right now — check back soon',
    label: 'Contact us',
    href: '/#contact',
  });
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const res = await fetchCulture();
      setLoading(false);
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.data) {
        setHeadline(res.data.headline ?? '');
        setSections(
          res.data.sections?.length ? res.data.sections : [emptySection()],
        );
        setValues(res.data.values?.length ? res.data.values : [emptyValue()]);
        setHiringSteps(
          res.data.hiring_steps?.length ? res.data.hiring_steps : [emptyStep()],
        );
        setEmptyCta(
          res.data.empty_cta ?? {
            message: '',
            label: 'Contact us',
            href: '/#contact',
          },
        );
      }
    })();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const res = await updateCulture({
      headline,
      sections: sections.filter((s) => s.title.trim() || s.body.trim()),
      values: values.filter((v) => v.title.trim() || v.description.trim()),
      hiring_steps: hiringSteps.filter((s) => s.title.trim() || s.description.trim()),
      empty_cta: emptyCta,
    });
    if (res.error) {
      setError(res.error);
      return;
    }
    setToast({ message: 'Culture content saved', tone: 'success' });
  };

  if (loading) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-[1.75rem] font-extrabold tracking-tight text-ink">
        Culture CMS
      </h1>
      <p className="mt-1 text-sm text-[#6b6b6b]">
        Edit the public Careers culture content and empty-state CTA.
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid max-w-3xl gap-8">
        <label className="text-sm font-medium text-ink">
          Headline
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            required
            className="admin-input mt-1.5 w-full px-4 py-3"
          />
        </label>

        <section>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-ink">Sections</h3>
            <button
              type="button"
              className="text-sm font-semibold text-accent hover:text-accent-dark"
              onClick={() => setSections((prev) => [...prev, emptySection()])}
            >
              + Add section
            </button>
          </div>
          <div className="mt-3 grid gap-4">
            {sections.map((section, i) => (
              <div key={i} className="admin-panel p-4">
                <input
                  placeholder="Section title"
                  value={section.title}
                  onChange={(e) =>
                    setSections((prev) =>
                      prev.map((s, idx) =>
                        idx === i ? { ...s, title: e.target.value } : s,
                      ),
                    )
                  }
                  className="admin-input w-full"
                />
                <textarea
                  placeholder="Section body"
                  rows={3}
                  value={section.body}
                  onChange={(e) =>
                    setSections((prev) =>
                      prev.map((s, idx) =>
                        idx === i ? { ...s, body: e.target.value } : s,
                      ),
                    )
                  }
                  className="admin-input mt-2 w-full"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-ink">Values</h3>
            <button
              type="button"
              className="text-sm font-semibold text-accent hover:text-accent-dark"
              onClick={() => setValues((prev) => [...prev, emptyValue()])}
            >
              + Add value
            </button>
          </div>
          <div className="mt-3 grid gap-4">
            {values.map((value, i) => (
              <div key={i} className="admin-panel p-4">
                <input
                  placeholder="Value title"
                  value={value.title}
                  onChange={(e) =>
                    setValues((prev) =>
                      prev.map((v, idx) =>
                        idx === i ? { ...v, title: e.target.value } : v,
                      ),
                    )
                  }
                  className="admin-input w-full"
                />
                <textarea
                  placeholder="Description"
                  rows={2}
                  value={value.description}
                  onChange={(e) =>
                    setValues((prev) =>
                      prev.map((v, idx) =>
                        idx === i ? { ...v, description: e.target.value } : v,
                      ),
                    )
                  }
                  className="admin-input mt-2 w-full"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-ink">How we hire</h3>
            <button
              type="button"
              className="text-sm font-semibold text-accent hover:text-accent-dark"
              onClick={() => setHiringSteps((prev) => [...prev, emptyStep()])}
            >
              + Add step
            </button>
          </div>
          <div className="mt-3 grid gap-4">
            {hiringSteps.map((step, i) => (
              <div key={i} className="admin-panel p-4">
                <input
                  placeholder="Step title"
                  value={step.title}
                  onChange={(e) =>
                    setHiringSteps((prev) =>
                      prev.map((s, idx) =>
                        idx === i ? { ...s, title: e.target.value } : s,
                      ),
                    )
                  }
                  className="admin-input w-full"
                />
                <textarea
                  placeholder="Step description"
                  rows={2}
                  value={step.description}
                  onChange={(e) =>
                    setHiringSteps((prev) =>
                      prev.map((s, idx) =>
                        idx === i ? { ...s, description: e.target.value } : s,
                      ),
                    )
                  }
                  className="admin-input mt-2 w-full"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel p-4">
          <h3 className="font-display text-lg font-bold text-ink">Empty roles CTA</h3>
          <label className="mt-3 block text-sm font-medium text-ink">
            Message
            <textarea
              rows={2}
              value={emptyCta.message}
              onChange={(e) => setEmptyCta((c) => ({ ...c, message: e.target.value }))}
              className="admin-input mt-1.5 w-full"
            />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium text-ink">
              Button label
              <input
                value={emptyCta.label}
                onChange={(e) => setEmptyCta((c) => ({ ...c, label: e.target.value }))}
                className="admin-input mt-1.5 w-full"
              />
            </label>
            <label className="text-sm font-medium text-ink">
              Button href
              <input
                value={emptyCta.href}
                onChange={(e) => setEmptyCta((c) => ({ ...c, href: e.target.value }))}
                className="admin-input mt-1.5 w-full"
              />
            </label>
          </div>
        </section>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          className="w-fit rounded-xl bg-accent px-6 py-3 font-semibold text-ink transition-colors hover:bg-accent-emphasis"
        >
          Save culture content
        </button>
      </form>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
