import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BRAND, NAV_LINKS } from '../data/site';
import { AppIcon } from '../components/AppIcon';
import { Logo } from '../components/Logo';

const WHATSAPP_LINK = `${BRAND.whatsapp.href}?text=${encodeURIComponent('Hi Peraspera — I would like to speak with your team.')}`;

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => location.pathname === href.split('#')[0];

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
      <div className="pointer-events-none fixed inset-x-0 top-6 z-[800] px-4 md:px-6">
        <header className="pointer-events-auto mx-auto w-full max-w-screen-2xl overflow-visible rounded-[24px] border border-white/10 bg-ink/78 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:rounded-[30px]">
          <nav
            className="relative flex h-20 items-center justify-between px-6 lg:px-12"
            aria-label="Main navigation"
          >
            <Link
              to="/"
              className="z-10 inline-flex shrink-0 transition-transform duration-normal hover:scale-105"
              aria-label={`${BRAND.name} home`}
            >
              <span className="relative flex h-10 w-[min(42vw,160px)] items-center overflow-hidden md:h-12 md:w-[190px]">
                <Logo
                  variant="primary"
                  inverted
                  className="absolute left-0 top-1/2 h-[120px] w-auto max-w-none -translate-y-1/2"
                />
              </span>
            </Link>

            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex lg:gap-10">
              {NAV_LINKS.map((link) => (
                <div key={link.label} className="relative py-6">
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={link.href}
                      className={`font-body text-[15px] font-medium uppercase tracking-[0.14em] transition-colors duration-normal ${
                        isActive(link.href) ? 'text-white' : 'text-accent hover:text-white'
                      }`}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                    {'showChevron' in link && link.showChevron ? (
                      <AppIcon name="ChevronDown" className="h-3.5 w-3.5 text-accent/70" strokeWidth={2.25} />
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
                className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-ink shadow-[0_0_20px_rgba(254,163,39,0.4)] transition-transform duration-normal hover:scale-110"
              >
                <span className="absolute inset-0 rounded-full bg-accent/30" aria-hidden="true" />
                <AppIcon name="Phone" className="relative z-[1] h-[22px] w-[22px]" strokeWidth={2.25} />
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
          className="fixed inset-0 z-[850] overflow-y-auto bg-ink px-nav-x-mobile pb-10 pt-[7.5rem] md:hidden"
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
