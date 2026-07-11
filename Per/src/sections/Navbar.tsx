import { useEffect, useState, useCallback } from 'react';
import { BRAND, NAV_CATEGORIES, NAV_LINKS } from '../data/site';
import { MEGA_COLUMNS, MEGA_PILLS } from '../data/navigation';
import { AppIcon } from '../components/AppIcon';
import { Logo } from '../components/Logo';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const closeMega = useCallback(() => setMegaOpen(false), []);

  const handleMegaEnter = () => setMegaOpen(true);
  const handleMegaLeave = () => setMegaOpen(false);

  const navItemClass = scrolled
    ? 'font-body text-base font-normal px-3.5 py-2 rounded-md transition-colors duration-normal text-overlay-white-55 hover:text-white hover:bg-overlay-white-08 whitespace-nowrap'
    : 'font-body text-base font-normal px-3.5 py-2 rounded-md transition-colors duration-normal text-muted hover:text-ink hover:bg-black/5 whitespace-nowrap';

  const labsLinkClass = scrolled
    ? 'inline-flex items-center gap-1.5 font-body text-base font-semibold px-3.5 py-2 rounded-md transition-colors duration-normal text-accent hover:text-white border border-dashed border-accent/45 hover:border-accent whitespace-nowrap'
    : 'inline-flex items-center gap-1.5 font-body text-base font-semibold px-3.5 py-2 rounded-md transition-colors duration-normal text-accent-dark hover:text-ink border border-dashed border-accent/50 hover:border-accent-dark whitespace-nowrap';

  const navClasses = scrolled
    ? 'top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-container-nav-float rounded-pill bg-overlay-ink-92 border border-overlay-nav-floated-border px-6 shadow-nav-floated max-md:top-0 max-md:left-0 max-md:translate-x-0 max-md:w-full max-md:rounded-none max-md:px-nav-x-mobile max-md:max-w-full'
    : 'top-0 left-0 right-0 w-full px-nav-x bg-overlay-nav-bg-solid border-b border-overlay-nav-border';

  const headerLayoutClass = scrolled
    ? 'flex items-center h-[72px]'
    : 'flex flex-col h-[116px]';

  const megaTopClass = scrolled ? 'top-[96px]' : 'top-[116px]';

  return (
    <>
      <header
        className={`fixed z-[800] transition-all duration-card ${headerLayoutClass} ${navClasses}`}
      >
        <div className="flex items-center w-full max-w-container mx-auto h-[72px] shrink-0">
          <div className="flex flex-1 items-center justify-start min-w-0">
            <a href="#" className="inline-flex shrink-0" aria-label={`${BRAND.name} home`}>
              <Logo
                variant="navbar"
                inverted={scrolled}
                className="h-9 w-auto max-w-[148px] md:h-10 md:max-w-[160px]"
              />
            </a>
          </div>

          <nav
            className="hidden md:flex items-center justify-center shrink-0"
            aria-label="Primary"
          >
            <ul
              className="flex items-center gap-1 list-none m-0 p-0"
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
            >
              <li className="m-0 p-0">
                <button
                  type="button"
                  className={`${navItemClass} cursor-pointer bg-transparent border-0`}
                  aria-expanded={megaOpen}
                  aria-haspopup="true"
                  onClick={() => setMegaOpen((v) => !v)}
                >
                  Services ↓
                </button>
              </li>
              {NAV_LINKS.map((link) => (
                <li key={link.label} className="m-0 p-0">
                  {'isLabs' in link && link.isLabs ? (
                    <a href={link.href} className={labsLinkClass}>
                      <AppIcon name="FlaskConical" className="w-3.5 h-3.5" />
                      {link.label}
                    </a>
                  ) : (
                    <a href={link.href} className={navItemClass}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-3 min-w-0">
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#contact"
                className={`font-body text-sm-plus font-medium px-4 py-2 rounded-pill border transition-colors duration-normal whitespace-nowrap ${scrolled ? 'text-overlay-white-55 border-overlay-white-16 hover:border-white hover:text-white' : 'text-muted border-border hover:border-ink hover:text-ink'}`}
              >
                Client Login
              </a>
              <a
                href="#contact"
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

        {!scrolled && (
          <div className="hidden md:flex w-full max-w-container mx-auto h-nav-category items-center justify-center border-t border-overlay-nav-border shrink-0">
            <div className="flex items-center gap-7 h-full">
              {NAV_CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href="#services"
                  className="relative font-body text-[13.5px] font-medium text-muted hover:text-ink transition-colors duration-normal whitespace-nowrap flex items-center h-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent-dark after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-medium after:ease-smooth"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <div
        className={`fixed left-1/2 -translate-x-1/2 w-[min(1060px,calc(100vw-48px))] z-[9000] bg-white border border-black/[0.09] rounded-mega shadow-mega overflow-hidden transition-all duration-slow ease-smooth ${megaOpen ? 'opacity-100 pointer-events-auto translate-y-0 scale-100' : 'opacity-0 pointer-events-none translate-y-3 scale-[0.97]'} ${megaTopClass}`}
        onMouseEnter={handleMegaEnter}
        onMouseLeave={handleMegaLeave}
        role="dialog"
        aria-label="Services menu"
        aria-hidden={!megaOpen}
      >
        <div className="grid grid-cols-[190px_1fr] min-h-0">
          <div className="mega-panel-gradient border-r border-black/[0.06] p-[22px_18px] flex flex-col justify-between">
            <div>
              <div className="text-2xs font-black uppercase tracking-widest text-overlay-ink-55 mb-2">
                What we do
              </div>
              <div className="font-display text-2xl font-extrabold leading-tight tracking-snug text-ink mb-2">
                Design that
                <br />
                drives <em className="not-italic text-accent-emphasis">growth</em>
              </div>
              <p className="text-sm text-muted leading-body mb-3">
                One subscription. Every design service your business needs — from brand to build.
              </p>
              <a
                href="#peraspera-labs"
                className="inline-flex items-center gap-2 text-sm font-extrabold bg-ink text-white px-5 py-3 rounded-pill transition-all duration-medium hover:bg-dark-elevated hover:-translate-y-px shadow-mega-cta"
                onClick={closeMega}
              >
                <AppIcon name="FlaskConical" className="w-4 h-4" />
                Peraspera Labs →
              </a>
            </div>
            <div className="flex items-center gap-2 mt-6 bg-white/60 rounded-xl px-3 py-2.5 border border-black/[0.06]">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0 animate-pulse" />
              <div className="text-2xs text-overlay-ink-55 leading-snug">
                <strong className="text-ink font-bold">48hr</strong> first delivery guarantee
              </div>
            </div>
          </div>

          <div className="p-4 grid grid-cols-3 auto-rows-min gap-0 relative">
            {MEGA_COLUMNS.map((col, i) => (
              <div
                key={col.id}
                className={`p-3 border-b border-r border-black/[0.05] ${(i + 1) % 3 === 0 ? 'border-r-0' : ''} ${i >= 6 ? 'border-b-0' : ''}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${col.iconClass}`}
                  >
                    <AppIcon name={col.icon} className="w-3.5 h-3.5 text-ink" />
                  </div>
                  <span className="font-display text-sm font-extrabold text-ink hover:text-accent-dark transition-colors">
                    {col.title}
                  </span>
                </div>
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href="#services"
                    className="flex items-center gap-2 py-1.5 px-1.5 rounded-lg text-sm text-muted hover:bg-black/[0.04] hover:text-ink transition-colors duration-fast"
                    onClick={closeMega}
                  >
                    <span className="w-5 flex items-center justify-center shrink-0 text-accent-dark">
                      <AppIcon name={link.icon} className="w-3.5 h-3.5" />
                    </span>
                    <span className="flex-1">{link.label}</span>
                    {link.isNew && (
                      <span className="text-2xs font-black uppercase bg-accent text-ink px-1.5 py-0.5 rounded-md">
                        NEW
                      </span>
                    )}
                  </a>
                ))}
              </div>
            ))}

            <div className="col-span-3 flex flex-wrap items-center gap-2 px-3 py-3 border-t border-black/[0.05]">
              <span className="text-2xs text-muted-light font-semibold uppercase tracking-wide mr-1">
                Popular:
              </span>
              {MEGA_PILLS.map((pill) => (
                <a
                  key={pill}
                  href="#services"
                  className="text-xs font-semibold border border-border rounded-pill px-3 py-1.5 text-muted hover:bg-ink hover:border-ink hover:text-accent transition-colors duration-normal"
                  onClick={closeMega}
                >
                  {pill}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[850] bg-white md:hidden overflow-y-auto pt-nav-height px-nav-x-mobile pb-10"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <a
            href="#services"
            className="font-display text-3xl font-bold text-ink block py-4 border-b border-border"
            onClick={() => setMobileOpen(false)}
          >
            Services
          </a>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`font-display text-3xl font-bold block py-4 border-b border-border ${'isLabs' in link && link.isLabs ? 'text-accent-dark flex items-center gap-2' : 'text-ink'}`}
              onClick={() => setMobileOpen(false)}
            >
              {'isLabs' in link && link.isLabs && (
                <AppIcon name="FlaskConical" className="w-7 h-7" />
              )}
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-8">
            <a
              href="#contact"
              className="text-center font-body text-sm-plus font-medium px-4 py-3 rounded-pill border border-border text-muted"
              onClick={() => setMobileOpen(false)}
            >
              Client Login
            </a>
            <a
              href="#contact"
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
