import { BRAND } from '../data/site';
import { AppIcon } from '../components/AppIcon';
import { Container } from '../components/Container';
import { Logo } from '../components/Logo';

const FOOTER_SERVICES = [
  'UI/UX Design',
  'Brand Identity',
  'Web Design & Development',
  'SaaS Development',
  'AI Automation',
  'AI Video & Content',
  'Motion Design',
  'App Development',
  'MVP Development',
] as const;

const FOOTER_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
  { label: 'Peraspera Labs', href: '#peraspera-labs', labs: true },
  { label: 'Careers', href: '#contact' },
  { label: 'Blog', href: '#contact' },
  { label: 'Privacy Policy', href: '#contact' },
  { label: 'Terms & Conditions', href: '#contact' },
] as const;

const FOOTER_REVIEWS = ['Clutch', 'Good Firms', 'Design Rush', 'Behance', 'Dribbble', 'Webflow'] as const;

const OFFICES = [
  { city: 'USA', address: '451 W 42nd St, New York, NY 10036, United States', phone: '+1 555 010 2000' },
  { city: 'Dubai', address: 'Al Barsha 2, Dubai 25315, United Arab Emirates', phone: '+971 55 010 2000' },
  { city: 'Berlin', address: 'Dresdener Str. 18, 10999 Berlin, Germany', phone: '+49 30 010 2000' },
  { city: 'Canada', address: 'Montréal, QC H1E 4B3, Canada', phone: '+1 514 010 2000' },
  { city: 'London', address: '15 Oakley St, London SW3 5NN, United Kingdom', phone: '+44 7367 010 200' },
  { city: 'Pakistan Office', address: 'Gulberg III, Lahore, Pakistan', phone: '+92 321 010 2000' },
] as const;

export function Footer() {
  return (
    <footer className="bg-ink text-white overflow-hidden">
      <Container wide className="px-nav-x pt-14 pb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 max-md:px-nav-x-mobile max-md:pt-14 max-md:pb-10">
        <div className="md:col-span-2 xl:col-span-1">
          <a href="#" className="inline-block mb-3.5" aria-label={`${BRAND.name} home`}>
            <Logo variant="primary" inverted className="h-9 w-auto max-w-[200px]" />
          </a>
          <p className="font-body text-[13.5px] text-overlay-footer-text-35 leading-body max-w-[220px] mb-7">
            {BRAND.tagline}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center bg-accent text-ink font-display text-sm-plus font-extrabold px-5 py-3 rounded-pill transition-all duration-medium hover:bg-white hover:-translate-y-0.5"
          >
            Contact us now →
          </a>
        </div>

        <div>
          <h3 className="font-display text-xs font-extrabold uppercase tracking-footer-col text-overlay-footer-text-35 mb-4 pb-0 border-0">
            Services
          </h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {FOOTER_SERVICES.map((item) => (
              <li key={item}>
                <a
                  href="#services"
                  className="font-body text-sm-plus text-overlay-footer-text-35 hover:text-white transition-colors duration-normal"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xs font-extrabold uppercase tracking-footer-col text-overlay-footer-text-35 mb-4">
            Quick Links
          </h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {FOOTER_LINKS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`font-body text-sm-plus text-overlay-footer-text-35 hover:text-white transition-colors duration-normal ${'labs' in item && item.labs ? 'inline-flex items-center gap-1.5 hover:text-accent' : ''}`}
                >
                  {'labs' in item && item.labs && <AppIcon name="FlaskConical" className="w-3.5 h-3.5 text-accent" />}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xs font-extrabold uppercase tracking-footer-col text-overlay-footer-text-35 mb-4">
            Reviews
          </h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {FOOTER_REVIEWS.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="font-body text-sm-plus text-overlay-footer-text-35 hover:text-white transition-colors duration-normal"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-overlay-footer-border-07 py-8 flex justify-center overflow-visible px-nav-x max-md:px-nav-x-mobile">
        <Logo
          variant="primary"
          inverted
          className="h-16 md:h-20 w-auto max-w-[min(92vw,720px)] opacity-20"
        />
      </div>

      <div className="mx-nav-x-mobile md:mx-nav-x mb-0 bg-footer-office-bg border border-overlay-footer-border-07 rounded-2xl max-md:mx-nav-x-mobile">
        <Container wide className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-0 px-nav-x py-8 max-md:px-nav-x-mobile max-md:py-7 max-md:gap-8">
          {OFFICES.map((office) => (
            <div key={office.city} className="py-4 px-4 max-md:p-0">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center mb-2.5" aria-hidden="true">
                <AppIcon name="MapPin" className="w-4 h-4 text-accent" />
              </div>
              <h4 className="font-display text-2xl font-extrabold mb-2.5">{office.city}</h4>
              <p className="font-body text-sm text-overlay-footer-text-35 leading-relaxed mb-2.5 max-md:text-sm">
                {office.address}
              </p>
              <a
                href={`tel:${office.phone.replace(/\s/g, '')}`}
                className="font-body text-sm-plus text-white hover:text-accent transition-colors"
              >
                {office.phone}
              </a>
            </div>
          ))}
        </Container>
      </div>

      <Container
        wide
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-nav-x py-8 max-md:px-nav-x-mobile"
      >
        <a
          href="#"
          className="flex items-center gap-3 border border-overlay-footer-border-07 rounded-2xl px-4 py-3 hover:border-accent hover:bg-accent/5 transition-colors duration-normal"
        >
          <span className="w-11 h-11 rounded-full bg-overlay-footer-border-10 flex items-center justify-center">
            <AppIcon name="FileText" className="w-5 h-5 text-accent" />
          </span>
          <span>
            <span className="block font-display text-sm-plus font-bold text-white">
              Company Deck PDF
            </span>
            <span className="block font-body text-xs text-overlay-footer-text-35">3 MB</span>
          </span>
        </a>

        <div className="flex gap-2 max-md:w-full max-md:justify-start max-md:py-5 max-md:border-y max-md:border-overlay-footer-border-10">
          {['f', 'in', '▶', '𝕏', 'Ig'].map((icon) => (
            <a
              key={icon}
              href="#"
              aria-label={`Social link ${icon}`}
              className="w-11 h-11 rounded-full bg-overlay-footer-border-10 flex items-center justify-center text-sm text-white hover:bg-accent hover:text-ink transition-colors duration-normal"
            >
              {icon}
            </a>
          ))}
        </div>

        <p className="font-body text-sm text-overlay-footer-text-22 max-md:w-full">
          © 2025–2026 {BRAND.legalName} | All Rights Reserved.
        </p>
      </Container>
    </footer>
  );
}
