import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BRAND, NAV_CTA, NAV_LINKS } from '../data/site';
import { MEGA_COLUMNS, MEGA_PILLS } from '../data/navigation';
import { SERVICE_CATEGORIES } from '../data/services';
import { AppIcon } from '../components/AppIcon';
import { Logo } from '../components/Logo';

export function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    const path = href.split('#')[0] || '/';
    return location.pathname === path;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
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
    setMegaOpen(false);
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  const closeMega = useCallback(() => setMegaOpen(false), []);

  const handleMegaEnter = () => setMegaOpen(true);
  const handleMegaLeave = () => setMegaOpen(false);

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

  const ctaOutlineClass = scrolled
    ? 'font-body text-xs xl:text-sm-plus font-medium px-3 xl:px-4 py-2 rounded-pill border transition-colors duration-normal whitespace-nowrap text-overlay-white-55 border-overlay-white-16 hover:border-white hover:text-white'
    : 'font-body text-xs xl:text-sm-plus font-medium px-3 xl:px-4 py-2 rounded-pill border transition-colors duration-normal whitespace-nowrap text-muted border-border hover:border-ink hover:text-ink';

  const ctaGhostClass = scrolled
    ? 'font-body text-xs xl:text-sm-plus font-medium px-3 xl:px-4 py-2 rounded-pill transition-colors duration-normal whitespace-nowrap text-accent hover:bg-accent/10'
    : 'font-body text-xs xl:text-sm-plus font-medium px-3 xl:px-4 py-2 rounded-pill transition-colors duration-normal whitespace-nowrap text-accent-dark hover:bg-accent/10';

  const ctaPrimaryClass = scrolled
    ? 'font-body text-xs xl:text-sm-plus font-semibold px-3 xl:px-5 py-2.5 rounded-pill transition-colors duration-normal whitespace-nowrap bg-accent text-ink hover:bg-white'
    : 'font-body text-xs xl:text-sm-plus font-semibold px-3 xl:px-5 py-2.5 rounded-pill transition-colors duration-normal whitespace-nowrap bg-ink text-white hover:bg-accent hover:text-ink';

  const navClasses = scrolled
    ? 'top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-container-nav-float rounded-pill bg-overlay-ink-92 border border-overlay-nav-floated-border px-6 shadow-nav-floated max-md:top-0 max-md:left-0 max-md:translate-x-0 max-md:w-full max-md:rounded-none max-md:px-nav-x-mobile max-md:max-w-full'
    : 'top-0 left-0 right-0 w-full px-nav-x bg-overlay-nav-bg-solid border-b border-overlay-nav-border';

  const headerLayoutClass = scrolled
    ? 'flex items-center h-[72px]'
    : 'flex flex-col h-[116px]';

  const megaTopClass = scrolled ? 'top-[96px]' : 'top-[116px]';

  const ctaClass = (variant: (typeof NAV_CTA)[number]['variant']) => {
    if (variant === 'outline') return ctaOutlineClass;
    if (variant === 'ghost') return ctaGhostClass;
    return ctaPrimaryClass;
  };

  const renderCta = (cta: (typeof NAV_CTA)[number], onNavigate?: () => void) => {
    const className = ctaClass(cta.variant);
    if ('external' in cta && cta.external) {
      return (
        <a
          key={cta.label}
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          onClick={onNavigate}
        >
          {cta.label}
        </a>
      );
    }

    if (cta.href.startsWith('/#')) {
      return (
        <a key={cta.label} href={cta.href} className={className} onClick={onNavigate}>
          {cta.label}
        </a>
      );
    }

    return (
      <Link key={cta.label} to={cta.href} className={className} onClick={onNavigate}>
        {cta.label}
      </Link>
    );
  };

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
              aria-label={`${BRAND.name} home`}
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
            className="hidden lg:flex items-center justify-center shrink-0"
            aria-label="Primary"
          >
            <ul
              className="flex items-center gap-0.5 list-none m-0 p-0"
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
            >
              {NAV_LINKS.map((link) => (
                <li key={link.label} className="m-0 p-0">
                  {'hasMega' in link && link.hasMega ? (
                    <button
                      type="button"
                      className={`${isActive(link.href) ? navItemActiveClass : navItemClass} cursor-pointer bg-transparent border-0 inline-flex items-center gap-1`}
                      aria-expanded={megaOpen}
                      aria-haspopup="true"
                      onClick={() => setMegaOpen((value) => !value)}
                    >
                      {link.label}
                      <span className={`text-[10px] transition-transform duration-normal ${megaOpen ? 'rotate-180' : ''}`}>
                        ↓
                      </span>
                    </button>
                  ) : 'isLabs' in link && link.isLabs ? (
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

          <div className="flex flex-1 items-center justify-end gap-2 min-w-0 xl:gap-3">
            <div className="hidden md:flex items-center gap-2 xl:gap-3">
              {NAV_CTA.map((cta) => renderCta(cta))}
            </div>

            <button
              type="button"
              className="lg:hidden flex flex-col gap-[5px] p-2 bg-transparent border-0 cursor-pointer shrink-0"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
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
          <div className="hidden lg:flex w-full max-w-container mx-auto h-nav-category items-center shrink-0 border-t border-overlay-nav-border overflow-x-auto">
            <div className="flex items-center gap-5 h-full px-1 min-w-max mx-auto">
              {SERVICE_CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  to={`/services#${category.id}`}
                  className="relative font-body text-[12.5px] font-medium text-muted hover:text-ink transition-colors duration-normal whitespace-nowrap flex items-center h-full px-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-medium after:ease-smooth"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <div
        className={`fixed left-1/2 -translate-x-1/2 w-[min(1280px,calc(100vw-32px))] z-[9000] bg-white border border-black/[0.09] rounded-mega shadow-mega overflow-hidden transition-all duration-slow ease-smooth ${megaOpen ? 'opacity-100 pointer-events-auto translate-y-0 scale-100' : 'opacity-0 pointer-events-none translate-y-3 scale-[0.97]'} ${megaTopClass}`}
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
                drives <em className="not-italic text-accent">growth</em>
              </div>
              <p className="text-sm text-muted leading-body mb-3">
                Seven connected service categories — from AI and automation to branding, design,
                web, product, finance, and creative.
              </p>
              <Link
                to="/labs"
                className="inline-flex items-center gap-2 text-sm font-extrabold bg-ink text-white px-5 py-3 rounded-pill transition-all duration-medium hover:bg-dark-elevated hover:-translate-y-px shadow-mega-cta"
                onClick={closeMega}
              >
                <AppIcon name="FlaskConical" className="w-4 h-4" />
                Peraspera Labs →
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-6 bg-white/60 rounded-xl px-3 py-2.5 border border-black/[0.06]">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0 animate-pulse" />
              <div className="text-2xs text-overlay-ink-55 leading-snug">
                <strong className="text-ink font-bold">48hr</strong> first delivery guarantee
              </div>
            </div>
          </div>

          <div className="p-3 md:p-4 grid grid-cols-2 lg:grid-cols-3 auto-rows-min gap-0 relative max-h-[min(72vh,680px)] overflow-y-auto">
            {MEGA_COLUMNS.map((col, index) => (
              <div
                key={col.id}
                className={`p-2.5 md:p-3 border-b border-r border-black/[0.05] ${(index + 1) % 3 === 0 ? 'lg:border-r-0' : ''} ${(index + 1) % 2 === 0 ? 'max-lg:border-r-0' : ''} ${index >= 6 ? 'lg:border-b-0' : ''} ${index >= 5 ? 'max-lg:border-b-0' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${col.iconClass}`}
                  >
                    <AppIcon name={col.icon} className="w-3.5 h-3.5 text-ink" />
                  </div>
                  <Link
                    to={`/services#${col.id}`}
                    className="font-display text-[13px] font-extrabold text-ink leading-tight hover:text-accent transition-colors"
                    onClick={closeMega}
                  >
                    {col.title}
                  </Link>
                </div>
                <div className="max-h-[220px] overflow-y-auto pr-1">
                  {col.links.map((link) => (
                    <Link
                      key={link.label}
                      to={`/services#${col.id}`}
                      className="flex items-center gap-2 py-1 px-1 rounded-lg text-[12.5px] text-muted hover:bg-black/[0.04] hover:text-ink transition-colors duration-fast"
                      onClick={closeMega}
                    >
                      <span className="w-4 flex items-center justify-center shrink-0 text-accent-dark">
                        <AppIcon name={link.icon} className="w-3 h-3" />
                      </span>
                      <span className="flex-1 leading-snug">{link.label}</span>
                      {link.isNew ? (
                        <span className="text-[9px] font-black uppercase bg-accent text-ink px-1 py-0.5 rounded-md shrink-0">
                          NEW
                        </span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="col-span-2 lg:col-span-3 flex flex-wrap items-center gap-2 px-2 md:px-3 py-3 border-t border-black/[0.05] sticky bottom-0 bg-white">
              <span className="text-2xs text-muted-light font-semibold uppercase tracking-wide mr-1">
                Popular:
              </span>
              {MEGA_PILLS.map((pill) => (
                <Link
                  key={pill}
                  to="/services"
                  className="text-xs font-semibold border border-border rounded-pill px-3 py-1.5 text-muted hover:bg-ink hover:border-ink hover:text-accent transition-colors duration-normal"
                  onClick={closeMega}
                >
                  {pill}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-[850] bg-white lg:hidden overflow-y-auto pt-nav-height px-nav-x-mobile pb-10"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <Link
            to="/"
            className="font-display text-3xl font-bold text-ink block py-4 border-b border-border"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/services"
            className="font-display text-3xl font-bold text-ink block py-4 border-b border-border"
            onClick={() => setMobileOpen(false)}
          >
            Services
          </Link>
          {NAV_LINKS.filter(
            (link) => !('hasMega' in link && link.hasMega) && link.label !== 'Home',
          ).map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`font-display text-3xl font-bold block py-4 border-b border-border ${'isLabs' in link && link.isLabs ? 'text-accent-dark flex items-center gap-2' : 'text-ink'}`}
              onClick={() => setMobileOpen(false)}
            >
              {'isLabs' in link && link.isLabs ? (
                <AppIcon name="FlaskConical" className="w-7 h-7" />
              ) : null}
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-8">
            {NAV_CTA.map((cta) => renderCta(cta, () => setMobileOpen(false)))}
          </div>
        </div>
      ) : null}
    </>
  );
}
