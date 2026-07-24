import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BRAND, NAV_LINKS } from '../data/site';
import { AppIcon } from '../components/AppIcon';
import { Logo } from '../components/Logo';

const WHATSAPP_LINK = `${BRAND.whatsapp.href}?text=${encodeURIComponent('Hi Peraspera — I would like to speak with your team.')}`;

const pillShell =
  'pointer-events-auto mx-auto overflow-hidden rounded-[28px] border border-white/10 bg-ink/78 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-card ease-smooth md:rounded-[34px]';

export function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => location.pathname === href.split('#')[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-5 z-[800] px-4 md:top-6 md:px-6">
        <header
          className={`${pillShell} ${
            scrolled
              ? 'w-full max-w-container-nav-float'
              : 'w-[calc(100%-8px)] max-w-[min(100%,1420px)] md:w-[calc(100%-16px)]'
          }`}
        >
          <nav
            className={`relative flex items-center justify-between transition-all duration-card ease-smooth ${
              scrolled ? 'h-[72px] px-5 lg:px-8' : 'h-[88px] px-6 md:h-[92px] lg:px-10'
            }`}
            aria-label="Main navigation"
          >
            <Link
              to="/"
              className="z-10 inline-flex shrink-0 transition-transform duration-normal hover:scale-105"
              aria-label={`${BRAND.name} home`}
            >
              <span
                className={`relative flex items-center overflow-hidden transition-all duration-card ease-smooth ${
                  scrolled
                    ? 'h-10 w-[min(42vw,160px)] md:h-11 md:w-[180px]'
                    : 'h-14 w-[min(48vw,200px)] md:h-16 md:w-[240px]'
                }`}
              >
                <Logo
                  variant="primary"
                  inverted
                  className={`absolute left-0 top-1/2 w-auto max-w-none -translate-y-1/2 transition-all duration-card ease-smooth ${
                    scrolled ? 'h-[120px]' : 'h-[180px] md:h-[200px]'
                  }`}
                />
              </span>
            </Link>

            <div
              className={`absolute left-1/2 hidden -translate-x-1/2 items-center transition-all duration-card ease-smooth md:flex ${
                scrolled ? 'gap-6 lg:gap-7' : 'gap-8 lg:gap-10'
              }`}
            >
              {NAV_LINKS.map((link) => (
                <div key={link.label} className={`relative transition-all duration-card ${scrolled ? 'py-3' : 'py-5'}`}>
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={link.href}
                      className={`font-body font-medium uppercase transition-all duration-card ease-smooth ${
                        scrolled
                          ? 'text-[13px] tracking-[0.12em]'
                          : 'text-[15px] tracking-[0.14em] md:text-base'
                      } ${isActive(link.href) ? 'text-white' : 'text-accent hover:text-white'}`}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                    {'showChevron' in link && link.showChevron ? (
                      <AppIcon
                        name="ChevronDown"
                        className={`text-accent/70 transition-all duration-card ${scrolled ? 'h-3 w-3' : 'h-3.5 w-3.5'}`}
                        strokeWidth={2.25}
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="z-10 hidden items-center md:flex">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Call Peraspera on WhatsApp"
                className={`group relative flex items-center justify-center rounded-full bg-accent text-ink shadow-[0_0_20px_rgba(254,163,39,0.4)] transition-all duration-card ease-smooth hover:scale-110 ${
                  scrolled ? 'h-11 w-11' : 'h-14 w-14 md:h-[58px] md:w-[58px]'
                }`}
              >
                <span className="absolute inset-0 rounded-full bg-accent/30" aria-hidden="true" />
                <AppIcon
                  name="Phone"
                  className={`relative z-[1] transition-all duration-card ${scrolled ? 'h-5 w-5' : 'h-[22px] w-[22px]'}`}
                  strokeWidth={2.25}
                />
              </a>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white/5 p-3 text-white transition-transform duration-normal active:scale-90 md:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
            >
              <span className="flex flex-col gap-[5px]">
                <span
                  className={`block h-[1.5px] w-[22px] bg-white transition-all duration-card ${mobileOpen ? 'translate-y-[6.5px] rotate-45' : ''}`}
                />
                <span
                  className={`block h-[1.5px] w-[22px] bg-white transition-all duration-card ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`}
                />
                <span
                  className={`block h-[1.5px] w-[22px] bg-white transition-all duration-card ${mobileOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`}
                />
              </span>
            </button>
          </nav>
        </header>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-[850] overflow-y-auto bg-ink px-nav-x-mobile pb-10 pt-[8.5rem] md:hidden"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`font-display block border-b border-white/10 py-4 text-3xl font-bold uppercase tracking-wide ${
                isActive(link.href) ? 'text-white' : 'text-accent'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-8 flex flex-col gap-3">
            <a
              href="/#contact"
              className="rounded-pill border border-white/15 px-5 py-3 text-center font-body text-sm-plus font-medium text-white/80"
              onClick={() => setMobileOpen(false)}
            >
              Book a meeting
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-pill bg-accent px-5 py-3 text-center font-body text-sm-plus font-semibold text-ink"
              onClick={() => setMobileOpen(false)}
            >
              Live call agent
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
