import { BRAND } from '../data/site';

const FOOTER_TAGLINE = [
  'AI & Automation',
  'Branding & Creative',
  'UI / UX Design',
  'Web & Development',
  'SaaS & Product',
  'Finance',
] as const;

const SOCIALS = [
  { label: 'Facebook', icon: 'f' },
  { label: 'LinkedIn', icon: 'in' },
  { label: 'YouTube', icon: '▶' },
  { label: 'X', icon: '𝕏' },
  { label: 'Instagram', icon: 'Ig' },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1c1210] via-ink to-black"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-accent/12 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/8 blur-[160px]"
        aria-hidden="true"
      />

      <div className="relative z-[1] px-nav-x pb-10 pt-16 max-md:px-nav-x-mobile">
        <div className="mx-auto mb-14 flex max-w-container flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="max-w-md font-body text-sm leading-relaxed text-overlay-footer-text-35">
            © 2026 <strong className="text-white">{BRAND.legalName}</strong>
            <br />
            Crafting premium digital experiences. All Rights Reserved.
          </p>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-overlay-footer-text-40 md:text-right md:text-xs">
            {FOOTER_TAGLINE.join(' • ')}
          </p>
        </div>

        <div className="mx-auto max-w-container overflow-hidden pb-2 pt-4 text-center">
          <a
            href="/"
            className="inline-block font-display text-[clamp(4rem,18vw,14rem)] font-extrabold leading-[0.86] tracking-tighter text-white transition-opacity duration-medium hover:opacity-90"
            aria-label={`${BRAND.name} home`}
          >
            perasper<span className="text-accent">a.</span>
          </a>
        </div>

        <div className="mx-auto mt-10 flex max-w-container flex-col items-center justify-between gap-6 border-t border-overlay-footer-border-07 pt-8 md:flex-row">
          <a
            href={`mailto:${BRAND.email}`}
            className="font-body text-sm text-overlay-footer-text-35 transition-colors duration-normal hover:text-accent"
          >
            {BRAND.email}
          </a>

          <div className="flex gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-overlay-footer-border-10 text-sm text-white transition-colors duration-normal hover:bg-accent hover:text-ink"
              >
                {social.icon}
              </a>
            ))}
          </div>

          <a
            href="/#contact"
            className="font-body text-sm font-semibold text-overlay-footer-text-35 transition-colors duration-normal hover:text-white"
          >
            Get in touch →
          </a>
        </div>
      </div>
    </footer>
  );
}
