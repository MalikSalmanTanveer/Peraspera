import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../data/site';
import { AppIcon } from '../components/AppIcon';
import { Logo } from '../components/Logo';

export function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => location.pathname === href;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navItemClass = scrolled
    ? 'font-body text-sm-plus font-normal px-2.5 py-2 rounded-md transition-colors duration-normal text-overlay-white-55 hover:text-white hover:bg-overlay-white-08 whitespace-nowrap'
    : 'font-body text-sm-plus font-normal px-2.5 py-2 rounded-md transition-colors duration-normal text-muted hover:text-ink hover:bg-black/5 whitespace-nowrap';

  const navItemActiveClass = scrolled
    ? 'font-body text-sm-plus font-semibold px-2.5 py-2 rounded-md transition-colors duration-normal text-white bg-overlay-white-08 whitespace-nowrap'
    : 'font-body text-sm-plus font-semibold px-2.5 py-2 rounded-md transition-colors duration-normal text-ink bg-black/5 whitespace-nowrap';

  const labsLinkClass = scrolled
    ? 'inline-flex items-center gap-1.5 font-body text-sm-plus font-semibold px-2.5 py-2 rounded-md transition-colors duration-normal text-accent hover:text-white border border-dashed border-accent/45 hover:border-accent whitespace-nowrap'
    : 'inline-flex items-center gap-1.5 font-body text-sm-plus font-semibold px-2.5 py-2 rounded-md transition-colors duration-normal text-accent-dark hover:text-ink border border-dashed border-accent/50 hover:border-accent-dark whitespace-nowrap';

  const labsLinkActiveClass = scrolled
    ? 'inline-flex items-center gap-1.5 font-body text-sm-plus font-semibold px-2.5 py-2 rounded-md transition-colors duration-normal text-white bg-accent/15 border border-accent whitespace-nowrap'
    : 'inline-flex items-center gap-1.5 font-body text-sm-plus font-semibold px-2.5 py-2 rounded-md transition-colors duration-normal text-ink bg-accent/10 border border-accent whitespace-nowrap';

  const navClasses = scrolled
    ? 'top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-container-nav-float rounded-pill bg-overlay-ink-92 border border-overlay-nav-floated-border px-6 shadow-nav-floated max-md:top-0 max-md:left-0 max-md:translate-x-0 max-md:w-full max-md:rounded-none max-md:px-nav-x-mobile max-md:max-w-full'
    : 'top-0 left-0 right-0 w-full px-nav-x bg-overlay-nav-bg-solid border-b border-overlay-nav-border';

  const headerLayoutClass = 'flex items-center h-[72px]';

  return (
    <>
      <header
        className={`fixed z-[800] transition-all duration-card ${headerLayoutClass} ${navClasses}`}
      >
        <div className="flex items-center w-full max-w-container mx-auto h-[72px] shrink-0">
          <div className="flex flex-1 items-center justify-start min-w-0">
            <Link
              to="/"
              className="inline-flex shrink-0 items-center"
              aria-label="Peraspera home"
            >
              <span className="relative flex h-[56px] md:h-[64px] w-[min(58vw,240px)] md:w-[300px] shrink-0 items-center overflow-hidden">
                <Logo
                  variant="primary"
                  inverted={scrolled}
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[220px] w-auto max-w-none"
                />
              </span>
            </Link>
          </div>

          <nav
            className="hidden md:flex items-center justify-center shrink-0"
            aria-label="Primary"
          >
            <ul className="flex items-center gap-0.5 list-none m-0 p-0">
              {NAV_LINKS.map((link) => (
                <li key={link.label} className="m-0 p-0">
                  {'isLabs' in link && link.isLabs ? (
                    <Link
                      to={link.href}
                      className={isActive(link.href) ? labsLinkActiveClass : labsLinkClass}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                    >
                      <AppIcon name="FlaskConical" className="w-3.5 h-3.5" />
                      {link.label}
                    </Link>
                  ) : (
                    <Link
                      to={link.href}
                      className={isActive(link.href) ? navItemActiveClass : navItemClass}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-3 min-w-0">
            <div className="hidden md:flex items-center gap-3">
              <a
                href="/#contact"
                className={`font-body text-sm-plus font-medium px-4 py-2 rounded-pill border transition-colors duration-normal whitespace-nowrap ${scrolled ? 'text-overlay-white-55 border-overlay-white-16 hover:border-white hover:text-white' : 'text-muted border-border hover:border-ink hover:text-ink'}`}
              >
                Client Login
              </a>
              <a
                href="/#contact"
                className={`font-body text-sm-plus font-medium px-5 py-2.5 rounded-pill transition-colors duration-normal whitespace-nowrap ${scrolled ? 'bg-accent text-ink hover:bg-white' : 'bg-ink text-white hover:bg-accent hover:text-ink'}`}
              >
                Get Started →
              </a>
            </div>

            <button
              type="button"
              className="md:hidden flex flex-col gap-[5px] p-2 bg-transparent border-0 cursor-pointer shrink-0"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span
                className={`block w-[22px] h-[1.5px] transition-all duration-card ${scrolled || mobileOpen ? 'bg-white' : 'bg-ink'} ${mobileOpen ? 'translate-y-[6.5px] rotate-45' : ''}`}
              />
              <span
                className={`block w-[22px] h-[1.5px] transition-all duration-card ${scrolled || mobileOpen ? 'bg-white' : 'bg-ink'} ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`}
              />
              <span
                className={`block w-[22px] h-[1.5px] transition-all duration-card ${scrolled || mobileOpen ? 'bg-white' : 'bg-ink'} ${mobileOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`}
              />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[850] bg-white md:hidden overflow-y-auto pt-nav-height px-nav-x-mobile pb-10"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`font-display text-3xl font-bold block py-4 border-b border-border ${'isLabs' in link && link.isLabs ? 'text-accent-dark flex items-center gap-2' : 'text-ink'}`}
              onClick={() => setMobileOpen(false)}
            >
              {'isLabs' in link && link.isLabs && (
                <AppIcon name="FlaskConical" className="w-7 h-7" />
              )}
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-8">
            <a
              href="/#contact"
              className="text-center font-body text-sm-plus font-medium px-4 py-3 rounded-pill border border-border text-muted"
              onClick={() => setMobileOpen(false)}
            >
              Client Login
            </a>
            <a
              href="/#contact"
              className="text-center font-body text-sm-plus font-medium px-5 py-3 rounded-pill bg-ink text-white"
              onClick={() => setMobileOpen(false)}
            >
              Get Started →
            </a>
          </div>
        </div>
      )}
    </>
  );
}
