import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  SERVICE_OPTIONS,
} from '../data/content-extended';
import { BRAND } from '../data/site';
import type { AppIconName } from '../components/AppIcon';
import { AppIcon } from '../components/AppIcon';
import { Container } from '../components/Container';
import { Logo } from '../components/Logo';
import { Reveal } from '../components/Reveal';

interface CustomSelectProps {
  label: string;
  required?: boolean;
  placeholder: string;
  options: readonly { icon?: AppIconName; label: string }[] | readonly string[];
  value: string;
  onChange: (value: string) => void;
}

function CustomSelect({
  label,
  required,
  placeholder,
  options,
  value,
  onChange,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const normalized = options.map((opt) =>
    typeof opt === 'string' ? { label: opt } : opt,
  );

  return (
    <div className="flex flex-col gap-2 mb-5 relative" ref={ref}>
      <label className="text-sm-plus font-bold text-ink">
        {label} {required && '*'}
      </label>
      <button
        type="button"
        className={`flex items-center justify-between border-0 border-b-[1.5px] py-2.5 font-body text-md bg-transparent cursor-pointer transition-colors duration-normal w-full text-left ${value ? 'border-ink text-ink' : 'border-border text-placeholder'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{value || placeholder}</span>
        <span
          className={`text-xs text-muted-light transition-transform duration-medium ${open ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-dropdown shadow-dropdown z-[99] p-2.5 list-none"
        >
          {normalized.map((opt) => (
            <li key={opt.label}>
              <button
                type="button"
                role="option"
                aria-selected={value === opt.label}
                className={`flex items-center gap-3 w-full p-3 rounded-option text-base text-left transition-colors duration-fast font-body ${value === opt.label ? 'bg-accent text-ink font-bold' : 'text-select-text hover:bg-select-hover-bg'}`}
                onClick={() => {
                  onChange(opt.label);
                  setOpen(false);
                }}
              >
                {'icon' in opt && opt.icon && (
                  <span className="w-[34px] h-[34px] rounded-lg bg-select-icon-bg flex items-center justify-center shrink-0">
                    <AppIcon name={opt.icon} className="w-4 h-4 text-accent-dark" />
                  </span>
                )}
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ContactForm() {
  const [service, setService] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="bg-contact-bg py-padding-contact-y px-nav-x max-md:py-padding-contact-y-mobile max-md:px-nav-x-mobile"
    >
      <Container className="max-w-container-contact">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-gap-contact items-start">
          <Reveal>
            <div>
              <h2 className="font-display text-section-contact font-extrabold leading-tight tracking-tight text-ink">
                Have a project idea in mind? Let&apos;s get started.
              </h2>
              <p className="text-md text-contact-text leading-body-2xl mt-5 max-w-[340px]">
                Tell us about your project. We&apos;ll schedule a discovery call, share a tailored
                proposal, and move fast once you&apos;re ready to begin.
              </p>
              <div className="flex items-center gap-4 mt-10 bg-white rounded-4xl py-[18px] px-[22px] w-fit">
                <div className="w-14 h-14 rounded-xl bg-contact-avatar-bg flex items-center justify-center p-2">
                  <Logo variant="primary" className="h-full w-full max-w-none" />
                </div>
                <div>
                  <p className="font-display font-extrabold text-md text-ink">{BRAND.contact.name}</p>
                  <p className="text-sm-plus text-contact-role mt-0.5">{BRAND.contact.role}</p>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="mt-1 inline-block text-sm font-semibold text-ink transition-colors hover:text-accent"
                  >
                    {BRAND.email}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-white rounded-8xl p-padding-form max-md:p-padding-form-mobile">
              {submitted ? (
                <p className="text-center text-lg text-muted py-10" role="status">
                  Thank you! Your inquiry has been received. We&apos;ll be in touch shortly.
                </p>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="fullName" className="text-sm-plus font-bold text-ink">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        className="border-0 border-b-[1.5px] border-border py-2.5 font-body text-md text-ink bg-transparent outline-none transition-colors duration-normal w-full focus:border-ink placeholder:text-placeholder"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="company" className="text-sm-plus font-bold text-ink">
                        Company name
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        className="border-0 border-b-[1.5px] border-border py-2.5 font-body text-md text-ink bg-transparent outline-none transition-colors duration-normal w-full focus:border-ink placeholder:text-placeholder"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-5">
                    <label htmlFor="email" className="text-sm-plus font-bold text-ink">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="border-0 border-b-[1.5px] border-border py-2.5 font-body text-md text-ink bg-transparent outline-none transition-colors duration-normal w-full focus:border-ink placeholder:text-placeholder"
                    />
                  </div>

                  <CustomSelect
                    label="Service required"
                    required
                    placeholder="Select Your Service ▼"
                    options={SERVICE_OPTIONS}
                    value={service}
                    onChange={setService}
                  />

                  <div className="flex flex-col gap-2 mb-5">
                    <label htmlFor="details" className="text-sm-plus font-bold text-ink">
                      Project details *
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      required
                      rows={4}
                      className="border-0 border-b-[1.5px] border-border py-2.5 font-body text-md text-ink bg-transparent outline-none transition-colors duration-normal w-full focus:border-ink placeholder:text-placeholder resize-y min-h-[90px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="block w-full py-[18px] rounded-pill bg-ink text-white font-display text-md-plus font-extrabold border-0 cursor-pointer transition-all duration-medium mt-2 hover:bg-accent hover:text-ink"
                  >
                    Send Inquiry
                  </button>

                  <p className="text-center mt-4 text-sm-plus text-muted-light">
                    Prefer email?{' '}
                    <a
                      href={`mailto:${BRAND.email}`}
                      className="text-ink font-bold underline transition-colors hover:text-accent"
                    >
                      {BRAND.email}
                    </a>
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
